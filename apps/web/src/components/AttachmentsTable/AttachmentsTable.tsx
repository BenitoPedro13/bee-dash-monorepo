import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import attachmentsIcon from "@/../public/attachmentsIcon.png";
import Image from "next/image";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import AttachmentsTableRow from "./AttachmentsTableRow";
import useDataStore, { Attachment } from "@/store";
import FileUploadButton from "../FileUploadButton";
import TableSortingIcon from "../TableSortingIcon";
import arrowLeft from "@/../public/arrow-left.svg";
import arrowRight from "@/../public/arrow-right.svg";

import { generatePastelColor, handleSort } from "../../../utils/utils";
import AttachmentIcon from "../MetricsIcons/AttachmentIcon";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

// id: number;
// uniqueFilename: string;
// originalFilename: string;
// fileSize: number;
// createdAt: string;
// updatedAt: string;

const AttachmentsTable = () => {
  const { color } = useDataStore((state) => state.session.user);
  // const hexColor =
  //   color === undefined ? "#FF8C00" : color.length !== 7 ? "#FF8C00" : color;
  const globalAttachments = useDataStore((state) => state.attachments);
  const [attachments, setAttachments] = useState([...globalAttachments]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10; // Set the number of items per page
  const totalPages = Math.ceil(attachments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [currentAttachments, setCurrentAttachments] = useState(
    attachments.slice(indexOfFirstItem, indexOfLastItem)
  );
  // const [open, setOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Initial sort order
  const [sortColumn, setSortColumn] =
    useState<keyof Attachment>("originalFilename"); // Initial sort column

  // Ref for the scrollable table container
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [headerOffset, setHeaderOffset] = useState(0);
  const [headerWidth, setHeaderWidth] = useState(0);

  // const pastelColor = generatePastelColor(hexColor);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleScroll = () => {
    if (tableContainerRef.current) {
      setHeaderWidth(tableContainerRef.current.getBoundingClientRect().width);
      if (
        tableContainerRef.current.scrollLeft <
        tableContainerRef.current.getBoundingClientRect().width -
          tableContainerRef.current.getBoundingClientRect().width
      ) {
        setHeaderOffset(tableContainerRef.current.scrollLeft);
      }
    }
  };

  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      setHeaderWidth(tableContainerRef.current.getBoundingClientRect().width);
      container.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    // Update attachments whenever globalAttachments changes
    setAttachments([...globalAttachments]);
  }, [globalAttachments]);

  useEffect(() => {
    const sortedAttachments = attachments.sort((a, b) => {
      if (sortColumn === "originalFilename") {
        return a.originalFilename.localeCompare(b.originalFilename);
      } else if (sortColumn === "fileSize") {
        return a.fileSize - b.fileSize;
      } else if (sortColumn === "createdAt") {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateA.getTime() - dateB.getTime();
      }
      return 0;
    });

    if (sortOrder === "desc") {
      sortedAttachments.reverse();
    }

    // Update currentAttachments based on the currentPage and itemsPerPage
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAttachments = sortedAttachments.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
    setCurrentAttachments(currentAttachments);
  }, [attachments, currentPage, sortColumn, sortOrder, itemsPerPage]);

  return (
    <div className="box-border lg:w-[calc(100%-384px)] w-full flex flex-col justify-start items-start bg-white overflow-hidden p-0 content-start flex-nowrap gap-0 rounded-3xl border border-[#D4D4D4]">
      <div className="flex-shrink-0 w-full h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap sm:gap-5 gap-0 rounded-none">
        <div className="flex flex-col items-start self-stretch">
          <div className="flex px-5 py-6 items-start gap-4 self-stretch">
            <div className="flex flex-col justify-center items-start gap-1 flex-grow self-stretch">
              <h3 className="font-nexa-bold text-lg font-semibold text-[#101828] self-stretch">
                Anexos
              </h3>
              <p className="font-nexa text-sm text-[#475467] self-stretch">
                Arquivos e outros documentos que ajudarão seu projeto
              </p>
            </div>

            <FileUploadButton
              attachments={currentAttachments}
              setAttachments={setCurrentAttachments}
            />
          </div>
        </div>
      </div>
      <div
        className="overflow-x-auto w-full no-scrollbar border-t border-gray relative"
        ref={tableContainerRef}
      >
        <div
          id="table-header-clip"
          className="absolute top-0 h-[28.5px] left-0 bg-transparent z-30 pointer-events-none"
          style={{
            boxShadow: "0 0 0 10px white",
            margin: "10px",
            width: `${headerWidth}px`,
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
            <div className="bg-white w-10 h-full absolute -left-10"></div>
            <div className="bg-white w-10 h-full absolute -right-10"></div>
          </div>
        </div>
        <table className="table">
          <thead className="sticky top-0 bg-white">
            <tr
              className="border-box flex-shrink-0 w-full bg-[#f8f9fb] h-min overflow-visible relative content-center flex-nowrap gap-[5px] rounded-none border-b border-[#eaecf0]"
              // style={{
              //   background: pastelColor,
              // }}
            >
              <th
                className={`cursor-pointer flex-shrink-0 w-[40%] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "originalFilename",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Nome do Arquivo
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"originalFilename"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-[calc(30%-45px)] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "fileSize",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Tamanho
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"fileSize"}
                  />
                </div>
              </th>
              <th
                className={`cursor-pointer flex-shrink-0 w-[calc(30%-45px)] h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px]`}
                onClick={() =>
                  handleSort(
                    "createdAt",
                    sortColumn,
                    setSortColumn,
                    setSortOrder
                  )
                }
              >
                <div className="flex justify-start items-center gap-6 whitespace-nowrap">
                  Data de Envio
                  <TableSortingIcon
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    actualColumn={"createdAt"}
                  />
                </div>
              </th>
              <th
                className={`flex-shrink-0 w-[90px]  h-auto whitespace-pre-wrap break-words relative font-medium ${inter.className} text-[#475466] text-xs leading-[18px] text-center`}
              >
                ...
              </th>
            </tr>
          </thead>
          <tbody>
            {currentAttachments.map((item) => {
              return <AttachmentsTableRow data={item} key={item.id} />;
            })}
          </tbody>
        </table>
      </div>
      <div
        className={`${
          attachments.length / itemsPerPage < 1 ? "hidden" : "flex"
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
                className={`join-item flex w-10 max-h-10 p-[10px] flex-col justify-center items-center border-t-0 border-b-0 border-l-0 border-r-[2px] border-[#D0D5DD] ${
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

export default AttachmentsTable;
