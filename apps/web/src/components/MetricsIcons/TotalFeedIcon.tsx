import useDataStore from "@/store";
import React from "react";

const TotalFeedIcon = () => {
  const session = useDataStore((state) => state.session);

  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="min-h-[40px] min-w-[40px] w-10 h-10 max-h-10 min-h-10"

    >
      <rect
        x="0.5"
        y="0.5"
        width="39"
        height="39"
        rx="7.5"
        fill={session?.user?.color ? session.user.color : "#FF77EF"}
      />
      <rect x="10.5" y="12" width="9" height="8" fill="white" stroke="black" />
      <rect x="10.5" y="20" width="9" height="8" fill="white" stroke="black" />
      <rect x="19.5" y="12" width="9" height="8" fill="white" stroke="black" />
      <rect x="19.5" y="20" width="9" height="8" fill="white" stroke="black" />
      <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" stroke="black" />
    </svg>
  );
};

export default TotalFeedIcon;
