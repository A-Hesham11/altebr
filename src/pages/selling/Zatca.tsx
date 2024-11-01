// import { t } from "i18next";
// import React, { useContext, useMemo, useState } from "react";
// import { authCtx } from "../../context/auth-and-perm/auth";
// import { useFetch } from "../../hooks";
// import FinalPreviewBillData from "../../components/selling/selling components/bill/FinalPreviewBillData";
// import { Button } from "../../components/atoms";
// import FinalPreviewBillPayment from "../../components/selling/selling components/bill/FinalPreviewBillPayment";
// import InvoiceTable from "../../components/selling/selling components/InvoiceTable";
// import { ColumnDef } from "@tanstack/react-table";
// import { Selling_TP } from "./PaymentSellingPage";

// type Client_TP = {
//   amount: number;
//   bond_date: string;
//   client_id: number;
//   client_value: string;
//   employee_id: number;
//   employee_value: string;
//   id: number;
// };

// type SellingFinalPreviewProps_TP = {
//   ItemsTableContent: React.ReactNode;
//   setStage: React.Dispatch<React.SetStateAction<number>>;
//   paymentData: never[];
//   clientData: Client_TP;
//   costDataAsProps: any;
//   sellingItemsData: any;
//   invoiceNumber: any;
// };
// export const Zatca = ({
//   ItemsTableContent,
//   setStage,
//   paymentData,
//   // clientData,
//   costDataAsProps,
//   sellingItemsData,
//   invoiceNumber,
// }: SellingFinalPreviewProps_TP) => {
//   // const [printStatus, setPrintStatus] = useState("block")
//   // const handlePrint = () => {
//   //     window.print();
//   // };

//   // const [printContent, setPrintContent] = useState(null);

//   // const handlePrintClick = () => {
//   //   const contentToPrint = document.getElementsByName('content-to-print');
//   //   // setPrintContent(contentToPrint.innerHTML);
//   //   window.print();
//   // };
//   // get client data
//   // const { client_value, client_id, client_name } = clientData;

//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);

//   const { userData } = useContext(authCtx);

//   const { data } = useFetch<Client_TP>({
//     endpoint: `/selling/api/v1/get_sentence`,
//     queryKey: ["sentence"],
//   });

//   const { data: companyData } = useFetch<Client_TP>({
//     endpoint: `/companySettings/api/v1/companies`,
//     queryKey: ["Mineral_license"],
//   });

//   const {
//     data: invoiceData,
//     isLoading,
//     isFetching,
//     isRefetching,
//     refetch,
//   } = useFetch({
//     queryKey: ["selling-invoice"],
//     endpoint:
//       search === `selling/api/v1/invoices_per_branch/${userData?.branch_id}` ||
//       search === ""
//         ? `selling/api/v1/invoices_per_branch/${userData?.branch_id}?page=${page}`
//         : `${search}`,
//     pagination: true,
//   });
//   console.log("🚀 ~ ViewSellingInvoice ~ invoiceData:", invoiceData);

//   const clientData = {
//     bond_date: invoiceData?.data[0]?.bond_date,
//     client_id: invoiceData?.data[0]?.client_id,
//     client_value: invoiceData?.data[0]?.client_value,
//   };

