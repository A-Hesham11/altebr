import React, { useEffect, useState } from "react";
import { BaseInputField } from "../../components/molecules";
import { t } from "i18next";
import { useFetch } from "../../hooks";
import { Link } from "react-router-dom";
import "./searchResultLoading.css";

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

const SupportSearch: React.FC<Props> = () => {
  const [searchWord, setSearchWord] = useState("");

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
        </div>
      </div>
    </div>
  );
};

export default SupportSearch;
