import { useParams } from "react-router-dom";
import { useFetch } from "../../hooks";
import { Loading } from "../../components/organisms/Loading";
import { useState } from "react";
import { t } from "i18next";
import { Back } from "../../utils/utils-components/Back";

const SearchSupportLink = () => {
  const searchParamId = useParams().searchLinksId;
  console.log("🚀 ~ SearchSupportLink ~ searchParamId:", searchParamId);
  const [searchData, setSearchData] = useState(null);

  const {
    data: searchLinkData,
    refetch: refetchSearchLinkData,
    isFetching,
    isLoading,
    isRefetching,
  } = useFetch({
    endpoint: `/attachment/api/v1/searchshow/${searchParamId}`,
    queryKey: ["search-show"],
    onSuccess(data) {
      setSearchData(data);
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
        {/* {searchData &&
          searchData?.map((category: any, categoryIndex: any) => {
            return ( */}
        <div>
          <div className="flex items-center gap-2 my-8">
            <p className="w-8 h-8 flex justify-center items-center font-bold bg-gray-200 rounded-full">
              {1}
            </p>
            <h2>{searchData.name}</h2>
          </div>
          <img src={searchData.image} alt={searchData.name} />
        </div>
        {/* );
          })} */}
      </div>
    </div>
  );
};

export default SearchSupportLink;
