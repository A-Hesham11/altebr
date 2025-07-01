import { t } from "i18next";
import { numberContext } from "../../../../context/settings/number-formatter";
import { useContext } from "react";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { Buffer } from "buffer";
import QRCode from "qrcode.react";
import { useFetch } from "../../../../hooks";
import { ClientData_TP } from "../../SellingClientForm";

const FinalPreviewBillPayment = ({
  paymentData,
  costDataAsProps,
  responseSellingData,
  notQRCode,
  employeeName,
}: {
  paymentData?: never[];
  costDataAsProps?: any;
  responseSellingData?: any;
  notQRCode?: any;
  employeeName?: string;
}) => {
  const { formatReyal } = numberContext();

  const { userData } = useContext(authCtx);
  const pathname = location.pathname;

  return (
    <div className="flex justify-between pe-8 items-center">
      <div className="text-center">
        <span className="font-medium text-xs">
          {pathname === "/selling/branch-identity"
            ? t("bond editor")
            : t("vendor name")}
        </span>
        <p>{employeeName || userData?.name}</p>
      </div>

      {!notQRCode && (
        <div>
          <QRCode value={responseSellingData?.qr} />
        </div>
      )}

      <div className="flex flex-col gap-1 items-center">
        <div className="flex flex-row items-end gap-4 mb-3">
          {paymentData?.map((card, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center rounded-xl border-2 overflow-hidden border-[#7B7B7B17]"
            >
              <div className="bg-white py-2 w-20 h-14 flex items-center justify-center">
                <img
                  src={card?.cardImage}
                  alt={card?.card}
                  className="w-16 h-12 object-cover"
                />
              </div>

              <p className="bg-[#7B7B7B17] w-full py-1">
                {card.add_commission_ratio === "yes"
                  ? formatReyal(
                      Number(
                        card.cost_after_tax +
                          card.commission_riyals +
                          +card.commission_tax
                      ) || Number(card.amount)
                    )
                  : formatReyal(
                      Number(card.cost_after_tax) || Number(card.amount)
                    )}
              </p>
            </div>
          ))}
        </div>
        {costDataAsProps?.prepaidAmount ? (
          <h3 className="mt-5 font-extrabold">
            <>
              <span>{t("prepaid cost")}: </span>
              <span>{formatReyal(Number(costDataAsProps.prepaidAmount))}</span>
            </>
          </h3>
        ) : null}
        {costDataAsProps?.recipientSignature === true ? (
          <div className="text-center">
            <span className="font-medium text-xs">
              {t("recipient's signature")}
            </span>
            <p className="mt-3">------------------------------</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FinalPreviewBillPayment;
