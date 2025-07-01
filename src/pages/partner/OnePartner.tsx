/////////// IMPORTS
///
import { t } from "i18next";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import blankPerson from "../../assets/blank-person-image.png";
import { Button } from "../../components/atoms";
import {
  InnerFormLayout,
  Modal,
  OuterFormLayout,
} from "../../components/molecules";
import { TextLine } from "../../components/templates/employee/TextLine";
import { useFetch } from "../../hooks";
import { Employee_TP } from "../employees/employees-types";
import { Loading } from "../../components/organisms/Loading";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Query_TP } from "../coding/gold/AddStone";
import { SelectOption_TP } from "../../types";
import { formatDate } from "../../utils/date";
import { FilesPreviewOutFormik } from "../../components/molecules/files/FilesPreviewOutFormik";
import {
  BsCalendarDate,
  BsFillPersonFill,
  BsFillPersonVcardFill as BsFillPersonCardFill,
  BsMailbox,
} from "react-icons/bs";
import { AiFillPhone, AiOutlineFieldNumber } from "react-icons/ai";
import { TbHomeHand } from "react-icons/tb";
import { BiBuildingHouse, BiStreetView } from "react-icons/bi";
import { FaCity, FaHome } from "react-icons/fa";
import { GrDocument, GrDocumentTest, GrDocumentText } from "react-icons/gr";
import { MdEditDocument, MdEmail, MdQueryBuilder } from "react-icons/md";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
import { HiOutlineDocumentText } from "react-icons/hi2";
///
/////////// Types
///
type OnePartnerProps_TP = {
  title?: string;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const OnePartner = ({ title }: OnePartnerProps_TP) => {
  /////////// VARIABLES
  ///
  const { partnerID } = useParams();
  const [documentOpen, setDocumentOpen] = useState(false);

  const navigate = useNavigate();
  ///
  /////////// CUSTOM HOOKS
  ///

  const {
    data: partner,
    isSuccess,
    isLoading: partnerLoading,
  } = useFetch<any>({
    endpoint: `partner/api/v1/partners/${partnerID}`,
    queryKey: ["partners", partnerID!],
  });

  /////////// STATES
  ///
  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  ///
  return (
    <>
      <Helmet>
        {/* partner name */}
        <title>{partner?.name || "معلومات مورد"}</title>
      </Helmet>
      <OuterFormLayout
        header={`${t("view details")}`}
        leftComponent={
          <Button action={() => navigate(-1)} bordered>
            {t("Back")}
          </Button>
        }
      >
        {partnerLoading && (
          <Loading
            mainTitle={`${t("partner data is loading")}`}
            subTitle={`${t("loading")}`}
          />
        )}
        {isSuccess && (
          <InnerFormLayout
            title={
              <div className="flex gap-4">
                <p>بيانات</p>
                <p className=" text-mainGreen">{partner?.name}</p>
              </div>
            }
          >
            <>
              <div className="flex gap-4 flex-col col-span-4 m-auto">
                <img
                  src={partner.national_image || blankPerson}
                  alt={`partner ${partner.name}`}
                  className="w-[7rem] h-[7rem] rounded-full object-cover"
                />
              </div>
              {/*  البيانات الشخصية  */}
              <div className="flex gap-4 flex-col col-span-2">
                <h2 className="text-mainOrange font-bold border-b-2 border-gray-600 w-[30%] p-1">
                  البيانات الشخصية :
                </h2>

                {partner.name && (
                  <div className="flex items-center gap-2">
                    <BsFillPersonFill className="w-5 h-5 text-gray-400" />
                    <TextLine boldText={t("Name")} lightString={partner.name} />
                  </div>
                )}
                {partner.nationality && (
                  <div className="flex items-center gap-2">
                    <BsFillPersonCardFill className="w-5 h-5 text-gray-400" />
                    <TextLine
                      boldText={t("nationality")}
                      lightString={partner?.nationality?.name}
                    />
                  </div>
                )}

                {partner.phone && (
                  <div className="flex items-center gap-2">
                    <AiFillPhone className="w-5 h-5 text-gray-400" />
                    <TextLine
                      boldText={t("phone number")}
                      lightString={partner?.phone}
                    />
                  </div>
                )}

                {partner?.tax && (
                  <TextLine boldText={t("tax")} lightString={partner?.tax} />
                )}
                {partner?.type && (
                  <TextLine boldText={t("type")} lightString={partner?.type} />
                )}
                {partner?.address && (
                  <TextLine
                    boldText={t("address")}
                    lightString={partner?.address}
                  />
                )}
                {partner?.national_number && (
                  <TextLine
                    boldText={t("national number")}
                    lightString={partner?.national_number}
                  />
                )}
                {partner?.email && (
                  <div className="flex items-center gap-2">
                    <MdEmail className="w-5 h-5 text-gray-400" />
                    <TextLine
                      containerClasses=" !block"
                      boldText={t("email")}
                      lightString={partner?.email}
                    />
                  </div>
                )}
                {partner.national_image ? (
                  <div className="flex items-center gap-1">
                    <p className="mt-1">{t("media")} : </p>
                    <FilesPreviewOutFormik
                      preview={true}
                      images={[
                        {
                          path: partner.national_image,
                          type: "image",
                        },
                      ]}
                    />
                  </div>
                ) : (
                  <div className="flex justify-center gap-4 col-span-4 align-center items-center">
                    <h3 className="font-bold text-lg">{t("no media")}</h3>
                  </div>
                )}
              </div>
              {/*     البيانات العامة : */}
              <div className="flex gap-4 flex-col col-span-2 px-4 border-r-2 border-gray-600">
                <h2 className="text-mainOrange font-bold border-b-2 border-gray-600 w-[30%] p-1">
                  البيانات العامة :
                </h2>
                {partner?.country && (
                  <div className="flex items-center gap-2">
                    <FaCity className="w-5 h-5 text-gray-400" />
                    <TextLine
                      boldText={t("country_name")}
                      lightString={partner?.country.name}
                    />
                  </div>
                )}
                {partner?.city && (
                  <div className="flex items-center gap-2">
                    <BiBuildingHouse className="w-5 h-5 text-gray-400" />
                    <TextLine
                      boldText={t("city_name")}
                      lightString={partner?.city.name}
                    />
                  </div>
                )}
                {partner?.start_date && (
                  <div className="flex items-center gap-2">
                    <BsCalendarDate className="w-5 h-5 text-gray-400" />
                    <TextLine
                      boldText={t("hiring date")}
                      lightString={partner?.start_date}
                    />
                  </div>
                )}
                {partner?.end_date && (
                  <div className="flex items-center gap-2">
                    <BsCalendarDate className="w-5 h-5 text-gray-400" />
                    <TextLine
                      boldText={t("end date")}
                      lightString={partner?.end_date}
                    />
                  </div>
                )}
              </div>
              {/* docs button*/}
              {partner?.document.length !== 0 && (
                <div className="flex justify-between gap-4 col-span-4 align-center items-center mt-5">
                  <h3 className="font-extrabold text-2xl ">
                    {t("main documents")} :
                  </h3>
                  {partner?.document.length > 2 && (
                    <Button
                      className="mb-3"
                      action={() => setDocumentOpen(true)}
                    >
                      {t("view all documents")}
                    </Button>
                  )}
                </div>
              )}
              <Modal isOpen={documentOpen} onClose={setDocumentOpen}>
                {partner?.document?.map((doc, i) => (
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
              {partner.document.length !== 0 ? (
                partner?.document?.slice(0, 2).map((doc, i) => (
                  <>
                    <div className="flex gap-4 flex-col col-span-4 border-t-2 mt-3 p-3  border-dashed">
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
                            <div className="flex items-center gap-2">
                              <HiOutlineDocumentDuplicate className="w-5 h-5 text-gray-400 " />
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
                              <HiOutlineDocumentDuplicate className="w-5 h-5 text-gray-400 " />
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
                              <MdEditDocument className="w-5 h-5 text-gray-400 " />{" "}
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
                              <BsCalendarDate className="w-5 h-5 text-gray-400 " />{" "}
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
                              <MdQueryBuilder className="w-5 h-5 text-gray-400 " />{" "}
                              <TextLine
                                boldText={t("reminder days count")}
                                lightString={doc.data?.reminder}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center">
                          <p>{t("media")} : </p>
                          <FilesPreviewOutFormik images={doc?.files} />
                        </div>
                      </div>
                    </div>
                  </>
                ))
              ) : (
                <div className="flex justify-center gap-4 col-span-4 align-center items-center">
                  <h3 className="font-extrabold text-2xl ">
                    {t("no documents")}
                  </h3>
                </div>
              )}
              {/* العنوان الوطني */}
              <>
                <div className="bg-flatWhite rounded-lg p-4 grid justify-center grid-cols-3 col-span-4 gap-x-4 gap-y-8 relative  border-t-2 border-[#5F5F5F33]">
                  <div className="flex gap-4 flex-col col-span-4">
                    <h3 className="font-extrabold text-2xl">
                      {`${t("national Address")} : `}
                    </h3>
                  </div>
                  <div className="bg-flatWhite rounded-lg p-4 grid justify-center grid-cols-3 col-span-4 gap-x-4 gap-y-8 relative">
                    <div className="flex gap-4 flex-col">
                      {partner.nationalAddress?.city.name && (
                        <div className="flex items-center gap-2">
                          <FaCity className="w-5 h-5 text-gray-400" />
                          <TextLine
                            boldText={t("city")}
                            lightString={partner.nationalAddress?.city.name}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {partner.nationalAddress?.city.country_name && (
                        <div className="flex items-center gap-2">
                          <FaCity className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("country")}
                            lightString={
                              partner.nationalAddress?.city.country_name
                            }
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {partner.nationalAddress?.district.name && (
                        <div className="flex items-center gap-2">
                          <FaCity className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("district")}
                            lightString={partner.nationalAddress?.district.name}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {partner.nationalAddress?.address && (
                        <div className="flex items-center gap-2">
                          <FaHome className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("short address")}
                            lightString={partner.nationalAddress?.address}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {partner.nationalAddress?.street_number && (
                        <div className="flex items-center gap-2">
                          <BiStreetView className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("street number")}
                            lightString={partner.nationalAddress?.street_number}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {partner.nationalAddress?.building_number && (
                        <div className="flex items-center gap-2">
                          <TbHomeHand className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("building number")}
                            lightString={
                              partner.nationalAddress?.building_number
                            }
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {partner.nationalAddress?.sub_number && (
                        <div className="flex items-center gap-2">
                          <AiOutlineFieldNumber className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("sub number")}
                            lightString={partner.nationalAddress?.sub_number}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {partner.nationalAddress?.zip_code && (
                        <div className="flex items-center gap-2">
                          <BsMailbox className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("zip code")}
                            lightString={partner.nationalAddress?.zip_code}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            </>
          </InnerFormLayout>
        )}
      </OuterFormLayout>
    </>
  );
};
