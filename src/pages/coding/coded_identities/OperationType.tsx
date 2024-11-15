import { t } from "i18next";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../../components/atoms";
import { Back } from "../../../utils/utils-components/Back";
import { Modal } from "../../../components/molecules";
import TransformToBranch from "./TransformToBranch";
import MergeHwya from "./MergeHwya";
import SeperateHwya from "./SeperateHwya";
import { notify } from "../../../utils/toast";
import TransformImport from "./TransformImport";
import { useReactToPrint } from "react-to-print";
import { useFetch, useIsRTL } from "../../../hooks";
import { ClientData_TP } from "../../selling/PaymentSellingPage";
import FinalPreviewBillData from "../../../components/selling/selling components/bill/FinalPreviewBillData";
import InvoiceTable from "../../../components/selling/selling components/InvoiceTable";
import { numberContext } from "../../../context/settings/number-formatter";
import { authCtx } from "../../../context/auth-and-perm/auth";
import FinalPreviewBillDataCodedIdentities from "./FinalPreviewBillDataCodedIdentities";
import InvoiceTableCodedPrint from "./InvoiceTableCodedPrint";
import { formatDate, formatDateAndTime } from "../../../utils/date";
import { convertNumToArWord } from "../../../utils/number to arabic words/convertNumToArWord";
import DynamicTransformToBranch from "./DynamicTransformToBranch";
import InvoiceFooter from "../../../components/Invoice/InvoiceFooter";
import WastedItemsInEdara from "./WastedItemsInEdara";

const options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

