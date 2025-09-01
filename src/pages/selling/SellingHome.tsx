// SellingHome.tsx
import { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { BiLogOut } from "react-icons/bi";
import { authCtx } from "../../context/auth-and-perm/auth";
import { t } from "i18next";
import { sellingCards } from "../../utils/selling";
import SellingHomeCard from "../../components/selling/sellingHomeCard";
import { useIsRTL, useMutate } from "../../hooks";
import logo from "../../assets/altebr_logo.png";
import { IoSettingsOutline } from "react-icons/io5";
import { Button } from "../../components/atoms";
import { useNavigate } from "react-router-dom";
import Audience from "../../assets/audience.svg";
import Departure from "../../assets/departure.svg";
import { notify } from "../../utils/toast";
import { mutateData } from "../../utils/mutateData";
import { useQueryClient } from "@tanstack/react-query";
import { GiCheckMark, GiTakeMyMoney } from "react-icons/gi";
import { formatDate } from "../../utils/date";
import { Modal } from "../../components/molecules";
import { GlobalDataContext } from "../../context/settings/GlobalData";
import { BsDatabase } from "react-icons/bs";
import PremiumImg from "../../assets/premium.svg";

// minimal local types to improve safety without changing your contexts
type Shift = {
  id: number;
  shift_name: string;
  shift_from: string; // "HH:mm" or "HH:mm:ss"
  shift_to: string; // "HH:mm" or "HH:mm:ss"
};
type UserData = {
  id: number;
  name: string;
  branch_id: number;
  branch_name: string;
  is_sellingInvoice?: number;
  workingshifts?: Shift[];
};

const timeToMinutes = (time: string) => {
  // accepts "HH:mm" or "HH:mm:ss"
  const [h = "0", m = "0", s = "0"] = time.split(":");
  const hh = Number(h);
  const mm = Number(m);
  const ss = Number(s);
  if ([hh, mm, ss].some(Number.isNaN)) return NaN;
  return hh * 60 + mm + Math.floor(ss / 60);
};

const isNowInsideShift = (shift: Shift, nowStr: string) => {
  const now = timeToMinutes(nowStr);
  const from = timeToMinutes(shift.shift_from);
  const to = timeToMinutes(shift.shift_to);
  if ([now, from, to].some(Number.isNaN)) return false;
  // normal shift
  if (from <= to) return now >= from && now <= to;
  // overnight shift that crosses midnight
  return now >= from || now <= to;
};

const getNowHMS = () =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());

const readLSBool = (key: string, fallback = false) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) === true : fallback;
  } catch {
    return fallback;
  }
};

