import { useContext, useEffect, useState } from "react";
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
import { GiCheckMark } from "react-icons/gi";
import { formatDate } from "../../utils/date";
import { Modal } from "../../components/molecules";
import { SellingModal } from "../../components/molecules/SellingModal";

const SellingHome = () => {
  const { logOutHandler, userData, isLoggingOut, open, setOpen } =
    useContext(authCtx);

  console.log("🚀 ~ SellingHome ~ userData:", userData);

  const isRTL = useIsRTL();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [audienceButton, setAudienceButton] = useState(
    localStorage.getItem("audience")
  );
  const [departureButton, setDepartureButton] = useState(
    localStorage.getItem("departure")
  );

  const [isDeparture, setIsDeparture] = useState(false);

  const { mutate: mutateAudience } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["Audience"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["all-Audience"]);
    },
    onError: (error) => {
      console.log(error);
      notify("error");
    },
  });

  // Assuming currentTime is in the format 'HH:mm:ss'
  const targetTime = new Date(); // Replace this with the actual current time
  const currentTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(targetTime);

  const shifts = userData?.workingshifts || [];
  console.log("🚀 ~ SellingHome ~ shifts:", shifts);

  // Function to check if the current time is between shift_from and shift_to
  function isTimeBetween(shift) {
    const shiftFrom = new Date(`2000-01-01 ${shift.shift_from}`);
    const shiftTo = new Date(`2000-01-01 ${shift.shift_to}`);
    const currentTimeDate = new Date(`2000-01-01 ${currentTime}`);

    return currentTimeDate >= shiftFrom && currentTimeDate <= shiftTo;
  }

  // Find the shift that matches the condition
  const currentShift = shifts && shifts?.find(isTimeBetween);
  console.log("🚀 ~ SellingHome ~ currentShift:", currentShift)

  // Print the result
  if (currentShift) {
    console.log("Current shift:", currentShift);
  } else {
    console.log("No shift currently");
  }

  const { mutate: mutateDeparture } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["departure"],
    onSuccess: (data) => {
      notify("success");
      queryClient.refetchQueries(["all-departure"]);
    },
    onError: (error) => {
      console.log(error);
      notify("error");
    },
  });

  useEffect(() => {
    if (isLoggingOut === false) {
      localStorage.setItem("departure", false);
      setDepartureButton(localStorage.getItem("departure"));
    }
  }, []);

  function PostNewCardAudience(values: any) {
    mutateAudience({
      endpointName: "/banchSalary/api/v1/presences",
      values,
      method: "post",
    });
  }

  function PostNewCardDeparture(values: any) {
    mutateDeparture({
      endpointName: "/banchSalary/api/v1/departures",
      values,
      method: "post",
    });
  }

  return (
    <div className="selling h-screen pb-8 px-16">
      <div className="flex justify-between pb-5 items-end px-20">
        <div className="bg-slate-100 pb-4 px-4 rounded-b-xl">
          <img src={logo} alt="logo" className="w-[50px] mt-5" />
        </div>
        <h2 className="text-center font-bold md:text-xl text-white">
          {t("welcome")}
          <span className="text-mainOrange">
            {" "}
            {t("branch")} {userData?.branch_name}
          </span>
        </h2>
        <div className="flex justify-end items-center gap-2 ">
          <span className="text-white">
            {t("welcome")} {userData?.name}
          </span>
          <BiLogOut
            className="bg-slate-200 rounded p-1 text-slate-500 cursor-pointer"
            size={30}
            onClick={logOutHandler}
          />
        </div>
      </div>

      <div className="flex h-[80%] justify-center py-7 gap-y-8 gap-x-6 lg:gap-x-8">
        <div className="flex flex-col gap-8 w-40">
          {sellingCards.slice(0, 2).map((card) => (
            <SellingHomeCard
              icon={card.icon}
              title={isRTL ? card.title_ar : card.title_en}
              route={card.route}
              className=""
              key={crypto.randomUUID()}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 w-3/4 gap-y-8 gap-x-6 lg:gap-x-8">
          {sellingCards.slice(2).map((card) => (
            <SellingHomeCard
              icon={card.icon}
              title={isRTL ? card.title_ar : card.title_en}
              route={card.route}
              className=""
              key={crypto.randomUUID()}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center gap-2 cursor-pointer px-20 bl">
        <Button
          className="bg-transparent flex items-center gap-3 p-0"
          action={() => {
            navigate("/selling/branchSetting");
          }}
        >
          <IoSettingsOutline
            className="bg-slate-200 rounded p-1 text-slate-500 cursor-pointer"
            size={30}
          />
          <span className="text-white">{t("settings")}</span>
        </Button>

        <div className="flex gap-3">
          {/* <Button
            className="bg-white w-24 flex justify-center items-center"
            action={() => {
              const currentDate = new Date();
              const currentTime = new Intl.DateTimeFormat("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }).format(currentDate);
              const currentDay = formatDate(currentDate);

              PostNewCardAudience({
                employee_id: userData?.id,
                branch_id: userData?.branch_id,
                presences: currentTime,
                day: currentDay,
                is_presence: 1,
              });

              localStorage.setItem("audience", true);
              setAudienceButton(localStorage.getItem("audience"));
            }}
            disabled={audienceButton == "true" || departureButton == "true"}
          >
            {audienceButton == "true" ? (
              <GiCheckMark size={24} className="fill-mainGreen" />
            ) : (
              <img src={Audience} alt="Audience" />
            )}
          </Button> */}
          <Button
            className="bg-white w-24 flex justify-center items-center"
            action={() => {
              setOpen(true);
              setIsDeparture(true);
            }}
            disabled={departureButton == "true"}
          >
            {departureButton == "true" ? (
              <GiCheckMark size={24} className="fill-mainGreen" />
            ) : (
              <img src={Departure} alt="Departure" />
            )}
          </Button>
        </div>
      </div>

      {!isLoggingOut && (
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          maxWidth="w-[40%]"
          blur="backdrop-blur-[1.5px]"
        >
          <div className="text-center mt-3 ">
            <h2 className="font-bold text-lg mb-14">
              {t("Welcome")}{" "}
              <span className="text-mainGreen">{userData?.name}</span>
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
            <div className="flex gap-3 mt-5 my-2 w-full m-auto">
              {!isDeparture ? (
                <Button
                  className="bg-mainGray w-24 flex justify-center items-center shadow mx-auto mt-3"
                  action={() => {
                    const currentDate = new Date();
                    const currentTime = new Intl.DateTimeFormat("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }).format(currentDate);
                    const currentDay = formatDate(currentDate);

                    PostNewCardAudience({
                      employee_id: userData?.id,
                      branch_id: userData?.branch_id,
                      presences: currentTime,
                      day: currentDay,
                      is_presence: 1,
                      shift_id: currentShift?.id,
                    });

                    localStorage.setItem("audience", true);
                    setAudienceButton(localStorage.getItem("audience"));
                  }}
                  disabled={
                    audienceButton == "true" || departureButton == "true"
                  }
                >
                  {audienceButton == "true" ? (
                    <GiCheckMark size={24} className="fill-mainGreen" />
                  ) : (
                    <img src={Audience} alt="Audience" />
                  )}
                </Button>
              ) : (
                <Button
                  className="bg-mainGray w-24 flex justify-center items-center shadow mx-auto mt-3"
                  action={() => {
                    const currentDate = new Date();
                    const currentTime = new Intl.DateTimeFormat("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }).format(currentDate);
                    const currentDay = formatDate(currentDate);

                    PostNewCardDeparture({
                      employee_id: userData?.id,
                      branch_id: userData?.branch_id,
                      departure: currentTime,
                      day: currentDay,
                      shift_id: currentShift?.id,
                    });
                    localStorage.setItem("departure", true);
                    setDepartureButton(localStorage.getItem("departure"));
                    localStorage.setItem("audience", false);
                    setAudienceButton(localStorage.getItem("audience"));
                  }}
                  disabled={departureButton == "true"}
                >
                  {departureButton == "true" ? (
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
