/////////// IMPORTS
import { t } from "i18next";
import { useState } from "react";
import MainImage from "../../../../assets/original170521850658149.jpg";
import { useFetch } from "../../../../hooks";
import { Button } from "../../../atoms";
import { Header } from "../../../atoms/Header";
import { InnerFormLayout, Modal, OuterFormLayout } from "../../../molecules";
import { Loading } from "../../../organisms/Loading";
import { TextLine } from "../../employee/TextLine";
import { EditCompany } from "../company/EditCompany";
import { formatDate } from "../../../../utils/date";
import { FilesPreview } from "../../../molecules/files/FilesPreview";
import { FilesPreviewOutFormik } from "../../../molecules/files/FilesPreviewOutFormik";
import { Back } from "../../../../utils/utils-components/Back";
import {
  BsBuildingLock,
  BsCalendarDate,
  BsFillBuildingFill,
  BsMailbox,
} from "react-icons/bs";
import { FaCity, FaHome, FaRegEdit } from "react-icons/fa";
import {
  MdEditDocument,
  MdEmail,
  MdFax,
  MdOutlinePermMedia,
  MdPriceCheck,
  MdOutlineFax,
  MdOutlineUpdate,
} from "react-icons/md";
import {
  AiFillFileText,
  AiFillPhone,
  AiOutlineFieldNumber,
  AiOutlinePhone,
} from "react-icons/ai";
import { GrDocument, GrDocumentTest, GrDocumentText } from "react-icons/gr";
import { BiBuildingHouse, BiFileBlank, BiStreetView } from "react-icons/bi";
import {
  TbBuildingEstate,
  TbFileDigit,
  TbFileText,
  TbHomeHand,
} from "react-icons/tb";
import { EditIcon } from "../../../atoms/icons";
import { HiOutlineMail } from "react-icons/hi";
import { HiOutlineHome } from "react-icons/hi2";
import { object } from "yup";
///
///
/////////// Types
///
export type CompanyDetails_TP = {
  address: string;
  city: string;
  country: string;
  district: string;
  email: string;
  establishmentDate: string;
  fax: string;
  name: string;
  phone: string;
  tax_number: string;
  logo: string;
  //document
  document: {
    data: {
      docType?: {
        label?: string;
      };
      docName?: string;
      docNumber?: string;
      endDate?: string;
      reminder?: string;
      file?: string;
    };
  }[];
  //national address
  nationalAddress: {
    city: {
      name: string;
      country_name: String;
    };
    district: {
      name: string;
      city_name: String;
    };
    address: string;
    street_number: string;
    building_number: string;
    sub_number: string;
    zip_code: string;
  };
  // docs data initial values
};

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const ViewCompanyDetails = () => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///

  const {
    data: companyDetails,
    isError,
    isSuccess,
    error,
    isLoading: companyDetailsLoading,
  } = useFetch<CompanyDetails_TP | any>({
    endpoint: "/companySettings/api/v1/companies",
    queryKey: ["viewCompany"],
  });

  const companyDetailsData: CompanyDetails_TP[] = companyDetails
    ? companyDetails
    : [];

  console.log(
    "🚀 ~ ViewCompanyDetails ~ companyDetailsData:",
    companyDetailsData
  );

  ///
  /////////// STATES
  ///
  const [editCompanyOpen, setEditCompanyOpen] = useState(false);
  const [documentOpen, setDocumentOpen] = useState(false);

  // let images: any = companyDetailsData[0]?.files.map((el) => el)

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
      <OuterFormLayout
        header={`${t("view details company")}`}
        leftComponent={<Back />}
      >
        {isError && (
          <div className=" m-auto">
            <Header
              className="text-center text-2xl font-extrabold"
              header={t(
                `some thing went wrong ${error?.response?.data?.message}`
              )}
            />
          </div>
        )}
        {companyDetailsLoading && (
          <>
            <Loading mainTitle={t("view company Details")} />
          </>
        )}

        {isSuccess &&
          companyDetails.length > 0 &&
          companyDetailsData?.map((company: CompanyDetails_TP) => {
            const companyImg =
              typeof company.logo !== "object" ? company.logo : MainImage;
            return (
              <InnerFormLayout
                title={
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <p>{t("data")}</p>
                      <p className=" text-mainGreen">{company?.name}</p>
                    </div>
                    <EditIcon
                      className=" hover:fill-mainGreen ml-2 !w-8 !h-8 absolute left-0"
                      action={() => setEditCompanyOpen(true)}
                    />
                  </div>
                }
              >
                <>
                  <div className="flex gap-4 flex-col col-span-4 m-auto">
                    <img
                      src={`${companyImg}`}
                      alt={`company ${company?.logo}`}
                      className="w-[7rem] h-[7rem] rounded-full"
                    />
                  </div>
                  <div className="flex gap-4 flex-col col-span-2">
                    <h2 className="relative font-bold border-b-2  w-fit p-1 text-mainOrange before:content-[''] before:absolute before:bottom-[-1px] before:right-[2px] before:w-[95%] before:h-[2px] before:bg-[#5F5F5F]">
                      البيانات الشخصية :
                    </h2>
                    {company?.email && (
                      <div className="flex items-center align-middle gap-2">
                        <HiOutlineMail className="w-5 h-5 text-[#A0A0A0]" />
                        <TextLine
                          boldText={t("email")}
                          lightString={company?.email}
                        />
                      </div>
                    )}

                    {company?.phone && (
                      <div className="flex items-center align-middle gap-2">
                        <AiOutlinePhone className="w-[22px] h-[22px] text-[#A0A0A0]" />
                        <TextLine
                          boldText={t("phone")}
                          lightString={company?.phone}
                        />
                      </div>
                    )}
                    {company?.tax_number && (
                      <div className="flex items-center align-middle gap-2">
                        <MdPriceCheck className="w-[22px] h-[22px] text-[#A0A0A0]" />
                        <TextLine
                          boldText={t("tax number")}
                          lightString={company?.tax_number}
                        />
                      </div>
                    )}
                    {company.establishmentDate && (
                      <div className="flex items-center align-middle gap-2">
                        <BsCalendarDate className="w-5 h-5 text-[#A0A0A0]" />
                        <TextLine
                          boldText={t("establishment Date")}
                          lightString={company?.establishmentDate}
                        />
                      </div>
                    )}
                    {company.fax && (
                      <div className="flex items-center align-middle gap-2">
                        <MdOutlineFax className="w-5 h-5 text-[#A0A0A0]" />
                        <TextLine
                          boldText={t("fax")}
                          lightString={company?.fax}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 flex-col col-span-2 px-4 border-r-2 border-[#5F5F5F33]">
                    <h2 className="relative font-bold border-b-2  w-fit p-1 text-mainOrange before:content-[''] before:absolute before:bottom-[-1px] before:right-[2px] before:w-[95%] before:h-[2px] before:bg-[#5F5F5F]">
                      البيانات العامة :
                    </h2>
                    {company?.name && (
                      <div className="flex items-center align-middle gap-2">
                        <BsBuildingLock className="w-5 h-5 text-[#A0A0A0]" />
                        <TextLine
                          boldText={t("company")}
                          lightString={company?.name}
                        />
                      </div>
                    )}
                    {company?.country && (
                      <div className="flex items-center align-middle gap-2">
                        <FaCity className="w-5 h-5 text-[#A0A0A0]" />
                        <TextLine
                          boldText={t("country")}
                          lightString={company?.country.name}
                        />
                      </div>
                    )}
                    {company?.city && (
                      <div className="flex items-center align-middle gap-2">
                        <BiBuildingHouse className="w-5 h-5 text-[#A0A0A0]" />
                        <TextLine
                          boldText={t("city")}
                          lightString={company?.city.name}
                        />
                      </div>
                    )}
                    {company?.district && (
                      <div className="flex items-center align-middle gap-2">
                        <TbBuildingEstate className="w-5 h-5 text-[#A0A0A0]" />
                        <TextLine
                          boldText={t("district name")}
                          lightString={company?.district.name}
                        />
                      </div>
                    )}
                    {company.logo ? (
                      <div className="flex items-center align-middle gap-2">
                        {/* <MdOutlinePermMedia className="w-[20px] h-[20px] text-[#A0A0A0]" /> */}
                        <div className="flex items-center gap-1">
                          <p className="mt-1">{t("media")} : </p>
                          <FilesPreviewOutFormik
                            preview={true}
                            images={[
                              {
                                path: company.logo,
                                type: "image",
                              },
                            ]}
                          />
                        </div>
                      </div>
                    ) : (
                      "لايوجد وسائط"
                    )}
                  </div>

                  <div className="flex items-center gap-4 flex-col">
                    <Modal
                      isOpen={editCompanyOpen}
                      onClose={setEditCompanyOpen}
                    >
                      <EditCompany
                        valuesData={company}
                        setEditCompanyOpen={setEditCompanyOpen}
                      />
                    </Modal>
                  </div>

                  {/* الوثائق */}

                  <div className="flex items-center justify-between gap-4 col-span-4 align-middle py-10 border-t-2 border-[#5F5F5F33] ">
                    <h1 className="font-semibold text-2xl">
                      {t("main documents")}
                    </h1>
                    {company.document.length > 2 && (
                      <Button
                        className="mb-3"
                        action={() => setDocumentOpen(true)}
                      >
                        {t("view all documents")}
                      </Button>
                    )}
                  </div>

                  <Modal isOpen={documentOpen} onClose={setDocumentOpen}>
                    {company.document?.map((doc, i) => (
                      <>
                        <div className="flex gap-4 flex-col col-span-4 border-b-2 border-dashed mt-3  justify-center align-middle">
                          <div className=" flex items-center justify-center ">
                            <div className="py-2 px-5 rounded-lg  bg-mainGreen  bg-opacity-10 border border-dashed border-gray-400">
                              <p className=" text-lg font-extrabold text-2xl text-mainGreen">
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

                  {company.document.length !== 0
                    ? company.document?.slice(0, 2).map((doc, i) => (
                        <>
                          <div className="flex gap-4 flex-col col-span-4  justify-center align-middle border border-dashed border-[#5F5F5F33] pt-5">
                            <div className=" flex items-center justify-center mb-8">
                              <div className="py-2 px-5 rounded-lg  bg-mainGreen  bg-opacity-10 border border-dashed border-gray-400">
                                <p className=" text-lg font-extrabold text-2xl text-mainGreen">
                                  {t(`document`)} {i + 1}
                                </p>
                              </div>
                            </div>
                            <div className="bg-flatWhite rounded-lg p-4 mt-5 grid justify-center grid-cols-3 col-span-4 gap-x-4 gap-y-8 relative   ">
                              <div className="flex gap-4 flex-col">
                                {doc.data?.docType?.label && (
                                  <div className="flex align-middle gap-2">
                                    <BiFileBlank className="w-6 h-6 text-[#A0A0A0]" />
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
                                    <TbFileText className="w-6 h-6 text-[#A0A0A0]" />
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
                                    <TbFileDigit className="w-6 h-6 text-[#A0A0A0]" />
                                    <TextLine
                                      boldText={t("document number")}
                                      lightString={doc.data?.docNumber}
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-4 flex-col  ">
                                {doc.data?.endDate && (
                                  <div className="flex items-center align-middle gap-2">
                                    <BsCalendarDate className="w-5 h-5 text-[#A0A0A0]" />
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
                                    <MdOutlineUpdate className="w-6 h-6 text-[#A0A0A0]" />
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
                    : "لايوجد وثائق"}

                  {/* العنوان الوطني */}

                  <>
                    <div className="bg-flatWhite rounded-lg p-4 grid justify-center grid-cols-3 col-span-4 gap-x-4 gap-y-8 relative  border-t-2 border-[#5F5F5F33]">
                      <div className="flex gap-4 flex-col col-span-4">
                        <h3 className="font-semibold text-2xl">
                          {" "}
                          {t("national Address")}{" "}
                        </h3>
                      </div>
                      <div className="bg-flatWhite rounded-lg p-4 grid justify-center grid-cols-3 col-span-4 gap-x-4 gap-y-8 relative">
                        <div className="flex gap-4 flex-col">
                          {company.nationalAddress?.city.name && (
                            <div className="flex items-center align-middle gap-2">
                              <BiBuildingHouse className="w-6 h-6 text-[#A0A0A0]" />
                              <TextLine
                                boldText={t("city")}
                                lightString={company.nationalAddress?.city.name}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 flex-col">
                          {company.nationalAddress?.city.country_name && (
                            <div className="flex items-center align-middle gap-2">
                              <FaCity className="w-6 h-6 text-[#A0A0A0]" />
                              <TextLine
                                boldText={t("country")}
                                lightString={
                                  company.nationalAddress?.city.country_name
                                }
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 flex-col">
                          {company.nationalAddress?.district.name && (
                            <div className="flex items-center align-middle gap-2">
                              <TbBuildingEstate className="w-6 h-6 text-[#A0A0A0]" />
                              <TextLine
                                boldText={t("district")}
                                lightString={
                                  company.nationalAddress?.district.name
                                }
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 flex-col">
                          {company.nationalAddress?.address && (
                            <div className="flex items-center align-middle gap-2">
                              <HiOutlineHome className="w-6 h-6 text-[#A0A0A0]" />
                              <TextLine
                                boldText={t("short address")}
                                lightString={company.nationalAddress?.address}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 flex-col">
                          {company.nationalAddress?.street_number && (
                            <div className="flex items-center align-middle gap-2">
                              <BiStreetView className="w-6 h-6 text-[#A0A0A0]" />
                              <TextLine
                                boldText={t("street number")}
                                lightString={
                                  company.nationalAddress?.street_number
                                }
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 flex-col">
                          {company.nationalAddress?.building_number && (
                            <div className="flex items-center align-middle gap-2">
                              <TbHomeHand className="w-6 h-6 text-[#A0A0A0]" />
                              <TextLine
                                boldText={t("building number")}
                                lightString={
                                  company.nationalAddress?.building_number
                                }
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 flex-col">
                          {company.nationalAddress?.sub_number && (
                            <div className="flex items-center align-middle gap-2">
                              <AiOutlineFieldNumber className="w-6 h-6 text-[#A0A0A0]" />
                              <TextLine
                                boldText={t("sub number")}
                                lightString={
                                  company.nationalAddress?.sub_number
                                }
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 flex-col">
                          {company.nationalAddress?.zip_code && (
                            <div className="flex items-center align-middle gap-2">
                              <BsMailbox className="w-6 h-6 text-[#A0A0A0]" />
                              <TextLine
                                boldText={t("zip code")}
                                lightString={company.nationalAddress?.zip_code}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>

                  {/* ////////////////////// */}
                </>
              </InnerFormLayout>
            );
          })}
      </OuterFormLayout>
    </>
  );
};

// text-mainOrange font-bold border-b-2 border-[#5F5F5F] w-[30%] p-1
