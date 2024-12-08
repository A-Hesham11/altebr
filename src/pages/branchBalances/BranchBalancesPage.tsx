import React, { useContext } from "react";
import { GiReceiveMoney } from "react-icons/gi";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useFetch, useIsRTL } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import Logo from "../../assets/altebr_logo.png";
import { numberContext } from "../../context/settings/number-formatter";
import { AiFillGolden } from "react-icons/ai";
import { BsBank2 } from "react-icons/bs";
import { Loading } from "../../components/organisms/Loading";

const BranchBalancesPage = () => {
  const { userData } = useContext(authCtx);
  const navigate = useNavigate();
  const { formatGram, formatReyal, digits_count } = numberContext();

  const {
    data: balances,
    isLoading,
    refetch,
    isRefetching,
    isFetching,
  } = useFetch({
    queryKey: ["Balances"],
    endpoint: `/branchAccount/api/v1/BranchTrigger/${userData?.branch_id}?per_page=10000`,
  });

  const balancesCash = balances?.filter(
    (card) => card.numeric_system == "1301" || card.numeric_system == "1203"
  );

  const balancesGold = balances?.filter(
    (card) =>
      card.numeric_system == "12010101" ||
      card.numeric_system == "12010102" ||
      card.numeric_system == "12010103" ||
      card.numeric_system == "12010104" ||
      card.numeric_system == "120201" ||
      card.numeric_system == "120202"
  );

  const balancesBrokenGold = balances?.filter(
    (card) =>
      card.numeric_system == "12010202" ||
      card.numeric_system == "12010203" ||
      card.numeric_system == "12010204" ||
      card.numeric_system == "12010201"
    // card.numeric_system == "12010103" ||
    // card.numeric_system == "12010104" ||
    // card.numeric_system == "120201" ||
    // card.numeric_system == "120202"
  );

  const balancesBanks = balances?.filter((card) =>
    card.numeric_system.includes("1302")
  );

  const isRTL = useIsRTL();

    if (isLoading || isRefetching || isFetching)
      return <Loading mainTitle={t("balances")} />;

  return (
    <div className="selling min-h-screen pb-8 px-16">
      <div className="flex justify-between pb-5 items-end px-20">
        <div className="bg-slate-100 pb-4 px-4 rounded-b-xl">
          <img src={Logo} alt="logo" className="w-[50px] mt-5" />
        </div>
        <h2 className="text-center font-bold md:text-xl text-white">
          {t("welcome")}
          <span className="text-mainOrange">
            {" "}
            {t("branch")} {userData?.branch_name}
          </span>
        </h2>
        <div className="flex justify-end items-center gap-2 ">
          <span
            className="text-white cursor-pointer font-semibold text-lg"
            onClick={() => navigate("/")}
          >
            {t("home")}
          </span>
        </div>
      </div>
      <div className="m-auto px-20 mt-8">
        <h2 className="mb-8 font-semibold text-xl text-white rounded-md">
          <span className="border-b-2 border-white pb-1.5">
            {t("monetary")}
          </span>
        </h2>
        <div className="grid grid-cols-4 gap-y-8 gap-x-4 lg:gap-x-6">
          {balancesCash
            ?.slice()
            ?.reverse()
            ?.map((card) => (
              <div
                className={` bg-white text-black font-bold  rounded-xl flex flex-col items-center justify-center cursor-pointer h-full py-3`}
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

      <div className="m-auto px-20 mt-8">
        <h2 className="mb-8 font-semibold text-xl text-white rounded-md">
          <span className="border-b-2 border-white pb-1.5">{t("gold")}</span>
        </h2>
        <div className="grid grid-cols-4 gap-y-8 gap-x-4 lg:gap-x-6">
          {balancesGold?.map((card) => (
            <div
              className={` bg-white text-black font-semibold rounded-xl flex flex-col items-center justify-center cursor-pointer h-full p-3`}
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
        <div className="grid grid-cols-4 gap-y-8 mt-8 gap-x-4 lg:gap-x-6">
          {balancesBrokenGold?.map((card) => (
            <div
              className={` bg-white text-black font-semibold rounded-xl flex flex-col items-center justify-center cursor-pointer h-full p-3`}
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

      <div className="m-auto px-20 mt-8">
        <h2 className="mb-8 font-semibold text-xl text-white rounded-md">
          <span className="border-b-2 border-white pb-1.5">{t("banks")}</span>
        </h2>
        <div className="grid grid-cols-4 gap-y-8 gap-x-4 lg:gap-x-6">
          {balancesBanks?.map((card) => (
            <div
              className={` bg-white text-black font-bold  rounded-xl flex flex-col items-center justify-center cursor-pointer h-full py-3`}
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
    </div>
  );
};

export default BranchBalancesPage;
