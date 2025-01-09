import { useContext, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Button } from "../../atoms";
import { SelectOption_TP } from "../../../types";
import { useFetch, useMutate } from "../../../hooks";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { t } from "i18next";
import { Form, Formik } from "formik";
import { Select } from "../../molecules";
import { formatDate } from "../../../utils/date";
import { Loading } from "../../organisms/Loading";

const SelectEmployeesModal = ({
  editEmployees,
  setOpen,
  refetch,
  open,
}: any) => {
  const [selectedEmployees, setSelectedEmployees] = useState(
    editEmployees?.employe ?? []
  );
  console.log("🚀 ~ selectedEmployees:", selectedEmployees);
  const { userData } = useContext(authCtx);

  const { data: nextbond } = useFetch<any[]>({
    endpoint: `/inventory/api/v1/nextbond`,
    queryKey: ["nextbond"],
    enabled: !editEmployees.report_number && !!open,
  });

  const {
    data: employeesOptions,
    isLoading: employeeLoading,
    refetch: refetchEmployees,
  } = useFetch<SelectOption_TP[]>({
    endpoint: `/employeeSalary/api/v1/employee-per-branch/${userData?.branch_id}?per_page=10000`,
    queryKey: ["employees_Inventory"],
    select: (employees) =>
      employees.map((employee) => {
        return {
          id: employee.id,
          value: employee.id || "",
          label: employee.name || "",
          is_start: 0,
        };
      }),
    onError: (err) => console.log(err),
  });

  const handleSuccess = () => {
    setOpen(false);
    notify("success");
    refetch();
  };

  const { mutate, isLoading } = useMutate({
    mutationFn: mutateData,
    onSuccess: handleSuccess,
  });

  const { mutate: mutateEditEmployees, isLoading: isLoadingEdit } = useMutate({
    mutationFn: mutateData,
    onSuccess: handleSuccess,
  });

  return (
    <div>
      <h2 className="text-lg font-semibold pb-2">
        {editEmployees.id
          ? t("Update an inventory process")
          : t("Create an inventory process")}
      </h2>
      <div className="flex items-center justify-between my-6">
        <h2 className="text-lg font-semibold">
          {t("Please select the names of the employees:")}
        </h2>
        <p className="text-lg font-semibold">
          {t("Report number")} :
          <span className="text-mainOrange">
            {editEmployees?.report_number ?? nextbond?.inventory_bond_number}
          </span>
        </p>
      </div>

      <Formik initialValues={{ employees: "" }} onSubmit={() => {}}>
        <Form>
          <div className="w-1/3">
            <Select
              id="employee_id"
              label={`${t("employee")}`}
              name="employee_id"
              placeholder={`${t("employee")}`}
              loadingPlaceholder={`${t("loading")}`}
              options={employeesOptions}
              isLoading={employeeLoading}
              onChange={(option) => {
                setSelectedEmployees((prev) => {
                  const exists = prev.some(
                    (employee) => employee.value === option.value
                  );
                  if (!exists) {
                    return [...prev, option];
                  }
                  return prev;
                });
              }}
            />
          </div>
        </Form>
      </Formik>

      <div className="flex items-center flex-wrap gap-x-5">
        {selectedEmployees?.map((employe) => (
          <div className="flex mt-8" key={employe.id}>
            <p className="bg-[#EAEFEE] text-mainGreen px-5 py-2 text-lg rounded-r-xl">
              {employe.label}
            </p>
            <div
              className={`bg-mainGreen px-3 py-2 rounded-l-xl ${
                employe.is_start === 0 ? "cursor-pointer" : "cursor-not-allowed"
              }`}
              onClick={() => {
                const updatedEmployees = selectedEmployees?.filter(
                  (item) => item.id !== employe.id
                );
                if (employe.is_start === 0) {
                  setSelectedEmployees(updatedEmployees);
                } else {
                  notify(
                    "info",
                    `${t("The employee cannot be deleted during inventory.")}`
                  );
                }
              }}
            >
              <IoIosCloseCircleOutline size={32} className="text-white" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <Button
          action={() => {
            if (!!editEmployees.id) {
              mutateEditEmployees({
                endpointName: `/inventory/api/v1/update/${editEmployees.id}`,
                values: {
                  items: selectedEmployees?.map((item) => ({
                    employee_id: item.id,
                    branch_id: userData?.branch_id,
                  })),
                },
              });
            } else {
              mutate({
                endpointName: "/inventory/api/v1/create",
                values: {
                  bond: {
                    date: formatDate(new Date()),
                    branch_id: userData?.branch_id,
                    employee_id: userData?.id,
                  },
                  items: selectedEmployees?.map((item) => ({
                    employee_id: item.id,
                    branch_id: userData?.branch_id,
                  })),
                },
              });
            }
          }}
          loading={isLoading || isLoadingEdit}
        >
          {editEmployees.id
            ? t("Update an inventory process")
            : t("Create an inventory process")}
        </Button>
      </div>
    </div>
  );
};

export default SelectEmployeesModal;
