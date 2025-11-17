import {
  ClaudeAI,
  Discord,
  Gemini,
  GitHub,
  GoogleDrive,
  Grok,
  Kimi,
  Logo,
  OpenAI,
  PostHog,
  Vercel,
} from "@/components/icons";
import { OrbitingCircles } from "@/components/ui/orbiting-circle";

export function SecondBentoAnimation() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-background to-transparent z-20"></div>
      <div className="pointer-events-none absolute top-0 left-0 h-20 w-full bg-gradient-to-b from-background to-transparent z-20"></div>

      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 size-16 bg-secondary p-2 rounded-full z-30 md:bottom-0 md:top-auto">
        <Logo className="fill-white size-10" />
      </div>
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <div className="relative flex h-[500px] w-full items-center justify-center translate-y-0 md:translate-y-32">
          <OrbitingCircles iconSize={60} radius={100} reverse speed={1}>
            <div className="rounded-full bg-white p-2">
              <ClaudeAI className="size-8" />
            </div>
            <div className="rounded-full bg-white p-2">
              <Gemini className="size-8" />
            </div>
            <div className="rounded-full bg-white p-2">
              <OpenAI theme="light" className="size-8" />
            </div>
          </OrbitingCircles>

          <OrbitingCircles iconSize={60} speed={0.5}>
            <div className="rounded-full bg-white p-2">
              <GoogleDrive className="size-8" />
            </div>
            <div className="rounded-full bg-white p-2">
              <Discord className="size-8" />
            </div>
            <div className="rounded-full bg-white p-2">
              <Grok theme="light" className="size-8" />
            </div>
          </OrbitingCircles>

          <OrbitingCircles iconSize={60} radius={230} reverse speed={0.5}>
            <div className="rounded-full bg-white p-2">
              <GitHub theme="light" className="size-8" />
            </div>
            <div className="rounded-full bg-white p-2">
              <PostHog theme="light" className="size-8" />
            </div>
            <div className="rounded-full bg-white p-2">
              <Vercel theme="light" className="size-8" />
            </div>
            <div className="rounded-full bg-white p-2">
              <Kimi theme="light" className="size-8" />
            </div>
          </OrbitingCircles>
        </div>
      </div>
    </div>
  );
}
