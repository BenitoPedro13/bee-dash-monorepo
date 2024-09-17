import React from "react";

type TitleProps = {
  title:string;
}

const TitleWithoutFilters = ({title} : TitleProps) => {
  return (
    <div className="flex flex-col items-start gap-3 self-stretch">
      <div className="flex justify-center items-start self-stretch gap-3 flex-col md:flex-row md:justify-between md:items-center md:gap-0">
        <div className="flex items-center">
          <h1 className="flex-shrink-0 w-full h-auto whitespace-pre-wrap break-words relative font-Balgin-Display text-[#000] text-[36px] font-nexa font-bold leading-none">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default TitleWithoutFilters;
