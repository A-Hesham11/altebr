/////////// IMPORTS
///
//import classes from './SupplierDetails.module.css'
import { t } from "i18next"
import { Helmet } from "react-helmet-async"
import { useNavigate, useParams } from "react-router-dom"
import { useFetch } from "../../../../hooks"
import { supplier } from "../../../../pages/suppliers/AllSuppliers"
import { Button } from "../../../atoms"
import { Header } from "../../../atoms/Header"
import { InnerFormLayout, OuterFormLayout } from "../../../molecules"
import { Loading } from "../../../organisms/Loading"
import { TextLine } from "../../employee/TextLine"
import { formatDate } from "../../../../utils/date"

///
/////////// Types
///

/////////// HELPER VARIABLES & FUNCTIONS
///
type SupplierDetailsProps_TP = {
  title?: string
}

///
export const SupplierDetails = ({ title }: SupplierDetailsProps_TP) => {
  /////////// VARIABLES
  ///
  const { SupplierID } = useParams()
  const navigate = useNavigate()

  ///
  /////////// CUSTOM HOOKS
  ///
  const {
    data: supplier,
    isSuccess,
    isLoading: supplierLoading,
    isFetching
  } = useFetch<supplier>({
    endpoint: `/supplier/api/v1/suppliers/${SupplierID}`,
    queryKey: ["supplier", SupplierID!],
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
  /////////// EVENTS
  ///

  ///
  /////////// FUNCTIONS
  ///
  if (supplierLoading)
    return (
      <Loading
        mainTitle={`${t("loading")}`}
        subTitle={`${t("supplier data is loading")}`}
      />
    )

  ///
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <OuterFormLayout
        header={`${t("view details")}`}
        leftComponent={
          <Button action={() => navigate(-1)} bordered>
            {t("Back")}
          </Button>
        }
      >
        {isSuccess && (
          <InnerFormLayout title={supplier?.name}>
            <div className="   gap-4 p-6 col-span-4 grid grid-cols-3">
              <div className="border-l-2 col-span-1">
                <div className=" flex flex-col gap-4 mb-8">
                  <div className=" w-28  bg-slate-200 p-2 rounded-2xl">
                    <img
                      className=" object-cover"
                      src={supplier?.logo || ""}
                      alt=""
                    />
                  </div>
                  <TextLine boldText={t("Name")} lightString={supplier?.name} />
                  <TextLine
                    boldText={t("company name")}
                    lightString={supplier?.company_name}
                  />
                  <TextLine
                    boldText={t("address")}
                    lightString={supplier?.address}
                  />
                  <TextLine
                    boldText={t("supplier type")}
                    lightString={t(supplier?.type)}
                  />
                  {supplier?.is_mediator && (
                    <TextLine
                      boldText={t("supplier")}
                      lightString={t("mediator")}
                    />
                  )}
                </div>
              </div>
              <div className="col-span-2 ">
                <div className=" flex flex-col gap-4 mb-8 ">
                  {/* التواصل */}
                  <div className=" flex flex-col gap-4  border-b-2 border-dashed p-4">
                    <Header header={t("contact")} />
                    <div className=" flex w-full justify-between items-center">
                      <TextLine
                        boldText={t("phone number")}
                        lightString={supplier?.phone}
                      />
                      <TextLine
                        boldText={t("fax")}
                        lightString={supplier?.fax}
                      />
                      {/* <TextLine
                boldText={t("mobile number")}
                lightString={supplier?.mobile}
            /> */}
                      <TextLine
                        boldText={t("email")}
                        lightString={t(supplier?.email)}
                      />
                    </div>
                  </div>
                  {/* الجنسيه */}
                  <div className=" flex flex-col gap-4 border-b-2 border-dashed p-4">
                    <Header header={t("national")} />
                    <div className=" flex w-full justify-between items-center flex-wrap gap-4 ">
                      <TextLine
                        boldText={t("nationality")}
                        lightString={supplier?.nationality_name}
                      />
                      <TextLine
                        boldText={t("national number")}
                        lightString={supplier?.national_number}
                      />
                      <TextLine
                        boldText={t("national expire date")}
                        lightString={formatDate(
                          new Date(supplier?.national_expire_date)
                        )}
                      />

                      {/* <TextLine
                boldText={t("nationality")}
                lightString={supplier?.nationalAddress?.district.district_name}
            /> */}
                    </div>
                  </div>
                  {/* ألعنوان الوطني */}
                  <div className=" flex flex-col gap-4 border-b-2 border-dashed p-4">
                    <Header header={t("national Address")} />
                    <div className=" flex w-full justify-between items-center flex-wrap gap-4">
                      <TextLine
                        boldText={t("country")}
                        lightString={supplier?.country_name}
                      />
                      <TextLine
                        boldText={t("city")}
                        lightString={supplier?.city_name}
                      />
                      <TextLine
                        boldText={t("street number")}
                        lightString={supplier?.nationalAddress.street_number}
                      />
                      <TextLine
                        boldText={t("building number")}
                        lightString={supplier?.nationalAddress.building_number}
                      />
                      <TextLine
                        boldText={t("sub number")}
                        lightString={supplier?.nationalAddress.sub_number}
                      />
                      <TextLine
                        boldText={t("zip code")}
                        lightString={supplier?.nationalAddress.zip_code}
                      />
                      {/* <TextLine
                boldText={t("nationality")}
                lightString={supplier?.nationalAddress?.district.district_name}
            /> */}
                    </div>
                  </div>
                  {/* <TextLine boldText={t("tax")} lightString={supplier?.tax} /> */}
                  {/* الوثائق */}
                  {supplier?.document.length !== 0 &&
                    supplier?.document.map((doc, i) => (
                      <div className=" flex flex-col gap-4 border-b-2 border-dashed p-4">
                        <Header header={t("documents")} />
                        <div className=" flex items-center justify-center mb-8">
                          <div className="py-2 px-5 rounded-lg  bg-mainGreen  bg-opacity-10 border border-dashed border-gray-400">
                            <p className=" text-lg font-bold text-mainGreen">
                              {t(`document ${i + 1}`)}
                            </p>
                          </div>
                        </div>
                        <div className=" flex w-full justify-between items-center flex-wrap gap-4 ">
                          <TextLine
                            boldText={t("document Name")}
                            lightString={doc?.data?.docName}
                          />
                          <TextLine
                            boldText={t("document Number")}
                            lightString={doc?.data?.docNumber}
                          />
                          <TextLine
                            boldText={t("document Type")}
                            lightString={doc?.data?.docType.label}
                          />
                          <TextLine
                            containerClasses="w-fit "
                            boldText={t("document end Date")}
                            lightString={formatDate(
                              new Date(doc?.data?.endDate)
                            )}
                          />
                          <TextLine
                            boldText={t("document reminder")}
                            lightString={doc?.data?.reminder}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </InnerFormLayout>
        )}
      </OuterFormLayout>
    </>
  )
}
