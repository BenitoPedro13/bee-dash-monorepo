"use client";

import useDataStore, {
  DashboardMode,
  DashbordDateRange,
  Influencer,
  Posts,
} from "@/store";
import Metrics from "./Metrics";
import {
  calculatePostsCountVariations,
  calculateVariations,
  countPostsByType,
  total,
} from "../../utils/utils";
import CameraIcon from "./MetricsIcons/CameraIcon";
import TotalFeedIcon from "./MetricsIcons/TotalFeedIcon";
import TotalStoriesIcon from "./MetricsIcons/TotalStoriesIcon";
import TotalReelsIcon from "./MetricsIcons/TotalReelsIcon";
import TotalTiktokIcon from "./MetricsIcons/TotalTiktokIcon";

const metricConfig: Record<
  DashboardMode,
  {
    className: string;
    classNameCreator: string;
    config: {
      className: string;
      classNameCreator: string;
      heading: string;
      metric: (data: Posts[]) => string | number;
      icon: JSX.Element | null;
      variation: (
        data: Posts[]
      ) => Record<
        DashbordDateRange,
        { total: number | string; variation: number | null }
      >;
    }[];
  }
> = {
  tiktok: {
    className:
      "flex-shrink-0 w-full xl:h-auto h-min xl:flex grid xl:justify-start xl:items-center grid-cols-metric auto-rows-fr grid-rows-1 p-0 overflow-visible relative content-center flex-nowrap rounded-none",
    classNameCreator:
      "flex-shrink-0 w-full xl:h-auto h-min grid grid-cols-2 auto-rows-fr grid-rows-2 p-0 overflow-visible relative content-center flex-nowrap xl:gap-4 gap-[10px] rounded-none",

    config: [
      {
        className: "rounded-bl-3xl rounded-tl-3xl",
        classNameCreator: "col-span-2 h-[135px]",
        heading: "Posts",
        metric: (data) => countPostsByType(data, ["TIKTOK"]),
        icon: <CameraIcon />,
        variation: (data) => calculatePostsCountVariations(data, ["TIKTOK"]),
      },
      {
        className: "rounded-br-3xl rounded-tr-3xl border-l-0",
        classNameCreator: "col-span-2 h-[135px]",

        heading: "TikToks",
        metric: (data) => countPostsByType(data, ["TIKTOK"]),
        icon: <TotalTiktokIcon />,
        variation: (data) => calculatePostsCountVariations(data, ["TIKTOK"]),
      },
    ],
  },
  instagram: {
    className:
      "flex-shrink-0 w-full xl:h-auto h-min xl:flex grid xl:justify-start xl:items-center grid-cols-metric auto-rows-fr grid-rows-2 p-0 overflow-visible relative content-center flex-nowrap rounded-none",
    classNameCreator:
      "flex-shrink-0 w-full xl:h-auto h-min grid grid-cols-2 auto-rows-fr grid-rows-2 p-0 overflow-visible relative content-center flex-nowrap xl:gap-4 gap-[10px] rounded-none",

    config: [
      {
        className: "xl:rounded-bl-3xl rounded-tl-3xl border-b-0 xl:border-b",
        classNameCreator: "col-span-1 h-[135px]",

        heading: "Posts",
        metric: (data) => countPostsByType(data, ["STORIES", "FEED", "REELS"]),
        icon: <CameraIcon />,
        variation: (data) =>
          calculatePostsCountVariations(data, ["STORIES", "FEED", "REELS"]),
      },
      {
        className:
          " border-l-0 border-b-0 xl:border-b rounded-tr-3xl xl:rounded-tr-none",
        classNameCreator: "col-span-1",

        heading: "Stories",
        metric: (data) => countPostsByType(data, ["STORIES"]),
        icon: (
          <div className="flex items-center justify-center w-5 h-5">
            <TotalStoriesIcon />
          </div>
        ),
        variation: (data) => calculatePostsCountVariations(data, ["STORIES"]),
      },
      {
        className: "rounded-bl-3xl xl:rounded-bl-none xl:border-l-0",
        classNameCreator: "col-span-1 h-[135px]",

        heading: "Feed",
        metric: (data) => countPostsByType(data, ["FEED"]),
        icon: <TotalFeedIcon />,
        variation: (data) => calculatePostsCountVariations(data, ["FEED"]),
      },
      {
        className:
          " rounded-br-3xl  xl:rounded-bl-none xl:rounded-tr-3xl border-l-0",
        classNameCreator: "col-span-1 h-[135px]",

        heading: "Reels",
        metric: (data) => countPostsByType(data, ["REELS"]),
        icon: <TotalReelsIcon />,
        variation: (data) => calculatePostsCountVariations(data, ["REELS"]),
      },
    ],
  },
  all: {
    className:
      "flex-shrink-0 w-full xl:h-auto h-min xl:flex grid xl:justify-start xl:items-center grid-cols-metric auto-rows-fr grid-rows-2 p-0 overflow-visible relative content-center flex-nowrap rounded-none",
    classNameCreator:
      "w-full xl:h-auto h-min grid grid-cols-6 auto-rows-fr grid-rows-2 p-0 overflow-visible relative content-center flex-nowrap xl:gap-y-4 gap-y-[10px] rounded-none",

    config: [
      {
        className: "xl:rounded-bl-3xl rounded-tl-3xl border-b-0 xl:border-b",
        classNameCreator: "rounded-bl-3xl rounded-tl-3xl col-span-2 h-[135px] ",
        heading: "Posts",
        metric: (data) =>
          countPostsByType(data, ["STORIES", "FEED", "REELS", "TIKTOK"]),
        icon: <CameraIcon />,
        variation: (data) =>
          calculatePostsCountVariations(data, [
            "STORIES",
            "FEED",
            "REELS",
            "TIKTOK",
          ]),
      },
      {
        className:
          "xl:rounded-tr-none rounded-tr-3xl border-b-0 xl:border-b border-l-0",
        classNameCreator: "col-span-2 h-[135px]  border-l-0",
        heading: "Stories",
        metric: (data) => countPostsByType(data, ["STORIES"]),
        icon: (
          <div className="flex items-center justify-center w-5 h-5">
            <TotalStoriesIcon />
          </div>
        ),
        variation: (data) => calculatePostsCountVariations(data, ["STORIES"]),
      },
      {
        className: " border-b-0 xl:border-b xl:border-l-0",
        classNameCreator:
          "rounded-br-3xl rounded-tr-3xl col-span-2 h-[135px] border-l-0",
        heading: "Feed",
        metric: (data) => countPostsByType(data, ["FEED"]),
        icon: <TotalFeedIcon />,
        variation: (data) => calculatePostsCountVariations(data, ["FEED"]),
      },
      {
        className: " border-b-0 xl:border-b border-l-0",
        classNameCreator: "rounded-bl-3xl rounded-tl-3xl col-span-3 h-[135px]",
        heading: "Reels",
        metric: (data) => countPostsByType(data, ["REELS"]),
        icon: <TotalReelsIcon />,
        variation: (data) => calculatePostsCountVariations(data, ["REELS"]),
      },
      {
        className:
          "col-span-2 rounded-br-3xl rounded-bl-3xl xl:rounded-bl-none xl:rounded-tr-3xl xl:border-l-0",
        classNameCreator:
          "rounded-br-3xl rounded-tr-3xl col-span-3 h-[135px] border-l-0",
        heading: "TikToks",
        metric: (data) => countPostsByType(data, ["TIKTOK"]),
        icon: <TotalTiktokIcon />,
        variation: (data) => calculatePostsCountVariations(data, ["TIKTOK"]),
      },
    ],
  },
};

const FirstSection = ({
  creator = false,
  data,
  title,
}: {
  creator?: boolean;
  data?: Posts[];
  title?: string;
}) => {
  // const { data } = useDataStore((state) => state.data);
  const postsData = useDataStore((state) => state.postsData);
  const mode = useDataStore((state) => state.mode);
  const metrics = metricConfig[mode] || [];

  return (
    <div className="flex flex-col items-start gap-2 self-stretch">
      {title && (
        <h3 className="font-nexa text-[#475467] text-lg font-bold leading-[22px]">
          {title}
        </h3>
      )}

      <div className={creator ? metrics?.classNameCreator : metrics?.className}>
        {metrics?.config.map(
          ({
            className,
            classNameCreator,
            heading,
            metric,
            icon,
            variation,
          }) => (
            <Metrics
              className={creator ? classNameCreator : className}
              key={heading}
              heading={heading}
              metric={metric(data ?? postsData)}
              variation={variation(data ?? postsData)}
            >
              {icon}
            </Metrics>
          )
        )}
      </div>
    </div>
  );
};

export default FirstSection;
