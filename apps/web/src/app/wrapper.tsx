"use client";
import DashboardBG from "@/components/DashboardBG";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SidenavDesktop from "@/components/SidenavDesktop";
import useDataStore from "@/store";
import { Inter } from "next/font/google";
import { useParams, usePathname, useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import LoadingScreen from "../components/LoadingScreen";
import { getParam } from "@/lib/utils";
import React from "react";
import { hexToRgba } from "../../utils/utils";
import Background from "@/components/Background";

const inter = Inter({ subsets: ["latin"] });

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const params = useParams(); // Extract dynamic route parameters

  const campaignId = getParam(params.campaignId);
  const loading = useDataStore((store) => store.loading);
  const { color } = useDataStore((store) => store.session.user);
  const session = useDataStore((state) => state.session);
  const fetchData = useDataStore((state) => state.fetchData);
  const fetchAttachment = useDataStore((state) => state.fetchAttachment);
  const getUserByToken = useDataStore((state) => state.getUserByToken);
  const setLoading = useDataStore((store) => store.setLoading);

  const router = useRouter();
  const { "bee-dash-token": access_token } = parseCookies();

  useEffect(() => {
    const root = document.querySelector(":root") as HTMLElement;

    if (!root) return;

    root.style.setProperty("--user-color", color);
  }, [color]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);

        await fetchData(access_token, +campaignId);
        await fetchAttachment(access_token, +campaignId);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetch();
    }
  }, [
    fetchData,
    fetchAttachment,
    access_token,
    session.isAuthenticated,
    campaignId,
  ]);

  useEffect(() => {
    if (!session.isAuthenticated) {
      if (access_token) {
        (async () => {
          try {
            setLoading(true);
            return await getUserByToken(access_token);
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        })().then((isAuthenticated) => {
          if (path === "/") {
            return isAuthenticated ? router.push("/home") : null;
          }
          isAuthenticated ? null : router.push("/");
        });
      } else {
        router.push("/");
        setLoading(false);
      }
    }
  }, [access_token, getUserByToken, router, session.isAuthenticated, path]);

  if (loading) {
    return <LoadingScreen />;
  }
  if (path !== "/")
    return (
      <>
        <Header />
        <main>
          {/* <SidenavDesktop /> */}
          <div className="relative overflow-hidden min-h-screen">
            {/* <Background color={color} /> */}

            {children}

            <Footer />
          </div>
        </main>
      </>
    );

  return <>{children}</>;
}
