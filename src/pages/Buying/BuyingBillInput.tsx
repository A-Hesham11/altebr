import { useQueryClient } from "@tanstack/react-query";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Form, useFormikContext } from "formik";
import { t } from "i18next";
import { useContext, useState } from "react";
import { notify } from "../../../../utils/toast";
import { CiCalendarDate } from "react-icons/ci";
import { authCtx } from "../../context/auth-and-perm/auth";
import { DateInputField, Modal, Select } from "../../components/molecules";
import { formatDate } from "../../utils/date";
import SellingClientForm from "../../components/selling/SellingClientForm";
import { useFetch } from "../../hooks";

type AddEmployeeProps_TP = {
  editEmployeeData?: InitialValues_TP | undefined;
  isLoading?: any;
  clientsNameOptions?: any;
};

const BuyingBillInput = ({
  dateFieldName,
  clientsNameOptions,
  isLoading,
}: {
  dateFieldName: string;
}) => {
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState(false);
  const navigate = useNavigate();
  const { userData } = useContext(authCtx);
  const { setFieldValue, values } = useFormikContext();

  const validationSchema = Yup.object().shape({
    dateField: Yup.date().required("Date is required"),
    client: Yup.string().required("Client is required"),
  });

  return (
    <div>
      <Form>
        <div className="flex items-center gap-12">
          <div className="flex items-end gap-3 w-1/3 lg:w-1/4">
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
              name={dateFieldName}
              minDate={new Date()}
              icon={<CiCalendarDate />}
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

export default BuyingBillInput;
