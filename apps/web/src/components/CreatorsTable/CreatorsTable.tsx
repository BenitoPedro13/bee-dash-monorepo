import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import performanceIcon from "@/../public/performanceIcon.png";
import Image from "next/image";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import CreatorsTableRow from "./CreatorsTableRow";
import useDataStore, { Influencer } from "@/store";
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
import { set } from "react-hook-form";

const inter = Inter({ subsets: ["latin"] });

const CreatorsTable = () => {
  const { data: globalData } = useDataStore((state) => state.data);
  const { campaigns, color, email } = useDataStore(
    (state) => state.session.user
  );
  const hexColor =
    color === undefined ? "#FF8C00" : color.length !== 7 ? "#FF8C00" : color;
  const [data, setData] = useState([...globalData]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const itemsPerPage = 6;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [currentData, setCurrentData] = useState(
    data.slice(indexOfFirstItem, indexOfLastItem)
  );

  // const [open, setOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Initial sort order
  const [sortColumn, setSortColumn] = useState<keyof Influencer>("Influencer"); // Initial sort column

  // Ref for the scrollable table container
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [headerOffset, setHeaderOffset] = useState(0);

  // const pastelColor = generatePastelColor(hexColor);

  // const toggleOpen = () => setOpen(!open);
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const hasBounced = useRef(false); // Track if bounce has already been triggered

  const handleScroll = () => {
    if (tableContainerRef.current) {
      const difference =
        2938.28 - tableContainerRef.current.getBoundingClientRect().width;
      if (tableContainerRef.current.scrollLeft < difference) {
        setHeaderOffset(tableContainerRef.current.scrollLeft);
      }
    }
  };

  const handleScrollEnd = () => {
    if (tableContainerRef.current) {
      setHeaderOffset(tableContainerRef.current.scrollLeft);

      hasBounced.current = true; // Set bounce flag to prevent repeated bounces
      // Apply smooth bounce effect
      if (!hasBounced.current) {
        tableContainerRef.current.scrollBy({ left: -10, behavior: "smooth" });
        // Bounce back to the right
        setTimeout(() => {
          tableContainerRef.current?.scrollBy({ left: 10, behavior: "smooth" });
        }, 100);
      }

      // Reset the bounce flag after the bounce completes
      setTimeout(() => {
        hasBounced.current = false;
      }, 500);
    }
  };

  // Adding scroll, scrollend, and resize event listeners
  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
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
    // Update attachments whenever globalAttachments changes
    setData([...globalData]);
  }, [globalData]);

  useEffect(() => {
    if (search.length > 0) {
      const filteredData = data.filter((item) =>
        item.Influencer.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      );
      return setData(filteredData);
    }
    setData([...globalData]);
  }, [search]);

  useEffect(() => {
    const sortedData = data.sort((a, b) => {
      switch (sortColumn) {
        case "Influencer":
        case "Cidade":
          return a[sortColumn].localeCompare(b[sortColumn]);

        case "Investimento":
        case "Cadastros":
        case "Posts":
        case "Stories":
        case "Reels":
        case "Feed":
        case "Tiktok":
        case "Impressoes":
        case "Interacoes":
        case "Cliques":
        case "Video Views":
        case "Cliques Tiktok":
        case "Impressoes Tiktok":
        case "Impacto Bruto":
        case "Impacto Bruto Tiktok":
        case "Interacoes Tiktok":
          return parseInt(a[sortColumn]) - parseInt(b[sortColumn]);

        case "Engajamento":
        case "Engajamento Tiktok":
        case "CTR Tiktok":
        case "CTR":
          return (
            parsePercentageString(a[sortColumn]) -
            parsePercentageString(b[sortColumn])
          );

        case "CPE":
        case "CPC":
        case "CPV":
          return (
            parseCurrencyString(a[sortColumn]) -
            parseCurrencyString(b[sortColumn])
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
    <div className="box-border lg:w-[calc(100%-384px)] w-full flex flex-col justify-start items-start self-stretch bg-white overflow-hidden p-0 content-start flex-nowrap gap-0 rounded-3xl border border-[#D4D4D4]">
      <div className="flex-shrink-0 w-full h-min flex flex-col justify-start items-start  self-stretch overflow-visible relative p-0 content-start flex-nowrap sm:gap-5 gap-0 rounded-none">
        <div className="flex flex-col items-start self-stretch">
          <div className="flex px-5 py-6 items-start gap-4 self-stretch">
            <div className="flex flex-col justify-center items-start gap-1 flex-grow self-stretch">
              <h3 className="font-nexa-bold text-lg font-semibold text-[#101828] self-stretch">
                Seus Criadores
              </h3>
              <p className="font-nexa text-sm text-[#475467] self-stretch">
                Veja a performance que cada criador está tendo
              </p>
            </div>

            <div className="w-fit flex flex-col items-start gap-[6px]">
              <div className="w-full flex items-center gap-2">
                <div className="w-full flex flex-col items-start gap-[6px] flex-grow flex-shrink-0">
                  <div
                    className={`w-full flex ${
                      searchOpen ? "py-[5px] pr-14 pl-3" : "px-2 py-2"
                    } items-center gap-1 self-stretch rounded-lg border border-[#E2E8F0] ${
                      searchOpen ? "border-[1px]" : "border-[0px]"
                    } transition-all `}
                  >
                    <div className="cursor-pointer">
                      {searchOpen ? (
                        <X
                          onClick={() => {
                            setSearch("");
                            setSearchOpen(() => false);
                          }}
                          className="w-5 h-5 text-[#64748B]"
                        />
                      ) : (
                        <SearchIcon
                          onClick={() => setSearchOpen(() => true)}
                          className="w-5 h-5 text-[#64748B]"
                        />
                      )}
                    </div>

                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Procure por creators..."
                      className={`w-full outline-none text-sm leading-6 font-nexa bg-white text-[#101828] ${
                        searchOpen ? "flex" : "hidden"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Link
              href={campaigns[0]?.urlTable ?? "#"}
              target="_blank"
              className="flex py-2 px-4 justify-center items-center gap-[10px] rounded-lg"
              style={{
                backgroundColor: hexColor,
              }}
            >
              <p className="text-white opacity-95 font-nexa-bold text-sm font-semibold">
                Abrir Planilha
              </p>
            </Link>
          </div>
        </div>
      </div>
      <div
        className="overflow-x-auto w-full border-t border-gray relative"
        ref={tableContainerRef}
      >
        <div
          id="table-header-clip"
          className="absolute top-0 h-[28.5px] left-0 bg-transparent w-[2938.28px] z-30 pointer-events-none"
          style={{
            boxShadow: "0 0 0 10px white",
            margin: "10px",
            // width: `${headerWidth}px`,
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
        </div>
        <table className="table">
          <thead className="sticky top-0 bg-white z-20">
            <tr
              className="border-box flex-shrink-0 w-full h-min overflow-visible bg-[#f8f9fb] relative content-center flex-nowrap gap-[5px] rounded-none border-b border-[#eaecf0]"
              // style={{
              //   background: pastelColor,
              // }}
            >
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "Influencer",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Creator
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Influencer"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("Cidade", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Cidade
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Cidade"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "Investimento",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Investimento
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Investimento"}
                  />
                </div>
              </th>
              {email === "bitybank1@thatsbee.co" && (
                <th
                  className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                  onClick={() =>
                    handleSort(
                      "Cadastros",
                      sortColumn,
                      setSortColumn,
                      setSortOrder
                    )
                  }
                >
                  <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                    Cadastros
                    <TableSortingIcon
                      sortColumn={sortColumn}
                      sortOrder={sortOrder}
                      actualColumn={"Cadastros"}
                    />
                  </div>
                </th>
              )}
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("Posts", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Publicações
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Posts"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("Reels", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Reels
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Reels"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("Stories", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Stories
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Stories"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("Feed", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Feed
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Feed"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("Tiktok", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  TikTok
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Tiktok"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "Impacto Bruto",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Impacto
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Impacto Bruto"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "Impressoes",
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
                    actualColumn={"Impressoes"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "Interacoes",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Interações
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Interacoes"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("Cliques", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Cliques
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Cliques"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "Engajamento",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Engajamento
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Engajamento"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "Impacto Bruto Tiktok",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Impacto Tiktok
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Impacto Bruto Tiktok"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "Impressoes Tiktok",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Impressões Tiktok
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Impressoes Tiktok"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "Interacoes Tiktok",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Interações Tiktok
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Interacoes Tiktok"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "Cliques Tiktok",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Cliques Tiktok
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Cliques Tiktok"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "Engajamento Tiktok",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Engajamento Tiktok
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Engajamento Tiktok"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("CTR", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  CTR
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"CTR"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("CPV", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  CPV
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"CPV"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "CTR Tiktok",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  CTR Tiktok
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"CTR Tiktok"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[300px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "CPV Tiktok",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  CPV Tiktok
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"CPV Tiktok"}
                  />
                </div>
              </th>
              <th
                className={`flex-shrink-0 w-auto h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
              >
                ...
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => {
              return (
                <CreatorsTableRow
                  data={item}
                  key={`${item.Username}-${index}`}
                  userEmail={email}
                />
              );
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

export default CreatorsTable;
