import { useNavigate, useNavigation, useParams } from "react-router-dom";
import { useFetch } from "../../hooks";
import { useEffect, useState } from "react";
import { t } from "i18next";
import { Loading } from "../../components/organisms/Loading";
import { Back } from "../../utils/utils-components/Back";

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
      <div className="w-full flex justify-end">
        <Back />
      </div>
      <div>
        {supportCategoryData &&
          supportCategoryData?.map((category: any, categoryIndex: any) => {
            return (
              <div>
                <div className="flex items-center gap-2 my-8">
                  <p className="w-8 h-8 flex justify-center items-center font-bold bg-gray-200 rounded-full">
                    {categoryIndex + 1}
                  </p>
                  <h2>{category.name}</h2>
                </div>
                <img src={category.image} alt={category.name} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CategoryLink;
