import React from "react";

const Badge = ({
  number,
  className,
}: {
  number: number;
  className?: string;
}) => {
  let bgColor = "#f3f4f6";
  let textColor = "#334155";
  let icon: React.ReactNode = null;

  if (number > 0) {
    bgColor = "#ECFDF3";
    textColor = "#12B76A";
    icon = (
      <div className="w-3 h-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="13"
          viewBox="0 0 12 13"
          fill="none"
        >
          <path
            d="M6 10V3M6 3L2.5 6.5M6 3L9.5 6.5"
            stroke="#12B76A"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    );
  } else if (number < 0) {
    bgColor = "#FEF3F2";
    textColor = "#F04438";
    icon = (
      <div className="w-3 h-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="12"
          viewBox="0 0 13 12"
          fill="none"
        >
          <path
            d="M6.5 2.5V9.5M6.5 9.5L10 6M6.5 9.5L3 6"
            stroke="#F04438"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={
        "flex py-[2px] pl-2 pr-[10px] max-h-[15px] items-center gap-1 rounded-2xl mix-blend-multiply]" +
        className
      }
      style={{
        backgroundColor: bgColor,
      }}
    >
      {icon}
      <p
        className={`flex flex-col justify-center w-fit h-[15px] text-xs leading-none font-nexa font-medium`}
        style={{
          color: textColor,
        }}
      >
        {number > 0 ? `+${number}%` : number < 0 ? `${number}%` : `${number}%`}
      </p>
    </div>
  );
};

export default Badge;
