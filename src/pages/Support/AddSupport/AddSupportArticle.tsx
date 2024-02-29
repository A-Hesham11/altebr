import { t } from "i18next";
import {
  BaseInputField,
  Select,
  TextAreaField,
} from "../../../components/molecules";
import { IoIosArrowDropup, IoMdAdd } from "react-icons/io";
import { Button } from "../../../components/atoms";
import {
  DeleteIcon,
  EditIcon,
  ViewSvgIcon,
} from "../../../components/atoms/icons";
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
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useIsRTL } from "../../../hooks";
import { useFormikContext } from "formik";
import { CLightbox } from "../../../components/molecules/files/CLightbox";
import { FilesPreviewOutFormik } from "../../../components/molecules/files/FilesPreviewOutFormik";
import { FilesPreview } from "../../../components/molecules/files/FilesPreview";
import { DropFile } from "../../../components/molecules/files/DropFile";

interface AddSupportArticle_TP {
  supportArticleData: object[];
  dataSource: object[];
  setSupportArticleData: any;
  setDataSource: any;
  stepFile: object[];
  setStepFile: any;
  articlesData: object[];
  setArticlesData: any;
  levelThreeOption: object;
}

const AddSupportArticle: React.FC<AddSupportArticle_TP> = ({
  supportArticleData,
  dataSource,
  setSupportArticleData,
  setDataSource,
  stepFile,
  setStepFile,
  articlesData,
  setArticlesData,
  levelThreeOption,
}) => {
  console.log("🚀 ~ articlesData:", articlesData);
  const isRTL = useIsRTL();
  const [levelFourVisible, setLevelFourVisible] = useState(false);
  const { values, setFieldValue } = useFormikContext();
  console.log("🚀 ~ values:", values);

  const supportArticleColumns = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("article name in arabic")} </span>,
        accessorKey: "name_ar",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("article name in english")} </span>,
        accessorKey: "name_en",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("steps in arabic")}</span>,
        accessorKey: "step_ar",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("steps in english")}</span>,
        accessorKey: "step_en",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("actions")}</span>,
        accessorKey: "actions_id",
        cell: (info) => {
          const media = info?.row?.original?.media?.map((file) => ({
            id: info.row.id,
            path: URL.createObjectURL(file),
            preview: URL.createObjectURL(file),
          }));

          return (
            <span className="flex items-center justify-center">
              <DeleteIcon
                size={16}
                action={() => {
                  const itemId = info.row.original.id;
                  setArticlesData((curr) =>
                    curr.filter((item) => item.id !== itemId)
                  );
                }}
                className="!w-6 !h-6 ml-4"
              />

              <FilesPreviewOutFormik images={media || []} preview pdfs={[]} />
            </span>
          );
        },
      },
    ],
    [stepFile]
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
      <div
        // className="mt-6 flex items-center justify-between bg-mainGreen/5 p-4 cursor-pointer rounded-lg"
        className="mt-6"
        // onClick={() => setLevelFourVisible((prev) => !prev)}
      >
        <BaseInputField
          id="article_title"
          name="article_title"
          className="w-60 bg-mainDisabled"
          type="text"
          label={`${t("level four")}`}
          disabled
          placeholder={`${levelThreeOption.label}`}
          onChange={() => {}}
        />
        {/* <h3 className="text-lg">{t("level four")}</h3>
        <IoIosArrowDropup
          className={`${levelFourVisible && "rotate-180"} text-2xl`}
        /> */}
      </div>

      <div className="mt-10 p-6 bg-mainGreen/5 border border-mainGreen/10 flex flex-col gap-4 rounded-lg ">
        <h4 className="font-bold text-lg">{t("article section")}</h4>

        <div className="flex items-center gap-8 mb-4">
          <BaseInputField
            id="article_name_ar"
            name="article_name_ar"
            className="w-60"
            type="text"
            label={`${t("article name in arabic")}`}
            placeholder={`${t("article name in arabic")}`}
            onChange={() => {}}
          />
          <BaseInputField
            id="article_name_en"
            name="article_name_en"
            className="w-60"
            type="text"
            label={`${t("article name in english")}`}
            placeholder={`${t("article name in english")}`}
            onChange={() => {}}
          />
        </div>

        <div className="flex items-center gap-8">
          <TextAreaField
            placeholder={`${t("type here")}`}
            id="steps_ar"
            name="steps_ar"
            required
            className=""
            label={`${t("steps in arabic")}`}
            // value={values?.desc}
            rows={4}
          />
          <TextAreaField
            placeholder={`${t("type here")}`}
            id="steps_en"
            name="steps_en"
            required
            className=""
            label={`${t("steps in english")}`}
            // value={values?.desc}
            rows={4}
          />
        </div>

        <div className="w-44">
          <FilesUpload files={stepFile} setFiles={setStepFile} />
        </div>

        <div className="flex items-center justify-end mt-8">
          <Button
            type="button"
            className=""
            action={() => {
              setArticlesData((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  name_ar: values?.article_name_ar,
                  name_en: values?.article_name_en,
                  step_ar: values?.steps_ar,
                  step_en: values?.steps_en,
                  media: stepFile,
                },
              ]);

              setFieldValue("article_name_ar", "");
              setFieldValue("article_name_en", "");
              setFieldValue("steps_ar", "");
              setFieldValue("steps_en", "");
              setStepFile([]);
            }}
          >
            {t("add article")}
          </Button>
        </div>
      </div>

      {articlesData.length !== 0 && (
        <div className="mt-12">
          <Table data={articlesData || []} columns={supportArticleColumns}>
            {/* <div className="mt-3 flex items-center justify-center gap-5 p-2">
          <div className="flex items-center gap-2 font-bold">
            {t("page")}
            <span className=" text-mainGreen">
              {honestBondsData?.current_page}
            </span>
            {t("from")}
            {<span className=" text-mainGreen">{honestBondsData?.total}</span>}
          </div>
          <div className="flex items-center gap-2 ">
            <Button
              className=" rounded bg-mainGreen p-[.18rem]"
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
              className="rounded bg-mainGreen p-[.18rem]"
              action={() => setPage((prev) => prev + 1)}
              disabled={page == honestBondsData?.pages}
            >
              {isRTL ? (
                <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
              ) : (
                <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
              )}
            </Button>
          </div>
        </div> */}
          </Table>
        </div>
      )}

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
