import { t } from "i18next";
import SellingBoxes from "../../components/selling/selling components/data/SellingBoxes";
import { Button } from "../../components/atoms";
import { Back } from "../../utils/utils-components/Back";
import { notify } from "../../utils/toast";
import { Form, useFormikContext } from "formik";
import BillHeader from "../../components/selling/selling components/bill/BillHeader";
import BillInputs from "../../components/selling/selling components/bill/BillInputs";
import { ClientData_TP, Selling_TP } from "../selling/PaymentSellingPage";
import { SalesReturnTableInputDataDemo } from "./SalesReturnTableInputDataDemo";

type SellingFirstPage_TP = {
  sellingItemsData: Selling_TP;
  setSellingItemsData: any;
  setStage: any;
  dataSource: Selling_TP;
  setDataSource: any;
  clientData: ClientData_TP;
  setClientData: any;
  invoiceNumber: any;
};
const SalesReturnFirstPageDemo = ({
  invoiceNumber,
  setStage,
  sellingItemsData,
  setSellingItemsData,
  dataSource,
  setDataSource,
  clientData,
  setClientData,
}: SellingFirstPage_TP) => {
  const { values } = useFormikContext();

  return (
    <Form>
      <div className="relative h-full p-10">
        <h2 className="mb-4 text-base font-bold">{t("sales return")}</h2>
        <div className="bg-lightGreen rounded-lg sales-shadow px-6 py-5">
          <div className="bg-flatWhite rounded-lg bill-shadow p-5 h-41 ">
            <div className="mb-8">
              <BillHeader invoiceNumber={invoiceNumber} />
            </div>

            <div>
              <BillInputs
                invoiceNumberReturnDemo="invoice_id"
                dateFieldName="bond_date"
              />
            </div>
          </div>

          <div className="bg-flatWhite rounded-lg bill-shadow py-5 px-6 h-41 my-5">
            <h2 className="mb-4 text-base font-bold">
              {t("search by part number")}
            </h2>
            <>
              <SalesReturnTableInputDataDemo
                dataSource={dataSource}
                setClientData={setClientData}
                setDataSource={setDataSource}
                sellingItemsData={sellingItemsData}
                setSellingItemsData={setSellingItemsData}
              />
              <div className="pt-12 py-5">
                <h2 className="mb-4 text-base font-bold">{t("total bill")}</h2>
                <SellingBoxes
                  dataSource={dataSource}
                  sellingItemsData={sellingItemsData}
                />
              </div>
            </>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-12 pb-8">
          <Back />
          <Button
            type="submit"
            loading={false}
            action={() => {
              setClientData({
                client_value: values.client_name,
                client_id: values.client_id,
                bond_date: values.bond_date,
              });

              if (sellingItemsData.length === 0) {
                notify("info", `${t("please add data first")}`);
                return;
              }

              if (!values?.client_id) {
                notify("info", `${t("choose client's name first")}`);
                return;
              }

              setStage(2);
            }}
          >
            {t("payment")}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default SalesReturnFirstPageDemo;
