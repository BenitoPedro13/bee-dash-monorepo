// import { usePathname } from "next/navigation";
// import React, { useCallback, useEffect, useRef } from "react";

// // Função para desenhar um hexágono com um vértice para cima
// const drawHexagon = (
//   ctx: CanvasRenderingContext2D,
//   x: number,
//   y: number,
//   size: number,
//   fill: boolean,
//   color: string
// ) => {
//   const numberOfSides = 6;
//   ctx.beginPath();
//   ctx.moveTo(
//     x + size * Math.cos(Math.PI / 6),
//     y + size * Math.sin(Math.PI / 6)
//   );

//   for (let i = 1; i <= numberOfSides; i++) {
//     ctx.lineTo(
//       x + size * Math.cos((i * 2 * Math.PI) / numberOfSides + Math.PI / 6),
//       y + size * Math.sin((i * 2 * Math.PI) / numberOfSides + Math.PI / 6)
//     );
//   }

//   if (fill) {
//     ctx.fillStyle = color;
//     ctx.fill();
//   }

//   ctx.strokeStyle = color;
//   ctx.lineWidth = 2;
//   ctx.stroke();
// };

// // Função para desenhar o padrão de favo de mel com vértices dos hexágonos para cima
// const drawHoneycomb = (
//   ctx: CanvasRenderingContext2D,
//   rows: number,
//   cols: number,
//   hexSize: number,
//   spacing: number,
//   color: string
// ) => {
//   const hexHeight = 29.5;
//   const hexWidth = 25;

//   for (let row = 0; row < rows; row++) {
//     for (let col = 0; col < cols; col++) {
//       const xOffset = row % 2 === 0 ? 0 : hexWidth / 2;
//       const x = col * (hexWidth + spacing) + xOffset;
//       const y = row * (hexHeight * 0.75 + spacing); // Com espaçamento vertical

//       const fill = (row + col) % 2 === 0;
//       drawHexagon(ctx, x, y, hexSize, fill, color);
//     }
//   }
// };

// const Background = ({ color }: { color: string }) => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const parentRef = useRef<HTMLDivElement | null>(null); // Ref para o elemento pai

//   const resizeCanvas = useCallback(() => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const ctx = canvas.getContext("2d");
//       if (ctx) {
//         const { offsetWidth, offsetHeight } = canvas.parentElement!;
//         canvas.width = offsetWidth;
//         canvas.height = offsetHeight;

//         // Tamanho do hexágono e espaçamento
//         const hexSize = 12.5;
//         const spacing = 2.5;
//         const rows = Math.ceil(canvas.height / (29.5 * 0.75));
//         const cols = Math.ceil(canvas.width / 25);

//         // Limpar o canvas antes de redesenhar
//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         // Desenhar o padrão de favo de mel
//         drawHoneycomb(ctx, rows, cols, hexSize, spacing, color);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const parentElement = parentRef.current;

//     if (canvas && parentElement) {
//       const observer = new ResizeObserver(() => {
//         resizeCanvas();
//       });

//       // Começar a observar o elemento pai
//       observer.observe(parentElement);

//       // Redesenhar o canvas inicialmente
//       resizeCanvas();

//       // Limpeza ao desmontar o componente
//       return () => {
//         observer.disconnect();
//       };
//     }
//   }, [resizeCanvas]);

//   return (
//     <div ref={parentRef} className="absolute z-10 h-full">
//       <canvas
//         ref={canvasRef}
//         style={{ width: "100vw", height: "100%", opacity: 0.1 }}
//       />
//     </div>
//   );
// };

// export default Background;
import { useMediaQuery } from "@uidotdev/usehooks";
import Image from "next/image";
import React from "react";

import BGDesktop from "@/../public/Fundo Desktop.svg";
import BGMobile from "@/../public/Fundo Mobile.svg";

const Background = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  return isDesktop ? (
    <div
      className=" h-full w-full z-10"
      style={{
        width: "100vw",
        height: "100%",
        opacity: 1,
        backgroundImage: 'url("/Fundo Desktop.svg")',
        backgroundRepeat: "repeat-y",
      }}
    ></div>
  ) : (
    <div
      className=" h-full w-full"
      style={{ width: "100vw", height: "100%", opacity: 1 }}
    ></div>
  );
};

export default Background;
