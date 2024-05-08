import { t } from "i18next";
import QRCodeGen from "../../../atoms/QRCode";
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
}: {
  paymentData: never[];
  costDataAsProps: any;
}) => {
  const { formatReyal } = numberContext();

  const { userData } = useContext(authCtx);
  console.log("🚀 ~ userData:", userData)

  const { data: companyData } = useFetch<ClientData_TP>({
    endpoint: `/companySettings/api/v1/companies`,
    queryKey: ["Mineral_license_qr"],
  });
  console.log("🚀 ~ companyData:", companyData)


  function getTLV(tagNum, tagValue) {
    var tagNumBuf = Buffer.from([tagNum], "utf8");
    var tagValueLengthBuf = Buffer.from([tagValue.length], "utf8");
    var tagValueBuf = Buffer.from(tagValue, "utf8");
    var bufsArray = [tagNumBuf, tagValueLengthBuf, tagValueBuf];
    return Buffer.concat(bufsArray);
  }

  var sellerName = getTLV("1", `${userData?.name}`);
  var vatRegTRN = getTLV("2", `${companyData && companyData[0]?.taxRegisteration}`);
  var invoiceDate = getTLV("3", new Date().toUTCString());
  var totalInvoice = getTLV("4", `${costDataAsProps?.totalFinalCost}`);
  var invoiceVatTotal = getTLV("5", `${costDataAsProps?.totalItemsTaxes}`);

  var qrCodeBuf = Buffer.concat([
    sellerName,
    vatRegTRN,
    invoiceDate,
    totalInvoice,
    invoiceVatTotal,
  ]);
  var qrCodeBase64 = qrCodeBuf.toString("base64");

  return (
    <div className="flex justify-between pe-8">
      <div className="text-center">
        <span className="font-medium text-xs">{t("vendor name")}</span>
        <p>محمد المحيسن</p>
      </div>

      <div>
        <QRCode value={qrCodeBase64} />
      </div>
      <div className="flex flex-col gap-1 items-center">
        <div className="flex flex-row items-end gap-4 mb-3">
          {paymentData.map((card, index) => (
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
        <h3 className="mt-5 font-extrabold">
          {costDataAsProps.prepaidAmount ? (
            <>
              <span>{t("prepaid cost")}: </span>
              <span>{formatReyal(Number(costDataAsProps.prepaidAmount))}</span>
            </>
          ) : null}
        </h3>
      </div>
    </div>
  );
};

export default FinalPreviewBillPayment;
