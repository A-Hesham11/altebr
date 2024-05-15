import { ColumnDef } from "@tanstack/react-table";
import { t } from "i18next";
import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useMutate } from "../../hooks";
import { mutateData } from "../../utils/mutateData";
import { Button } from "../../components/atoms";
import { SellingFinalPreview } from "../../components/selling/selling components/SellingFinalPreview";
import { numberContext } from "../../context/settings/number-formatter";
import { ClientData_TP, Selling_TP } from "../Buying/BuyingPage";
import SupplyPayoffInvoiceTable from "./SupplyPayoffInvoiceTable";

type CreateHonestSanadProps_TP = {
  setStage: React.Dispatch<React.SetStateAction<number>>;
  sellingItemsData: any;
  paymentData: any;
  clientData: ClientData_TP;
  invoiceNumber: any;
  selectedItemDetails: any;
  sellingItemsOfWeigth: any;
  supplierId: any;
  mardodItemsId: any;
};
const SupplyPayoffSecondPage = ({
  setStage,
  sellingItemsData,
  paymentData,
  clientData,
  invoiceNumber,
  supplierId,
  mardodItemsId,
}: CreateHonestSanadProps_TP) => {

  const { formatGram, formatReyal } = numberContext();

  const { userData } = useContext(authCtx);

  const operationTypeSelectWeight = sellingItemsData?.filter(
    (el: any) => el.check_input_weight !== 0
  );

  const totalWeight = sellingItemsData.reduce((acc, card) => {
    acc += +card.weight;
    return acc;
  }, 0);

  const totalCost = sellingItemsData.reduce((acc, card) => {
    acc += +card.cost;
    return acc;
  }, 0);

  const totalItemsTaxes = sellingItemsData.reduce((acc, card) => {
    acc += +card.vat;
    return acc;
  }, 0);

  const totalFinalCost = Number(totalCost) + Number(totalItemsTaxes);

  const costDataAsProps = {
    totalWeight,
    totalCost,
    totalItemsTaxes,
    totalFinalCost,
  };

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
        accessorKey: "category",
        cell: (info) => {
          const finalCategoriesNames = info.row.original.itemDetails
            ?.map((category) => category.category_name)
            .join("-");
          return info?.row?.original?.itemDetails?.length
            ? info?.row?.original?.has_selsal === 0
              ? finalCategoriesNames
              : `${finalCategoriesNames} مع سلسال`
            : info?.row?.original?.selsal?.length === 0
            ? info.getValue()
            : `${info.getValue()} مع سلسال`;
        },
      },
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_name",
        cell: (info: any) =>
          info.row.original.classification_id === 1
            ? formatReyal(Number(info.getValue()))
            : formatGram(Number(info.row.original.karatmineral_name)),
      },
      {
        header: () => <span>{t("weight")}</span>,
        accessorKey: "weight",
        cell: (info) => formatReyal(Number(info.getValue())),
      },
      {
        header: () => <span>{t("VAT")} </span>,
        accessorKey: "vat",
        cell: (info) => formatReyal(Number(info.getValue())),
      },
      {
        header: () => <span>{t("cost")} </span>,
        accessorKey: "cost",
        cell: (info) => formatReyal(Number(info.getValue())),
      },
    ],
    []
  );

  const SellingTableComp = () => (
    <SupplyPayoffInvoiceTable
      data={sellingItemsData}
      columns={Cols}
      paymentData={paymentData}
      costDataAsProps={costDataAsProps}
    ></SupplyPayoffInvoiceTable>
  );

  //
  const navigate = useNavigate();
  // user data
  // api
  const { mutate, isLoading } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      navigate(`/bonds/supply-return`);
    },
  });

  function PostNewValue() {
    mutate({
      endpointName: "/supplyReturn/api/v1/add_supply_return",
      values: {
        supplier_id: supplierId,
        invoice_number: invoiceNumber.total + 1,
        thwilItems: mardodItemsId,
        vat: userData?.tax_rate,
        employee_id: userData?.id,
        invoice_date: sellingItemsData[0]?.bond_date,
        editWeight: operationTypeSelectWeight.map((el, i) => {
          return {
            id: el.id.toString(),
            weight: el.weight,
            hwya: el.hwya,
            type: "all",
            wage: el.wage,
            category: el.category,
            classification: el.classification_name,
            totalWage: Number(el.wage) * Number(el.weight),
            karat: el.karat_name,
            selling_price: el.selling_price,
          };
        }),
      },
      method: "post",
      dataType: "formData",
    });
  }

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
            action={PostNewValue}
          >
            {t("save")}
          </Button>
        </div>
      </div>

      <SellingFinalPreview
        ItemsTableContent={<SellingTableComp />}
        setStage={setStage}
        paymentData={paymentData}
        clientData={clientData}
        sellingItemsData={sellingItemsData}
        costDataAsProps={costDataAsProps}
        invoiceNumber={invoiceNumber}
      />
    </div>
  );
};

export default SupplyPayoffSecondPage;