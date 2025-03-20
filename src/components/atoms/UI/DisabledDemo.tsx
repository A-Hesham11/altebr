import { t } from "i18next";
import React from "react";
import { FaCubes } from "react-icons/fa";

interface DisabledDemoProps {
  title: string;
}

const DisabledDemo: React.FC<DisabledDemoProps> = ({ title }) => {
  return (
    <div className="flex gap-3 justify-center items-center rounded-lg p-2 bg-mainGray cursor-not-allowed relative overflow-hidden">
      <div className="bg-[#00000040] absolute top-0 left-0 w-full h-full"></div>
      <FaCubes className="text-mainGreen" size={25} />
      <p className="text-mainGreen">{t(title)}</p>
    </div>
  );
};

export default DisabledDemo;
