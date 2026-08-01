export type AppTemplate = {
  id: string;
  name: string;
  description: string;
  command: string;
  arguments: string;
  port: number;
  healthPath: string;
  icon: string;
};

export const APP_TEMPLATES: AppTemplate[] = [
  {
    id: "node",
    name: "Node.js",
    description: "Express, Next.js, or any npm start script",
    command: "npm",
    arguments: "start",
    port: 3000,
    healthPath: "/",
    icon: "node",
  },
  {
    id: "python",
    name: "Python",
    description: "FastAPI, Flask, or uvicorn apps",
    command: "python",
    arguments: "-m uvicorn main:app --host 0.0.0.0 --port {port}",
    port: 8000,
    healthPath: "/docs",
    icon: "python",
  },
  {
    id: "dotnet",
    name: ".NET",
    description: "ASP.NET Core web apps",
    command: "dotnet",
    arguments: "run",
    port: 5000,
    healthPath: "/",
    icon: "dotnet",
  },
  {
    id: "custom",
    name: "Custom",
    description: "Define your own executable and arguments",
    command: "",
    arguments: "",
    port: 8080,
    healthPath: "/",
    icon: "custom",
  },
];

export function getTemplate(id: string): AppTemplate {
  return APP_TEMPLATES.find((t) => t.id === id) ?? APP_TEMPLATES[3];
}
