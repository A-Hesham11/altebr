import { t } from "i18next";
import { numberContext } from "../../../context/settings/number-formatter";
import { Loading } from "../../../components/organisms/Loading";
import { Back } from "../../../utils/utils-components/Back";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { DateInputField, Modal } from "../../../components/molecules";
import TableOfIdentitiesPreview from "./TableOfIdentitiesPreview";
import { useEffect, useMemo, useState } from "react";
import { BsEye } from "react-icons/bs";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { Button } from "../../../components/atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { notify } from "../../../utils/toast";
import { IoCloseCircleSharp } from "react-icons/io5";
import { formatDate, getDayAfter } from "../../../utils/date";
import * as XLSX from "xlsx";
import { Delete } from "../../../components/atoms/icons/Delete";
import { Form, Formik } from "formik";
import { mutateData } from "../../../utils/mutateData";

interface ImportTotals_TP {
  totals?: object;
  pieces?: object[];
  setPiecesState?: any;
  setRejectedPieces?: any;
  setImportFiles?: any;
}

const ImportStonesTotal: React.FC<ImportTotals_TP> = ({
  totals,
  pieces,
  setPiecesState,
  setRejectedPieces,
  setImportFiles,
}) => {
  const initialValues = {
    file_date: "",
  };

  // DATA FROM THE RESPONSE ON MUTATE (WITH KEY "get")
  const { formatReyal, formatGram } = numberContext();
  const [IdentitiesModal, setOpenIdentitiesModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const isRTL = useIsRTL();
  const navigate = useNavigate();

  // CUSTOM PAGINATION
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItems, setCurrentItems] = useState([]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentItems(pieces?.slice(startIndex, endIndex));
  }, [pieces, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(pieces?.length / itemsPerPage);
  // CUSTOM PAGINATION

  const {
    data: importData,
    isFetching,
    isRefetching,
    isLoading,
  } = useFetch({
    queryKey: ["totals-data"],
    endpoint: "/tarqimGold/api/v1/imported-items",
    onError: (error) => {
      notify("error", error?.response?.data?.errors);
    },
  });

  const {
    data: imprtPieces,
    isFetching: imprtPiecesIsFetching,
    isRefetching: imprtPiecesIsRefetching,
    isLoading: imprtPiecesIsLoading,
    refetch,
  } = useFetch({
    queryKey: ["pieces-data"],
    endpoint:
      search === `/tarqimGold/api/v1/imported-items-details?` || search === ""
        ? `/tarqimGold/api/v1/imported-items-details?page=${page}`
        : `${search}`,
    pagination: true,
  });
  console.log("🚀 ~ imprtPieces:", imprtPieces);
  useEffect(() => {
    refetch();
  }, [page]);

  useEffect(() => {
    if (page == 1) {
      refetch();
    } else {
      setPage(1);
    }
  }, [search]);

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || info.row.index + 1 || "---",
        accessorKey: "id",
        header: () => <span>{t("Id number")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "hwya",
        header: () => <span>{t("id code")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "classification_name",
        header: () => <span>{t("category")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "category",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "model_number",
        header: () => <span>{t("modal number")}</span>,
      },
      {
        cell: (info: any) => {
          return (
            <div
              className={`${
                info.row.original.weight === "0" &&
                "bg-mainOrange text-white p-2"
              }`}
            >
              {info.getValue() ? formatGram(Number(info.getValue())) : "---"}
            </div>
          );
        },
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "supplier",
        header: () => <span>{t("supplier")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "bond_id",
        header: () => <span>{t("supply bond")}</span>,
      },
      {
        cell: (info: any) => {
          const wages =
            Number(info.row.original.wage).toFixed(2) *
            Number(info.row.original.weight);
          return formatReyal(wages);
        },
        accessorKey: "wages",
        header: () => <span>{t("wages")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "selling_price",
        header: () => <span>{t("value")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "---",
        accessorKey: "branch",
        header: () => <span>{t("branch")}</span>,
      },
      {
        cell: (info: any) => (
          <div className="flex items-center">
            <BsEye
              onClick={() => {
                setSelectedItem(info.row.original);
                setOpenIdentitiesModal(true);
              }}
              size={23}
              className="text-mainGreen mx-auto cursor-pointer"
            />

            {pieces?.length > 0 && (
              <Delete
                action={() => handleDeletePieces(info?.row?.original?.hwya)}
              />
            )}
          </div>
        ),
        accessorKey: "details",
        header: () => <span>{t("details")}</span>,
      },
    ],
    [pieces]
  );

  const tarqimBoxes = [
    {
      account: "total pieces",
      id: 1,
      value: pieces?.length || imprtPieces?.total,
      unit: "piece",
    },
    {
      account: "total wages",
      id: 6,
      value: totals
        ? formatReyal(totals?.total_wage)
        : formatReyal(importData?.total_wage),
      unit: "ryal",
    },
    {
      account: "total weight of 18 karat",
      id: 7,
      value: totals
        ? formatGram(totals?.total_weight_karat18)
        : formatGram(importData?.total_weight_karat18),
      unit: "gram",
    },
    {
      account: "total weight of 21 karat",
      id: 8,
      value: totals
        ? formatGram(totals?.total_weight_karat21)
        : formatGram(importData?.total_weight_karat21),
      unit: "gram",
    },
    {
      account: "total weight of 22 karat",
      id: 9,
      value: totals
        ? formatGram(totals?.total_weight_karat22)
        : formatGram(importData?.total_weight_karat22),
      unit: "gram",
    },
    {
      account: "total weight of 24 karat",
      id: 10,
      value: totals
        ? formatGram(totals?.total_weight_karat24)
        : formatGram(importData?.total_weight_karat24),
      unit: "gram",
    },
    {
      account: "total weight converted to 24",
      id: 11,
      value: totals
        ? formatGram(totals?.karat_diffrence)
        : formatGram(importData?.karat_diffrence),
      unit: "gram",
    },
    {
      account: "total karat difference",
      id: 11,
      value: totals
        ? formatGram(totals?.farq_karat)
        : formatGram(importData?.farq_karat),
      unit: "gram",
    },
    {
      account: "total diamond",
      id: 13,
      value: totals
        ? formatGram(totals?.diamond_total_selling_price)
        : formatGram(importData?.diamond_total_selling_price),
      unit: "gram",
    },
    {
      account: "total motafreqat",
      id: 14,
      value: totals
        ? formatGram(totals?.motafreqat_total_selling_price)
        : formatGram(importData?.motafreqat_total_selling_price),
      unit: "gram",
    },

    {
      account: "total gold stones",
      id: 14,
      value: totals
        ? formatGram(totals?.gold_ahgar_count)
        : formatGram(importData?.gold_ahgar_count),
      unit: "pieces",
    },
    {
      account: "total gold stones weight",
      id: 14,
      value: totals
        ? formatGram(totals?.gold_ahgar_weight)
        : formatGram(importData?.gold_ahgar_weight),
      unit: "gram",
    },
    {
      account: "total diamond stones",
      id: 14,
      value: totals
        ? formatGram(totals?.diamond_ahgar_count)
        : formatGram(importData?.diamond_ahgar_count),
      unit: "piece",
    },
    {
      account: "total diamond stones weight",
      id: 14,
      value: totals
        ? formatGram(totals?.diamond_ahgar_weight)
        : formatGram(importData?.diamond_ahgar_weight),
      unit: "gram",
    },
    {
      account: "total motafreqat stones",
      id: 14,
      value: totals
        ? formatGram(totals?.motafreqat_ahgar_count)
        : formatGram(importData?.motafreqat_ahgar_count),
      unit: "piece",
    },
    {
      account: "total motafreqat stones weight",
      id: 14,
      value: totals
        ? formatGram(totals?.motafreqat_ahgar_weight)
        : formatGram(importData?.motafreqat_ahgar_weight),
      unit: "gram",
    },
  ];

  const handleDeletePieces = (hwya: string) => {
    const findPiece = pieces?.find((piece: any) => {
      return piece.hwya === hwya;
    });

    const filterPieces = pieces?.filter((piece: any) => {
      return piece.hwya !== hwya;
    });

    setRejectedPieces((prev: any) => [...prev, findPiece]);
    setPiecesState(filterPieces);

    // CONVERT TO EXCEL FILE
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const ws = XLSX.utils.json_to_sheet(filterPieces);

    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    const file = new File([data], `${formatDate(new Date())}${fileExtension}`, {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    setImportFiles([file]);
  };

  const getSearchResults = async (req: any) => {
    let url = `/tarqimGold/api/v1/imported-items-details?`;
    let first = false;
    Object.keys(req).forEach((key) => {
      if (req[key] !== "") {
        if (first) {
          url += `?${key}=${req[key]}`;
          first = false;
        } else {
          url += `&${key}=${req[key]}`;
        }
      }
    });
    setSearch(url);
  };

  const {
    mutate,
    error: mutateError,
    isLoading: mutateLoading,
  } = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      notify(
        "success",
        `${t("the accounting entry was created successfully")}`
      );
    },
    onError: (error) => {
      console.log(error);
      notify("error", error?.response?.data?.message === "error" && `${t("there are no new parts")}`);
    },
  });

  const handleCreateAccountingEntry = () => {
    mutate({
      endpointName: `/tarqimGold/api/v1/create-restriction`,
      method: "post",
    });
  };

  // LOADING ....
  if (
    isFetching ||
    isRefetching ||
    isLoading ||
    imprtPiecesIsFetching ||
    imprtPiecesIsLoading ||
    imprtPiecesIsRefetching
  )
    return <Loading mainTitle={`${t("loading totals")}`} />;

  if (mutateLoading)
    return <Loading mainTitle={`${t("create accounting entry")}`} />;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        getSearchResults({
          ...values,
          file_date: values.file_date
            ? formatDate(getDayAfter(new Date(values.file_date)))
            : "",
        });
      }}
    >
      {(formik) => (
        <Form>
          <div>
            <div className="py-10">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-bold text-slate-700">
                  {t("totals of imported pieces")}
                </h3>
                <Button
                  action={() => navigate("/importTotal/bonds")}
                  type="button"
                >
                  {t("view bonds")}
                </Button>
              </div>
              {pieces?.length > 0 || imprtPieces?.data?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {tarqimBoxes?.map((data: any) => (
                    <li
                      key={data?.id}
                      className="flex flex-col h-28 justify-center rounded-xl text-center text-sm font-bold shadow-md"
                    >
                      <p className="bg-mainGreen p-2 flex items-center justify-center h-[65%] rounded-t-xl text-white">
                        {t(`${data?.account}`)}
                      </p>
                      <p className="bg-white px-2 py-2 text-black h-[35%] rounded-b-xl">
                        {data?.value} <span>{t(`${data?.unit}`)}</span>
                      </p>
                    </li>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center my-10">
                  <h3 className="text-2xl font-bold text-mainGreen">
                    {t("there is no imported data")}
                  </h3>
                </div>
              )}
            </div>

            {!pieces && (
              <div className="my-8 flex self-start">
                <div className="flex items-end gap-8 w-full">
                  <DateInputField
                    label={`${t("file date")}`}
                    placeholder={`${t("file date")}`}
                    name="file_date"
                    labelProps={{ className: "mt--10" }}
                  />
                  <Button type="submit" className="bg-mainGreen text-white">
                    بحث
                  </Button>

                  <Button
                    type="button"
                    className="mr-auto"
                    disabled={mutateLoading}
                    action={handleCreateAccountingEntry}
                  >
                    {t("create the accounting entry")}
                  </Button>
                </div>
              </div>
            )}

            <Table
              data={currentItems || imprtPieces?.data || []}
              columns={tableColumn}
            >
              <div className="mt-3 flex items-center justify-center gap-5 p-2">
                <div className="flex items-center gap-2 font-bold">
                  {t("page")}
                  <span className=" text-mainGreen">
                    {pieces?.length > 0 ? currentPage : page}
                  </span>
                  {t("from")}
                  {
                    <span className=" text-mainGreen">
                      {totalPages || imprtPieces?.pages}
                    </span>
                  }
                </div>
                <div className="flex items-center gap-2 ">
                  <Button
                    className=" rounded bg-mainGreen p-[.18rem]"
                    action={() => {
                      if (pieces?.length > 0) {
                        setCurrentPage((prev: number) => prev - 1);
                      } else {
                        setPage((prev: any) => prev - 1);
                      }
                    }}
                    disabled={pieces?.length > 0 ? currentPage == 1 : page == 1}
                  >
                    {isRTL ? (
                      <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                    ) : (
                      <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                    )}
                  </Button>

                  <Button
                    className="rounded bg-mainGreen p-[.18rem]"
                    action={() => {
                      if (pieces?.length > 0) {
                        setCurrentPage((prev: number) => prev + 1);
                      } else {
                        setPage((prev: any) => prev + 1);
                      }
                    }}
                    disabled={
                      pieces?.length > 0
                        ? currentPage == totalPages
                        : page == imprtPieces?.pages
                    }
                  >
                    {isRTL ? (
                      <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                    ) : (
                      <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                    )}
                  </Button>
                </div>
              </div>
            </Table>

            <Modal
              isOpen={IdentitiesModal}
              onClose={() => setOpenIdentitiesModal(false)}
            >
              <TableOfIdentitiesPreview item={selectedItem} />
            </Modal>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ImportStonesTotal;

