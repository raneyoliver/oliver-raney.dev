"use client";

import { PageWrapper } from "@/components/ui/PageWrapper";
import { FloatingPixels } from "@/components/ui/FloatingPixels";
import { SkillsContent } from "@/components/content/SkillsContent";

export default function SkillsPage() {
  return (
    <PageWrapper title="SKILLS" color="#A855F7">
      <FloatingPixels />
      <SkillsContent color="#A855F7" />
    </PageWrapper>
  );
}
