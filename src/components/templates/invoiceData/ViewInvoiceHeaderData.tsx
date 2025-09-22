import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { CImageFile_TP } from "../../../types";
import { notify } from "../../../utils/toast";
import { mutateData } from "../../../utils/mutateData";
import { useQueryClient } from "@tanstack/react-query";
import { Table } from "../reusableComponants/tantable/Table";
import { t } from "i18next";
import { Button } from "../../atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { EditIcon } from "../../atoms/icons";
import { AddButton } from "../../molecules/AddButton";
import { Back } from "../../../utils/utils-components/Back";
import { Modal } from "../../molecules";
import { Header } from "../../atoms/Header";
import { Loading } from "../../organisms/Loading";
import { FilesPreviewOutFormik } from "../../molecules/files/FilesPreviewOutFormik";
import AddInvoiceHeaderData from "./AddInvoiceHeaderData";

export type Cards_Props_TP = {
  id: string;
  title: string;
  address: string;
  fax: string;
  market_number: string;
  name_ar: string;
  name_en: string;
  number: string;
  phone: string;
  files: CImageFile_TP[];
  InvoiceCompanyName?: string;
  InvoiceCompanyLogo?: string;
  QR_Code?: string;
  index?: number;
};

const ViewInvoiceHeaderData = () => {
  const isRTL = useIsRTL();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [action, setAction] = useState<"edit" | "delete" | null>(null);
  const [dataSource, setDataSource] = useState<Cards_Props_TP[]>([]);
  const [editData, setEditData] = useState<Cards_Props_TP | undefined>();
  const [deleteData, setDeleteData] = useState<Cards_Props_TP | undefined>();
  const [page, setPage] = useState(1);

  const columns = useMemo<ColumnDef<Cards_Props_TP>[]>(
    () => [
      {
        accessorKey: "index",
        header: () => <span>{t("Sequence")}</span>,
        cell: (info) => info.row.index + 1,
      },
      {
        accessorKey: "InvoiceCompanyName",
        header: () => <span>{t("name")}</span>,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "InvoiceCompanyLogo",
        header: () => <span>{t("invoice logo")}</span>,
        cell: (info) => {
          const image = [{ preview: info.row.original.InvoiceCompanyLogo }];
          return (
            <div className="w-[30%] m-auto">
              <FilesPreviewOutFormik images={image} preview />
            </div>
          );
        },
      },
      {
        accessorKey: "QR_Code",
        header: () => <span>{t("barcode logo")}</span>,
        cell: (info) => {
          const image = [{ preview: info.row.original.QR_Code }];
          return (
            <div className="w-[30%] m-auto">
              <FilesPreviewOutFormik images={image} preview />
            </div>
          );
        },
      },
      {
        accessorKey: "action",
        header: () => <span>{t("actions")}</span>,
        cell: (info) => (
          <div className="flex items-center justify-center gap-4">
            <EditIcon
              action={() => {
                setOpen(true);
                setEditData(info.row.original);
                setAction("edit");
                setIsAddMode(false);
              }}
              className="fill-mainGreen"
            />
          </div>
        ),
      },
    ],
    [isRTL]
  );

  const { data, isSuccess, isLoading, isRefetching, isFetching, refetch } =
    useFetch<Cards_Props_TP[]>({
      endpoint: `/companySettings/api/v1/InvoiceData?page=${page}`,
      queryKey: ["InvoiceHeader_Data", page],
      pagination: true,
      onSuccess(data) {
        const formattedData = data?.data.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {} as any);
        setDataSource([formattedData]);
      },
      select: (data) => ({
        ...data,
        data: data.data.map((item, i) => ({
          ...item,
          index: i + 1,
        })),
      }),
    });

  const queryClient = useQueryClient();
  const { mutate, isLoading: mutateLoading } = useMutate<Cards_Props_TP>({
    mutationFn: mutateData,
    onSuccess: () => {
      queryClient.refetchQueries(["InvoiceCompanyData"]);
      setOpen(false);
      notify("success");
    },
  });

  const handleDelete = () => {
    if (deleteData) {
      mutate({
        url: `/companySettings/api/v1/InvoiceData/${deleteData.id}`,
        method: "delete",
      });
    }
  };

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("Invoice data")}`} />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <p className="font-semibold text-lg">{t("View invoice data")}</p>
        <div className="flex gap-2">
          <AddButton
            action={() => {
              setEditData(undefined);
              setIsAddMode(true);
              setOpen(true);
              setAction(null);
            }}
            addLabel={t("add")}
          />
          <Back />
        </div>
      </div>

      {isSuccess && dataSource.length > 0 ? (
        <Table data={dataSource} columns={columns}>
          <div className="mt-3 flex items-center justify-end gap-5 p-2">
            <div className="flex items-center gap-2 font-bold">
              {t("page")}
              <span className="text-mainGreen">{data.current_page}</span>
              {t("from")}
              <span className="text-mainGreen">{data.pages}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="rounded bg-mainGreen p-[.12rem]"
                action={() => setPage((prev) => prev - 1)}
                disabled={page === 1}
              >
                {isRTL ? (
                  <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                ) : (
                  <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                )}
              </Button>
              <Button
                className="rounded bg-mainGreen p-[.18rem]"
                action={() => setPage((prev) => prev + 1)}
                disabled={page === data.pages}
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
        dataSource.length === 0 && (
          <div className="flex justify-center items-center mt-32">
            <p className="text-lg font-bold">
              {t("there is no available Invoice data yet")}
            </p>
          </div>
        )
      )}

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        {(action === "edit" || isAddMode) && (
          <AddInvoiceHeaderData
            editData={editData}
            setDataSource={setDataSource}
            setShow={setOpen}
            isFetching={isFetching}
            refetch={refetch}
            title={editData ? t("edit invoice data") : t("Add invoice data")}
            isSuccess={isSuccess}
          />
        )}

        {action === "delete" && (
          <div className="flex flex-col gap-8 justify-center items-center">
            <Header
              header={`حذف : ${
                isRTL ? deleteData?.name_ar : deleteData?.name_en
              }`}
            />
            <div className="flex gap-4 justify-center items-center">
              <Button
                action={handleDelete}
                loading={mutateLoading}
                variant="danger"
              >
                {t("confirm")}
              </Button>
              <Button action={() => setOpen(false)}>{t("close")}</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ViewInvoiceHeaderData;
