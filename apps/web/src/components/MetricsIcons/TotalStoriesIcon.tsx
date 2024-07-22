import useDataStore from "@/store";
import React from "react";

const TotalStoriesIcon = () => {
  const session = useDataStore((state) => state.session);

  return (
    <svg
      width="41"
      height="40"
      viewBox="0 0 41 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="min-h-[40px] min-w-[40px] w-10 h-10 max-h-10 min-h-10"
    >
      <rect
        x="1"
        y="0.5"
        width="39"
        height="39"
        rx="7.5"
        fill={session?.user?.color ? session.user.color : "#FF77EF"}
      />
      <rect
        x="11.75"
        y="11.75"
        width="16.5"
        height="16.5"
        rx="4.5"
        fill="white"
      />
      <path
        d="M24.5 20L15.5 20"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M24.5 20L15.5 20"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M20 15.875L20 24.875"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M20 15.875L20 24.875"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="11.75"
        y="11.75"
        width="16.5"
        height="16.5"
        rx="4.5"
        stroke="black"
        strokeWidth="1.5"
      />
      <rect x="1" y="0.5" width="39" height="39" rx="7.5" stroke="black" />
    </svg>
  );
};

export default TotalStoriesIcon;
