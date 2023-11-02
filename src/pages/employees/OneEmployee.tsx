/////////// IMPORTS
///
import { t } from "i18next"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate, useParams } from "react-router-dom"
import blankPerson from "../../assets/blank-person-image.png"
import { Button } from "../../components/atoms"
import { Header } from "../../components/atoms/Header"
import {
  InnerFormLayout,
  Modal,
  OuterFormLayout,
} from "../../components/molecules"
import { FilesPreviewOutFormik } from "../../components/molecules/files/FilesPreviewOutFormik"
import { Loading } from "../../components/organisms/Loading"
import { TextLine } from "../../components/templates/employee/TextLine"
import { allDocs_TP } from "../../components/templates/reusableComponants/documents/Documents"
import { useFetch } from "../../hooks"
import { formatDate } from "../../utils/date"
import { Employee_TP } from "./employees-types"
import {
  BsCalendarDate,
  BsFillPersonFill,
  BsFillPersonVcardFill,
  BsMailbox,
} from "react-icons/bs"
import { AiFillPhone, AiOutlineFieldNumber } from "react-icons/ai"
import { RiBuilding2Fill } from "react-icons/ri"
import {
  MdEditDocument,
  MdEmail,
  MdOutlinePersonSearch,
  MdWork,
} from "react-icons/md"
import { FaCity, FaHome, FaRegAddressBook } from "react-icons/fa"
import { BiStreetView, BiUser } from "react-icons/bi"
import { GrDocument, GrDocumentTest, GrDocumentText } from "react-icons/gr"
import { TbHomeHand } from "react-icons/tb"

