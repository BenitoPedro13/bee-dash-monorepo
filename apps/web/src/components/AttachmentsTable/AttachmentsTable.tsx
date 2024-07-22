import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import attachmentsIcon from "@/../public/attachmentsIcon.png";
import Image from "next/image";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import AttachmentsTableRow from "./AttachmentsTableRow";
import useDataStore, { Attachment } from "@/store";
import FileUploadButton from "../FileUploadButton";
import TableSortingIcon from "../TableSortingIcon";
import arrowLeft from "@/../public/arrow-left.svg";
import arrowRight from "@/../public/arrow-right.svg";

import { handleSort } from "../../../utils/utils";
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

  // const toggleOpen = () => setOpen(!open);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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
    <motion.div
      className="box-border w-full flex flex-col justify-start items-start bg-white overflow-hidden p-0 content-start flex-nowrap gap-0 rounded-xl border border-black"
      initial={false}
      animate={{
        boxShadow: "2px 2px 2px 0px rgba(16, 24, 40, 0.06)",
        height:
          currentAttachments.length / itemsPerPage < 1
            ? "fit-content"
            : "fit-content",
      }}
      transition={{ duration: 0.3, ease: "linear" }}
      whileHover={{ boxShadow: "2px 2px 0px 0px #000000" }}
    >
      <div className="flex-shrink-0 w-full h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap sm:gap-5 gap-0 rounded-none">
        <div className="box-border flex-shrink-0 w-full h-min flex sm:flex-row flex-col justify-start sm:items-center items-start xl:pt-5 xl:pb-0 py-5 px-6 overflow-visible relative sm:content-center content-start flex-nowrap gap-4 rounded-none">
          {/* <Image
            src={attachmentsIcon}
            alt="Performance Icon"
            width={40}
            height={40}
            className="hidden sm:block"
          /> */}

          <AttachmentIcon className="hidden sm:block"/>

          <div className="sm:hidden flex w-full h-min flex-shrink-0 justify-between items-center flex-nowrap">
            {/* <Image
              src={attachmentsIcon}
              alt="Performance Icon"
              width={40}
              height={40}
              className="sm:hidden block"
            /> */}

            <AttachmentIcon />

            <div className="flex-shrink-0 w-min h-min flex justify-start items-center overflow-visible relative p-0 content-center flex-nowrap gap-3 rounded-none">
              <FileUploadButton
                attachments={currentAttachments}
                setAttachments={setCurrentAttachments}
              />
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
              Anexos
            </h3>
            <p
              className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-pre-wrap break-words relative ${inter.className} text-[#475466] text-sm`}
            >
              Arquivos e documentos anexados ao seu projeto Juicy
            </p>
          </div>
          <div className="hidden sm:flex flex-shrink-0 w-min h-min justify-start items-center overflow-visible relative p-0 content-center flex-nowrap gap-3 rounded-none">
            <FileUploadButton
              attachments={currentAttachments}
              setAttachments={setCurrentAttachments}
            />
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
                <div className="flex justify-start items-center gap-6">
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
                <div className="flex justify-start items-center gap-6">
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
                <div className="flex justify-start items-center gap-6">
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
    </motion.div>
  );
};

export default AttachmentsTable;
