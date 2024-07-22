/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";

interface IIconagraphyIconSearchStroke {
  color: string;
  className: string;
}

const IconagraphyIconSearchStroke = ({
  color = "#0A0A0A",
  className = "",
}: IIconagraphyIconSearchStroke) => {
  return (
    <svg
      className={`${className}`}
      fill="none"
      height="17"
      viewBox="0 0 17 17"
      width="17"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.70337 13.2813C10.7841 13.2813 13.2815 10.7838 13.2815 7.70313C13.2815 4.62241 10.7841 2.125 7.70337 2.125C4.62266 2.125 2.12524 4.62241 2.12524 7.70313C2.12524 10.7838 4.62266 13.2813 7.70337 13.2813Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        d="M11.6476 11.6484L14.8749 14.8758"
        stroke={color}
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  );
};

IconagraphyIconSearchStroke.propTypes = {
  color: PropTypes.string,
};

export default IconagraphyIconSearchStroke;
