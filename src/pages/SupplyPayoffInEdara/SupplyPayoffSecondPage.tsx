import { ColumnDef } from "@tanstack/react-table";
import { t } from "i18next";
import { useContext, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useIsRTL, useMutate } from "../../hooks";
import { mutateData } from "../../utils/mutateData";
import { Button } from "../../components/atoms";
import { numberContext } from "../../context/settings/number-formatter";
import { ClientData_TP, Selling_TP } from "../Buying/BuyingPage";
import SupplyPayoffInvoiceTable from "./SupplyPayoffInvoiceTable";
import { SupplyPayoffFinalPreview } from "./SupplyPayoffFinalPreview";
import { notify } from "../../utils/toast";
import { useReactToPrint } from "react-to-print";
import { useFormikContext } from "formik";

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
  const { values } = useFormikContext();
  console.log("🚀 ~ values:", values);

  const { userData } = useContext(authCtx);

  const contentRef = useRef();
  const isRTL = useIsRTL();

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

  const totalwages = sellingItemsData.reduce((acc, card) => {
    acc += +card.wage * +card.weight;
    return acc;
  }, 0);

  const totalFinalCost =
    Number(totalCost) + Number(totalItemsTaxes) + Number(totalwages);

  const costDataAsProps = {
    totalWeight,
    totalCost,
    totalItemsTaxes,
    totalFinalCost,
    totalwages,
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
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("karat value")} </span>,
        accessorKey: "karat_name",
        cell: (info: any) => formatReyal(Number(info.getValue())),
      },
      {
        header: () => <span>{t("weight")}</span>,
        accessorKey: "weight",
        cell: (info) => formatReyal(Number(info.getValue())),
      },
      {
        header: () => <span>{t("fare")}</span>,
        accessorKey: "wage",
        cell: (info) =>
          info.row.original.wage
            ? formatReyal(
                Number(info.getValue()) * Number(info.row.original.weight)
              )
            : "---",
      },
      {
        header: () => <span>{t("VAT")} </span>,
        accessorKey: "vat",
        cell: (info) => formatReyal(Number(info.getValue())),
      },
      {
        header: () => <span>{t("cost")} </span>,
        accessorKey: "cost",
        cell: (info) =>
          info.row.original.classification_id === 1
            ? formatReyal(Number(info.row.original.cost))
            : formatReyal(
                Number(info.row.original.cost_item) *
                  Number(info.row.original.conversion_factor)
              ),
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
  const { mutate, isLoading, isSuccess } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success");
      // navigate(`/bonds/supply-return`);
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
        media: values?.media,
        items: sellingItemsData?.map((item) => ({
          id: item?.id,
          hwya: item.hwya,
          vat: item?.vat,
          cost: item?.cost,
        })),
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
      <div className="flex items-center justify-between mx-3 mt-2">
        <h2 className="text-base font-bold">{t("final preview")}</h2>
        <div className="flex gap-3">
          {isSuccess ? (
            <Button
              className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen"
              action={handlePrint}
            >
              {t("print")}
            </Button>
          ) : (
            <Button
              className="bg-mainOrange px-7 py-[6px]"
              loading={isLoading}
              action={PostNewValue}
            >
              {t("save")}
            </Button>
          )}
        </div>
      </div>

      <div ref={contentRef} className={`${isRTL ? "rtl" : "ltr"}`}>
        <SupplyPayoffFinalPreview
          ItemsTableContent={<SellingTableComp />}
          setStage={setStage}
          paymentData={paymentData}
          clientData={clientData}
          sellingItemsData={sellingItemsData}
          costDataAsProps={costDataAsProps}
          invoiceNumber={invoiceNumber}
          isSuccess={isSuccess}
        />
      </div>
    </div>
  );
};

export default SupplyPayoffSecondPage;
