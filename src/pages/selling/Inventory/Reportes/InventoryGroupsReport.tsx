import Logo from "../../../../assets/bill-logo.png";
import { t } from "i18next";
import { Button } from "../../../../components/atoms";
import { Table } from "../../../../components/templates/reusableComponants/tantable/Table";
import { useReactTable } from "@tanstack/react-table";
import { useContext, useMemo, useRef } from "react";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { useIsRTL } from "../../../../hooks";
import { useReactToPrint } from "react-to-print";

const InventoryGroupsReport = ({ dataSource, reportNumber, date }: any) => {
  console.log("🚀 ~ LostItemsReports ~ dataSource:", dataSource);
  const { userData } = useContext(authCtx);
  const contentRef = useRef();
  const isRTL = useIsRTL();

  const totals = [
    {
      title: t("Total Quantity"),
      value: dataSource?.reduce((acc, curr) => {
        return +acc + Number(curr.items_number);
      }, 0),
    },
    {
      title: t("total weight"),
      value: dataSource?.reduce((acc, curr) => {
        return +acc + Number(curr.weight_to_24);
      }, 0),
    },
  ];

  const columns = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "employee_name",
        header: () => <span>{t("Username")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "group_number",
        header: () => <span>{t("Group Number")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "items_number",
        header: () => <span>{t("Quantity")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "weight_to_24",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "wage",
        header: () => <span>{t("Start Time")}</span>,
      },
      {
        cell: (info: any) => info.row.original.value || "---",
        accessorKey: "value",
        header: () => <span>{t("End Time")}</span>,
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

        <Table data={dataSource ?? []} columns={columns} />

        <ul className="grid grid-cols-4 gap-x-8  gap-y-6 my-8">
          {totals?.map((item, index) => (
            <li key={index} className=" text-center">
              <h2 className="bg-mainGreen text-white p-3 rounded-t-xl">
                {item.title}
              </h2>
              <div className="bg-[#295E560D] border border-mainGreen p-2.5 text-mainGreen rounded-b-xl">
                <p>
                  <span className="font-semibold">{item.value ?? 0}</span>{" "}
                  {t("item")}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between mt-8 mb-4">
          <div className="text-center">
            <h2 className="font-medium">
              {t(
                "Names and signatures of the members of the inventory committee"
              )}
            </h2>
            <p className="text-xl mt-1.5">
              .................................................
            </p>
          </div>
          <div className="text-center">
            <h2 className="font-medium">
              {t("Name and Signature of the Custodian")}
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

export default InventoryGroupsReport;
