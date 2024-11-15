import { t } from "i18next";
import { useFetch } from "../../hooks";
import { useLocation } from "react-router-dom";

const InvoiceHeader = ({ invoiceHeaderData }: any) => {
  const location = useLocation();
  const path = location.pathname;

  const supplyFetch =
    path === "/supply-return" ||
    path === "/bonds/supply-return" ||
    path === "/viewPurchaseBonds" ||
    path === "/viewSellingBonds";

  const { data } = useFetch<any>({
    endpoint: supplyFetch
      ? `/supplier/api/v1/supplier/${invoiceHeaderData?.supplier_id}`
      : `branchManage/api/v1/clients/${invoiceHeaderData?.client_id}`,
    queryKey: [
      `clients`,
      supplyFetch
        ? invoiceHeaderData?.supplier_id
        : invoiceHeaderData?.client_id,
    ],
    enabled: !!invoiceHeaderData?.client_id || !!invoiceHeaderData?.supplier_id,
  });
  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-1 mt-6">
        <p className="text-xs font-bold">
          {t("bill no")} :{" "}
          <span className="font-medium">
            {invoiceHeaderData?.invoice_number}
          </span>{" "}
        </p>
        <p className="text-xs font-bold">
          {t("bill date")} :{" "}
          <span className="font-medium">{invoiceHeaderData?.bond_date}</span>{" "}
        </p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <img
          src={invoiceHeaderData?.invoice_logo}
          alt="bill"
          className="h-28 w-3/4 object-contain"
        />
        <p className="text-base font-medium">
          {t(invoiceHeaderData?.invoice_text)}
        </p>
      </div>
      <div className="flex flex-col gap-1 mt-6">
        {invoiceHeaderData?.employee_name ? (
          <p className="text-xs font-bold">
            {t("employee name")}
            <span className="font-medium">
              {invoiceHeaderData?.employee_name}
            </span>{" "}
          </p>
        ) : invoiceHeaderData?.client_value != "غير معرف" ? (
          <>
            <p className="text-xs font-bold">
              {invoiceHeaderData?.supplier_id
                ? t("supplier name")
                : t("client name")}{" "}
              :{" "}
              <span className="font-medium">
                {invoiceHeaderData?.client_value ||
                  invoiceHeaderData?.supplier_name}
              </span>{" "}
            </p>
            <p className="text-xs font-bold">
              {t("mobile number")} :{" "}
              <span className="font-medium">{data?.phone}</span>{" "}
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default InvoiceHeader;
