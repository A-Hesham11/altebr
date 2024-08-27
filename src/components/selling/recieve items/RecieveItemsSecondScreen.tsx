import { t } from "i18next";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RiArrowGoBackFill, RiErrorWarningFill } from "react-icons/ri";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import { RecivedItemTP } from "../../../utils/selling";
import { notify } from "../../../utils/toast";
import { Button } from "../../atoms";
import { BoxesDataBase } from "../../atoms/card/BoxesDataBase";
import { ViewIcon } from "../../atoms/icons";
import { Modal } from "../../molecules";
import { Table } from "../../templates/reusableComponants/tantable/Table";
import { ItemDetailsTable } from "./ItemDetailsTable";
import {
  MdLocalOffer,
  MdOutlineCancel,
  MdOutlineLocalOffer,
} from "react-icons/md";
import { AcceptedItemsAccountingEntry } from "./AcceptedItemsAccountingEntry";
import { Link, useNavigate } from "react-router-dom";
import { FilesUpload } from "../../molecules/files/FileUpload";
import { numberContext } from "../../../context/settings/number-formatter";
import FinalPreviewBillData from "../selling components/bill/FinalPreviewBillData";
import InvoiceTable from "../selling components/InvoiceTable";
import FinalPreviewBillPayment from "../selling components/bill/FinalPreviewBillPayment";
import { useReactToPrint } from "react-to-print";
import { ColumnDef } from "@tanstack/react-table";
import { Selling_TP } from "../../../pages/selling/PaymentSellingPage";
import { ClientData_TP } from "../SellingClientForm";
import FinalPreviewBillDataCodedIdentities from "../../../pages/coding/coded_identities/FinalPreviewBillDataCodedIdentities";
import InvoiceTableCodedPrint from "../../../pages/coding/coded_identities/InvoiceTableCodedPrint";