///
/////////// Types
///
type OneEmployeeProps_TP = {
  title?: string
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const OneEmployee = ({ title }: OneEmployeeProps_TP) => {
  /////////// VARIABLES
  ///
  const { employeeID } = useParams()
  const [documentOpen, setDocumentOpen] = useState(false)

  const navigate = useNavigate()
  ///
  /////////// CUSTOM HOOKS
  ///
  const {
    data: employee,
    isSuccess,
    isLoading: employeeLoading,
  } = useFetch<Employee_TP | any>({
    endpoint: `employee/api/v1/employees/${employeeID}`,
    queryKey: ["employees", employeeID!],
  })
  console.log(
    "🚀 ~ file: OneEmployee.tsx:38 ~ OneEmployee ~ employee:",
    employee
  )

  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  if (employeeLoading)
    return (
      <Loading
        mainTitle={`${t("employee data is loading")}`}
        subTitle={`${t("loading")}`}
      />
    )
  ///
  return (
    <>
      <Helmet>
        {/* Employee name */}
        <title>{employee?.name || "معلومات موظف"}</title>
      </Helmet>
      <OuterFormLayout
        header={`${t("view details")}`}
        leftComponent={
          <Button action={() => navigate(-1)} bordered>
            {t("Back")}
          </Button>
        }
      >
        <InnerFormLayout title={employee?.name}>
          {isSuccess && (
            <div className="col-span-4">
              <div className="grid gap-x-1 grid-cols-4">
                {/* Right column */}
                <div className="flex gap-4 flex-col col-span-4 m-auto ">
                  <img
                    src={employee.image || blankPerson}
                    alt={`employee ${employee.name}`}
                    className="w-[7rem] h-[7rem] rounded-full object-cover"
                  />
                </div>
                {/* The rest */}
                <div className="flex gap-4 flex-col col-span-2">
                  <h2 className="text-mainOrange font-bold border-b-2 border-[#5F5F5F] w-[30%] p-1">
                    البيانات الشخصية :
                  </h2>
                  <div className="flex gap-4 flex-col mt-4 ">
                    {employee.name && (
                      <div className="flex align-middle gap-2">
                        <BsFillPersonFill className="w-[20px] h-[20px] text-[#A0A0A0]" />
                        <TextLine
                          boldText={t("Name")}
                          lightString={employee.name}
                        />
                      </div>
                    )}
                    {employee.branch && (
                      <div className="flex align-middle gap-2">
                        <RiBuilding2Fill className="w-[20px] h-[20px] text-[#A0A0A0]" />
                        <TextLine
                          boldText={t("branch")}
                          lightString={employee.branch.name}
                        />
                      </div>
                    )}
                    {employee.role && (
                      <div className="flex align-middle gap-2">
                        <MdWork className="w-[20px] h-[20px] text-[#A0A0A0]" />
                        <TextLine
                          boldText={t("role")}
                          lightString={employee.role.name}
                        />
                      </div>
                    )}
                    {employee.email && (
                      <div className="flex align-middle gap-2">
                        <MdEmail className="w-[20px] h-[20px] text-[#A0A0A0]" />
                        <TextLine
                          boldText={t("email")}
                          lightString={employee.email}
                          containerClasses='w-[20rem]'
                        />
                      </div>
                    )}
                    {employee.nationality && (
                      <div className="flex align-middle gap-2">
                        <BsFillPersonVcardFill className="w-[20px] h-[20px] text-[#A0A0A0]" />
                        <TextLine
                          boldText={t("nationality")}
                          lightString={employee.nationality.name}
                        />
                      </div>
                    )}
                    {employee.national_expire_date && (
                      <div className="flex align-middle gap-2">
                        <BsCalendarDate className="w-[20px] h-[20px] text-[#A0A0A0]" />
                        <TextLine
                          boldText={t("national expire date")}
                          lightString={employee.national_expire_date}
                        />
                      </div>
                    )}
                    {employee.date_of_birth && (
                      <div className="flex align-middle gap-2">
                        <BsCalendarDate className="w-[20px] h-[20px] text-[#A0A0A0]" />
                        <TextLine
                          boldText={t("birth date")}
                          lightString={employee.date_of_birth}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-4 flex-col col-span-2 px-4 border-r-2 border-[#5F5F5F33]">
                  <h2 className="text-mainOrange font-bold border-b-2 border-[#5F5F5F] w-[30%] p-1">
                    البيانات العامة :
                  </h2>

                  {employee.phone && (
                    <div className="flex align-middle gap-2">
                      <AiFillPhone className="w-[20px] h-[20px] text-[#A0A0A0]" />
                      <TextLine
                        boldText={t("phone number")}
                        lightString={employee.phone}
                      />
                    </div>
                  )}
                  {employee.mobile && (
                    <div className="flex align-middle gap-2">
                      <AiFillPhone className="w-[20px] h-[20px] text-[#A0A0A0]" />
                      <TextLine
                        boldText={t("mobile number")}
                        lightString={employee.mobile}
                      />
                    </div>
                  )}
                  <div className="flex gap-4 flex-col ">
                    {employee.address && (
                      <div className="flex align-middle gap-2">
                        <FaRegAddressBook className="w-[20px] h-[20px] text-[#A0A0A0]" />
                        <TextLine
                          boldText={t("address")}
                          lightString={employee.address}
                        />
                      </div>
                    )}
                    {employee.hiringData && (
                      <TextLine
                        boldText={t("hiring date")}
                        lightString={employee.hiringData}
                      />
                    )}

                    {employee.username && (
                      <div className="flex align-middle gap-2">
                        <BiUser className="w-[20px] h-[20px] text-[#A0A0A0]" />
                        <TextLine
                          boldText={t("username")}
                          lightString={employee.username}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 flex-col ">
                    {employee.national_number && (
                      <div className="flex align-middle gap-2">
                        <BsFillPersonVcardFill className="w-[20px] h-[20px] text-[#A0A0A0]" />
                        <TextLine
                          boldText={t("national number")}
                          lightString={employee.national_number}
                        />
                      </div>
                    )}

                    {employee.is_active !== "undefined" && (
                      <div className="flex relative">
                        <div className="flex align-middle gap-2">
                          <MdOutlinePersonSearch className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("is active")}
                            lightString={employee.is_active}
                          />
                          <span className="inline-block absolute right-28 ">
                            {" "}
                            {employee.is_active === true
                              ? `${t("Yes")}`
                              : `${t("No")}`}
                          </span>
                        </div>
                      </div>
                    )}
                    {(employee.national_image || employee.image) && (
                      <div className="flex items-center gap-1">
                        <p className="mt-1">{t("media")} : </p>
                        <FilesPreviewOutFormik
                          preview={true}
                          images={[
                            {
                              path: employee.national_image,
                              type: "image",
                            },
                            {
                              path: employee.image,
                              type: "image",
                            },
                          ]}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Modal isOpen={documentOpen} onClose={setDocumentOpen}>
                {employee?.document?.map((doc, i) => (
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
              {employee?.document.length !== 0 && (
                <div className="flex justify-between gap-4 col-span-4 align-center items-center">
                  <h3 className="font-extrabold text-2xl">
                    {t("main documents")}
                  </h3>
                  {employee?.document?.length > 2 && (
                    <Button
                      className="mb-3"
                      action={() => setDocumentOpen(true)}
                    >
                      {t("view all documents")}
                    </Button>
                  )}
                </div>
              )}
              {employee.document.length !== 0 ? (
                employee?.document?.slice(0, 2).map((doc, i) => (
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
                <div className="flex justify-center gap-4 col-span-4 align-center items-center my-5">
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
                      {employee.nationalAddress?.city.name && (
                        <div className="flex align-middle gap-2">
                          <FaCity className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("city")}
                            lightString={employee.nationalAddress?.city.name}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {employee.nationalAddress?.city.country_name && (
                        <div className="flex align-middle gap-2">
                          <FaCity className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("country")}
                            lightString={
                              employee.nationalAddress?.city.country_name
                            }
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {employee.nationalAddress?.district.name && (
                        <div className="flex align-middle gap-2">
                          <FaCity className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("district")}
                            lightString={
                              employee.nationalAddress?.district.name
                            }
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {employee.nationalAddress?.address && (
                        <div className="flex align-middle gap-2">
                          <FaHome className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("short address")}
                            lightString={employee.nationalAddress?.address}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {employee.nationalAddress?.street_number && (
                        <div className="flex align-middle gap-2">
                          <BiStreetView className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("street number")}
                            lightString={
                              employee.nationalAddress?.street_number
                            }
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {employee.nationalAddress?.building_number && (
                        <div className="flex align-middle gap-2">
                          <TbHomeHand className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("building number")}
                            lightString={
                              employee.nationalAddress?.building_number
                            }
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {employee.nationalAddress?.sub_number && (
                        <div className="flex align-middle gap-2">
                          <AiOutlineFieldNumber className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("sub number")}
                            lightString={employee.nationalAddress?.sub_number}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-col">
                      {employee.nationalAddress?.zip_code && (
                        <div className="flex align-middle gap-2">
                          <BsMailbox className="w-[20px] h-[20px] text-[#A0A0A0]" />
                          <TextLine
                            boldText={t("zip code")}
                            lightString={employee.nationalAddress?.zip_code}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            </div>
          )}
        </InnerFormLayout>
      </OuterFormLayout>
    </>
  )
}
