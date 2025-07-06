import React, { useMemo } from "react";
import { t } from "i18next";
import { numberContext } from "../../context/settings/number-formatter";

const CashTransferEntry = ({ boxes, currentBox }: any) => {
  const { formatGram, formatReyal } = numberContext();

  // FOR TABLE ACCOUNTING ENTRY
  let restrictions = boxes?.map(
    ({ account, computational_movement, unit_id, value }) => ({
      bian: account,
      debtor_SRA:
        computational_movement === "debtor" && unit_id === ("ريال" || "reyal")
          ? value
          : 0,
      creditor_SRA:
        computational_movement === "creditor" && unit_id === ("ريال" || "reyal")
          ? value
          : 0,
    })
  );

  const restrictionsWithoutTotals = restrictions?.reduce((prev, curr) => {
    prev.push(curr);

    return prev;
  }, [] as typeof restrictions);

  restrictions = restrictionsWithoutTotals;

  let restrictionsTotals;
  if (restrictions && !!restrictions.length) {
    restrictionsTotals = restrictions?.reduce((prev, curr) => ({
      bian: `${t("totals")}`,
      debtor_gram: prev.debtor_gram + curr.debtor_gram,
      debtor_SRA: prev.debtor_SRA + curr.debtor_SRA,
      creditor_gram: prev.creditor_gram + curr.creditor_gram,
      creditor_SRA: prev.creditor_SRA + curr.creditor_SRA,
    }));
  }

  if (restrictionsTotals) restrictions?.push(restrictionsTotals!);

  return (
    <div className="mt-8">
      <div
        className={`
     w-full flex flex-col gap-4`}
      >
        <table className="min-w-full text-center">
          <thead className="border-b bg-mainGreen">
            <tr>
              <th className="px-6 py-4 text-sm font-medium text-white">
                {t("description")}
              </th>
              <th className="px-6 py-4 text-sm font-medium text-white">
                {t("reyal (debtor)")}
              </th>
              <th className="px-6 py-4 text-sm font-medium text-white">
                {t("reyal (creditor)")}
              </th>
            </tr>
          </thead>
          <tbody>
            {restrictions?.map((restriction, i) => {
              return (
                <>
                  <tr key={i} className="border-b">
                    <td
                      className={`whitespace-nowrap px-6 py-4 text-sm font-light ${
                        i == boxes.length - 0
                          ? "!bg-mainGreen !text-white"
                          : "!bg-lightGreen !text-gray-900"
                      } `}
                    >
                      {restriction.bian}
                    </td>
                    <td
                      className={`whitespace-nowrap px-6 py-4 text-sm font-light ${
                        i == boxes.length - 0
                          ? "!bg-mainGreen !text-white"
                          : "!bg-lightGreen !text-gray-900"
                      } `}
                    >
                      {formatReyal(restriction.debtor_SRA)}
                    </td>
                    <td
                      className={`whitespace-nowrap px-6 py-4 text-sm font-light ${
                        i == boxes.length - 0
                          ? "!bg-mainGreen !text-white"
                          : "!bg-lightGreen !text-gray-900"
                      } `}
                    >
                      {formatReyal(restriction.creditor_SRA)}
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CashTransferEntry;
