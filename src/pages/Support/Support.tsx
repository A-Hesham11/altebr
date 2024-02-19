import { Formik } from "formik";
import { t } from "i18next";
import SupportSearch from "./SupportSearch";
import { SetStateAction, useEffect, useState } from "react";
import SubCategorySection from "./UI/SubCategorySection";
import { useFetch } from "../../hooks";
import { Loading } from "../../components/organisms/Loading";

const Support = ({ title }: { title: string }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [categoryActiveId, setCategoryActiveId] = useState(1);
  const [support, setSupport] = useState([]);
  console.log("🚀 ~ Support ~ support:", support);
  const [searchOption, setSearchOption] = useState([]);

  const handleSelectedOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryActiveId(e.id);
  };

  const initialValue = {
    search: "",
  };

  const {
    data: supportData,
    refetch: supportDataRefetch,
    isFetching,
    isLoading,
    isRefetching,
  } = useFetch({
    endpoint: `/attachment/api/v1/categories`,
    queryKey: ["support-data"],
    onSuccess(data: any) {
      setSupport(data);

      const selectedOptions = data?.map((el: any) => ({
        id: el.id,
        label: el.name,
        value: el.name,
      }));

      setSearchOption(selectedOptions);
    },
  });

  const targetCategory = support?.find((el: any) => el.id == categoryActiveId);

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
            <h2 className="text-xl font-bold text-slate-700">{title}</h2>

            <SupportSearch
              selectedOption={selectedOption}
              onSelectedOptionChange={handleSelectedOption}
              searchOption={searchOption}
            />

            {/* SEARCH CATEGORY */}
            <div className="my-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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
                    <img
                      src={searchBox.image}
                      alt={searchBox.name}
                      className="w-10 h-10"
                    />

                    <p className={`text-mainGreen font-bold`}>
                      {searchBox.name}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* SEARCH SUBCATEGORY */}
            <div className="mb-12">
              <h3 className="text-xl mb-6">{targetCategory?.name}</h3>

              <div>
                {support &&
                  targetCategory?.children?.map((item: any) => {
                    return <SubCategorySection {...item} />;
                  })}
              </div>
            </div>
          </>
        );
      }}
    </Formik>
  );
};

export default Support;
