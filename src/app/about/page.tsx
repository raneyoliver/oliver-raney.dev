"use client";

import { PageWrapper } from "@/components/ui/PageWrapper";
import { FloatingPixels } from "@/components/ui/FloatingPixels";
import { AboutContent } from "@/components/content/AboutContent";

export default function AboutPage() {
  return (
    <PageWrapper title="ABOUT ME" color="#00FFFF">
      <FloatingPixels />
      <AboutContent color="#00FFFF" />
    </PageWrapper>
  );
}
