"use client";

import useDataStore, { DashboardMode, Influencer } from "@/store";
import Metrics from "./Metrics";
import { total } from "../../utils/utils";
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
    variation?: number;
  }[]
> = {
  tiktok: [
    {
      heading: "Total Posts",
      metric: (data) => total(data, ["Stories", "Feed", "Reels", "Tiktok"]),
      icon: null,
      variation: 20.1,
    },
    {
      heading: "Total TikToks",
      metric: (data) => total(data, "Tiktok"),
      icon: <TotalTiktokIcon />,
      variation: -20.1,
    },
  ],
  instagram: [
    {
      heading: "Total Posts",
      metric: (data) => total(data, ["Stories", "Feed", "Reels", "Tiktok"]),
      icon: null,
      variation: -20.1,
    },
    {
      heading: "Total Stories",
      metric: (data) => total(data, "Stories"),
      icon: (
        <div className="flex items-center justify-center w-5 h-5">
          <TotalStoriesIcon />
        </div>
      ),
      variation: 20,
    },
    {
      heading: "Total Feed",
      metric: (data) => total(data, "Feed"),
      icon: <TotalFeedIcon />,
      variation: -20.1,
    },
    {
      heading: "Total Reels",
      metric: (data) => total(data, "Reels"),
      icon: <TotalReelsIcon />,
      variation: 20,
    },
  ],
  all: [
    {
      heading: "Total Posts",
      metric: (data) => total(data, ["Stories", "Feed", "Reels", "Tiktok"]),
      icon: null,
      variation: 20,
    },
    {
      heading: "Total Stories",
      metric: (data) => total(data, "Stories"),
      icon: (
        <div className="flex items-center justify-center w-5 h-5">
          <TotalStoriesIcon />
        </div>
      ),
      variation: 20,
    },
    {
      heading: "Total Feed",
      metric: (data) => total(data, "Feed"),
      icon: <TotalFeedIcon />,
      variation: 20,
    },
    {
      heading: "Total Reels",
      metric: (data) => total(data, "Reels"),
      icon: <TotalReelsIcon />,
      variation: -20.1,
    },
    {
      heading: "Total TikToks",
      metric: (data) => total(data, "Tiktok"),
      icon: <TotalTiktokIcon />,
      variation: 13.1,
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
            variation={variation}
          >
            {icon}
          </Metrics>
        ))}
      </div>
    </div>
  );
};

export default FirstSection;
