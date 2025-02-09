import Logo from "../../../../assets/bill-logo.png";
import { t } from "i18next";
import { Button } from "../../../../components/atoms";
import { Table } from "../../../../components/templates/reusableComponants/tantable/Table";
import { useReactTable } from "@tanstack/react-table";
import { useContext, useMemo, useRef } from "react";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { useIsRTL } from "../../../../hooks";
import { useReactToPrint } from "react-to-print";

const LostItemsReports = ({ dataSource, reportNumber, date }: any) => {
  console.log("🚀 ~ LostItemsReports ~ dataSource:", dataSource);
  const { userData } = useContext(authCtx);
  const contentRef = useRef();
  const isRTL = useIsRTL();

  const karat_24_values = dataSource?.filter(
    (item) => item.karat_name === "24"
  );
  const karat_22_values = dataSource?.filter(
    (item) => item.karat_name === "22"
  );
  const karat_21_values = dataSource?.filter(
    (item) => item.karat_name === "21"
  );
  const karat_18_values = dataSource?.filter(
    (item) => item.karat_name === "18"
  );

  const totals = [
    {
      title: t("total 18 gold box"),
      number: karat_18_values?.length,
      weight: karat_18_values?.reduce((acc, curr) => {
        return +acc + Number(curr.weight);
      }, 0),
    },
    {
      title: t("total 21 gold box"),
      number: karat_21_values?.length,
      weight: karat_21_values?.reduce((acc, curr) => {
        return +acc + Number(curr.weight);
      }, 0),
    },
    {
      title: t("total 22 gold box"),
      number: karat_22_values?.length,
      weight: karat_22_values?.reduce((acc, curr) => {
        return +acc + Number(curr.weight);
      }, 0),
    },
    {
      title: t("total 24 gold box"),
      number: karat_24_values?.length,
      weight: karat_24_values?.reduce((acc, curr) => {
        return +acc + Number(curr.weight);
      }, 0),
    },
    {
      title: t("Total cash"),
      number: dataSource?.length,
      weight: dataSource?.reduce((acc, curr) => {
        return +acc + Number(curr.value);
      }, 0),
    },
    {
      title: t("total wages"),
      number: dataSource?.length,
      value: dataSource?.reduce((acc, curr) => {
        return +acc + Number(curr.wage);
      }, 0),
    },
  ];

  const columns = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "hwya",
        header: () => <span>{t("hwya")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "classification_name",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "category_name",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "wage",
        header: () => <span>{t("wage")}</span>,
      },
      {
        cell: (info: any) => info.row.original.value || "---",
        accessorKey: "value",
        header: () => <span>{t("value")}</span>,
      },
    ],
    []
  );
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
    pageStyle: `
      @page {
        size: auto;
        margin: 20px !imporatnt;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .break-page {
          page-break-before: always;
        }
        .rtl {
          direction: rtl;
          text-align: right;
        }
        .ltr {
          direction: ltr;
          text-align: left;
        }
        .container_print {
          width: 100%;
          padding: 20px;
          box-sizing: border-box;
        }
      }
    `,
  });

  return (
    <div className="py-12 px-20">
      <div className="flex items-center justify-between">
        <div>
          <h2>
            <span className="font-semibold">{t("date")} : </span> {date}
          </h2>
          <h2 className="mt-1.5">
            <span className="font-semibold">
              {t("Lost and Found Report Number")} :{" "}
            </span>{" "}
            {reportNumber}
          </h2>
        </div>

        <div>
          <Button action={handlePrint}>{t("print")}</Button>
        </div>
      </div>

      <div
        ref={contentRef}
        className={`${isRTL ? "rtl" : "ltr"} container_print`}
      >
        <div className="my-6 text-center">
          <img src={Logo} alt="logo" className="mx-auto" />
          <h2 className="text-lg font-semibold">
            {t("Lost and Found Report")}
          </h2>
        </div>

        {/* <ul className="grid grid-cols-4 gap-x-8  gap-y-6 my-8">
          {totals?.map((item, index) => (
            <li key={index} className=" text-center">
              <h2 className="bg-mainGreen text-white p-4 rounded-t-xl">
                {item.title}
              </h2>
              <div className="bg-[#295E560D] border border-mainGreen p-3 text-mainGreen rounded-b-xl">
                <p>
                  <span className="font-semibold">{item.number ?? 0}</span>{" "}
                  {t("item")}
                </p>
                <p>
                  <span className="font-semibold">{item.weight ?? 0}</span>{" "}
                  {t("gram")}
                </p>
              </div>
            </li>
          ))}
        </ul> */}

        <Table data={dataSource ?? []} columns={columns} />

        {/* <div className="bg-white mt-8 p-12 rounded-xl text-[17.3px] text-center">
          <span>
            {t("I, the undersigned")} /{" "}
            <span className="font-semibold">{userData?.name}</span> ,{" "}
            {t("nationality")} /{" "}
            <span className="font-semibold">{userData?.nationality_name}</span>{" "}
            , {t("ID No. :")}{" "}
            <span className="font-semibold">{userData?.national_number}</span> ,{" "}
            {t("issued by")} / .....................
          </span>
          <p className="mt-2.5">
            {t(
              "I acknowledge that I have lost the items shown in full details, cash and gold, and that I am fully responsible for them as they were in my custody and under my responsibility."
            )}
          </p>
        </div> */}

        <div className="flex items-center justify-between mt-8 mb-4">
          <div className="text-center">
            <h2 className="text-[17px] font-medium">
              {t(
                "Names and signatures of the members of the inventory committee"
              )}
            </h2>
            <p className="text-xl mt-1.5">
              .................................................
            </p>
          </div>
          <div className="text-center">
            <h2 className="text-[17px] font-medium">
              {t(
                "Name and signature of the person responsible for the lost items"
              )}
            </h2>
            <p className="text-xl mt-1.5">
              .................................................
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostItemsReports;
