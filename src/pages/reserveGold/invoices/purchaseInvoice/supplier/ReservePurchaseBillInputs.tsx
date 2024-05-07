// import { useFormikContext } from "formik";
// import { useState } from "react";
// import {
//   DateInputField,
//   Modal,
//   Select,
//   TextAreaField,
// } from "../../../../../components/molecules";
// import { IoMdAdd } from "react-icons/io";
// import { t } from "i18next";
// import { CiCalendarDate } from "react-icons/ci";
// import SellingClientForm from "../../../../../components/selling/SellingClientForm";
// import { formatDate } from "../../../../../utils/date";

import { Form, useFormikContext } from "formik";
import { useState } from "react";
import {
  DateInputField,
  Modal,
  Select,
  TextAreaField,
} from "../../../../../components/molecules";
import { t } from "i18next";
import { CiCalendarDate } from "react-icons/ci";
import { formatDate } from "../../../../../utils/date";
import SellingClientForm from "../../../../../components/selling/SellingClientForm";

// interface clientsNameOptions_TP {
//   value: number;
//   type: string;
//   id: number;
//   label: string;
// }

// interface ReservePurchaseBillInputs_TP {
//   isLoading: boolean;
//   supplierNameOptions: clientsNameOptions_TP[];
// }

// const ReservePurchaseBillInputs: React.FC<ReservePurchaseBillInputs_TP> = (
//   props
// ) => {
//   const { isLoading, supplierNameOptions } = props;
//   const [open, setOpen] = useState(false);
//   const [model, setModel] = useState(false);
//   const { setFieldValue, values } = useFormikContext();

//   return (
//     <div>
//       <div className="flex items-center gap-12">
//         <div className="flex items-end gap-3 w-1/3 lg:w-1/4">
//           <Select
//             id="supplier_id"
//             label={`${t("supplier")}`}
//             name="supplier_id"
//             placeholder={`${t("supplier")}`}
//             loadingPlaceholder={`${t("loading")}`}
//             options={supplierNameOptions}
//             fieldKey="id"
//             loading={isLoading}
//             onChange={(option) => {
//               setFieldValue("supplier_name", option!.label);
//               setFieldValue("supplier_id", option!.id);
//               setFieldValue("supplier_value", option!.label);
//             }}
//           />
//           {/* <button
//             type="button"
//             onClick={() => {
//               setOpen((prev) => !prev);
//               setModel(true);
//             }}
//             className="bg-[#295E5633] w-9 h-9 flex items-center justify-center rounded-lg duration-300 transition-all hover:bg-[#23514a4e]"
//           >
//             <IoMdAdd className="fill-mainGreen w-6 h-6" />
//           </button> */}
//         </div>
//         <div>
//           <DateInputField
//             label={`${t("date issuance bill")}`}
//             name="reserve_buying_date"
//             minDate={new Date()}
//             icon={<CiCalendarDate />}
//             required
//             labelProps={{ className: "mb-2" }}
//             placeholder={`${formatDate(new Date())}`}
//           />
//         </div>
//         <div>
//           <TextAreaField
//             id="notes"
//             label={t("notes")}
//             name="notes"
//             placeholder={t("notes")}
//             cols={50}
//             onChange={(option) => {
//               setFieldValue("notes", option!.target!.value);
//             }}
//           />
//         </div>
//       </div>

//       {/* {model && (
//         <Modal
//           isOpen={open}
//           onClose={() => {
//             setOpen(false);
//           }}
//           maxWidth="max-w-[50%]"
//         >
//           <SellingClientForm />
//         </Modal>
//       )} */}
//     </div>
//   );
// };

// export default ReservePurchaseBillInputs;";

interface clientsNameOptions_TP {
  value: number;
  type: string;
  id: number;
  label: string;
}

interface ReservePurchaseBillInputs_TP {
  isLoading: boolean;
  supplierNameOptions: clientsNameOptions_TP[];
}

const ReservePurchaseBillInputs: React.FC<ReservePurchaseBillInputs_TP> = (
  props
) => {
  const { isLoading, supplierNameOptions } = props;
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState(false);
  const { setFieldValue, values } = useFormikContext();

  return (
    <Form>
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
          {/* <button
            type="button"
            onClick={() => {
              setOpen((prev) => !prev);
              setModel(true);
            }}
            className="bg-[#295E5633] w-9 h-9 flex items-center justify-center rounded-lg duration-300 transition-all hover:bg-[#23514a4e]"
          >
            <IoMdAdd className="fill-mainGreen w-6 h-6" />
          </button> */}
        </div>
        <div>
          <DateInputField
            label={`${t("date issuance bill")}`}
            name="reserve_buying_date"
            maxDate={new Date()}
            icon={<CiCalendarDate />}
            required
            labelProps={{ className: "mb-2" }}
            placeholder={`${formatDate(new Date())}`}
          />
        </div>
        <div>
          <TextAreaField
            id="notes"
            label={t("notes")}
            name="notes"
            placeholder={t("notes")}
            cols={50}
            onChange={(option) => {
              setFieldValue("notes", option!.target!.value);
            }}
          />
        </div>
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
    </Form>
  );
};

export default ReservePurchaseBillInputs;
