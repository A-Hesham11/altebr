import React, { useEffect, useState } from "react";
import { BaseInputField, Select } from "../../components/molecules";
import { t } from "i18next";
import { useFetch } from "../../hooks";
import { Link } from "react-router-dom";
import "./searchResultLoading.css";
import test from "../../assets/support-bg.svg";

type Props = {
  searchOption: {
    id: number;
    label: string;
    name: string;
    value: string;
  }[];

  selectedOption?: string;
  onSelectedOptionChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const SupportSearch: React.FC<Props> = ({
  searchOption,
  selectedOption,
  onSelectedOptionChange,
}) => {
  const [searchWord, setSearchWord] = useState("");
  console.log("🚀 ~ searchWord:", searchWord);

  const {
    data: searchResult,
    refetch: searchResultRefetch,
    isFetching,
    isLoading,
    isRefetching,
  } = useFetch({
    endpoint: `/attachment/api/v1/search?query=${searchWord.trim()}`,
    queryKey: ["search-data"],
  });

  useEffect(() => {
    searchResultRefetch();
  }, [searchWord]);

  // if (isFetching || isLoading || isRefetching) {
  //   return (
  //     <div className="loader">
  //       <div className="justify-content-center jimu-primary-loading"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex supportBg flex-col items-center justify-center text-center mt-6 text-white rounded-lg p-8">
      <div>
        <h2 className="font-bold text-2xl mb-6 ">
          {t("?how can we help you")}
        </h2>
        <p className="text-base mb-8 opacity-80">
          {t("search here to get answers to your questions")}
        </p>

        <div className="flex gap-1 relative">
          <div className="relative">
            <BaseInputField
              id="search"
              name="search"
              type="text"
              onChange={(e) => setSearchWord(e.target.value)}
              className="h-10 w-[450px] text-black"
              placeholder={`${t("search here")}`}
            />

            {searchWord !== "" && (
              <div className="absolute shadow-xl border border-mainGreen/20 scrollbar-none top-12 left-0 bg-gray-50 w-full max-h-64 overflow-y-auto z-50">
                {isFetching || isLoading || isRefetching ? (
                  <div className="py-4 h-16">
                    <div className="justify-center jimu-primary-loading"></div>
                  </div>
                ) : searchResult?.length === 0 ? (
                  <p className="text-mainGreen py-4">
                    {t("there is no data for your search")}
                  </p>
                ) : (
                  searchResult?.map((search) => {
                    return (
                      <p
                        className="py-4 text-start cursor-pointer px-2 hover:px-5 transition-all duration-300 border-b hover:bg-mainGreen/10 border-gray-300 text-mainGreen"
                        key={search.id}
                      >
                        {/* TODO HERE FOR ROUTE `searchLinks/${search.id}` */}
                        <Link to={`/searchLinks/${search.id}`}>
                          {search.name}
                        </Link>
                      </p>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <div className="w-28">
            {/* <select
              id="searchOption"
              value={selectedOption}
              onChange={handleSelectedOption}
              className="rounded-l-xl text-black h-12 w-28 cursor-pointer text-center"
            >
              {searchOption.map((option: any) => (
                <option
                  className="text-center"
                  key={option.id}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select> */}
            <Select
              name="all"
              className="rounded-xl !h-12 text-black"
              placeholder={`${t("all")}`}
              onChange={onSelectedOptionChange}
              options={searchOption}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportSearch;
