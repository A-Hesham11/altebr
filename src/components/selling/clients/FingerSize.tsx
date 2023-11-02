import { Form, Formik, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFetch } from "../../../hooks";
import { Select } from "../../molecules";
import { t } from "i18next";
import { ClientData_TP } from "./AddClients";

// type Size_TP = {
//   sizeType: string;
//   size: string;
//   index_finger: string
//   thumbs_up: string
//   wrist: string
//   central:string
//   ring_finger: string
//   pinky: string
// };

// const initialValues: Size_TP = {
//   sizeType: "",
//   size: "",
//   index_finger:"",
//   thumbs_up: "",
//   wrist: "",
//   central:"",
//   ring_finger: "",
//   pinky: "",
// };

// const validationSchema = Yup.object({
//   sizeType: Yup.string().trim(),
//   size: Yup.string().trim(),
//   index_finger: Yup.string().trim(),
//   thumbs_up: Yup.string().trim(),
//   wrist: Yup.string().trim(),
//   central: Yup.string().trim(),
//   ring_finger: Yup.string().trim(),
//   pinky: Yup.string().trim(),
// });

const FingerSize = ({editClientsData, showClientsData, initialValues}: any) => {
  
  const [newValue, setNewValue] = useState([]);
  
  const [valueSababa, setValueSababa] = useState([])
  const [valueEbham, setValueEbham] = useState()
  const [valueRuskh, setValueRuskh] = useState()
  const [valueWsta, setValueWsta] = useState()
  const [valueBenser, setValueBenser] = useState()
  const [valueKhenser, setValueKhenser] = useState([]);

  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedCircleIndex, setSelectedCircleIndex] = useState<number | null>(null);

  const { setFieldValue, values, resetForm } = useFormikContext();

  const fingertipPositions = [
    { x: 0.64, y: 0.1, htmlFor:"sababa_id" },
    { x: 0.93, y: 0.45, htmlFor:"ebham_id" },
    { x: 0.45, y: 0.04, htmlFor:"wsta_id" },
    { x: 0.247, y: 0.1, htmlFor:"benser_id" },
    { x: 0.07, y: 0.2, htmlFor:"khenser_id" },
  ];
  
  const numCircles = 6;
  const radius = 100;
  const center = { x: 102, y: 99 };

  const circlePositions = Array.from({ length: numCircles }, (_, index) => {
    const angle = index * (360 / numCircles) * (Math.PI / 180);
    return {
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle),
    };
  });


  const {
    data: sizes,
    isLoading,
    isFetching,
  } = useFetch({
    endpoint: "size/api/v1/sizes?per_page=10000",
    queryKey: ["client_sizes"],
    select: (sizes) => {
      return sizes?.map((item) => ({
        value: item.type,
        label: `${item.type}`,
        id: item.id,
        units: item.units,
      }));
    },
  });

  const { data: sizesFinger, refetch, isFetching: isFetchingFinger } = useFetch({
    endpoint: `/selling/api/v1/fingers-sizes/${newValue?.id}`,
    queryKey: ["fingers-sizes"],
    select: (sizesFinger) => {
      return sizesFinger?.map((item) => ({
        id: item.id,
        value:item.number,
        label:item.number,
      }));
    },
    enabled:false
  });


  const { data: handsizes, refetch: refetchHand, isFetching: isFetchingHand } = useFetch({
    endpoint: `/selling/api/v1/handsizes?per_page=10000`,
    queryKey: ["hand_sizes"],
    select: (handsizes) => {
      return handsizes?.map((item) => ({
        id: item.id,
        value:item.number,
        label:item.number,
      }));
    },
    enabled: editClientsData ? true : false
  });

  useEffect(() => {
    refetchHand()
  }, [editClientsData?.size_id || newValue?.id || showClientsData?.size_id])

  useEffect(() => {
    const best = {
        id: editClientsData?.size.id || showClientsData?.size.id || "",
        value: editClientsData?.size.name_ar || showClientsData?.size.name_ar || "",
        label: editClientsData?.size.name_ar || showClientsData?.size.name_ar || `${t("choose type of size")}` ,
    }
    setNewValue(best);
  }, []);

  useEffect(() => {
    const best = {
        id: editClientsData?.sababa.id || showClientsData?.sababa.id || "",
        value: editClientsData?.sababa.number || showClientsData?.sababa.number || "",
        label: editClientsData?.sababa.number || showClientsData?.sababa.number || `${t("index finger")}` ,
    }
    setValueSababa(best);
  }, []);

  useEffect(() => {
    const best = {
        id: editClientsData?.ebham.id || showClientsData?.ebham.id || "",
        value: editClientsData?.ebham.number || showClientsData?.ebham.number || "",
        label: editClientsData?.ebham.number || showClientsData?.ebham.number || `${t("thumbs up")}` ,
    }
    setValueEbham(best);
  }, []);

  useEffect(() => {
    const best = {
        id: editClientsData?.ruskh_id.id || showClientsData?.ruskh_id.id || "",
        value: editClientsData?.ruskh_id.number || showClientsData?.ruskh_id.number || "",
        label: editClientsData?.ruskh_id.number || showClientsData?.ruskh_id.number || `${t("wrist")}` ,
    }
    setValueRuskh(best);
  }, []);

  useEffect(() => {
    const best = {
        id: editClientsData?.wsta.id || showClientsData?.wsta.id || "",
        value: editClientsData?.wsta.number || showClientsData?.wsta.number || "",
        label: editClientsData?.wsta.number || showClientsData?.wsta.number || `${t("central")}` ,
    }
    setValueWsta(best);
  }, []);

  useEffect(() => {
    const best = {
        id: editClientsData?.benser.id || showClientsData?.benser.id || "",
        value: editClientsData?.benser.number || showClientsData?.benser.number || "",
        label: editClientsData?.benser.number || showClientsData?.benser.number || `${t("ring finger")}` ,
    }
    setValueBenser(best);
  }, []);

  useEffect(() => {
    const best = {
        id: editClientsData?.khenser.id || showClientsData?.khenser.id || "",
        value: editClientsData?.khenser.number || showClientsData?.khenser.number || "",
        label: editClientsData?.khenser.number || showClientsData?.khenser.number || `${t("pinky")}` ,
    }
    setValueKhenser(best);
  }, []);




  useEffect(() => {
    refetch()
}, [newValue?.id]);

  return (
    <>
        <div className="w-1/3 m-auto">
            <Select
              id="size_id"
              // label={`${t("size type")}`}
              name="size_id"
              placeholder={`${t("choose type of size")}`}
              loadingPlaceholder={`${t("loading")}`}
              options={sizes}
              fieldKey="id"
              value={newValue}
              onChange={(option) => {
                  //@ts-ignore
                  setNewValue(option);
              }}
              loading={isFetching && !showClientsData}
              isDisabled={showClientsData}
            />
        </div>

        <div className="flex justify-between items-center mb-6 mt-14 h-64">
            <div className="w-1/4 flex flex-col justify-between mb-8 h-full">
              <div className="mr-14 w-full">
                  <Select
                      id="sababa_id"
                      label={`${t("index finger")}`}
                      name="sababa_id"
                      placeholder={`${t("index finger")}`}
                      loadingPlaceholder={`${t("loading")}`}
                      options={sizesFinger}
                      fieldKey="id"
                      value={valueSababa} 
                      onChange={(option) => {
                        //@ts-ignore
                          setValueSababa(option);
                      }}  
                      loading={isFetchingFinger}
                      isDisabled={sizesFinger?.length === 0 || showClientsData}
                      onFocus={() => {
                        setSelectedField("sababa_id")
                        setSelectedCircleIndex(5);
                      }}
                  />
              </div>
              <div className="mr-4 w-full">
                  <Select
                      id="ebham_id"
                      label={`${t("thumbs up")}`}
                      name="ebham_id"
                      placeholder={`${t("thumbs up")}`}
                      loadingPlaceholder={`${t("loading")}`}
                      options={sizesFinger}
                      fieldKey="id"
                      value={valueEbham}
                      onChange={(option) => {
                          //@ts-ignore
                          setValueEbham(option)
                      }}  
                      loading={isFetchingFinger}
                      isDisabled={sizesFinger?.length === 0 || showClientsData}
                      // isDisabled={sizesFinger?.length === 0 && !isFetchingFinger || (!editClientsData || showClientsData)}
                      onFocus={() => {
                        setSelectedField("ebham_id")
                        setSelectedCircleIndex(0);
                      }}
                  />
              </div>
              <div className="mr-14 w-full">
                  <Select
                      id="ruskh_id"
                      label={`${t("wrist")}`}
                      name="ruskh_id"
                      placeholder={`${t("wrist")}`}
                      loadingPlaceholder={`${t("loading")}`}
                      options={handsizes}
                      fieldKey="id"
                      value={valueRuskh}
                      onChange={(option) => {
                          setValueRuskh(option);
                      }}  
                      loading={isFetchingFinger}
                      isDisabled={sizesFinger?.length === 0 || showClientsData}
                      onFocus={() => {
                        setSelectedField("ruskh_id")
                        setSelectedCircleIndex(1);
                      }}
                  />
              </div>
            </div>

            <div className="relative w-52 h-52 border-2 border-dashed border-gray-300 rounded-full">
              <div className="absolute w-full h-full rounded-full flex justify-center items-center">
                  <div className="relative w-24 h-[120px]">
                  <img
                      src="/src/assets/hand.png"
                      alt="Hand"
                      className="w-full"
                  />
                  {fingertipPositions.map((position, index) => (
                      <label htmlFor={position.htmlFor}  key={index}>
                        <div
                            key={index}
                            className={
                              `${selectedField === position.htmlFor ? "bg-mainGreen" : "bg-[#C5C5C5]"} 
                              absolute flex items-center justify-center w-[14px] h-[14px]  rounded-full`
                            }
                            style={{
                              left: `${position.x * 100}%`,
                              top: `${position.y * 100}%`,
                              transform: "translate(-50%, -50%)",
                            }}
                        ></div>
                      </label>
                  ))}
                  </div>
              </div>

              {circlePositions.map((position, index) => (
                  <div
                    key={index}
                    className={
                      `${selectedCircleIndex === index ? "bg-mainGreen" : "bg-[#C5C5C5]"} 
                      absolute flex items-center justify-center w-6 h-6  rounded-full`
                    }
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        transform: "translate(-50%, -50%)",
                    }}
                  ></div>
              ))}
            </div>

            <div className="w-1/4 flex flex-col justify-between mb-8 h-full">
            <div className="-mr-14 w-full">
                <Select
                    id="wsta_id"
                    label={`${t("central")}`}
                    name="wsta_id"
                    placeholder={`${t("central")}`}
                    loadingPlaceholder={`${t("loading")}`}
                    options={sizesFinger}
                    fieldKey="id"
                    value={valueWsta}
                    onChange={(option) => {
                        setValueWsta(option);
                    }}  
                    loading={isFetchingFinger}
                    isDisabled={sizesFinger?.length === 0 || showClientsData}
                    onFocus={() => {
                      setSelectedField("wsta_id")
                      setSelectedCircleIndex(4);
                    }}
                />
            </div>
            <div className="-mr-4 w-full">
                <Select
                    id="benser_id"
                    label={`${t("ring finger")}`}
                    name="benser_id"
                    placeholder={`${t("ring finger")}`}
                    loadingPlaceholder={`${t("loading")}`}
                    options={sizesFinger}
                    fieldKey="id"
                    value={valueBenser}
                    onChange={(option) => {
                        setValueBenser(option);
                    }}   
                    loading={isFetchingFinger}
                    isDisabled={sizesFinger?.length === 0 || showClientsData}
                    onFocus={() => {
                      setSelectedField("benser_id")
                      setSelectedCircleIndex(3);
                    }}
                />
            </div>
            <div className="-mr-14 w-full">
                <Select
                    id="khenser_id"
                    label={`${t("pinky")}`}
                    name="khenser_id"
                    placeholder={`${t("pinky")}`}
                    loadingPlaceholder={`${t("loading")}`}
                    options={sizesFinger}
                    fieldKey="id"
                    value={valueKhenser}
                    onChange={(option) => {
                        setValueKhenser(option);
                    }}   
                    loading={isFetchingFinger}
                    isDisabled={sizesFinger?.length === 0 || showClientsData}
                    onFocus={() => {
                      setSelectedField("khenser_id")
                      setSelectedCircleIndex(2);
                    }}
                />
            </div>
            </div>
        </div>
    </>

  );
};

