/////////// IMPORTS
///
//import classes from './OneBranches.module.css'
import { t } from "i18next"
import { Helmet } from "react-helmet-async"
import { useNavigate, useParams } from "react-router-dom"
import { useFetch, useIsRTL } from "../../../../hooks"
import { Button } from "../../../atoms"
import { Header } from "../../../atoms/Header"
import { InnerFormLayout, Modal, OuterFormLayout } from "../../../molecules"
import { Loading } from "../../../organisms/Loading"
import { Branch_Props_TP } from "./ViewBranches"
import { TextLine } from "../../employee/TextLine"
import { FilesPreviewOutFormik } from "../../../molecules/files/FilesPreviewOutFormik"
import {
  BsCalendarDate,
  BsFillPersonFill,
  BsFillPersonVcardFill as BsFillPersonCardFill,
  BsMailbox,
} from "react-icons/bs"
import { MdEditDocument, MdEmail, MdQueryBuilder } from "react-icons/md"
import { AiFillPhone, AiOutlineFieldNumber } from "react-icons/ai"
import { FaCity } from "react-icons/fa"
import { BiBuildingHouse, BiStreetView } from "react-icons/bi"
import { TbBuilding, TbHomeHand } from "react-icons/tb"
import {
  HiOutlineBuildingStorefront,
  HiOutlineDocumentDuplicate,
} from "react-icons/hi2"
import { HiOutlineDocumentReport } from "react-icons/hi2"
import { useState } from "react"
import { formatDate } from "../../../../utils/date"

