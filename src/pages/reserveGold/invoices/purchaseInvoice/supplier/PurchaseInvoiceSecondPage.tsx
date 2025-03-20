import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useRef,
} from "react";
import { notify } from "../../../../../utils/toast";
import { t } from "i18next";
import { Button } from "../../../../../components/atoms";
import { numberContext } from "../../../../../context/settings/number-formatter";
import { authCtx } from "../../../../../context/auth-and-perm/auth";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { useFetch, useIsRTL, useMutate } from "../../../../../hooks";
import { mutateData } from "../../../../../utils/mutateData";
import ReserveSecondPageTable from "./ReserveSecondPageTable";
import ReserveSecondPageFinalPreview from "./ReserveSecondPageFinalPreview";
import { useFormikContext } from "formik";
import { formatDate, getDayAfter } from "../../../../../utils/date";
import { GlobalDataContext } from "../../../../../context/settings/GlobalData";
import { useReactToPrint } from "react-to-print";

interface purchaseInvoicesSecondPage_TP {
  setStage?: Dispatch<SetStateAction<number>>;
  goldPrice: any;
  buyingItemsData: any;
  buyingInvoiceNumber: number;
  setBuyingItemsData: Dispatch<SetStateAction<any>>;
}

const PurchaseInvoiceSecondPage: React.FC<purchaseInvoicesSecondPage_TP> = (
  props
) => {
  const {
    setStage,
    buyingItemsData,
    setBuyingItemsData,
    buyingInvoiceNumber,
    goldPrice,
  } = props;
  const { formatGram, formatReyal } = numberContext();
  const { userData } = useContext(authCtx);
  const navigate = useNavigate();
  const { values } = useFormikContext();
  console.log("🚀 ~ values:", values);

  const { invoice_logo } = GlobalDataContext();
  const invoiceRefs = useRef([]);

  const { data } = useFetch<any>({
    endpoint: `/supplier/api/v1/supplier/${values?.supplier_id}`,
    queryKey: [`clients`],
  });

  const invoiceHeaderBasicData = {
    first_title: "bill date",
    first_value: formatDate(values?.reserve_buying_date),
    second_title: "supplier name",
    second_value: values?.supplier_name,
    third_title: "mobile number",
    third_value: data?.phone,
    bond_date: formatDate(values?.reserve_buying_date),
    bond_title: "bill no",
    invoice_number: Number(buyingInvoiceNumber) - 1,
    invoice_logo: invoice_logo?.InvoiceCompanyLogo,
    invoice_text: "simplified tax invoice",
  };

  // FORMULA TO CALC THE TOTAL COST OF BUYING INVOICE
  const totalNetWeight = buyingItemsData.reduce((acc: number, curr: any) => {
    return Number(acc) + (Number(curr?.weight) * Number(curr?.karat_name)) / 24;
  }, 0);

  const totalCost = buyingItemsData.reduce((acc: number, curr: any) => {
    acc += +curr.value;
    return acc;
  }, 0);

  const totalValueAddedTax = buyingItemsData.reduce(
    (acc: number, curr: any) => {
      acc += +curr.value_added_tax;
      return acc;
    },
    0
  );

  const totalValueAfterTax = buyingItemsData.reduce(
    (acc: number, curr: any) => {
      acc += +curr.total_value;
      return acc;
    },
    0
  );

  const costDataAsProps = {
    totalCost,
    totalValueAddedTax,
    totalValueAfterTax,
  };

  const Cols = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: () => <span>{t("weight")}</span>,
        accessorKey: "weight",
        cell: (info) => info.getValue() || `${t("no items")}`,
      },
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("price per gram")} </span>,
        accessorKey: "piece_per_gram",
        cell: (info) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("value")} </span>,
        accessorKey: "value",
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("value added tax")} </span>,
        accessorKey: "value_added_tax",
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      },
      {
        header: () => <span>{t("total value")} </span>,
        accessorKey: "total_value",
        cell: (info) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
      },
    ],
    []
  );

  const ReserveTable = () => (
    <ReserveSecondPageTable
      data={buyingItemsData}
      columns={Cols}
      costDataAsProps={costDataAsProps}
    ></ReserveSecondPageTable>
  );

  // api
  const { mutate, isLoading } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success", t("bond created successfully"));
      navigate(`/viewPurchaseBonds`);
    },
  });

  const posBuyingDataHandler = () => {
    const invoice = {
      invoice_number: buyingInvoiceNumber,
      supplier_id: values!.supplier_id,
      invoice_date: values!.reserve_buying_date,
      branch_id: userData?.branch_id,
      notes: values!.notes,
      weight: totalNetWeight,
      tax: totalValueAddedTax,
      total: totalCost,
      total_after_tax: totalValueAfterTax,
    };

    const items = buyingItemsData.map((item: any) => {
      return {
        karat_id: item.karat_id,
        weight: item.weight,
        cost: item.value,
        tax: item.value_added_tax,
        cost_after_tax: item.total_value,
      };
    });

    console.log({ invoice, items });

    mutate({
      endpointName: "/reserveGold/api/v1/reserve_buying_Invoice",
      values: { invoice, items },
    });
  };

  const handlePrint = useReactToPrint({
    content: () => invoiceRefs.current,
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
    pageStyle: `
        @page {
          size: A5 landscape;;
          margin: 15px !important;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            zoom: 0.5;
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
            padding: 10px;
            box-sizing: border-box;
          }
        }
      `,
  });

  return (
    <div>
      <div className="flex items-center justify-between mt-8">
        <h2 className="text-base font-bold">{t("final preview")}</h2>
        <div className="flex gap-3">
          <Button
            className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen"
            action={handlePrint}
          >
            {t("print")}
          </Button>
          <Button
            className="bg-mainOrange px-7 py-[6px]"
            loading={isLoading}
            action={posBuyingDataHandler}
          >
            {t("save")}
          </Button>
        </div>
      </div>
      <ReserveSecondPageFinalPreview
        ItemsTableContent={<ReserveTable />}
        setStage={setStage}
        buyingItemsData={buyingItemsData}
        costDataAsProps={costDataAsProps}
        invoiceNumber={buyingInvoiceNumber}
        invoiceHeaderBasicData={invoiceHeaderBasicData}
      />
    </div>
  );
};

export default PurchaseInvoiceSecondPage;
