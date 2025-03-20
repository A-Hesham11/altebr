import FinalPreviewBillData from "../../../../../components/selling/selling components/bill/FinalPreviewBillData";
import FinalPreviewBuyingPayment from "../../../../Buying/FinalPreviewBuyingPayment";
import { t } from "i18next";
import { Button } from "../../../../../components/atoms";
import { useFormikContext } from "formik";
import InvoiceFooter from "../../../../../components/Invoice/InvoiceFooter";
import InvoiceBasicHeader from "../../../../../components/Invoice/InvoiceBasicHeader";

const ReserveSecondPageFinalPreview = (props: any) => {
  const {
    invoiceNumber,
    costDataAsProps,
    sellingItemsData,
    setStage,
    ItemsTableContent,
    invoiceHeaderBasicData,
  } = props;

  return (
    <div className="relative h-full py-10 bg-flatWhite ">
      <div className="print-section">
        <div className="print-header">
          <InvoiceBasicHeader invoiceHeaderData={invoiceHeaderBasicData} />
        </div>
        <div className="print-content">{ItemsTableContent}</div>
        <div className="print-footer">
          <FinalPreviewBuyingPayment
            costDataAsProps={costDataAsProps}
            sellingItemsData={sellingItemsData}
            hideCash
          />
          <InvoiceFooter />
        </div>
      </div>
      {/* {printContent && <div style={{ display: 'none' }}>{printContent}</div>}    */}

      <div className="flex gap-3 justify-end mt-14">
        <Button bordered action={() => setStage(1)}>
          {t("back")}
        </Button>
      </div>
    </div>
  );
};

export default ReserveSecondPageFinalPreview;
