import { CiCalendarDate } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { Form, useFormikContext } from "formik";
import { t } from "i18next";
import { useContext, useState } from "react";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch } from "../../../hooks";
import { DateInputField, Modal, Select } from "../../../components/molecules";
import SellingClientForm from "../../../components/selling/SellingClientForm";
import { formatDate } from "../../../utils/date";
import { RefetchErrorHandler } from "../../../components/molecules/RefetchErrorHandler";
import { SelectOption_TP } from "../../../types";
import { Supplier_TP } from "../../../components/templates/systemEstablishment/supplier/supplier-types";

const BrokenGoldBillInputs = ({ dateFieldName }: { dateFieldName: string }) => {
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState(false);
  const { userData } = useContext(authCtx);
  const { setFieldValue, values } = useFormikContext();

  const { data: clientsNameOptions, isLoading } = useFetch({
    endpoint: `/branchManage/api/v1/clients?per_page=10000`,
    queryKey: ["bill-allClient_brokenGold"],
    select: (clients) =>
      clients.map((item: any) => ({
        id: item.id,
        value: item.name,
        label: item.name,
      })),
    onError: (err) => console.log(err),
  });

  const {
    data: suppliers,
    isLoading: suppliersLoading,
    failureReason: suppliersErrorReason,
    refetch: refetchSupplier,
  } = useFetch<SelectOption_TP[], Supplier_TP[]>({
    endpoint: "/supplier/api/v1/suppliers?per_page=10000",
    queryKey: ["suppliers-return"],
    onSuccess(data) {},
    select: (suppliers) =>
      suppliers.map((supplier) => {
        console.log("🚀 ~ suppliers.map ~ supplier:", supplier);
        return {
          //@ts-ignore
          id: supplier.id,
          value: supplier.name,
          label: supplier.name,
          name: supplier.name,
        };
      }),
  });

  return (
    <div>
      <Form>
        <div className="grid grid-cols-12 gap-x-8">
          <div className="col-span-3">
            <Select
              id="supplier_id"
              label={`${t("supplier name")}`}
              name="supplier_id"
              placeholder={`${t("supplier name")}`}
              loadingPlaceholder={`${t("loading")}`}
              options={suppliers}
              fieldKey="id"
              loading={suppliersLoading}
              isDisabled={
                (!suppliersLoading && !!suppliersErrorReason) ||
                values?.client_id
              }
              onChange={(option: any) => {
                setFieldValue("supplier_name", option!.label);
                setFieldValue("supplier_id", option!.id);
              }}
            />
            <RefetchErrorHandler
              failureReason={suppliersErrorReason}
              isLoading={suppliersLoading}
              refetch={refetchSupplier}
            />
          </div>

          <div className="flex items-end gap-x-4 col-span-3">
            <Select
              id="client_id"
              label={`${t("client")}`}
              name="client_id"
              placeholder={`${t("client")}`}
              loadingPlaceholder={`${t("loading")}`}
              options={clientsNameOptions}
              fieldKey="id"
              loading={isLoading}
              onChange={(option) => {
                setFieldValue("client_name", option!.label);
                setFieldValue("client_id", option!.id);
                setFieldValue("client_value", option!.label);
              }}
              isDisabled={values?.supplier_id}
            />
            <button
              type="button"
              onClick={() => {
                setOpen((prev) => !prev);
                setModel(true);
              }}
              className="bg-[#295E5633] w-9 h-9 flex items-center justify-center rounded-lg duration-300 transition-all hover:bg-[#23514a4e]"
            >
              <IoMdAdd className="fill-mainGreen w-6 h-6" />
            </button>
          </div>

          <div className="col-span-3">
            <DateInputField
              label={`${t("date issuance bill")}`}
              name={dateFieldName}
              minDate={new Date()}
              icon={<CiCalendarDate />}
              disabled
              required
              labelProps={{ className: "mb-2" }}
              placeholder={`${formatDate(new Date())}`}
            />
          </div>
        </div>
      </Form>

      {model && (
        <Modal
          isOpen={open}
          onClose={() => {
            setOpen(false);
          }}
          maxWidth="max-w-[50%]"
        >
          <SellingClientForm />
        </Modal>
      )}
    </div>
  );
};

export default BrokenGoldBillInputs;
