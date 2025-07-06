/////////// IMPORTS
///
import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik, FormikValues } from "formik";
import { t } from "i18next";
import { Dispatch, SetStateAction } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "../../components/atoms";
import { OuterFormLayout } from "../../components/molecules";
import { Loading } from "../../components/organisms/Loading";
import { PermissionForm } from "../../components/templates/administrativeStructure/PermissionForm";
import { useFetch, useMutate } from "../../hooks";
import { mutateData } from "../../utils/mutateData";
import { notify } from "../../utils/toast";
import { HandleBackErrors } from "../../utils/utils-components/HandleBackErrors";
import {
  PermissionGroup_TP,
  Permission_TP,
  addAdministrativeSchema,
} from "./types-and-schemas";
///
/////////// Types
///
type AddAdministrativeStructureProps_TP = {
  title: string;
  value?: string;
  onAdd?: (value: string) => void;
  editData?: PermissionGroup_TP;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const AddAdministrativeStructure = ({
  title,
  value,
  onAdd,
  editData,
  setOpen,
}: AddAdministrativeStructureProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///
  let asyncInitValues: { [key: string]: string } = {
    name: editData?.name || "",
    is_selling: editData?.is_selling || false,
  };

  const {
    data: permissions,
    isError: permissionsError,
    isLoading: permissionsLoading,
    isSuccess: permissionsSuccess,
    failureReason,
    error,
  } = useFetch<PermissionGroup_TP[]>({
    queryKey: ["roles"],
    endpoint: "administrative/api/v1/permissions/withgrouping",
  });

  permissions?.map((permissionsGroup) =>
    permissionsGroup.permissions?.map(
      (perm) => (asyncInitValues[perm.id as keyof Permission_TP] = "")
    )
  );
  const queryClient = useQueryClient();
  const {
    mutate,
    isLoading: isMutating,
    error: rulePostError,
  } = useMutate({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["allRoles"]);
      if (!!setOpen) setOpen(false);
    },
  });

  ///
  /////////// STATES
  ///
  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const addAdminStructureHandler = (values: FormikValues) => {
    const idsValues = Object.entries(values)
      .map(([key, _]) => {
        if (values[key] === true) {
          return key;
        }
      })
      .filter((item) => !!item)
      .filter((item) => !isNaN(item));

    mutate({
      endpointName: !!editData?.id
        ? `/administrative/api/v1/roles/${editData.id}`
        : "/administrative/api/v1/roles",
      values: {
        name: values.name,
        is_selling: values.is_selling,
        permissions: idsValues,
      },
      method: !!editData?.id ? "put" : "post",
    });
  };
  ///
  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {permissionsLoading && <Loading mainTitle="تحميل" subTitle="الصلاحيات" />}
      {permissionsError && <p>{error.message}</p>}
      {permissionsSuccess && (
        <>
          <Formik
            onSubmit={addAdminStructureHandler}
            enableReinitialize={true}
            initialValues={asyncInitValues}
            validationSchema={addAdministrativeSchema()}
          >
            {({ values, touched }) => (
              <HandleBackErrors errors={rulePostError?.response.data.errors}>
                <Form>
                  <OuterFormLayout
                    submitComponent={
                      <Button
                        type="submit"
                        variant="primary"
                        className="mr-auto mt-8"
                        loading={isMutating}
                      >
                        {t("confirm")}
                      </Button>
                    }
                    header={title}
                  >
                    <PermissionForm
                      permissions={permissions}
                      editData={editData}
                    />
                  </OuterFormLayout>
                </Form>
              </HandleBackErrors>
            )}
          </Formik>
        </>
      )}
    </div>
  );
};