const OperationType = ({
  operationTypeSelect,
  setOperationTypeSelect,
  refetch,
  setIsSuccessPost,
  setPage,
}) => {
  const [transformToBranchDynamicModal, setOpenTransformToBranchDynamicModal] =
    useState(false);
  const [transformToBranchModal, setOpenTransformToBranchModal] =
    useState(false);
  const [mergeModal, setOpenMergeModal] = useState(false);
  const [seperateModal, setOpenSeperateModal] = useState(false);
  const [transformImportModal, setTransformImportModal] = useState(false);
  const [transformPrintBondsModal, setTransformPrintBondsModal] =
    useState(false);
  const [formData, setFormData] = useState({});
  const [bondDataPrint, setBondDataPrint] = useState(null);
  const [WastedItemsInEdaraModel, setWastedItemsInEdaraModel] = useState(false);

  // ==================================================================
  const contentRef = useRef();
  const isRTL = useIsRTL();
  const { formatGram, formatReyal } = numberContext();
  const { userData } = useContext(authCtx);
  const date = new Date(bondDataPrint?.created_at);

  const clientData = {
    client_id: operationTypeSelect?.client_id,
    client_value: operationTypeSelect?.client_name,
    bond_date: date.toLocaleDateString("en-US", options),
    supplier_id: operationTypeSelect?.supplier_id,
  };

  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "hwya",
        header: () => <span>{t("hwya")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "category",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "classification_name",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      // {
      //   cell: (info: any) => formatReyal(info.getValue()) || "-",
      //   accessorKey: "wage",
      //   header: () => <span>{t("wage geram/ryal")}</span>,
      // },
      {
        cell: (info: any) => {
          const wages =
            Number(info.row.original.wage).toFixed(2) *
            Number(info.row.original.weight);
          return formatReyal(wages) || "-";
        },
        accessorKey: "total_wages",
        header: () => <span>{t("total wage by ryal")}</span>,
      },
      {
        cell: (info: any) => formatReyal(info.getValue()) || "-",
        accessorKey: "selling_price",
        header: () => <span>{t("value")}</span>,
      },
      // {
      //   cell: (info: any) => {
      //     // return info.getValue()[0]?.diamondWeight || "-";
      //     const stonesDetails = info.getValue().reduce((acc, curr) => {
      //       return acc + curr.diamondWeight;
      //     }, 0);

      //     return stonesDetails;
      //   },
      //   accessorKey: "stonesDetails",
      //   header: () => <span>{t("weight of diamond stone")}</span>,
      // },
      // {
      //   cell: (info: any) => {
      //     // const stonesDetails = info.getValue().reduce((acc, curr) => {
      //     //   return acc + curr.weight;
      //     // }, 0);

      //     return info.getValue();
      //   },
      //   accessorKey: "ahgar_weight",
      //   header: () => <span>{t("stone weight")}</span>,
      // },
      // {
      //   cell: (info: any) => {
      //     setRowWage(info.row.original.wage);

      //     if (info.row.original.check_input_weight === 1) {
      //       return (
      //         <>
      //           <input
      //             type="number"
      //             className="w-20 rounded-md h-10"
      //             min="1"
      //             max={info.row.original.weight}
      //             name="weight_input"
      //             id="weight_input"
      //             onBlur={(e) => {
      //               setInputWeight((prev) => {
      //                 // Check if the object with the same id exists in the array
      //                 const existingItemIndex = prev.findIndex(
      //                   (item) => item.id === info.row.original.id
      //                 );

      //                 if (existingItemIndex !== -1) {
      //                   // If the object exists, update its value
      //                   return prev.map((item, index) =>
      //                     index === existingItemIndex
      //                       ? { ...item, value: e.target.value }
      //                       : item
      //                   );
      //                 } else {
      //                   // If the object doesn't exist, add a new one
      //                   return [
      //                     ...prev,
      //                     { value: e.target.value, id: info.row.original.id },
      //                   ];
      //                 }
      //               });
      //             }}
      //           />
      //         </>
      //       );
      //     } else {
      //       return info.getValue();
      //     }
      //   },
      //   accessorKey: "employee_name",
      //   header: () => <span>{t("weight conversion")}</span>,
      // },
    ],
    []
  );

  const totalWage = operationTypeSelect?.reduce((acc, curr) => {
    acc += +curr.selling_price;
    return acc;
  }, 0);

  const totalFinalWage = operationTypeSelect?.reduce((acc, curr) => {
    acc += +curr.weight;
    return acc;
  }, 0);

  const totalOtherStoneWeight = operationTypeSelect?.reduce((acc, curr) => {
    acc += +curr.wage;
    return acc;
  }, 0);

  const costDataAsProps = {
    totalFinalWage: totalFinalWage,
    totalFinalCost: totalOtherStoneWeight || 0,
    totalCost: totalWage,
  };

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    onAfterPrint: () => console.log("Print job completed."),
  });
  // ==================================================================

  useEffect(() => {
    if (!transformPrintBondsModal) {
      setOperationTypeSelect([]);
    }
  }, [transformPrintBondsModal]);

  return (
    <>
      <div className="py-12 flex flex-col gap-8">
        <h2 className="text-xl font-bold text-slate-700">
          {t("choose operation type")}
        </h2>

        {/* BUTTONS */}
        <div className="flex justify-center items-center gap-4">
          <Button
            action={() => {
              setOpenTransformToBranchDynamicModal(true);
            }}
            className="border-2 border-mainGreen bg-mainGreen text-white flex items-center gap-2"
          >
            <span>{t("dynamic transfer to branch")}</span>
          </Button>
          <Button
            action={() => {
              if (!operationTypeSelect.length) {
                //me-qr.com/TFqUUy5b

                https: notify("info", `${t("You must choose a piece first")}`);
                return;
              }
              setOpenTransformToBranchModal(true);
            }}
            className="border-2 border-mainGreen bg-mainGreen text-white flex items-center gap-2"
          >
            <span>{t("transfer to branch")}</span>
          </Button>
          <Button
            action={() => {
              if (operationTypeSelect.length < 2) {
                notify("info", `${t("You must choose at least two pieces")}`);
                return;
              }
              setOpenMergeModal(true);
            }}
            className="border-2 border-mainGreen bg-transparent text-mainGreen flex items-center gap-2"
          >
            <span>{t("merging identities")}</span>
          </Button>
          <Button
            action={() => {
              if (operationTypeSelect.length > 1) {
                notify(
                  "info",
                  `${t("You can only select one identity to separate")}`
                );
                return;
              }

              if (!operationTypeSelect[0]?.category_items) {
                notify("info", `${t("must select taqm")}`);
                return;
              }

              setOpenSeperateModal(true);
            }}
            className="border-2 border-mainGreen bg-transparent text-mainGreen  flex items-center gap-2"
          >
            <span>{t("separating identities")}</span>
          </Button>

          <Button
            action={() => {
              setTransformImportModal(true);
            }}
            className="border-2 border-mainGreen bg-white text-mainGreen flex items-center gap-2"
          >
            <span>{t("transfer import")}</span>
          </Button>

          <Button
            action={() => {
              setWastedItemsInEdaraModel(true);
            }}
            className="border-2 border-mainGreen bg-white text-mainGreen flex items-center gap-2"
          >
            <span>{t("waste of parts")}</span>
          </Button>
        </div>

        {/* MODAL */}
        <Modal
          isOpen={transformToBranchModal}
          onClose={() => setOpenTransformToBranchModal(false)}
        >
          <TransformToBranch
            refetch={refetch}
            setPage={setPage}
            setBondDataPrint={setBondDataPrint}
            setOperationTypeSelect={setOperationTypeSelect}
            setOpenSeperateModal={setOpenSeperateModal}
            setIsSuccessPost={setIsSuccessPost}
            operationTypeSelect={operationTypeSelect}
            setOpenTransformToBranchModal={setOpenTransformToBranchModal}
            setTransformPrintBondsModal={setTransformPrintBondsModal}
          />
        </Modal>
        <Modal
          isOpen={transformToBranchDynamicModal}
          onClose={() => setOpenTransformToBranchDynamicModal(false)}
        >
          <DynamicTransformToBranch
            refetch={refetch}
            setPage={setPage}
            setBondDataPrint={setBondDataPrint}
            setOperationTypeSelect={setOperationTypeSelect}
            setOpenSeperateModal={setOpenSeperateModal}
            setIsSuccessPost={setIsSuccessPost}
            operationTypeSelect={operationTypeSelect}
            transformToBranchDynamicModal={transformToBranchDynamicModal}
            setOpenTransformToBranchDynamicModal={
              setOpenTransformToBranchDynamicModal
            }
            setTransformPrintBondsModal={setTransformPrintBondsModal}
          />
        </Modal>
        <Modal isOpen={mergeModal} onClose={() => setOpenMergeModal(false)}>
          <MergeHwya
            refetch={refetch}
            setPage={setPage}
            setOperationTypeSelect={setOperationTypeSelect}
            setOpenSeperateModal={setOpenSeperateModal}
            mergeModal={mergeModal}
            setIsSuccessPost={setIsSuccessPost}
            operationTypeSelect={operationTypeSelect}
            setOpenTransformToBranchModal={setOpenTransformToBranchModal}
          />
        </Modal>
        <Modal
          isOpen={seperateModal}
          onClose={() => setOpenSeperateModal(false)}
        >
          <SeperateHwya
            setFormData={setFormData}
            formData={formData}
            refetch={refetch}
            setPage={setPage}
            setOperationTypeSelect={setOperationTypeSelect}
            seperateModal={seperateModal}
            setOpenSeperateModal={setOpenSeperateModal}
            setIsSuccessPost={setIsSuccessPost}
            operationTypeSelect={operationTypeSelect}
            setOpenTransformToBranchModal={setOpenTransformToBranchModal}
          />
        </Modal>

        <Modal
          isOpen={transformImportModal}
          onClose={() => setTransformImportModal(false)}
        >
          <TransformImport
            setIsSuccessPost={setIsSuccessPost}
            transformImportModal={transformImportModal}
            setTransformImportModal={setTransformImportModal}
          />
        </Modal>

        <Modal
          // isOpen={transformPrintBondsModal}
          isOpen={false}
          onClose={() => setTransformPrintBondsModal(false)}
        >
          {/* ======================================================================================== */}
          <>
            <div className="relative h-full mt-16">
              <div className="flex justify-end mb-8 w-full">
                <Button
                  className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen"
                  action={handlePrint}
                >
                  {t("print")}
                </Button>
              </div>
              <div ref={contentRef} className={`${isRTL ? "rtl" : "ltr"}`}>
                <div className="bg-white rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow ">
                  <div className="mx-5 bill-shadow rounded-md p-6">
                    <FinalPreviewBillDataCodedIdentities
                      clientData={clientData}
                      invoiceNumber={bondDataPrint?.id}
                    />
                  </div>

                  <InvoiceTableCodedPrint
                    data={operationTypeSelect}
                    columns={tableColumn}
                    costDataAsProps={costDataAsProps}
                    isCodedIdentitiesPrint
                  ></InvoiceTableCodedPrint>

                  <div className="mx-5 bill-shadow rounded-md p-6 my-9">
                    <div className="flex justify-between items-start pb-12 pe-8">
                      <div className="text-center flex flex-col gap-4">
                        <span className="font-medium text-xs">
                          {t("recipient's signature")}
                        </span>
                        <p>------------------------------</p>
                      </div>
                      <div className="text-center flex flex-col gap-4">
                        <span className="font-medium text-xs">
                          {t("bond organizer")}
                        </span>
                        <p>{userData?.name}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <InvoiceFooter />
                  </div>
                </div>
              </div>
            </div>
          </>
          {/* ======================================================================================== */}
        </Modal>

        <Modal
          isOpen={WastedItemsInEdaraModel}
          onClose={() => setWastedItemsInEdaraModel(false)}
        >
          <WastedItemsInEdara
            // setFormData={setFormData}
            // formData={formData}
            refetch={refetch}
            setPage={setPage}
            setOperationTypeSelect={setOperationTypeSelect}
            seperateModal={WastedItemsInEdaraModel}
            setOpenSeperateModal={setWastedItemsInEdaraModel}
            setIsSuccessPost={setIsSuccessPost}
            operationTypeSelect={operationTypeSelect}
            setOpenTransformToBranchModal={setWastedItemsInEdaraModel}
          />
        </Modal>
      </div>
    </>
  );
};

export default OperationType;
