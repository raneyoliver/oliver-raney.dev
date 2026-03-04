"use client";

import { PageWrapper } from "@/components/ui/PageWrapper";
import { FloatingPixels } from "@/components/ui/FloatingPixels";
import { ProjectsContent } from "@/components/content/ProjectsContent";

export default function ProjectsPage() {
  return (
    <PageWrapper title="PROJECTS" color="#FF00FF">
      <FloatingPixels />
      <ProjectsContent color="#FF00FF" />
    </PageWrapper>
  );
}
