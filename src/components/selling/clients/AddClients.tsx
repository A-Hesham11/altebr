import { t } from 'i18next'
import React, { Dispatch, SetStateAction, useContext } from 'react'
import { Button } from '../../atoms'
import { HiOutlineUserAdd } from 'react-icons/hi'
import { BaseInputField, PhoneInput } from '../../molecules'
import AddClientInputs from './AddClientInput'
import { Form, Formik } from 'formik'
import * as Yup from "yup";
import { InitialValues_TP } from '../../templates/employee/validation-and-types'
import { requiredTranslation } from '../../../utils/helpers'
import { useQueryClient } from '@tanstack/react-query'
import { useMutate } from '../../../hooks'
import { notify } from '../../../utils/toast'
import { isValidPhoneNumber } from "react-phone-number-input";
import { authCtx } from '../../../context/auth-and-perm/auth'
import { mutateData } from '../../../utils/mutateData'
import { TabsIcon } from '../../atoms/icons'
import FingerSize from './FingerSize'
import { Back } from '../../../utils/utils-components/Back'

type AddClientProps_TP = {
    editClientData?: InitialValues_TP | undefined;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen: boolean;
    editClientsData?: ClientData_TP;
    title?: string
  };
  
  export type ClientData_TP = {
    id: number
    name: string
    phone: string
    identity: string
    branch_id: number
    mobile: string
    country_id: string
    city_id: string
    nationality_id: string
    gender: string
    mehna: string
    geha: string
    odwya_id: string
    branch_name: string


    size_id: string
    sababa_id:string
    ebham_id: string
    ruskh_id: string
    wsta_id:string
    benser_id: string
    khenser_id: string
  }

