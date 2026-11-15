import { StitchAppShell } from "@/components/stitch/app-shell";
import { RedditForm } from "./reddit-form";

export default function RedditImagesPage() {
  return (
    <StitchAppShell>
      <div className="mb-8">
        <h1
          className="text-3xl font-semibold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Reddit post images
        </h1>
        <p className="mt-2 max-w-2xl text-[#b9caca]">
          Paste a public Reddit post link to collect the images attached to it,
          including gallery posts.
        </p>
      </div>
      <RedditForm />
    </StitchAppShell>
  );
}
