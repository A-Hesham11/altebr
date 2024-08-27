import { Formik } from "formik";
import { t } from "i18next";
import SupportSearch from "./SupportSearch";
import { useEffect, useState } from "react";
import SubCategorySection from "./UI/SubCategorySection";
import { useFetch, useIsRTL } from "../../hooks";
import { Loading } from "../../components/organisms/Loading";
import { Button } from "../../components/atoms";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../components/molecules";
import AddSupport from "./AddSupport/AddSupport";
import Slider from "react-slick";
import { GrNext, GrPrevious } from "react-icons/gr";
import "./levelTwoLoading.css";

const Support = ({ title }: { title: string }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [categoryActiveId, setCategoryActiveId] = useState(1);
  const [support, setSupport] = useState([]);
  const [searchOption, setSearchOption] = useState([]);
  const navigate = useNavigate();
  const [supportModal, setSupportModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const isRTL = useIsRTL();

  const handleSelectedOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryActiveId(e.id);
  };

  const initialValue = {
    search: "",
  };

  // LEVEL ONE DATA
  const {
    data: supportData,
    refetch: supportDataRefetch,
    isFetching,
    isLoading,
    isRefetching,
  } = useFetch({
    endpoint: `/support/api/v1/catSupport`,
    queryKey: ["support-data"],
    onSuccess(data: any) {
      setSupport(data);

      const selectedOptions = data?.map((el: any) => ({
        id: el.id,
        label: el.name_ar,
        value: el.name_ar,
      }));

      setSearchOption(selectedOptions);
    },
  });

  // LEVEL TWO DATA
  const {
    data: levelTwoData,
    refetch: levelTwoDataRefetch,
    isFetching: levelTwoIsFetching,
    isLoading: levelTwoIsLoading,
    isRefetching: levelTwoRefetching,
  } = useFetch({
    endpoint: `/support/api/v1/levelTwoSupport/${categoryActiveId}`,
    queryKey: ["level-two-data", categoryActiveId],
    onSuccess(data: any) {
      console.log(data);
    },
  });

  const sliderSettings = {
    className: "center",
    centerMode: true,
    centerPadding: "60px",
    slidesToShow: 5,
    speed: 500,
    nextArrow: <GrNext size={30} />,
    prevArrow: <GrPrevious size={30} />,
  };

  // LOADING ....
  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading")}`} />;

  return (
    <Formik
      initialValues={initialValue}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {(values) => {
        return (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-700">{title}</h2>
              {/* <div className="flex items-center gap-3">
                <Button
                  action={() => {
                    setShowSupportModal(true);
                  }}
                >
                  {t("view")}
                </Button>
                <Button
                  action={() => {
                    setSupportModal(true);
                  }}
                >
                  {t("add")}
                </Button>
              </div> */}
            </div>

            <SupportSearch
              selectedOption={selectedOption}
              onSelectedOptionChange={handleSelectedOption}
              searchOption={searchOption}
            />

            {/* SEARCH CATEGORY */}
            <Slider {...sliderSettings}>
              {support?.map((searchBox: any) => {
                return (
                  <div
                    key={searchBox.id}
                    onClick={() => setCategoryActiveId(searchBox.id)}
                    className={`flex flex-col items-center gap-4 rounded-xl cursor-pointer ${
                      searchBox.id === categoryActiveId
                        ? "border-2 border-mainGreen "
                        : "bg-mainGreen/5 border-2 border-mainGreen/10 "
                    } justify-center  h-32`}
                  >
                    <div className="flex flex-col justify-center items-center gap-2 h-full">
                      <img
                        src={searchBox?.images?.[0]?.preview}
                        alt={searchBox.name_ar}
                        className="w-10 h-10"
                      />

                      <p className={`text-mainGreen font-bold`}>
                        {isRTL ? searchBox.name_ar : searchBox.name_en}
                      </p>
                    </div>
                  </div>
                );
              })}
            </Slider>

            {/* SEARCH SUBCATEGORY */}
            {levelTwoRefetching || levelTwoIsFetching || levelTwoIsLoading ? (
              <div className="flex justify-center items-center  my-6">
                <div className="spinner">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            ) : (
              <div className="mb-12">
                <h3 className="text-xl mb-6">
                  {levelTwoData && levelTwoData[0]?.cat_support_name}
                </h3>

                <div>
                  {levelTwoData &&
                    levelTwoData?.map((item: any) => {
                      return <SubCategorySection {...item} />;
                    })}
                </div>
              </div>
            )}

            {/* ADD MODAL */}
            {/* <Modal isOpen={supportModal} onClose={() => setSupportModal(false)}>
              <AddSupport />
            </Modal> */}

            {/* SHOW MODAL */}
            {/* <Modal
              maxWidth="max-w-xl"
              isOpen={showSupportModal}
              onClose={() => setShowSupportModal(false)}
            >
              <div className="my-14 mt-24 flex gap-6 justify-center">
                <Button action={() => navigate("/support/mainSupport")}>
                  {t("view main section")}
                </Button>
                <Button action={() => navigate("/support/subSupport")}>
                  {t("view sub section")}
                </Button>
              </div>
            </Modal> */}
          </>
        );
      }}
    </Formik>
  );
};

export default Support;
