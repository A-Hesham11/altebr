import { t } from "i18next";
import { numberContext } from "../../../../context/settings/number-formatter";

const TableEntry = ({
  item,
  isSameCollection,
}: {
  item?: {};
  isSameCollection?: boolean;
}) => {
  const { formatGram, formatReyal } = numberContext();

  // FOR TABLE ACCOUNTING ENTRY
  let restrictions = item.boxes?.map(
    ({ account, computational_movement, unit_id, value }) => ({
      bian: account,
      debtor_gram:
        computational_movement === "debtor" && unit_id === ("جرام" || "gram")
          ? value
          : 0,
      debtor_SRA:
        computational_movement === "debtor" && unit_id === ("ريال" || "reyal")
          ? value
          : 0,
      creditor_gram:
        computational_movement === "creditor" && unit_id === ("جرام" || "gram")
          ? value
          : 0,
      creditor_SRA:
        computational_movement === "creditor" && unit_id === ("ريال" || "reyal")
          ? value
          : 0,
    })
  );

  // group by account

  const sameCollection = restrictions?.reduce((prev, curr) => {
    const index = prev.findIndex((item) => item.bian === curr.bian);
    if (index === -1) {
      prev.push(curr);
    } else {
      prev[index].debtor_gram += curr.debtor_gram;
      prev[index].debtor_SRA += curr.debtor_SRA;
      prev[index].creditor_gram += curr.creditor_gram;
      prev[index].creditor_SRA += curr.creditor_SRA;
    }
    return prev;
  }, [] as typeof restrictions);

  const differentCollection = restrictions?.reduce((prev, curr) => {
    prev.push(curr);
    return prev;
  }, [] as typeof restrictions);

  const restrictionsWithoutTotals = isSameCollection
    ? sameCollection
    : differentCollection;

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
      <h2 className="text-xl mb-5 font-bold">{t("accounting entry")}</h2>
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
                {t("gram (debtor)")}
              </th>
              <th className="px-6 py-4 text-sm font-medium text-white">
                {t("reyal (debtor)")}
              </th>
              <th className="px-6 py-4 text-sm font-medium text-white">
                {t("gram (creditor)")}
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
                        i == restrictions.length - 1
                          ? "!bg-mainGreen !text-white"
                          : "!bg-lightGreen !text-gray-900"
                      } `}
                    >
                      {restriction.bian}
                    </td>
                    <td
                      className={`whitespace-nowrap px-6 py-4 text-sm font-light ${
                        i == restrictions.length - 1
                          ? "!bg-mainGreen !text-white"
                          : "!bg-lightGreen !text-gray-900"
                      } `}
                    >
                      {restriction.debtor_gram > 1
                        ? formatGram(restriction.debtor_gram)
                        : restriction.debtor_gram}
                    </td>
                    <td
                      className={`whitespace-nowrap px-6 py-4 text-sm font-light ${
                        i == restrictions.length - 1
                          ? "!bg-mainGreen !text-white"
                          : "!bg-lightGreen !text-gray-900"
                      } `}
                    >
                      {restriction.debtor_SRA > 1
                        ? formatReyal(restriction.debtor_SRA)
                        : restriction.debtor_SRA}
                    </td>
                    <td
                      className={`whitespace-nowrap px-6 py-4 text-sm font-light ${
                        i == restrictions.length - 1
                          ? "!bg-mainGreen !text-white"
                          : "!bg-lightGreen !text-gray-900"
                      } `}
                    >
                      {restriction.creditor_gram > 1
                        ? formatGram(restriction.creditor_gram)
                        : restriction.creditor_gram}
                    </td>
                    <td
                      className={`whitespace-nowrap px-6 py-4 text-sm font-light ${
                        i == restrictions.length - 1
                          ? "!bg-mainGreen !text-white"
                          : "!bg-lightGreen !text-gray-900"
                      } `}
                    >
                      {restriction.creditor_SRA > 1
                        ? formatReyal(restriction.creditor_SRA)
                        : restriction.creditor_SRA}
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

export default TableEntry;
