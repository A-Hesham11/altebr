/////////// IMPORTS
///
import { t } from "i18next"
import { useFetch } from "../../../../hooks"
import { SelectOption_TP } from "../../../../types"
import { HandleBackErrors } from "../../../../utils/utils-components/HandleBackErrors"
import { Button } from "../../../atoms"
import { InnerFormLayout, OuterFormLayout, Select } from "../../../molecules"
import StonesShapes from "../hashim/StonesShapes"

///
/////////// Types
type StoneShapeProps = {
  name: string
}

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const SelectStoneShape = ({ name }: StoneShapeProps) => {
  /////////// VARIABLES
  ///


  ///
  /////////// CUSTOM HOOKS
  ///
  const { data: shapeOptions, isLoading: shapeLoading } = useFetch<
    SelectOption_TP[]
  >({
    endpoint: "stones/api/v1/shapes",
    queryKey: ["stoneShapes"],
    select: (shapes) =>
      shapes.map((shape) => {
        return {
          id: shape.id,
          value: shape.name,
          label: shape.name,
          name: shape.name,
        }
      }),
  })



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
    <>
      <HandleBackErrors>

            <div className="flex flex-col">
              <Select
                id="stoneShape"
                label={`${t("enter stone shape")}`}
                name={name}
                placeholder={`${t("stone shape")}`}
                loadingPlaceholder={`${t("loading")}`}
                options={shapeOptions}
                loading={shapeLoading}
                creatable
                CreateComponent={StonesShapes}
                fieldKey="id"
              />
            </div>
      </HandleBackErrors>
    </>
  )
}
