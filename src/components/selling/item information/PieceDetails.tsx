import { Formik, Form } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { notify } from "../../../utils/toast";
import { t } from "i18next";
import * as Yup from "yup";
import { BaseInputField } from "../../molecules";
import { Button } from "../../atoms";
import { BiSearch, BiXCircle } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { Loading } from "../../organisms/Loading";
import { ItemInformation_TP } from "../../../pages/selling/ItemInformation";
import StonesDetails from "./StonesDetails";
import { FilesPreviewOutFormik } from "../../molecules/files/FilesPreviewOutFormik";
import { ViewSvgIcon } from "../../atoms/icons";
import { CLightbox } from "../../molecules/files/CLightbox";
import { useNavigate } from "react-router-dom";
import goldImg from "../../../assets/gold.png";

const validationSchema = () =>
  Yup.object({
    item_id: Yup.string().required(),
    classification_id: Yup.string(),
    category_id: Yup.string(),
    weight: Yup.string(),
    karat_id: Yup.string(),
    wage: Yup.string(),
    selling_price: Yup.string(),
    // المورد
    diamond_weight: Yup.string(),
    color_id: Yup.string(),
    date: Yup.string(),
    // سند التوريد
    diamond_value: Yup.string(),
    // سند الفرع
    stones_weight: Yup.string(),
    country_id: Yup.string(),
    size_unit_id: Yup.string(),
    sizes: Yup.string(),
    model_number: Yup.string(),
    moured: Yup.string(),
    // حالة القطعة
    hwya: Yup.string(),
    details: Yup.string(),
  });

