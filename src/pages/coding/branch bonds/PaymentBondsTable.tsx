import { t } from "i18next";
import React, { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { numberContext } from "../../../context/settings/number-formatter";
import { Button } from "../../../components/atoms";
import { useQueryClient } from "@tanstack/react-query";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { notify } from "../../../utils/toast";
import { mutateData } from "../../../utils/mutateData";
import { Cards_Props_TP } from "../../../components/templates/bankCards/ViewBankCards";
import { Select } from "../../../components/molecules";
import { Form, Formik } from "formik";
import PaymentBondsAccountingEntry from "./PaymentBondsAccountingEntry";
import * as Yup from "yup";
import { SelectOption_TP } from "../../../types";
import { useNavigate } from "react-router-dom";
import { FilesUpload } from "../../../components/molecules/files/FileUpload";

const PaymentBondsTable = ({
  item,
  setOpenInvoiceModal,
  refetch,
  receive,
  refetchBoxsData,
}: {
  item?: {};
}) => {
  const { formatReyal, formatGram } = numberContext();
  const [files, setFiles] = useState([]);

  const isRTL = useIsRTL();

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    bank_Account: Yup.string().trim().required("برجاء ملئ هذا الحقل"),
  });

  const totalValueReyal = item?.items.reduce((acc, item) => {
    acc += +item.value_reyal;
    return acc;
  }, 0);

  const totalValueGram = item?.items.reduce((acc, item) => {
    acc += +item.value_gram;
    return acc;
  }, 0);

  const isBank = item.boxes?.some((box) => box.is_bank === 1);

  const {
    data: branchesOptions,
    isFetching: branchesOptionsFeatching,
    isLoading: branchesLoading,
    refetch: refetchBranches,
    failureReason: branchesErrorReason,
  } = useFetch<SelectOption_TP[]>({
    endpoint: "branch/api/v1/branches?per_page=10000",
    queryKey: ["all-branches"],
  });

  const branchesWithoutEdara = branchesOptions?.filter(
    (branch) => branch.id == item?.branch_id
  );

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "card_name",
        header: () => <span>{t("payment method")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() ? formatReyal(Number(info.getValue())) : "---",
        accessorKey: "amount",
        header: () => <span>{t("amount")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() ? formatGram(Number(info.getValue())) : "---",
        accessorKey: "value_gram",
        header: () => <span>{t("Gold value (in grams)")}</span>,
      },
    ],
    []
  );

  const table = useReactTable({
    data: item?.items,
    columns: tableColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  var originalString = "Hzn9_FOwN_albaraka_bank_01068978585_41_1";
  var parts = originalString.split("_");
  var desiredPart = parts.slice(0, -1).join("_"); // Join all parts except the last one

  const { data: accountBanks } = useFetch<Cards_Props_TP[]>({
    endpoint: `/selling/api/v1/get_bank_accounts_edrea`,
    queryKey: ["accountBanks"],
    select: (data) => {
      return data?.map((item) => ({
        id: item.front_key,
        value: item.front_key,
        label: `${isRTL ? item.name_ar : item.name_en} (${
          item.main_account_number
        })`,
      }));
    },
  });

  const queryClient = useQueryClient();
  const {
    mutate,
    error: mutateError,
    isLoading,
    isSuccess,
  } = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      queryClient.refetchQueries(["accept-reject"]);
      refetch();
      refetchBoxsData();
      setOpenInvoiceModal(false);
      notify("success");
      branchesWithoutEdara?.map((branch) => {
        navigate(`/accept-branchBonds?id=${branch?.id}&name=${branch?.name}`, {
          branchName: branch?.name,
        });
      });
    },
  });

  return (
    <Formik
      initialValues={{ bank_Account: "" }}
      onSubmit={(values) => {
        var parts = values.bank_Account.split("_").slice(0, -1).join("_");

        mutate({
          endpointName: `/sdad/api/v1/accpet/${item?.branch_id}/${item?.id}`,
          values: {
            front_key: parts,
            media: files,
          },
          method: "post",
          dataType: "formData",
        });
      }}
    >
      <Form>
        <div className="mt-16">
          <table className="min-w-full text-center">
            <thead className="border-b bg-mainGreen">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-sm font-medium text-white border-[1px] border-[#7B7B7B4D]"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, i) => (
                <tr key={row.id} className="border-b">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      className={`whitespace-nowrap px-6 py-4 text-sm font-light !bg-lightGreen !text-gray-900 border-[1px] border-[#7B7B7B4D]`}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot className="text-center">
              <tr className="text-center border-[1px] border-[#7B7B7B4D]">
                <td className="bg-[#F3F3F3] px-2 py-2 font-medium text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]">
                  {t("total")}
                </td>
                <td className="bg-[#F3F3F3] px-2 py-2 font-medium text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]">
                  {formatReyal(+totalValueReyal)} <span>{t("reyal")}</span>
                </td>
                <td className="bg-[#F3F3F3] px-2 py-2 font-medium text-mainGreen gap-x-2 items-center border-[1px] border-[#7B7B7B4D]">
                  {formatGram(totalValueGram)} <span>{t("gram")}</span>
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="mt-5">
            {receive ? (
              <>
                <div className="flex justify-between items-end gap-6">
                  {isBank && (
                    <Select
                      id="1"
                      label={`${t("choose bank")}`}
                      name="bank_Account"
                      placeholder={`${t("bank name")}`}
                      loadingPlaceholder={`${t("loading")}`}
                      options={accountBanks}
                      creatable
                      modalTitle={`${t("choose bank")}`}
                      required
                      fieldKey="id"
                      // value={newValue}
                      // isDisabled={disabled || (!BanksLoading && !!nationalityErrorReason)}
                      // onChange={(option) => {
                      //   setNewValue(option);
                      // }}
                    />
                  )}

                  <div className="">
                    <FilesUpload setFiles={setFiles} files={files} />
                  </div>
                </div>
                <Button
                  type="submit"
                  className={`${isRTL ? "float-left" : "float-right"} mt-5`}
                  loading={isLoading}
                >
                  {t("receive")}
                </Button>
              </>
            ) : (
              <PaymentBondsAccountingEntry item={item} />
            )}
          </div>
        </div>
      </Form>
    </Formik>
  );
};

export default PaymentBondsTable;
// action={handleSubmit}
