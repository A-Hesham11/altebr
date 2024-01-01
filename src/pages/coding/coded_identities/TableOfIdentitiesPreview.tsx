import { t } from "i18next";
import React, { useMemo } from "react";
import { Table } from "../../../components/templates/reusableComponants/tantable/Table";
import { GrNext, GrPrevious } from "react-icons/gr";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { BiLinkExternal } from "react-icons/bi";
import { numberContext } from "../../../context/settings/number-formatter";

const TableOfIdentitiesPreview = ({ item }: { item?: {} }) => {
  console.log("🚀 ~ file: TableOfIdentitiesPreview.tsx:11 ~ TableOfIdentitiesPreview ~ item:", item)
  const { formatReyal } = numberContext();

  // COLUMNS FOR THE TABLE OF DETAILS
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "category",
        header: () => <span>{t("classification")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "country",
        header: () => <span>{t("source")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "color",
        header: () => <span>{t("color")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "model_number",
        header: () => <span>{t("modal number")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "sizeType",
        header: () => <span>{t("size type")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "size",
        header: () => <span>{t("size")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "karat_name",
        header: () => <span>{t("karat")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "weight",
        header: () => <span>{t("weight")}</span>,
      },
      {
        cell: (info: any) =>
          formatReyal(Number(info.getValue()).toFixed(2)) || "-",
        accessorKey: "selling_price",
        header: () => <span>{t("value")}</span>,
      },
    ],
    []
  );

  // COLUMNS FOR THE TABLE OF DETAILS
  const tableColumnStones = useMemo<any>(
    () => [
      {
        cell: (info: any) => t(info.getValue()) || "-",
        accessorKey: "stone_type",
        header: () => <span>{t("stone type")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "color_id",
        header: () => <span>{t("stone color")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "shape_id",
        header: () => <span>{t("stone shape")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "purity_id",
        header: () => <span>{t("purity percentage")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "diamondWeight",
        header: () => <span>{t("weight of diamond stone")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "weight",
        header: () => <span>{t("stone weight")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "count",
        header: () => <span>{t("number of stones")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "nature_id",
        header: () => <span>{t("stone nature")}</span>,
      },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "certificate_number",
        header: () => <span>{t("certificate number")}</span>,
      },
      //   {
      //     cell: (info: any) =>( <p className="whitespace-pre-wrap">{info.getValue()}</p>) || "-",
      //     accessorKey: "details",
      //     header: () => <span>{t("stone description")}</span>,
      //   },
      {
        cell: (info: any) => info.getValue() || "-",
        accessorKey: "certificate_source",
        header: () => <span>{t("certificate source")}</span>,
      },
      {
        cell: (info: any) =>
          (
            <Link
              className="flex items-center gap-1 text-blue-600 justify-center"
              to={`${info.getValue()}`}
              target="_blank"
            >
              <BiLinkExternal /> Link
            </Link>
          ) || "-",
        accessorKey: "certificate_url",
        header: () => <span>{t("certificate url")}</span>,
      },
    ],
    []
  );

  // SLIDE SETTING
  const sliderSettings = {
    className: "center",
    centerMode: true,
    centerPadding: "60px",
    // slidesToShow:
    //   item?.images.length === 2 ? 2 : item?.images.length === 1 ? 1 : slidesToShow,
    speed: 500,
    nextArrow: <GrNext size={30} />,
    prevArrow: <GrPrevious size={30} />,
  };

  return (
    <div>
      {/* SLIDE */}
      <div className="mt-14 mx-auto">
        {item?.images.length > 0 ? (
          <Slider {...sliderSettings}>
            {item?.images.map((item: any) => (
              <img
                className="w-full h-full object-cover"
                src={item?.preview}
                alt="slide"
              />
            ))}
          </Slider>
        ) : (
          <p className="mx-auto text-lg text-slate-700 font-bold w-max">
            {t("there is no image data to display")}
          </p>
        )}
      </div>

      {/* TABLE */}
      <div className="mt-8">
        <h2 className="mb-4 text-center w-max border border-slate-300 py-2 px-3 rounded-md mx-auto bg-gray-200">
          {t("pieces details")}
        </h2>
        <Table data={[item]} columns={tableColumn}>
          <div className="flex gap-4 items-center">
            <h2 className="text-lg font-bold text-slate-700">
              {t("piece detail:")}
            </h2>
            <p>{item?.details}</p>
          </div>
        </Table>
        {/* <Table data={item?.damgDetails} columns={tableColumn}></Table> */}
      </div>

      {/* STONES */}
      <div className="mt-14 mx-auto">
        {item?.stonesDetails.length > 0 ? (
          <Table data={item?.stonesDetails} columns={tableColumnStones}>
            {/* <div className="flex gap-4 items-center">
              <h2 className="text-lg font-bold text-slate-700">
                {t("stone description")}
              </h2>
              <p>{item?.details}</p>
            </div> */}
          </Table>
        ) : (
          <div className="mt-12 w-max mx-auto text-xl text-slate-700 font-bold">
            {t("there are no stones")}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableOfIdentitiesPreview;
