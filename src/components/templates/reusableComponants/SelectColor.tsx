/////////// IMPORTS
///
import { t } from "i18next";
import { useFetch } from "../../../hooks";
import { SelectOption_TP } from "../../../types";
import { Select } from "../../molecules";
import CreateColor from "./CreateColor";
///
/////////// Types
type SelectColorProps = {
  name: string;
  modalTitle: string;
  label: string;
  multi?: boolean;
  field: "id" | "value";
  onChange?: (option: any) => void;
  value?: any;
};

/////////// HELPER VARIABLES & FUNCTIONS
///

///
const SelectColor = ({
  name,
  modalTitle,
  label,
  field,
  multi,
  onChange,
  value,
}: SelectColorProps) => {
  /////////// VARIABLES
  ///

  const requiredTranslation = () => `${t("required")}`;

  ///
  /////////// CUSTOM HOOKS
  ///
  const { data: colorOptions, isLoading: colorLoading } = useFetch<
    SelectOption_TP[]
  >({
    endpoint: "/stones/api/v1/colors?per_page=10000",
    queryKey: ["colors"],
    select: (colors) =>
      colors.map((color) => {
        return {
          id: color.id,
          value: color.name,
          label: color.name,
          name: color.name,
        };
      }),
  });

  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// IF CASES
  ///

  ///
  /////////// FUNCTIONS & EVENTS
  ///

  ///
  return (
    <Select
      id={name}
      label={label}
      name={name}
      placeholder={`${t("color name")}`}
      loadingPlaceholder={`${t("Loading...")}`}
      options={colorOptions}
      //@ts-ignore
      // onChange={(option: SingleValue<SelectOption_TP>) =>
      //   setFieldValue(name, option?.id)
      // }
      loading={colorLoading}
      isMulti={multi}
      creatable
      modalTitle={modalTitle}
      CreateComponent={CreateColor}
      fieldKey={field}
      onChange={onChange}
      {...{ ...(value && { value }) }}
    />
  );
};

export default SelectColor;