//   const Cols = useMemo<ColumnDef<Selling_TP>[]>(
//     () => [
//       {
//         header: () => <span>{t("piece number")}</span>,
//         accessorKey: "hwya",
//         cell: (info) => info.getValue() || "---",
//       },
//       {
//         header: () => <span>{t("classification")}</span>,
//         accessorKey: "classification_name",
//         cell: (info) => info.getValue() || "---",
//       },
//       {
//         header: () => <span>{t("category")} </span>,
//         accessorKey: "category_name",
//         cell: (info) => info.getValue() || "---",
//       },
//       {
//         header: () => <span>{t("stone weight")} </span>,
//         accessorKey: "stone_weight",
//         cell: (info) => info.getValue() || "---",
//       },
//       {
//         header: () => <span>{t("karat value")} </span>,
//         accessorKey: "karat_name",
//         cell: (info) => info.getValue() || "---",
//       },
//       {
//         header: () => <span>{t("weight")}</span>,
//         accessorKey: "weight",
//         cell: (info) => info.getValue() || `${t("no items")}`,
//       },
//       {
//         header: () => <span>{t("cost")} </span>,
//         accessorKey: "cost",
//         cell: (info) => info.getValue() || "---",
//       },
//       {
//         header: () => <span>{t("VAT")} </span>,
//         accessorKey: "VAT",
//         cell: (info) => info.getValue() || "---",
//       },
//       {
//         header: () => <span>{t("total")} </span>,
//         accessorKey: "total",
//         cell: (info) => info.getValue() || "---",
//       },
//     ],
//     []
//   );

//   const SellingTableComp = () => (
//     <InvoiceTable
//       data={invoiceData?.data[0]}
//       columns={Cols}
//       paymentData={paymentData}
//       costDataAsProps={costDataAsProps}
//     ></InvoiceTable>
//   );

//   return (
//     <div className="relative h-full p-10 bg-flatWhite ">
//       <div className="flex items-center justify-between my-8 mt-8">
//         <h2 className="text-base font-bold">{t("final preview")}</h2>
//         <div className="flex gap-3">
//           <Button
//             className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen"
//             action={() => window.print()}
//           >
//             {t("print")}
//           </Button>
//           <Button
//             className="bg-mainOrange px-7 py-[6px]"
//             // loading={isLoading}
//             // action={posSellingDataHandler}
//           >
//             {t("save")}
//           </Button>
//         </div>
//       </div>
//       <div className="print-section">
//         <div className="bg-white  rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow ">
//           <div className="mx-6 bill-shadow rounded-md p-6">
//             <FinalPreviewBillData
//               clientData={clientData}
//               invoiceNumber={invoiceData?.data[0]?.invoice_number}
//             />
//           </div>
//           {ItemsTableContent}
//           <div className="mx-6 bill-shadow rounded-md p-6 my-9">
//             {/* <FinalPreviewBillPayment
//               paymentData={paymentData}
//               costDataAsProps={costDataAsProps}
//               sellingItemsData={sellingItemsData}
//             /> */}
//           </div>
//           <div className="text-center">
//             <p className="my-4 py-1 border-y border-mainOrange text-[15px]">
//               {data && data?.sentence}
//             </p>
//             <div className="flex justify-between items-center px-8 py-2 bg-[#E5ECEB] bill-shadow">
//               <p>
//                 {" "}
//                 العنوان : {userData?.branch?.country?.name} ,{" "}
//                 {userData?.branch?.city?.name} ,{" "}
//                 {userData?.branch?.district?.name}
//               </p>
//               <p>
//                 {t("phone")}: {userData?.phone}
//               </p>
//               <p>
//                 {t("email")}: {userData?.email}
//               </p>
//               <p>
//                 {t("tax number")}:{" "}
//                 {companyData && companyData[0]?.taxRegisteration}
//               </p>
//               <p>
//                 {t("Mineral license")}:{" "}
//                 {companyData && companyData[0]?.mineralLicence}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* {printContent && <div style={{ display: 'none' }}>{printContent}</div>}    */}
//     </div>
//   );
// };

import { t } from "i18next";
import React, { useContext, useMemo, useState } from "react";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useFetch } from "../../hooks";
import FinalPreviewBillData from "../../components/selling/selling components/bill/FinalPreviewBillData";
import { Button } from "../../components/atoms";
import FinalPreviewBillPayment from "../../components/selling/selling components/bill/FinalPreviewBillPayment";
import InvoiceTable from "../../components/selling/selling components/InvoiceTable";
import { ColumnDef } from "@tanstack/react-table";
import { Selling_TP } from "./PaymentSellingPage";
import billLogo from "../../assets/bill-logo.png";
import { formatDate } from "../../utils/date";
import { Cards_Props_TP } from "../../components/templates/bankCards/ViewBankCards";

