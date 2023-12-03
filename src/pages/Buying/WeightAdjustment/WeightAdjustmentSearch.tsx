import React from "react";
import { Button } from "../../../components/atoms";
import {
  BaseInputField,
  DateInputField,
  Select,
} from "../../../components/molecules";

import { t } from "i18next";
import SelectKarat from "../../../components/templates/reusableComponants/karats/select/SelectKarat";

const WeightAdjustmentSearch = () => {
  return (
    <div>
      <div className="py-2 flex-col flex">
        <h3 className="mb-6 text-xl font-bold text-slate-700">
          {t("search filter")}
        </h3>
        <div className="grid grid-cols-1 items-end md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 ">
          <BaseInputField
            id="invoice_number"
            label={`${t("invoice number")}`}
            name="invoice_number"
            type="text"
            placeholder={`${t("invoice number")}`}
          />
          <div className="">
            <SelectKarat
              field="id"
              name="karat_id"
              label={`${t("karat")}`}
              noMb
            />
          </div>
          <DateInputField
            label={`${t("invoice date")}`}
            placeholder={`${t("invoice date")}`}
            name="invoice_date"
            labelProps={{ className: "mt--10" }}
          />

          <Button type="submit" className="bg-mainOrange text-white w-max">
            بحث
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WeightAdjustmentSearch;
