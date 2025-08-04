import Logo from "../../../../assets/bill-logo.png";
import { t } from "i18next";
import { Button } from "../../../../components/atoms";
import { useContext, useMemo, useRef } from "react";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { useIsRTL } from "../../../../hooks";
import { useReactToPrint } from "react-to-print";
import { numberContext } from "../../../../context/settings/number-formatter";
import { useLocation } from "react-router-dom";
import { Table } from "../../../../components/templates/reusableComponants/tantable/Table";
import { convertNumToArWord } from "../../../../utils/number to arabic words/convertNumToArWord";

const BranchInventoryReport = ({ dataSource, date, reportNumber }: any) => {
  const { userData } = useContext(authCtx);
  const contentRef = useRef();
  const isRTL = useIsRTL();
  const { formatGram, formatReyal } = numberContext();
  const { state } = useLocation();

  const listItems = [
    {
      drop_id: "d",
      title: t("Branch Inventory Report"),
      report_name: t("Branch Inventory Report"),
    },
    {
      drop_id: "e",
      title: t("Minutes of delivery of custody"),
      report_name: "Custody Handover Report",
    },
    {
      drop_id: "f",
      title: t("Minutes of receipt of the trust"),
      report_name: "Custody Receipt Report",
    },
    {
      drop_id: "g",
      title: t("Inventory report"),
      report_name: "Branch inventory report",
    },
  ];

  const listItemFilter = listItems.filter(
    (item) => item.drop_id === state.reportID
  );

  const BanksData = Object.entries({ ...dataSource?.banks }).map(
    ([bankName, value]) => ({
      title: bankName,
      value: formatReyal(value),
      unit: t("reyal"),
    })
  );

  const BanksDataTable = Object.entries({ ...dataSource?.banks }).map(
    ([bankName, value]) => ({
      name: bankName,
      amount: formatReyal(value),
      amountAR: convertNumToArWord(Math.round(value)),
    })
  );

  const totals = [
    {
      title: t("Cash"),
      value: formatReyal(dataSource?.assets.cash),
      unit: t("reyal"),
    },
    {
      title: t("total wages"),
      value: formatReyal(dataSource?.assets.wages),
      unit: t("reyal"),
    },
    {
      title: t("Total New Gold 18 karat"),
      value: formatGram(dataSource?.assets.new_18),
      unit: t("gram"),
    },
    {
      title: t("Total New Gold 21 karat"),
      value: formatGram(dataSource?.assets.new_21),
      unit: t("gram"),
    },
    {
      title: t("Total New Gold 22 karat"),
      value: formatGram(dataSource?.assets.new_22),
      unit: t("gram"),
    },
    {
      title: t("Total New Gold 24 karat"),
      value: formatGram(dataSource?.assets.new_24),
      unit: t("gram"),
    },
    {
      title: t("Total gold fraction 18"),
      value: formatGram(dataSource?.assets.old_18),
      unit: t("gram"),
    },
    {
      title: t("Total gold fraction 21"),
      value: formatGram(dataSource?.assets.old_21),
      unit: t("gram"),
    },
    {
      title: t("Total gold fraction 22"),
      value: formatGram(dataSource?.assets.old_22),
      unit: t("gram"),
    },
    {
      title: t("Total gold fraction 24"),
      value: formatGram(dataSource?.assets.old_24),
      unit: t("gram"),
    },
    ...BanksData,
    {
      title: t("diamond value"),
      value: formatReyal(dataSource?.assets.diamond_value),
      unit: t("reyal"),
    },
    {
      title: t("accessory value"),
      value: formatReyal(dataSource?.assets.accessory_value),
      unit: t("reyal"),
    },
    {
      title: t("Diamond Quantity"),
      value: formatReyal(dataSource?.assets.diamond_count),
      unit: t("item"),
    },
    {
      title: t("accessory Quantity"),
      value: formatReyal(dataSource?.assets.accessory_count),
      unit: t("item"),
    },
    {
      title: t("Total cash"),
      value: formatReyal(dataSource?.assets.totalCash),
      unit: t("reyal"),
    },
    {
      title: t("Total Gold 24"),
      value: formatGram(dataSource?.assets.total_weightNewGold_24),
      unit: t("gram"),
    },
  ];

  const data = [
    {
      name: t("Cash"),
      amount: formatGram(dataSource?.assets.cash),
      amountAR: convertNumToArWord(Math.round(dataSource?.assets.cash)),
    },
    {
      name: t("total wages"),
      amount: formatGram(dataSource?.assets.wages),
      amountAR: convertNumToArWord(Math.round(dataSource?.assets.wages)),
    },
    {
      name: t("Total New Gold 18 karat"),
      amount: formatGram(dataSource?.assets.new_18),
      amountAR: convertNumToArWord(Math.round(dataSource?.assets.new_18)),
    },
    {
      name: t("Total New Gold 21 karat"),
      amount: formatGram(dataSource?.assets.new_21),
      amountAR: convertNumToArWord(Math.round(dataSource?.assets.new_21)),
    },
    {
      name: t("Total New Gold 22 karat"),
      amount: formatGram(dataSource?.assets.new_22),
      amountAR: convertNumToArWord(Math.round(dataSource?.assets.new_22)),
    },
    {
      name: t("Total New Gold 24 karat"),
      amount: formatGram(dataSource?.assets.new_24),
      amountAR: convertNumToArWord(Math.round(dataSource?.assets.new_24)),
    },

    {
      name: t("Total gold fraction 18"),
      amount: formatGram(dataSource?.assets.old_18),
      amountAR: convertNumToArWord(Math.round(dataSource?.assets.old_18)),
    },
    {
      name: t("Total gold fraction 21"),
      amount: formatGram(dataSource?.assets.old_21),
      amountAR: convertNumToArWord(Math.round(dataSource?.assets.old_21)),
    },
    {
      name: t("Total gold fraction 22"),
      amount: formatGram(dataSource?.assets.old_22),
      amountAR: convertNumToArWord(Math.round(dataSource?.assets.old_22)),
    },
    {
      name: t("Total gold fraction 24"),
      amount: formatGram(dataSource?.assets.old_24),
      amountAR: convertNumToArWord(Math.round(dataSource?.assets.old_24)),
    },
    ...BanksDataTable,
    {
      name: t("diamond value"),
      amount: formatGram(dataSource?.assets.diamond_value),
      amountAR: convertNumToArWord(
        Math.round(dataSource?.assets.diamond_value)
      ),
    },
    {
      name: t("accessory value"),
      amount: formatGram(dataSource?.assets.accessory_value),
      amountAR: convertNumToArWord(
        Math.round(dataSource?.assets.accessory_value)
      ),
    },

    {
      name: t("Diamond Quantity"),
      amount: formatGram(dataSource?.assets.diamond_count),
      amountAR: convertNumToArWord(
        Math.round(dataSource?.assets.diamond_count)
      ),
    },
    {
      name: t("accessory Quantity"),
      amount: formatGram(dataSource?.assets.accessory_count),
      amountAR: convertNumToArWord(
        Math.round(dataSource?.assets.accessory_count)
      ),
    },
    {
      name: t("Total cash"),
      amount: formatGram(dataSource?.assets.totalCash),
      amountAR: convertNumToArWord(Math.round(dataSource?.assets.totalCash)),
    },
    {
      name: t("Total Gold 24"),
      amount: formatGram(dataSource?.assets.total_weightNewGold_24),
      amountAR: convertNumToArWord(
        Math.round(dataSource?.assets.total_weightNewGold_24)
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
              {t(listItemFilter?.[0]?.report_name)}
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
          <ul className="grid grid-cols-4 gap-x-8  gap-y-6 my-6">
            {totals?.map((item, index) => (
              <li key={index} className=" text-center">
                <h2 className="bg-mainGreen text-white p-3 rounded-t-xl">
                  {item.title}
                </h2>
                <div className="bg-[#295E560D] border border-mainGreen p-2.5 text-mainGreen rounded-b-xl">
                  <p>
                    <span className="font-semibold">{item.value ?? 0}</span>{" "}
                    {item.unit}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="print-only my-5">
          <Table data={data} columns={columns} />
        </div>

        {["e", "f", "g"].includes(state?.reportID) && (
          <div className="bg-white mt-8 p-12 rounded-xl text-[17.3px] text-center">
            <span>
              {t("I, the undersigned")} /{" "}
              <span className="font-semibold">
                ...............................................
              </span>{" "}
              , {t("nationality")} /{" "}
              <span className="font-semibold">
                ......................................
              </span>{" "}
              , {t("ID No. :")}{" "}
              <span className="font-semibold">
                ...........................................
              </span>{" "}
              , {t("issued by")} / ...................................
              <p className="mt-2.5">
                {t("I acknowledge the existence of the details shown above on")}{" "}
                /{" "}
                <span className="font-semibold">
                  .................................
                </span>{" "}
                ,
                <span>
                  {t(
                    "With all its details in cash and gold, and I am responsible for it"
                  )}
                </span>
              </p>
            </span>
          </div>
        )}

        {/* {["g"].includes(state?.reportID) && (
          <div className="bg-white mt-8 p-12 rounded-xl text-[17.3px] text-center">
            <span>
              {t("I, the undersigned")} /{" "}
              <span className="font-semibold">{userData?.name}</span> ,{" "}
              {t("nationality")} /{" "}
              <span className="font-semibold">
                {userData?.nationality_name}
              </span>{" "}
              , {t("ID No. :")}{" "}
              <span className="font-semibold">{userData?.national_number}</span>{" "}
              , {t("issued by")} / .....................
            </span>
            <p className="mt-2.5">
              {t(
                "I acknowledge that I have lost the items shown in full details, cash and gold, and that I am fully responsible for them as they were in my custody and under my responsibility."
              )}
            </p>
          </div>
        )} */}

        {["f"].includes(state?.reportID) && (
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
                {t("Name and signature of the Muslim covenant")}
              </h2>
              <p className="text-xl mt-1.5">
                .................................................
              </p>
            </div>
          </div>
        )}

        {["e", "g"].includes(state?.reportID) && (
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
        )}
      </div>
    </div>
  );
};

export default BranchInventoryReport;
