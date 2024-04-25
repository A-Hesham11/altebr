import React, { Dispatch, SetStateAction } from "react";

interface purchaseInvoicesSecondPage_TP {
  setStage?: Dispatch<SetStateAction<number>>;
}

const SellingInvoiceSecondPage: React.FC<purchaseInvoicesSecondPage_TP> = (
  props
) => {
  const { setStage } = props;
  return <div>SellingInvoiceSecondPage</div>;
};

export default SellingInvoiceSecondPage;
