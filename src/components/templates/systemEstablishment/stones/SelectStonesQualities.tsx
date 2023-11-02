/////////// IMPORTS
///
import { t } from "i18next"
import { useFetch } from "../../../../hooks"
import { SelectOption_TP } from "../../../../types"
import { HandleBackErrors } from "../../../../utils/utils-components/HandleBackErrors"
import { Button } from "../../../atoms"
import { InnerFormLayout, OuterFormLayout, Select } from "../../../molecules"
import StonesQualities from "../hashim/StonesQualities"

///
/////////// Types
type StonesQualitiesProps = {
  name: string
}

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const SelectStonesQualities = ({ name }: StonesQualitiesProps) => {
  /////////// VARIABLES
  ///


  ///
  /////////// CUSTOM HOOKS
  ///
  const { data: qualityOptions, isLoading: qualityLoading } = useFetch<
    SelectOption_TP[]
  >({
    endpoint: "/stones/api/v1/qualities",
    queryKey: ["StonesQualities"],
    select: (Qualities) =>
      Qualities.map((quality) => {
        return {
          id: quality.id,
          value: quality.name,
          label: quality.name,
          name: quality.name,
        }
      }),
  })
  console.log(
    "🚀 ~ file: SelectStonesQualities.tsx:31 ~ SelectStonesQualities ~ qualityOptions:",
    qualityOptions
  )

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
                id="StonesQualities"
                label={`${t("enter stone quality")}`}
                name={name}
                placeholder={`${t("stone quality")}`}
                loadingPlaceholder={`${t("loading")}`}
                options={qualityOptions}
                loading={qualityLoading}
                creatable
                CreateComponent={StonesQualities}
                fieldKey="id"
              />
            </div>
      </HandleBackErrors>
    </>
  )
}
