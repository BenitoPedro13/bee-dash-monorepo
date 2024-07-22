import Link from 'next/link'
import React from 'react'
import { Inter } from "next/font/google";
import useDataStore from '@/store';

const inter = Inter({ subsets: ["latin"] });

const Breadcrumb = () => {
  const session = useDataStore((state) => state.session);

  return (
    <div className="breadcrumbs xl:text-lg text-sm text-[#475466]">
    <ul>
      <li>
        <Link href={"/"}>
          <svg
            width="15"
            height="16"
            viewBox="-1 -1 18 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.66667 13.1667H11.3333M7.18141 1.30333L1.52949 5.69927C1.15168 5.99312 0.962781 6.14005 0.826689 6.32405C0.706138 6.48704 0.616335 6.67065 0.561689 6.86588C0.5 7.08627 0.5 7.32558 0.5 7.80421V13.8333C0.5 14.7667 0.5 15.2335 0.681656 15.59C0.841445 15.9036 1.09641 16.1585 1.41002 16.3183C1.76654 16.5 2.23325 16.5 3.16667 16.5H12.8333C13.7668 16.5 14.2335 16.5 14.59 16.3183C14.9036 16.1585 15.1586 15.9036 15.3183 15.59C15.5 15.2335 15.5 14.7667 15.5 13.8333V7.80421C15.5 7.32558 15.5 7.08627 15.4383 6.86588C15.3837 6.67065 15.2939 6.48704 15.1733 6.32405C15.0372 6.14005 14.8483 5.99312 14.4705 5.69927L8.81859 1.30333C8.52582 1.07562 8.37943 0.961766 8.21779 0.918001C8.07516 0.879384 7.92484 0.879384 7.78221 0.918001C7.62057 0.961766 7.47418 1.07562 7.18141 1.30333Z"
              stroke="#667085"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </Link>
      </li>
      <li>
        <Link href={"/"}>
          <p
            className={`flex-shrink-0 w-auto h-auto whitespace-pre relative font-medium ${inter.className} xl:text-lg text-sm xl:leading-5]`}
          >
            Campanha
          </p>
        </Link>
      </li>
      <li>
        <p
          className={`flex-shrink-0 w-auto h-auto whitespace-pre relative font-medium ${inter.className} xl:text-lg text-sm xl:leading-5]]`}
        >
          {session.user.campaignName}
        </p>
      </li>
    </ul>
  </div>
  )
}

export default Breadcrumb