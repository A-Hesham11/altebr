import { t } from "i18next";
import { useState } from "react";
import { Button } from "../../../components/atoms";
import TableOfSeperate from "./TableOfSeperate";

const SeperateHwya = () => {
  const [selectedOption, setSelectedOption] = useState("normal supply"); // Initialize the selected option.

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="flex flex-col gap-10 mt-6">
      <h2>
        <span className="text-xl ml-4 font-bold text-slate-700">
          {t("identity and numbering management")}
        </span>
        <span>{t("seperating identities")}</span>
      </h2>

      <div className="flex items-center gap-32 justify-center">
      <Button className="bg-mainGreen w-60 text-white self-end">{t("hwya")}</Button>
      <Button className="bg-mainGreen w-60 text-white self-end">{t("classification name")}</Button>
      </div>

      {/* TABLE OF seperating identities */}
      <TableOfSeperate />

      <Button className="bg-mainGreen text-white self-end">{t("confirm")}</Button>
    </div>
  );
};

export default SeperateHwya;
