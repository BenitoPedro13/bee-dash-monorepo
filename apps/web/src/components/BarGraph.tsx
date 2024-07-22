import React, { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  BarElement,
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import useDataStore, { Influencer } from "@/store";
import { generateShadesAndTints, hexToRgba } from "../../utils/utils";
import { GraphTypes } from "./MetricsLineGraph";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const css = `.chartContainer::-webkit-scrollbar {
                    display: none;
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }`;

export default function BarGraph({ typeOfGraph }: {typeOfGraph: GraphTypes}) {
  const { data } = useDataStore((state) => state.data);
  const { user } = useDataStore((state) => state.session);

  const chartRef = useRef(null);

  const mainColor = !user?.color ? '#E624CF' : user.color; // Assuming user.color is the main color in hex format

  const getChartData = (typeOfGraph: GraphTypes, data: Influencer[]) => {
    switch (typeOfGraph) {
      case 'Video Views':
        return data.map((item) =>
          Number.parseInt(item['Video Views'].replaceAll('.', ''))
        );
      case 'Interacoes':
        return data.map((item) =>
          Number.parseInt(item.Interacoes.replaceAll('.', ''))
        );
      case 'Total':
        return data.map((item) =>
          Number.parseInt(item.Interacoes.replaceAll('.', '')) +
          Number.parseInt(item['Video Views'].replaceAll('.', ''))
        );
      default:
        return [];
    }
  };

  const chartData = {
    labels: data.map((item) => item.Influencer),
    datasets: [
      {
        label: typeOfGraph === 'Total' ? 'Interações + Views' : typeOfGraph,
        data: getChartData(typeOfGraph, data), // here the data is set based on typeOfGraph
        fill: 'start',
        borderColor: mainColor,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'bottom'
      },
      background: {
        color: "black",
      },
    },
    elements: {
      point: {
        borderWidth: 0,
        radius: 0,
        backgroundColor: "rgba(0,0,0,0)",
      },
      line: {
        tension: 0.4, // controle da curva das linhas
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    // scales: {
    //   y: {
    //     grid: {
    //       color: "rgba(255, 255,255, 0.2)",
    //       borderColor: "grey",
    //       drawTicks: false,
    //     },
    //     border: {
    //       dash: [6, 4],
    //     },
    //     ticks: {
    //       padding: 24,
    //       maxTicksLimit: 6,
    //     },
    //   },
    //   x: {
    //     grid: {
    //       color: "rgba(255, 255,255, 0)",
    //       borderColor: "transparent",
    //       drawTicks: false,
    //     },
    //     ticks: {
    //       padding: 12,
    //       align: "inner",
    //     },
    //   },
    // },
  };

  useEffect(() => {
    const chartInstance = chartRef.current as any;
    if (chartInstance) {
      const { chartArea, ctx } = chartInstance as any;
      const chartBackgroundColor = !user?.color ? "rgba(255,205,249" : hexToRgba(user.color).split(',', 3).join(',')

      if (chartArea) {
        const gradient = ctx?.createLinearGradient(
          0,
          chartArea.bottom,
          0,
          chartArea.top
        );
        gradient.addColorStop(0, chartBackgroundColor + ", 0)");
        gradient.addColorStop(0.5, chartBackgroundColor + ", 0.4)");
        gradient.addColorStop(1, chartBackgroundColor + ", 1)");

        chartInstance.data.datasets.forEach((dataset: any) => {
          dataset.backgroundColor = gradient;
        });
        chartInstance.update();
      }
    }
  }, [user.color, typeOfGraph]);

  return (
    <>
      <div style={{ display: "grid" }} className="w-full">
        <div
          className="chartContainer"
          style={{
            position: "relative",
            minHeight: "240px",
            maxHeight: "240px",
            overflowX: "auto",
            width: "100%",
          }}
        >
          <Bar
            ref={chartRef}
            id="chart-1"
            data={chartData}
            options={
              {
                ...chartOptions,
                maintainAspectRatio: false,
              } as any
            }
          />
        </div>
      </div>
      <style>{css}</style>
    </>
  );
}
