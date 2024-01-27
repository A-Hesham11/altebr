import React, { useMemo } from "react";
import { numberContext } from "../../../context/settings/number-formatter";
import { t } from "i18next";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import Slider from "react-slick";
import { GrNext, GrPrevious } from "react-icons/gr";

const ExpensesBondsPreview = ({ item }: { item?: {} }) => {
  console.log(
    "🚀 ~ file: ExpensesBondsPreview.tsx:7 ~ ExpensesBondsPreview ~ item:",
    item
  );

  // SLIDE SETTING
  const sliderSettings = {
    className: "center h-full",
    centerMode: true,
    centerPadding: "60px",
    // slidesToShow:
    //   item?.images.length === 2 ? 2 : item?.images.length === 1 ? 1 : slidesToShow,
    speed: 500,
    nextArrow: <GrNext size={30} />,
    prevArrow: <GrPrevious size={30} />,
  };

  return (
    <>
      {/* SLIDE */}
      <div className=" mx-auto">
        {/* <Slider {...sliderSettings}>
          {item?.images?.map((item: any) => (
            <img
              className="w-full h-full object-cover"
              src={item?.preview}
              alt="slide"
            />
          ))}
        </Slider> */}
        expenses bonds preview
      </div>
    </>
  );
};

export default ExpensesBondsPreview;

// const ExpensesBondsPreview = ({ item }: { item?: {} }) => {
//   console.log(
//     "🚀 ~ file: ExpensesBondsPreview.tsx:7 ~ ExpensesBondsPreview ~ item:",
//     item
//   );
//   const { formatReyal } = numberContext();

//   // COLUMNS FOR THE TABLE
//   const tableColumn = useMemo<any>(
//     () => [
//       {
//         cell: (info: any) => info.getValue(),
//         accessorKey: "category_name",
//         header: () => <span>{t("classification")}</span>,
//       },
//       {
//         cell: (info: any) => info.getValue() || "-",
//         // accessorKey: "old_weight",
//         accessorKey: "weight",
//         header: () => <span>{t("weight")}</span>,
//       },
//       {
//         cell: (info: any) => info.renderValue(),
//         accessorKey: "karat_name",
//         header: () => <span>{t("karat")}</span>,
//       },
//       {
//         cell: (info: any) => formatReyal(Number(info.renderValue())),
//         accessorKey: "gram_price",
//         header: () => <span>{t("piece per gram")}</span>,
//       },
//       {
//         cell: (info: any) =>
//           formatReyal(Number(info.renderValue()).toFixed(2)) || "-",
//         accessorKey: "value",
//         header: () => <span>{t("value")}</span>,
//       },
//     ],
//     []
//   );

//   return (
//     <>
//       <div className="mt-16">
//         <Table data={item?.items || []} columns={tableColumn}></Table>
//       </div>
//     </>
//   );
// };
