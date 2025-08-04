import { t } from "i18next";

const InvoiceBasicHeader = ({ invoiceHeaderData }: any) => {
  return (
    <div className="border-2 border-[#E5ECEB] rounded-xl flex items-center justify-between py-6 px-5">
      <div>
        <img
          src={invoiceHeaderData?.invoice_logo}
          alt="bill"
          className="h-28 w-28 object-contain"
        />
      </div>

      <div className="text-center">
        <p className="text-2xl font-semibold text-mainGreen">
          {t(invoiceHeaderData?.invoice_text)}
        </p>
        <p className="font-bold mt-2">
          {t(invoiceHeaderData?.bond_title)} :{" "}
          <span>{Number(invoiceHeaderData?.invoice_number) + 1}</span>{" "}
        </p>
      </div>

      <div className="text-[15px]">
        {invoiceHeaderData?.first_title && (
          <p className="font-semibold">
            {t(invoiceHeaderData?.first_title)} :{" "}
            <span className="font-medium">
              {invoiceHeaderData?.first_value}
            </span>{" "}
          </p>
        )}

        {invoiceHeaderData?.second_title && (
          <p className="font-semibold my-1">
            {t(invoiceHeaderData?.second_title)} :{" "}
            <span className="font-medium">
              {invoiceHeaderData?.second_value}
            </span>{" "}
          </p>
        )}

        {invoiceHeaderData?.third_title && (
          <p className="font-semibold">
            {t(invoiceHeaderData?.third_title)} :{" "}
            <span className="font-medium">
              {invoiceHeaderData?.third_value}
            </span>{" "}
          </p>
        )}

        {invoiceHeaderData?.fourth_title && (
          <p className="font-semibold">
            {t(invoiceHeaderData?.fourth_title)} :{" "}
            <span className="font-medium">
              {invoiceHeaderData?.fourth_value}
            </span>{" "}
          </p>
        )}
      </div>
    </div>
  );
};

export default InvoiceBasicHeader;