export const AddClients = ({ 
  editClientsData, 
  dataSource, 
  showClientsData, 
  setShow, 
  isSuccess, 
  refetch, 
  setEditClientsData,
  setShowClientsData
}) => {


    const queryClient = useQueryClient()

    const {userData} = useContext(authCtx)

    const employeeValidatingSchema = () => 
    Yup.object({
        name: Yup.string().trim().required(requiredTranslation),
        branch_id: Yup.string().trim(),
        phone: !!!editClientsData
        ? Yup.string()
            .trim()
            
            .test("isValidateNumber", "رقم غير صحيح", function (value: string) {
                return isValidPhoneNumber(value || "")
            })
        : Yup.string().trim(),
        mobile: !!!editClientsData
          ? Yup.string()
              .trim()
              
              .test("isValidateNumber", "رقم غير صحيح", function (value: string) {
                  return isValidPhoneNumber(value || "")
              })
          : Yup.string().trim(),
        nationality_id: Yup.string(),
        identity: Yup.string(),
        country_id: Yup.string(),
        city_id: Yup.string(),
        gender: Yup.string(),
        mehna: Yup.string(),
        geha: Yup.string(),
        odwya_id: Yup.string(),
        branch_name: Yup.string(),

        size_id: Yup.string().trim(),
        sababa_id:Yup.string().trim(),
        ebham_id: Yup.string().trim(),
        ruskh_id: Yup.string().trim(),
        wsta_id: Yup.string().trim(),
        benser_id: Yup.string().trim(),
        khenser_id: Yup.string().trim(),
        type: Yup.string().trim(),

  });


    const initialValues = {
        name: editClientsData?.name || showClientsData?.name || "",
        phone: editClientsData?.phone || showClientsData?.phone || "",
        mobile: editClientsData?.mobile || showClientsData?.mobile || "",
        country_id: editClientsData?.country.id || showClientsData?.country.id  || "",
        city_id: editClientsData?.city.id || showClientsData?.city.id  || "",
        nationality_id: editClientsData?.nationality.id || showClientsData?.nationality.id  || "",
        gender: editClientsData?.gender || showClientsData?.gender  || "",
        mehna: editClientsData?.mehna || showClientsData?.mehna  || "",
        geha: editClientsData?.geha || showClientsData?.geha  || "",
        odwya_id: editClientsData?.odwya.id || showClientsData?.odwya.id  || "",
        identity: editClientsData?.identity || showClientsData?.identity  || "",
        branch_name: editClientsData?.branch_name || showClientsData?.branch.name_ar  || "",
        branch_id: userData?.branch_id || "",
        size_id: editClientsData?.size.id || showClientsData?.size.id || "",
        sababa_id: editClientsData?.sababa.id || showClientsData?.sababa.id  || "",
        ebham_id: editClientsData?.ebham.id || showClientsData?.ebham.id  || "",
        ruskh_id: editClientsData?.ruskh_id.id || showClientsData?.ruskh_id.id  || "",
        wsta_id: editClientsData?.wsta.id || showClientsData?.wsta.id  || "",
        benser_id: editClientsData?.benser.id || showClientsData?.benser.id  || "",
        khenser_id: editClientsData?.khenser.id || showClientsData?.khenser.id  || "",
    }
  
    const { 
      mutate,
      isLoading: editLoading, 
      data,
      isSuccess: isSuccessData,
      reset,
    } = useMutate({
      mutationFn: mutateData,
      mutationKey: ["allClientss_data"],
      onSuccess: (data) => {
        notify("success");
        queryClient.refetchQueries(["all-clientsData"])
        refetch()
        setShow(false)
      },
      onError: (error) => {
        console.log(error);
        notify("error");
      },
    });

    function PostNewValue(values: ClientData_TP) {
      mutate({
        endpointName: "/branchManage/api/v1/clients",
        values: {
          name: values?.name,
          phone: values?.phone,
          identity: values?.identity,
          branch_id: values?.branch_id,
          mobile: values?.mobile,
          country_id: values?.country_id,
          city_id: values?.city_id,
          nationality_id: values?.nationality_id,
          gender: values?.gender,
          mehna: values?.mehna,
          geha: values?.geha,
          odwya_id: values?.odwya_id,
          branch_name: values?.branch_name,

          size_id: values?.size_id,
          sababa_id: values?.sababa_id,
          ebham_id: values?.ebham_id,
          ruskh_id: values?.ruskh_id,
          wsta_id: values?.wsta_id,
          benser_id: values?.benser_id,
          khenser_id: values?.khenser_id,
        },
        method: "post",
      });
    }


  
    const PostClientNewData = (values : ClientData_TP) => {
      mutate({
        endpointName: `/branchManage/api/v1/clients/${editClientsData?.id}`,
        values,
        method: "put",
      });
    };

    const PostClientShowData = (values : ClientData_TP) => {
      mutate({
        endpointName: `/branchManage/api/v1/clients/${showClientsData?.id}`,
        values,
        method: "put",
      });
    };

  return (
    <Formik
        initialValues={initialValues}
        validationSchema={() => employeeValidatingSchema()}
        onSubmit={(values) => {
          if (editClientsData) {
            PostClientNewData(values)
          } else if (showClientsData) {
            PostClientShowData(values)
          } else {
            PostNewValue(values)
          }
          setEditClientsData()
          setShowClientsData()
        }}
    >
        {({ resetForm, values }) => {
            return (
                <Form>
                    <div className="relative h-full px-3">
                        <div className='flex justify-between items-center mb-6'> 
                            <p className=' text-base font-bold'>{t("add customer")}</p>
                        </div>
                        <div className=''>
                            <div className="bg-lightGreen h-[100%] rounded-lg sales-shadow px-6 py-5">
                                <div className=" font-bold flex items-center gap-4 mb-3">
                                  <TabsIcon />
                                  <h2 className="text-base font-bold">{t("basic information")}</h2>
                                </div>
                                <div className='bg-flatWhite rounded-lg bill-shadow p-5'>
                                    <AddClientInputs 
                                      editClientsData={editClientsData} 
                                      showClientsData={showClientsData} 
                                      dataSource={dataSource}
                                    />
                                </div>
                                <div className='mt-8'>
                                  <div className=" font-bold flex items-center gap-4 mb-3">
                                    <TabsIcon />
                                    <h2 className="text-base font-bold">{t("finger size")}</h2>
                                  </div>
                                  <div className='bg-flatWhite rounded-lg bill-shadow p-5'>
                                      <FingerSize
                                          editClientsData={editClientsData}
                                          showClientsData={showClientsData}
                                          initialValues={initialValues}
                                      />
                                  </div>
                               </div>
                            </div>

                        </div>
                    </div>
                    <div className="flex justify-end mt-8 gap-4 pl-3 ">
                        {/* <Button
                          type="submit"
                          loading={editLoading}
                          className={editClientsData ? "bg-mainOrange text-white" : "bg-mainGreen text-white"}
                        >
                          {editClientsData ? `${t("edit")}` : `${t("save")}` }
                        </Button> */}
                        {editClientsData
                          ? (
                            <Button
                              type="submit"
                              loading={editLoading}
                              className={editLoading && "border-2 border-mainGreen bg-mainGray" || showClientsData && "hidden"}
                            >
                                {t("edit")}
                            </Button>
                          )
                          : (
                            <Button
                              type="submit"
                              loading={editLoading}
                              className={editLoading && "border-2 border-mainGreen bg-mainGray" || showClientsData && "hidden" }
                           >
                              {t("save")}
                            </Button>
                          )
                        }
                    </div>
                </Form>
            )
        }}
    </Formik>
)}
