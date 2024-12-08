import { useContext } from "react";
import { GiReceiveMoney } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import Logo from "../assets/altebr_logo.png";
import { AiFillGolden } from "react-icons/ai";
import { BsBank2 } from "react-icons/bs";
import { authCtx } from "../context/auth-and-perm/auth";
import { numberContext } from "../context/settings/number-formatter";
import { useFetch, useIsRTL } from "../hooks";
import { Loading } from "../components/organisms/Loading";
import { Helmet } from "react-helmet-async";
import { FaLongArrowAltLeft } from "react-icons/fa";

const CreditsDetails = () => {
  const { formatReyal } = numberContext();

  const {
    data: balances,
    isLoading,
    refetch,
    isRefetching,
    isFetching,
  } = useFetch({
    queryKey: ["Balances_inEdara"],
    endpoint: `/branchAccount/api/v1/getAccountEdara?per_page=10000`,
  });

  const cleanedBalances = balances?.map((item) => {
    return {
      ...item,
      accountable: item.accountable.replace(/\s*\(\d+\)$/, ""),
    };
  });

  const balancesCash = cleanedBalances?.filter(
    (card) => card.numeric_system == "1301" || card.numeric_system == "1203"
  );

  const balancesGold = cleanedBalances?.filter(
    (card) =>
      card.numeric_system == "12010101" ||
      card.numeric_system == "12010102" ||
      card.numeric_system == "12010103" ||
      card.numeric_system == "12010104" ||
      card.numeric_system == "120201" ||
      card.numeric_system == "120202"
  );

  // const balancesGold = cleanedBalances?.filter(
  //   (card) =>
  //     card.numeric_system == "12010101" ||
  //     card.numeric_system == "12010102" ||
  //     card.numeric_system == "12010103" ||
  //     card.numeric_system == "12010104" ||
  //     card.numeric_system == "120201" ||
  //     card.numeric_system == "120202"
  // );

  const balancesBrokenGold = cleanedBalances?.filter(
    (card) =>
      card.numeric_system == "12010202" ||
      card.numeric_system == "12010203" ||
      card.numeric_system == "12010204" ||
      card.numeric_system == "12010201"
  );

  const balancesBanks = cleanedBalances?.filter((card) =>
    card.numeric_system.includes("1302")
  );

  const supplierCreditReyal = cleanedBalances?.filter(
    (card) => card.numeric_system.includes("2201") && card.unit_id === 1
  );
  console.log(
    "🚀 ~ CreditsDetails ~ supplierCreditReyal:",
    supplierCreditReyal
  );

  const supplierCreditGram = cleanedBalances?.filter(
    (card) => card.numeric_system.includes("2201") && card.unit_id === 2
  );
  console.log("🚀 ~ CreditsDetails ~ supplierCreditGram:", supplierCreditGram);

  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={t("balances")} />;

  return (
    <div className="min-h-screen pb-8">
      <h2 className="text-black text-xl font-semibold mb-5">{t("balances")}</h2>

      <div>
        <h2 className="mb-8 font-semibold text-xl text-mainGreen rounded-md">
          <span className="border-b-2 border-mainGreen pb-1.5">
            {t("monetary")}
          </span>
        </h2>
        <div className="grid grid-cols-4 gap-y-8 gap-x-4 lg:gap-x-6">
          {balancesCash
            ?.slice()
            ?.reverse()
            ?.map((card) => (
              <div
                className={`bg-mainGreen font-bold text-white rounded-xl flex flex-col items-center justify-center cursor-pointer h-full py-3`}
              >
                <div className="flex gap-5 items-center">
                  <div className="w-12 h-12 bg-mainOrange flex justify-center items-center rounded-full">
                    <GiReceiveMoney size={35} className="fill-white" />
                  </div>
                  <div>
                    <p className="mb-3">{card.accountable}</p>
                    <p>
                      {formatReyal(Number(card.debtor - card.creditor))}{" "}
                      <span>{card.unit}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div>
        <h2 className="my-8 font-semibold text-xl text-mainGreen rounded-md">
          <span className="border-b-2 border-mainGreen pb-1.5">
            {t("gold")}
          </span>
        </h2>
        <div className="grid grid-cols-4 gap-y-8 gap-x-4 lg:gap-x-6">
          {balancesGold?.map((card) => (
            <div
              className={`bg-mainGreen text-white font-semibold rounded-xl flex flex-col items-center justify-center cursor-pointer h-full p-3`}
            >
              <div className="flex gap-5 items-center">
                <div className="w-12 h-12 bg-mainOrange flex justify-center items-center rounded-full">
                  <AiFillGolden size={30} className="fill-white" />
                </div>
                <div>
                  <p className="mb-3">{card.accountable}</p>
                  <p>
                    {formatReyal(Number(card.debtor - card.creditor))}{" "}
                    <span>{card.unit}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="my-8 font-semibold text-xl text-mainGreen rounded-md">
            <span className="border-b-2 border-mainGreen pb-1.5">
              {t("Recycled Gold")}
            </span>
          </h2>
          <div className="grid grid-cols-4 gap-y-8 mt-8 gap-x-4 lg:gap-x-6">
            {balancesBrokenGold?.map((card) => (
              <div
                className={`bg-mainGreen text-white font-semibold rounded-xl flex flex-col items-center justify-center cursor-pointer h-full p-3`}
              >
                <div className="flex gap-5 items-center">
                  <div className="w-12 h-12 bg-mainOrange flex justify-center items-center rounded-full">
                    <AiFillGolden size={30} className="fill-white" />
                  </div>
                  <div>
                    <p className="mb-3">{card.accountable}</p>
                    <p>
                      {formatReyal(Number(card.debtor - card.creditor))}{" "}
                      <span>{card.unit}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="my-8 font-semibold text-xl text-mainGreen rounded-md">
          <span className="border-b-2 border-mainGreen pb-1.5">
            {t("banks")}
          </span>
        </h2>
        <div className="grid grid-cols-4 gap-y-8 gap-x-4 lg:gap-x-6">
          {balancesBanks?.map((card) => (
            <div
              className={`bg-mainGreen text-white font-bold rounded-xl flex flex-col items-center justify-center cursor-pointer h-full py-3`}
            >
              <div className="flex gap-5 items-center">
                <div className="w-12 h-12 bg-mainOrange flex justify-center items-center rounded-full">
                  <BsBank2 size={30} className="fill-white" />
                </div>
                <div>
                  <p className="mb-3">{card.accountable}</p>
                  <p>
                    {formatReyal(Number(card.debtor - card.creditor))}{" "}
                    <span>{card.unit}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="my-8 font-semibold text-xl text-mainGreen rounded-md">
          <span className="border-b-2 border-mainGreen pb-1.5">
            {t("supplier")}
          </span>
        </h2>

        <div>
          <div>
            <div className="flex items-center my-8 gap-x-2">
              <FaLongArrowAltLeft size={22} className="text-mainGreen mt-0.5" />
              <p className="font-semibold text-xl text-mainGreen rounded-md">
                {t("reyal")}
              </p>
            </div>
            <div className="grid grid-cols-4 gap-y-8 gap-x-4 lg:gap-x-6">
              {supplierCreditReyal?.map((card) => (
                <div
                  className={`bg-mainGreen text-white font-bold rounded-xl flex flex-col items-center justify-center cursor-pointer h-full py-3`}
                >
                  <div className="flex gap-5 items-center">
                    <div className="w-12 h-12 bg-mainOrange flex justify-center items-center rounded-full">
                      <BsBank2 size={30} className="fill-white" />
                    </div>
                    <div>
                      <p className="mb-3">{card.accountable}</p>
                      <p>
                        {formatReyal(Number(card.creditor - card.debtor))}{" "}
                        <span>{card.unit}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center my-8 gap-x-2">
              <FaLongArrowAltLeft size={22} className="text-mainGreen mt-0.5" />
              <p className="font-semibold text-xl text-mainGreen rounded-md">
                {t("gram")}
              </p>
            </div>
            <div className="grid grid-cols-4 gap-y-8 gap-x-4 lg:gap-x-6">
              {supplierCreditGram?.map((card) => (
                <div
                  className={`bg-mainGreen text-white font-bold rounded-xl flex flex-col items-center justify-center cursor-pointer h-full py-3`}
                >
                  <div className="flex gap-5 items-center">
                    <div className="w-12 h-12 bg-mainOrange flex justify-center items-center rounded-full">
                      <BsBank2 size={30} className="fill-white" />
                    </div>
                    <div>
                      <p className="mb-3">{card.accountable}</p>
                      <p>
                        {formatReyal(Number(card.creditor - card.debtor))}{" "}
                        <span>{card.unit}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditsDetails;
