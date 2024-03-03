import { Link, useParams } from "react-router-dom";
import { useFetch, useIsRTL } from "../../hooks";
import { Loading } from "../../components/organisms/Loading";
import { useState } from "react";
import { t } from "i18next";
import { Back } from "../../utils/utils-components/Back";
import { MdKeyboardArrowLeft } from "react-icons/md";
import Slider from "react-slick";
import { GrNext, GrPrevious } from "react-icons/gr";

const SearchSupportLink = () => {
  const searchParamId = useParams().searchLinksId;
  const [searchData, setSearchData] = useState(null);
  const isRTL = useIsRTL();

  const {
    data: searchLinkData,
    refetch: refetchSearchLinkData,
    isFetching,
    isLoading,
    isRefetching,
  } = useFetch({
    endpoint: `/support/api/v1/searchshow/${searchParamId}`,
    queryKey: ["search-show"],
    onSuccess(data) {
      setSearchData(data);
    },
  });

  const sliderSettings = {
    className: "center",
    centerMode: true,
    centerPadding: "60px",
    slidesToShow: 1,
    speed: 500,
    nextArrow: <GrNext size={30} />,
    prevArrow: <GrPrevious size={30} />,
  };

  // LOADING ....
  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading")}`} />;

  return (
    <div>
      <div className="w-full flex justify-between">
        <div className="flex items-center gap-x-1">
          <Link className="font-bold" to={"/support"}>
            {t("helper center")}
          </Link>
          <MdKeyboardArrowLeft />
          <p className="font-bold text-[#7D7D7D]">
            {searchData?.level_third_support_name}
          </p>
        </div>
        <Back />
      </div>
      <div>
        <div>
          <div className="flex items-center gap-2 my-8">
            <h2>{isRTL ? searchData?.name_ar : searchData?.name_en}</h2>
          </div>
          <Slider {...sliderSettings}>
            {searchData?.images?.map((searchBox: any) => {
              return <img src={searchBox?.preview} alt="leve four" />;
            })}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default SearchSupportLink;
