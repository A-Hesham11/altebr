import { Form, Formik } from "formik";
import { t } from "i18next";
import {
  BaseInputField,
  Select,
} from "../../../components/molecules";
import { Button } from "../../../components/atoms";
import { SelectBranches } from "../../../components/templates/reusableComponants/branches/SelectBranches";

const BranchBondsSearch = ({ getSearchResults }) => {
  const initailSearchValues = {
    id: "",
    bond_type: "",
    branch_id: "",
  };

  const bondTypeOption = [
    { id: 25, label: "توريد عادي", name: "توريد عادي", value: "توريد عادي" },
  ];

  return (
    <div className="py-10 flex-col flex">
      <h2 className="mb-6 text-xl font-bold text-slate-700">
        {t("search filter")}
      </h2>
      <Formik
        initialValues={initailSearchValues}
        onSubmit={(values) => {
          getSearchResults(values);
        }}
      >
        <Form>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-end gap-8 ">
            <BaseInputField
              id="bond_number"
              label={`${t("bond number")}`}
              name="id"
              type="text"
              placeholder={`${t("bond number")}`}
            />
            <div className="">
              <Select
                id="bond_type"
                label={`${t("bond type")}`}
                name="bond_type"
                placeholder={`${t("bond type")}`}
                loadingPlaceholder={`${t("loading")}`}
                options={bondTypeOption}
              />
            </div>
            <div className="">
              <SelectBranches name="branch_id" />
            </div>
            <Button type="submit" className="bg-mainGreen text-white w-max">
              بحث
            </Button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default BranchBondsSearch;
