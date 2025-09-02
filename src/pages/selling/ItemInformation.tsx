import { t } from "i18next";
import React, { useState } from "react";
import { Button } from "../../components/atoms";
import { BiPrinter, BiSearch } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { Back } from "../../utils/utils-components/Back";
import PieceDetails from "../../components/selling/item information/PieceDetails";
import { numberContext } from "../../context/settings/number-formatter";
import { useFetch } from "../../hooks";
import StonesDetails from "../../components/selling/item information/StonesDetails";
import { Loading } from "../../components/organisms/Loading";
import { notify } from "../../utils/toast";
import { useNavigate } from "react-router-dom";

export type ItemInformation_TP = {
  item_id: string;
  classification_id: string;
  category_id: string;
  weight: string;
  karat_id: string;
  wage: string;
  selling_price: string;
  // المورد
  diamond_weight: string;
  color_id: string;
  date: string;
  // سند التوريد
  diamond_value: string;
  // سند الفرع
  stones_weight: string;
  country_id: string;
  size_unit_id: string;
  sizes: string;
  model_number: string;
  //  المصدر
  moured: string;
  // حالة القطعة
  hwya: string;
  details: string;

  setSearchId: any;
  searchId: string;

  isSuccess: any;
  isLoading: any;

  peiceDetails: ItemInformation_TP[];
};

const ItemInformation = () => {
  const [dataSource, setDataSource] = useState<ItemInformation_TP[]>([]);
  const navigate = useNavigate();

  const [searchId, setSearchId] = useState<string>("");

  const { data, isSuccess, refetch, isRefetching, isLoading, isFetching } =
    useFetch({
      endpoint: `/branchManage/api/v1/item-details/${searchId}`,
      queryKey: [`piece-details/${searchId}`],
      pagination: true,
      onSuccess(data) {
        setDataSource(data.data);
      },
      enabled: !!searchId
    });

  return (
    <div className="relative h-full p-10 bg-flatWhite">

      <div className="flex justify-between items-center mb-4">
        <h2 className=" text-base font-bold">{t("piece info")}</h2>
        <div className="flex gap-3">
          <Button className="bg-mainOrange flex items-center gap-2">
            <IoMdAdd size={20} />
            <p>{t("Add stone")}</p>
          </Button>
          <Button className="flex items-center gap-2">
            <BiPrinter size={20} />
            <p>{t("print")}</p>
          </Button>
        </div>
      </div>
      <div className="">
        <div className="bg-lightGreen h-[100%] rounded-lg sales-shadow px-6 py-5">
          <div className="">
            <PieceDetails
              setSearchId={setSearchId}
              isSuccess={isSuccess}
              searchId={searchId}
              isLoading={isLoading}
              isFetching={isFetching}
              data={data}
              dataSource={dataSource}
            />
          </div>
        </div>
        <div className="mt-8">
          <p className="mb-6 text-base font-bold">{t("stone details")}</p>
          <StonesDetails dataSource={dataSource && dataSource} />
        </div>
      </div>
      <div className="flex justify-end items-center mt-8">
        <Back />
      </div>
    </div>
  );
};

export default ItemInformation;
