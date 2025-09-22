import { CiCalendarDate } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { useFetch } from "../../../../hooks";
import {
  BaseInputField,
  DateInputField,
  Modal,
  Select,
} from "../../../molecules";
import SellingClientForm from "../../SellingClientForm";
import { formatDate } from "../../../../utils/date";
import { Form, useFormikContext } from "formik";
import { t } from "i18next";
import { useContext, useState } from "react";
import { RefetchErrorHandler } from "../../../molecules/RefetchErrorHandler";
import { BaseInput } from "../../../atoms";
import { useLocation } from "react-router-dom";

const BillInputs = ({
  dateFieldName,
  suppliersData,
  invoiceNumberReturnDemo,
}: {
  dateFieldName?: string;
  suppliersData?: any;
  invoiceNumberReturnDemo?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState(false);
  const { userData } = useContext(authCtx);
  const { setFieldValue, values } = useFormikContext<any>();
  const location = useLocation();

  const { data: clientsNameOptions, isLoading } = useFetch({
    endpoint: `/branchManage/api/v1/all-clients/${userData?.branch_id}?per_page=10000`,
    queryKey: ["edara-bill-all-client"],
    select: (clients: any) =>
      clients?.map((item: any) => ({
        id: item.id,
        value: item.name,
        label: item.name,
      })),
    onError: (err) => console.log(err),
  });

  return (
    <div>
      <Form>
        <div className="flex items-center gap-12">
          <div className="flex items-end gap-3 w-1/3">
            <div>
              {invoiceNumberReturnDemo && (
                <BaseInput
                  name={invoiceNumberReturnDemo}
                  label={`${t("invoice number")}`}
                  placeholder={`${t("invoice number")}`}
                  type="text"
                  onChange={(e) => {
                    setFieldValue(invoiceNumberReturnDemo, e.target.value);
                  }}
                />
              )}
            </div>
            {suppliersData?.locationPath ? (
              <>
                <Select
                  id="supplier_id"
                  label={`${t("supplier name")}`}
                  name="supplier_id"
                  placeholder={`${t("supplier name")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  options={suppliersData?.suppliers}
                  fieldKey="id"
                  loading={suppliersData?.suppliersLoading}
                  isDisabled={
                    !suppliersData?.suppliersLoading &&
                    !!suppliersData?.suppliersErrorReason
                  }
                  onChange={(option: any) => {
                    suppliersData?.setSupplierId(option?.id);
                    setFieldValue("supplier_name", option!.label);
                    setFieldValue("supplier_id", option!.id);
                  }}
                />
                <RefetchErrorHandler
                  failureReason={suppliersData?.suppliersErrorReason}
                  isLoading={suppliersData?.suppliersLoading}
                  refetch={suppliersData?.refetchSupplier}
                />
              </>
            ) : (
              <>
                <Select
                  id="client_id"
                  label={`${t("client")}`}
                  name="client_id"
                  placeholder={`${t("client")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  options={clientsNameOptions}
                  fieldKey="id"
                  loading={isLoading}
                  {...(invoiceNumberReturnDemo && {
                    value: {
                      id: values.client_id,
                      label: values.client_name,
                      value: values.client_value,
                    },
                  })}
                  onChange={(option: any) => {
                    setFieldValue("client_name", option!.label);
                    setFieldValue("client_id", option!.id);
                    setFieldValue("client_value", option!.label);
                  }}
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
              </>
            )}
          </div>
          <div>
            <DateInputField
              label={`${t("date issuance bill")}`}
              name={`${dateFieldName}`}
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

export default BillInputs;
