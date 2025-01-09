import Logo from "../../../../assets/bill-logo.png";
import { t } from "i18next";
import { Button } from "../../../../components/atoms";
import { useContext, useMemo, useRef } from "react";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { useIsRTL } from "../../../../hooks";
import { useReactToPrint } from "react-to-print";
import { numberContext } from "../../../../context/settings/number-formatter";
import { useLocation } from "react-router-dom";

const BranchInventoryReport = ({
  dataSource,
  reportNumber,
  date,
  reportName,
}: any) => {
  console.log("🚀 ~ LostItemsReports ~ dataSource:", dataSource);
  const { userData } = useContext(authCtx);
  const contentRef = useRef();
  const isRTL = useIsRTL();
  const { formatGram, formatReyal } = numberContext();
  const { state } = useLocation();

  const totals = [
    {
      title: t("Cash"),
      value: formatReyal(dataSource?.assets.cash),
      unit: t("reyal"),
    },
    // {
    //   title: t("Total Bank Amount"),
    //   value: formatReyal(dataSource?.assets.cash),
    //   unit: t("reyal"),
    // },
    {
      title: t("total wages"),
      value: formatReyal(dataSource?.assets.wages),
      unit: t("reyal"),
    },
    {
      title: t("Total New Gold 18 karat"),
      value: formatReyal(dataSource?.assets.new_18),
      unit: t("gram"),
    },
    {
      title: t("Total New Gold 21 karat"),
      value: formatReyal(dataSource?.assets.new_21),
      unit: t("gram"),
    },
    {
      title: t("Total New Gold 22 karat"),
      value: formatReyal(dataSource?.assets.new_22),
      unit: t("gram"),
    },
    {
      title: t("Total New Gold 24 karat"),
      value: formatReyal(dataSource?.assets.new_24),
      unit: t("gram"),
    },
    {
      title: t("Total gold fraction 18"),
      value: formatReyal(dataSource?.assets.old_18),
      unit: t("gram"),
    },
    {
      title: t("Total gold fraction 21"),
      value: formatReyal(dataSource?.assets.old_21),
      unit: t("gram"),
    },
    {
      title: t("Total gold fraction 22"),
      value: formatReyal(dataSource?.assets.old_22),
      unit: t("gram"),
    },
    {
      title: t("Total gold fraction 24"),
      value: formatReyal(dataSource?.assets.old_24),
      unit: t("gram"),
    },

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
      value: formatReyal(dataSource?.assets.total_weightNewGold_24),
      unit: t("gram"),
    },
  ];

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
          <h2 className="text-lg font-semibold">{t(reportName)}</h2>
        </div>

        <div>
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

        {["e", "f", "g"].includes(state?.reportID) && (
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
        )}

        {["e", "f", "g"].includes(state?.reportID) && (
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
