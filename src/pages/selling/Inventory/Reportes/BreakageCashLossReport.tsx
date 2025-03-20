import Logo from "../../../../assets/bill-logo.png";
import { t } from "i18next";
import { Button } from "../../../../components/atoms";
import { Table } from "../../../../components/templates/reusableComponants/tantable/Table";
import { useReactTable } from "@tanstack/react-table";
import { useContext, useMemo, useRef } from "react";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { useIsRTL } from "../../../../hooks";
import { useReactToPrint } from "react-to-print";
import { numberContext } from "../../../../context/settings/number-formatter";
import { convertNumToArWord } from "../../../../utils/number to arabic words/convertNumToArWord";

const BreakageCashLossReport = ({ dataSource, reportNumber, date }: any) => {
  console.log("🚀 ~ LostItemsReports ~ dataSource:", dataSource);
  const { userData } = useContext(authCtx);
  const contentRef = useRef();
  const isRTL = useIsRTL();
  const { formatGram, formatReyal } = numberContext();

  const totalsBrokenGold = [
    {
      title: t("Total Actual Broken Gold"),
      value: formatGram(
        dataSource?.totalWeightGoldOld_to_24?.assets_OldGold_to_24
      ),
    },
    {
      title: t("Total Recorded Broken Gold"),
      value: formatGram(
        dataSource?.totalWeightGoldOld_to_24?.missing_OldGold_to_24
      ),
    },
    {
      title: t("Broken Gold Difference"),
      value: formatGram(
        dataSource?.totalWeightGoldOld_to_24?.assets_OldGold_to_24 -
          dataSource?.totalWeightGoldOld_to_24?.missing_OldGold_to_24
      ),
    },
  ];

  const totalsCash = [
    {
      title: t("Total Actual Cash Box Amount"),
      value: formatReyal(dataSource?.cashing.assets_cash),
    },
    {
      title: t("Total Recorded Cash Box Amount"),
      value: formatReyal(dataSource?.cashing?.missing_cash),
    },
    {
      title: t("Cash Box Difference"),
      value: formatReyal(
        dataSource?.cashing.assets_cash - dataSource?.cashing?.missing_cash
      ),
    },
  ];

  const data = [
    {
      name: t("Total Actual Broken Gold"),
      amount: formatGram(
        dataSource?.totalWeightGoldOld_to_24?.assets_OldGold_to_24
      ),
      amountAR: convertNumToArWord(
        Math.round(dataSource?.totalWeightGoldOld_to_24?.assets_OldGold_to_24)
      ),
    },
    {
      name: t("Total Recorded Broken Gold"),
      amount: formatGram(
        dataSource?.totalWeightGoldOld_to_24?.missing_OldGold_to_24
      ),
      amountAR: convertNumToArWord(
        Math.round(dataSource?.totalWeightGoldOld_to_24?.missing_OldGold_to_24)
      ),
    },
    {
      name: t("Broken Gold Difference"),
      amount: formatGram(
        dataSource?.totalWeightGoldOld_to_24?.assets_OldGold_to_24 -
          dataSource?.totalWeightGoldOld_to_24?.missing_OldGold_to_24
      ),
      amountAR: convertNumToArWord(
        Math.round(
          dataSource?.totalWeightGoldOld_to_24?.assets_OldGold_to_24 -
            dataSource?.totalWeightGoldOld_to_24?.missing_OldGold_to_24
        )
      ),
    },
    {
      name: t("Total Actual Cash Box Amount"),
      amount: formatGram(dataSource?.cashing.assets_cash),
      amountAR: convertNumToArWord(Math.round(dataSource?.cashing.assets_cash)),
    },
    {
      name: t("Total Recorded Cash Box Amount"),
      amount: formatGram(dataSource?.cashing?.missing_cash),
      amountAR: convertNumToArWord(
        Math.round(dataSource?.cashing?.missing_cash)
      ),
    },
    {
      name: t("Cash Box Difference"),
      amount: formatGram(
        dataSource?.cashing.assets_cash - dataSource?.cashing?.missing_cash
      ),
      amountAR: convertNumToArWord(
        Math.round(
          dataSource?.cashing.assets_cash - dataSource?.cashing?.missing_cash
        )
      ),
    },
  ];

  const columns = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "name",
        header: () => <span>{t("name")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "amount",
        header: () => <span>{t("amount")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "amountAR",
        header: () => <span>{t("amount in words")}</span>,
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
    <div className="p-12">
      <div className="flex items-center justify-end">
        <div>
          <Button action={handlePrint}>{t("print")}</Button>
        </div>
      </div>

      <div
        ref={contentRef}
        className={`${isRTL ? "rtl" : "ltr"} container_print`}
      >
        <div className="my-6 grid grid-cols-3 ">
          <div>
            <h2>
              <span className="font-semibold">{t("date")} : </span> {date}
            </h2>
            <h2 className="mt-1.5">
              <span className="font-semibold">{t("Report number")} : </span>{" "}
              {reportNumber}
            </h2>
          </div>
          <div className="flex justify-center flex-col items-center">
            <img src={Logo} alt="logo" className="mx-auto" />
            <h2 className="text-lg font-semibold">
              {t("Lost and Found Report")}
            </h2>
          </div>
          <div className="flex justify-end">
            <p>
              {t("branch number")} : {userData?.branch_id}
            </p>
          </div>
        </div>

        <div className="no-print">
          <h2 className="font-semibold">{t("Totals")}</h2>
          <ul className="grid grid-cols-3 gap-x-8  gap-y-6 my-6">
            {totalsBrokenGold?.map((item, index) => (
              <li key={index} className=" text-center">
                <h2 className="bg-mainOrange text-white p-3 rounded-t-xl">
                  {item.title}
                </h2>
                <div className="bg-[#295E560D] border border-mainOrange p-2.5 text-mainOrange rounded-b-xl">
                  <p>
                    <span className="font-semibold">{item.value ?? 0}</span>{" "}
                    {t("gram")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <ul className="grid grid-cols-3 gap-x-8  gap-y-6 my-6">
            {totalsCash?.map((item, index) => (
              <li key={index} className=" text-center">
                <h2 className="bg-mainGreen text-white p-3 rounded-t-xl">
                  {item.title}
                </h2>
                <div className="bg-[#295E560D] border border-mainGreen p-2.5 text-mainGreen rounded-b-xl">
                  <p>
                    <span className="font-semibold">{item.value ?? 0}</span>{" "}
                    {t("reyal")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="print-only my-5">
          <Table data={data} columns={columns} />
        </div>

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

export default BreakageCashLossReport;