///
/////////// Types
///

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const OneBranches = ({ title = "branch" }) => {
  /////////// VARIABLES
  ///
  const { branchesID } = useParams()
  const navigate = useNavigate()
  ///
  /////////// CUSTOM HOOKS
  ///
  const isRTL = useIsRTL()
  const [documentOpen, setDocumentOpen] = useState(false)

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
  const { data, isSuccess, isLoading, isError, error } =
    useFetch<Branch_Props_TP>({
      endpoint: `/branch/api/v1/branches/${branchesID}`,
      queryKey: ["branches", branchesID!],
    })

  ///
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {isError && (
        <div className=" m-auto">
          <Header
            className="text-center text-2xl font-bold"
            header={t(`some thing went wrong ${error.response.data.message}`)}
          />
        </div>
      )}
      {isLoading && (
        <Loading
          subTitle={`${t("loading")}`}
          mainTitle={`${t("branches data are loading")}`}
        />
      )}
      {isSuccess && !isLoading && (
        <OuterFormLayout
          header={`${t("view details")}`}
          leftComponent={
            <Button action={() => navigate(-1)} bordered>
              {t("Back")}
            </Button>
          }
        >
          <InnerFormLayout title={data?.name_ar}>
            {/*  البيانات الشخصية  */}
            <div className="flex gap-4 flex-col col-span-2">
              <h2 className="text-mainOrange font-bold border-b-2 border-gray-600 w-1/3 p-1">
                البيانات الشخصية :
              </h2>{" "}
              <div className="flex items-center gap-2">
                <BsFillPersonFill className="w-5 h-5 text-gray-400" />
                <TextLine
                  boldText={t("arabic name")}
                  lightString={data?.name_ar}
                />{" "}
              </div>
              <div className="flex items-center gap-2">
                <BsFillPersonFill className="w-5 h-5 text-gray-400" />
                <TextLine
                  boldText={t("english name")}
                  lightString={data?.name_en}
                />{" "}
              </div>
              <div className="flex items-center gap-2">
                <BsFillPersonCardFill className="w-5 h-5 text-gray-400" />
                <TextLine boldText={t("address")} lightString={data?.address} />
              </div>
              <div className="flex items-center gap-2">
                <AiFillPhone className="w-5 h-5 text-gray-400" />
                <TextLine boldText={t("phone")} lightString={data?.phone} />
              </div>
            </div>
            {/*     البيانات العامة : */}
            <div className="flex gap-4 flex-col col-span-2 px-4 border-r-2 border-gray-600">
              <h2 className="text-mainOrange font-bold border-b-2 border-gray-600 w-1/3 p-1">
                البيانات العامة :
              </h2>
              <div className="flex items-center gap-2">
                <FaCity className="w-5 h-5 text-gray-400" />{" "}
                <TextLine
                  boldText={t("country")}
                  lightString={
                    isRTL ? data?.country.name_ar : data?.country.name_en
                  }
                />{" "}
              </div>
              <div className="flex items-center gap-2">
                <BiBuildingHouse className="w-5 h-5 text-gray-400" />{" "}
                <TextLine
                  boldText={t("city")}
                  lightString={isRTL ? data?.city.name_ar : data?.city.name_en}
                />{" "}
              </div>
              <div className="flex items-center gap-2">
                <TbBuilding className="w-5 h-5 text-gray-400" />{" "}
                <TextLine
                  boldText={t("district")}
                  lightString={
                    isRTL ? data?.district.name_ar : data?.district.name_en
                  }
                />{" "}
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineBuildingStorefront className="w-5 h-5 text-gray-400" />{" "}
                <TextLine
                  boldText={t("market")}
                  lightString={
                    isRTL ? data?.market.name_ar : data?.market.name_en
                  }
                />{" "}
              </div>
              <div className="flex items-center gap-2">
                <AiFillPhone className="w-5 h-5 text-gray-400" />
                <TextLine
                  boldText={t("branch number")}
                  lightString={data?.number}
                />
              </div>
              <div className="flex items-center gap-2">
                <AiOutlineFieldNumber className="w-5 h-5 text-gray-400" />{" "}
                <TextLine
                  boldText={t("market number")}
                  lightString={data?.market_number}
                />{" "}
              </div>
            </div>

            <div className=" col-span-4 border border-dashed"></div>
            <div className="flex justify-between gap-4 col-span-4 align-center items-center mt-5">
              {" "}
              <Header
                className=" col-span-4 text-center capitalize font-extrabold text-2xl"
                header={`${t("main documents")} : `}
              />
              {data?.document.length > 2 && (
                <Button className="mb-3" action={() => setDocumentOpen(true)}>
                  {t("view all documents")}
                </Button>
              )}{" "}
            </div>
            <Modal isOpen={documentOpen} onClose={setDocumentOpen}>
              {data?.document?.map((doc, i) => (
                <>
                  <div className="flex gap-4 flex-col col-span-4 border-b-2 border-dashed mt-3  justify-center items-center">
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
                          <div className="flex items-center gap-2">
                            <HiOutlineDocumentDuplicate className="w-[20px] h-[20px] text-[#A0A0A0]" />
                            <TextLine
                              boldText={t("document type")}
                              lightString={doc.data?.docType?.label}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-4 flex-col">
                        {doc.data?.docName && (
                          <div className="flex items-center gap-2">
                            <HiOutlineDocumentDuplicate className="w-[20px] h-[20px] text-[#A0A0A0]" />
                            <TextLine
                              boldText={t("document name")}
                              lightString={doc.data?.docName}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-4 flex-col  ">
                        {doc.data?.docNumber && (
                          <div className="flex items-center gap-2">
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
                          <div className="flex items-center gap-2">
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
                          <div className="flex items-center gap-2">
                            <MdQueryBuilder className="w-[20px] h-[20px] text-[#A0A0A0]" />
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
            {data?.document.length > 0 ? (
              data?.document?.slice(0, 2).map((doc, i) => (
                <div className="flex gap-4 flex-col col-span-4  mt-3 p-3 ">
                  <div className=" flex items-center justify-center mb-8">
                    <div className="py-2 px-5 rounded-lg  bg-mainGreen  bg-opacity-10 border border-dashed border-gray-400">
                      <p className=" text-lg font-bold text-mainGreen">
                        {t(`document`)} {i + 1}
                      </p>
                    </div>
                  </div>
                  <div className="bg-flatWhite rounded-lg p-4 mt-5 grid justify-center grid-cols-3 col-span-4  relative   ">
                    <div className="flex items-center gap-2">
                      <HiOutlineDocumentDuplicate className="w-5 h-5 text-gray-400 " />
                      <TextLine
                        boldText={t("document name")}
                        lightString={doc.data.docName}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <MdEditDocument className="w-5 h-5 text-gray-400 " />{" "}
                      <TextLine
                        boldText={t("document number")}
                        lightString={doc.data.docNumber}
                      />{" "}
                    </div>
                    <div className="flex items-center gap-2">
                      <BsCalendarDate className="w-5 h-5 text-gray-400 " />{" "}
                      <TextLine
                        containerClasses="col-span-2 !w-full"
                        boldText={t("end date")}
                        lightString={doc.data.endDate}
                      />{" "}
                    </div>
                    <div className="flex items-center gap-2">
                      <MdQueryBuilder className="w-5 h-5 text-gray-400 " />{" "}
                      <TextLine
                        boldText={t("reminder days count")}
                        lightString={doc.data.reminder}
                      />{" "}
                    </div>
                    <div className="flex items-center gap-2">
                      <HiOutlineDocumentDuplicate className="w-5 h-5 text-gray-400 " />
                      <TextLine
                        boldText={t("document type")}
                        lightString={doc.data.docType.label}
                      />{" "}
                    </div>
                    {doc.files?.length !== 0 ? (
                      <div className="flex items-center">
                        <p>{t("media")} : </p>
                        <FilesPreviewOutFormik images={doc?.files} />
                      </div>
                    ) : (
                      <div className="flex justify-center gap-4 col-span-4 align-center items-center">
                        <h3 className="font-bold text-lg">{t("no media")}</h3>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <Header
                className=" col-span-4 text-center capitalize"
                header={t("no documents")}
              />
            )}
            {/* العنوان الوطني */}
            <div className=" col-span-4 border border-dashed"></div>
            <div className="bg-flatWhite rounded-lg p-4 grid justify-center grid-cols-3 col-span-4 gap-x-4 gap-y-8 relative">
              <Header
                className=" col-span-4  capitalize font-extrabold text-2xl"
                header={`${t("national Address")} : `}
              />{" "}
              <div className="flex items-center gap-2">
                <FaCity className="w-5 h-5 text-gray-400" />
                <TextLine
                  boldText={t("address")}
                  lightString={data?.nationalAddress?.address}
                />{" "}
              </div>
              <div className="flex items-center gap-2">
                <FaCity className="w-5 h-5 text-gray-400" />{" "}
                <TextLine
                  boldText={t("country")}
                  lightString={data?.nationalAddress?.country?.name_ar}
                />{" "}
              </div>
              <div className="flex items-center gap-2">
                <BiBuildingHouse className="w-5 h-5 text-gray-400" />
                <TextLine
                  boldText={t("city")}
                  lightString={data?.nationalAddress?.city?.name_ar}
                />{" "}
              </div>{" "}
              <div className="flex items-center gap-2">
                <TbBuilding className="w-5 h-5 text-gray-400" />
                <TextLine
                  boldText={t("district")}
                  lightString={data?.nationalAddress?.district?.name_ar}
                />{" "}
              </div>
              <div className="flex items-center gap-2">
                <TbHomeHand className="w-5 h-5 text-gray-400" />
                <TextLine
                  boldText={t("street number")}
                  lightString={data?.nationalAddress?.street_number}
                />{" "}
              </div>
              <div className="flex items-center gap-2">
                <BiStreetView className="w-7 h-7 text-gray-400" />{" "}
                <TextLine
                  boldText={t("building number")}
                  lightString={data?.nationalAddress?.building_number}
                />{" "}
              </div>
              <div className="flex items-center gap-2">
                <AiOutlineFieldNumber className="w-7 h-7 text-gray-400" />{" "}
                <TextLine
                  boldText={t("sub number")}
                  lightString={data?.nationalAddress?.sub_number}
                />{" "}
              </div>
              <div className="flex items-center gap-2">
                <BsMailbox className="w-5 h-5 text-gray-400" />{" "}
                <TextLine
                  boldText={t("zip code")}
                  lightString={data?.nationalAddress?.zip_code}
                />{" "}
              </div>
            </div>
          </InnerFormLayout>
        </OuterFormLayout>
      )}
    </>
  )
}
