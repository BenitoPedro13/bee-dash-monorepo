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

const inter = Inter({ subsets: ["latin"] });

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { campaignId } = useParams();
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
          <SidenavDesktop />
          <div className="relative bg-white overflow-hidden min-h-screen">
            <div className="absolute z-10">
              <DashboardBG color={color} />
            </div>
            {children}

            <Footer />
          </div>
        </main>
      </>
    );

  return <>{children}</>;
}
