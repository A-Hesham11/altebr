import { t } from "i18next";
import { notify } from "../../utils/toast";
import PaymentBoxes from "../../components/selling/selling components/data/paymentBoxs";
import { Button } from "../../components/atoms";
import PaymentProcessing, {
  Payment_TP,
} from "../../components/selling/selling components/data/PaymentProcessing";
import PaymentProccessingToManagement from "../Payment/PaymentProccessingToManagement";
import { useState } from "react";

type SellingSecondpage_TP = {
  paymentData: Payment_TP[];
  setPaymentData: any;
  setStage: any;
  sellingItemsData: any;
};
const SalesReturnSecondPage = ({
  paymentData,
  setPaymentData,
  sellingItemsData,
  setStage,
}: SellingSecondpage_TP) => {
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedCardName, setSelectedCardName] = useState(null);
  const [cardId, setCardId] = useState("");

  // const totalPriceInvoice = sellingItemsData?.reduce(
  //   (total, item) => +total + +item.taklfa_after_tax,
  //   0
  // );

  const locationPath = location.pathname

  const amountRemaining = paymentData?.reduce(
    (total, item) => Number(total) + Number(item.amount),
    0
  );

  
  const totalCommissionOfoneItem = sellingItemsData?.reduce(
    (total, item) => Number(total) + Number(item.commission_oneItem),
    0
  );

  const invoiceTotalOfOfSalesReturn = sellingItemsData.reduce(
    (total, item) => +total + +item.total,
    0
  );

  const costRemaining = Number(invoiceTotalOfOfSalesReturn) - Number(totalCommissionOfoneItem) - Number(amountRemaining);
  console.log("🚀 ~ costRemaining:", costRemaining)

  const handleSeccessedData = () => {
    if (paymentData.length === 0) {
      notify("info", "fill fields first");
      return;
    }

    if (costRemaining !== 0) {
      notify("info", "برجاء دفع المبلغ بالكامل");
      return;
    }

    setStage(3);
    notify("success");
  };

  return (
    <div className="relative p-10">
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
        <h2 className="mb-4 text-base font-bold">
          {t("Choose your payment method")}
        </h2>
        <div className="bg-flatWhite rounded-lg bill-shadow py-5 px-6 h-41 my-5">
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

export default SalesReturnSecondPage;
