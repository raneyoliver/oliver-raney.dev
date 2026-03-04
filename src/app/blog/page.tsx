"use client";

import { PageWrapper } from "@/components/ui/PageWrapper";
import { FloatingPixels } from "@/components/ui/FloatingPixels";
import { BlogContent } from "@/components/content/BlogContent";

export default function BlogPage() {
  return (
    <PageWrapper title="BLOG" color="#FF6B6B">
      <FloatingPixels />
      <BlogContent color="#FF6B6B" />
    </PageWrapper>
  );
}
