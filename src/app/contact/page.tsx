"use client";

import { PageWrapper } from "@/components/ui/PageWrapper";
import { FloatingPixels } from "@/components/ui/FloatingPixels";
import { ContactContent } from "@/components/content/ContactContent";

export default function ContactPage() {
  return (
    <PageWrapper title="CONTACT" color="#FFBF00">
      <FloatingPixels />
      <ContactContent color="#FFBF00" />
    </PageWrapper>
  );
}
