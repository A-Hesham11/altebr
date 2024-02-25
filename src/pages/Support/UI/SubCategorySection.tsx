import { t } from "i18next";
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";

type Props = {
  id: string;
  image: JSX.Element;
  name: string;
  desc: string;
  links: {
    id: number;
    text: string;
    link: string;
  }[];
};

const SubCategorySection: React.FC<Props> = ({
  id,
  image,
  name,
  desc,
  links,
}) => {
  console.log("🚀 ~ id:", id);
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
        <img src={image} alt="Sub Category Image" className="fill-mainGreen" />
        <p className="font-bold">{t(`${name}`)}</p>
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
            {links?.map((li: any) => {
              return (
                <li className="font-bold" key={li.id}>
                  <Link to={`/supportLinks/${li.id}`}>{li.name}</Link>
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
