import React, { useContext, useEffect, useMemo, useState } from "react";
import { useMutate } from "../../../hooks";
import { ColumnDef } from "@tanstack/react-table";
import { t } from "i18next";
import { useQueryClient } from "@tanstack/react-query";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { Form, Formik } from "formik";
import { Cards_Props_TP } from "../../../components/templates/bankCards/ViewBankCards";
import { EditIcon } from "../../../components/atoms/icons";
import { SvgDelete } from "../../../components/atoms/icons/SvgDelete";
import { AddButton } from "../../../components/molecules/AddButton";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { Button } from "../../../components/atoms";
import { Modal } from "../../../components/molecules";
import AddEmployeeDeductions from "../../../components/templates/employeeDeductions/AddEmployeeDeductions";
import { Header } from "../../../components/atoms/Header";
import { numberContext } from "../../../context/settings/number-formatter";

const ViewDeductions = ({ employeeData }) => {

  const [open, setOpen] = useState<boolean>(false);
  const {  formatReyal } = numberContext();
  const [model, setModel] = useState(false);
  const [action, setAction] = useState({
    edit: false,
    delete: false,
    view: false,
  });
  const [editData, setEditData] = useState<Cards_Props_TP>();
  const [deleteData, setDeleteData] = useState<Cards_Props_TP>();
  const [dataSource, setDataSource] = useState<Cards_Props_TP[]>([]);

  const initialValues = {
    branch_id: "",
  };

  const totalReceivables = employeeData.empEntitlement?.reduce((acc, curr) => {
    acc +=
      curr.entitlement_id === 1
        ? +curr.value * 0.01 * ((employeeData.salary / employeeData.basicNumberOfHours) * employeeData.extraTime)
        : +curr.value;
    return acc;
  }, 0) || 0

  const housingAllowance = employeeData?.empEntitlement?.filter(item => item.entitlement_id === 2)[0]?.value

  const watchPrice = +employeeData.salary / +employeeData.basicNumberOfHours;

  const columns = useMemo<ColumnDef<Cards_Props_TP>[]>(
    () => [
      {
        header: () => <span>{t("employee name")} </span>,
        accessorKey: "employee_name",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("deduction name")} </span>,
        accessorKey: "deduction_name",
        cell: (info) => info.getValue(),
      },
      {
        header: () => <span>{t("value")} </span>,
        accessorKey: "value",
        cell: (info) => {
          const value =
            +info.row.original.deduction_id === 2 // تأمين إجتماعي
              ? ((+info.row.original.value * 0.01) * ((+housingAllowance ? +housingAllowance : 0) + +employeeData.salary) / 2)
              : +info.row.original.deduction_id === 3 //  تأمين مخاطر
              ? ((+info.row.original.value * 0.01) * ((+housingAllowance ? +housingAllowance : 0) + +employeeData.salary))
              : +info.row.original.deduction_id === 1 // خصم
              ? +info.row.original.value *
                0.01 *
                (watchPrice * employeeData.wastedTime)
              : +info.row.original.value;
          return formatReyal(Number(value));
        },
      },
      {
        header: () => <span>{t("actions")}</span>,
        accessorKey: "action",
        cell: (info) => {
          return (
            <div className="flex items-center justify-center gap-4">
              <EditIcon
                action={() => {
                  setOpen((prev) => !prev);
                  setEditData(info.row.original);
                  setAction({
                    edit: true,
                    delete: false,
                    view: false,
                  });
                  setModel(false);
                }}
                className="fill-mainGreen"
              />

              <SvgDelete
                action={() => {
                  setOpen((prev) => !prev);
                  setDeleteData(info.row.original);
                  setAction({
                    delete: true,
                    view: false,
                    edit: false,
                  });
                  setModel(false);
                }}
                stroke="#ef4444"
              />
            </div>
          );
        },
      },
    ],
    []
  );

  const queryClient = useQueryClient();
  const {
    mutate,
    error: mutateError,
    isLoading: mutateLoading,
  } = useMutate<Cards_Props_TP>({
    mutationFn: mutateData,
    onSuccess: () => {
      queryClient.refetchQueries(["employeeDeductions"]);
      setOpen(false);
      notify("success");
    },
  });

  const handleDelete = () => {
    mutate({
      endpointName: `/employeeSalary/api/v1/delete-employee-deduction/${deleteData?.id}`,
      method: "delete",
    });
  };

  return (
    <Formik
      className=""
      initialValues={initialValues}
      onSubmit={(values) => console.log(values)}
    >
      <Form>
        <div className="flex justify-between mb-8 ">
          <p className="font-semibold text-lg mt-2">
            {t("view employee deductions policies")}
          </p>
          <div className="flex gap-2 ">
            <AddButton
              action={() => {
                setEditData(undefined);
                setModel(true);
                setOpen(true);
                setAction({
                  edit: false,
                  delete: false,
                  view: false,
                });
              }}
              addLabel={`${t("add")}`}
            />
          </div>
        </div>

        {employeeData?.empDeduction?.length ? (
          <Table data={employeeData?.empDeduction} columns={columns}>

          </Table>
        ) : (
          !dataSource.length && (
            <div className="flex justify-center items-center mt-32">
              <p className="text-lg font-bold">
                {t("there are no employee deductions policies available yet")}
              </p>
            </div>
          )
        )}

        <Modal isOpen={open} onClose={() => setOpen(false)}>
          {action.edit && (
            <AddEmployeeDeductions
              editData={editData}
              setDataSource={setDataSource}
              setShow={setOpen}
              title={`${editData ? t("edit cards") : t("Add cards")}`}
              deductionsData={employeeData?.empDeduction}
            />
          )}
          {model && (
            <AddEmployeeDeductions
              editData={editData}
              setDataSource={setDataSource}
              setShow={setOpen}
              title={`${editData ? t("edit cards") : t("Add cards")}`}
              deductionsData={employeeData?.empDeduction}
            />
          )}
          {action.delete && (
            <div className="flex flex-col gap-8 justify-center items-center">
              <Header header={` حذف : ${deleteData?.employee_name}`} />
              <div className="flex gap-4 justify-center items-cent">
                <Button
                  loading={mutateLoading}
                  action={handleDelete}
                  variant="danger"
                >
                  {`${t("confirm")}`}
                </Button>
                <Button action={() => setOpen(false)}>{`${t("close")}`}</Button>
              </div>
            </div>
          )}
        </Modal>
      </Form>
    </Formik>
  );
};

export default ViewDeductions;
