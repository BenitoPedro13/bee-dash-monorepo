import useDataStore, { Influencer } from "@/store";
import {
  filterDataByDateRange,
  generateShadesAndTints,
  generateShadesAndTintsRandomly,
} from "../../utils/utils";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "./ui/chart";
import { Pie, PieChart } from "recharts";
import { useEffect, useState } from "react";

export default function DoughnutGraph() {
  const { data } = useDataStore((state) => state.data);
  const { user } = useDataStore((state) => state.session);

  const mode = useDataStore((store) => store.mode);
  const dateRange = useDataStore((store) => store.dateRange);

  const [chartDataState, setChartDataState] = useState<
    { influencer: string; Impressoes: number; fill: string }[]
  >([]);

  const mainColor = !user?.color ? "#FF8C00" : user.color; // Assuming user.color is the main color in hex format
  const subVariations = generateShadesAndTintsRandomly(mainColor, data.length);

  const chartConfig = {
    desktop: {
      label: "Impacto Bruto",
      color: "#FF5100",
    },
  } satisfies ChartConfig;

  const getChartData = (data: Influencer[]) => {
    return filterDataByDateRange(data, +dateRange).map((item, index) => {
      let metric: number = 0;

      if (mode === "all") {
        metric =
          Number.parseFloat(item["Impacto Bruto"]) +
          Number.parseFloat(item["Impacto Bruto Tiktok"]);
      } else if (mode === "tiktok") {
        metric = Number.parseFloat(item["Impacto Bruto Tiktok"]);
      } else if (mode === "instagram") {
        metric = Number.parseFloat(item["Impacto Bruto"]);
      }

      return {
        influencer: item.Influencer,
        Impressoes: metric,
        fill: subVariations[index],
      };
    });
  };

  useEffect(() => {
    const chartData = getChartData(data);
    // console.log("chartData", chartData);
    setChartDataState(chartData);
  }, [data, mode, dateRange]);

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-square"
      width="274px"
      height="274px"
    >
      <PieChart>
        <ChartTooltip
          cursor={true}
          content={<ChartTooltipContent className="w-[180px]" />}
        />
        <Pie
          data={chartDataState}
          dataKey="Impressoes"
          nameKey="influencer"
          innerRadius={80}
          outerRadius={135}
        />
        {/* <ChartLegend content={<ChartLegendContent />} /> */}
      </PieChart>
    </ChartContainer>
  );
}
