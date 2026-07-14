import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import performanceIcon from "@/../public/performanceIcon.png";
import Image from "next/image";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import CreatorsTableRow from "./PostsCreatorsTableRow";
import useDataStore, { Influencer, Posts } from "@/store";
import {
  generatePastelColor,
  handleSort,
  parseCurrencyString,
  parsePercentageString,
} from "../../../utils/utils";
import TableSortingIcon from "../TableSortingIcon";
import arrowLeft from "@/../public/arrow-left.svg";
import arrowRight from "@/../public/arrow-right.svg";
import PerformanceIcon from "../MetricsIcons/PerformanceIcon";
import { SearchIcon, X } from "lucide-react";
import Link from "next/link";
import PostsCreatorsTableRow from "./PostsCreatorsTableRow";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

// export interface Influencer {
//   id: number;
//   influencer: string;
//   username: string;
//   city: string;
//   posts: string;
//   impressions: string;
//   interactions: string;
//   clicks: string;
//   videoViews: string;
//   cpe: string;
//   ctr: string;
//   cpc: string;
//   cpv: string;
//   createdAt: string;
//   updatedAt: string;
// }

const PostsCreatorsTable = ({ globalData }: { globalData: Posts[] }) => {
  // const { data: globalData } = useDataStore((state) => state.data);

  const { campaigns, color } = useDataStore((state) => state.session.user);
  const hexColor =
    color === undefined ? "#FF8C00" : color.length !== 7 ? "#FF8C00" : color;
  const [data, setData] = useState(globalData);
  const [currentPage, setCurrentPage] = useState(1);
  // const [searchOpen, setSearchOpen] = useState(false);
  // const [search, setSearch] = useState("");
  const itemsPerPage = 6;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [currentData, setCurrentData] = useState(
    data.slice(indexOfFirstItem, indexOfLastItem)
  );

  // const [open, setOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Initial sort order
  const [sortColumn, setSortColumn] = useState<keyof Posts>("id"); // Initial sort column

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [headerOffset, setHeaderOffset] = useState(0);
  const [headerWidth, setHeaderWidth] = useState(0);
  const pastelColor = generatePastelColor(hexColor);

  // const toggleOpen = () => setOpen(!open);
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    // Update attachments whenever globalAttachments changes
    setData(globalData);
  }, [globalData]);

  const hasBounced = useRef(false); // Track if bounce has already been triggered

  const handleScroll = () => {
    if (tableContainerRef.current) {
      setHeaderWidth(tableContainerRef.current.getBoundingClientRect().width);
      const difference =
        headerWidth === 0
          ? 1374.91 - tableContainerRef.current.getBoundingClientRect().width
          : tableContainerRef.current.getBoundingClientRect().width -
            tableContainerRef.current.getBoundingClientRect().width;
      if (tableContainerRef.current.scrollLeft < difference) {
        setHeaderOffset(tableContainerRef.current.scrollLeft);
      }
    }
  };

  const handleScrollEnd = () => {
    if (tableContainerRef.current) {
      setHeaderWidth(tableContainerRef.current.getBoundingClientRect().width);
      setHeaderOffset(tableContainerRef.current.scrollLeft);

      hasBounced.current = true; // Set bounce flag to prevent repeated bounces
      // Apply smooth bounce effect
      if (!hasBounced.current) {
        tableContainerRef.current.scrollBy({ left: -10, behavior: "smooth" });
        // Bounce back to the right
        setTimeout(() => {
          tableContainerRef.current?.scrollBy({ left: 10, behavior: "smooth" });
        }, 100);

        // Reset the bounce flag after the bounce completes
        setTimeout(() => {
          hasBounced.current = false;
        }, 500);
      }
    }
  };

  // Adding scroll, scrollend, and resize event listeners
  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      setHeaderWidth(tableContainerRef.current.getBoundingClientRect().width);
      container.addEventListener("scroll", handleScroll);
      container.addEventListener("scrollend", handleScrollEnd);
      window.addEventListener("resize", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
        container.removeEventListener("scrollend", handleScrollEnd);
        window.removeEventListener("resize", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const sortedData = data.sort((a, b) => {
      switch (sortColumn) {
        case "type":
          return a[sortColumn].localeCompare(b[sortColumn]);

        case "id":
        case "impressions":
        case "likes":
        case "shares":
        case "comments":
        case "saves":
        case "stickerClicks":
        case "linkClicks":
          // case "Cliques":
          // case "Video Views":
          // case "Cliques Tiktok":
          // case "Impressoes Tiktok":
          // case "Impacto Bruto":
          // case "Impacto Bruto Tiktok":
          // case "Interacoes Tiktok":
          return a[sortColumn] - b[sortColumn];

        // case "Engajamento":
        // case "Engajamento Tiktok":
        // case "CTR Tiktok":
        // case "CTR":
        //   return (
        //     parsePercentageString(a[sortColumn]) -
        //     parsePercentageString(b[sortColumn])
        //   );

        // case "CPE":
        // case "CPC":
        // case "CPV":
        //   return (
        //     parseCurrencyString(a[sortColumn]) -
        //     parseCurrencyString(b[sortColumn])
        //   );

        case "postDate":
          return (
            new Date(a[sortColumn]).getTime() -
            new Date(b[sortColumn]).getTime()
          );

        default:
          return 0;
      }
    });

    if (sortOrder === "desc") {
      sortedData.reverse();
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    setCurrentData(currentData);
  }, [data, sortColumn, sortOrder, currentPage, itemsPerPage]);

  return (
    <div className="box-border lg:w-[calc(100%)] w-full flex flex-col justify-start items-start self-stretch bg-white overflow-hidden p-0 content-start flex-nowrap gap-0 rounded-3xl border border-[#D4D4D4]">
      <div className="flex-shrink-0 w-full h-min flex flex-col justify-start items-start  self-stretch overflow-visible relative p-0 content-start flex-nowrap sm:gap-5 gap-0 rounded-none">
        <div className="flex flex-col items-start self-stretch">
          <div className="flex px-5 py-6 items-start gap-4 self-stretch">
            <div className="flex flex-col justify-center items-start gap-1 flex-grow self-stretch">
              <h3 className="font-nexa-bold text-lg font-semibold text-[#101828] self-stretch">
                Posts
              </h3>
              <p className="font-nexa text-sm text-[#475467] self-stretch">
                Métricas úteis de cada post
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="overflow-x-auto w-full border-t border-gray relative"
        ref={tableContainerRef}
      >
        {/* <div
          id="table-header-clip"
          className="absolute top-0 h-[28.5px] min-w-[1374.91px] left-0 bg-transparent z-30 pointer-events-none"
          style={{
            boxShadow: "0 0 0 10px white",
            margin: "10px",
            width: `${headerWidth}px`,
            // transform: `translateX(${headerOffset}px)`,
          }}
        ></div>
        <div
          id="table-header-clip"
          className="absolute top-0 h-[28.5px] right-0 bg-transparent w-[calc(100%-20px)] z-40 rounded-md  pointer-events-none"
          style={{
            boxShadow: "0 0 0 10px white",
            margin: "10px",
            transform: `translateX(${headerOffset}px)`,
          }}
        >
          <div className="flex justify-between w-full h-full relative">
            <div className={"bg-white w-96 h-full absolute -left-96 "}></div>
            <div
              className={
                "bg-white w-96 h-full absolute -right-96 " +
                (hasBounced.current ? "!w-10 !-right-10" : "block")
              }
            ></div>
          </div>
        </div> */}
        <table className="table">
          <thead className="sticky top-0 bg-white">
            <tr
              className="border-box flex-shrink-0 w-full h-min bg-white overflow-visible relative content-center flex-nowrap gap-[5px] rounded-none border-b border-[#eaecf0]"
              // style={{
              //   background: pastelColor,
              // }}
            >
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("id", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Post
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"id"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("type", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Tipo de Post
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"type"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "impressions",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Impressões
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"impressions"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("likes", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Likes
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"likes"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("shares", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Compartilhados
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"shares"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "comments",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Comentários
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"comments"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("saves", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Salvos
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"saves"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "stickerClicks",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Cliques Figurinhas
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"stickerClicks"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "linkClicks",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Cliques no Link
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"linkClicks"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "postDate",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Data de Postagem
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"postDate"}
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => {
              return <PostsCreatorsTableRow data={item} key={`${item.id}`} />;
            })}
          </tbody>
        </table>
      </div>
      <div
        className={`${
          data.length / itemsPerPage < 1 ? "hidden" : "flex"
        } flex-shrink-0 w-full h-min flex flex-col justify-center items-center overflow-visible relative pt-3 pb-4 px-6 content-center flex-nowrap sm:gap-5 gap-2 self-stretch rounded-none border-t border-[#EAECF0]`}
      >
        <div className="flex items-start rounded-lg border border-[#D0D5DD] shadow-cost-per-metrics">
          <div className="xl:inline-flex hidden join w-full justify-center items-center">
            <button
              className="join-item h-10 flex py-[10px] px-4 justify-center items-center gap-2 bg-white border-t-0 border-b-0 border-l-0 border-r-[2px] border-[#D0D5DD]"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <Image src={arrowLeft} width={20} height={20} alt="Arrow Left" />
              <p className="text-[#344054] text-sm font-semibold">Anterior</p>
            </button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`join-item  flex w-10 max-h-10 p-[10px] flex-col justify-center items-center border-t-0 border-b-0 border-l-0 border-r-[2px] border-[#D0D5DD] ${
                  currentPage === index + 1 ? "!bg-[#F9FAFB]" : "bg-white"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                <p className="text-[#344054] text-sm font-semibold">
                  {" "}
                  {index + 1}
                </p>
              </button>
            ))}
            <button
              className="join-item h-10 flex py-[10px] px-4 justify-center items-center gap-2 bg-white border-0 border-[#D0D5DD]"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <p className="text-[#344054] text-sm font-semibold">Proximo</p>
              <Image
                src={arrowRight}
                width={20}
                height={20}
                alt="Arrow Right"
              />
            </button>
          </div>
          <div className="inline-flex xl:hidden join w-full justify-center items-center">
            <button
              className="join-item h-10 flex py-[10px] px-4 justify-center items-center gap-2 bg-white border-t-0 border-b-0 border-l-0 border-r-[2px] border-[#D0D5DD]"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <Image src={arrowLeft} width={20} height={20} alt="Arrow Left" />
            </button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`join-item  flex w-10 max-h-10 p-[10px] flex-col justify-center items-center border-t-0 border-b-0 border-l-0 border-r-[2px] border-[#D0D5DD] ${
                  currentPage === index + 1 ? "!bg-[#F9FAFB]" : "bg-white"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                <p className="text-[#344054] text-sm font-semibold">
                  {" "}
                  {index + 1}
                </p>
              </button>
            ))}
            <button
              className="join-item h-10 flex py-[10px] px-4 justify-center items-center gap-2 bg-white border-0 border-[#D0D5DD]"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <Image
                src={arrowRight}
                width={20}
                height={20}
                alt="Arrow Right"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostsCreatorsTable;
