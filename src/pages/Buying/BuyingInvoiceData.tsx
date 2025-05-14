import { ColumnDef } from "@tanstack/react-table";
import { t } from "i18next";
import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ClientData_TP, Selling_TP } from "./PaymentSellingPage";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useFetch, useMutate } from "../../hooks";
import { mutateData } from "../../utils/mutateData";
import { Button } from "../../components/atoms";
import { numberContext } from "../../context/settings/number-formatter";
import BuyingInvoiceTable from "./BuyingInvoiceTable";
import { BuyingFinalPreview } from "./BuyingFinalPreview";
import InvoiceTableData from "../../components/selling/selling components/InvoiceTableData";
import { convertNumToArWord } from "../../utils/number to arabic words/convertNumToArWord";

type CreateHonestSanadProps_TP = {
  setStage: React.Dispatch<React.SetStateAction<number>>;
  sellingItemsData: never[];
  paymentData: never[];
  clientData: ClientData_TP;
  invoiceNumber: any;
  selectedItemDetails: any;
};
const BuyingInvoiceData = ({
  setStage,
  sellingItemsData,
  paymentData,
  clientData,
  invoiceNumber,
  selectedItemDetails,
  odwyaTypeValue,
  setOdwyaTypeValue,
}: CreateHonestSanadProps_TP) => {
  console.log(
    "🚀 ~ file: BuyingInvoiceData.tsx:32 ~ sellingItemsData:",
    sellingItemsData
  );
  const { formatGram, formatReyal } = numberContext();
  const { userData } = useContext(authCtx);
  const navigate = useNavigate();

  // FORMULA TO CALC THE TOTAL COST OF BUYING INVOICE
  const totalCost = sellingItemsData.reduce((acc: number, curr: any) => {
    acc += +curr.value;
    return acc;
  }, 0);

  const totalValueAddedTax = sellingItemsData.reduce(
    (acc: number, curr: any) => {
      acc += +curr.value_added_tax;
      return acc;
    },
    0
  );

  const totalValueAfterTax = sellingItemsData.reduce(
    (acc: number, curr: any) => {
      acc += +curr.total_value;
      return acc;
    },
    0
  );

  const totalGold18 =
    sellingItemsData?.reduce((acc, curr) => {
      return curr.karat_name == "18" ? acc + Number(curr.weight || 0) : acc;
    }, 0) || 0;
  const totalGold21 =
    sellingItemsData?.reduce((acc, curr) => {
      return curr.karat_name == "21" ? acc + Number(curr.weight || 0) : acc;
    }, 0) || 0;
  const totalGold22 =
    sellingItemsData?.reduce((acc, curr) => {
      return curr.karat_name == "22" ? acc + Number(curr.weight || 0) : acc;
    }, 0) || 0;
  const totalGold24 =
    sellingItemsData?.reduce((acc, curr) => {
      return curr.karat_name == "24" ? acc + Number(curr.weight || 0) : acc;
    }, 0) || 0;

  const totalWeight18To24 = (totalGold18 * 18) / 24;
  const totalWeight21To24 = (totalGold21 * 21) / 24;
  const totalWeight22To24 = (totalGold22 * 22) / 24;

  const totalKaratWeight = [
    { title: "karat 18", weight: totalGold18 },
    { title: "karat 21", weight: totalGold21 },
    { title: "karat 22", weight: totalGold22 },
    { title: "karat 24", weight: totalGold24 },
  ];

  const totalFinalCostIntoArabic = convertNumToArWord(Math.round(totalCost));

  const totalFinalWeightIntoArabic = convertNumToArWord(
    Math.round(
      Number(
        totalWeight18To24 + totalWeight21To24 + totalWeight22To24 + totalGold24
      )
    )
  );

  const costDataAsProps = {
    totalCost,
    totalValueAddedTax,
    totalValueAfterTax,
    finalArabicData: [
      {
        title: t("total"),
        totalFinalCostIntoArabic: totalFinalCostIntoArabic,
        type: t("reyal"),
      },
      {
        title: t("total weight converted to 24"),
        totalFinalCostIntoArabic: totalFinalWeightIntoArabic,
        type: t("gram"),
      },
    ],
    resultTable: [
      {
        number: t("totals"),
        cost: formatReyal(totalCost),
      },
    ],
    totalKaratWeight: totalKaratWeight,
  };

  const Cols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("classification")}</span>,
        accessorKey: "category_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("stones")} </span>,
        accessorKey: "stones_name",
        cell: (info) => info.getValue() || "---",
      },
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
    ],
    []
  );

  if (odwyaTypeValue === "supplier") {
    Cols.push(
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
      }
    );
  }

  const BuyingTableComp = () => (
    <InvoiceTableData
      data={sellingItemsData}
      columns={Cols}
      paymentData={paymentData}
      costDataAsProps={costDataAsProps}
      // odwyaTypeValue={odwyaTypeValue}
      // setOdwyaTypeValue={setOdwyaTypeValue}
    ></InvoiceTableData>
  );

  // api
  const { mutate, isLoading } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      // navigate(`/selling/honesty/return-honest/${data.bond_id}`)
      navigate(`/buying/purchaseBonds`);
    },
  });

  const posSellingDataHandler = () => {
    let invoice;

    if (odwyaTypeValue === "supplier") {
      invoice = {
        employee_id: userData?.id,
        branch_id: userData?.branch_id,
        supplier_id: clientData.client_id,
        client_id: "",
        invoice_date: clientData.bond_date,
        invoice_number: invoiceNumber.length + 1,
        count: sellingItemsData.length,
      };
    } else {
      invoice = {
        employee_id: userData?.id,
        branch_id: userData?.branch_id,
        client_id: clientData.client_id,
        supplier_id: "",
        invoice_date: clientData.bond_date,
        invoice_number: invoiceNumber.length + 1,
        count: sellingItemsData.length,
      };
    }

    const items = sellingItemsData.map((item) => {
      if (odwyaTypeValue === "supplier") {
        return {
          category_id: item.category_id,
          karat_id: item.karat_id,
          branch_id: userData?.branch_id,
          gram_price: item.piece_per_gram,
          // edited: "0",
          value_added_tax: item.value_added_tax,
          total_value: item.total_value,
          weight: item.weight,
          value: item.value,
          has_stones: `${item.stones_id}`,
        };
      } else {
        return {
          category_id: item.category_id,
          karat_id: item.karat_id,
          branch_id: userData?.branch_id,
          gram_price: item.piece_per_gram,
          // edited: "0",
          // value_added_tax: item.value_added_tax,
          // total_value: item.total_value,
          weight: item.weight,
          value: item.value,
          has_stones: `${item.stones_id}`,
        };
      }
    });

    console.log({ invoice, items });

    mutate({
      endpointName: "/buyingUsedGold/api/v1/add_buying_Invoice",
      values: { invoice, items },
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mx-8 mt-8">
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
            loading={isLoading}
            action={posSellingDataHandler}
          >
            {t("save")}
          </Button>
        </div>
      </div>
      <BuyingFinalPreview
        ItemsTableContent={<BuyingTableComp />}
        setStage={setStage}
        paymentData={paymentData}
        clientData={clientData}
        sellingItemsData={sellingItemsData}
        costDataAsProps={costDataAsProps}
        invoiceNumber={invoiceNumber}
        odwyaTypeValue={odwyaTypeValue}
        setOdwyaTypeValue={setOdwyaTypeValue}
      />
    </div>
  );
};

export default BuyingInvoiceData;
