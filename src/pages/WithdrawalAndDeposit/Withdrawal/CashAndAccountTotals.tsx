import React from "react";
import { numberContext } from "../../../context/settings/number-formatter";
import { t } from "i18next";

const CashAndAccountTotals = () => {
  const { formatReyal } = numberContext();

  const tarqimBoxes = [
    {
      label: "total cash amount",
      id: 0,
      value: formatReyal(20) || "---",
      unit: "ryal",
    },

    {
      label: "total bank account amount",
      id: 2,
      value: formatReyal(30) || "---",
      unit: "ryal",
    },
  ];

  return (
    <div className="py-6">
      <div className="flex justify-center  gap-8">
        {tarqimBoxes?.map((data: any) => (
          <li
            key={data.id}
            className="flex flex-col h-28 justify-center rounded-xl w-80 text-center text-sm font-bold shadow-md"
          >
            <p className="bg-mainGreen p-2 flex items-center justify-center h-[65%] rounded-t-xl text-white">
              {t(`${data.label}`)}
            </p>
            <p className="bg-white px-2 py-2 text-black h-[35%] rounded-b-xl">
              {data.value} <span>{t(`${data.unit}`)}</span>
            </p>
          </li>
        ))}
      </div>
    </div>
  );
};

export default CashAndAccountTotals;
