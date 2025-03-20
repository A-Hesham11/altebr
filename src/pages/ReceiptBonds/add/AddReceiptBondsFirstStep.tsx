import { useFormikContext } from "formik";
import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import PaymentProccessingToManagement, {
  Payment_TP,
} from "../../Payment/PaymentProccessingToManagement";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useFetch } from "../../../hooks";
import { t } from "i18next";
import {
  BaseInputField,
  Checkbox,
  DateInputField,
  Select,
  TextAreaField,
} from "../../../components/molecules";
import { CiCalendarDate } from "react-icons/ci";
import { formatDate } from "../../../utils/date";
import { FilesUpload } from "../../../components/molecules/files/FileUpload";
import { Back } from "../../../utils/utils-components/Back";
import { Button } from "../../../components/atoms";
import { notify } from "../../../utils/toast";

type TAddReceiptBondsFirstStep = {
  setStage: (value: number) => void;
  paymentData: any[];
  invoiceNumber: [] | null;
  files: any[];
  setFiles: Dispatch<SetStateAction<File>>;
  setPaymentData: (value: any[]) => void;
  selectedCardId: number;
  setSelectedCardId: any;
  setClientData: any;
  sellingItemsData: any[];
  setSellingItemsData: any;
  isTax: boolean;
  setIsTax: Dispatch<SetStateAction<boolean>>;
};

