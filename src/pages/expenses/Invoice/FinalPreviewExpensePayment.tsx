import { t } from "i18next";
import cashImg from "../../../assets/cash.png";
import QRCodeGen from "../../../components/atoms/QRCode";
import { numberContext } from "../../../context/settings/number-formatter";
import QRCode from "react-qr-code";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { useContext } from "react";

type FinalPreviewExpensePayment_TP = {
  paymentData: never[];
  costDataAsProps: any;
  sellingItemsData: any;
  responseSellingData: any;
};

const FinalPreviewExpensePayment = ({
  paymentData,
  costDataAsProps,
  sellingItemsData,
  odwyaTypeValue,
  setOdwyaTypeValue,
  responseSellingData
}: FinalPreviewExpensePayment_TP) => {

  const { formatReyal } = numberContext();
  const { userData } = useContext(authCtx);

  // FORMULA TO CALC THE TOTAL VALUE OF ITEMS
  const totalValueOfItems = sellingItemsData.reduce((acc, curr) => {
    return +acc + +curr.expense_price + +curr.expense_price_tax;
  }, 0);

  return (
    <div className="flex justify-between pe-8">
      <div className="text-center">
        <span className="font-medium text-xs">{t("vendor name")}</span>
        <p>{userData?.name}</p>
      </div>

      <div>
        <QRCode
          value={responseSellingData?.qr || ""}
        />
      </div>
      <div className="flex flex-col gap-1 items-center">
        <div className="flex flex-row items-end gap-4 mb-3">
          {paymentData?.map((item: any, index: number) => {
            return (
              <div
                key={index}
                className="flex flex-col items-center max-w-[100px] text-center"
              >
                <div className="w-24 h-9">
                  <img src={item.cardImage} alt="cash" className="w-full h-full" />
                </div>
                <p className="mt-3">{formatReyal(item.amount)}</p>
              </div>
            );
          })}
          {/* <div className="flex flex-col items-center max-w-[100px] text-center">
            <div className="w-24 h-9">
              <img src={cashImg} alt="cash" className="w-full h-full" />
            </div>
            <p className="mt-3">{formatReyal(totalValueOfItems)}</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default FinalPreviewExpensePayment;
