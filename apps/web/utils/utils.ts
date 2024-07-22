import { Attachment, Influencer } from "@/store";
import colorConvert from "color-convert";
export type tablekeys = keyof Attachment | keyof Influencer;
export type tablesortDirections = "asc" | "desc";

export function parseUpdatedAt(updatedAt: string) {
  const date = new Date(updatedAt);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export const handleSort = (
  column: string,
  sortColumn: string,
  setSortColumn: any,
  setSortOrder: any
) => {
  if (sortColumn === column) {
    // If the same column is clicked, toggle the sort order
    setSortOrder((prevSortOrder: tablesortDirections) =>
      prevSortOrder === "asc" ? "desc" : "asc"
    );
  } else {
    // If a different column is clicked, set the column and initial sort order
    setSortColumn(column);
    setSortOrder("asc");
  }
};

export const parseCurrencyString = (value: string) => {
  const numericValue = Number(
    value.replace(/[^\d,-]/g, '').replace(',', '.').replace('R$', '').replace('-', '')
  );

  return Number.isNaN(numericValue) ? 0 : numericValue;
};

export const parsePercentageString = (value:string) => {
  const numericValue = parseFloat(value.replace(/[^\d,.]/g, '').replace(',', '.'));
  return Number.isNaN(numericValue) ? 0 : numericValue;
};


export function hexToRgba(hex: string, alpha: number = 1): string {
  const hexPattern = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  const shortHexPattern = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

  const result = hexPattern.exec(hex) || shortHexPattern.exec(hex);

  if (!result) {
    return hexToRgba('#E624CF');
  }

  const [r, g, b] = result.slice(1).map((x) => Number.parseInt(x, 16));
  const alphaValue = alpha >= 0 && alpha <= 1 ? alpha : 1;

  const returnValue = `rgba(${r}, ${g}, ${b}, ${alphaValue})`;

  return returnValue;
}


export function generateShadesAndTints(mainColor: string, count: number): string[] {
  const [r, g, b] = colorConvert.hex.rgb(mainColor);
  const RGB = r + g + b;
  let max = Math.round(RGB / 38.25);
  if (max === 19) max = 20;

  const subVariations = [];

  for (let i = 10; i < max + 10; i++) {
    const f = i / max;
    const adjustedR = Math.min(Math.round(r * f), 255);
    const adjustedG = Math.min(Math.round(g * f), 255);
    const adjustedB = Math.min(Math.round(b * f), 255);

    const hexSubColor = colorConvert.rgb.hex([adjustedR, adjustedG, adjustedB]);
    subVariations.push(`#${hexSubColor}`);
  }

  max = 20 - max +10;
  for (let i = 10; i < max; i++) {
    const f = i / max;
    const adjustedR = Math.min(Math.round((255 - r) * f + r), 255);
    const adjustedG = Math.min(Math.round((255 - g) * f + g), 255);
    const adjustedB = Math.min(Math.round((255 - b) * f + b), 255);

    const hexSubColor = colorConvert.rgb.hex([adjustedR, adjustedG, adjustedB]);
    subVariations.push(`#${hexSubColor}`);
  }

  return subVariations;
}

export const total = (
  data: Influencer[],
  dataKey: keyof Influencer | (keyof Influencer)[],
  currency = false
) => {
  let count = 0;

  if (!Array.isArray(dataKey)) {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      count += Number.parseInt(
        (element[`${dataKey}`] as string).replaceAll(".", "")
      );
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      for (let j = 0; j < dataKey.length; j++) {
        const key = dataKey[j];

        count += Number.parseInt(
          (element[`${key}`] as string).replaceAll(".", "")
        );
      }
    }
  }

  if (!currency) {
    return count.toLocaleString("PT-BR");
  }

  const formattedCount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(count);

  return formattedCount;
};