import { Formik } from "formik";
import { t } from "i18next";
import SupportSearch from "./SupportSearch";
import { useState } from "react";
import { GiChessKing } from "react-icons/gi";
import { IoDiamondSharp, IoSettingsSharp } from "react-icons/io5";
import SubCategorySection from "./UI/SubCategorySection";
import { BsArrowUpRightCircleFill, BsFileTextFill } from "react-icons/bs";
import { AiFillDollarCircle } from "react-icons/ai";
import { FaSitemap } from "react-icons/fa";

const searchOption = [
  { id: 1, label: t("all"), name: "all", value: "all" },
  { id: 2, label: t("supply"), name: "supply", value: "supply" },
  { id: 3, label: t("numbering"), name: "numbering", value: "numbering" },
  { id: 4, label: t("branches"), name: "branches", value: "branches" },
  { id: 5, label: t("expenses"), name: "expenses", value: "expenses" },
  {
    id: 6,
    label: t("system sitting"),
    name: "system_sitting",
    value: "system sitting",
  },
];

const searchCategory = [
  { id: 1, icon: BsArrowUpRightCircleFill, title: t("supply") },
  { id: 2, icon: BsFileTextFill, title: t("numbering") },
  { id: 3, icon: FaSitemap, title: t("branches") },
  { id: 4, icon: AiFillDollarCircle, title: t("expenses") },
  { id: 5, icon: IoSettingsSharp, title: t("system sitting") },
];

const data = [
  {
    icon: <GiChessKing className="text-xl" />,
    sectionHead: "supply",
    sectionDescription:
      "توريد الذهب هو عملية نقل الذهب من مكان إلى آخر، سواء كان ذلك لأغراض تجارية أو استثمارية أو تخزينية. يشمل ذلك جميع الخطوات من استخراج الذهب من المناجم إلى تصنيعه وتوزيعه، بما في ذلك التعامل مع الشحنات والتخزين والتأمين. تتم عملية توريد الذهب وفقاً للمعايير والقوانين الدولية المتعلقة بالتجارة والنقل والتخزين لضمان سلامته وسلامة المعاملات المرتبطة به.",
    sectionList: [
      { id: 1, text: "سندات توريد الذهب", link: "/sanad" },
      { id: 2, text: "سندات الذهب", link: "/sanadGold" },
    ],
  },
  {
    icon: <IoDiamondSharp className="text-xl" />,
    sectionHead: "expenses",
    sectionDescription:
      "توريد الذهب هو عملية نقل الذهب من مكان إلى آخر، سواء كان ذلك لأغراض تجارية أو استثمارية أو تخزينية. يشمل ذلك جميع الخطوات من استخراج الذهب من المناجم إلى تصنيعه وتوزيعه، بما في ذلك التعامل مع الشحنات والتخزين والتأمين. تتم عملية توريد الذهب وفقاً للمعايير والقوانين الدولية المتعلقة بالتجارة والنقل والتخزين لضمان سلامته وسلامة المعاملات المرتبطة به.",
    sectionList: [
      { id: 1, text: "Item 1", link: "/sanad" },
      { id: 2, text: "Item 2", link: "/sanad" },
    ],
  },
];

const Support = ({ title }: { title: string }) => {
  const [selectedOption, setSelectedOption] = useState(searchOption[0].value);
  const [categoryActiveId, setCategoryActiveId] = useState(1);

  const handleSelectedOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  const initialValue = {
    search: "",
  };

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
            <div className="my-12 grid gap-6  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {searchCategory.map((searchBox) => {
                return (
                  <div
                    key={searchBox.id}
                    onClick={() => setCategoryActiveId(searchBox.id)}
                    className={`flex flex-col items-center gap-4 rounded-xl cursor-pointer ${
                      searchBox.id === categoryActiveId
                        ? "bg-mainOrange/5 border-2 border-mainOrange/10 "
                        : "bg-mainGreen/5 border-2 border-mainGreen/10 "
                    } justify-center  h-32`}
                  >
                    <searchBox.icon
                      className={`${
                        searchBox.id === categoryActiveId
                          ? "text-mainOrange "
                          : "text-mainGreen"
                      } w-10 h-10`}
                    />

                    <p
                      className={`${
                        searchBox.id === categoryActiveId
                          ? "text-mainOrange"
                          : "text-mainGreen"
                      } font-bold`}
                    >
                      {searchBox.title}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* SEARCH SUBCATEGORY */}
            <div className="mb-12">
              <h3 className="text-xl mb-6">{t("supply")}</h3>

              <div>
                {data.map((item) => {
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