const PieceDetails = ({
  dataSource,
  setSearchId,
  isSuccess,
  isLoading,
  searchId,
  isFetching,
  data,
}: ItemInformation_TP) => {
  const peiceDetails =
    dataSource?.map((item) => {
      return { ...item, ...item.detailsItem[0] };
    }) || [];

  const initialValues: ItemInformation_TP[] = {
    hwya: peiceDetails[0]?.hwya || "",
    item_id: peiceDetails[0]?.item_id || "",
    classification_id: peiceDetails[0]?.classification_name || "",
    category_id: peiceDetails[0]?.category_name || "",
    weight: peiceDetails[0]?.weight || "",
    karat_id: peiceDetails[0]?.karat_name || "",
    wage: peiceDetails[0]?.wage || "",
    selling_price:
      peiceDetails[0]?.selling_price || peiceDetails[0]?.cost || "",
    supplier: peiceDetails[0]?.moured || "",
    // // المورد
    // diamond_weight: peiceDetails[0]?.diamond_weight || "",
    color_id: peiceDetails[0]?.color_name || "",
    date: peiceDetails[0]?.date || "",
    // سند التوريد
    diamond_value: peiceDetails[0]?.diamond_value || "",
    // سند الفرع
    stones_weight: peiceDetails[0]?.stones_weight || "",
    country_id: peiceDetails[0]?.country_name || "",
    size_unit_id: peiceDetails[0]?.size_unit_id || "",
    sizes: peiceDetails[0]?.sizes || "",
    model_number: peiceDetails[0]?.model_number || "",
    //  المصدر
    moured: peiceDetails[0]?.moured || "",
    // حالة القطعة
    details: peiceDetails[0]?.details || "",
  };

  const headerPlaceholders = [
    {
      label: `${t("id code")}`,
    },
    {
      label: `${t("piece number")}`,
    },
    {
      label: `${t("category")}`,
    },
    {
      label: `${t("classification")}`,
    },
    {
      label: `${t("weight")}`,
    },
    {
      label: `${t("karat value")}`,
    },
    {
      label: `${t("fare")}`,
    },
    {
      label: `${t("widget cost")}`,
    },
    {
      label: `${t("supplier")}`,
    },
    {
      label: `${t("gold color")}`,
    },
    {
      label: `${t("supply date")}`,
    },
    {
      label: `${t("supply bond")}`,
    },
    {
      label: `${t("Branch document")}`,
    },
    {
      label: `${t("country")}`,
    },
    {
      label: `${t("size type")}`,
    },
    {
      label: `${t("size number")}`,
    },
    {
      label: `${t("model number")}`,
    },
    {
      label: `${t("source")}`,
    },
    {
      label: `${t("widget status")}`,
    },
    {
      label: `${t("widget description")}`,
    },
  ];

  const headerContentStrings = headerPlaceholders?.map((item) => item.label);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (peiceDetails[0]?.attachment.length === 0) {
      setLightboxOpen(false);
    }
  }, [peiceDetails[0]?.attachment.length]);

  const imagePreview = peiceDetails[0]?.attachment.map((image) => ({
    preview: image?.type === "image" ? image?.path : image?.preview,
    path: image.preview,
    type: "image",
  }));

  return (
    <div className=" mb-6 relative ">
      <Formik
        initialValues={initialValues}
        validationSchema={() => validationSchema()}
        onSubmit={(values, { setFieldValue, resetForm, submitForm }) => {
          setSearchId(values.item_id);

          if (values?.item_id == searchId && !peiceDetails[0]) {
            Object.keys(values).forEach((key) => {
              if (peiceDetails) {
                setFieldValue(key, peiceDetails[0][key]);
              }
            });
          } else {
            resetForm();
          }
        }}
      >
        {({ setFieldValue, values, setValues, resetForm }) => {
          return (
            <Form>
              <div className="flex justify-between items-center mb-4">
                <p className="text-base font-bold">{t("widget details")}</p>
                <div className="flex gap-4 items-center">
                  <BaseInputField
                    placeholder={`${t("search by ID code")}`}
                    id={values.item_id}
                    name="item_id"
                    type="text"
                    value={values.item_id}
                    onChange={(e) => {
                      setFieldValue("item_id", e.target.value);
                    }}
                  />
                  <Button
                    type="submit"
                    loading={isLoading && searchId}
                    className="bg-flatWhite border-2 border-mainGreen py-[6px] text-mainGreen flex items-center gap-2"
                  >
                    <BiSearch size={20} />
                    <p>{t("search")}</p>
                  </Button>
                </div>
              </div>
              <div className="bg-flatWhite rounded-lg bill-shadow p-5 h-41 relative ">
                <div className="grid grid-cols-4 lg:grid-cols-5 gap-8 PieceDetails">
                  {Object.keys(values).map((key, index) => {
                    return (
                      <BaseInputField
                        placeholder={headerContentStrings[index]}
                        label={headerContentStrings[index]}
                        id={key}
                        name={peiceDetails[0] && key}
                        type="text"
                        value={peiceDetails[0] && initialValues[key]}
                        disabled
                        className="bg-[#295E5608] text-base"
                      />
                    );
                  })}
                </div>
                {peiceDetails[0]?.attachment.length === 0 ? (
                  <p className="border-2 text-lg font-bold flex justify-center items-center border-dashed bill-shadow w-[290px] lg:w-80 h-72 rounded-lg absolute top-[58%] lg:top-2/4 left-4">
                    {t("widget image not found")}
                  </p>
                ) : (
                  <div className="flex justify-end ">
                    <img
                      src={
                        peiceDetails[0]
                          ? peiceDetails[0].attachment[0]?.preview
                          : `${goldImg}`
                      }
                      alt="صورة القطعة"
                      className={`${
                        peiceDetails[0]
                          ? "top-2/4 lg:top-[44%]"
                          : "top-[55%] lg:top-2/4"
                      } border-2 border-dashed bill-shadow w-[290px] lg:w-80 h-72 rounded-lg absolute  left-4`}
                    />
                    <div className="flex items-center justify-center gap-2 my-3 w-72 lg:w-80">
                      {!!peiceDetails[0]?.attachment.length && (
                        <>
                          <div className="flex flex-col  gap-1 justify-center">
                            <span className="text-[8px] text-gray-700 text-center">
                              الصور
                            </span>
                            <div className="bg-lightGray rounded-md p-1 relative ">
                              <div
                                onClick={() => setLightboxOpen(true)}
                                className="cursor-pointer flex items-center justify-center p-2 "
                              >
                                <span className=" absolute -top-1 -right-3 bg-mainGreen px-2 py-1 text-[7px] rounded-full text-white">
                                  {peiceDetails[0]?.attachment.length}
                                </span>
                                <ViewSvgIcon stroke="#292D32" />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* images*/}
                {!!peiceDetails[0]?.attachment.length && lightboxOpen && (
                  <CLightbox
                    // preview={preview}
                    open={lightboxOpen}
                    closeHandler={() => setLightboxOpen(false)}
                    images={imagePreview}
                  />
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default PieceDetails;

// if (!filteredArray) {
//     notify("info", `${t("widget not available")}`)
// }
// if (isSuccess && peiceDetails?.length === 0) {
//     notify("info", `${t("please add data first")}`)
// } else {
//     navigate("/payment")
// }
