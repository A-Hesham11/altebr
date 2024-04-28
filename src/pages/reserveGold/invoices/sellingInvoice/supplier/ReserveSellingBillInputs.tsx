import { useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import {
  DateInputField,
  Modal,
  Select,
} from "../../../../../components/molecules";
import { t } from "i18next";
import { IoMdAdd } from "react-icons/io";
import { formatDate } from "../../../../../utils/date";
import { CiCalendarDate } from "react-icons/ci";
import SellingClientForm from "../../../../../components/selling/SellingClientForm";
import { BsDatabase } from "react-icons/bs";
import { useFetch } from "../../../../../hooks";
import { numberContext } from "../../../../../context/settings/number-formatter";

interface clientsNameOptions_TP {
  value: number;
  type: string;
  id: number;
  label: string;
}

interface ReserveSellingBillInputs_TP {
  isLoading: boolean;
  supplierNameOptions: clientsNameOptions_TP[];
}

const ReserveSellingBillInputs: React.FC<ReserveSellingBillInputs_TP> = (
  props
) => {
  const { isLoading, supplierNameOptions } = props;
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState(false);
  const { formatGram, formatReyal } = numberContext();
  const { setFieldValue, values } = useFormikContext();

  const { data: supplierAccount, refetch } = useFetch({
    endpoint:
      values!.supplier_id &&
      `/reserveGold/api/v1/supplier_accounts/${values!.supplier_id}`,
    queryKey: ["supplier-accounts-data"],
  });
  console.log("🚀 ~ supplierAccount:", supplierAccount);

  useEffect(() => {
    refetch();
  }, [values!.supplier_id]);

  return (
    <div>
      <div className="flex items-center gap-12">
        <div className="flex items-end gap-3 w-1/3 lg:w-1/4">
          <Select
            id="supplier_id"
            label={`${t("supplier")}`}
            name="supplier_id"
            placeholder={`${t("supplier")}`}
            loadingPlaceholder={`${t("loading")}`}
            options={supplierNameOptions}
            fieldKey="id"
            loading={isLoading}
            onChange={(option) => {
              setFieldValue("supplier_name", option!.label);
              setFieldValue("supplier_id", option!.id);
              setFieldValue("supplier_value", option!.label);
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
        </div>
        <div>
          <DateInputField
            label={`${t("date issuance bill")}`}
            name="reserve_selling_data"
            minDate={new Date()}
            icon={<CiCalendarDate />}
            required
            labelProps={{ className: "mb-2" }}
            placeholder={`${formatDate(new Date())}`}
          />
        </div>

        {values!.supplier_id && (
          <>
            <div className="flex items-center self-end bg-mainOrange p-2 rounded-lg text-white font-base text-xs w-[29%]">
              <BsDatabase className="fill-white" />
              <p className=" border-l border-[#FFA34B] px-1">
                {t("24 gold credit for supplier")}
              </p>
              <p className="px-1">
                {formatGram(supplierAccount?.gram)} {t("gram")}
              </p>
            </div>
            <div className="flex items-center self-end bg-mainOrange p-2 rounded-lg text-white font-base text-xs w-[27%]">
              <BsDatabase className="fill-white" />
              <p className=" border-l border-[#FFA34B] px-1">
                {t("supplier cash balance")}
              </p>
              <p className="px-1">
                {formatReyal(supplierAccount?.reyal)} {t("reyal")}
              </p>
            </div>
          </>
        )}
      </div>

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

export default ReserveSellingBillInputs;
