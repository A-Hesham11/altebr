import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useFetch } from "../../../hooks";
import { authCtx } from "../../../context/auth-and-perm/auth";
import { t } from "i18next";
import Inventory from "../../../assets/inventory.svg";
import { Button } from "../../atoms";

const IdentityInformationInBranch = ({
  selectedItem,
  setSelectedItem,
}: any) => {
  const { userData } = useContext(authCtx);

  const listItems = [
    { label: "hwya", value: selectedItem?.hwya ?? "---" },
    { label: "category", value: selectedItem?.classification_name ?? "---"},
    { label: "classification", value: selectedItem?.category_name ?? "---" },
    { label: "weight", value: selectedItem?.weight ?? "---" },
    { label: "karat", value: selectedItem?.karat_name ?? "---" },
  ];

  return (
    <div>
      <h2 className="bg-[#838383] rounded-t-2xl py-6 text-center text-white font-semibold">
        {t("Identity information")}
      </h2>

      <div className="bg-white rounded-b-2xl pb-5 pt-3">
        <div className="mb-5 flex items-center justify-center">
          <img src={Inventory} alt="img" className="w-56 h-56 rounded-xl" />
        </div>

        <ul className="mx-auto w-4/5">
          {listItems.map(({ label, value }, index) => (
            <li key={index} className="grid grid-cols-2 border-b">
              <h2 className="bg-[#FAFAFA] text-center border-e py-2">
                {t(label)}
              </h2>
              <p className="text-center bg-white py-2">{value}</p>
            </li>
          ))}
        </ul>

        <Button bordered className="block mx-auto mt-8">
          {t("View identity details")}
        </Button>
      </div>
    </div>
  );
};

export default IdentityInformationInBranch;
