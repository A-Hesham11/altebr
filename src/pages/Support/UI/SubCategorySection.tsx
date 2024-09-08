import { t } from "i18next";
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import { useIsRTL } from "../../../hooks";

type Props = {
  id: string;
  images: JSX.Element;
  name_ar: string;
  name_en: string;
  desc: string;
  LevelThird: {
    id: number;
    text: string;
    link: string;
  }[];
};

const SubCategorySection: React.FC<Props> = ({
  id,
  images,
  name_ar,
  name_en,
  desc,
  LevelThird,
}) => {
  console.log("🚀 ~ id:", id);
  const [subIsOpen, setSubIsOpen] = useState(false);
  const isRTL = useIsRTL();

  const handleSubOpen = () => setSubIsOpen((prev) => !prev);

  return (
    <div className="border-t py-6 border-gray-300">
      <div
        onClick={handleSubOpen}
        className={`flex items-center gap-1  mb-2 cursor-pointer ${
          subIsOpen ? "text-mainGreen" : ""
        }`}
      >
        <img
          src={images?.[0]?.preview}
          alt="Sub Category Image"
          className="fill-mainGreen"
        />
        <p className="font-bold">{t(`${isRTL ? name_ar : name_en}`)}</p>
        <IoIosArrowDown
          className={`${
            subIsOpen ? "rotate-180 transition-all duration-300" : ""
          }`}
        />
      </div>

      {subIsOpen && (
        <div className="transition-all duration-500">
          <p className="mx-5 text-black/70">{desc}</p>

          <ul className="flex flex-wrap items-center gap-14 mt-8 mx-9 list-disc">
            {LevelThird?.map((li: any) => {
              return (
                <li className="font-bold" key={li.id}>
                  <Link to={`/supportLinks/${li.id}`}>
                    {isRTL ? li.name_ar : li.name_en}
                  </Link>
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
