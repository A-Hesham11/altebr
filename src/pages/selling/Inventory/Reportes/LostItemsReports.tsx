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

const LostItemsReports = ({ dataSource, reportNumber, date }: any) => {
  const contentRef = useRef();
  const isRTL = useIsRTL();
  const { formatGram, formatReyal } = numberContext();
  const { userData } = useContext(authCtx);

  const LostReportsData = dataSource?.map((item) => {
    return {
      hwya: item.hwya,
      classification_id: item.classification_id,
      classification_name: item.classification_name,
      category_name: item.category_name,
      karat_name: item.karat_name,
      karatmineral: item.karatmineral,
      gold_18: item.karat_name == "18" ? item.weight : null,
      gold_21: item.karat_name == "21" ? item.weight : null,
      gold_22: item.karat_name == "22" ? item.weight : null,
      gold_24: item.karat_name == "24" ? item.weight : null,
      weight: item.weight,
      wage: item.wage,
      value: item.value,
    };
  });

  const totalCash = dataSource
    ?.filter((item) => item.classification_id != 1)
    .reduce((acc, curr) => {
      return +acc + Number(curr.value);
    }, 0);

  const totalWages = dataSource
    ?.filter((item) => item.classification_id == 1)
    .reduce((acc, curr) => {
      return +acc + Number(curr.wage * curr.weight);
    }, 0);

  const karat_18_values = dataSource?.filter(
    (item) => item.karat_name === "18"
  );
  const karat_21_values = dataSource?.filter(
    (item) => item.karat_name === "21"
  );
  const karat_22_values = dataSource?.filter(
    (item) => item.karat_name === "22"
  );
  const karat_24_values = dataSource?.filter(
    (item) => item.karat_name === "24"
  );

  const weight_18 = karat_18_values?.reduce((acc, curr) => {
    return +acc + Number(curr.weight);
  }, 0);
  const weight_21 = karat_21_values?.reduce((acc, curr) => {
    return +acc + Number(curr.weight);
  }, 0);
  const weight_22 = karat_22_values?.reduce((acc, curr) => {
    return +acc + Number(curr.weight);
  }, 0);
  const weight_24 = karat_24_values?.reduce((acc, curr) => {
    return +acc + Number(curr.weight);
  }, 0);

  const totalWeightConvertTo24 =
    weight_18 * (18 / 24) +
    weight_21 * (21 / 24) +
    weight_22 * (22 / 24) +
    weight_24;

  const totals = [
    {
      id: crypto.randomUUID(),
      value: dataSource?.length,
    },
    {
      id: crypto.randomUUID(),
      value: "",
    },
    {
      id: crypto.randomUUID(),
      value: "",
    },
    {
      id: crypto.randomUUID(),
      value: "",
    },
    {
      id: crypto.randomUUID(),
      value: formatGram(weight_18),
    },
    {
      id: crypto.randomUUID(),
      value: formatGram(weight_21),
    },
    {
      id: crypto.randomUUID(),
      value: formatGram(weight_22),
    },
    {
      id: crypto.randomUUID(),
      value: formatGram(weight_24),
    },
    {
      id: crypto.randomUUID(),
      value: formatReyal(totalWages),
    },
    {
      id: crypto.randomUUID(),
      value: formatReyal(totalCash),
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
        cell: (info: any) =>
          info.row.original.classification_id == 1
            ? info.getValue()
            : info.row.original.karatmineral || "---",
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "gold_18",
        header: () => <span>{t("18")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "gold_21",
        header: () => <span>{t("21")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "gold_22",
        header: () => <span>{t("22")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "gold_24",
        header: () => <span>{t("24")}</span>,
      },
      {
        cell: (info: any) =>
          info.row.original.classification_id === 1
            ? info.row.original.value
            : "---",
        accessorKey: "wage",
        header: () => <span>{t("wage")}</span>,
      },
      {
        cell: (info: any) =>
          info.row.original.classification_id !== 1
            ? info.row.original.value
            : "---",
        accessorKey: "value",
        header: () => <span>{t("value")}</span>,
      },
    ],
    [LostReportsData?.length]
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
        <Button action={handlePrint}>{t("print")}</Button>
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

        <Table data={LostReportsData ?? []} columns={columns} Totals={totals} />

        <div className="font-semibold text-mainGreen flex items-center mt-8">
          <h2 className="w-72">{t("total weight of adapter 24")}</h2>
          <p className="w-44">{formatGram(totalWeightConvertTo24)}</p>
          <p>
            {convertNumToArWord(Math.round(totalWeightConvertTo24))}{" "}
            <span>{t("gram")}</span>
          </p>
        </div>
        <div className="font-semibold text-mainOrange flex items-center mt-3">
          <h2 className="w-72">{t("total cash")}</h2>
          <p className="w-44">{formatGram(totalCash + totalWages)}</p>
          <p>
            {convertNumToArWord(Math.round(totalCash + totalWages))}{" "}
            <span>{t("reyal")}</span>
          </p>
        </div>

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
