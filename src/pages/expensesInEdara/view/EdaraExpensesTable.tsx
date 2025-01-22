import React, { useMemo } from "react";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { BsEye } from "react-icons/bs";
import { BiSpreadsheet } from "react-icons/bi";
import {
  SET_ENTRY_MODAL_OPEN,
  SET_INVOICE_MODAL_OPEN,
  SET_PAGE,
  SET_SELECTED_ROW_DETAILS,
} from "../../../Reducers/Constants";
import { t } from "i18next";
import { Button } from "../../../components/atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useIsRTL } from "../../../hooks";

type TEdaraExpensesTableProps = {
  dataSource: any;
  dispatch: any;
  expenseData: any;
  page: number;
};

const EdaraExpensesTable: React.FC<TEdaraExpensesTableProps> = ({
  dataSource,
  dispatch,
  expenseData,
  page,
}) => {
  const isRTL = useIsRTL();

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "expense_bond_number",
        header: () => <span>{t("expenses bond number")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "expense_date",
        header: () => <span>{t("date")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "parent",
        header: () => <span>{t("main expense")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "child",
        header: () => <span>{t("sub expense")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "expense_amount",
        header: () => <span>{t("amount")}</span>,
      },

      {
        cell: (info: any) => info.getValue(),
        accessorKey: "description",
        header: () => <span>{t("description")}</span>,
      },
      {
        cell: (info: any) => (
          <BiSpreadsheet
            onClick={() => {
              dispatch({ type: SET_ENTRY_MODAL_OPEN, payload: true });
              dispatch({
                type: SET_SELECTED_ROW_DETAILS,
                payload: info.row.original,
              });
            }}
            size={23}
            className="text-mainGreen mx-auto cursor-pointer"
          />
        ),
        accessorKey: "restriction",
        header: () => <span>{t("restriction")}</span>,
      },
      {
        cell: (info: any) => (
          <BsEye
            onClick={() => {
              dispatch({ type: SET_INVOICE_MODAL_OPEN, payload: true });
              dispatch({
                type: SET_SELECTED_ROW_DETAILS,
                payload: info.row.original,
              });
            }}
            size={23}
            className="text-mainGreen mx-auto cursor-pointer"
          />
        ),
        accessorKey: "details",
        header: () => <span>{t("details")}</span>,
      },
    ],
    []
  );

  return (
    <>
      {/* 2) TABLE */}
      <div className="">
        <Table data={dataSource || []} columns={tableColumn}>
          {dataSource?.length === 0 ? (
            <p className="text-center text-xl text-mainGreen font-bold">
              {t("there is no pieces available")}
            </p>
          ) : (
            <div className="mt-3 flex items-center justify-center gap-5 p-2">
              <div className="flex items-center gap-2 font-bold">
                {t("page")}
                <span className=" text-mainGreen">
                  {expenseData?.current_page}
                </span>
                {t("from")}
                {<span className=" text-mainGreen">{expenseData?.pages}</span>}
              </div>
              <div className="flex items-center gap-2 ">
                <Button
                  className=" rounded bg-mainGreen p-[.18rem]"
                  action={() => dispatch({ type: SET_PAGE, payload: page - 1 })}
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
                  action={() => dispatch({ type: SET_PAGE, payload: page + 1 })}
                  disabled={page == expenseData?.pages}
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

export default EdaraExpensesTable;
