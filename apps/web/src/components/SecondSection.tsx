"use client";

import useDataStore, { DashboardMode, Influencer } from "@/store";
import {
  costPerMetric,
  total,
  totalCount,
  totalCPE,
  totalPercentage,
} from "../../utils/utils";
import CostPerMetric from "./CostPerMetric";
import Metrics from "./Metrics";

// const metricConfig: Record<
//   DashboardMode,
//   {
//     heading: string;
//     metric: (data: Influencer[]) => string;
//     icon: JSX.Element | null;
//     variation?: number;
//   }[]
// > = {
//   tiktok: [
//     {
//       heading: "Total Posts",
//       metric: (data) => total(data, ["Stories", "Feed", "Reels", "Tiktok"]),
//       icon: null,
//       variation: 20.1,
//     },
//     {
//       heading: "Total TikToks",
//       metric: (data) => total(data, "Tiktok"),
//       icon: <TotalTiktokIcon />,
//       variation: -20.1,
//     },
//   ],
//   instagram: [
//     {
//       heading: "Total Posts",
//       metric: (data) => total(data, ["Stories", "Feed", "Reels", "Tiktok"]),
//       icon: null,
//       variation: -20.1,
//     },
//     {
//       heading: "Total Stories",
//       metric: (data) => total(data, "Stories"),
//       icon: (
//         <div className="flex items-center justify-center w-5 h-5">
//           <TotalStoriesIcon />
//         </div>
//       ),
//       variation: 20,
//     },
//     {
//       heading: "Total Feed",
//       metric: (data) => total(data, "Feed"),
//       icon: <TotalFeedIcon />,
//       variation: -20.1,
//     },
//     {
//       heading: "Total Reels",
//       metric: (data) => total(data, "Reels"),
//       icon: <TotalReelsIcon />,
//       variation: 20,
//     },
//   ],
//   all: [
//     {
//       heading: "Total Posts",
//       metric: (data) => total(data, ["Stories", "Feed", "Reels", "Tiktok"]),
//       icon: null,
//       variation: 20,
//     },
//     {
//       heading: "Total Stories",
//       metric: (data) => total(data, "Stories"),
//       icon: (
//         <div className="flex items-center justify-center w-5 h-5">
//           <TotalStoriesIcon />
//         </div>
//       ),
//       variation: 0,
//     },
//     {
//       heading: "Total Feed",
//       metric: (data) => total(data, "Feed"),
//       icon: <TotalFeedIcon />,
//       variation: 20,
//     },
//     {
//       heading: "Total Reels",
//       metric: (data) => total(data, "Reels"),
//       icon: <TotalReelsIcon />,
//       variation: -20.1,
//     },
//     {
//       heading: "Total TikToks",
//       metric: (data) => total(data, "Tiktok"),
//       icon: <TotalTiktokIcon />,
//       variation: 13.1,
//     },
//   ],
// };

const SecondSection = () => {
  const { data } = useDataStore((state) => state.data);

  return (
    <div className="w-full flex-shrink-0 h-min flex flex-col justify-start items-start overflow-visible relative xl:px-[22px] p-0 content-start flex-nowrap gap-6 rounded-none">
      <div className="box-border flex-shrink-0 w-full h-min flex flex-col justify-start items-start xl:p-0 px-[15px] overflow-visible relative content-start flex-nowrap xl:gap-[22px] gap-6 rounded-none">
        <div className="flex-shrink-0 flex-grow xl:flex-grow-0 w-full h-min flex xl:flex-row flex-col justify-start items-center overflow-visible relative p-0 content-center flex-nowrap xl:gap-6 gap-[15px] rounded-none">
          <CostPerMetric
            heading="Engajamento Médio"
            metric={totalPercentage(data, "Engajamento")}
            variation={12.1}
          />
          <CostPerMetric
            sigla={["Total", "CPC"]}
            heading="Cliques no Link"
            metric={total(data, "Cliques")}
            costPerMetric={costPerMetric(
              data,
              "Cliques",
              totalCount(data, "Investimento")
            )}
            variation={12.1}
          />
          <CostPerMetric
            sigla={["Total", "CPV"]}
            heading="Custo por Mil Views"
            metric={total(data, "Video Views")}
            costPerMetric={costPerMetric(
              data,
              "Video Views",
              totalCount(data, "Investimento")
            )}
            variation={12.1}
          />
          <CostPerMetric
            heading="Investimento Total"
            metric={total(data, "Investimento", true)}
          />
        </div>
      </div>
    </div>
  );
};

export default SecondSection;
