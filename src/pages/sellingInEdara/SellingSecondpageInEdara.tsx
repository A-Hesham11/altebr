import PaymentProcessing, {
  Payment_TP,
} from "@/components/selling/selling components/data/PaymentProcessing";
import { t } from "i18next";
import { Selling_Invoice_TP } from "./CreateSellingInvoiceInEdara";
import { numberContext } from "@/context/settings/number-formatter";
import { notify } from "@/utils/toast";
import PaymentBoxes from "@/components/selling/selling components/data/paymentBoxs";
import { Button } from "@/components/atoms";

type SellingSecondpage_TP = {
  paymentData: any[];
  setPaymentData: any;
  setStage: any;
  sellingItemsData: Selling_Invoice_TP[];
};
const SellingSecondpageInEdara = ({
  paymentData,
  setPaymentData,
  sellingItemsData,
  setStage,
}: SellingSecondpage_TP) => {
  const totalPriceInvoice = sellingItemsData?.reduce(
    (total, item: any) => +total + +item.taklfa_after_tax,
    0
  );

  const amountRemaining = paymentData?.reduce(
    (total, item) => total + item.cost_after_tax,
    0
  );

  const costRemaining = +totalPriceInvoice - +amountRemaining;

  const { digits_count } = numberContext();

  const handleSeccessedData = () => {
    if (paymentData.length === 0) {
      notify("info", "fill fields first");
      return;
    }

    if (Number(Number(costRemaining).toFixed(digits_count.reyal)) != 0) {
      notify("info", "برجاء دفع المبلغ بالكامل");
      return;
    }

    setStage(3);
    notify("success");
  };

  return (
    <div className="relative">
      <h2 className="mb-4 text-base font-bold">{t("payment")}</h2>
      <div className="bg-lightGreen h-[100%] rounded-lg sales-shadow px-6 py-5">
        <div className="bg-flatWhite rounded-lg bill-shadow py-5 px-6 h-41 my-5">
          <div className="border-mainGray">
            <PaymentBoxes
              paymentData={paymentData}
              sellingItemsData={sellingItemsData}
            />
          </div>
        </div>
        <h2 className="mb-4 text-base font-bold">{t("choose type card")}</h2>
        <div className="bg-flatWhite rounded-lg bill-shadow py-5 px-6 h-41 my-5">
          <div>
            <PaymentProcessing
              paymentData={paymentData}
              setPaymentData={setPaymentData}
              sellingItemsData={sellingItemsData}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-3 justify-end mt-14">
        <Button
          type="submit"
          loading={false}
          action={() => {
            setStage(1);
          }}
          bordered
        >
          {t("back")}
        </Button>
        <Button action={handleSeccessedData}>{t("save")}</Button>
      </div>
    </div>
  );
};

export default SellingSecondpageInEdara;
