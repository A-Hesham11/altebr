///
/////////// IMPORTS
///
import { t } from "i18next";
import { useFetch } from "../../../../../hooks";
import { SelectOption_TP } from "../../../../../types";
import { Select } from "../../../../molecules";
import { CreateClassification } from "../create/CreateClassification";

///
/////////// Types
///
type SelectClassification_TP = {
  name: string;
  label?: string;
  field: "id" | "value";
};

const SelectClassification = ({
  name,
  field,
  label,
  disabled,
}: SelectClassification_TP) => {
  ///
  /////////// CUSTOM HOOKS
  ///
  const { data: classifications, isLoading: classificationLoading } = useFetch<
    SelectOption_TP[]
  >({
    endpoint: "classification/api/v1/classifications?per_page=10000",
    queryKey: ["classifications"],
    select: (classifications) => {
      return classifications.map((classification) => ({
        id: classification.id,
        label: classification.name,
        value: classification.name,
      }));
    },
  });

  return (
    <Select
      id="select_classifications"
      label={label}
      name={name}
      placeholder={`${t("classifications")}`}
      loadingPlaceholder={`${t("Loading...")}`}
      options={classifications}
      creatable
      fieldKey={field}
      CreateComponent={CreateClassification}
      loading={classificationLoading}
      isDisabled={disabled}
    />
  );
};

export default SelectClassification;
