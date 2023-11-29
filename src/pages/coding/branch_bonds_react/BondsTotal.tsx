import { t } from "i18next";
import { numberContext } from "../../../context/settings/number-formatter";
import { useFetch } from "../../../hooks";
import { Loading } from "../../../components/organisms/Loading";
const BondsTotal = () => {
  const { formatReyal } = numberContext();

  // FETCHING DATA FROM API
  const {
    data: bondsTotalsData,
    isLoading,
    isFetching,
    isRefetching,
  } = useFetch({
    queryKey: ["bonds-totals"],
    endpoint: "/identity/api/v1/thwelBond_all_counts",
  });

  console.log(
    "🚀 ~ file: BondsTotal.tsx:11 ~ BondsTotal ~ bondsTotalsData:",
    bondsTotalsData
  );
  const bondsBoxes = [
    {
      account: "total number of gold pieces",
      id: 0,
      value: bondsTotalsData?.gold,
      unit: "piece",
    },
    {
      account: "total number of diamonds pieces",
      id: 1,
      value: bondsTotalsData?.diamond,
      unit: "piece",
    },
    {
      account: "total number of miscellaneous pieces",
      id: 2,
      value: bondsTotalsData?.motafreqat,
      unit: "piece",
    },
    {
      account: "total number of stones in gold",
      id: 3,
      value: bondsTotalsData?.goldAhgar,
      unit: "piece",
    },
    {
      account: "total number of stones in diamond",
      id: 4,
      value: bondsTotalsData?.diamondAhgar,
      unit: "piece",
    },
    {
      account: "total number of stones in miscellaneous",
      id: 5,
      value: bondsTotalsData?.motafreqatAhgar,
      unit: "piece",
    },
    {
      account: "total wages",
      id: 6,
      value: formatReyal(bondsTotalsData?.wages.toFixed(2)),
      unit: "ryal",
    },
    {
      account: "total weight of 18 karat",
      id: 7,
      value: bondsTotalsData?.total18_way2branch,
      unit: "gram",
    },
    {
      account: "total weight of 21 karat",
      id: 8,
      value: bondsTotalsData?.total21_way2branch,
      unit: "gram",
    },
    {
      account: "total weight of 22 karat",
      id: 9,
      value: bondsTotalsData?.total22_way2branch,
      unit: "gram",
    },
    {
      account: "total weight of 24 karat",
      id: 10,
      value: bondsTotalsData?.total24_way2branch,
      unit: "gram",
    },
    {
      account: "total diamond value",
      id: 11,
      value: formatReyal(
        Number(bondsTotalsData?.total_selling_price_diamond.toFixed(2))
      ),
      unit: "ryal",
    },
    {
      account: "total miscellaneous value",
      id: 12,
      value: formatReyal(
        Number(bondsTotalsData?.total_selling_price_accessory.toFixed(2))
      ),
      unit: "ryal",
    },
    {
      account: "total weight of adapter 24",
      id: 12,
      value: Number(bondsTotalsData?.total24_way2branch),
      unit: "ryal",
    },
  ];

  // LOADING ....
  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading items")}`} />;

  return (
    <div className="py-14">
      <h3 className="text-xl font-bold text-slate-700 mb-6">{t("totals")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
        {bondsBoxes?.map((data: any) => (
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
  );
};

export default BondsTotal;
