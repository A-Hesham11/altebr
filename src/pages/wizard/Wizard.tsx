import { t } from "i18next";
import React, { useState } from "react";
import "react-form-wizard-component/dist/style.css";
import { useIsRTL } from "../../hooks";
import { Button } from "../../components/atoms";
import { AddEmployee } from "../../components/templates/employee/AddEmployee";

const Wizard = () => {
  const isRTL = useIsRTL();
  const [stage, setStage] = useState<number>(0);

  //   <AddEmployee
  //   title={`${editEmployeeData ? t("edit employee") : t("add employee")}`}
  //   editEmployeeData={editEmployeeData}
  // />

  const steps = [
    { title: "add employee", desc: <AddEmployee title={t("")} /> },
    { title: "add supplier", desc: "add supplier" },
    { title: "add branch", desc: "add branch" },
    { title: "add", desc: "add" },
  ];

  return (
    <>
      <div className="m-12">
        <div className={`flex flex-row items-center justify-between`}>
          {steps.map((step, index) => {
            return (
              <>
                <div
                  key={index}
                  className={`${
                    index !== steps.length - 1 ? "w-full" : "w-fit"
                  } flex flex-col items-start`}
                >
                  <div className={`flex items-center w-full`}>
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        stage == index
                          ? "border-2 border-mainGreen text-mainGreen"
                          : stage > index
                          ? "bg-mainGreen text-white"
                          : "bg-gray-200 border-1 border-mainGreen text-gray-800"
                      }`}
                    >
                      {stage > index ? "✔" : index + 1}
                    </div>
                    <div className="flex items-center mx-1 w-full">
                      <span
                        className={`${isRTL ? "text-right" : "text-left"} ${
                          stage >= index ? "text-mainGreen" : ""
                        } whitespace-nowrap font-semibold`}
                      >
                        {t(step.title)}
                      </span>
                      <div
                        className={`${
                          index !== steps.length - 1 &&
                          `${
                            stage > index ? "bg-mainGreen" : "bg-[#C8C8C8]"
                          } h-[2px] w-full mx-1 mt-2`
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>

        <div className="my-6">
          {steps.map((step, index) => {
            return (
              <>
                <div>{stage == index && <div>{step.desc}</div>}</div>
              </>
            );
          })}
        </div>

        <div className="flex items-center justify-between flex-row">
          <Button
            action={() => setStage((prev) => prev - 1)}
            disabled={stage < 1}
          >
            {t("back")}
          </Button>
          <Button action={() => setStage((prev) => prev + 1)}>
            {t("next")}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Wizard;
