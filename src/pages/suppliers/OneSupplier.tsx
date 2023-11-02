/////////// IMPORTS
///
import { t } from "i18next"
import { Helmet } from "react-helmet-async"
import { useNavigate, useParams } from "react-router-dom"
import blankPerson from "../../assets/blank-person-image.png"
import { Button } from "../../components/atoms"
import {
  InnerFormLayout,
  Modal,
  OuterFormLayout,
} from "../../components/molecules"
import { Loading } from "../../components/organisms/Loading"
import { TextLine } from "../../components/templates/employee/TextLine"
import { useFetch } from "../../hooks"
import { formatDate } from "../../utils/date"
import { useState } from "react"
import { FilesPreviewOutFormik } from "../../components/molecules/files/FilesPreviewOutFormik"
import { FaCity, FaHome } from "react-icons/fa"
import { BiStreetView } from "react-icons/bi"
import { TbHomeHand } from "react-icons/tb"
import { AiOutlineFieldNumber } from "react-icons/ai"
import { BsCalendarDate, BsMailbox } from "react-icons/bs"
import { GrDocument, GrDocumentTest, GrDocumentText } from "react-icons/gr"
import { MdEditDocument } from "react-icons/md"
///
/////////// Types
///
type OneSupplierProps_TP = {
  title?: string
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const OneSupplier = ({ title }: OneSupplierProps_TP) => {
  /////////// VARIABLES
  ///
  const { supplierID } = useParams()
  console.log(
    "🚀 ~ file: OneSupplier.tsx:20 ~ OneSupplier ~ supplierID:",
    supplierID
  )
  const navigate = useNavigate()
  ///

  /////////// CUSTOM HOOKS
  ///
  const {
    data: supplier,
    isSuccess,
    isLoading,
  } = useFetch<any>({
    endpoint: `supplier/api/v1/suppliers/${supplierID}`,
    queryKey: ["suppliers", supplierID!],
  })
  console.log(
    "🚀 ~ file: OneSupplier.tsx:39 ~ OneSupplier ~ supplier:",
    supplier
  )

  /////////// STATES
  ///
  const [documentOpen, setDocumentOpen] = useState(false)

  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  if (isLoading)
    return (
      <Loading
        mainTitle={`${t("supplier data is loading")}`}
        subTitle={`${t("loading")}`}
      />
    )
  ///
  return (
    <>
      <Helmet>
        {/* supplier name */}
        <title>{supplier?.name || "معلومات مورد"}</title>
      </Helmet>
      <OuterFormLayout
        header={`${t("view details")}`}
        leftComponent={
          <Button action={() => navigate(-1)} bordered>
            {t("Back")}
          </Button>
        }
      >
        <InnerFormLayout
          title={
            <div className="flex gap-4">
              <p>بيانات</p>
              <p className=" text-mainGreen">{supplier?.name}</p>
            </div>
          }
        >
          {isSuccess && (
            <>
              {/* Right column */}
              <div className="flex gap-4 flex-col col-span-4 m-auto">
                <img
                  src={supplier.logo || blankPerson}
                  alt={`supplier ${supplier.name}`}
                  className="w-[7rem] h-[7rem] rounded-full"
                />
              </div>

              {/* The rest */}
              <div className="flex gap-4 flex-col col-span-2">
                <h2 className="text-mainOrange font-bold border-b-2 border-[#5F5F5F] w-[30%] p-1">
                  البيانات الشخصية :
                </h2>
                <div className="flex gap- flex-col">
                  {supplier.name && (
                    <TextLine
                      boldText={t("Name")}
                      lightString={supplier.name}
                    />
                  )}
                </div>
                <div className="flex gap- flex-col">
                  {supplier.email && (
                    <TextLine
                      boldText={t("email")}
                      lightString={supplier.email}
                    />
                  )}
                </div>
                <div className="flex gap- flex-col">
                  {supplier.phone && (
                    <TextLine
                      boldText={t("phone number")}
                      lightString={supplier.phone}
                    />
                  )}
                </div>
                <div className="flex gap- flex-col">
                  {supplier.company_name && (
                    <TextLine
                      boldText={t("company_name")}
                      lightString={supplier.company_name}
                    />
                  )}
                </div>
                <div className="flex gap- flex-col">
                  {supplier.national_number && (
                    <TextLine
                      boldText={t("national number")}
                      lightString={supplier.national_number}
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-4 flex-col col-span-2 px-4 border-r-2 border-[#5F5F5F33]">
                <h2 className="text-mainOrange font-bold border-b-2 border-[#5F5F5F] w-[30%] p-1">
                  البيانات العامة :
                </h2>
                <div className="flex gap- flex-col">
                  {supplier.country.name && (
                    <TextLine
                      boldText={t("country_name")}
                      lightString={supplier.country.name}
                    />
                  )}
                </div>
                <div className="flex gap- flex-col">
                  {supplier.type && (
                    <TextLine
                      boldText={t("type")}
                      lightString={supplier.type}
                    />
                  )}
                </div>
                <div className="flex gap- flex-col">
                  {supplier.national_expire_date && (
                    <TextLine
                      boldText={t("hiring date")}
                      lightString={formatDate(
                        new Date(supplier.national_expire_date)
                      )}
                    />
                  )}
                </div>
                <div className="flex gap- flex-col">
                  {supplier.tax && (
                    <TextLine
                      boldText={t("tax number")}
                      lightString={supplier.tax}
                    />
                  )}
                </div>
                <div className="flex gap- flex-col">
                  {supplier.address && (
                    <TextLine
                      boldText={t("address")}
                      lightString={supplier.address}
                    />
                  )}
                </div>
                <div className="flex gap- flex-col">
                  {supplier.logo ? (
                    <div className="flex items-center gap-1">
                      <p className="mt-1">{t("media")} : </p>
                      <FilesPreviewOutFormik
                        preview={true}
                        images={[
                          {
                            path: supplier.logo,
                            type: "image",
                          },
                        ]}
                      />
                    </div>
                  ) : (
                    "لايوجد وسائظ"
                  )}
                </div>
              </div>

              <Modal isOpen={documentOpen} onClose={setDocumentOpen}>
                {supplier?.document?.map((doc, i) => (
                  <>
                    <div className="flex gap-4 flex-col col-span-4 border-b-2 border-dashed mt-3  justify-center align-middle">
                      <div className=" flex items-center justify-center ">
                        <div className="py-2 px-5 rounded-lg  bg-mainGreen  bg-opacity-10 border border-dashed border-gray-400">
                          <p className=" text-lg font-bold text-mainGreen">
                            {t(`document`)} {i + 1}
                          </p>
                        </div>
                      </div>
                      <div className="bg-flatWhite rounded-lg p-4 mt-5 grid justify-center grid-cols-3 col-span-4 gap-x-4 gap-y-8 relative   ">
                        <div className="flex gap-4 flex-col">
                          {doc.data?.docType?.label && (
                            <div className="flex align-middle gap-2">
                              <GrDocument className="w-[20px] h-[20px] text-[#A0A0A0]" />
                              <TextLine
                                boldText={t("document type")}
                                lightString={doc.data?.docType?.label}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 flex-col">
                          {doc.data?.docName && (
                            <div className="flex align-middle gap-2">
                              <GrDocumentText className="w-[20px] h-[20px] text-[#A0A0A0]" />
                              <TextLine
                                boldText={t("document name")}
                                lightString={doc.data?.docName}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 flex-col  ">
                          {doc.data?.docNumber && (
                            <div className="flex align-middle gap-2">
                              <MdEditDocument className="w-[20px] h-[20px] text-[#A0A0A0]" />
                              <TextLine
                                boldText={t("document number")}
                                lightString={doc.data?.docNumber}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 flex-col  ">
                          {doc.data?.endDate && (
                            <div className="flex align-middle gap-2">
                              <BsCalendarDate className="w-[20px] h-[20px] text-[#A0A0A0]" />
                              <TextLine
                                boldText={t("document endDate")}
                                lightString={formatDate(
                                  new Date(doc.data?.endDate)
                                )}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 flex-col">
                          {doc.data?.reminder && (
                            <div className="flex align-middle gap-2">
                              <GrDocumentTest className="w-[20px] h-[20px] text-[#A0A0A0]" />
                              <TextLine
                                boldText={t("reminder days count")}
                                lightString={doc.data?.reminder}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <p className="mt-1">{t("media")} : </p>
                          <div className="flex gap-4 flex-col">
                            {doc?.files && (
                              <FilesPreviewOutFormik
                                preview={true}
                                images={doc.files}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </Modal>
              {/* الوثائق */}
              {supplier?.document.length !== 0 && (
                <div className="flex justify-between gap-4 col-span-4 align-center items-center">
                  <h3 className="font-extrabold text-2xl">
                    {t("main documents")}
                  </h3>
                  {supplier?.document?.length > 2 && (
                    <Button
                      className="mb-3"
                      action={() => setDocumentOpen(true)}
                    >
                      {t("view all documents")}
                    </Button>
                  )}
                </div>
              )}
              {supplier.document.length !== 0 ? (
                supplier?.document?.slice(0, 2).map((doc, i) => (
                  <>
                    <div className="flex gap-4 flex-col col-span-4 border-b-2 border-dashed  justify-center align-middle">
                      <div className=" flex items-center justify-center mb-8">
                        <div className="py-2 px-5 rounded-lg  bg-mainGreen  bg-opacity-10 border border-dashed border-gray-400">
                          <p className=" text-lg font-bold text-mainGreen">
                            {t(`document`)} {i + 1}
                          </p>
                        </div>
                      </div>
                      <div className="bg-flatWhite rounded-lg p-4 mt-5 grid justify-center grid-cols-3 col-span-4 gap-x-4 gap-y-8 relative   ">
                        <div className="flex gap-4 flex-col">
                          {doc.data?.docType?.label && (
                            <div className="flex align-middle gap-2">
                              <GrDocument className="w-[20px] h-[20px] text-[#A0A0A0]" />
                              <TextLine
                                boldText={t("document type")}
                                lightString={doc.data?.docType?.label}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 flex-col">
                          {doc.data?.docName && (
                            <div className="flex align-middle gap-2">
                              <GrDocumentText className="w-[20px] h-[20px] text-[#A0A0A0]" />
                              <TextLine
                                boldText={t("document name")}
                                lightString={doc.data?.docName}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 flex-col  ">
                          {doc.data?.docNumber && (
                            <div className="flex align-middle gap-2">
                              <MdEditDocument className="w-[20px] h-[20px] text-[#A0A0A0]" />
                              <TextLine
                                boldText={t("document number")}
                                lightString={doc.data?.docNumber}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 flex-col  ">
                          {doc.data?.endDate && (
                            <div className="flex align-middle gap-2">
                              <BsCalendarDate className="w-[20px] h-[20px] text-[#A0A0A0]" />
                              <TextLine
                                boldText={t("document endDate")}
                                lightString={formatDate(
                                  new Date(doc.data?.endDate)
                                )}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 flex-col">
                          {doc.data?.reminder && (
                            <div className="flex align-middle gap-2">
                              <GrDocumentTest className="w-[20px] h-[20px] text-[#A0A0A0]" />
                              <TextLine
                                boldText={t("reminder days count")}
                                lightString={doc.data?.reminder}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <p className="mt-1">{t("media")} : </p>
                          <div className="flex gap-4 flex-col">
                            {doc?.files && (
                              <FilesPreviewOutFormik
                                preview={true}
                                images={doc.files}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ))
              ) : (
                <div className="flex justify-center gap-4 col-span-4 align-center items-center">
                  <h3 className="font-extrabold text-2xl">
                    {t("no documents")}
                  </h3>
                </div>
              )}

              {/* العنوان الوطني */}

              <>
                <div className="bg-flatWhite rounded-lg p-4 grid justify-center grid-cols-3 col-span-4 gap-x-4 gap-y-8 relative  border-t-2 border-[#5F5F5F33]">
                  <div className="flex gap-4 flex-col col-span-4">
                    <h3 className="font-extrabold text-2xl">
                      {" "}
                      {t("national Address")}{" "}
                    </h3>
                  </div>
                  <div className="bg-flatWhite rounded-lg p-4 grid justify-center grid-cols-3 col-span-4 gap-x-4 gap-y-8 relative">
                    <div className="flex gap-4 flex-col">
                      {supplier.nationalAddress?.city.name && (
                        <div className="flex align-middle gap-2">
                          <FaCity className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("city")}
                            lightString={supplier.nationalAddress?.city.name}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {supplier.nationalAddress?.city.country_name && (
                        <div className="flex align-middle gap-2">
                          <FaCity className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("country")}
                            lightString={
                              supplier.nationalAddress?.city.country_name
                            }
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {supplier.nationalAddress?.district.name && (
                        <div className="flex align-middle gap-2">
                          <FaCity className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("district")}
                            lightString={
                              supplier.nationalAddress?.district.name
                            }
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {supplier.nationalAddress?.address && (
                        <div className="flex align-middle gap-2">
                          <FaHome className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("short address")}
                            lightString={supplier.nationalAddress?.address}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {supplier.nationalAddress?.street_number && (
                        <div className="flex align-middle gap-2">
                          <BiStreetView className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("street number")}
                            lightString={
                              supplier.nationalAddress?.street_number
                            }
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {supplier.nationalAddress?.building_number && (
                        <div className="flex align-middle gap-2">
                          <TbHomeHand className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("building number")}
                            lightString={
                              supplier.nationalAddress?.building_number
                            }
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {supplier.nationalAddress?.sub_number && (
                        <div className="flex align-middle gap-2">
                          <AiOutlineFieldNumber className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("sub number")}
                            lightString={supplier.nationalAddress?.sub_number}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {supplier.nationalAddress?.zip_code && (
                        <div className="flex align-middle gap-2">
                          <BsMailbox className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("zip code")}
                            lightString={supplier.nationalAddress?.zip_code}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            </>
          )}
        </InnerFormLayout>
      </OuterFormLayout>
    </>
  )
}
