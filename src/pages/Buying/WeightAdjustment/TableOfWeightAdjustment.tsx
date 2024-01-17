import { useMemo, useState } from "react";
import { t } from "i18next";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { useIsRTL } from "../../../hooks";
import { Button } from "../../../components/atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { numberContext } from "../../../context/settings/number-formatter";

type TableOfWeightAdjustment_TP = {
  dataSource: any;
  setPage: any;
  page: any;
  setOperationTypeSelect: any;
  setCheckboxChecked: any;
  checkboxChecked: any;
};

const TableOfWeightAdjustment = ({
  dataSource,
  setPage,
  page,
  setOperationTypeSelect,
  setCheckboxChecked,
  checkboxChecked,
}: TableOfWeightAdjustment_TP) => {
  // STATE
  const isRTL = useIsRTL();
  const [IdentitiesModal, setOpenIdentitiesModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});

  const { formatGram, formatReyal } = numberContext();

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => {
          return (
            <input
              // checked={checkboxChecked}
              disabled={info.row.original.has_stones == 0}
              type="checkbox"
              className={`${
                info.row.original.has_stones == 0 &&
                "bg-mainGray border-mainGray"
              }`}
              onChange={(e) => {
                if (e.target.checked) {
                  setOperationTypeSelect((prev) => [
                    ...prev,
                    { ...info.row.original, index: info.row.index },
                  ]);
                } else {
                  setOperationTypeSelect((prev) =>
                    prev.filter((item) => item.index !== info.row.index)
                  );
                }
              }}
            />
          );
        },
        accessorKey: "checkbox",
        header: () => <span>{t("")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "id",
        header: () => <span>{t("#")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "invoice_number",
        header: () => <span>{t("invoice number")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "category_name",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => formatGram(Number(info.getValue())) || "-",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "employee_name",
        header: () => <span>{t("buyer name")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "invoice_date",
        header: () => <span>{t("date")}</span>,
      },
    ],
    []
  );

  return (
    <>
      <div className="">
        <Table data={dataSource.data || []} columns={tableColumn}>
          {dataSource?.data?.length === 0 ? (
            <p className="text-center text-xl text-mainGreen font-bold">
              {t("there is no pieces available")}
            </p>
          ) : (
            <div className="mt-3 flex items-center justify-center gap-5 p-2">
              <div className="flex items-center gap-2 font-bold">
                {t("page")}
                <span className=" text-mainGreen">{page}</span>
                {t("from")}
                {<span className=" text-mainGreen">{dataSource?.pages}</span>}
              </div>
              <div className="flex items-center gap-2 ">
                <Button
                  className=" rounded bg-mainGreen p-[.18rem]"
                  action={() => setPage((prev: any) => prev - 1)}
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
                  action={() => setPage((prev: any) => prev + 1)}
                  disabled={page == dataSource?.pages}
                >
                  {isRTL ? (
                    <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                  ) : (
                    <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </Table>
      </div>
    </>
  );
};

export default TableOfWeightAdjustment;
