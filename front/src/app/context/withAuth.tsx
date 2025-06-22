"use client";
import React from "react";
import { useApi } from "../context/ApiContext";
import { useRouter } from "next/navigation";

const withAuth = (Component: React.ComponentType<any>) => {
  return function AuthenticatedComponent(props: any) {
    const { token } = useApi();
    const router = useRouter();
    React.useEffect(() => {
      if (!token) {
        router.replace("/login");
      }
    }, [token]);
    if (!token) return null;
    return <Component {...props} />;
  };
};

export default withAuth;
