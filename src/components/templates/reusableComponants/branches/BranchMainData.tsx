/////////// IMPORTS
///
import { useFormikContext } from "formik"
import { t } from "i18next"
import { useEffect } from "react"
import {
    BaseInputField,
    InnerFormLayout,
    OuterFormLayout
} from "../../../molecules"
import { NationalAddress } from "../../NationalAddress"
import { Documents } from "../../reusableComponants/documents/Documents"
import { Country_city_distract_markets } from "../Country_city_distract_markets"
import { Button } from "../../../atoms"
///
/////////// Types
///
type BranchMainDataProps_TP = {
  title: string
  editData:any
  isLoading?: any
  isSuccessPost?: any
  restData?: any
  setDocsFormValues?: any
  docsFormValues?: any
  setModalOpen?: any
  modalOpen?: any
}
/////////// HELPER VARIABLES & FUNCTIONS
///
///
export const BranchMainData = ({
  title,
  editData,
  isLoading,
  isSuccessPost,
  restData,
  setDocsFormValues,
  docsFormValues,
  setModalOpen,
  modalOpen,
}: BranchMainDataProps_TP) => {

  /////////// VARIABLES
  /////

  ///
  /////////// CUSTOM HOOKS
  ///
  const { values, setFieldValue, resetForm } = useFormikContext()
  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  useEffect(() => {
    if (isSuccessPost) {
      if (!editData) {
        restData()
        resetForm()
        setFieldValue("date_of_birth", new Date())
        setFieldValue("national_expire_date", new Date())
        setDocsFormValues([])
      }
    }
  }, [isSuccessPost])
  ///
  return (
    <>
      <OuterFormLayout
        header={title}
        submitComponent={
          <Button type="submit" className="mr-auto mt-8" loading={isLoading}>
            {t("submit")}
          </Button>
        }
      >
        <InnerFormLayout title={t("main data")}>
          {/* branch name  start */}
          <div className="col-span-1">
            <BaseInputField
              id="name_ar"
              label={`${t("branch name in arabic")}`}
              name="name_ar"
              type="text"
              placeholder={`${t("branch name in arabic")}`}
              defaultValue={editData && editData.name_ar}
            />
          </div>
          <div className="col-span-1">
            <BaseInputField
              id="name_en"
              label={`${t("branch name in english")}`}
              name="name_en"
              type="text"
              placeholder={`${t("branch name in english")}`}
              defaultValue={editData && editData.name_en}
            />
          </div>
          {/* branch name  end */}

          {/* branch number  start */}
          <div className="col-sapn-1">
            <BaseInputField
              id="number"
              label={`${t("branch number")}`}
              name="number"
              type="text"
              placeholder={`${t("branch number")}`}
              defaultValue={editData && editData.number}
            />
          </div>
          {/* branch number  end */}
          {/* market  start */}
          <Country_city_distract_markets
            countryName="country_id_out"
            cityName="city_id_out"
            distractName="district_id_out"
            marketName="market_id"
            countryLabel={`${t("country")}`}
            cityLabel={`${t("city")}`}
            distractLabel={`${t("district")}`}
            marketLabel={`${t("markets")}`}
            isSuccessPost={isSuccessPost}
            resetSelect={restData}
            editData={editData 
              ? ({
                  nationalAddress: {
                    country: {
                      id: editData?.country?.id,
                      name: editData?.country?.name,
                    },
                    city: {
                      id: editData?.city.id,
                      name: editData?.city.name,
                    },
                    district: {
                      id: editData?.district.id,
                      name: editData?.district.name,
                    },
                    market: {
                      id: editData?.market.id,
                      name: editData?.market.name,
                    },
                  },
                })
              : undefined
            }
            // editData={{
            //   nationalAddress: {
            //     country: {
            //       id: editData?.country?.id,
            //       name: editData?.country?.name,
            //     },
            //     city: {
            //       id: editData?.city.id,
            //       name: editData?.city.name,
            //     },
            //     district: {
            //       id: editData?.district.id,
            //       name: editData?.district.name,
            //     },
            //     market: {
            //       id: editData?.market.id,
            //       name: editData?.market.name,
            //     },
            //   },
            // }}
          />
          {/* market  end */}

          {/* market number start */}
          <div className="col-span-1">
            <BaseInputField
              id="market_number"
              label={`${t("market number")}`}
              name="market_number"
              type="number"
              placeholder={`${t("market number")}`}
              defaultValue={editData && editData?.market_number}
            />
          </div>
          {/* market number  end */}

          {/* address start */}
          <div className="col-span-1">
            <BaseInputField
              id="address"
              label={`${t("address")}`}
              name="main_address"
              type="text"
              placeholder={`${t("address")}`}
              defaultValue={editData && editData?.nationalAddress?.address}
            />
          </div>
          {/* address  end */}

          {/* phone start */}
          <div className="col-span-1">
            <BaseInputField
              id="phone"
              label={`${t("phone")}`}
              name="phone"
              type="text"
              placeholder={`${t("phone")}`}
              defaultValue={editData && editData?.phone}
            />
          </div>
          {/* phone end */}

          {/* fax start */}
          <div className="col-span-1">
            <BaseInputField
              id="fax"
              label={`${t("fax")}`}
              name="fax"
              type="text"
              placeholder={`${t("fax")}`}
              defaultValue={editData && editData.fax}
            />
          </div>
          {/* fax end */}
        </InnerFormLayout>
        <Documents
          docsFormValues={docsFormValues}
          setDocsFormValues={setDocsFormValues}
          editable={!!editData}
        />
        <NationalAddress editData={editData} />
      </OuterFormLayout>
    </>
  )
}
