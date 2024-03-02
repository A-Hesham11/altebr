import { t } from "i18next";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import RadioGroup from "../../../components/molecules/RadioGroup";
import { Form, Formik } from "formik";
import { Button } from "../../../components/atoms";
import { IoAdd } from "react-icons/io5";
import { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Cards_Props_TP } from "../../../components/templates/bankCards/ViewBankCards";
import { EditIcon } from "../../../components/atoms/icons";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { useQueryClient } from "@tanstack/react-query";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { Loading } from "../../../components/organisms/Loading";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { Modal } from "../../../components/molecules";
import AddSupport from "../AddSupport/AddSupport";
import { useNavigate } from "react-router-dom";
import { FilesPreview } from "../../../components/molecules/files/FilesPreview";
import AddSupportArticle from "../AddSupport/AddSupportArticle";

const ViewSupport = () => {
  const isRTL = useIsRTL();
  const [open, setOpen] = useState<boolean>(false);
  const [model, setModel] = useState(false);
  const [action, setAction] = useState({
    edit: false,
    delete: false,
    view: false,
  });
  const [editData, setEditData] = useState<Cards_Props_TP>();
  console.log("🚀 ~ ViewSupport ~ editData:", editData);
  const [deleteData, setDeleteData] = useState<Cards_Props_TP>();
  const [dataSource, setDataSource] = useState<Cards_Props_TP[]>([]);
  console.log("🚀 ~ ViewSupport ~ dataSource:", dataSource);
  const [levelDataEndPoint, setLevelDataEndPoint] = useState(
    "/support/api/v1/catSupport"
  );
  const [page, setPage] = useState<number>(1);
  const [levelType, setLevelType] = useState("1");
  const [levelColumn, setLevelColumn] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const initialValues = {
    levels_type: levelType,
  };

  // LEVEL ONE COLUMNS
  const levelOneColumns = useMemo<ColumnDef<Cards_Props_TP>[]>(
    () => [
      {
        header: () => <span>{t("Sequence")} </span>,
        accessorKey: "index",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("name in arabic")} </span>,
        accessorKey: "name_ar",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("name in english")} </span>,
        accessorKey: "name_en",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("actions")}</span>,
        accessorKey: "action",
        cell: (info) => {
          const imagePreview = info?.row?.original?.images?.map((image) => ({
            preview: image.preview,
            path: image.preview,
            type: "image",
          }));

          return (
            <div className="flex items-center justify-center gap-4">
              <EditIcon
                action={() => {
                  setOpen((prev) => !prev);
                  setEditData(info.row.original);
                  setAction({
                    edit: true,
                    delete: false,
                    view: false,
                  });
                  setModel(false);
                }}
                className="fill-mainGreen"
              />
              {info?.row?.original?.images && (
                <FilesPreview
                  preview
                  images={[...imagePreview] || []}
                  pdfs={[]}
                />
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  // LEVEL TWO COLUMNS
  const levelTwoColumns = useMemo<ColumnDef<Cards_Props_TP>[]>(
    () => [
      {
        header: () => <span>{t("Sequence")} </span>,
        accessorKey: "index",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("level one")} </span>,
        accessorKey: "cat_support_name",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("name in arabic")} </span>,
        accessorKey: "name_ar",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("name in english")} </span>,
        accessorKey: "name_en",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("description")} </span>,
        accessorKey: "desc",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("actions")}</span>,
        accessorKey: "action",
        cell: (info) => {
          const imagePreview = info?.row?.original?.images?.map((image) => ({
            preview: image.preview,
            path: image.preview,
            type: "image",
          }));

          return (
            <div className="flex items-center justify-center gap-4">
              <EditIcon
                action={() => {
                  setOpen((prev) => !prev);
                  setEditData(info.row.original);
                  setAction({
                    edit: true,
                    delete: false,
                    view: false,
                  });
                  setModel(false);
                }}
                className="fill-mainGreen"
              />
              {info?.row?.original?.images && (
                <FilesPreview
                  preview
                  images={[...imagePreview] || []}
                  pdfs={[]}
                />
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  // LEVEL THREE COLUMNS
  const levelThreeColumns = useMemo<ColumnDef<Cards_Props_TP>[]>(
    () => [
      {
        header: () => <span>{t("Sequence")} </span>,
        accessorKey: "index",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("level one")} </span>,
        accessorKey: "cat_support_name",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("level two")} </span>,
        accessorKey: "level_two_support_name",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("name in arabic")} </span>,
        accessorKey: "name_ar",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("name in english")} </span>,
        accessorKey: "name_en",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("actions")}</span>,
        accessorKey: "action",
        cell: (info) => {
          const imagePreview = info?.row?.original?.images?.map((image) => ({
            preview: image.preview,
            path: image.preview,
            type: "image",
          }));

          return (
            <div className="flex items-center justify-center gap-4">
              <EditIcon
                action={() => {
                  setOpen((prev) => !prev);
                  setEditData(info.row.original);
                  setAction({
                    edit: true,
                    delete: false,
                    view: false,
                  });
                  setModel(false);
                }}
                className="fill-mainGreen"
              />
              {info?.row?.original?.images && (
                <FilesPreview
                  preview
                  images={[...imagePreview] || []}
                  pdfs={[]}
                />
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  // LEVEL FOUR COLUMNS
  const levelFourColumns = useMemo<ColumnDef<Cards_Props_TP>[]>(
    () => [
      {
        header: () => <span>{t("Sequence")} </span>,
        accessorKey: "index",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("level one")} </span>,
        accessorKey: "cat_support_name",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("level two")} </span>,
        accessorKey: "level_two_support_name",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("name in arabic")} </span>,
        accessorKey: "name_ar",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("name in english")} </span>,
        accessorKey: "name_en",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("actions")}</span>,
        accessorKey: "action",
        cell: (info) => {
          const imagePreview = info?.row?.original?.images?.map((image) => ({
            preview: image.preview,
            path: image.preview,
            type: "image",
          }));

          return (
            <div className="flex items-center justify-center gap-4">
              <EditIcon
                action={() => {
                  setOpen((prev) => !prev);
                  setEditData(info.row.original);
                  setAction({
                    edit: true,
                    delete: false,
                    view: false,
                  });
                  setModel(false);
                }}
                className="fill-mainGreen"
              />
              {info?.row?.original?.images && (
                <FilesPreview
                  preview
                  images={[...imagePreview] || []}
                  pdfs={[]}
                />
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  const {
    data,
    isSuccess,
    isLoading,
    isError,
    error,
    isRefetching,
    refetch,
    isFetching,
  } = useFetch({
    endpoint: `${levelDataEndPoint}?page=${page}`,
    queryKey: ["levels", page],
    pagination: true,
    onSuccess(data) {
      setDataSource(data.data);
    },
    select: (data: object[]) => {
      return {
        ...data,
        data: data.data.map((branches: any, i: number) => ({
          ...branches,
          index: i + 1,
        })),
      };
    },
  });

  useEffect(() => {
    if (levelType == "1") {
      setLevelDataEndPoint("/support/api/v1/catSupport");
      setLevelColumn(levelOneColumns);
    } else if (levelType == "2") {
      setLevelDataEndPoint("/support/api/v1/levelTwoSupport");
      setLevelColumn(levelTwoColumns);
    } else if (levelType == "3") {
      setLevelDataEndPoint("/support/api/v1/levelThirdSupport");
      setLevelColumn(levelThreeColumns);
    } else {
      setLevelDataEndPoint("/support/api/v1/levelFourthSupport");
      setLevelColumn(levelFourColumns);
    }
  }, [levelType]);

  useEffect(() => {
    refetch();
  }, [levelDataEndPoint]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={""}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values }) => {
        setLevelType(values?.levels_type);

        return (
          <Form>
            {/* BREAD CRUMBS */}
            <div className="w-full flex justify-between mb-8">
              <div className="flex items-center gap-x-1">
                <p className="font-bold">{t("helper center")}</p>
                <MdKeyboardArrowLeft />
                <p className="font-bold text-[#7D7D7D]">{t("view")}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-4 text-xl font-bold">{t("view levels")}</h3>

              {/* LEVELS TYPES */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h5 className="font-bold text-base">{t("level")}:</h5>

                  <RadioGroup name="levels_type">
                    <RadioGroup.RadioButton
                      value="1"
                      label={t("level one")}
                      id="1"
                    />
                    <RadioGroup.RadioButton
                      value="2"
                      label={t("level two")}
                      id="2"
                    />
                    <RadioGroup.RadioButton
                      value="3"
                      label={t("level three")}
                      id="3"
                    />
                    <RadioGroup.RadioButton
                      value="4"
                      label={t("level four")}
                      id="4"
                    />
                  </RadioGroup>
                </div>

                <Button
                  className="bg-mainGreen/5 text-mainGreen flex items-center gap-1 border border-mainGreen"
                  action={() => {
                    navigate("/addSupport");
                  }}
                >
                  <IoAdd className="text-xl text-mainGreen font-bold" />
                  {t("add level")}
                </Button>
              </div>
            </div>

            {/* TABLE */}
            {isFetching && <Loading mainTitle={t("view levels")} />}
            {isSuccess && !isLoading && !isRefetching && dataSource.length ? (
              <Table data={dataSource} columns={levelColumn}>
                <div className="mt-3 flex items-center justify-end gap-5 p-2">
                  <div className="flex items-center gap-2 font-bold">
                    {t("page")}
                    <span className=" text-mainGreen">{data.current_page}</span>
                    {t("from")}
                    <span className=" text-mainGreen">{data.pages}</span>
                  </div>
                  <div className="flex items-center gap-2 ">
                    <Button
                      className=" rounded bg-mainGreen p-[.12rem] "
                      action={() => setPage((prev) => prev - 1)}
                      disabled={page == 1}
                    >
                      {isRTL ? (
                        <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                      ) : (
                        <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                      )}
                    </Button>
                    <Button
                      className=" rounded bg-mainGreen p-[.18rem]  "
                      action={() => setPage((prev) => prev + 1)}
                      disabled={page == data.pages}
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
            ) : (
              !isLoading &&
              !isRefetching &&
              !dataSource.length && (
                <div className="flex justify-center items-center mt-32">
                  <p className="text-lg font-bold">
                    {t("there are no entitlement policies available yet")}
                  </p>
                </div>
              )
            )}

            <Modal isOpen={open} onClose={() => setOpen(false)}>
              {action.edit && (
                <AddSupport
                  editData={editData}
                  levelType={levelType}
                  title={`${editData ? t("edit") : t("add")}`}
                  refetch={refetch}
                />
              )}
            </Modal>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ViewSupport;
