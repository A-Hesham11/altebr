import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { t } from "i18next";
import { useContext } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import * as Yup from "yup";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useMutate } from "../../hooks";
import { requiredTranslation } from "../../utils/helpers";
import { mutateData } from "../../utils/mutateData";
import { notify } from "../../utils/toast";
import { Button } from "../atoms";
import { BaseInputField, PhoneInput } from "../molecules";

export type ClientData_TP = {
  id: number;
  name: string;
  phone: string;
  identity: string;
  branch_id: number;
};

const SellingClientForm = () => {
  const { userData } = useContext(authCtx);

  const queryClient = useQueryClient();

  const employeeValidatingSchema = () =>
    Yup.object({
      name: Yup.string().required("Name is required"),
      phone: Yup.string()
        .trim()
        .required(requiredTranslation)
        .test("isValidateNumber", "رقم غير صحيح", function (value: string) {
          return isValidPhoneNumber(value || "");
        }),
      identity: Yup.string().trim().required(requiredTranslation),
    });

  const initialValues = {
    name: "",
    phone: "",
    identity: "",
    branch_id: userData?.branch_id,
  };

  const { mutate, isLoading: editLoading } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["branchManage"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["branchManage"]);
      queryClient.refetchQueries(["all-client"]);
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
        name: values.name,
        phone: values.phone,
        identity: values.identity,
        branch_id: values.branch_id,
      },
      method: "post",
    });
  }

  // const PostClientNewData = (values : ClientData_TP) => {
  //   mutate({
  //     endpointName: `/branchManage/api/v1/clients/${editData?.id}`,
  //     values,
  //     method: "put",
  //   });
  // };
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={() => employeeValidatingSchema()}
        onSubmit={(values) => {
          PostNewValue(values);
        }}
      >
        {({ resetForm }) => {
          return (
            <Form>
              <div className="flex flex-col gap-6 w-3/4 mx-auto my-8">
                <div className="animate_from_left">
                  <BaseInputField
                    id="name"
                    label={`${t("name")}`}
                    name="name"
                    type="text"
                    placeholder={`${t("name")}`}
                    labelProps={{ className: "mb-1" }}
                    required
                  />
                </div>
                <div className="animate_from_right animation_delay-5">
                  <PhoneInput
                    label={`${t("mobile number")}`}
                    name="phone"
                    placeholder={`${t("mobile number")}`}
                    required
                  />
                </div>
                <div className="animate_from_top  animation_delay-7">
                  <BaseInputField
                    id="identity"
                    label={`${t("national number")}`}
                    name="identity"
                    type="text"
                    placeholder={`${t("national number")}`}
                    required
                  />
                </div>
              </div>
              {/* <ClientInput editData={editData} /> */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="animate_from_bottom flex justify-center animation_delay-9"
                  loading={editLoading}
                >
                  {t("save")}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default SellingClientForm;
