import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { CImageFile_TP } from "../../../types";
import { notify } from "../../../utils/toast";
import { mutateData } from "../../../utils/mutateData";
import { useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Table } from "../reusableComponants/tantable/Table";
import { t } from "i18next";
import { Button } from "../../atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { EditIcon, ViewIcon, ViewSvgIcon } from "../../atoms/icons";
import { SvgDelete } from "../../atoms/icons/SvgDelete";
import { AddButton } from "../../molecules/AddButton";
import { Back } from "../../../utils/utils-components/Back";
import { Modal } from "../../molecules";
import { Header } from "../../atoms/Header";
import { Loading } from "../../organisms/Loading";
import { CLightbox } from "../../molecules/files/CLightbox";
import { FilesUpload } from "../../molecules/files/FileUpload";
import { FilesPreviewOutFormik } from "../../molecules/files/FilesPreviewOutFormik";
import AddInvoiceHeaderData from "./AddInvoiceHeaderData";

export type Cards_Props_TP = {
  title: string;
  main_address: any;
  id: string;
  address: string;
  fax: string;
  market_number: string;
  name_ar: string;
  name_en: string;

  number: string;
  phone: string;
  files: CImageFile_TP[];
};

const ViewInvoiceHeaderData = () => {
  const isRTL = useIsRTL();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [model, setModel] = useState(false);
  const [action, setAction] = useState({
    edit: false,
    delete: false,
    view: false,
  });
  const [dataSource, setDataSource] = useState<Cards_Props_TP[]>([]);
  const [editData, setEditData] = useState<Cards_Props_TP>();
  const [deleteData, setDeleteData] = useState<Cards_Props_TP>();
  const [page, setPage] = useState<number>(1);
  const [files, setFiles] = useState([]);
  const [updateDataSource, setUpdateDataSource] = useState([]);

  const columns = useMemo<ColumnDef<Cards_Props_TP>[]>(
    () => [
      {
        cell: (info) => 1,
        accessorKey: "index",
        header: () => <span>{t("Sequence")} </span>,
      },
      {
        cell: (info) => info.getValue(),
        accessorKey: "InvoiceCompanyName",
        header: () => <span>{t("name")} </span>,
      },
      {
        header: () => <span>{t("invoice logo")} </span>,
        accessorKey: "InvoiceCompanyLogo",
        cell: (info) => {
          const image = [{ preview: info?.row.original?.InvoiceCompanyLogo }];
          return (
            <div className="w-[30%] m-auto">
              <FilesPreviewOutFormik images={image} preview />
            </div>
          );
        },
      },
      {
        header: () => <span>{t("barcode logo")} </span>,
        accessorKey: "QR_Code",
        cell: (info) => {
          const image = [{ preview: info?.row.original?.QR_Code }];
          return (
            <div className="w-[30%] m-auto">
              <FilesPreviewOutFormik images={image} preview />
            </div>
          );
        },
      },
      {
        header: () => <span>{t("actions")}</span>,
        accessorKey: "action",
        cell: (info) => {
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
  } = useFetch<Cards_Props_TP[]>({
    endpoint: `/companySettings/api/v1/InvoiceData`,
    queryKey: ["InvoiceHeader_Data"],
    pagination: true,
    onSuccess(data) {
      const returnData = data?.data.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      setDataSource([returnData]);
    },
    select: (data) => {
      return {
        ...data,
        data: data.data.map((branches, i) => ({
          ...branches,
          index: i + 1,
        })),
      };
    },
  });

  const queryClient = useQueryClient();
  const {
    mutate,
    error: mutateError,
    isLoading: mutateLoading,
  } = useMutate<Cards_Props_TP>({
    mutationFn: mutateData,
    onSuccess: () => {
      queryClient.refetchQueries(["InvoiceCompanyData"]);
      setOpen(false);
      notify("success");
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <p className="font-semibold text-lg">{t("View invoice data")}</p>
        <div className="flex gap-2">
          <AddButton
            action={() => {
              setEditData(undefined);
              setModel(true);
              setOpen(true);
              setAction({
                edit: false,
                delete: false,
                view: false,
              });
            }}
            addLabel={`${t("add")}`}
          />
          <div className="ms-2">
            <Back />
          </div>
        </div>
      </div>
      {isFetching && <Loading mainTitle={t("Invoice data")} />}

      {isSuccess &&
      !!dataSource &&
      !isLoading &&
      !isRefetching &&
      !!dataSource.length ? (
        <Table data={dataSource} columns={columns}>
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
              {t("there is no available Invoice data yet")}
            </p>
          </div>
        )
      )}

      {/* {!isLoading &&
          !isRefetching &&
          !dataSource?.length && (
            <div>
              <p>{t("there is no available cards yet")}</p>
              kmk
            </div>
        )} */}

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        {action.edit && (
          <AddInvoiceHeaderData
            editData={editData}
            setDataSource={setDataSource}
            setShow={setOpen}
            isFetching={isFetching}
            refetch={refetch}
            title={`${
              editData ? t("edit invoice data") : t("Add invoice data")
            }`}
            refetch={refetch}
            isSuccess={isSuccess}
          />
        )}
        {model && (
          <AddInvoiceHeaderData
            editData={editData}
            isFetching={isFetching}
            setDataSource={setDataSource}
            setShow={setOpen}
            title={`${
              editData ? t("edit invoice data") : t("Add invoice data")
            }`}
            refetch={refetch}
            isSuccess={isSuccess}
          />
        )}
        {action.delete && (
          <div className="flex flex-col gap-8 justify-center items-center">
            <Header
              header={` حذف : ${
                isRTL ? deleteData?.name_ar : deleteData?.name_en
              }`}
            />
            <div className="flex gap-4 justify-center items-cent">
              <Button
                action={handleDelete}
                loading={mutateLoading}
                variant="danger"
              >
                {`${t("confirm")}`}
              </Button>
              <Button action={() => setOpen(false)}>{`${t("close")}`}</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ViewInvoiceHeaderData;
