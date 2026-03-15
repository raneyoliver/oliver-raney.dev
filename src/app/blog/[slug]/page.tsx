"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BlogPostPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/play");
  }, [router]);

  return null;
}
