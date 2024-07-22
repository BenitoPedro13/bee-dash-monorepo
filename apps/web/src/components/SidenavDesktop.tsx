import React from "react";
import logo from "@/../public/favicon.png";
import buserLogo from "@/../public/buser-logo.webp";
import Link from "next/link";
import Image from "next/image";
import useDataStore, { baseApiUrl } from "@/store";
import DashboardIcon from "./MetricsIcons/DashboardIcon";
import { destroyCookie } from "nookies";
import { useRouter } from "next/navigation";

const SidenavDesktop = () => {
  const session = useDataStore((state) => state.session);
  const router = useRouter()

  const handleLogout = () => {
        // Remove the authentication token or relevant cookie here
        destroyCookie(null, 'juicy-admin-token');

        // Redirect to the login page or any other page after logout
        router.push('/'); // Change '/login' to the desired destination
  }

  return (
    <div className="hidden w-[82px] h-[100vh] xl:flex flex-row justify-start items-start bg-white overflow-hidden z-1 p-0 content-start flex-nowrap gap-0 fixed rounded-none border-[#475466] border-solid border-r z-10">
      <div className="w-[81px] h-[100vh] flex flex-col justify-between items-start overflow-visible flex-grow flex-shrink-0 relative p-0 content-start flex-nowrap rounded-none">
        <nav className="navbar box-border flex-shrink-0 w-full h-min flex flex-col justify-start items-center pt-8 overflow-visible relative content-center flex-nowrap gap-6 rounded-none">
          <Link href="/">
            <Image src={logo} width={42} height={38} alt="Juicy Logo" />
          </Link>
          <div className="box-border flex-shrink-0 w-full h-min flex flex-col justify-center items-center px-4 overflow-visible relative content-start flex-nowrap gap-2 rounded-none">
            <button className="btn btn-ghost box-border flex-shrink-0 w-12 h-12 flex flex-row justify-start items-start p-3 bg-transparent overflow-hidden relative content-start flex-nowrap gap-2 rounded-full opacity-20 hover:opacity-80">
              <svg
                width="24"
                height="24"
                viewBox="-1 -1 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="pl-[1px]"
              >
                <path
                  d="M4.66667 13.1667H11.3333M7.18141 1.30333L1.52949 5.69927C1.15168 5.99312 0.962781 6.14005 0.826689 6.32405C0.706138 6.48704 0.616335 6.67065 0.561689 6.86588C0.5 7.08627 0.5 7.32558 0.5 7.80421V13.8333C0.5 14.7667 0.5 15.2335 0.681656 15.59C0.841445 15.9036 1.09641 16.1585 1.41002 16.3183C1.76654 16.5 2.23325 16.5 3.16667 16.5H12.8333C13.7668 16.5 14.2335 16.5 14.59 16.3183C14.9036 16.1585 15.1586 15.9036 15.3183 15.59C15.5 15.2335 15.5 14.7667 15.5 13.8333V7.80421C15.5 7.32558 15.5 7.08627 15.4383 6.86588C15.3837 6.67065 15.2939 6.48704 15.1733 6.32405C15.0372 6.14005 14.8483 5.99312 14.4705 5.69927L8.81859 1.30333C8.52582 1.07562 8.37943 0.961766 8.21779 0.918001C8.07516 0.879384 7.92484 0.879384 7.78221 0.918001C7.62057 0.961766 7.47418 1.07562 7.18141 1.30333Z"
                  stroke="#0A0A0A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>
            {/* <button
              className={`btn btn-ghost box-border flex-shrink-0 w-12 h-12 flex flex-row justify-start items-start p-3 ${
                session?.user?.color
                  ? `bg-[${session.user.color}] hover:bg-[${session.user.color}]`
                  : "bg-[#ff77ef] hover:bg-[#ff77ef]"
              } overflow-hidden relative content-start flex-nowrap gap-2 rounded-full`}
            >
              <svg
                width="20"
                height="21"
                viewBox="-1 -1 20 21"
                fill=""
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 5.41255C0 3.73239 0 2.89231 0.32698 2.25058C0.614601 1.68609 1.07354 1.22715 1.63803 0.939529C2.27976 0.612549 3.11984 0.612549 4.8 0.612549H13.2C14.8802 0.612549 15.7202 0.612549 16.362 0.939529C16.9265 1.22715 17.3854 1.68609 17.673 2.25058C18 2.89231 18 3.73239 18 5.41255V13.8125C18 15.4927 18 16.3328 17.673 16.9745C17.3854 17.539 16.9265 17.9979 16.362 18.2856C15.7202 18.6125 14.8802 18.6125 13.2 18.6125H4.8C3.11984 18.6125 2.27976 18.6125 1.63803 18.2856C1.07354 17.9979 0.614601 17.539 0.32698 16.9745C0 16.3328 0 15.4927 0 13.8125V5.41255Z"
                  fill="white"
                ></path>
                <path d="M5 12.6125V14.6125V12.6125Z" fill="white"></path>
                <path d="M9 8.61255V14.6125V8.61255Z" fill="white"></path>
                <path d="M13 4.61255V14.6125V4.61255Z" fill="white"></path>
                <path
                  d="M5 12.6125V14.6125M9 8.61255V14.6125M13 4.61255V14.6125M4.8 18.6125H13.2C14.8802 18.6125 15.7202 18.6125 16.362 18.2856C16.9265 17.9979 17.3854 17.539 17.673 16.9745C18 16.3328 18 15.4927 18 13.8125V5.41255C18 3.73239 18 2.89231 17.673 2.25058C17.3854 1.68609 16.9265 1.22715 16.362 0.939529C15.7202 0.612549 14.8802 0.612549 13.2 0.612549H4.8C3.11984 0.612549 2.27976 0.612549 1.63803 0.939529C1.07354 1.22715 0.614601 1.68609 0.32698 2.25058C0 2.89231 0 3.73239 0 5.41255V13.8125C0 15.4927 0 16.3328 0.32698 16.9745C0.614601 17.539 1.07354 17.9979 1.63803 18.2856C2.27976 18.6125 3.11984 18.6125 4.8 18.6125Z"
                  stroke="#0A0A0A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button> */}
            <DashboardIcon
              className={`btn btn-ghost box-border flex-shrink-0 w-12 h-12 flex flex-row justify-start items-start p-0 bg-transparent hover:bg-transparent overflow-hidden relative content-start flex-nowrap gap-2 rounded-full`}
            />
          </div>
        </nav>
        <div className="w-full h-[72px] flex flex-col justify-end items-start pb-4 px-4 overflow-visible relative content-start flex-nowrap gap-6 rounded-none">
          <div className="box-border flex-shrink-0 w-full h-min flex flex-col justify-center items-center px-4 overflow-visible relative content-start flex-nowrap gap-2 rounded-none">
            <button className="btn btn-ghost box-border flex-shrink-0 w-12 h-12 flex flex-row justify-start items-start p-3 bg-transparent overflow-hidden relative content-start flex-nowrap gap-2 rounded-full opacity-20 hover:opacity-80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#0A0A0A"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.712 4.33a9.027 9.027 0 011.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 00-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 010 9.424m-4.138-5.976a3.736 3.736 0 00-.88-1.388 3.737 3.737 0 00-1.388-.88m2.268 2.268a3.765 3.765 0 010 2.528m-2.268-4.796a3.765 3.765 0 00-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 01-1.388.88m2.268-2.268l4.138 3.448m0 0a9.027 9.027 0 01-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0l-3.448-4.138m3.448 4.138a9.014 9.014 0 01-9.424 0m5.976-4.138a3.765 3.765 0 01-2.528 0m0 0a3.736 3.736 0 01-1.388-.88 3.737 3.737 0 01-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 01-1.652-1.306 9.027 9.027 0 01-1.306-1.652m0 0l4.138-3.448M4.33 16.712a9.014 9.014 0 010-9.424m4.138 5.976a3.765 3.765 0 010-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 011.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 00-1.652 1.306A9.025 9.025 0 004.33 7.288"
                />
              </svg>
            </button>
            <button className="btn btn-ghost box-border flex-shrink-0 w-12 h-12 flex flex-row justify-start items-start p-3 bg-transparent overflow-hidden relative content-start flex-nowrap gap-2 rounded-full opacity-20 hover:opacity-80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#0A0A0A"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            <button 
            onClick={() => handleLogout()}
            className="btn btn-ghost box-border flex-shrink-0 w-12 h-12 flex flex-row justify-start items-start p-3 bg-transparent overflow-hidden relative content-start flex-nowrap gap-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#000"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
            </button>
          </div>
          {!session?.user?.urlProfilePicture ? (
                <div className="mask mask-squircle w-12 h-12 aspect-square flex flex-grow flex-shrink-0 rounded-full border-black border-[1px] border-solid bg-[url('/bg-contact-cta.webp')] bg-cover bg-no-repeat bg-center relative">
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="w-[38px] h-[38px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg> */}
                  <img src="/juicy-artwork-limo.svg" alt="Default Juicy Avatar" className="absolute right-[3px]"/>
                </div>
          ) : (
            <img
              src={`${baseApiUrl}${session.user.urlProfilePicture}`}
              width="48"
              height="48"
              alt={`${session.user.name} Logo`}
              className="btn btn-circle btn-outline border-black border-[1px] border-solid"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SidenavDesktop;
