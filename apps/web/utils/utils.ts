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
    value
      .replace(/[^\d,-]/g, "")
      .replace(",", ".")
      .replace("R$", "")
      .replace("-", "")
  );

  return Number.isNaN(numericValue) ? 0 : numericValue;
};

export const parsePercentageString = (value: string) => {
  const numericValue = parseFloat(
    value.replace(/[^\d,.]/g, "").replace(",", ".")
  );
  return Number.isNaN(numericValue) ? 0 : numericValue;
};

export function hexToRgba(hex: string, alpha: number = 1): string {
  const hexPattern = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  const shortHexPattern = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

  const result = hexPattern.exec(hex) || shortHexPattern.exec(hex);

  if (!result) {
    return hexToRgba("#E624CF");
  }

  const [r, g, b] = result.slice(1).map((x) => Number.parseInt(x, 16));
  const alphaValue = alpha >= 0 && alpha <= 1 ? alpha : 1;

  const returnValue = `rgba(${r}, ${g}, ${b}, ${alphaValue})`;

  return returnValue;
}

export function generateShadesAndTints(mainColor: string, count: number) {
  const [r, g, b] = colorConvert.hex.rgb(mainColor);

  const subVariations = [];
  const step = 1 / (count + 1);

  // Generate shades by darkening the color
  for (let i = 1; i <= count; i++) {
    const factor = 1 - i * step;
    const adjustedR = Math.round(r * factor);
    const adjustedG = Math.round(g * factor);
    const adjustedB = Math.round(b * factor);

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

      if (dataKey === "Reels") {
        count += Number.parseInt("2".replaceAll(".", ""));
      } else {
        count += Number.parseInt(
          (element[`${dataKey}`] as string).replaceAll(".", "")
        );
      }
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      for (let j = 0; j < dataKey.length; j++) {
        const key = dataKey[j];

        if (key === "Reels") {
          count += Number.parseInt("2".replaceAll(".", ""));
        } else {
          count += Number.parseInt(
            (element[`${key}`] as string).replaceAll(".", "")
          );
        }
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

export const totalInfluencers = (data: Influencer[]) => `${data.length}`;

export const totalCount = (data: Influencer[], dataKey: keyof Influencer) => {
  let count = 0;

  for (let i = 0; i < data.length; i++) {
    const element = data[i];

    count += Number.parseInt(
      (element[`${dataKey}`] as string).replaceAll(".", "")
    );
  }

  return count;
};

export const totalPercentage = (
  data: Influencer[],
  dataKey: keyof Influencer
) => {
  let count = 0;

  for (let i = 0; i < data.length; i++) {
    const element = data[i];

    count += Number.parseFloat(
      (element[`${dataKey}`] as string).replaceAll(",", ".").replaceAll("%", "")
    );
  }

  const formattedCount = new Intl.NumberFormat("pt-BR").format(
    +(count / +totalInfluencers(data)).toFixed(2)
  ); // Divide by number of influencers

  return `${formattedCount}%`;
};

export const totalCPE = (data: Influencer[], dataKey: keyof Influencer) => {
  let count = 0;

  for (let i = 0; i < data.length; i++) {
    const element = data[i];

    count += Number.parseFloat(
      (element[`${dataKey}`] as string)
        .replaceAll("R$", "")
        .replaceAll(",", ".")
    );
  }

  const formattedCount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(+(count / +totalInfluencers(data)).toFixed(2));

  return formattedCount;
};

export const costPerMetric = (
  data: Influencer[],
  dataKey: keyof Influencer,
  cost: number
) => {
  let count = 0;

  for (let i = 0; i < data.length; i++) {
    const element = data[i];

    count += Number.parseInt(
      (element[`${dataKey}`] as string).replaceAll(".", "")
    );
  }

  return (cost / count).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export function addAlphaToHex(hex: string, alpha: number) {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, "");

  // Convert 3-digit hex to 6-digit hex
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((x) => x + x)
      .join("");
  }

  // Ensure the hex is 6 digits long
  if (hex.length !== 6) {
    throw new Error("Invalid hex color format.");
  }

  // Convert the alpha value from a float to a two-digit hex number
  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();

  console.log(`#${hex}${alphaHex}`);

  // Return the combined hex color with alpha
  return `#${hex}${alphaHex}`;
}
