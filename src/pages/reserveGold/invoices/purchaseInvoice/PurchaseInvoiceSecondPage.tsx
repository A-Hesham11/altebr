import React, { Dispatch, SetStateAction } from "react";

interface purchaseInvoicesSecondPage_TP {
  setStage?: Dispatch<SetStateAction<number>>;
}

const PurchaseInvoiceSecondPage: React.FC<purchaseInvoicesSecondPage_TP> = ({
  setStage,
}) => {
  return <div>PurchaseInvoiceSecondPage</div>;
};

export default PurchaseInvoiceSecondPage;
