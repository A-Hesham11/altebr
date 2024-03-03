import { ColumnDef } from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import { Cards_Props_TP } from "../../../components/templates/bankCards/ViewBankCards";
import { t } from "i18next";
import { FilesPreview } from "../../../components/molecules/files/FilesPreview";
import { useFetch, useIsRTL } from "../../../hooks";
import { useQueryClient } from "@tanstack/react-query";
import { EditIcon } from "../../../components/atoms/icons";
import { Loading } from "../../../components/organisms/Loading";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { Button } from "../../../components/atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import AddSupport from "../AddSupport/AddSupport";
import { Modal } from "../../../components/molecules";
import { FilesPreviewOutFormik } from "../../../components/molecules/files/FilesPreviewOutFormik";
import { useNavigate } from "react-router-dom";
import { IoAdd } from "react-icons/io5";
import AddSupportArticle from "../AddSupport/AddSupportArticle";

const ViewSupportArticle = () => {
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
  console.log("🚀 ~ ViewSupportArticle ~ dataSource:", dataSource);
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(1);

  // LEVEL FOUR COLUMNS
  const levelFourColumns = useMemo<ColumnDef<Cards_Props_TP>[]>(
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
        header: () => <span>{t("steps in arabic")} </span>,
        accessorKey: "desc_ar",
        cell: (info) => {
          const step = info?.getValue()?.split("\n");
          return (
            <ol className="space-y-1 list-disc list-inside max-w-2xl px-2">
              {step?.map((el) => (
                <li className="break-words whitespace-pre-wrap" key={el}>
                  {el}
                </li>
              ))}
            </ol>
          );
        },
      },
      {
        header: () => <span>{t("steps in english")} </span>,
        accessorKey: "desc_en",
        cell: (info) => {
          const step = info?.getValue()?.split("\n");
          return (
            <ol className="space-y-1 list-disc list-inside max-w-2xl px-2">
              {step?.map((el) => (
                <li className="break-words whitespace-pre-wrap" key={el}>
                  {el}
                </li>
              ))}
            </ol>
          );
        },
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
              <FilesPreviewOutFormik
                images={imagePreview || []}
                preview
                pdfs={[]}
              />
              {/* {info?.row?.original?.images && (
                <FilesPreview
                  preview
                  images={[...imagePreview] || []}
                  pdfs={[]}
                />
              )} */}
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
    endpoint: `/support/api/v1/levelFourthSupport?page=${page}`,
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

  return (
    <div>
      {/* BREAD CRUMBS */}
      <div className="w-full flex justify-between mb-8">
        <div className="flex items-center gap-x-1">
          <p className="font-bold">{t("helper center")}</p>
          <MdKeyboardArrowLeft />
          <p className="font-bold text-[#7D7D7D]">{t("view")}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h3 className="mb-4 text-xl font-bold">{t("view article")}</h3>

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

      {/* TABLE */}
      <div>
        {isFetching && <Loading mainTitle={t("view levels")} />}
        {isSuccess && !isLoading && !isRefetching && dataSource.length ? (
          <Table data={dataSource} columns={levelFourColumns}>
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
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        {action.edit && (
          <AddSupportArticle
            editData={editData}
            levelType={4}
            title={`${editData ? t("edit") : t("add")}`}
            refetch={refetch}
          />
        )}
      </Modal>
    </div>
  );
};

export default ViewSupportArticle;