const SellingHome = () => {
  const { logOutHandler, userData, isLoggingOut, open, setOpen } =
    useContext(authCtx);
  const typedUser = (userData || {}) as UserData;

  const isRTL = useIsRTL();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isPremium = typedUser?.is_sellingInvoice === 1;

  const [audienceButton, setAudienceButton] = useState<boolean>(() =>
    readLSBool("audience", false)
  );
  const [departureButton, setDepartureButton] = useState<boolean>(() =>
    readLSBool("departure", false)
  );

  const [isDeparture, setIsDeparture] = useState(false);

  const { gold_price } = GlobalDataContext();

  const currentTime = useMemo(getNowHMS, []);

  const shifts = typedUser?.workingshifts || [];

  const currentShift = useMemo(
    () => shifts.find((s) => isNowInsideShift(s, currentTime)),
    [shifts, currentTime]
  );

  useEffect(() => {
    localStorage.setItem("audience", JSON.stringify(audienceButton));
  }, [audienceButton]);

  useEffect(() => {
    localStorage.setItem("departure", JSON.stringify(departureButton));
  }, [departureButton]);

  const { mutate: mutateAudience, isSuccess: isSuccessAudience } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["Audience"],
    onSuccess: () => {
      notify("success");
      queryClient.invalidateQueries({ queryKey: ["all-Audience"] });
    },
    onError: () => {
      notify("error");
    },
  });

  const { mutate: mutateDeparture, isSuccess: isSuccessDeparture } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["departure"],
    onSuccess: () => {
      notify("success");
      queryClient.invalidateQueries({ queryKey: ["all-departure"] });
    },
    onError: () => {
      notify("error");
    },
  });

  const postAudience = useCallback(() => {
    const now = new Date();
    const timeStr = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);
    const dayStr = formatDate(now);

    if (!currentShift) {
      notify("error", `${t("the period does not match the current time")}`);
      return;
    }

    mutateAudience({
      endpointName: "/banchSalary/api/v1/presences",
      values: {
        employee_id: typedUser?.id,
        branch_id: typedUser?.branch_id,
        presences: timeStr,
        day: dayStr,
        is_presence: 1,
        shift_id: currentShift.id,
      },
      method: "post",
    });

    setAudienceButton(true);
  }, [currentShift, mutateAudience, typedUser?.branch_id, typedUser?.id]);

  const postDeparture = useCallback(() => {
    const now = new Date();
    const timeStr = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);
    const dayStr = formatDate(now);

    if (!currentShift) {
      notify("error", `${t("the period does not match the current time")}`);
      return;
    }

    mutateDeparture({
      endpointName: "/banchSalary/api/v1/departures",
      values: {
        employee_id: typedUser?.id,
        branch_id: typedUser?.branch_id,
        departure: timeStr,
        day: dayStr,
        shift_id: currentShift.id,
      },
      method: "post",
    });

    setDepartureButton(true);
    setAudienceButton(false);
  }, [currentShift, mutateDeparture, typedUser?.branch_id, typedUser?.id]);

  const openAudienceModal = () => {
    setIsDeparture(false);
    setOpen(true);
  };
  const openDepartureModal = () => {
    setIsDeparture(true);
    setOpen(true);
  };

  const nf = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 2,
      }),
    []
  );

  return (
    <div className="selling lg:h-screen pb-8 px-4 sm:px-6 lg:px-20">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4 pb-5">
        <div className="bg-slate-100 pb-4 px-4 rounded-b-xl">
          <img src={logo} alt="logo" className="w-10 mt-5" />
        </div>

        <div className="hidden lg:block">
          {isPremium ? (
            <div className="flex items-center gap-2 premiumGoldprice px-4 py-2 rounded-xl">
              <img src={PremiumImg} alt="premium" />
              <h2 className="text-white text-sm font-semibold">
                {t("daily gold price")}
              </h2>
            </div>
          ) : (
            gold_price && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div className="flex items-center bg-mainOrange p-2 rounded-lg text-white text-xs">
                  <BsDatabase className="fill-white" aria-hidden />
                  <p className="border-l border-[#FFA34B] px-1">
                    {t("karat 18")}
                  </p>
                  <p className="px-1">
                    {nf.format(gold_price?.price_gram_18k)}
                  </p>
                </div>

                <div className="flex items-center bg-mainOrange p-2 rounded-lg text-white text-xs">
                  <BsDatabase className="fill-white" aria-hidden />
                  <p className="border-l border-[#FFA34B] px-1">
                    {t("karat 21")}
                  </p>
                  <p className="px-1">
                    {nf.format(gold_price?.price_gram_21k)}
                  </p>
                </div>

                <div className="flex items-center bg-mainOrange p-2 rounded-lg text-white text-xs">
                  <BsDatabase className="fill-white" aria-hidden />
                  <p className="border-l border-[#FFA34B] px-1">
                    {t("karat 22")}
                  </p>
                  <p className="px-1">
                    {nf.format(gold_price?.price_gram_22k)}
                  </p>
                </div>

                <div className="flex items-center bg-mainOrange p-2 rounded-lg text-white text-xs">
                  <BsDatabase className="fill-white" aria-hidden />
                  <p className="border-l border-[#FFA34B] px-1">
                    {t("karat 24")}
                  </p>
                  <p className="px-1">
                    {nf.format(gold_price?.price_gram_24k)}
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        {isPremium && (
          <div className="flex items-center gap-2 premiumGoldprice px-4 py-2 rounded-xl">
            <img src={PremiumImg} alt="premium" />
            <h2 className="text-white text-sm font-semibold">
              {t("daily gold price")}
            </h2>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-start md:gap-2">
          <div className="flex gap-2">
            <span className="text-white">
              {t("welcome")} {typedUser?.name}
            </span>
            <BiLogOut
              className="bg-slate-200 rounded p-1 text-slate-500 cursor-pointer block md:hidden"
              size={30}
              onClick={logOutHandler}
            />
          </div>
          <span className="text-mainOrange">
            {t("branch")} {typedUser?.branch_name}
          </span>
          <BiLogOut
            className="bg-slate-200 rounded p-1 text-slate-500 cursor-pointer hidden md:block"
            size={30}
            onClick={logOutHandler}
          />
        </div>
      </div>

      {!isPremium && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 lg:hidden">
          <div className="flex items-center bg-mainOrange p-2 rounded-lg text-white text-xs">
            <BsDatabase className="fill-white" aria-hidden />
            <p className="border-l border-[#FFA34B] px-1">{t("karat 18")}</p>
            <p className="px-1">{nf.format(gold_price?.price_gram_18k)}</p>
          </div>

          <div className="flex items-center bg-mainOrange p-2 rounded-lg text-white text-xs">
            <BsDatabase className="fill-white" aria-hidden />
            <p className="border-l border-[#FFA34B] px-1">{t("karat 21")}</p>
            <p className="px-1">{nf.format(gold_price?.price_gram_21k)}</p>
          </div>

          <div className="flex items-center bg-mainOrange p-2 rounded-lg text-white text-xs">
            <BsDatabase className="fill-white" aria-hidden />
            <p className="border-l border-[#FFA34B] px-1">{t("karat 22")}</p>
            <p className="px-1">{nf.format(gold_price?.price_gram_22k)}</p>
          </div>

          <div className="flex items-center bg-mainOrange p-2 rounded-lg text-white text-xs">
            <BsDatabase className="fill-white" aria-hidden />
            <p className="border-l border-[#FFA34B] px-1">{t("karat 24")}</p>
            <p className="px-1">{nf.format(gold_price?.price_gram_24k)}</p>
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="py-7 h-4/5 flex flex-col  gap-6 lg:flex-row">
        <div className="flex gap-4 lg:flex-col w-full lg:w-48">
          {sellingCards.slice(0, 2).map((card) => (
            <div
              key={card.route ?? card.title_en ?? card.title_ar}
              className="w-full h-24 lg:h-full"
            >
              <SellingHomeCard
                key={card.route ?? card.title_en ?? card.title_ar}
                icon={card.icon}
                title={isRTL ? card.title_ar : card.title_en}
                route={card.route}
                className=""
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6 flex-1">
          {sellingCards.slice(2).map((card) => (
            <SellingHomeCard
              key={card.route ?? card.title_en ?? card.title_ar}
              icon={card.icon}
              title={isRTL ? card.title_ar : card.title_en}
              route={card.route}
              className=""
            />
          ))}
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap gap-4">
          <Button
            className="bg-transparent flex items-center gap-3 p-0 disabled:border-none"
            action={() => navigate("/selling/branchSetting")}
            disabled={isPremium}
            ariaLabel="Open settings"
          >
            <IoSettingsOutline
              className="bg-slate-200 rounded p-1 text-slate-600"
              size={30}
            />
            <span className="text-white">{t("settings")}</span>
          </Button>

          <Button
            className="bg-transparent flex items-center gap-3 p-0 disabled:border-none"
            action={() => navigate("/selling/balances")}
            disabled={isPremium}
            ariaLabel="Open balances"
          >
            <GiTakeMyMoney
              className="bg-slate-200 rounded p-1 text-slate-600"
              size={30}
            />
            <span className="text-white">{t("balances")}</span>
          </Button>
        </div>

        <div className="flex gap-3">
          <Button
            className="bg-white w-24 flex justify-center items-center"
            action={openAudienceModal}
            disabled={audienceButton || departureButton || isPremium}
            ariaLabel="Register attendance"
          >
            {audienceButton && isSuccessAudience ? (
              <GiCheckMark size={24} className="fill-mainGreen" />
            ) : (
              <img src={Audience} alt="Audience" />
            )}
          </Button>

          <Button
            className="bg-white w-24 flex justify-center items-center"
            action={openDepartureModal}
            disabled={departureButton || isPremium}
            ariaLabel="Register departure"
          >
            {departureButton && isSuccessDeparture ? (
              <GiCheckMark size={24} className="fill-mainGreen" />
            ) : (
              <img src={Departure} alt="Departure" />
            )}
          </Button>
        </div>
      </div>

      {/* Modal */}
      {!isLoggingOut && (
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          maxWidth="w-[95%] sm:w-[70%] lg:w-[40%]"
          blur="backdrop-blur-[1.5px]"
        >
          <div className="text-center mt-3">
            <h2 className="font-bold text-lg mb-6">
              {t("Welcome")}{" "}
              <span className="text-mainGreen">{typedUser?.name}</span>
            </h2>

            {!isDeparture ? (
              <h2 className="font-bold text-lg">
                {t("Attendance must be registered first")}{" "}
                <span className="text-mainGreen">
                  {currentShift?.shift_name}
                </span>
              </h2>
            ) : (
              <h2 className="font-bold text-lg">
                {t("Check out registration")}{" "}
                <span className="text-mainGreen">
                  {currentShift?.shift_name}
                </span>
              </h2>
            )}

            <div className="flex gap-3 mt-8 w-full justify-center">
              {!isDeparture ? (
                <Button
                  className="bg-mainGray w-24 flex justify-center items-center shadow"
                  action={postAudience}
                  disabled={
                    (audienceButton && isSuccessAudience) || departureButton
                  }
                  ariaLabel="Confirm attendance"
                >
                  {audienceButton && isSuccessAudience ? (
                    <GiCheckMark size={24} className="fill-mainGreen" />
                  ) : (
                    <img src={Audience} alt="Audience" />
                  )}
                </Button>
              ) : (
                <Button
                  className="bg-mainGray w-24 flex justify-center items-center shadow"
                  action={postDeparture}
                  disabled={departureButton && isSuccessDeparture}
                  ariaLabel="Confirm departure"
                >
                  {departureButton && isSuccessDeparture ? (
                    <GiCheckMark size={24} className="fill-mainGreen" />
                  ) : (
                    <img src={Departure} alt="Departure" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SellingHome;
