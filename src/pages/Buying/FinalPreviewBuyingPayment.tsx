import { t } from "i18next";
import QRCodeGen from "../../components/atoms/QRCode";

const FinalPreviewBuyingPayment = ({
  paymentData,
  costDataAsProps,
}: {
  paymentData: never[];
  costDataAsProps: any;
}) => {

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
      {/* <div className="flex flex-col gap-1 items-center">
        <div className="flex flex-row items-end gap-4 mb-3">
          {paymentData.map((card) => (
            <div className="flex flex-col items-center max-w-[100px] text-center">
              <div className="w-24 h-9">
                <img src={card.cardImage} alt="cash" className="w-full h-full"/>
              </div>
              <p className="mt-3">
                {
                  card.cost_after_tax +
                  card.commission_riyals +
                  +card.commission_tax
                }
              </p>
            </div>
          ))}
        </div>
        <h3 className="mt-5 font-extrabold">            
            {costDataAsProps.prepaidAmount 
              && (
                <>
                  <span>{t("prepaid cost")}: </span>
                  <span>{costDataAsProps.prepaidAmount}</span>
                </>
              )
            }
        </h3>
      </div> */}
    </div>
  );
};

export default FinalPreviewBuyingPayment;