export default FingerSize;


                    // value={
                    //   editClientsData ? {
                    //     id: editClientsData?.khenser.id,
                    //     value: editClientsData?.khenser.number,
                    //     label: editClientsData?.khenser.number || `${t("choose type of size")}`
                    //   }
                    //   : {
                    //     id: showClientsData?.khenser.id,
                    //     value:  showClientsData?.khenser.number,
                    //     label: showClientsData?.khenser.number || `${t("choose type of size")}`
                    //   }
                    // }

{
  /* <>
<Select
  onChange={(option) => {
    // @ts-ignore
    if (selectedSizeTypeOption?.id !== option?.id) {
      setTheSelectedSize(null)
      setFieldValue(theSizeName, "")
      // setFieldValue("sizeType_value", option!.value)
      // @ts-ignore
      setSelectedSizeTypeOption(option)
    }
  }}
  value={selectedSizeTypeOption && selectedSizeTypeOption}
  fieldKey={sizeTypeFieldKey}
  name={sizeTypeName}
  label="نوع المقاس"
  placeholder="نوع المقاس"
  id="select-size-type"
  options={selectedCategory.category_sizes?.map((size) => ({
    ...size,
    value: size.type,
    label: size.type,
  }))}
/>

<Select
  onChange={(option) => {
    // @ts-ignore
    setTheSelectedSize(option)
    // setFieldValue("sizeNumber_value", option!.value)
  }}
  isDisabled={!!!selectedSizeTypeOption}
  value={theSelectedSize && theSelectedSize}
  fieldKey={theSizeFieldKey}
  name={theSizeName}
  label="المقاس"
  placeholder="المقاس"
  id="select-size-number"
  options={selectedCategory.category_sizes
                        console.log("🚀 ~ file: FingerSize.tsx:359 ~ FingerSize ~ option:", option)
    ?.find((size) => size.id === selectedSizeTypeOption?.id)
    ?.units.map((unit) => ({
      ...unit,
      value: unit.value,
      label: unit.value,
    }))}
/>
</> */
}
