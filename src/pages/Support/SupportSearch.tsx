import React from "react";
import { BaseInputField, Select } from "../../components/molecules";
import { t } from "i18next";

const SupportSearch = ({
  searchOption,
  selectedOption,
  handleSelectedOption,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-6 text-white bg-mainGreen rounded-lg p-8">
      <div>
        <h2 className="font-bold text-2xl mb-6 ">
          {t("?how can we help you")}
        </h2>
        <p className="text-base mb-8 opacity-80">
          {t("search here to get answers to your questions")}
        </p>

        <div className="flex relative">
          <BaseInputField
            id="search"
            name="search"
            type="text"
            className="rounded-xl h-12 w-[580px] text-black"
            placeholder={`${t("search here")}`}
          />

          <div className="absolute left-0">
            <select
              id="searchOption"
              value={selectedOption}
              onChange={handleSelectedOption}
              className="rounded-l-xl text-black h-12 w-28 cursor-pointer text-center"
            >
              {searchOption.map((option) => (
                <option
                  className="text-center"
                  key={option.id}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
            {/* <Select
              name="all"
              className="rounded-xl !h-12 text-black "
              placeholder={`${t("all")}`}
              options={searchOption}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportSearch;
