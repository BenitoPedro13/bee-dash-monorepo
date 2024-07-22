import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";

export function useAuth() {
  const router = useRouter();
  const isAuthenticated = !!parseCookies()["juicy-admin-token"];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return isAuthenticated;
}
