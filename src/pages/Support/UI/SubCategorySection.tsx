import { t } from "i18next";
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";

type Props = {
  icon: JSX.Element;
  sectionHead: string;
  sectionDescription: string;
  sectionList: {
    id: number;
    text: string;
    link: string;
  }[];
};

const SubCategorySection: React.FC<Props> = ({
  icon,
  sectionHead,
  sectionDescription,
  sectionList,
}) => {
  const [subIsOpen, setSubIsOpen] = useState(false);

  const handleSubOpen = () => setSubIsOpen((prev) => !prev);

  return (
    <div className="border-t py-6 border-gray-300">
      <div
        onClick={handleSubOpen}
        className={`flex items-center gap-1  mb-2 cursor-pointer ${
          subIsOpen ? "text-mainGreen" : ""
        }`}
      >
        <p>{icon}</p>
        <p className="font-bold">{t(`${sectionHead}`)}</p>
        <IoIosArrowDown
          className={`${
            subIsOpen ? "rotate-180 transition-all duration-300" : ""
          }`}
        />
      </div>

      {subIsOpen && (
        <div className="transition-all duration-500">
          <p className="mx-5 text-black/70">{sectionDescription}</p>

          <ul className="flex flex-wrap items-center gap-8 mt-8 mx-9 list-disc">
            {sectionList.map((li) => {
              return (
                <li key={li.id}>
                  <Link to={li.link}>{li.text}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SubCategorySection;
