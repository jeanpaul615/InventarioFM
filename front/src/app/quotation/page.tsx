"use client";
import Quotation from "./Quotation";
import { useApi } from "../context/ApiContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function QuotationPage() {
  const { token } = useApi();
  const router = useRouter();
  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token]);
  if (!token) return null;
  return <Quotation />;
}
