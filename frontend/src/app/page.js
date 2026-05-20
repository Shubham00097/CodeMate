"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (getToken()) {
      router.replace("/dashboard");
      return;
    }
    router.replace("/login");
  }, [router]);

  return <div className="p-8">Redirecting...</div>;
}
