import logo from "@/../public/logo.svg";
import menu from "@/../public/menu.svg";
import avatar from "@/../public/avatar.jpeg";

import Image from "next/image";
import Link from "next/link";
import useDataStore from "@/store";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";

const Header = () => {
  const router = useRouter()

  const handleLogout = () => {
        // Remove the authentication token or relevant cookie here
        destroyCookie(null, 'juicy-admin-token');

        // Redirect to the login page or any other page after logout
        router.push('/'); // Change '/login' to the desired destination
  }

  return (
    <header className="bg-white h-[72px] border-b border-gray-100 shadow-header lg:h-20 xl:hidden">
      <div className="flex flex-col justify-center items-center p-0 absolute h-[72px] left-0 right-0 top-0 lg:h-20">
        <div className="flex flex-row justify-between items-center pr-3 pl-4 h-10 w-[100%] lg:px-8">
          <div className="flex flex-row items-center gap-10 lg:gap-[94px]">
            <div className="flex flex-row items-start p-0 h-8 w-auto cursor-pointer">
              <div className="h-8 w-auto">
                <Link href="/">
                  <Image src={logo} width={88} height={undefined} alt="Logo" />
                </Link>
              </div>
            </div>
            {/* <nav className="hidden lg:flex items-center gap-8 w-fit h-8">
              <button className="flex justify-center items-center gap-2 w-fit h-fit">
                <p className="text-base font-semibold text-gray-600">Home</p>
              </button>
              <div className="flex flex-col items-center py-1 w-fit h-fit">
                <button className="flex justify-center items-center gap-2 w-fit h-fit">
                  <p className="text-base font-semibold text-gray-600">
                    Products
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col items-center py-1 w-fit h-fit">
                <button className="flex justify-center items-center gap-2 w-fit h-fit">
                  <p className="text-base font-semibold text-gray-600">
                    Resources
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
              </div>
              <button className="flex justify-center items-center gap-2 w-fit h-fit">
                <p className="text-base font-semibold text-gray-600">Pricing</p>
              </button>
            </nav> */}
                        
          </div>
          <div className="flex flex-row justify-center items-center p-2 gap-2 w-10 h-10 cursor-pointer lg:p-0 lg:flex-col">
            <div className="w-fit h-fit flex justify-center items-center">
              {/* <Image
                src={menu}
                width={18}
                height={12}
                alt="Menu Open Icon"
                // className="lg:hidden"
              /> */}
              {/* <div className="avatar hidden lg:block">
                <div className="mask mask-squircle w-10 h-10 aspect-square block rounded-full">
                  <img src="/avatar.jpeg" alt="Avatar Picture" />
                </div>
              </div> */}
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
