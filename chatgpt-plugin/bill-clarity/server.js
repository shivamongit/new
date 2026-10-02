import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { screenBillText } from "./src/red-flags.js";
import { assessPatientRights } from "./src/patient-rights.js";
import {
  explainTerm,
  insuranceAppealChecklist,
  itemizedBillRequestLetter,
} from "./src/letters.js";

const widgetHtml = readFileSync(new URL("./public/bill-checklist-widget.html", import.meta.url), "utf8");

const screenBillSchema = {
  billText: z.string().min(20).describe("Pasted hospital bill, EOB, or collection notice text"),
};

const rightsSchema = {
  hasInsurance: z.boolean().nullable().optional(),
  careType: z.enum(["emergency", "in_network_facility", "scheduled", "unknown"]).optional(),
  receivedOutOfNetworkBill: z.boolean().optional(),
  paidMoreThanInNetworkRate: z.boolean().optional(),
  hasGoodFaithEstimate: z.boolean().optional(),
  billExceedsEstimateBy400: z.boolean().optional(),
  billWithin120Days: z.boolean().optional(),
  providerAskedConsentForm: z.boolean().optional(),
  signedConsentForm: z.boolean().optional(),
  insuranceDeniedClaim: z.boolean().optional(),
};

const letterSchema = {
  patientName: z.string().optional(),
  patientAddress: z.string().optional(),
  patientPhone: z.string().optional(),
  patientEmail: z.string().optional(),
  providerName: z.string().optional(),
  providerAddress: z.string().optional(),
  accountNumber: z.string().optional(),
  dateOfService: z.string().optional(),
};

const appealSchema = {
  memberName: z.string().optional(),
  memberId: z.string().optional(),
  claimNumber: z.string().optional(),
  dateOfService: z.string().optional(),
  denialReason: z.string().optional(),
  appealDeadline: z.string().optional(),
};

const termSchema = {
  term: z.string().min(1),
};

const checklistOutputSchema = {
  flags: z.array(
    z.object({
      id: z.string(),
      severity: z.string(),
      title: z.string(),
      detail: z.string(),
    })
  ),
  nextSteps: z.array(z.string()),
};

let lastChecklist = { flags: [], nextSteps: [] };

function replyChecklist(message, flags, nextSteps) {
  lastChecklist = { flags, nextSteps };
  return {
    content: message ? [{ type: "text", text: message }] : [],
    structuredContent: lastChecklist,
  };
}

function createBillClarityServer() {
  const server = new McpServer({
    name: "bill-clarity-plugin",
    version: "0.1.0",
  });

  registerAppResource(
    server,
    "bill-checklist-widget",
    "ui://widget/bill-checklist.html",
    {},
    async () => ({
      contents: [
        {
          uri: "ui://widget/bill-checklist.html",
          mimeType: RESOURCE_MIME_TYPE,
          text: widgetHtml,
        },
      ],
    })
  );

  registerAppTool(
    server,
    "screen_medical_bill",
    {
      title: "Screen medical bill text",
      description:
        "Analyze pasted bill/EOB text for common red flags (out-of-network language, duplicates, collections). Use before advising user on next steps.",
      inputSchema: screenBillSchema,
      outputSchema: checklistOutputSchema,
      _meta: { ui: { resourceUri: "ui://widget/bill-checklist.html" } },
    },
    async (args) => {
      const result = screenBillText(args?.billText ?? "");
      const nextSteps = [
        "Ask user for EOB if only provider bill was pasted.",
        "Run assess_patient_rights with insurance and care context.",
        "If flags include out-of-network, cite CMS No Surprises Act resources.",
      ];
      const summary = `Screened ${result.charCount} characters; ${result.flags.length} flag(s). ${result.disclaimer}`;
      return replyChecklist(summary, result.flags, nextSteps);
    }
  );

  registerAppTool(
    server,
    "assess_patient_rights",
    {
      title: "Assess federal medical bill rights paths",
      description:
        "Given insurance/care scenario, return CMS-aligned dispute/complaint/appeal pathways (No Surprises Act, PPDR, plan appeal). Not legal advice.",
      inputSchema: rightsSchema,
    },
    async (args) => {
      const assessment = assessPatientRights(args ?? {});
      const text = JSON.stringify(assessment, null, 2);
      const flags = assessment.paths.map((p) => ({
        id: p.id,
        severity: "action",
        title: p.title,
        detail: p.summary,
      }));
      return replyChecklist(text, flags, assessment.paths.flatMap((p) => p.actions));
    }
  );

  registerAppTool(
    server,
    "generate_itemized_bill_request",
    {
      title: "Generate itemized bill request letter",
      description: "Create a letter template requesting itemized charges and billing records from provider.",
      inputSchema: letterSchema,
    },
    async (args) => {
      const letter = itemizedBillRequestLetter(args ?? {});
      return { content: [{ type: "text", text: letter }] };
    }
  );

  registerAppTool(
    server,
    "build_insurance_appeal_checklist",
    {
      title: "Build insurance appeal checklist",
      description: "Structured checklist for appealing a claim denial; includes deadline reminder.",
      inputSchema: appealSchema,
    },
    async (args) => {
      const checklist = insuranceAppealChecklist(args ?? {});
      return { content: [{ type: "text", text: JSON.stringify(checklist, null, 2) }] };
    }
  );

  registerAppTool(
    server,
    "explain_billing_term",
    {
      title: "Explain billing or insurance term",
      description: "Plain-language glossary for terms on bills and EOBs (deductible, coinsurance, balance billing, etc.).",
      inputSchema: termSchema,
    },
    async (args) => {
      const out = explainTerm(args?.term ?? "");
      return { content: [{ type: "text", text: JSON.stringify(out, null, 2) }] };
    }
  );

  return server;
}

const port = Number(process.env.PORT ?? 8787);
const MCP_PATH = "/mcp";

const httpServer = createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400).end("Missing URL");
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

  if (req.method === "OPTIONS" && url.pathname === MCP_PATH) {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, mcp-session-id",
      "Access-Control-Expose-Headers": "Mcp-Session-Id",
    });
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/") {
    res.writeHead(200, { "content-type": "text/plain" }).end("Bill Clarity MCP — POST /mcp");
    return;
  }

  const MCP_METHODS = new Set(["POST", "GET", "DELETE"]);
  if (url.pathname === MCP_PATH && req.method && MCP_METHODS.has(req.method)) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");

    const server = createBillClarityServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    res.on("close", () => {
      transport.close();
      server.close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res);
    } catch (error) {
      console.error("MCP error:", error);
      if (!res.headersSent) res.writeHead(500).end("Internal server error");
    }
    return;
  }

  res.writeHead(404).end("Not Found");
});

httpServer.listen(port, () => {
  console.log(`Bill Clarity MCP listening on http://localhost:${port}${MCP_PATH}`);
});
