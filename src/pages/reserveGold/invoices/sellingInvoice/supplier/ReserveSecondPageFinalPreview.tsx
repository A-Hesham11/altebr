import FinalPreviewBillData from "../../../../../components/selling/selling components/bill/FinalPreviewBillData";
import FinalPreviewBuyingPayment from "../../../../Buying/FinalPreviewBuyingPayment";
import { t } from "i18next";
import { Button } from "../../../../../components/atoms";
import { useFormikContext } from "formik";
import InvoiceFooter from "../../../../../components/Invoice/InvoiceFooter";

const ReserveSecondPageFinalPreview = (props: any) => {
  const {
    invoiceNumber,
    costDataAsProps,
    sellingItemsData,
    setStage,
    ItemsTableContent,
  } = props;
  const { values } = useFormikContext();
  const clientData = {
    client_value: values!.supplier_name,
    client_id: values!.supplier_id,
    bond_date: values!.reserve_selling_data,
  };

  return (
    <div className="relative h-full p-10 bg-flatWhite ">
      <div className="print-section">
        <div className="bg-white  rounded-lg sales-shadow py-5 border-2 border-dashed border-[#C7C7C7] table-shadow ">
          <div className="mx-6 bill-shadow rounded-md p-6">
            <FinalPreviewBillData
              clientData={clientData}
              invoiceNumber={invoiceNumber}
            />
          </div>
          {ItemsTableContent}
          <div className="mx-6 bill-shadow rounded-md p-6 my-9">
            <FinalPreviewBuyingPayment
              costDataAsProps={costDataAsProps}
              sellingItemsData={sellingItemsData}
              hideCash
            />
          </div>
          <div>
            <InvoiceFooter />
          </div>
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
