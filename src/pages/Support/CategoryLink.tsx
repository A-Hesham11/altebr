import { Link, useNavigate, useNavigation, useParams } from "react-router-dom";
import { useFetch } from "../../hooks";
import { useEffect, useState } from "react";
import { t } from "i18next";
import { Loading } from "../../components/organisms/Loading";
import { Back } from "../../utils/utils-components/Back";
import { MdKeyboardArrowLeft } from "react-icons/md";

function hashId(id: string | number) {
  return `${crypto.randomUUID()}${id}${crypto.randomUUID()}`;
}

const CategoryLink = () => {
  const supportIdParam = useParams().supportId;
  const navigate = useNavigate();
  console.log("🚀 ~ CategoryLink ~ supportIdParam:", supportIdParam);
  const [supportCategoryData, setSupportCategoryData] = useState(null);
  console.log("🚀 ~ CategoryLink ~ supportCategoryData:", supportCategoryData);

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
    endpoint: `/attachment/api/v1/categories/${supportIdParam}`,
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
          <p className="font-bold">{supportCategoryData[0]?.parent}</p>
        </div>
        <Back />
      </div>
      <div>
        {supportCategoryData &&
          supportCategoryData?.map((category: any, categoryIndex: any) => {
            const steps = category?.ck?.split("\r\n");
            console.log("🚀 ~ CategoryLink ~ steps:", steps);

            return (
              <div key={categoryIndex}>
                <div className="flex items-center gap-2 mt-8 mb-4">
                  <p className="w-8 h-8 flex justify-center items-center font-bold bg-mainGreen text-white rounded-full">
                    {categoryIndex + 1}
                  </p>
                  <h2 className="text-mainGreen font-bold text-lg">
                    {category.name}
                  </h2>
                </div>
                <dl className="mr-8 mb-4 space-y-1">
                  {steps?.map((step: string, index: number) => {
                    return <li key={index}>{step}</li>;
                  })}
                </dl>
                <img src={category.image} alt={category.name} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CategoryLink;
