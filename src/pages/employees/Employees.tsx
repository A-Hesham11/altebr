/////////// IMPORTS
///
//import classes from './Employees.module.css'
import { t } from "i18next";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/atoms";
import { AddIcon } from "../../components/atoms/icons";
import { Modal } from "../../components/molecules";
import { Loading } from "../../components/organisms/Loading";
import { AddEmployee } from "../../components/templates/employee/AddEmployee";
import { EmployeeCard } from "../../components/templates/employee/EmployeeCard";
import { InitialValues_TP } from "../../components/templates/employee/validation-and-types";
import { useFetch, useMutate } from "../../hooks";
import { Employee_TP } from "./employees-types";
import { ExportToExcel } from "../../components/ExportToFile";
import { FilesUpload } from "../../components/molecules/files/FileUpload";
import { mutateData } from "../../utils/mutateData";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { notify } from "../../utils/toast";
// import { ExportToExcel } from "../../components/ExportToFile";

///
/////////// Types
///
type EmployeesProps_TP = {
  title: string;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const Employees = ({ title }: EmployeesProps_TP) => {
  /////////// VARIABLES
  ///

  const [importModal, setImportModal] = useState<boolean>(false);
  const [importFiles, setImportFiles] = useState<any>([]);
  const queryClient = useQueryClient();

  ///
  /////////// CUSTOM HOOKS
  ///
  const {
    data: employees,
    isSuccess,
    isLoading: employeesLoading,
  } = useFetch<Employee_TP[]>({
    endpoint: "employee/api/v1/employees",
    queryKey: ["employees"],
  });

  const { data: employeesExcel } = useFetch<Employee_TP[]>({
    endpoint: "employee/api/v1/employees?per_page=10000",
    queryKey: ["employees-excel"],
    select: (data: any) =>
      data?.map((employee: any) => ({
        name: employee?.name,
        phone: employee?.phone,
        mobile: employee?.mobile,
        email: employee?.email,
        is_active: employee?.is_active,
        username: employee?.username,
        password: "",
        city_id: employee?.city?.id,
        nationality_id: employee?.nationality?.id,
        country_id: employee?.country?.id,
        role_id: employee?.role?.id,
        branch_id: employee?.branch?.id,
        date_of_birth: employee?.date_of_birth,
        national_number: employee?.national_number,
        national_expire_date: employee?.national_expire_date,
        address: employee?.address,
      })),
  });

  const navigate = useNavigate();
  ///
  /////////// STATES
  ///
  const [editEmployeeData, setEditEmployeeData] = useState<InitialValues_TP>();
  ///
  /////////// SIDE EFFECTS
  ///

  const { mutate, isLoading: postIsLoading } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["employee-files"],
    onSuccess: (data) => {
      notify("success", t("imported has successfully"));
      queryClient.refetchQueries(["employees"]);
    },
    onError: (error: any) => {
      notify("error", error?.response?.data?.message);
    },
  });

  const handleImportFiles = () => {
    mutate({
      endpointName: "/employee/api/import-employees",
      values: { file: importFiles[0] },
      dataType: "formData",
    });

    setImportFiles([]);
  };

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  if (employeesLoading)
    return (
      <Loading
        mainTitle={`${t("employees")}`}
        subTitle={`${t("employees data loading")}`}
      />
    );

  ///
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {/* SUCCESS & > 0 Employees */}

      <div className="flex justify-between mb-5">
        <h2 className="font-bold text-2xl">{t("employees data")}</h2>

        <div className="flex items-center gap-4">
          <Button
            action={(e) => {
              // setImportData(null);
              setImportModal(true);
            }}
            className="bg-mainGreen text-white"
          >
            {t("import")}
          </Button>
          <Button
            action={(e) => {
              // COMPONENT FOR EXPORT DATA TO EXCEL FILE ACCEPT DATA AND THE NAME OF THE FILE
              ExportToExcel(employeesExcel, "employees");
            }}
            className="bg-mainGreen text-white"
          >
            {t("export")}
          </Button>
          <Button
            action={() => navigate(-1)}
            className="flex items-center gap-2"
            bordered
          >
            {t("back")}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3">
        {isSuccess &&
          employees.length > 0 &&
          employees.map(({ id, name, image, ...rest }) => (
            <EmployeeCard
              id={id}
              name={name}
              img={image}
              key={id}
              rest={rest}
              setEditEmployeeData={setEditEmployeeData}
              editEmployeeData={editEmployeeData}
            />
          ))}
      </div>
      {/* SUCCESS & 0 Employees */}
      {isSuccess && employees.length === 0 && (
        <h2 className="font-bold text-2xl text-center mt-16">
          {" "}
          {t("There ara no employees")}{" "}
        </h2>
      )}

      <Modal
        maxWidth="w-[50rem]"
        isOpen={importModal}
        onClose={() => setImportModal(false)}
      >
        <div className="mt-14 mb-10 flex items-center gap-8">
          <FilesUpload
            files={importFiles}
            setFiles={setImportFiles}
            importedFile={true}
          />
          {/* <input
            type="file"
            name="importFiles"
            id="importFiles"
            onChange={(e) => console.log(e.target.value)}
          /> */}
          <Button
            action={handleImportFiles}
            className="bg-mainGreen text-white ml-9"
          >
            {t("save")}
          </Button>
        </div>
      </Modal>

      {/* ERROR */}
      {/* {failureReason && <p>{failureReason}</p>} */}
    </>
  );
};
