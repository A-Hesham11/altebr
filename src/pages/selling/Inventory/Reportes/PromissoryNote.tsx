import Logo from "../../../../assets/bill-logo.png";
import { t } from "i18next";
import { Button } from "../../../../components/atoms";
import { useContext, useMemo, useRef, useState } from "react";
import { authCtx } from "../../../../context/auth-and-perm/auth";
import { useFetch, useIsRTL } from "../../../../hooks";
import { useReactToPrint } from "react-to-print";
import { numberContext } from "../../../../context/settings/number-formatter";
import { useLocation } from "react-router-dom";
import { Form, Formik } from "formik";
import { Select } from "../../../../components/molecules";
import { SelectOption_TP } from "../../../../types";
import { convertNumToArWord } from "../../../../utils/number to arabic words/convertNumToArWord";
import { Table } from "../../../../components/templates/reusableComponants/tantable/Table";

const PromissoryNote = ({
  dataSource,
  reportNumber,
  date,
  reportName,
}: any) => {
  console.log("🚀 ~ LostItemsReports ~ dataSource:", dataSource);
  const { userData } = useContext(authCtx);
  console.log("🚀 ~ userData:", userData);
  const contentRef = useRef();
  const isRTL = useIsRTL();
  const { formatGram, formatReyal } = numberContext();
  const { state } = useLocation();
  const [selectedEmployees, setSelectedEmployees] = useState({});
  console.log("🚀 ~ selectedEmployees:", selectedEmployees);

  const totals = [
    {
      title: t("Gold value"),
      value: formatReyal(dataSource?.assets.cash),
      unit: t("reyal"),
    },
    {
      title: t("diamond value"),
      value: formatReyal(dataSource?.assets.diamond_value),
      unit: t("reyal"),
    },
    {
      title: t("accessory value"),
      value: formatReyal(dataSource?.assets.accessory_value),
      unit: t("reyal"),
    },
    {
      title: t("total wages"),
      value: formatReyal(dataSource?.assets.wages),
      unit: t("reyal"),
    },
    {
      title: t("The value of scrap gold"),
      value: formatReyal(dataSource?.assets.total_weightNewGold_24),
      unit: t("gram"),
    },
    {
      title: t("Total cash"),
      value: formatReyal(dataSource?.assets.totalCash),
      unit: t("reyal"),
    },
  ];

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
        };
      }),
    onError: (err) => console.log(err),
  });
  console.log("🚀 ~ employeesOptions:", employeesOptions);

  const data = [
    {
      name: t("Gold value"),
      amount: formatGram(dataSource?.assets.cash),
      amountAR: convertNumToArWord(Math.round(dataSource?.assets.cash)),
    },
    {
      name: t("diamond value"),
      amount: formatGram(dataSource?.assets.diamond_value),
      amountAR: convertNumToArWord(
        Math.round(dataSource?.assets.diamond_value)
      ),
    },
    {
      name: t("accessory value"),
      amount: formatGram(dataSource?.assets.accessory_value),
      amountAR: convertNumToArWord(
        Math.round(dataSource?.assets.accessory_value)
      ),
    },
    {
      name: t("total wages"),
      amount: formatGram(dataSource?.assets.wages),
      amountAR: convertNumToArWord(Math.round(dataSource?.assets.wages)),
    },
    {
      name: t("The value of scrap gold"),
      amount: formatGram(dataSource?.assets.total_weightNewGold_24),
      amountAR: convertNumToArWord(
        Math.round(dataSource?.assets.total_weightNewGold_24)
      ),
    },
    {
      name: t("Total cash"),
      amount: formatGram(dataSource?.assets.totalCash),
      amountAR: convertNumToArWord(Math.round(dataSource?.assets.totalCash)),
    },
  ];

  const columns = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "name",
        header: () => <span>{t("name")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "amount",
        header: () => <span>{t("amount")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "amountAR",
        header: () => <span>{t("amount in words")}</span>,
      },
    ],
    []
  );

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
    pageStyle: `
      @page {
        size: auto;
        margin: 20px !imporatnt;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .break-page {
          page-break-before: always;
        }
        .rtl {
          direction: rtl;
          text-align: right;
        }
        .ltr {
          direction: ltr;
          text-align: left;
        }
        .container_print {
          width: 100%;
          padding: 20px;
          box-sizing: border-box;
        }
      }
    `,
  });

  return (
    <div className="p-12">
      <div className="flex items-center justify-end">
        <div>
          <Button action={handlePrint}>{t("print")}</Button>
        </div>
      </div>

      <div
        ref={contentRef}
        className={`${isRTL ? "rtl" : "ltr"} container_print`}
      >
        <div className="my-6 grid grid-cols-3 ">
          <div>
            <h2>
              <span className="font-semibold">{t("date")} : </span> {date}
            </h2>
            <h2 className="mt-1.5">
              <span className="font-semibold">{t("Report number")} : </span>{" "}
              {reportNumber}
            </h2>
          </div>
          <div className="flex justify-center flex-col items-center">
            <img src={Logo} alt="logo" className="mx-auto" />
            <h2 className="text-lg font-semibold">
              {t("Lost and Found Report")}
            </h2>
          </div>
          <div className="flex justify-end">
            <p>
              {t("branch number")} : {userData?.branch_id}
            </p>
          </div>
        </div>

        <div className="no-print">
          <h2 className="font-semibold">{t("Totals")}</h2>
          <ul className="grid grid-cols-4 gap-x-8  gap-y-6 my-6">
            {totals?.map((item, index) => (
              <li key={index} className=" text-center">
                <h2 className="bg-mainGreen text-white p-3 rounded-t-xl">
                  {item.title}
                </h2>
                <div className="bg-[#295E560D] border border-mainGreen p-2.5 text-mainGreen rounded-b-xl">
                  <p>
                    <span className="font-semibold">{item.value ?? 0}</span>{" "}
                    {item.unit}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="print-only my-5">
          <Table data={data} columns={columns} />
        </div>

        <div className="bg-white mt-8 p-12 rounded-xl text-[17.3px] no-print">
          <Formik initialValues={{ employees: "" }} onSubmit={() => {}}>
            <Form>
              <div className="w-1/3">
                <Select
                  id="employee_id"
                  label={`${t("Please select the recipient's name.")}`}
                  name="employee_id"
                  placeholder={`${t("Please select the recipient's name.")}`}
                  loadingPlaceholder={`${t("loading")}`}
                  options={employeesOptions}
                  isLoading={employeeLoading}
                  onChange={(option) => {
                    setSelectedEmployees({
                      id: option?.id,
                      value: option?.value || "",
                      label: option?.label || "",
                    });
                  }}
                />
              </div>
            </Form>
          </Formik>
        </div>

        <div className="bg-white mt-8 p-12 rounded-xl text-[17.3px] text-center">
          <span>
            {t("I hereby acknowledge")} /{" "}
            <span className="font-semibold">{selectedEmployees?.label}</span> ,{" "}
            {t("That I have received on behalf of the company")} /{" "}
            <span className="font-semibold">{userData?.branch_name}</span> ,{" "}
            {t("Commercial Registration Number")}{" "}
            <span className="font-semibold">
              {userData?.branch?.zatca_fax_number}
            </span>{" "}
            , {t("And its address")}{" "}
            <span className="font-semibold">{userData?.address}</span>,{" "}
            {t("The total amounts outlined above:")}
          </span>
          <p className="mt-6">
            {t("I hereby commit under this document to the following:")}
          </p>

          <ul className="text-start mt-5 space-y-3 list-disc">
            <li>
              {t(
                "That I have received all the amounts mentioned above in full and in accordance with what was delivered to me."
              )}
            </li>
            <li>
              {t(
                "That I bear all legal and financial responsibilities associated with possessing these amounts as of the date of receipt."
              )}
            </li>
            <li>
              {t(
                "That I commit to using or handling these amounts in accordance with the company's instructions, without any breach or violation."
              )}
            </li>
            <li>
              {t(
                "That I commit to utilizing or handling these amounts in accordance with the company's instructions, without any breach or violation."
              )}
            </li>
          </ul>
        </div>

        <div className="bg-white mt-8 p-11 rounded-xl  flex items-center justify-between  mb-4">
          <div className="text-start">
            <h2 className="font-semibold">{t("Recipient")}</h2>
            <ul className="bg-[#F8F9FB] rounded-xl ps-5 py-5 mt-4 pe-24">
              <li>
                {t("name")} /{" "}
                <span className="text-xl mt-1.5">
                  ............................
                </span>
              </li>
              <li className="my-3.5">
                {t("Id number")} /{" "}
                <span className="text-xl mt-1.5">
                  ............................
                </span>
              </li>
              <li>
                {t("Signature")} /{" "}
                <span className="text-xl mt-1.5">
                  ............................
                </span>
              </li>
            </ul>
          </div>
          <div className="text-start">
            <h2 className="font-semibold">{t("Company Representative")}</h2>
            <ul className="bg-[#F8F9FB] rounded-xl ps-5 py-5 mt-4 pe-24">
              <li>
                {t("name")} /{" "}
                <span className="text-xl mt-1.5">
                  ............................
                </span>
              </li>
              <li className="my-3.5">
                {t("Id number")} / {t("commercial register")} /
                <span className="text-xl mt-1.5">
                  ............................
                </span>
              </li>
              <li>
                {t("Signature")} /{" "}
                <span className="text-xl mt-1.5">
                  ............................
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromissoryNote;