type RecieveItemsSecondScreenProps_TP = {
  setStage: Dispatch<SetStateAction<number>>;
  selectedItem: RecivedItemTP;
  setSanadId?: Dispatch<SetStateAction<number>>;
  openModal?: boolean;
};
const RecieveItemsSecondScreen = ({
  setStage,
  selectedItem,
  setSanadId,
  openModal,
}: RecieveItemsSecondScreenProps_TP) => {
  console.log("🚀 ~ selectedItem:", selectedItem);
  const isSanadOpened = selectedItem.bond_status !== 0;
  const { userData } = useContext(authCtx);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [dataSource, setDataSource] = useState({});
  const [selectedRowDetailsId, setSelectedRowDetailsId] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [openAcceptModal, setOpenAcceptModal] = useState<boolean>(false);
  const [openRefusedModal, setOpenRefusedModal] = useState<boolean>(false);
  const [isItRefusedAllBtn, setIsItRefusedAllBtn] = useState<boolean>(false);
  const [
    disableSelectedCheckAfterSendById,
    setDisableSelectedCheckAfterSendById,
  ] = useState([]);
  const [files, setFiles] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");
  const { formatGram, formatReyal } = numberContext();

  const navigate = useNavigate();
  // side effects
  useEffect(() => {
    setSanadId && setSanadId(selectedItem.id);
  }, [selectedItem]);

  const {
    isLoading: receivedLoading,
    mutate: mutateReceived,
    isSuccess: receivedSuccess,
  } = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      const uniqueSelectedItems = Array.from(
        new Set(selectedRows.map((obj) => obj.id))
      ).map((id) => {
        return selectedRows.find((obj) => obj.id === id);
      });
      const filteredArray = selectedItem.items.filter(
        (item) =>
          !disableSelectedCheckAfterSendById.includes(item.id) &&
          item.item_status === "Waiting"
      );
      setOpenAcceptModal(false);
      notify("success");
      setOpenRefusedModal(false);
      if (!isSanadOpened) setStage(3);
      if (
        isSanadOpened &&
        filteredArray.length === uniqueSelectedItems.length
      ) {
        notify("info", `${t("all bond items has been received")}`);
        setStage(1);
      }
      const selectedRowsIds = structuredClone(selectedRows).map(
        (item) => item.id
      );
      setDisableSelectedCheckAfterSendById((prev) => [
        ...prev,
        ...selectedRowsIds,
      ]);
      setSelectedRows([]);
    },
  });
  const { mutate: mutateReject, isLoading: rejectLoading } = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      const uniqueSelectedItems = Array.from(
        new Set(selectedRows.map((obj) => obj.id))
      ).map((id) => {
        return selectedRows.find((obj) => obj.id === id);
      });
      const filteredArray = selectedItem.items.filter(
        (item) =>
          !disableSelectedCheckAfterSendById.includes(item.id) &&
          item.item_status === "Waiting"
      );
      setOpenRefusedModal(false);
      notify("success");
      if (!isSanadOpened) setStage(1);
      if (
        isSanadOpened &&
        filteredArray.length === uniqueSelectedItems.length
      ) {
        notify("info", `${t("all bond items has been reject")}`);
        setStage(1);
      }
      const selectedRowsIds = structuredClone(selectedRows).map(
        (item) => item.id
      );
      setDisableSelectedCheckAfterSendById((prev) => [
        ...prev,
        ...selectedRowsIds,
      ]);
      setSelectedRows([]);
    },
  });

  const handleCheckboxChange = (event: any, selectedRow: any) => {
    const checkboxId = event.target.id;
    if (event.target.checked) {
      setSelectedRows((prevSelectedItems: any) => [
        ...prevSelectedItems,
        selectedRow.row.original,
      ]);
    } else {
      setSelectedRows((prevSelectedItems: any) =>
        prevSelectedItems.filter((item: any) => item.id !== +checkboxId)
      );
    }
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
        accessorKey: "classification",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "karat",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => formatReyal(info.getValue()) || "-",
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
      {
        cell: (info: any) => {
          // return info.getValue()[0]?.diamondWeight || "-";
          // const stonesDetails = info.getValue().reduce((acc, curr) => {
          //   return acc + curr.diamondWeight;
          // }, 0);

          return info.getValue();
        },
        accessorKey: "diamond_weight",
        header: () => <span>{t("weight of diamond stone")}</span>,
      },
      {
        cell: (info: any) => {
          // const stonesDetails = info.getValue().reduce((acc, curr) => {
          //   return acc + curr.weight;
          // }, 0);

          return info.getValue();
        },
        accessorKey: "stones_weight",
        header: () => <span>{t("stone weight")}</span>,
      },
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

  useEffect(() => {
    !openModal
      ? setDataSource(
          selectedItem?.items?.filter((item) => item.item_status === "Waiting")
        )
      : setDataSource(selectedItem.items);
  }, [disableSelectedCheckAfterSendById, selectedRows]);

  // variables
  // TOTALS

  const total24 = selectedItem.items
    ?.filter((piece) => piece.karat === "24")
    ?.reduce((acc, { weight }) => acc + +weight, 0);
  const total22 = selectedItem.items
    ?.filter((piece) => piece.karat === "22")
    ?.reduce((acc, { weight }) => acc + +weight, 0);
  const total21 = selectedItem.items
    ?.filter((piece) => piece.karat === "21")
    ?.reduce((acc, { weight }) => acc + +weight, 0);
  const total18 = selectedItem.items
    ?.filter((piece) => piece.karat === "18")
    ?.reduce((acc, { weight }) => acc + +weight, 0);
  const allItemsCount = selectedItem?.items?.[0]?.allboxes?.allcounts;

  const totals = [
    {
      name: t("عدد القطع"),
      key: crypto.randomUUID(),
      unit: t(""),
      value: dataSource?.length,
    },
    {
      name: "إجمالي وزن 24",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total24,
    },
    {
      name: "إجمالي وزن 22",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total22,
    },
    {
      name: "إجمالي وزن 21",
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total21,
    },
    {
      name: t("إجمالي وزن 18"),
      key: crypto.randomUUID(),
      unit: t("gram"),
      value: total18,
    },
  ];

  const handleTableSearch = () => {
    const matchedHwyaRow = dataSource.filter(
      (item) => item.hwya === searchInputValue
    );
    setDataSource(matchedHwyaRow);
  };

  // ==================================================================
  const contentRef = useRef();
  const isRTL = useIsRTL();

  const clientData = {
    client_id: selectedItem?.client_id,
    client_value: selectedItem?.client_name,
    bond_date: selectedItem?.date,
    supplier_id: selectedItem?.supplier_id,
  };

  const { data } = useFetch<ClientData_TP>({
    endpoint: `/selling/api/v1/get_sentence`,
    queryKey: ["sentence"],
  });

  const { data: companyData } = useFetch<ClientData_TP>({
    endpoint: `/companySettings/api/v1/companies`,
    queryKey: ["Mineral_license"],
  });

  // const Cols = useMemo<ColumnDef<Selling_TP>[]>(
  //   () => [
  //     {
  //       header: () => <span>{t("piece number")}</span>,
  //       accessorKey: "hwya",
  //       cell: (info) => info.getValue() || "---",
  //     },
  //     {
  //       header: () => <span>{t("classification")}</span>,
  //       accessorKey: "classification_name",
  //       cell: (info) => info.getValue() || "---",
  //     },
  //     {
  //       header: () => <span>{t("category")} </span>,
  //       accessorKey: "category_name",
  //       cell: (info) => info.getValue() || "---",
  //     },
  //     {
  //       header: () => <span>{t("stone weight")} </span>,
  //       accessorKey: "stone_weight",
  //       cell: (info) => info.getValue() || "---",
  //     },
  //     {
  //       header: () => <span>{t("karat value")} </span>,
  //       accessorKey: "karat_name",
  //       cell: (info: any) =>
  //         info.row.original.classification_id === 1
  //           ? formatReyal(Number(info.getValue()))
  //           : formatGram(Number(info.row.original.karatmineral_name)),
  //     },
  //     {
  //       header: () => <span>{t("weight")}</span>,
  //       accessorKey: "weight",
  //       cell: (info) => info.getValue() || `${t("no items")}`,
  //     },
  //     {
  //       header: () => <span>{t("cost")} </span>,
  //       accessorKey: "cost",
  //       cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
  //     },
  //     {
  //       header: () => <span>{t("VAT")} </span>,
  //       accessorKey: "vat",
  //       cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
  //     },
  //     {
  //       header: () => <span>{t("total")} </span>,
  //       accessorKey: "total",
  //       cell: (info: any) => formatReyal(Number(info.getValue())) || "---",
  //     },
  //   ],
  //   []
  // );

  const totalWage = selectedItem?.items?.reduce((acc, curr) => {
    acc += +curr.selling_price;
    return acc;
  }, 0);

  const totalFinalWage = selectedItem?.items?.reduce((acc, curr) => {
    acc += +curr.weight;
    return acc;
  }, 0);

  const totalOtherStoneWeight = selectedItem?.items?.reduce((acc, curr) => {
    acc += +curr.wage_total;
    return acc;
  }, 0);

  const costDataAsProps = {
    totalFinalWage: totalFinalWage,
    totalFinalCost: formatReyal(totalOtherStoneWeight) || 0,
    totalCost: totalWage,
  };

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    onAfterPrint: () => console.log("Print job completed."),
  });
  // ==================================================================

  return (
    <>
      <div className="my-8 md:my-16 mx-4 md:mx-16">
        {!openModal && (
          <>
            <h3 className="font-bold">{t("receive items in branch")}</h3>
            <p className="text-sm font-bold mt-2 mb:4 md:mb-8">
              {t("bonds aggregations")}
            </p>
          </>
        )}
        {/* <ul className="grid grid-cols-4 gap-6 mb-5">
          {totals.map(({ name, key, unit, value }) => (
            <BoxesDataBase variant="secondary" key={key}>
              <p className="bg-mainOrange px-2 py-4 flex items-center justify-center rounded-t-xl">
                {name}
              </p>
              <p className="bg-white px-2 py-[7px] text-black rounded-b-xl">
                {formatReyal(Number(value))} {t(unit)}
              </p>
            </BoxesDataBase>
          ))}

        {!dataSource?.length && !openModal ? (
          <>
            <h2 className="font-bold text-xl mx-auto my-8 text-mainGreen bg-lightGreen p-2 rounded-lg w-fit">
              {t("bond has been closed")}
            </h2>
            <AcceptedItemsAccountingEntry
              sanadId={selectedItem.id}
              isInPopup
              setStage={setStage}
              isInReceivedComp
            />
            {!openModal && (
              <Button
                className="mr-auto flex"
                action={() => setStage((prev) => prev - 1)}
                bordered
              >
                {t("back")}
              </Button>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-end my-5">
              {!isSanadOpened && (
                <FilesUpload setFiles={setFiles} files={files} />
              )}
            </div>
            {!openModal && (
              <div className="flex justify-between m-4">
                <div>
                  <input
                    className="mb-5 shadow-lg rounded p-2"
                    value={searchInputValue}
                    onChange={(e) => setSearchInputValue(e.target.value)}
                  />
                  <Button
                    className="mx-4"
                    disabled={searchInputValue === ""}
                    bordered
                    action={handleTableSearch}
                  >
                    {t("search")}
                  </Button>
                  <Button
                    className="mx-4"
                    bordered
                    action={() => {
                      setDataSource(
                        selectedItem.items.filter(
                          (item) => item.item_status === "Waiting"
                        )
                      );
                    }}
                  >
                    {t("empty search")}
                  </Button>
                </div>
                <div className="flex flex-col mr-auto items-end justify-end">
                  <Link to="/selling/payoff/supply-payoff">
                    <Button bordered>{t("go to payoff")}</Button>
                  </Link>
                  <p className="text-end">
                    {t("selected items count")}:{selectedRows.length}
                  </p>
                </div>
              </div>
            )}

            {/* ======================================================================================== */}
        <>
          <div className="relative h-full">
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
                    invoiceNumber={selectedItem?.id}
                  />
                </div>

                <InvoiceTableCodedPrint
                  data={selectedItem?.items}
                  columns={tableColumn}
                  costDataAsProps={costDataAsProps}
                ></InvoiceTableCodedPrint>

                {/* <div className="mx-5 bill-shadow rounded-md p-6 my-9">
                      <FinalPreviewBillPayment
                        responseSellingData={selectedItem}
                      />
                    </div> */}

                <div className="text-center">
                  <p className="my-4 py-1 border-y border-mainOrange text-[15px]">
                    {data && data?.sentence}
                  </p>
                  <div className="flex justify-between items-center px-8 py-2 bg-[#E5ECEB] bill-shadow">
                    <p>
                      {" "}
                      العنوان : {companyData?.[0]?.country?.name} ,{" "}
                      {companyData?.[0]?.city?.name} ,{" "}
                      {companyData?.[0]?.district?.name}
                    </p>
                    <p>
                      {t("phone")}: {companyData?.[0]?.phone}
                    </p>
                    <p>
                      {t("email")}: {userData?.email}
                    </p>
                    <p>
                      {t("tax number")}:{" "}
                      {companyData && companyData?.[0]?.tax_number}
                    </p>
                    <p>
                      {t("Mineral license")}:{" "}
                      {companyData && companyData?.[0]?.mineralLicence}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
        {/* ======================================================================================== */}
        {/* <Table data={dataSource} columns={Cols} showNavigation></Table> */}
        <div className="flex justify-between mt-2 md:mt-8">
          {isSanadOpened && !openModal ? (
            <div className="flex gap-x-4">
              <div className="flex gap-4">
                <Button
                  className="bg-mainOrange text-white"
                  action={() => {
                    if (selectedRows.length === 0)
                      notify("info", `${t("select item at least")}`);
                    else setOpenAcceptModal(true);
                  }}
                >
                  {t("offer selling")}
                </Button>
              </div>
              <div className="flex gap-4">
                <Button
                  className="text-mainOrange border-mainOrange"
                  action={() => {
                    if (selectedRows.length === 0)
                      notify("info", `${t("select item at least")}`);
                    else setOpenRefusedModal(true);
                  }}
                  bordered
                >
                  {t("return")}
                </Button>
              </div>
            </div>
          ) : (
            !openModal && (
              <div className="flex gap-4">
                <Button
                  className="bg-mainOrange text-white"
                  action={() => {
                    files.length
                      ? setOpenAcceptModal(true)
                      : notify("info", `${t("attachments is required")}`);
                  }}
                >
                  {t("receive all bond")}
                </Button>
                <Button
                  className="border-mainOrange text-mainOrange"
                  action={() => {
                    setOpenRefusedModal(true);
                    setSelectedRows(selectedItem.items);
                    setIsItRefusedAllBtn(true);
                  }}
                  bordered
                >
                  {t("refuse all")}
                </Button>
              </div>
            )
          )}
          {!openModal && (
            <Button
              className="mr-auto"
              action={() => setStage((prev) => prev - 1)}
              bordered
            >
              {t("back")}
            </Button>
          )}
        </div>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <ItemDetailsTable
            selectedItem={selectedItem.items}
            selectedRowDetailsId={selectedRowDetailsId}
          />
        </Modal>
        <Modal
          isOpen={openAcceptModal}
          onClose={() => setOpenAcceptModal(false)}
        >
          <div className="flex flex-col items-center justify-center gap-y-4">
            <RiErrorWarningFill
              className="text-4xl scale-150 mb-5"
              fill="#EF432C"
            />
            <h3>{t("are you sure to return selected items")}</h3>
            <div className="flex gap-x-4 mt-5">
              <Button
                loading={receivedLoading}
                onClick={() => {
                  const selectedItems = selectedRows.map((item) => ({
                    hwya: item.hwya,
                    item_id: item.item_id,
                    weight: item.weight,
                    wage: item.wage,
                    front: item.front,
                    id: +selectedItem?.id,
                  }));

                  const receivedFinalValue = {
                    id: selectedItem?.id,
                    branch_id: userData?.branch_id,
                    // allItems: selectedItem.items.map(item => item.hwya),
                    allItems: selectedItem.items.map((item) => {
                      return {
                        hwya: item.hwya,
                        front: item.front,
                      };
                    }),
                    items: selectedItems,
                    entity_gold_price: selectedItem?.entity_gold_price,
                    api_gold_price: selectedItem?.api_gold_price,
                    type: selectedItem?.type,
                    // acceptAll: selectedItem.items.length === selectedRows.length ? true : false,
                    // media: files
                  };
                  isSanadOpened
                    ? mutateReceived({
                        endpointName: "branchManage/api/v1/accept-items",
                        values: receivedFinalValue,
                      })
                    : mutateReceived({
                        endpointName: "branchManage/api/v1/restriction-items",
                        values: { ...receivedFinalValue, media: files },
                        dataType: "formData",
                      });
                }}
              >
                {t("confirm")}
              </Button>
              <Button
                bordered
                onClick={() => {
                  setOpenAcceptModal(false);
                }}
              >
                {t("cancel")}
              </Button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={openRefusedModal}
          onClose={() => setOpenRefusedModal(false)}
        >
          <div className="flex flex-col items-center justify-center gap-y-4">
            <RiErrorWarningFill
              className="text-4xl scale-150 mb-5"
              fill="#EF432C"
            />
            <h3>{t("are you sure to reject items")}</h3>
            <div className="flex gap-x-4 mt-5">
              <Button
                loading={rejectLoading}
                onClick={() => {
                  const selectedItems = selectedRows.map((item) => ({
                    hwya: item.hwya,
                    item_id: item.item_id,
                    weight: item.weight,
                    wage: item.wage,
                    front: item.front,
                    id: +selectedItem?.id,
                  }));
                  const rejectFinalValue = {
                    id: selectedItem?.id,
                    branch_id: userData?.branch_id,
                    items: selectedItems,
                    entity_gold_price: selectedItem?.entity_gold_price,
                    api_gold_price: selectedItem?.api_gold_price,
                    type: selectedItem?.type,
                    allRejected:
                      selectedItem.items.length === selectedRows.length &&
                      isItRefusedAllBtn
                        ? true
                        : false,
                    ...(isItRefusedAllBtn ? { media: files } : {}),
                  };
                  setSelectedRows([]);
                  mutateReject({
                    endpointName: "branchManage/api/v1/reject-items",
                    values: rejectFinalValue,
                    dataType: "formData",
                  });
                }}
              >
                {t("reject")}
              </Button>
              <Button
                bordered
                onClick={() => {
                  setOpenRefusedModal(false);
                }}
              >
                {t("cancel")}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default RecieveItemsSecondScreen;