type Client_TP = {
  amount: number;
  bond_date: string;
  client_id: number;
  client_value: string;
  employee_id: number;
  employee_value: string;
  id: number;
};

type SellingFinalPreviewProps_TP = {
  ItemsTableContent: React.ReactNode;
  setStage: React.Dispatch<React.SetStateAction<number>>;
  paymentData: never[];
  clientData: Client_TP;
  costDataAsProps: any;
  sellingItemsData: any;
  invoiceNumber: any;
};
export const Zatca = ({
  ItemsTableContent,
  setStage,
  paymentData,
  // clientData,
  // costDataAsProps,
  sellingItemsData,
  invoiceNumber,
}: SellingFinalPreviewProps_TP) => {
  // const [printStatus, setPrintStatus] = useState("block")
  // const handlePrint = () => {
  //     window.print();
  // };

  // const [printContent, setPrintContent] = useState(null);

  // const handlePrintClick = () => {
  //   const contentToPrint = document.getElementsByName('content-to-print');
  //   // setPrintContent(contentToPrint.innerHTML);
  //   window.print();
  // };
  // get client data
  // const { client_value, client_id, client_name } = clientData;

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [invoiceInfo, setInvoiceInfo] = useState(null);

  const { userData } = useContext(authCtx);

  const mineralLicence = userData?.branch.document?.filter(
    (item) => item.data.docType.label === "رخصة المعادن"
  )?.[0]?.data.docNumber;

  const taxRegisteration = userData?.branch.document?.filter(
    (item) => item.data.docType.label === "شهادة ضريبية"
  )?.[0]?.data.docNumber;

  const { data } = useFetch<Client_TP>({
    endpoint: `/selling/api/v1/get_sentence`,
    queryKey: ["sentence"],
  });

  const { data: companyData } = useFetch<Client_TP>({
    endpoint: `/companySettings/api/v1/companies`,
    queryKey: ["Mineral_license"],
  });

  const {
    data: invoiceData,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useFetch({
    queryKey: ["selling-invoice-data"],
    endpoint: `selling/api/v1/invoices_per_branch/${userData?.branch_id}?page=${page}`,
    select: (invoice) => {
      return invoice?.data[0];
    },
    pagination: true,
  });
  console.log("🚀 ~ ViewSellingInvoice ~ invoiceData:", invoiceData);

  const { data: clientInfo } = useFetch<Client_TP>({
    endpoint: `branchManage/api/v1/clients/${invoiceData?.client_id}`,
    queryKey: ["client_id"],
  });

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("piece number")}</span>,
        accessorKey: "hwya",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("classification")}</span>,
        accessorKey: "classification_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("category")} </span>,
        accessorKey: "category_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("stone weight")} </span>,
        accessorKey: "stone_weight",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("weight")}</span>,
        accessorKey: "weight",
        cell: (info) => info.getValue() || `${t("no items")}`,
      },
      {
        header: () => <span>{t("cost")} </span>,
        accessorKey: "cost",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("VAT")} </span>,
        accessorKey: "vat",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("total")} </span>,
        accessorKey: "total",
        cell: (info) => info.getValue() || "---",
      },
    ],
    []
  );

  const totalCost = invoiceData.items.reduce((acc, card) => {
    acc += +card.cost;
    return acc;
  }, 0);

  const totalItemsTaxes = invoiceData.items.reduce((acc, card) => {
    acc += +card.vat;
    return acc;
  }, 0);

  const totalFinalCost = invoiceData.items.reduce((acc, card) => {
    acc += +card.total;
    return acc;
  }, 0);

  const costDataAsProps = {
    // totalCommissionRatio,
    // ratioForOneItem,
    // totalCommissionTaxes,
    totalItemsTaxes,
    totalFinalCost,
    totalCost,
  };

  const { data: invoiceInformation } = useFetch<Cards_Props_TP[]>({
    endpoint: `/companySettings/api/v1/InvoiceData`,
    queryKey: ["InvoiceHeader_Data"],
    pagination: true,
    onSuccess(data) {
      const returnData = data?.data.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
      setInvoiceInfo(returnData);
    },
  });

  const SellingTableComp = () => (
    <InvoiceTable
      data={invoiceData?.items}
      columns={Cols}
      paymentData={paymentData}
      costDataAsProps={costDataAsProps}
    ></InvoiceTable>
  );

  return (
    <div className="relative h-full p-10 bg-flatWhite ">
      <div className="flex items-center justify-between my-8 mt-8">
        <h2 className="text-base font-bold">{t("final preview")}</h2>
        <div className="flex gap-3">
          <Button
            className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen"
            action={() => window.print()}
          >
            {t("print")}
          </Button>
          <Button
            className="bg-mainOrange px-7 py-[6px]"
            // loading={isLoading}
            // action={posSellingDataHandler}
          >
            {t("save")}
          </Button>
        </div>
      </div>
      <div className="print-section">
        <div className="bg-white  rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow ">
          <div className="mx-6 bill-shadow rounded-md p-6">
            <div className="flex justify-between">
              <div className="flex flex-col gap-1 mt-6">
                <p className="text-xs font-bold">
                  {t("bill no")} :{" "}
                  <span className="font-medium">
                    {invoiceData?.invoice_number}
                  </span>{" "}
                </p>
                <p className="text-xs font-bold">
                  {t("bill date")} :{" "}
                  <span className="font-medium">
                    {invoiceData?.invoice_date}
                  </span>{" "}
                </p>
              </div>
              <div className="flex flex-col gap-1 items-center">
                <img
                  src={invoiceInfo?.InvoiceCompanyLogo || billLogo}
                  alt="bill"
                  className="h-28 w-3/4 object-contain"
                />
                <p className="text-xs font-medium">
                  {userData?.branch?.country?.name} ,{" "}
                  {userData?.branch?.city?.name}
                </p>
                <p className="text-xs font-medium">
                  <span className="font-bold">{t("district")}:</span>
                  {userData?.branch?.district?.name}
                </p>
              </div>
              <div className="flex flex-col gap-1 mt-6">
                <p className="text-xs font-bold">
                  {t("client name")} :{" "}
                  <span className="font-medium">
                    {invoiceData?.client_name}
                  </span>{" "}
                </p>

                <p className="text-xs font-bold">
                  {t("mobile number")} :{" "}
                  <span className="font-medium">{clientInfo?.phone}</span>{" "}
                </p>
                <p className="text-xs font-bold">
                  {t("Id number")} :{" "}
                  <span className="font-medium">
                    {clientInfo?.identity || clientInfo?.national_number}
                  </span>{" "}
                </p>
              </div>
            </div>
          </div>

          <SellingTableComp />
          <div className="mx-6 bill-shadow rounded-md p-6 my-9">
            {/* <FinalPreviewBillPayment
              paymentData={paymentData}
              costDataAsProps={costDataAsProps}
              sellingItemsData={sellingItemsData}
            /> */}
          </div>
          <div className="text-center">
            <p className="my-4 py-1 border-y border-mainOrange text-[15px]">
              {data && data?.sentence}
            </p>
            <div className="flex justify-between items-center px-8 py-2 bg-[#E5ECEB] bill-shadow">
              <p>
                {" "}
                العنوان : {userData?.branch?.country?.name} ,{" "}
                {userData?.branch?.city?.name} ,{" "}
                {userData?.branch?.district?.name}
              </p>
              <p>
                {t("phone")}: {companyData?.[0]?.phone}
              </p>
              <p>
                {t("email")}: {companyData?.[0]?.email}
              </p>
              <p>
                {t("tax number")}:{" "}
                {taxRegisteration || ""}
              </p>
              <p>
                {t("Mineral license")}:{" "}
                {mineralLicence || ""}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* {printContent && <div style={{ display: 'none' }}>{printContent}</div>}    */}
    </div>
  );
};
