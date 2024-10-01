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
import TotalPostsIcon from "./MetricsIcons/TotalPostsIcon";
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
      "flex-shrink-0 w-full xl:h-auto h-min xl:flex grid xl:justify-start xl:items-center grid-cols-metric auto-rows-fr grid-rows-1 p-0 overflow-visible relative content-center flex-nowrap xl:gap-6 gap-[10px] rounded-none",
    classNameCreator:
      "flex-shrink-0 w-full xl:h-auto h-min grid grid-cols-2 auto-rows-fr grid-rows-2 p-0 overflow-visible relative content-center flex-nowrap xl:gap-4 gap-[10px] rounded-none",

    config: [
      {
        className: "",
        classNameCreator: "col-span-2 h-[117px]",
        heading: "Total Posts",
        metric: (data) => countPostsByType(data, ["TIKTOK"]),
        icon: null,
        variation: (data) => calculatePostsCountVariations(data, ["TIKTOK"]),
      },
      {
        className: "",
        classNameCreator: "col-span-2 h-[117px]",
        heading: "Total TikToks",
        metric: (data) => countPostsByType(data, ["TIKTOK"]),
        icon: <TotalTiktokIcon />,
        variation: (data) => calculatePostsCountVariations(data, ["TIKTOK"]),
      },
    ],
  },
  instagram: {
    className:
      "flex-shrink-0 w-full xl:h-auto h-min xl:flex grid xl:justify-start xl:items-center grid-cols-metric auto-rows-fr grid-rows-2 p-0 overflow-visible relative content-center flex-nowrap xl:gap-6 gap-[10px] rounded-none",
    classNameCreator:
      "flex-shrink-0 w-full xl:h-auto h-min grid grid-cols-2 auto-rows-fr grid-rows-2 p-0 overflow-visible relative content-center flex-nowrap xl:gap-4 gap-[10px] rounded-none",

    config: [
      {
        className: "",
        classNameCreator: "col-span-1 h-[117px]",

        heading: "Total Posts",
        metric: (data) => countPostsByType(data, ["STORIES", "FEED", "REELS"]),
        icon: null,
        variation: (data) =>
          calculatePostsCountVariations(data, ["STORIES", "FEED", "REELS"]),
      },
      {
        className: "",
        classNameCreator: "col-span-1",

        heading: "Total Stories",
        metric: (data) => countPostsByType(data, ["STORIES"]),
        icon: (
          <div className="flex items-center justify-center w-5 h-5">
            <TotalStoriesIcon />
          </div>
        ),
        variation: (data) => calculatePostsCountVariations(data, ["STORIES"]),
      },
      {
        className: "",
        classNameCreator: "col-span-1 h-[117px]",

        heading: "Total Feed",
        metric: (data) => countPostsByType(data, ["FEED"]),
        icon: <TotalFeedIcon />,
        variation: (data) => calculatePostsCountVariations(data, ["FEED"]),
      },
      {
        className: "",
        classNameCreator: "col-span-1 h-[117px]",

        heading: "Total Reels",
        metric: (data) => countPostsByType(data, ["REELS"]),
        icon: <TotalReelsIcon />,
        variation: (data) => calculatePostsCountVariations(data, ["REELS"]),
      },
    ],
  },
  all: {
    className:
      "flex-shrink-0 w-full xl:h-auto h-min xl:flex grid xl:justify-start xl:items-center grid-cols-metric auto-rows-fr grid-rows-2 p-0 overflow-visible relative content-center flex-nowrap xl:gap-6 gap-[10px] rounded-none",
    classNameCreator:
      "w-full xl:h-auto h-min grid grid-cols-6 auto-rows-fr grid-rows-2 p-0 overflow-visible relative content-center flex-nowrap xl:gap-4 gap-[10px] rounded-none",

    config: [
      {
        className: "",
        classNameCreator: "col-span-2 h-[117px]",
        heading: "Total Posts",
        metric: (data) =>
          countPostsByType(data, ["STORIES", "FEED", "REELS", "TIKTOK"]),
        icon: null,
        variation: (data) =>
          calculatePostsCountVariations(data, [
            "STORIES",
            "FEED",
            "REELS",
            "TIKTOK",
          ]),
      },
      {
        className: "",
        classNameCreator: "col-span-2 h-[117px]",
        heading: "Total Stories",
        metric: (data) => countPostsByType(data, ["STORIES"]),
        icon: (
          <div className="flex items-center justify-center w-5 h-5">
            <TotalStoriesIcon />
          </div>
        ),
        variation: (data) => calculatePostsCountVariations(data, ["STORIES"]),
      },
      {
        className: "",
        classNameCreator: "col-span-2 h-[117px]",
        heading: "Total Feed",
        metric: (data) => countPostsByType(data, ["FEED"]),
        icon: <TotalFeedIcon />,
        variation: (data) => calculatePostsCountVariations(data, ["FEED"]),
      },
      {
        className: "",
        classNameCreator: "col-span-3 h-[117px]",
        heading: "Total Reels",
        metric: (data) => countPostsByType(data, ["REELS"]),
        icon: <TotalReelsIcon />,
        variation: (data) => calculatePostsCountVariations(data, ["REELS"]),
      },
      {
        className: "col-span-2",
        classNameCreator: "col-span-3 h-[117px]",
        heading: "Total TikToks",
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
}: {
  creator?: boolean;
  data?: Posts[];
}) => {
  // const { data } = useDataStore((state) => state.data);
  const campaigns = useDataStore((state) => state.session.user.campaigns);
  const mode = useDataStore((state) => state.mode);
  const metrics = metricConfig[mode] || [];

  const allPosts: Posts[] = campaigns.flatMap((campaign) =>
    campaign.postsPack.flatMap((pack) => pack.posts)
  );

  return (
    <div className={creator ? metrics?.classNameCreator : metrics?.className}>
      {metrics?.config.map(
        ({ className, classNameCreator, heading, metric, icon, variation }) => (
          <Metrics
            className={creator ? classNameCreator : className}
            key={heading}
            heading={heading}
            metric={metric(data ?? allPosts)}
            variation={variation(data ?? allPosts)}
          >
            {icon}
          </Metrics>
        )
      )}
    </div>
  );
};

export default FirstSection;
