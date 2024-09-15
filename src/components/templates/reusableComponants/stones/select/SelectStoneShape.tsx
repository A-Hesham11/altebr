///
/////////// IMPORTS
///
import { t } from "i18next";
import { useFetch } from "../../../../../hooks";
import { SelectOption_TP } from "../../../../../types";
import { Select } from "../../../../molecules";
import CreateStoneShape from "../create/CreateStoneShape";

///
/////////// Types
///
type SelectStoneShapeProps_TP = {
  name: string;
  label: string;
  multi: boolean;
  field: "id" | "value";
  onChange?: (option: any) => void;
  value?: any;
};

const SelectStoneShape = ({
  name,
  field,
  label,
  multi,
  onChange,
  value,
}: SelectStoneShapeProps_TP) => {
  ///
  /////////// CUSTOM HOOKS
  ///
  const { data: shapes, isLoading: shapeLoading } = useFetch<SelectOption_TP[]>(
    {
      endpoint: "stones/api/v1/shapes?per_page=10000",
      queryKey: ["stone_shape"],
      select: (shapes) => {
        return shapes.map((shape: any) => ({
          id: shape.id,
          label: shape.name,
          name: shape.name,
          value: shape.name,
        }));
      },
    }
  );

  return (
    <Select
      id="select_shape"
      label={label}
      name={name}
      placeholder={`${t("stones shapes")}`}
      loadingPlaceholder={`${t("Loading...")}`}
      isMulti={multi}
      options={shapes}
      creatable
      fieldKey={field}
      CreateComponent={CreateStoneShape}
      loading={shapeLoading}
      onChange={onChange}
      {...{ ...(value && { value }) }}
    />
  );
};

export default SelectStoneShape;
