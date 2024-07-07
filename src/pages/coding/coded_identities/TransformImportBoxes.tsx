import { t } from "i18next";
import React from "react";
import { Loading } from "../../../components/organisms/Loading";

interface TransformImportBoxes_TP {
  operationTypeSelect: [];
  itemTransferBoxes: any;
  operationTypeLoading: boolean;
  operationTypeSelectisFetching: boolean;
}

const TransformImportBoxes = ({
  operationTypeSelect,
  itemTransferBoxes,
  operationTypeLoading,
  operationTypeSelectisFetching,
}: TransformImportBoxes_TP) => {
  if (operationTypeLoading || operationTypeSelectisFetching) {
    return <Loading mainTitle={t("loading boxes")} />;
  }

  return (
    <>
      {operationTypeSelect?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {itemTransferBoxes?.map((data: any) => (
            <li
              key={data.id}
              className="flex flex-col h-28 justify-center rounded-xl text-center text-sm font-bold shadow-md"
            >
              <p className="bg-mainGreen p-2 flex items-center justify-center h-[65%] rounded-t-xl text-white">
                {t(`${data.account}`)}
              </p>
              <p className="bg-white px-2 py-2 text-black h-[35%] rounded-b-xl">
                {data.value} <span>{t(`${data.unit}`)}</span>
              </p>
            </li>
          ))}
        </div>
      )}
    </>
  );
};

export default TransformImportBoxes;