const AddReceiptBondsFirstStep = ({
  invoiceNumber,
  files,
  setFiles,
  paymentData,
  setPaymentData,
  selectedCardId,
  setSelectedCardId,
  setClientData,
  sellingItemsData,
  setSellingItemsData,
  setStage,
  isTax,
  setIsTax,
}: TAddReceiptBondsFirstStep) => {
  const { setFieldValue, values } = useFormikContext<Payment_TP>();
  const { userData } = useContext(authCtx);

  const [open, setOpen] = useState(false);
  const [model, setModel] = useState(false);
  const [cardId, setCardId] = useState("");
  const [selectedCardName, setSelectedCardName] = useState(null);

  const totalPaymentAmount = paymentData?.reduce((acc: any, item: any) => {
    return acc + +item.amount;
  }, 0);

  return (
    <div className="overflow-hidden">
      <div className="relative h-full">
        <h2 className="mb-4 text-base font-bold">{t("add receipt bond")}</h2>
        <div className="bg-lightGreen rounded-lg sales-shadow px-6 py-5">
          <div className="bg-flatWhite rounded-lg bill-shadow p-5 h-41 ">
            <div className="mb-8">
              <div className="flex items-center gap-8 lg:gap-16">
                <div className="flex items-center gap-5">
                  <h2>
                    {t("receipt bond number")} -{" "}
                    {`${invoiceNumber?.length + 1}`}
                  </h2>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 items-end gap-12 mb-6">
              <div>
                <BaseInputField
                  placeholder={`${t("receipt price")}`}
                  id="receipt_price"
                  name="receipt_price"
                  label={`${t("receipt price")}`}
                  type="number"
                  min={1}
                  required
                  onChange={(e) => {
                    const tax = +e.target.value * 0.15;
                    const netAmount = +e.target.value - tax;

                    if (isTax) {
                      setFieldValue("net_amount", netAmount);
                      setFieldValue("tax", tax);
                    } else {
                      setFieldValue("net_amount", "");
                      setFieldValue("tax", "");
                    }
                  }}
                />
              </div>

              <Select
                id="agency_beneficiary"
                label={`${t("agency / beneficiary")}`}
                name="agency_beneficiary"
                placeholder={`${t("agency / beneficiary")}`}
                loadingPlaceholder={`${t("loading")}`}
                options={[]}
                onChange={(e: any) => {}}
              />

              <DateInputField
                label={`${t("receipt date")}`}
                name="receipt_date"
                icon={<CiCalendarDate />}
                required
                labelProps={{ className: "mb-2" }}
                placeholder={`${formatDate(new Date())}`}
              />

              <div>
                <Checkbox
                  name="is_tax"
                  id="is_tax"
                  className="cursor-pointer"
                  labelClassName="text-base font-semibold text-gray-600"
                  label={`${t("is there a tax")}`}
                  onChange={(e) => {
                    const tax = +values?.receipt_price * 0.15;
                    const netAmount = +values?.receipt_price - tax;
                    setIsTax(e.target.checked);

                    if (e.target.checked) {
                      setFieldValue("net_amount", netAmount);
                      setFieldValue("tax", tax);
                    } else {
                      setFieldValue("net_amount", "");
                      setFieldValue("tax", "");
                    }
                  }}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 items-end lg:grid-cols-4 gap-8">
              <div>
                <BaseInputField
                  placeholder={`${t("beneficiary")}`}
                  id="beneficiary"
                  name="beneficiary"
                  label={`${t("beneficiary")}`}
                  type="text"
                  required
                  onChange={(e) => {
                    setFieldValue("beneficiary", +e.target.value);
                  }}
                />
              </div>

              <div>
                <BaseInputField
                  placeholder={`${t("invoice number")}`}
                  id="invoice_number"
                  name="invoice_number"
                  label={`${t("invoice number")}`}
                  type="number"
                />
              </div>

              <div>
                <BaseInputField
                  placeholder={`${t("reason")}`}
                  id="reason"
                  name="reason"
                  label={`${t("reason")}`}
                  type="text"
                />
              </div>

              <div className="justify-self-end ">
                <FilesUpload files={files} setFiles={setFiles} />
              </div>
            </div>

            {isTax && (
              <div className="grid md:grid-cols-2 items-end lg:grid-cols-4 mt-6 gap-8">
                <div>
                  <BaseInputField
                    placeholder={`${t("net amount")}`}
                    id="net_amount"
                    name="net_amount"
                    label={`${t("net amount")}`}
                    type="text"
                    disabled
                    className="bg-mainDisabled border-mainDisabled"
                  />
                </div>
                <div>
                  <BaseInputField
                    placeholder={`${t("tax")}`}
                    id="tax"
                    name="tax"
                    label={`${t("tax")}`}
                    type="text"
                    disabled
                    className="bg-mainDisabled border-mainDisabled"
                  />
                </div>
              </div>
            )}

            <div className="flex mt-6 items-end gap-6 w-full">
              <div className="w-full">
                <TextAreaField
                  placeholder={`${t("add description")}`}
                  id="description"
                  name="description"
                  required
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="my-6">
          <h2 className="mb-4 text-base font-bold">
            {t("choose a method of payment")}
          </h2>

          {/* PAYMENT CARDS */}
          <div>
            <PaymentProccessingToManagement
              paymentData={paymentData}
              setPaymentData={setPaymentData}
              sellingItemsData={sellingItemsData}
              selectedCardId={selectedCardId}
              setSelectedCardId={setSelectedCardId}
              setCardId={setCardId}
              cardId={cardId}
              setSelectedCardName={setSelectedCardName}
              selectedCardName={selectedCardName}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-12 pb-8">
          <Back />
          <Button
            type="submit"
            loading={false}
            action={() => {
              console.log("🚀 ~ values:", values);
              if (values.receipt_price === "") {
                notify("info", `${t("please enter receipt price")}`);
                return;
              }

              if (values.receipt_date === "") {
                notify("info", `${t("please enter receipt date")}`);
                return;
              }

              if (values.beneficiary === "") {
                notify("info", `${t("please enter beneficiary")}`);
                return;
              }

              // if (values.add_description === "") {
              //   notify("info", `${t("please enter description")}`);
              //   return;
              // }

              if (totalPaymentAmount > +values.receipt_price) {
                notify(
                  "info",
                  `${t(
                    "the amount of payment is greater than the value of the bond"
                  )}`
                );
                return;
              }

              if (totalPaymentAmount < +values.receipt_price) {
                notify(
                  "info",
                  `${t(
                    "the amount of payment is less than the value of the bond"
                  )}`
                );
                return;
              }

              if (paymentData?.length === 0) {
                notify("info", `${t("please add amount")}`);
                return;
              }

              setStage(2);
              setClientData({
                client_value: "ahmed",
                client_id: 1,
                bond_date: values.recipt_date,
              });

              setSellingItemsData([values]);
            }}
          >
            {t("add receipt bond")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddReceiptBondsFirstStep;
