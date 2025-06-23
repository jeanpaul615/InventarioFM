"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import QuotationList from "./QuotationList";

export default function QuotesListPage() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
      }
    }
  }, [router]);

  return <QuotationList />;
}
