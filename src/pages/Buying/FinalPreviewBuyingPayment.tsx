import { t } from "i18next";
import QRCodeGen from "../../components/atoms/QRCode";
import { numberContext } from "../../context/settings/number-formatter";

type FinalPreviewBuyingPayment_TP = {
  paymentData: never[];
  costDataAsProps: any;
  sellingItemsData: any;
}

const FinalPreviewBuyingPayment = ({
  paymentData,
  costDataAsProps,
  sellingItemsData,
  odwyaTypeValue,
      setOdwyaTypeValue
}: FinalPreviewBuyingPayment_TP) => {
  console.log("🚀 ~ file: FinalPreviewBuyingPayment.tsx:18 ~ sellingItemsData:", sellingItemsData)
  const {formatReyal} = numberContext()

  // FORMULA TO CALC THE TOTAL VALUE OF ITEMS
  const totalValueOfItems = sellingItemsData.reduce((acc, curr) => {
    if (odwyaTypeValue === "شركة") {
      return +acc + +curr.total_value
    }
    
    return +acc + +curr.value;
  }, 0);

  return (
    <div className="flex justify-between pe-8">
      <div className="text-center">
        <span className="font-medium text-xs">{t("vendor name")}</span>
        <p>محمد المحيسن</p>
      </div>

      <div>
        <QRCodeGen
          value={`${Math.round(costDataAsProps.totalCost * 0.15)} RS`}
        />
      </div>
      <div className="flex flex-col gap-1 items-center">
        <div className="flex flex-row items-end gap-4 mb-3">
          <div className="flex flex-col items-center max-w-[100px] text-center">
            <div className="w-24 h-9">
              <img
                src={"/src/assets/cash.png"}
                alt="cash"
                className="w-full h-full"
              />
            </div>
            <p className="mt-3">{formatReyal(totalValueOfItems)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalPreviewBuyingPayment;
