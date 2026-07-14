// import React from "react";

// type TablePaginationProps

// const TablePagination = () => {
//   return (
//     <div
//       className={`${
//         attachments.length / itemsPerPage < 1 ? "hidden" : "flex"
//       } flex-shrink-0 w-full h-min flex justify-center items-center overflow-visible relative p-0 content-center flex-nowrap sm:gap-5 gap-0 rounded-none`}
//     >
//       <div className="xl:inline-flex hidden join w-full justify-center items-center">
//         <button
//           className="join-item btn"
//           disabled={currentPage === 1}
//           onClick={() => handlePageChange(currentPage - 1)}
//         >
//           « Anterior
//         </button>
//         {/* <button className="join-item btn">1</button>
//       <button className="join-item btn">2</button>
//       <button className="join-item btn">3</button>
//       <button className="join-item btn btn-disabled">...</button>
//       <button className="join-item btn">8</button>
//       <button className="join-item btn">9</button>
//       <button className="join-item btn">10</button> */}
//         {Array.from({ length: totalPages }).map((_, index) => (
//           <button
//             key={index}
//             className={`join-item btn ${
//               currentPage === index + 1 ? "btn-active" : ""
//             }`}
//             onClick={() => handlePageChange(index + 1)}
//           >
//             {index + 1}
//           </button>
//         ))}
//         <button
//           className="join-item btn"
//           disabled={currentPage === totalPages}
//           onClick={() => handlePageChange(currentPage + 1)}
//         >
//           Proximo »
//         </button>
//       </div>
//       <div className="inline-flex xl:hidden join w-full justify-center items-center">
//         <button
//           className="join-item btn"
//           disabled={currentPage === 1}
//           onClick={() => handlePageChange(currentPage - 1)}
//         >
//           «
//         </button>
//         {Array.from({ length: totalPages }).map((_, index) => (
//           <button
//             key={index}
//             className={`join-item btn ${
//               currentPage === index + 1 ? "btn-active" : ""
//             }`}
//             onClick={() => handlePageChange(index + 1)}
//           >
//             {index + 1}
//           </button>
//         ))}
//         {/* <button className="join-item btn">1</button>
//       <button className="join-item btn">2</button>
//       <button className="join-item btn btn-disabled">...</button>
//       <button className="join-item btn">9</button>
//       <button className="join-item btn">10</button> */}
//         <button
//           className="join-item btn"
//           disabled={currentPage === totalPages}
//           onClick={() => handlePageChange(currentPage + 1)}
//         >
//           »
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TablePagination;
