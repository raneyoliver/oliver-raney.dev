"use client";

import { PageWrapper } from "@/components/ui/PageWrapper";
import { FloatingPixels } from "@/components/ui/FloatingPixels";
import { ResumeContent } from "@/components/content/ResumeContent";

export default function ResumePage() {
  return (
    <PageWrapper title="RESUME" color="#39FF14">
      <FloatingPixels />
      <ResumeContent color="#39FF14" />
    </PageWrapper>
  );
}
