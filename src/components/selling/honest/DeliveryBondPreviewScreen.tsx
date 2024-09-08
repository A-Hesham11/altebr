import { t } from "i18next";
import { useContext, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useIsRTL, useMutate } from "../../../hooks";
import { formatDate } from "../../../utils/date";
import { mutateData } from "../../../utils/mutateData";
import { Button } from "../../atoms";
import InvoiceTable from "../selling components/InvoiceTable";
import { SellingFinalPreview } from "../selling components/SellingFinalPreview";
import { numberContext } from "../../../context/settings/number-formatter";
import { notify } from "../../../utils/toast";
import { useReactToPrint } from "react-to-print";
import { convertNumToArWord } from "../../../utils/number to arabic words/convertNumToArWord";

type CreateHonestSanadProps_TP = {
  setStage: React.Dispatch<React.SetStateAction<number>>;
  selectedItem: never[];
  paymentData: never[];
};
const DeliveryBondPreviewScreen = ({
  setStage,
  selectedItem,
  paymentData,
}: CreateHonestSanadProps_TP) => {
  console.log("🚀 ~ paymentData:", paymentData);
  const { formatGram, formatReyal } = numberContext();
  const { userData } = useContext(authCtx);
  const contentRef = useRef();
  const isRTL = useIsRTL();

  const taxRate = userData?.tax_rate / 100;

  const prepaidAmount = selectedItem.amount;

  const totalCommissionRatio = paymentData.reduce((acc, card) => {
    if (card.add_commission_ratio === "yes") {
      acc += +card.commission_riyals;
    }
    return acc;
  }, 0);
  const ratioForOneItem = totalCommissionRatio / selectedItem.items.length;

  const totalCommissionTaxes = paymentData.reduce((acc, card) => {
    if (card.add_commission_ratio === "yes") {
      acc += +card.commission_tax;
    }
    return acc;
  }, 0);

  const ratioForOneItemTaxes = totalCommissionTaxes / selectedItem.items.length;

  const totalWeight = selectedItem?.items?.reduce((acc, curr) => {
    acc += +curr.weight;
    return acc;
  }, 0);

  const totalCost = selectedItem.items.reduce((acc, curr) => {
    acc += +curr.cost;
    return acc;
  }, 0);
  const totalFinalCost =
    totalCost +
    totalCommissionRatio +
    totalCost * +taxRate +
    totalCommissionTaxes;

  const totalFinalCostIntoArabic = convertNumToArWord(
    Math.round(totalFinalCost)
  );
  console.log("🚀 ~ totalFinalCostIntoArabic:", totalFinalCostIntoArabic);

  // gather cost data to pass it to SellingFinalPreview as props
  const costDataAsProps = {
    totalCommissionRatio,
    ratioForOneItem,
    totalCommissionTaxes,
    totalFinalCost,
    totalCost,
    prepaidAmount,
  };

  const resultTable = [
    {
      number: t("totals"),
      weight: formatGram(Number(totalWeight)),
      cost: formatReyal(Number(totalCost + totalCommissionRatio)),
      vat: formatReyal(Number(totalCost * taxRate + totalCommissionTaxes)),
      total: formatReyal(Number(totalFinalCost)),
    },
  ];

  const Cols = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "category_value",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "karat_value",
        header: () => <span>{t("karat")}</span>,
      },

      {
        cell: (info: any) => selectedItem.employee_value,
        accessorKey: "employee_value",
        header: () => <span>{t("employee name")}</span>,
      },
      {
        cell: (info: any) => selectedItem.bond_date,
        accessorKey: "receive_date",
        header: () => <span>{t("receive date")}</span>,
      },
      {
        cell: (info: any) => formatDate(new Date()),
        accessorKey: "deliver_date",
        header: () => <span>{t("deliver date")}</span>,
      },
      {
        cell: (info: any) => formatGram(Number(info.getValue())) || "---",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        header: () => <span>{t("cost")}</span>,
        accessorKey: "cost",
        cell: (info: any) => {
          const rowData = +info.row.original.cost + +ratioForOneItem;
          return <div>{formatReyal(Number(rowData))}</div>;
        },
      },
      {
        header: () => <span>{t("VAT")}</span>,
        accessorKey: "VAT",
        cell: (info: any) => {
          const rowData =
            +info.row.original.cost * +taxRate + +ratioForOneItemTaxes;
          return <div>{formatReyal(Number(rowData))}</div>;
        },
      },
      {
        header: () => <span>{t("total")}</span>,
        accessorKey: "total",
        cell: (info: any) => {
          const rowData = +info.row.original.cost + ratioForOneItem;
          const rowDataTaxes =
            +info.row.original.cost * +taxRate + ratioForOneItemTaxes;
          return <div>{formatReyal(Number(rowData + rowDataTaxes))}</div>;
        },
      },
    ],
    []
  );
  const TableComp = () => (
    <InvoiceTable
      data={selectedItem.items.filter(
        (item) => item.return_status === "not_returned"
      )}
      columns={Cols}
      paymentData={paymentData}
      resultTable={resultTable}
      totalFinalCostIntoArabic={totalFinalCostIntoArabic}
    ></InvoiceTable>
  );

  //
  const navigate = useNavigate();

  // api
  const { mutate, isLoading, isSuccess } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success");
      // navigate(`/selling/honesty/return-honest/${data.bond_id}`);
    },
  });
  const posHonestDataHandler = () => {
    const bond = {
      client_id: selectedItem.client_id,
      employee_id: selectedItem.employee_id,
      amount: selectedItem.amount,
      branch_id: userData?.branch_id,
      bond_date: selectedItem.bond_date,
      total_inovice: totalFinalCost,
      total_vat: totalCost * +taxRate + totalCommissionTaxes,
      bond_id: selectedItem.id,
    };
    const items = selectedItem.items
      .filter((item) => item.return_status === "not_returned")
      .map((item) => {
        const rowData = +item.cost + ratioForOneItem;
        const rowDataTaxes = +item.cost * +taxRate + ratioForOneItemTaxes;
        return {
          category_id: item.category_id,
          bondsafety_id: selectedItem.id,
          karat_id: item.karat_id,
          mineral_id: item.mineral_id,
          karatmineral_id: item.karatmineral_id,
          weight: item.weight,
          cost: +item.cost + +ratioForOneItem,
          vat: +item.cost * +taxRate + +ratioForOneItemTaxes,
          total: rowData + rowDataTaxes,
        };
      });
    const card = paymentData.reduce((acc, curr) => {
      const maxDiscountOrNOt =
        curr.amount >= curr.max_discount_limit
          ? curr.add_commission_ratio === "yes"
            ? Number(curr.amount) + Number(curr?.max_discount_limit_value)
            : Number(curr.amount)
          : curr.add_commission_ratio === "yes"
          ? Number(curr.amount) + Number(curr?.max_discount_limit_value)
          : Number(curr.amount);

      acc[curr.frontKeyAccept] =
        curr.add_commission_ratio === "yes"
          ? +maxDiscountOrNOt + Number(curr.commission_tax)
          : +maxDiscountOrNOt;

      return acc;
    }, {});

    const paymentCommission = paymentData.reduce((acc, curr) => {
      const commissionReyals = Number(curr.commission_riyals);
      const commissionVat =
        Number(curr.commission_riyals) * (userData?.tax_rate / 100);

      acc[curr.frontKeyAccept] = {
        commission: commissionReyals,
        vat: commissionVat,
      };
      return acc;
    }, {});
    mutate({
      endpointName: "branchSafety/api/v1/create-receive",
      values: { bond, items, card, paymentCommission },
    });
    console.log(
      "🚀 ~ posHonestDataHandler ~ values: { bond, items, card, paymentCommission }:",
      { bond, items, card, paymentCommission }
    );
  };

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
      }
    `,
  });

  return (
    <div>
      <h2 className="mb-4 mt-8 text-base font-bold mx-8">{t("honest")}</h2>
      <div className="flex items-center justify-between mx-8">
        <h2 className="text-base font-bold">{t("final preview")}</h2>
        <div className="flex gap-3">
          {isSuccess ? (
            <Button
              className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen"
              onClick={handlePrint}
            >
              {t("print")}
            </Button>
          ) : (
            <Button
              className="bg-mainOrange px-7 py-[6px]"
              loading={isLoading}
              action={posHonestDataHandler}
            >
              {t("save")}
            </Button>
          )}
        </div>
      </div>
      <div ref={contentRef} className={`${isRTL ? "rtl" : "ltr"}`}>
        <SellingFinalPreview
          ItemsTableContent={<TableComp />}
          setStage={setStage}
          paymentData={paymentData}
          isSuccess={isSuccess}
          clientData={selectedItem}
          costDataAsProps={costDataAsProps}
        />
      </div>
    </div>
  );
};

export default DeliveryBondPreviewScreen;
