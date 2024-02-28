import { t } from "i18next";
import {
  BaseInputField,
  Select,
  TextAreaField,
} from "../../../components/molecules";
import { IoMdAdd } from "react-icons/io";
import { Button } from "../../../components/atoms";
import { DeleteIcon, EditIcon } from "../../../components/atoms/icons";
import SelectKarat from "../../../components/templates/reusableComponants/karats/select/SelectKarat";
import SelectCategory from "../../../components/templates/reusableComponants/categories/select/SelectCategory";
import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Selling_TP } from "../../selling/PaymentSellingPage";
import { FilesUpload } from "../../../components/molecules/files/FileUpload";

interface AddSupportArticle_TP {
  supportArticleData: object[];
  dataSource: object[];
  setSupportArticleData: any;
  setDataSource: any;
}

const AddSupportArticle: React.FC<AddSupportArticle_TP> = ({
  supportArticleData,
  dataSource,
  setSupportArticleData,
  setDataSource,
  stepFile,
  setStepFile,
}) => {
  const supportArticleColumns = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("article name")} </span>,
        accessorKey: "article_name",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("steps")}</span>,
        accessorKey: "step",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("attachment")}</span>,
        accessorKey: "attachment",
        cell: (info) => info.getValue() || "---",
      },
    ],
    []
  );

  const table = useReactTable({
    data: supportArticleData,
    columns: supportArticleColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="mt-6">
        <BaseInputField
          id="article_title"
          name="article_title"
          className="w-60"
          type="text"
          label={`${t("article title")}`}
          placeholder={`${t("article title")}`}
          onChange={() => {}}
        />
      </div>

      <div className="mt-10 p-6 bg-mainGreen/5 border border-mainGreen/10 flex flex-col gap-4 rounded-lg ">
        <h4 className="font-bold text-lg">{t("article section")}</h4>

        <BaseInputField
          id="article_name"
          name="article_name"
          className="w-60"
          type="text"
          label={`${t("article name")}`}
          placeholder={`${t("article name")}`}
          onChange={() => {}}
        />

        <TextAreaField
          placeholder={`${t("type here")}`}
          id="steps"
          name="steps"
          required
          className=""
          label={`${t("steps")}`}
          // value={values?.desc}
          rows={4}
        />

        <div className="w-44">
          <FilesUpload files={stepFile} setFiles={setStepFile} />
        </div>
      </div>

      {/* <table className="mt-8 ">
        <thead className="bg-mainGreen text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="py-4 px-2">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`py-4 px-2 text-sm font-medium text-white border`}
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
          <tr className="text-center table-shadow last:shadow-0">
            <td className="border-l-2 border-l-flatWhite w-36">
              <BaseInputField
                id="article_name"
                name="article_name"
                type="text"
                label={`${t("article name")}`}
                placeholder={`${t("article name")}`}
                onChange={() => {}}
              />
            </td>
            <td className="w-36">
              <BaseInputField
                id="article_step"
                name="article_step"
                type="text"
                label={`${t("article step")}`}
                placeholder={`${t("article step")}`}
                onChange={() => {}}
              />
            </td>
            <td>
              <div className="w-44">
                <FilesUpload files={stepFile} setFiles={setStepFile} />
              </div>
            </td>
            <td className="bg-lightGreen justify-center border border-[#C4C4C4] flex items-center">
              {dataSource?.length == 1 &&
                dataSource[0]?.category_type === "multi" && (
                  <Button action={() => {}} className="bg-transparent px-2">
                    <EditIcon className="fill-mainGreen w-6 h-6" />
                  </Button>
                )}
              <Button action={() => {}} className="bg-transparent px-2">
                <IoMdAdd className="fill-mainGreen w-6 h-6" />
              </Button>
            </td>
          </tr>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id} className="text-center">
                {row.getVisibleCells().map((cell, i) => (
                  <td
                    className="px-2 py-2 bg-lightGreen bg-[#295E5608] gap-x-2 items-center border border-[#C4C4C4]"
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="bg-lightGreen p-0 border border-[#C4C4C4]">
                  <div className="flex items-center ">
                    <Button action={() => {}} className="bg-transparent px-2">
                      <EditIcon
                        size={16}
                        className="fill-mainGreen w-6 h-6 mb-[2px]"
                      />
                    </Button>
                    <Button action={() => {}} className="bg-transparent px-2 ">
                      <DeleteIcon className="fill-[#C75C5C] w-6 h-6" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table> */}
    </div>
  );
};

export default AddSupportArticle;
