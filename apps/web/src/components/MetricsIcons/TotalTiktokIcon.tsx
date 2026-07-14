import useDataStore from "@/store";
import React from "react";

const TotalTiktokIcon = () => {
  // const session = useDataStore((state) => state.session);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="w-5 h-5"
    >
      <path
        d="M13.6756 5.19333C13.1439 4.58637 12.8509 3.80689 12.8511 3H10.4478V12.6444C10.4292 13.1664 10.2089 13.6607 9.83315 14.0234C9.4574 14.3861 8.95557 14.5888 8.43333 14.5889C7.32889 14.5889 6.41111 13.6867 6.41111 12.5667C6.41111 11.2289 7.70222 10.2256 9.03222 10.6378V8.18C6.34889 7.82222 4 9.90667 4 12.5667C4 15.1567 6.14667 17 8.42556 17C10.8678 17 12.8511 15.0167 12.8511 12.5667V7.67444C13.8257 8.37433 14.9957 8.74984 16.1956 8.74778V6.34444C16.1956 6.34444 14.7333 6.41444 13.6756 5.19333Z"
        fill="black"
      />
    </svg>
  );
};

export default TotalTiktokIcon;
