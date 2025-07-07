/////////// IMPORTS
///
///
/////////// Types
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { t } from "i18next";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { Back } from "../../../utils/utils-components/Back";
import { Button } from "../../atoms";
import { Edit } from "../../atoms/icons/Edit";
import { InnerFormLayout, Modal, OuterFormLayout } from "../../molecules";
import { FilesPreviewOutFormik } from "../../molecules/files/FilesPreviewOutFormik";
import PaymentProcessing from "../selling components/data/PaymentProcessing";
import { numberContext } from "../../../context/settings/number-formatter";

///
type CreateHonestSanadProps_TP = {
  setStage: Dispatch<SetStateAction<number>>;
  selectedItem: never[];
  setSelectedItem: Dispatch<SetStateAction<never[]>>;
  paymentData: never[];
  setPaymentData: Dispatch<SetStateAction<never[]>>;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const CreateHonestSanad = ({
  setStage,
  selectedItem,
  setSelectedItem,
  paymentData,
  setPaymentData,
}: CreateHonestSanadProps_TP) => {
  /////////// VARIABLES
  ///
  const [data, setData] = useState(selectedItem.items);
  const [editCost, setEditCost] = useState(false);
  const [open, setOpen] = useState(false);
  const [openTotal, setOpenTotal] = useState(false);
  const { formatGram, formatReyal, digits_count } = numberContext();
  const { userData } = useContext(authCtx);

  const [costAfterTax, setCostAfterTax] = useState();

  const [costValue, setCostValue] = useState({
    id: null,
    value: "0",
  });

  const taxRate = userData?.tax_rate / 100;
  const [refundAmount, setRefundAmount] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);

  const navigate = useNavigate();
  const { mutate, isSuccess: isChangeStatusSuccess } = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      notify("success");
    },
  });
  const { mutate: mutateItemReturnStatus, isLoading: returnItemsIsLoading } =
    useMutate({
      mutationFn: mutateData,
      onSuccess: (data) => {
        notify("success");
        // const updatedRows = selectedItem.items.filter(itemX => !selectedRows.some(itemY => itemY.id === itemX.id))
        // setSelectedItem(prev => ({ ...prev, items: updatedRows }))
        // setOpenTotal(false)
        // setStage(1)
        navigate(`/selling/honesty/all-retrieval-restrictions/${data.bond_id}`);
      },
    });
  const itemStatusOptions = [
    {
      id: 1,
      value: "ready",
      label: "جاهزة للتسليم",
      color: "green",
    },
    {
      id: 2,
      value: "workshop",
      label: "في الورشه",
      color: "orange",
    },
    {
      id: 3,
      value: "inShop",
      label: "في المحل - قبل الصيانة",
      color: "violet",
    },
  ];

  const totalCommission = paymentData.reduce((acc, item) => {
    return (
      acc + (item.add_commission_ratio === "yes" ? item.commission_riyals : 0)
    );
  }, 0);

  const totalTax = paymentData.reduce((acc, item) => {
    return (
      acc +
      (item.add_commission_ratio === "yes"
        ? item.commission_riyals * taxRate
        : 0)
    );
  }, 0);

  const totalPaid = paymentData.reduce((acc, item) => {
    return (
      acc +
      (+item.amount +
        (item.add_commission_ratio === "yes"
          ? item.commission_riyals + item.commission_riyals * taxRate
          : 0))
    );
  }, 0);

  const boxsData = [
    {
      id: 1,
      account: `${t("total paid")}`,
      value: totalPaid,
      unit: "ر.س",
    },
    {
      id: 2,
      account: `${t("total commission")}`,
      value: totalCommission,
      unit: "ر.س",
    },
    {
      id: 3,
      account: `${t("total commission tax")}`,
      value: totalTax,
      unit: "ر.س",
    },
  ];

  // total paid cost from client
  const totalPaidCostFromClient = paymentData.reduce((acc, curr) => {
    acc += curr.cost_after_tax;
    return acc;
  }, 0);

  const totalActualItemsCost = selectedItem.items
    .filter((item) => item.return_status !== "returned")
    .reduce((acc, curr) => {
      acc += +curr.cost * taxRate + +curr.cost;
      return acc;
    }, 0);

  const costRemainingHonest = (
    Number(totalActualItemsCost) -
    (Number(totalPaidCostFromClient) + Number(selectedItem?.amount))
  ).toFixed(digits_count.reyal);

  const incomingBoxesData = [
    {
      id: crypto.randomUUID(),
      account: `${t("prepaid cost")}`,
      value: selectedItem?.amount,
      unit: `${t("ryal")}`,
    },
    {
      id: crypto.randomUUID(),
      account: `${t("remaining cost")}`,
      value: costRemainingHonest,
      unit: `${t("ryal")}`,
    },
    {
      id: crypto.randomUUID(),
      account: `${t("cost after tax")}`,
      value: totalActualItemsCost,
      unit: `${t("ryal")}`,
    },
  ];
  ///
  /////////// CUSTOM HOOKS
  ///

  // const totalActualItemsCost = selectedItem.items
  //   .filter((item) => item.return_status !== "returned")
  //   .reduce((acc, curr) => {
  //     if (curr.id == costValue.id) {
  //       acc += +curr.cost;
  //     } else {
  //       acc += +curr.cost * taxRate + +curr.cost;
  //     }
  //     return acc;
  //   }, 0);

  // const costRemainingHonest = (
  //   Number(totalActualItemsCost) -
  //   (Number(totalPaidCostFromClient) + Number(selectedItem?.amount))
  // ).toFixed(digits_count.reyal);

  // const incomingBoxesData = [
  //   {
  //     id: crypto.randomUUID(),
  //     account: `${t("prepaid cost")}`,
  //     value: selectedItem?.amount,
  //     unit: `${t("ryal")}`,
  //   },
  //   {
  //     id: crypto.randomUUID(),
  //     account: `${t("remaining cost")}`,
  //     value: +costRemainingHonest,
  //     unit: `${t("ryal")}`,
  //   },
  //   {
  //     id: crypto.randomUUID(),
  //     account: `${t("cost after tax")}`,
  //     value: totalActualItemsCost,
  //     unit: `${t("ryal")}`,
  //   },
  // ];

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
  const columnHelper = createColumnHelper<any>();

  const columns = useMemo<any>(
    () => [
      columnHelper.accessor("checkBox", {
        header: () => `${t("#")}`,
        cell: (info) => (
          <input
            type="checkbox"
            className="border-mainGreen text-mainGreen rounded"
            id={info.row.original.id}
            name="selectedItem"
            onClick={(event) => handleCheckboxChange(event, info)}
          />
        ),
      }),
      columnHelper.accessor("category_value", {
        header: () => `${t("category")}`,
        cell: (info) => info.getValue() || "---",
      }),
      columnHelper.accessor("karat_value", {
        header: () => `${t("karat")}`,
        cell: (info) => info.getValue() || "---",
      }),
      columnHelper.accessor("weight", {
        header: () => `${t("weight")}`,
        cell: (info) => formatGram(Number(info.getValue())) || "---",
      }),
      columnHelper.accessor("cost", {
        header: () => `${t("cost")}`,
        cell: (info) =>
          (info.row.original.id == costValue.id &&
            formatReyal(Number(costValue.value))) ||
          formatReyal(Number(info.getValue())),
      }),
      columnHelper.accessor("VAT", {
        header: () => `${t("VAT")}`,
        cell: (info) =>
          formatReyal(Number(info.row.original.cost * taxRate)) || "---",
      }),
      columnHelper.accessor("cost_after_vat", {
        header: () => `${t("cost after tax")}`,
        cell: (info) =>
          formatReyal(
            Number(info.row.original.cost * taxRate + info.row.original.cost)
          ) || "---",
      }),
      columnHelper.accessor("category_value", {
        header: () => `${t("categories")}`,
        cell: (info) => (
          <select
            id="itemStatusOptions"
            defaultValue={info.row.original.status}
            // style={{
            //   color:
            //     info.row.original.status === "ready"
            //       ? "green"
            //       : info.row.original.status === "workshop"
            //         ? "orange"
            //         : "violet",
            // }}
            className={`bg-transparent border-none`}
            onChange={(option) => {
              const selectedItemCopy = JSON.parse(JSON.stringify(selectedItem));
              const selectedItemCopyIdIndex = selectedItemCopy.items.findIndex(
                (item) => item.id == info.row.original.id
              );
              selectedItemCopy.items[selectedItemCopyIdIndex].status =
                option.target.value;
              setSelectedItem(selectedItemCopy);
              mutate({
                endpointName: `branchSafety/api/v1/change-status/${selectedItem.id}/${info.row.original.id}?status=${option.target.value}`,
              });
            }}
          >
            {itemStatusOptions.map((option) => (
              <option
                id={option.id}
                // style={{ color: option.color }}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        ),
      }),
      columnHelper.accessor("attachments", {
        header: () => `${t("attachments")}`,
        cell: (info) => {
          const media = info?.row?.original?.images;
          return !media.length ? (
            "---"
          ) : (
            <FilesPreviewOutFormik images={media || []} preview pdfs={[]} />
          );
        },
      }),
      columnHelper.accessor("action", {
        header: () => `${t("edit")}`,
        cell: (info) => (
          <Edit
            className="mx-auto"
            action={() => {
              setCostValue({
                value: info.row.original.cost,
                id: info.row.original.id,
              });
              setEditCost(true);
            }}
          />
        ),
      }),
    ],
    [editCost, costValue, JSON.stringify(selectedItem), isChangeStatusSuccess]
  );

  // const columns = useMemo<any>(
  //   () => [
  //     columnHelper.accessor("checkBox", {
  //       header: () => `${t("#")}`,
  //       cell: (info) => (
  //         <input
  //           type="checkbox"
  //           className="border-mainGreen text-mainGreen rounded"
  //           id={info.row.original.id}
  //           name="selectedItem"
  //           onClick={(event) => handleCheckboxChange(event, info)}
  //         />
  //       ),
  //     }),
  //     columnHelper.accessor("category_value", {
  //       header: () => `${t("category")}`,
  //       cell: (info) => info.getValue() || "---",
  //     }),
  //     columnHelper.accessor("karat_value", {
  //       header: () => `${t("karat")}`,
  //       cell: (info) => info.getValue() || "---",
  //     }),
  //     columnHelper.accessor("weight", {
  //       header: () => `${t("weight")}`,
  //       cell: (info) => formatGram(Number(info.getValue())) || "---",
  //     }),
  //     columnHelper.accessor("cost", {
  //       header: () => `${t("cost")}`,
  //       cell: (info) =>
  //         (info.row.original.id == costValue.id &&
  //           formatReyal(Number(costValue.value) / Number(taxRate + 1))) ||
  //         formatReyal(Number(info.getValue())),
  //     }),
  //     columnHelper.accessor("VAT", {
  //       header: () => `${t("VAT")}`,
  //       cell: (info) =>
  //         (info.row.original.id == costValue.id &&
  //           formatReyal(
  //             (Number(costValue.value) / Number(taxRate + 1)) * taxRate
  //           )) ||
  //         formatReyal(Number(info.row.original.cost * taxRate)) ||
  //         "---",
  //     }),
  //     columnHelper.accessor("cost_after_vat", {
  //       header: () => `${t("cost after tax")}`,
  //       cell: (info) =>
  //         (info.row.original.id == costValue.id &&
  //           formatReyal(Number(costValue.value))) ||
  //         formatReyal(
  //           Number(info.row.original.cost * taxRate + info.row.original.cost)
  //         ) ||
  //         "---",
  //     }),
  //     columnHelper.accessor("category_value", {
  //       header: () => `${t("categories")}`,
  //       cell: (info) => (
  //         <select
  //           id="itemStatusOptions"
  //           defaultValue={info.row.original.status}
  //           // style={{
  //           //   color:
  //           //     info.row.original.status === "ready"
  //           //       ? "green"
  //           //       : info.row.original.status === "workshop"
  //           //         ? "orange"
  //           //         : "violet",
  //           // }}
  //           className={`bg-transparent border-none`}
  //           onChange={(option) => {
  //             const selectedItemCopy = JSON.parse(JSON.stringify(selectedItem));
  //             const selectedItemCopyIdIndex = selectedItemCopy.items.findIndex(
  //               (item) => item.id == info.row.original.id
  //             );
  //             selectedItemCopy.items[selectedItemCopyIdIndex].status =
  //               option.target.value;
  //             setSelectedItem(selectedItemCopy);
  //             mutate({
  //               endpointName: `branchSafety/api/v1/change-status/${selectedItem.id}/${info.row.original.id}?status=${option.target.value}`,
  //             });
  //           }}
  //         >
  //           {itemStatusOptions.map((option) => (
  //             <option
  //               id={option.id}
  //               // style={{ color: option.color }}
  //               value={option.value}
  //             >
  //               {option.label}
  //             </option>
  //           ))}
  //         </select>
  //       ),
  //     }),
  //     columnHelper.accessor("attachments", {
  //       header: () => `${t("attachments")}`,
  //       cell: (info) => {
  //         const media = info?.row?.original?.images;
  //         return !media.length ? (
  //           "---"
  //         ) : (
  //           <FilesPreviewOutFormik images={media || []} preview pdfs={[]} />
  //         );
  //       },
  //     }),
  //     columnHelper.accessor("action", {
  //       header: () => `${t("edit")}`,
  //       cell: (info) => (
  //         <Edit
  //           className="mx-auto"
  //           action={() => {
  //             setCostValue({
  //               value: info.row.original.cost,
  //               id: info.row.original.id,
  //             });
  //             setEditCost(true);
  //           }}
  //         />
  //       ),
  //     }),
  //   ],
  //   [editCost, costValue, JSON.stringify(selectedItem), isChangeStatusSuccess]
  // );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///
  useEffect(() => {
    setData(
      selectedItem.items.filter((item) => item.return_status !== "returned")
    );
  }, [selectedItem]);
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const selectedRowsToReturn = selectedRows.map((item) => ({
    ...item,
    branch_id: userData?.branch_id,
  }));

  const handlePostSelectedRows = () => {
    if (selectedItem.amount < refundAmount) {
      notify("info", `${t("must be less than prepaid cash")}`);
    } else {
      mutateItemReturnStatus({
        endpointName: `branchSafety/api/v1/return-status/${selectedItem.id}`,
        values: {
          items: selectedRowsToReturn,
          amount: selectedItem.amount,
          returned_cash: refundAmount,
        },
      });
    }
  };
  const handlePostAllRows = () => {
    const allItems = selectedItem.items.map((item) => ({
      ...item,
      branch_id: userData?.branch_id,
    }));
    if (selectedItem.amount < refundAmount) {
      notify("info", `${t("must be less than prepaid cash")}`);
    } else {
      mutateItemReturnStatus({
        endpointName: `branchSafety/api/v1/return-status/${selectedItem.id}`,
        values: {
          items: allItems,
          amount: selectedItem.amount,
          returned_cash: refundAmount,
        },
      });
    }
  };
  const handleSaveItems = () => {
    const remainingCost = Number(
      (
        Number(totalActualItemsCost) -
        (Number(totalPaidCostFromClient) + Number(selectedItem?.amount))
      ).toFixed(digits_count.reyal)
    );
    const allItemsStatus = selectedItem.items
      .filter((item) => item.return_status === "not_returned")
      .every((item) => item.status === "ready");
    if (paymentData.length === 0 && remainingCost !== 0) {
      notify("info", `${t("add payment method first")}`);
      return;
    }

    if (remainingCost !== 0) {
      notify("info", `${t("remaining cost must be 0")}`);
      return;
    }

    if (!allItemsStatus) {
      notify("info", `${t("all items must be ready to deliver")}`);
      return;
    }

    setStage(3);
  };
  ///
  if (!data?.length)
    return (
      <div>
        <div className="flex justify-end items-end p-8">
          <Back />
        </div>
        <h2 className="text-center font-bold text-xl text-mainGreen bg-lightGreen p-8 rounded mt-32 w-1/2 mx-auto">
          {t("All items of this bond have been returned before")}
        </h2>
      </div>
    );
  return (
    <>
      <div className="p-12 ">
        <div className="flex justify-end mb-5">
          <Button bordered action={() => setStage(1)}>
            {t("back")}
          </Button>
        </div>
        <OuterFormLayout>
          <InnerFormLayout>
            <div className="col-span-4">
              <div className="flex justify-between w-full items-center">
                <h3 className="font-bold">{t("honest details")}</h3>
                <div className="flex justify-end gap-5 col-span-4">
                  <Button
                    bordered
                    action={() => {
                      selectedRows.length
                        ? setOpen((prev) => !prev)
                        : notify("info", `${t("select item at least")}`);
                    }}
                  >
                    {t("retrieve partially")}
                  </Button>
                  <Button action={() => setOpenTotal((prev) => !prev)}>
                    {t("retrieve honest")}
                  </Button>
                </div>
              </div>

              <div className=" mb-6 overflow-x-scroll lg:overflow-x-visible w-full">
                <table className="mt-8 w-[815px] lg:w-full">
                  <thead className="bg-mainGreen text-white">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id} className="">
                        {headerGroup.headers.map((header, i) => {
                          if (i === 1 || i === 3) {
                            return (
                              <th
                                key={header.id}
                                className="py-4 px-2 border-l-2 border-l-lightGreen "
                                // style={{ minWidth: '180px' }}
                              >
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </th>
                            );
                          } else {
                            return (
                              <th
                                key={header.id}
                                className="py-4 px-2 border-l-2 border-l-lightGreen"
                              >
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </th>
                            );
                          }
                        })}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="">
                    {table.getRowModel().rows.map((row) => {
                      return (
                        <tr
                          key={row.id}
                          className={`border-b-2 border-b-flatWhite`}
                        >
                          {row.getVisibleCells().map((cell, i) => {
                            return (
                              <td
                                key={cell.id}
                                className="border-l-2 px-6 py-4 whitespace-nowrap border-l-flatWhite text-center bg-lightGray"
                                // style={{
                                //     minWidth: "max-content",
                                // }}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-span-4 mt-5">
              <hr />
              <div>
                {selectedItem && (
                  <div>
                    <ul className="flex gap-8 my-12 justify-center">
                      {incomingBoxesData?.map((data: any) => (
                        <li className="flex flex-col h-28 justify-center rounded-xl text-center text-sm font-bold shadow-md lg:w-1/3 w-2/4">
                          <p className="bg-mainOrange p-2 flex items-center justify-center h-[65%] rounded-t-xl text-white">
                            {data.account}
                          </p>
                          <p className="bg-white px-2 py-2 text-black h-[35%] rounded-b-xl">
                            {formatReyal(Number(data.value))}{" "}
                            <span>{data.unit}</span>
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <h3 className="font-bold mt-8">{t("payment")}</h3>
              <PaymentProcessing
                paymentData={paymentData}
                setPaymentData={setPaymentData}
                costRemainingHonest={costRemainingHonest}
              />
              {paymentData.length > 0 && (
                <div>
                  <ul className="flex gap-8 my-12 justify-center">
                    {boxsData?.map((data: any) => (
                      <li className="flex flex-col h-28 justify-center rounded-xl text-center text-sm font-bold shadow-md w-60">
                        <p className="bg-mainOrange p-2 flex items-center justify-center h-[65%] rounded-t-xl text-white">
                          {data.account}
                        </p>
                        <p className="bg-white px-2 py-2 text-black h-[35%] rounded-b-xl">
                          {formatReyal(Number(data.value))}{" "}
                          <span>{data.unit}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </InnerFormLayout>
        </OuterFormLayout>
        <div className="flex justify-end items-end px-4">
          <Button action={handleSaveItems}>{t("save")}</Button>
        </div>
      </div>

      <Modal
        maxWidth={"max-w-[450px]"}
        isOpen={editCost}
        onClose={() => {
          // const selectedItemCost = selectedItem.items.find(
          //   (item) => item.id == costValue.id
          // ).cost;
          // setCostValue({
          //   id: costValue.id,
          //   value: selectedItemCost,
          // });
          setEditCost(false);
        }}
      >
        <h3 className="text-center mb-5 font-bold">{t("edit cost value")}</h3>
        <div className="flex items-end gap-7">
          <div className="">
            <div className="flex justify-between">
              <p>{t("cost")}</p>
              <p>{costValue.value}</p>
            </div>
            <input
              type="number"
              className="border-lightGreen shadow-lg rounded"
              // value={costValue.value ? costValue.value : 0}
              onChange={(e) => {
                // setCostValue({
                //   id: costValue.id,
                //   value: e.target.value,
                // });
                setCostAfterTax(e.target.value);
              }}
            />
          </div>

          <Button
            className="bg-mainOrange h-11"
            action={() => {
              const selectedItemCopy = JSON.parse(JSON.stringify(selectedItem));
              const selectedItemCopyIdIndex = selectedItemCopy.items.findIndex(
                (item) => item.id == costValue.id
              );
              selectedItemCopy.items[selectedItemCopyIdIndex].cost =
                +costAfterTax / Number(taxRate + 1);
              setSelectedItem(selectedItemCopy);
              setEditCost(false);
              mutate({
                endpointName: `branchSafety/api/v1/change-cost/${selectedItem.id}/${costValue.id}`,
                values: { cost: +costAfterTax / Number(taxRate + 1) },
              });
              setCostValue({
                id: costValue.id,
                value: String(+costAfterTax / Number(taxRate + 1)),
              });
            }}
          >
            {t("confirm")}
          </Button>
        </div>
      </Modal>

      <Modal
        maxWidth={"max-w-[700px]"}
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <h3 className="text-center mb-5 mt-4 font-bold">
          {t("retrieve item")}
        </h3>
        <div className="flex flex-col mb-8">
          <label className="pb-2">{t("amount")}</label>
          <input
            type="number"
            className="rounded-md border-2 border-transparent w-2/4 focus:!border-2 focus:!border-mainGreen  px-4 py-[.30rem] shadows"
            value={refundAmount}
            onChange={(e) => {
              setRefundAmount(e.target.value);
            }}
          />
        </div>

        <div className="flex justify-center items-center gap-8">
          <Button
            className="bg-mainGreen"
            loading={returnItemsIsLoading}
            action={() => {
              handlePostSelectedRows();
            }}
          >
            {t("confirm")}
          </Button>
          <Button className="bg-mainRed" action={() => setOpen(false)}>
            {t("cancel")}
          </Button>
        </div>
      </Modal>

      <Modal
        maxWidth={"max-w-[500px]"}
        isOpen={openTotal}
        onClose={() => setOpenTotal(false)}
      >
        <h3 className="text-center mb-5 mt-4 font-bold">
          {t("retrieve item")}
        </h3>
        <div className="flex flex-col mb-8">
          <label className="pb-2">{t("total amount")}</label>
          <input
            type="number"
            className="rounded-md border-2 border-transparent w-2/4 focus:!border-2 focus:!border-mainGreen  px-4 py-[.30rem] shadows"
            value={refundAmount}
            onChange={(e) => {
              setRefundAmount(e.target.value);
            }}
          />
        </div>
        <div className="flex justify-center items-center gap-8">
          <Button
            className="bg-mainGreen"
            loading={returnItemsIsLoading}
            action={() => {
              handlePostAllRows();
            }}
          >
            {t("confirm")}
          </Button>
          <Button className="bg-mainRed" action={() => setOpenTotal(false)}>
            {t("cancel")}
          </Button>
        </div>
      </Modal>
    </>
  );
};
