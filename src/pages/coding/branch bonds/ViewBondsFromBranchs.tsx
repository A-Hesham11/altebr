import { t } from "i18next";
import React, { useContext, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useFetch, useIsRTL } from "../../../hooks";
import { SelectOption_TP } from "../../../types";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { Button } from "../../../components/atoms";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Modal } from "../../../components/molecules";
import PaymentBondsTable from "./PaymentBondsTable";
import { BsEye } from "react-icons/bs";
import { Loading } from "../../../components/organisms/Loading";

const ViewBondsFromBranchs = () => {
  const isRTL = useIsRTL();
  const [page, setPage] = useState(1);
  const [invoiceModal, setOpenInvoiceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const branch_id = queryParams.get("id");
  const branch_name = queryParams.get("name");

  const { data: bankAccounts, isFetching: isFetchingBankAccounts } = useFetch<
    SelectOption_TP[]
  >({
    endpoint: "/sdad/api/v1/countBranches",
    queryKey: ["bank-accounts"],
  });

  const { data: acceptedBonds, isFetching: isFetchingAcceptedBonds } = useFetch<
    SelectOption_TP[]
  >({
    endpoint: `/sdad/api/v1/accpet-bond/${branch_id}`,
    queryKey: ["accepted-Bonds"],
  });

  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "invoice_number",
        header: () => <span>{t("invoice number")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "branch_name",
        header: () => <span>{t("branch")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "payment_date",
        header: () => <span>{t("date")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "employee_name",
        header: () => <span>{t("employee name")}</span>,
      },
      {
        cell: (info: any) => (
          <BsEye
            onClick={() => {
              setOpenInvoiceModal(true);
              setSelectedItem(info.row.original);
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

  const bankAccountFromBranch = bankAccounts?.filter(
    (account) => account.branch_id == branch_id
  );

  if (isFetchingAcceptedBonds || isFetchingBankAccounts)
    return <Loading mainTitle={`${t("loading")}`} />;

  return (
    <div className="relative p-6">
      <h2 className="mb-8 text-base font-bold">
        {t("Branch payment")} :{" "}
        <span className="text-mainGreen">{branch_name}</span>{" "}
      </h2>
      <div className="bg-lightGreen h-[100%] rounded-lg sales-shadow px-6 py-5">
        <div className="bg-flatWhite rounded-lg bill-shadow  py-5 px-6 h-41 my-5">
          <h2 className="mb-8 text-base font-bold">{t("total bonds")}</h2>
          <ul className="flex justify-around py-1 w-full mb-2">
            {bankAccountFromBranch?.map(({ name, key, unit_id, value }) => (
              <li
                className="flex flex-col justify-end h-28 rounded-xl text-center font-bold text-white shadow-md bg-transparent w-4/12"
                key={key}
              >
                <p className="bg-mainGreen  p-2 flex items-center justify-center h-[65%] rounded-t-xl text-white">
                  {name}
                </p>
                <p className="bg-white px-2 py-2 text-black h-[35%] rounded-b-xl">
                  {value} {t(unit_id)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12">
        <Table data={acceptedBonds || []} columns={tableColumn}>
          <div className="mt-3 flex items-center justify-end gap-5 p-2">
            <div className="flex items-center gap-2 font-bold">
              {t("page")}
              <span className=" text-mainGreen">{page}</span>
              {t("from")}
              <span className=" text-mainGreen">{acceptedBonds?.length}</span>
            </div>
            <div className="flex items-center gap-2 ">
              <Button
                className=" rounded bg-mainGreen p-[.18rem] "
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
                className=" rounded bg-mainGreen p-[.18rem] "
                action={() => setPage((prev) => prev + 1)}
                disabled={page == acceptedBonds?.length}
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

      {/* 3) MODAL */}
      <Modal isOpen={invoiceModal} onClose={() => setOpenInvoiceModal(false)}>
        <PaymentBondsTable item={selectedItem} receive={false} />
      </Modal>
    </div>
  );
};

export default ViewBondsFromBranchs;
