"use client";

import useDataStore, {
  DashboardMode,
  DashbordDateRange,
  Influencer,
} from "@/store";
import Metrics from "./Metrics";
import { calculateVariations, total } from "../../utils/utils";
import TotalPostsIcon from "./MetricsIcons/TotalPostsIcon";
import TotalFeedIcon from "./MetricsIcons/TotalFeedIcon";
import TotalStoriesIcon from "./MetricsIcons/TotalStoriesIcon";
import TotalReelsIcon from "./MetricsIcons/TotalReelsIcon";
import TotalTiktokIcon from "./MetricsIcons/TotalTiktokIcon";

const metricConfig: Record<
  DashboardMode,
  {
    className: string;
    config: {
      className: string;
      heading: string;
      metric: (data: Influencer[]) => string;
      icon: JSX.Element | null;
      variation: (
        data: Influencer[]
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
    config: [
      {
        className: "",
        heading: "Total Posts",
        metric: (data) => total(data, ["Tiktok"]),
        icon: null,
        variation: (data) => calculateVariations(data, "Tiktok"),
      },
      {
        className: "",
        heading: "Total TikToks",
        metric: (data) => total(data, "Tiktok"),
        icon: <TotalTiktokIcon />,
        variation: (data) => calculateVariations(data, "Tiktok"),
      },
    ],
  },
  instagram: {
    className:
      "flex-shrink-0 w-full xl:h-auto h-min xl:flex grid xl:justify-start xl:items-center grid-cols-metric auto-rows-fr grid-rows-2 p-0 overflow-visible relative content-center flex-nowrap xl:gap-6 gap-[10px] rounded-none",
    config: [
      {
        className: "",
        heading: "Total Posts",
        metric: (data) => total(data, ["Stories", "Feed", "Reels"]),
        icon: null,
        variation: (data) =>
          calculateVariations(data, ["Stories", "Feed", "Reels"]),
      },
      {
        className: "",
        heading: "Total Stories",
        metric: (data) => total(data, "Stories"),
        icon: (
          <div className="flex items-center justify-center w-5 h-5">
            <TotalStoriesIcon />
          </div>
        ),
        variation: (data) => calculateVariations(data, "Stories"),
      },
      {
        className: "",
        heading: "Total Feed",
        metric: (data) => total(data, "Feed"),
        icon: <TotalFeedIcon />,
        variation: (data) => calculateVariations(data, "Feed"),
      },
      {
        className: "",
        heading: "Total Reels",
        metric: (data) => total(data, "Reels"),
        icon: <TotalReelsIcon />,
        variation: (data) => calculateVariations(data, "Reels"),
      },
    ],
  },
  all: {
    className:
      "flex-shrink-0 w-full xl:h-auto h-min xl:flex grid xl:justify-start xl:items-center grid-cols-metric auto-rows-fr grid-rows-2 p-0 overflow-visible relative content-center flex-nowrap xl:gap-6 gap-[10px] rounded-none",
    config: [
      {
        className: "",
        heading: "Total Posts",
        metric: (data) => total(data, ["Stories", "Feed", "Reels", "Tiktok"]),
        icon: null,
        variation: (data) =>
          calculateVariations(data, ["Stories", "Feed", "Reels", "Tiktok"]),
      },
      {
        className: "",
        heading: "Total Stories",
        metric: (data) => total(data, "Stories"),
        icon: (
          <div className="flex items-center justify-center w-5 h-5">
            <TotalStoriesIcon />
          </div>
        ),
        variation: (data) => calculateVariations(data, "Stories"),
      },
      {
        className: "",
        heading: "Total Feed",
        metric: (data) => total(data, "Feed"),
        icon: <TotalFeedIcon />,
        variation: (data) => calculateVariations(data, "Feed"),
      },
      {
        className: "",
        heading: "Total Reels",
        metric: (data) => total(data, "Reels"),
        icon: <TotalReelsIcon />,
        variation: (data) => calculateVariations(data, "Reels"),
      },
      {
        className: "col-span-2",
        heading: "Total TikToks",
        metric: (data) => total(data, "Tiktok"),
        icon: <TotalTiktokIcon />,
        variation: (data) => calculateVariations(data, "Tiktok"),
      },
    ],
  },
};

const FirstSection = () => {
  const { data } = useDataStore((state) => state.data);
  const mode = useDataStore((state) => state.mode);
  const metrics = metricConfig[mode] || [];

  return (
    <div className="box-border flex-shrink-0 w-full h-min flex flex-col xl:justify-center justify-start items-start xl:px-[22px] px-[15px] overflow-visible relative content-start flex-nowrap xl:gap-[22px] gap-6 rounded-none">
      <div className={metrics?.className}>
        {metrics?.config.map(
          ({ className, heading, metric, icon, variation }) => (
            <Metrics
              className={className}
              key={heading}
              heading={heading}
              metric={metric(data)}
              variation={variation(data)}
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
