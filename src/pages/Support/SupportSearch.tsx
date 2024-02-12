import React from "react";
import { BaseInputField, Select } from "../../components/molecules";
import { t } from "i18next";

type Props = {
  searchOption: {
    id: number;
    label: string;
    name: string;
    value: string;
  }[];

  selectedOption?: string;
  handleSelectedOption?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const SupportSearch: React.FC<Props> = ({
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

        <div className="flex gap-1 relative">
          <BaseInputField
            id="search"
            name="search"
            type="text"
            className="h-10 w-[450px] text-black"
            placeholder={`${t("search here")}`}
          />

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
              options={searchOption}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportSearch;
