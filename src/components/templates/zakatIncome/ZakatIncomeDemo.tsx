import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Form, Formik, useFormikContext } from "formik";
import { t } from "i18next";
import { useContext, useEffect, useMemo, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { BaseInputField } from "../../molecules";
import { Button } from "../../atoms";
import { notify } from "../../../utils/toast";
import { DeleteIcon, EditIcon } from "../../atoms/icons";
import { numberContext } from "../../../context/settings/number-formatter";
import { SelectBranches } from "../reusableComponants/branches/SelectBranches";
import { useMutate } from "../../../hooks";
import { mutateData } from "../../../utils/mutateData";
import QRCode from "react-qr-code";

type ZakatIncomeDemo_Tp = {
  id: number;
  quantity: number;
  discound: number;
  product_name: string;
  branch_id: number;
  price: number;
  tax: number;
  total: number;
};

const ZakatIncomeDemo = () => {
  const [responseSellingData, setResponseSellingData] = useState<any>({});
  console.log(
    "🚀 ~ ZakatIncomeDemo ~ responseSellingData:",
    responseSellingData
  );

  const initialValues: ZakatIncomeDemo_Tp = {
    id: 1,
    quantity: 1,
    discound: 0,
    branch_id: 0,
    product_name: "product name",
    price: 1,
    tax: 0.15,
    total: 1.15,
  };

  const { mutate } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      setResponseSellingData(data);
      notify("success");
    },
  });

  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {({ values, resetForm }) => (
        <Form>
          <h2 className="mb-6 text-xl font-semibold text-mainGreen">
            {t("Trial version on Zakat and Income")}
          </h2>
          <div className="grid grid-cols-3 gap-x-4 gap-y-8">
            <div>
              <SelectBranches required name="branch_id" />
            </div>
            <div>
              <BaseInputField
                placeholder={`${t("product name")}`}
                label={`${t("product name")}`}
                id="product_name"
                name="product_name"
                type="text"
                className={`text-center bg-mainDisabled`}
                disabled
              />
            </div>
            <div>
              <BaseInputField
                placeholder={`${t("cost")}`}
                label={`${t("cost")}`}
                id="price"
                name="price"
                type="number"
                className={`text-center bg-mainDisabled`}
                disabled
              />
            </div>
            <div>
              <BaseInputField
                placeholder={`${t("VAT")}`}
                label={`${t("VAT")}`}
                id="tax"
                name="tax"
                type="number"
                className={`text-center bg-mainDisabled`}
                disabled
              />
            </div>
            <div>
              <BaseInputField
                placeholder={`${t("total")}`}
                label={`${t("total")}`}
                id="total"
                name="total"
                type="number"
                className={`text-center bg-mainDisabled`}
                disabled
              />
            </div>
          </div>
          <div className="flex items-end justify-end mt-8">
            <Button
              action={() => {
                if (values.branch_id == 0) {
                  notify("info", `${t("you should select branch")}`);
                  return;
                }

                mutate({
                  endpointName: "/attachment/api/v1/test",
                  values: {
                    id: values.id,
                    branch_id: values.branch_id,
                    product_name: values.product_name,
                    quantity: values.quantity,
                    discound: values.discound,
                    price: values?.price,
                    tax: values.tax,
                    tax_percent: values.tax,
                    total: values.total,
                  },
                });

                resetForm();
              }}
              className=""
            >
              {t("confirm")}
            </Button>
          </div>

          <div className="w-full flex items-center justify-center my-16">
            {responseSellingData?.qr_code && (
              <div>
                <QRCode value={responseSellingData?.qr_code} />
              </div>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ZakatIncomeDemo;
