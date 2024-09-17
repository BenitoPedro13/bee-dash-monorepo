"use client";
import DashboardBG from "@/components/DashboardBG";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SidenavDesktop from "@/components/SidenavDesktop";
import useDataStore from "@/store";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { color } = useDataStore((store) => store.session.user);
  const session = useDataStore((state) => state.session);
  const fetchData = useDataStore((state) => state.fetchData);
  const fetchAttachment = useDataStore((state) => state.fetchAttachment);
  const getUserByToken = useDataStore((state) => state.getUserByToken);

  const router = useRouter();
  const { "bee-dash-token": access_token } = parseCookies();

  useEffect(() => {
    const campaignId = session.user.campaigns[0]?.id;

    if (campaignId) {
      fetchData(access_token, campaignId);
      fetchAttachment(access_token, campaignId);
    }
  }, [fetchData, fetchAttachment, access_token, session.isAuthenticated]);

  useEffect(() => {
    if (!session.isAuthenticated) {
      if (access_token) {
        (async () => {
          return await getUserByToken(access_token);
        })().then((isAuthenticated) =>
          isAuthenticated ? null : router.push("/")
        );
      } else {
        router.push("/");
      }
    }
  }, [access_token, getUserByToken, router, session.isAuthenticated]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <>
          <Header />
          <main>
            <SidenavDesktop />
            <div className="relative bg-white overflow-hidden min-h-screen">
              <div className="absolute z-10">
                <DashboardBG color={color}/>
              </div>
              {children}

              <Footer />
            </div>
          </main>
        </>
      </body>
    </html>
  );
}
