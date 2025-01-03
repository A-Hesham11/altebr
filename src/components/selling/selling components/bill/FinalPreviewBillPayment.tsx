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
}: {
  paymentData: never[];
  costDataAsProps: any;
  responseSellingData: any;
  notQRCode?: boolean;
}) => {
  console.log("🚀 ~ paymentData:", paymentData)
  console.log("🚀 ~ costDataAsProps:", costDataAsProps);
  const { formatReyal } = numberContext();

  const { userData } = useContext(authCtx);
  const pathname = location.pathname;

  // function getTLV(tagNum, tagValue) {
  //   var tagNumBuf = Buffer.from([tagNum], "utf8");
  //   var tagValueLengthBuf = Buffer.from([tagValue?.length], "utf8");
  //   var tagValueBuf = Buffer.from(tagValue, "utf8");
  //   var bufsArray = [tagNumBuf, tagValueLengthBuf, tagValueBuf];
  //   return Buffer.concat(bufsArray);
  // }

  // var sellerName = getTLV("1", `${userData?.name}`);
  // var vatRegTRN = getTLV(
  //   "2",
  //   `${companyData && companyData[0]?.taxRegisteration}`
  // );
  // var invoiceDate = getTLV("3", new Date().toUTCString());
  // var totalInvoice = getTLV("4", `${costDataAsProps?.totalFinalCost}`);
  // var invoiceVatTotal = getTLV("5", `${costDataAsProps?.totalItemsTaxes}`);

  // var qrCodeBuf = Buffer.concat([
  //   sellerName,
  //   vatRegTRN,
  //   invoiceDate,
  //   totalInvoice,
  //   invoiceVatTotal,
  // ]);

  // var qrCodeBase64 = qrCodeBuf.toString("base64");

  return (
    <div className="flex justify-between pe-8 items-center">
      <div className="text-center">
        <span className="font-medium text-xs">
          {pathname === "/selling/branch-identity"
            ? t("bond editor")
            : t("vendor name")}
        </span>
        <p>{userData?.name}</p>
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
              className="flex flex-col items-center max-w-[100px] text-center"
            >
              <div className="w-24 h-9">
                <img
                  src={card.cardImage}
                  alt="cash"
                  className="w-full h-full"
                />
              </div>
              <p className="mt-3">
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
