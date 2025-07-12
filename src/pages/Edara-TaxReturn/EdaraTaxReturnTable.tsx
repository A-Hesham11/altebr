import React from "react";
import { Loading } from "../../components/organisms/Loading";
import { t } from "i18next";
import { Table } from "../../components/templates/reusableComponants/tantable/Table";
import { numberContext } from "../../context/settings/number-formatter";

type EdaraTaxREturnTable_TP = {
  isLoading: boolean;
  isRefetching: boolean;
  isFetching: boolean;
  data: any;
  sellingCols: any;
  buyingCols: any;
  netTotal: any;
  netTax: any;
};

const EdaraTaxReturnTable = ({
  isLoading,
  isRefetching,
  isFetching,
  data,
  sellingCols,
  buyingCols,
  netTotal,
  netTax,
}: EdaraTaxREturnTable_TP) => {
  const { formatReyal } = numberContext();

  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={t("loading")} />;

  return (
    <div>
      {/* selling table */}
      {data && data?.selling?.length > 0 && (
        <div className="pt-6">
          <p className=" bg-slate-300 font-bold text-center p-2">
            {t("selling")}
          </p>
          <Table columns={sellingCols} data={data?.selling || []} />
        </div>
      )}

      {/* buying table */}
      {data && data?.buying?.length > 0 && (
        <div className="pt-6">
          <p className=" bg-slate-300 font-bold text-center p-2">
            {t("purchase")}
          </p>
          <Table columns={buyingCols} data={data?.buying || []} />
        </div>
      )}

      {/* net */}
      <p className="bg-mainOrange/40 p-2 flex justify-between">
        <span className="font-bold mx-4">{t("net")}</span>
        <span className="font-bold text-center mr-32">
          {formatReyal(netTotal)}
        </span>
        <span className="font-bold mx-4 ml-32">{formatReyal(netTax)}</span>
      </p>
    </div>
  );
};

export default EdaraTaxReturnTable;
