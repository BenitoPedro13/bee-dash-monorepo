import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import performanceIcon from "@/../public/performanceIcon.png";
import Image from "next/image";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import CreatorsTableRow from "./CreatorsTableRow";
import useDataStore, { Influencer } from "@/store";
import { handleSort, parseCurrencyString, parsePercentageString } from "../../../utils/utils";
import TableSortingIcon from "../TableSortingIcon";
import arrowLeft from "@/../public/arrow-left.svg";
import arrowRight from "@/../public/arrow-right.svg";
import PerformanceIcon from "../MetricsIcons/PerformanceIcon";

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

const CreatorsTable = () => {
  const { data: globalData } = useDataStore((state) => state.data);
  const [data, setData] = useState([...globalData]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [currentData, setCurrentData] = useState(
    data.slice(indexOfFirstItem, indexOfLastItem)
  );

  // const [open, setOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Initial sort order
  const [sortColumn, setSortColumn] = useState<keyof Influencer>("Influencer"); // Initial sort column

  // const toggleOpen = () => setOpen(!open);
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    // Update attachments whenever globalAttachments changes
    setData([...globalData]);
  }, [globalData]);

  useEffect(() => {
    const sortedData = data.sort((a, b) => {
      switch (sortColumn) {
        case "Influencer":
        case "Cidade":
          return a[sortColumn].localeCompare(b[sortColumn]);
    
        case "Investimento":
        case "Posts":
        case "Stories":
        case "Feed":
        case "Tiktok":
        case "Impressoes":
        case "Interacoes":
        case "Cliques":
        case "Video Views":
        case "Cliques Tiktok":
        case "Impressoes Tiktok":
          return parseInt(a[sortColumn]) - parseInt(b[sortColumn]);
    
        case "Engajamento":
        case "Engajamento Tiktok":
        case "CTR":
          return parsePercentageString(a[sortColumn]) - parsePercentageString(b[sortColumn]);
    
        case "CPE":
        case "CPC":
        case "CPV":
          return parseCurrencyString(a[sortColumn]) - parseCurrencyString(b[sortColumn]);
    
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
    <motion.div
      className="box-border w-full flex flex-col justify-start items-start bg-white overflow-hidden p-0 content-start flex-nowrap gap-0 rounded-xl border border-black"
      initial={false}
      animate={{
        boxShadow: "2px 2px 2px 0px rgba(16, 24, 40, 0.06)",
        height:
          currentData.length / itemsPerPage < 1 ? "fit-content" : "fit-content",
      }}
      transition={{ duration: 0.3, ease: "linear" }}
      whileHover={{ boxShadow: "2px 2px 0px 0px #000000" }}
    >
      <div className="flex-shrink-0 w-full h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap sm:gap-5 gap-0 rounded-none">
        <div className="box-border flex-shrink-0 w-full h-min flex sm:flex-row flex-col justify-start sm:items-center items-start xl:pt-5 xl:pb-0 py-5 px-6 overflow-visible relative sm:content-center content-start flex-nowrap gap-4 rounded-none">
          {/* <Image
            src={performanceIcon}
            alt="Performance Icon"
            width={40}
            height={40}
            className="hidden sm:block"
          /> */}

          <PerformanceIcon className="hidden sm:block" />

          <div className="sm:hidden flex w-full h-min flex-shrink-0 justify-between items-center flex-nowrap">
            {/* <Image
              src={performanceIcon}
              alt="Performance Icon"
              width={40}
              height={40}
              className="sm:hidden block"
            /> */}

            <PerformanceIcon />

            <div className="flex-shrink-0 w-min h-min flex justify-start items-center overflow-visible relative p-0 content-center flex-nowrap gap-3 rounded-none">
              {/* <motion.div
                onClick={toggleOpen}
                className="btn btn-ghost box-border flex-shrink-0 w-min h-auto flex justify-center items-center py-[10px] px-[8px] shadow-cost-per-metrics bg-white overflow-hidden self-stretch relative content-center flex-nowrap gap-2 rounded-lg border border-solid border-[#cfd4dc]"
                initial={false}
                animate={{ rotate: open ? -90 : 0 }}
                transition={{ duration: 0.3, ease: "linear" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#2d3442"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </motion.div> */}
            </div>
          </div>
          <div className="flex-shrink-0 flex-grow w-auto sm:h-full h-[52px] flex flex-col justify-center items-start overflow-visible relative p-0 content-start flex-nowrap gap-1 rounded-none">
            <h3
              className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-pre-wrap break-words relative font-semibold ${jakarta.className} text-[#0f1728] text-lg`}
            >
              Performance dos Creators
            </h3>
            <p
              className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-pre-wrap break-words relative ${inter.className} text-[#475466] text-sm`}
            >
              Acompanhe a tabela de todos os dados dos seus creators
            </p>
          </div>
          <div className="hidden sm:flex flex-shrink-0 w-min h-min justify-start items-center overflow-visible relative p-0 content-center flex-nowrap gap-3 rounded-none">
            {/* <motion.div
              onClick={toggleOpen}
              className="btn btn-ghost box-border flex-shrink-0 w-min h-auto flex justify-center items-center py-[10px] px-[8px] shadow-cost-per-metrics bg-white overflow-hidden self-stretch relative content-center flex-nowrap gap-2 rounded-lg border border-solid border-[#cfd4dc]"
              initial={false}
              animate={{ rotate: open ? -90 : 0 }}
              transition={{ duration: 0.3, ease: "linear" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#2d3442"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </motion.div> */}
          </div>
        </div>
        <svg
          width="1098"
          height="3"
          viewBox="-1 -1 1098 3"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1096 1H0V0H1096V1Z"
            fill="transparent"
          ></path>
        </svg>
      </div>
      <div className="overflow-x-auto w-full no-scrollbar border-t border-gray">
        <table className="table">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-box flex-shrink-0 w-full h-min bg-[#f8f9fb] overflow-visible relative content-center flex-nowrap gap-[5px] rounded-none border-b border-[#eaecf0]">
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[215px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "Influencer",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6">
                  Creator
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Influencer"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[215px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("Cidade", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6">
                  Cidade
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Cidade"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[215px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "Investimento",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6">
                  Investimento
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Investimento"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[215px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("Posts", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6">
                  Publicações
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Posts"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[215px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("Stories", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6">
                  Stories
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Stories"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[215px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("Feed", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6">
                  Feed
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Feed"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[215px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("Tiktok", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6">
                  TikTok
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Tiktok"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[215px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "Impressoes",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6">
                  Impressões
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Impressoes"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[215px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "Interacoes",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6">
                  Interações
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Interacoes"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[215px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("Cliques", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6">
                  Clicks
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Cliques"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[215px] h-auto relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "Video Views",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6">
                  Video Views
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Video Views"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[215px] h-auto relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "Engajamento",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6">
                  Engajamento
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Engajamento"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[215px] h-auto relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "Engajamento Tiktok",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6">
                  Engajamento Tiktok
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Engajamento Tiktok"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[215px] h-auto relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "Cliques Tiktok",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6">
                  Cliques Tiktok
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Cliques Tiktok"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[215px] h-auto relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "Impressoes Tiktok",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6">
                  Impressoes Tiktok
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"Impressoes Tiktok"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[215px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("CPE", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6">
                  CPE
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"CPE"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[215px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("CPC", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6">
                  CPC
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"CPC"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[215px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("CPV", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6">
                  CPV
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"CPV"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-auto max-w-[215px] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort("CTR", sortColumn, setSortColumn, setSortOrder)
                }
              >
                <div className="flex justify-start items-center gap-6">
                  CTR
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"CTR"}
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
            {currentData.map((item) => {
              return <CreatorsTableRow data={item} key={item.id} />;
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
    </motion.div>
  );
};

export default CreatorsTable;
