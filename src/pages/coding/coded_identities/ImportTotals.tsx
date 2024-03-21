import { t } from "i18next";
import { numberContext } from "../../../context/settings/number-formatter";
import { Loading } from "../../../components/organisms/Loading";

interface importTotals_TP {
  importData: object;
  postIsLoading: boolean;
}

const ImportTotals: React.FC<importTotals_TP> = ({
  importData,
  postIsLoading,
}) => {
  const { formatReyal, formatGram } = numberContext();

  const tarqimBoxes = [
    {
      account: "total wages",
      id: 6,
      value: formatReyal(importData?.totalWage),
      unit: "ryal",
    },
    {
      account: "total weight of 18 karat",
      id: 7,
      value: formatGram(importData?.totalWeightKarat18),
      unit: "gram",
    },
    {
      account: "total weight of 21 karat",
      id: 8,
      value: formatGram(importData?.totalWeightKarat21),
      unit: "gram",
    },
    {
      account: "total weight of 22 karat",
      id: 9,
      value: formatGram(importData?.totalWeightKarat22),
      unit: "gram",
    },
    {
      account: "total weight of 24 karat",
      id: 10,
      value: formatGram(importData?.totalWeightKarat24),
      unit: "gram",
    },
    {
      account: "karat difference",
      id: 10,
      value: formatGram(importData?.karat_diffrence),
      unit: "gram",
    },
    {
      account: "total tax",
      id: 10,
      value: formatReyal(importData?.total_tax),
      unit: "ryal",
    },
    {
      account: "total diamond",
      id: 10,
      value: formatGram(importData?.diamondTotalSellingPrice),
      unit: "gram",
    },
    {
      account: "total motafreqat",
      id: 10,
      value: formatGram(importData?.motafreqatTotalSellingPrice),
      unit: "gram",
    },
  ];

  // LOADING ....
  if (postIsLoading) return <Loading mainTitle={`${t("loading items")}`} />;

  return (
    <div>
      <div className="py-10">
        <h3 className="text-xl font-bold text-slate-700 mb-6">{t("totals")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tarqimBoxes?.map((data: any) => (
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
      </div>
    </div>
  );
};

export default ImportTotals;
