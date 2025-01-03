import { t } from "i18next";
import React, { useEffect, useMemo, useState } from "react";
import { BoxesDataBase } from "../../components/atoms/card/BoxesDataBase";
import { Table } from "../../components/templates/reusableComponants/tantable/Table";
import { Button } from "../../components/atoms";
import RecycledGoldConvertProcess from "../../components/RecycledGoldInEdara/RecycledGoldConvertProcess";
import { Modal } from "../../components/molecules";
import { useFetch, useIsRTL } from "../../hooks";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { BiSpreadsheet } from "react-icons/bi";
import { Loading } from "../../components/organisms/Loading";
import RecycledGoldConvertEntry from "../../components/RecycledGoldInEdara/RecycledGoldConvertEntry";
import { numberContext } from "../../context/settings/number-formatter";
import CashTransferProccess from "./CashTransferProccess";
import CashTransferEntry from "./CashTransferEntry";
import { ViewIcon } from "../../components/atoms/icons";
import CashTransferInvoice from "./CashTransferInvoice";
import { GlobalDataContext } from "../../context/settings/GlobalData";

const CashTransfer = () => {
  const [dataSourse, setDataSource] = useState([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(1);
  const [openRecycledModal, setOpenRecycledModal] = useState(false);
  const isRTL = useIsRTL();
  const { formatReyal } = numberContext();
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const { invoice_logo } = GlobalDataContext();

  const Cols = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "id",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "employee_name",
        header: () => <span>{t("employee name")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "branch_name",
        header: () => <span>{t("branch name")}</span>,
      },
      {
        cell: (info: any) =>
          info.getValue() === "cash" ? t("cash") : t("Bank"),
        accessorKey: "transfer_type",
        header: () => <span>{t("Type conversion")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "amount",
        header: () => <span>{t("amount")}</span>,
      },
      {
        cell: (info: any) => (
          <BiSpreadsheet
            size={23}
            onClick={() => {
              setOpenRecycledModal(true);
              setSelectedItem(info.row.original);
            }}
            className="text-mainGreen mx-auto cursor-pointer"
          />
        ),
        accessorKey: "restriction",
        header: () => <span>{t("restriction")}</span>,
      },
      {
        cell: (info: any) => (
          <ViewIcon
            size={23}
            action={() => {
              setOpenInvoiceModal(true);
              setSelectedItem(info.row.original);
            }}
            className="text-mainGreen mx-auto"
          />
        ),
        accessorKey: "view",
        header: () => <span>{t("invoice")}</span>,
      },
    ],
    []
  );

  const { data, refetch, isRefetching, isFetching, isLoading } = useFetch({
    queryKey: ["allBondTransfor"],
    endpoint: `/aTM/api/v1/allBond?page=${page}`,
    pagination: true,
    onSuccess: (data) => {
      return setDataSource(data?.data);
    },
  });

  useEffect(() => {
    refetch();
  }, [page]);

  if (isRefetching || isFetching || isLoading)
    return <Loading mainTitle={t("loading items")} />;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t("Send cash to branch")}</h2>

      {/* <ul className="grid grid-cols-4 gap-6 mb-5 md:mb-16 mt-8">
        {totals?.map(({ name, key, value, unit }: any) => (
          <BoxesDataBase variant="secondary" key={key}>
            <p className="bg-mainGreen px-2 py-4 flex items-center justify-center rounded-t-xl">
              {name}
            </p>
            <p className="bg-white px-2 py-[7px] text-black rounded-b-xl">
              {value} {t(unit)}
            </p>
          </BoxesDataBase>
        ))}
      </ul> */}

      <div className="flex justify-end mb-5">
        <Button action={() => setOpen(true)}>{t("Cash Transfer")}</Button>
      </div>

      <div>
        <Table data={dataSourse || []} columns={Cols}>
          <div className="mt-3 flex items-center justify-end gap-5 p-2">
            <div className="flex items-center gap-2 font-bold">
              {t("page")}
              <span className=" text-mainGreen">{data?.current_page}</span>
              {t("from")}
              <span className=" text-mainGreen">{data?.pages}</span>
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
      </div>

      <Modal onClose={() => setOpen(false)} isOpen={open}>
        <CashTransferProccess refetch={refetch} setOpen={setOpen} />
      </Modal>

      <Modal
        isOpen={openInvoiceModal}
        onClose={() => setOpenInvoiceModal(false)}
      >
        <CashTransferInvoice item={selectedItem} invoice_logo={invoice_logo} />
      </Modal>

      <Modal
        onClose={() => setOpenRecycledModal(false)}
        isOpen={openRecycledModal}
      >
        <h2 className="mt-8 font-semibold text-lg">
          {t("Cash is being sent to the branch")}{" "}
        </h2>
        <CashTransferEntry boxes={selectedItem?.boxes || []} currentBox={1} />
      </Modal>
    </div>
  );
};

export default CashTransfer;
