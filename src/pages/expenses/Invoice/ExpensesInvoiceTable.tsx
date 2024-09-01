// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { t } from "i18next";
// import { numberContext } from "../../../context/settings/number-formatter";
// import { convertNumToArWord } from "../../../utils/number to arabic words/convertNumToArWord";

// interface ReactTableProps<T extends object> {
//   data: T[];
//   columns: ColumnDef<T>[];
//   paymentData: any;
//   costDataAsProps?: any;
// }

// const ExpenseInvoiceTable = <T extends object>({
//   data,
//   columns,
//   costDataAsProps,
// }: ReactTableProps<T>) => {
//   const { formatGram, formatReyal } = numberContext();

//   // CUSTOM CONFIGURE FOR TABLE
//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   const totalCost = data.reduce((acc: number, curr: any) => {
//     acc = +curr.expense_price + +curr.expense_price_tax;
//     return acc;
//   }, 0);

//   const totalFinalCostIntoArabic = convertNumToArWord(
//     Math.round(costDataAsProps?.totalCost)
//   );

//   const resultTable = [
//     {
//       number: t("totals"),
//       cost: formatReyal(totalCost),
//     },
//   ];

//   return (
//     <>
//       <div className="mx-6">
//         <div className="mb-6 overflow-x-scroll lg:overflow-x-visible w-full">
//           <table className="mt-8 w-[872px] lg:w-full table-shadow">
//             <thead className="bg-mainGreen text-white">
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <tr key={headerGroup.id} className="py-4 px-2">
//                   {headerGroup.headers.map((header) => (
//                     <th
//                       key={header.id}
//                       className="p-4 text-sm font-medium text-mainGreen bg-[#E5ECEB] border-l last:border-none border-[#7B7B7B4D]"
//                     >
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             <tbody>
//               {table.getRowModel().rows.map((row) => {
//                 return (
//                   <tr key={row.id} className="text-center">
//                     {row.getVisibleCells().map((cell, i) => {
//                       return (
//                         <td
//                           className="px-2 py-2 max-w-xl break-words text-mainGreen bg-white gap-x-2 items-center border border-[#7B7B7B4D]"
//                           key={cell.id}
//                           colSpan={1}
//                         >
//                           {flexRender(
//                             cell.column.columnDef.cell,
//                             cell.getContext()
//                           )}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 );
//               })}

//               <tr className="text-center">
//                 {Object.keys(resultTable[0]).map((key, index) => {
//                   return (
//                     <td
//                       className="bg-[#F3F3F3] px-2 py-2 text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]"
//                       colSpan={index === 0 ? 4 : 1}
//                     >
//                       {resultTable[0][key]}
//                     </td>
//                   );
//                 })}
//               </tr>
//             </tbody>
//             <tfoot className="text-center">
//               <tr className="text-center border-[1px] border-[#7B7B7B4D]">
//                 <td
//                   className="bg-[#F3F3F3] px-2 py-2 font-medium text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]"
//                   colSpan={9}
//                 >
//                   <span className="font-bold">{t("total")}</span>:{" "}
//                   {totalFinalCostIntoArabic}
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ExpenseInvoiceTable;

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { t } from "i18next";
import { numberContext } from "../../../context/settings/number-formatter";
import { convertNumToArWord } from "../../../utils/number to arabic words/convertNumToArWord";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useContext } from "react";

interface ReactTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  paymentData: any;
  costDataAsProps?: any;
}

const ExpenseInvoiceTable = <T extends object>({
  data,
  costDataAsProps,
}: ReactTableProps<T>) => {
  const ExpenseData = data && data[0];
  console.log("🚀 ~ ExpenseData:", ExpenseData);
  const { formatGram, formatReyal } = numberContext();

  const { userData } = useContext(authCtx);
  console.log("🚀 ~ userData:", userData);

  const totalCost = data.reduce((acc: number, curr: any) => {
    acc = +curr.expense_price + +curr.expense_price_tax;
    return acc;
  }, 0);

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(costDataAsProps?.totalCost)
  );

  const resultTable = [
    {
      number: t("totals"),
      cost: formatReyal(totalCost),
    },
  ];

  return (
    <>
      <div className="mx-6">
        <div className="my-6 rounded-md p-6 overflow-x-scroll lg:overflow-x-visible w-full bg-[#e5eceb]">
          <div className="flex items-center mt-4 text-lg">
            <p className="font-semibold text-lg me-5 w-44">
              {t("expense price")} :
            </p>{" "}
            <p>{ExpenseData?.expense_price}</p>
          </div>
          <div className="flex items-center my-4 text-lg">
            <p className="font-semibold text-lg me-5 w-44">
              {t("We paid to")} :
            </p>{" "}
            <p>{ExpenseData?.directed_to}</p>
          </div>
          <div className="flex items-center text-lg">
            <p className="font-semibold text-lg me-5 w-44">
              {t("Amount and capacity")} :
            </p>{" "}
            <p>{totalFinalCostIntoArabic} </p>
            <span className="font-semibold text-lg ms-5">
              {t("Only nothing else")}
            </span>
          </div>
          <div className="flex items-center my-4 text-lg">
            <p className="font-semibold text-lg me-5 w-44 ">
              {t("In return for")} :
            </p>{" "}
            {ExpenseData?.add_description}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpenseInvoiceTable;
