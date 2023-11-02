/////////// IMPORTS

import { useState } from "react"
import { SingleValue } from "react-select"
import { SelectOption_TP } from "../../../types"
import { Cities } from "./Cities"
import { Countries } from "./Countries"
import { Districts } from "./Districts"
import { Markets } from "./Markets"
//import classes from './Country_city_distract.module.css'
///
/////////// Types
///
type Country_city_distract_markets_TP = {
  countryName?: string
  countryLabel?: string
  countryFieldKey?: "id" | "value" | undefined
  cityName?: string
  cityFieldKey?: "id" | "value" | undefined
  cityLabel?: string
  distractName?: string
  distractFieldKey?: "id" | "value" | undefined
  distractLabel?: string
  marketName?: string
  marketLabel?: string
  editData?: { country_name: string } | {}
  marketFieldKey?: "id" | "value" | undefined
  isSuccessPost?: boolean
  resetSelect?: () => void
  disabled?:boolean
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const Country_city_distract_markets = ({
  countryName = "country_id",
  countryLabel = "country",
  cityName,
  cityLabel,
  distractName,
  distractLabel,
  marketName,
  marketLabel,
  countryFieldKey,
  cityFieldKey,
  distractFieldKey,
  marketFieldKey,
  editData,
  isSuccessPost,
  setEditData,
  resetSelect,
  disabled,
}: Country_city_distract_markets_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///

  ///
  /////////// STATES
  ///
  const [countryObj, setCountry] = useState({ id: "", name: "" })
  const [cityObj, setCityId] = useState<SingleValue<SelectOption_TP>>({
    id: "",
    label: "",
    value: "",
    name: "",
  })
  const [districtObj, setDistrictId] = useState<SingleValue<SelectOption_TP>>({
    id: "",
    label: "",
    value: "",
    name: "",
  })

  ///
  /////////// SIDE EFFECTS
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  ///
  return (
    <>
      <Countries
        setCountry={setCountry}
        countryName={countryName}
        label={countryLabel}
        cityName={cityName}
        distractName={distractName}
        fieldKey={countryFieldKey ? countryFieldKey : "id"}
        editData={editData}
        isSuccessPost={isSuccessPost}
        resetSelect={resetSelect}
        setEditData={setEditData}
        disabled={disabled}
      />
      {cityName && (
        <Cities
          country={countryObj}
          setCityId={setCityId}
          label={cityLabel}
          cityName={cityName}
          distractName={distractName}
          fieldKey={cityFieldKey ? cityFieldKey : "id"}
          editData={editData}
          isSuccessPost={isSuccessPost}
          resetSelect={resetSelect}
          setDistrictId={setDistrictId}
          disabled={disabled}
        />
      )}
      {distractName && (
        <Districts
          city={cityObj}
          setDistrictId={setDistrictId}
          distractName={distractName}
          label={distractLabel}
          marketName={marketName}
          fieldKey={distractFieldKey ? distractFieldKey : "id"}
          editData={editData}
          isSuccessPost={isSuccessPost}
          resetSelect={resetSelect}
        />
      )}
      {marketName && (
        <Markets
          district={districtObj}
          marketName={marketName}
          label={marketLabel}
          fieldKey={marketFieldKey ? marketFieldKey : "id"}
          editData={editData}
        />
      )}
    </>
  )
}
