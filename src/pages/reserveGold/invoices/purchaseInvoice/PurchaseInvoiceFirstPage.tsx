import { t } from "i18next";
import React, { Dispatch, SetStateAction } from "react";
import { Button } from "../../../../components/atoms";
import { useNavigate } from "react-router-dom";

interface PurchaseInvoiceFirstPage_TP {
  setStage?: Dispatch<SetStateAction<number>>;
}

const PurchaseInvoiceFirstPage: React.FC<PurchaseInvoiceFirstPage_TP> = (
  props
) => {
  const { setStage } = props;
  const navigate = useNavigate();

  return (
    <>
      <h3 className="mb-4 text-xl font-bold">
        {t("gold reservation purchase invoice")}
      </h3>
      {/* 
      <Button
        action={() => {
          setStage(2);
          navigate("/reservePurchaseBondInvoice");
        }}
      >
        {t("confirm")}
      </Button> */}
    </>
  );
};

export default PurchaseInvoiceFirstPage;
