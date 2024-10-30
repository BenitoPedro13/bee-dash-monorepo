"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useDataStore, { Influencer, Posts } from "@/store";
import {
  filterDataByDateRange,
  filterPostsDataByDateRange,
  generateShadesAndTints,
  parseDate,
} from "../../utils/utils";
import { useEffect, useState } from "react";

export function Component() {
  const postsData = useDataStore((state) => state.postsData);
  const { user } = useDataStore((state) => state.session);
  const mode = useDataStore((store) => store.mode);
  const dateRange = useDataStore((store) => store.dateRange);

  const [chartDataState, setChartDataState] = useState<
    { month: string; instagram?: number; tiktok?: number }[]
  >([]);

  const mainColor = !user?.color ? "#FF8C00" : user.color; // Assuming user.color is the main color in hex format
  const subVariations = generateShadesAndTints(mainColor, 2);

  const getChartData = (
    data: Posts[]
  ): { month: string; instagram?: number; tiktok?: number }[] => {
    // Reorder weekdays array so "Domingo" is at index 0
    const weekdays = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];

    // Initialize chart data with weekdays
    let chartData = weekdays.map((weekday) => ({
      month: weekday,
      instagram: 0,
      tiktok: 0,
    }));

    filterPostsDataByDateRange(data, +dateRange).forEach((item) => {
      const postDate = new Date(item.postDate); // Parse date using the custom function
      const weekdayIndex = postDate.getDay(); // Get weekday index (0 = Sunday, 1 = Monday, etc.)

      const weekday = weekdays[weekdayIndex]; // Directly map to the correct weekday name

      const chartDataItem = chartData.find(
        (dataItem) => dataItem.month === weekday
      );

      if (chartDataItem) {
        if (mode === "tiktok" || mode === "all") {
          chartDataItem.tiktok! +=
            item.type === "TIKTOK" ? item.impressions : 0;
        }
        if (mode === "instagram" || mode === "all") {
          chartDataItem.instagram! +=
            item.type !== "TIKTOK" ? item.impressions : 0;
        }
      }
    });

    return chartData;
  };

  useEffect(() => {
    const chartData = getChartData(postsData);

    setChartDataState(chartData);
  }, [postsData, mode, dateRange]);

  const chartConfig = {
    instagram: {
      label: "Instagram",
      color: subVariations[0],
    },
    tiktok: {
      label: "TikTok",
      color: subVariations[1],
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} width="100%" height="326px">
      <BarChart accessibilityLayer data={chartDataState} barSize={24}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        {/* <ChartLegend content={<ChartLegendContent />} /> */}
        {["instagram", "all"].includes(mode) && (
          <Bar
            dataKey="instagram"
            stackId="a"
            fill="var(--color-instagram)"
            radius={[0, 0, 24, 24]}
          />
        )}
        {["tiktok", "all"].includes(mode) && (
          <Bar
            dataKey="tiktok"
            stackId="a"
            fill="var(--color-tiktok)"
            radius={[24, 24, 0, 0]}
          />
        )}
      </BarChart>
    </ChartContainer>
  );
}
