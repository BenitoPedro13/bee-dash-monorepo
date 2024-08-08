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
    heading: string;
    metric: (data: Influencer[]) => string;
    icon: JSX.Element | null;
    variation: (data: Influencer[]) => Record<DashbordDateRange, number>;
  }[]
> = {
  tiktok: [
    {
      heading: "Total Posts",
      metric: (data) => total(data, "Tiktok"),
      icon: null,
      variation: (data) => calculateVariations(data, "Tiktok"),
    },
    {
      heading: "Total TikToks",
      metric: (data) => total(data, "Tiktok"),
      icon: <TotalTiktokIcon />,
      variation: (data) => calculateVariations(data, "Tiktok"),
    },
  ],
  instagram: [
    {
      heading: "Total Posts",
      metric: (data) => total(data, ["Stories", "Feed", "Reels"]),
      icon: null,
      variation: (data) =>
        calculateVariations(data, ["Stories", "Feed", "Reels"]),
    },
    {
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
      heading: "Total Feed",
      metric: (data) => total(data, "Feed"),
      icon: <TotalFeedIcon />,
      variation: (data) => calculateVariations(data, "Feed"),
    },
    {
      heading: "Total Reels",
      metric: (data) => total(data, "Reels"),
      icon: <TotalReelsIcon />,
      variation: (data) => calculateVariations(data, "Reels"),
    },
  ],
  all: [
    {
      heading: "Total Posts",
      metric: (data) => total(data, ["Stories", "Feed", "Reels", "Tiktok"]),
      icon: null,
      variation: (data) =>
        calculateVariations(data, ["Stories", "Feed", "Reels", "Tiktok"]),
    },
    {
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
      heading: "Total Feed",
      metric: (data) => total(data, "Feed"),
      icon: <TotalFeedIcon />,
      variation: (data) => calculateVariations(data, "Feed"),
    },
    {
      heading: "Total Reels",
      metric: (data) => total(data, "Reels"),
      icon: <TotalReelsIcon />,
      variation: (data) => calculateVariations(data, "Reels"),
    },
    {
      heading: "Total TikToks",
      metric: (data) => total(data, "Tiktok"),
      icon: <TotalTiktokIcon />,
      variation: (data) => calculateVariations(data, "Tiktok"),
    },
  ],
};

const FirstSection = () => {
  const { data } = useDataStore((state) => state.data);
  const mode = useDataStore((state) => state.mode);
  const metrics = metricConfig[mode] || [];

  return (
    <div className="box-border flex-shrink-0 w-full xl:h-[117px] h-min flex flex-col xl:justify-center justify-start items-start xl:px-[22px] px-[15px] overflow-visible relative content-start flex-nowrap xl:gap-[22px] gap-6 rounded-none">
      <div className="flex-shrink-0 w-full xl:h-auto h-min xl:flex grid xl:justify-start xl:items-center grid-cols-metric auto-rows-fr grid-rows-2 p-0 overflow-visible relative content-center flex-nowrap xl:gap-6 gap-[10px] rounded-none">
        {metrics.map(({ heading, metric, icon, variation }) => (
          <Metrics
            key={heading}
            heading={heading}
            metric={metric(data)}
            variation={variation(data)}
          >
            {icon}
          </Metrics>
        ))}
      </div>
    </div>
  );
};

export default FirstSection;
