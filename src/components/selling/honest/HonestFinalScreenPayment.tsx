import { t } from "i18next";
import React, { useContext } from "react";
import { numberContext } from "../../../context/settings/number-formatter";
import cashImg from "../../../assets/cash.png";
import { authCtx } from "../../../context/auth-and-perm/auth";

interface HonestFinalScreenPayment_TP {
  items: any;
  paymentData: any;
}

const HonestFinalScreenPayment: React.FC<HonestFinalScreenPayment_TP> = ({
  items,
  paymentData,
}) => {
  console.log("🚀 ~ sanadData:", paymentData);
  const { formatReyal } = numberContext();
  const { userData } = useContext(authCtx);
  console.log("🚀 ~ userData:", userData);

  const totalValueOfItems = items.reduce((acc, curr) => {
    return +acc + +curr.cost;
  }, 0);

  return (
    <div className="flex justify-between px-8">
      <div className="text-center px-8 space-y-4">
        <div>
          <span className="font-medium text-xs">{t("vendor name")}</span>
          <p>{userData?.name}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <div className="flex flex-row items-end gap-4 mb-3">
          {paymentData?.map((card, index) => (
            <div
              key={index}
              className="flex flex-col items-center max-w-[100px] text-center"
            >
              <div className="w-16 h-16">
                <img
                  src={card.cardImage}
                  alt="cash"
                  className="w-full h-full"
                />
              </div>
              <p className="mt-3">
                {formatReyal(
                  Number(
                    card.cost_after_tax +
                      card.commission_riyals +
                      +card.commission_tax
                  ) || Number(card.amount)
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HonestFinalScreenPayment;
