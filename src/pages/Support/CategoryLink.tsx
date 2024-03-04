import { Link, useNavigate, useNavigation, useParams } from "react-router-dom";
import { useFetch, useIsRTL } from "../../hooks";
import { useEffect, useState } from "react";
import { t } from "i18next";
import { Loading } from "../../components/organisms/Loading";
import { Back } from "../../utils/utils-components/Back";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { GrNext, GrPrevious } from "react-icons/gr";

function hashId(id: string | number) {
  return `${crypto.randomUUID()}${id}${crypto.randomUUID()}`;
}

const CategoryLink = () => {
  const supportIdParam = useParams().supportId;
  const navigate = useNavigate();
  const [supportCategoryData, setSupportCategoryData] = useState(null);
  console.log("🚀 ~ CategoryLink ~ supportCategoryData:", supportCategoryData);
  const isRTL = useIsRTL();

  // useEffect(() => {
  //   const id = hashId(supportIdParam);
  //   navigate(`/supportLinks/${id}`, { replace: true });
  // }, []);

  const {
    data: supportCategoryLink,
    refetch: refetchSupportCategoryLink,
    isFetching,
    isLoading,
    isRefetching,
  } = useFetch({
    endpoint: `/support/api/v1/levelFourthSupport/${supportIdParam}`,
    queryKey: ["support-data"],
    onSuccess(data) {
      setSupportCategoryData(data);
    },
  });

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
            {supportCategoryData[0]?.level_third_support_name}
          </p>
        </div>
        <Back />
      </div>
      <div>
        {supportCategoryData &&
          supportCategoryData?.map((category: any, categoryIndex: any) => {
            const steps = isRTL
              ? category?.desc_ar?.split("\n")
              : category?.desc_en?.split("\n");

            return (
              <div key={categoryIndex}>
                <div className="flex items-center gap-2 mt-8 mb-4">
                  <p className="w-8 h-8 flex justify-center items-center font-bold bg-mainGreen text-white rounded-full">
                    {categoryIndex + 1}
                  </p>
                  <h2 className="text-mainGreen font-bold text-lg">
                    {category.name_ar}
                  </h2>
                </div>
                <dl className="mr-8 mb-4 space-y-1">
                  {steps?.map((step: string, index: number) => {
                    return <li key={index}>{step}</li>;
                  })}
                </dl>
                <img src={category.images[0]?.preview} alt={category.name_ar} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CategoryLink;
