/* eslint-disable @next/next/no-img-element */
import React from "react";
import logo from "@/../public/bee-logo.svg";
import house from "@/../public/house.svg";
import folderstar from "@/../public/folder-star.svg";
import contact from "@/../public/contact.svg";
import gear from "@/../public/gear.svg";
import logout from "@/../public/logout.svg";
import buserLogo from "@/../public/buser-logo.webp";
import Link from "next/link";
import Image from "next/image";
import useDataStore, { baseApiUrl } from "@/store";
import DashboardIcon from "./MetricsIcons/DashboardIcon";
import { destroyCookie } from "nookies";
import { useRouter } from "next/navigation";

const SidenavDesktop = () => {
  const session = useDataStore((state) => state.session);
  const router = useRouter();

  // TODO: implement state to verify if url path is /dashboard
  const isDashboard =
    typeof window === undefined
      ? false
      : window.location.pathname === "/dashboard";

  const handleLogout = () => {
    // Remove the authentication token or relevant cookie here
    destroyCookie(null, "bee-dash-token");

    // Redirect to the login page or any other page after logout
    router.push("/"); // Change '/login' to the desired destination
  };

  return (
    <div className="hidden w-[82px] h-[100vh] xl:flex flex-row justify-start items-start bg-white overflow-hidden z-1 p-0 content-start flex-nowrap gap-0 fixed rounded-none border-[#47546740] border-solid border-r z-10 xl:flex-shrink-0">
      <div className="w-[81px] h-[100vh] flex flex-col justify-between items-start overflow-visible flex-grow flex-shrink-0 self-stretch relative p-0 gap-0 content-start flex-nowrap rounded-none">
        <nav className="box-border flex-shrink-0 w-full h-min flex flex-col justify-start items-start pt-8 overflow-visible relative content-center flex-nowrap gap-6 self-stretch rounded-none">
          <Link href="/">
            <div className="flex flex-col py-0 pr-5 pl-6 items-start self-stretch">
              <Image
                src={logo}
                width={40}
                height={27.227}
                alt="Bee Company Logo"
              />
            </div>
          </Link>
          <div className="box-border flex-shrink-0 w-full h-min flex flex-col justify-center items-start px-4 overflow-visible relative content-start flex-nowrap gap-2 self-stretch rounded-none">
            <button className="btn btn-ghost cursor-not-allowed box-border flex-shrink-0 w-12 h-12 flex flex-row justify-start items-start p-3 bg-transparent overflow-hidden relative content-start flex-nowrap gap-2 rounded-md opacity-30 hover:opacity-80 ">
              <Image src={house} width={24} height={24} alt="Home" />
            </button>
            <Link href="/dashboard">
              <button
                className={`btn btn-ghost box-border flex-shrink-0 w-12 h-12 flex flex-row justify-start items-start p-3 bg-transparent overflow-hidden relative content-start flex-nowrap gap-2 rounded-md ${
                  isDashboard ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"
                }`}
              >
                <Image
                  src={folderstar}
                  width={24}
                  height={24}
                  alt="Dashboard"
                />
              </button>
            </Link>

            {/* <DashboardIcon
              className={`btn btn-ghost box-border flex-shrink-0 w-12 h-12 flex flex-row justify-start items-start p-0 bg-transparent hover:bg-transparent overflow-hidden relative content-start flex-nowrap gap-2 rounded-full`}
            /> */}
          </div>
        </nav>
        <div className="w-full flex flex-col justify-end items-start pb-6 px-4 overflow-visible relative content-start flex-nowrap gap-6 self-stretch rounded-none">
          <div className="box-border flex-shrink-0 w-full h-auto flex flex-col justify-center items-center px-4 overflow-visible relative content-start flex-nowrap gap-2 self-stretch rounded-none">
            <button className="btn btn-ghost cursor-not-allowed box-border flex-shrink-0 w-12 h-12 flex flex-row justify-center items-start p-3 bg-transparent overflow-hidden relative content-start flex-nowrap gap-2 rounded-md opacity-30 hover:opacity-80 ">
              <Image
                src={contact}
                width={19.5}
                height={21}
                alt="Get in touch with us"
              />
            </button>
            <button className="btn btn-ghost cursor-not-allowed box-border flex-shrink-0 w-12 h-12 flex flex-row justify-center items-start p-3 bg-transparent overflow-hidden relative content-start flex-nowrap gap-2 rounded-md opacity-30 hover:opacity-80 ">
              <Image
                src={gear}
                width={24}
                height={24}
                alt="Get in touch with us"
              />
            </button>
            <button
              onClick={() => handleLogout()}
              className="btn btn-ghost box-border flex-shrink-0 w-12 h-12 flex flex-row justify-center items-center p-3 bg-transparent overflow-hidden relative content-start flex-nowrap gap-2 rounded-md hover:opacity-80"
            >
              <Image
                src={logout}
                width={24}
                height={24}
                alt="Get in touch with us"
                className="relative right-[2px] rotate-180"
              />
            </button>
          </div>
          {!session?.user?.urlProfilePicture ? (
            <div className="mask mask-squircle w-12 h-12 aspect-square flex flex-grow flex-shrink-0 rounded-full border-black border-[1px] border-solid bg-[url('/bg-contact-cta.webp')] bg-cover bg-no-repeat bg-center relative">
              <img
                src="/juicy-artwork-limo.svg"
                alt="Default Bee Company Avatar"
                className="absolute right-[3px]"
              />
            </div>
          ) : (
            <img
              src={`${baseApiUrl}${session.user.urlProfilePicture}`}
              width="57"
              height="57"
              alt={`${session.user.name} profile picture`}
              className="btn btn-circle btn-outline border-black border-[1px] border-solid"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SidenavDesktop;
