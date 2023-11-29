import { t } from "i18next";
import { numberContext } from "../../../context/settings/number-formatter";
import { useFetch } from "../../../hooks";
import { Loading } from "../../../components/organisms/Loading";

const TarqeemTotals = () => {
  const { formatReyal } = numberContext();

  // FETCHING DATA FROM API
  const {
    data: tarqeemTotalsData,
    isLoading,
    isFetching,
    isRefetching,
  } = useFetch({
    queryKey: ["tarqeem-totals"],
    endpoint: "identity/api/v1/identity_all_counts",
  });

  const tarqimBoxes = [
    {
      account: "total number of gold pieces",
      id: 0,
      value: tarqeemTotalsData?.gold,
      unit: "piece",
    },
    {
      account: "total number of diamonds pieces",
      id: 1,
      value: tarqeemTotalsData?.diamond,
      unit: "piece",
    },
    {
      account: "total number of miscellaneous pieces",
      id: 2,
      value: tarqeemTotalsData?.motafreqat,
      unit: "piece",
    },
    {
      account: "total number of stones in gold",
      id: 3,
      value: tarqeemTotalsData?.goldAhgar,
      unit: "piece",
    },
    {
      account: "total number of stones in diamond",
      id: 4,
      value: tarqeemTotalsData?.diamondAhgar,
      unit: "piece",
    },
    {
      account: "total number of stones in miscellaneous",
      id: 5,
      value: tarqeemTotalsData?.motafreqatAhgar,
      unit: "piece",
    },
    {
      account: "total wages",
      id: 6,
      value: tarqeemTotalsData?.ogur.toFixed(2),
      unit: "ryal",
    },
    {
      account: "total weight of 18 karat",
      id: 7,
      value: tarqeemTotalsData?.karat_18,
      unit: "gram",
    },
    {
      account: "total weight of 21 karat",
      id: 8,
      value: tarqeemTotalsData?.$karat_21,
      unit: "gram",
    },
    {
      account: "total weight of 22 karat",
      id: 9,
      value: tarqeemTotalsData?.$karat_22,
      unit: "gram",
    },
    {
      account: "total weight of 24 karat",
      id: 10,
      value: tarqeemTotalsData?.$karat_24,
      unit: "gram",
    },
    {
      account: "total diamond value",
      id: 11,
      value: formatReyal(Number(tarqeemTotalsData?.diamondprice.toFixed(2))),
      unit: "ryal",
    },
    {
      account: "total miscellaneous value",
      id: 12,
      value: formatReyal(Number(tarqeemTotalsData?.motafreqatprice.toFixed(2))),
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
  );
};

export default TarqeemTotals;
