/////////// IMPORTS
///

import { Formik, useFormikContext } from "formik";
import { t } from "i18next";
import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "../../../components/atoms";
import { DeleteIcon, WeightIcon } from "../../../components/atoms/icons";
import {
  BaseInputField,
  CheckBoxField,
  Modal,
  TextAreaField,
} from "../../../components/molecules";
import { DropFile } from "../../../components/molecules/files/DropFile";
import { SelectCategorySize } from "../../../components/templates/categories-sizes/SelectCategorySize";
import { Country_city_distract_markets } from "../../../components/templates/reusableComponants/Country_city_distract_markets";
import SelectColor from "../../../components/templates/reusableComponants/SelectColor";
import { CategoryMainData_TP, SetState_TP } from "../../../types";
import { prepareItemsToShowInCaseOfTa2m } from "../../../utils/helpers";
import { notify } from "../../../utils/toast";
import {
  GoldCodingSanad_initialValues_TP,
  GoldSanadBand_TP,
  GoldSanad_TP,
  SizePopup_TP,
  addTa2mSizesSchema,
} from "../coding-types-and-helpers";
import { SizesTable } from "./SizesTable";
import { useFetch, useIsRTL } from "../../../hooks";
import { Header } from "../../../components/atoms/Header";
///
/////////// Types
///
type ItemCodingFormProps_TP = {
  setItemsToShowInCaseOfTa2m: SetState_TP<CategoryMainData_TP[]>;
  itemsToShowInCaseOfTa2m: CategoryMainData_TP[] | undefined;
  detailedWeight_total: number | undefined;
  setDetailedWeight_total: SetState_TP<number | undefined>;
  sizes: SizePopup_TP[];
  setSizes: SetState_TP<SizePopup_TP[]>;
  activeBand: GoldSanadBand_TP;
  setActiveBand: SetState_TP<GoldSanadBand_TP | undefined>;
  selectedSanad?: GoldSanad_TP;
  setEditWage?: any;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const GoldItemCodingForm = ({
  setItemsToShowInCaseOfTa2m,
  itemsToShowInCaseOfTa2m,
  detailedWeight_total,
  setDetailedWeight_total,
  sizes,
  setSizes,
  activeBand,
  selectedSanad,
  setActiveBand,
  setEditWage,
}: ItemCodingFormProps_TP) => {
  console.log("🚀 ~ file: GoldItemCodingForm.tsx:63 ~ activeBand:", activeBand);
  /////////// VARIABLES
  ///
  // const selectedBandLeftWeight =  selectedSanad.items.find((item)=>item?.number === activeBand?.number)?.leftWeight
  const hasSizes = !!sizes.length;
  const isMultiCategory =
    activeBand.category.id > 1 && activeBand.category.type === "multi";
  const hasItemsWithSizes = activeBand.category.items?.some(
    (item) => item?.has_size
  );
  const [awzanItems, setAwzanItems] = useState(activeBand.category.items);

  const [openPopup, setOpenPopup] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [search, setSearch] = useState("");
  const [modalNumberChange, setModalNumberChange] = useState("");
  console.log("🚀 ~ modalNumberChange:", modalNumberChange);
  const [page, setPage] = useState(1);

  const { refetch, isSuccess, isLoading, isFetching, isRefetching } = useFetch({
    endpoint: `/tarqimGold/api/v1/tarqim_gold?per_page=10000`,
    queryKey: ["All_numbered_pieces"],
    onSuccess: (data) => {
      setDataSource(data);
    },
  });

  // const { data, isLoading, isFetching, isRefetching, refetch } = useFetch({
  //   queryKey: ["All_numbered_pieces", modalNumberChange],
  //   endpoint:
  //     search === ""
  //       ? `identity/api/v1/pieces_in_edara?model_number[eq]=${modalNumberChange}?page=${page}`
  //       : `${search}&page=${page}`,
  //   onSuccess: (data) => {
  //     setDataSource(data);
  //   },
  //   pagination: true,
  //   enabled: !!modalNumberChange
  // });

  const modalNumber = dataSource && dataSource?.find(
    (item) =>
      item.model_number === modalNumberChange && item.twred_status === "inedara"
  );

  // const awzanItems = activeBand.category.items
  const awzanItemsFormInitValues = awzanItems?.reduce(
    (acc, { id }) => ({
      ...acc,
      [id]: "",
    }),
    {}
  );
  ///
  /////////// CUSTOM HOOKS
  ///
  // const {
  //   data: allCategories,
  //   isLoading: loadingCategories,
  //   isSuccess: allCategoriesFetched,
  // } = useFetch<SelectOption_TP[], Category_TP[]>({
  //   queryKey: ["categories"],
  //   endpoint: "classification/api/v1/categories",
  //   enabled: !!activeBand && activeBand.category?.id == 1,
  //   select: (categs) =>
  //     categs.map((categ) => ({
  //       ...categ,
  //       value: categ.name,
  //       label: categ.name,
  //     })),
  // })

  const { values, setFieldValue, isSubmitting } =
    useFormikContext<GoldCodingSanad_initialValues_TP>();
  ///
  /////////// STATES
  ///

  const [addSizesModal, setAddSizesModal] = useState(false);
  const [weightItemsModal, setWeightItemsModal] = useState(false);
  const IsRTL = useIsRTL();

  ///
  /////////// SIDE EFFECTS
  ///
  useEffect(() => {
    if (!!!itemsToShowInCaseOfTa2m?.length) {
      setAddSizesModal(false);
    }
  }, [!!itemsToShowInCaseOfTa2m?.length]);

  useEffect(() => {
    if (activeBand && detailedWeight_total) {
      setDetailedWeight_total(undefined);
    }
  }, [activeBand]);

  useEffect(() => {
    setAwzanItems(activeBand.category.items);
  }, [activeBand]);

  useEffect(() => {
    // go to bond that have left weight if previous left weight is 0
    const index = selectedSanad?.items.findIndex((item) => item.leftWeight);
    if (!activeBand.leftWeight) setActiveBand(selectedSanad?.items[index]);
  }, [activeBand.leftWeight]);

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const handleFixAllPieceData = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
  };

  const shouldRenderButton = () => {
    const hasItemsWithSizes = activeBand.category.items?.some(
      (item) => item?.has_size
    );
    const isSingleCategory = activeBand.category.type === "single";

    return (
      !!itemsToShowInCaseOfTa2m?.length &&
      (hasItemsWithSizes || isSingleCategory)
    );
  };

  const shouldRenderSizesTable =
    hasSizes && (!isMultiCategory || hasItemsWithSizes);
  ///

  useEffect(() => {
    // const finishedBondTitles = selectedSanad?.items.filter(item=> item.leftWeight === 0).map(item=>item?.category?.name).join(' & ')
    if (!activeBand.leftWeight)
      notify("info", `تم تغيير سطر الترقيم لان السطر السابق انتهي`);
  }, [activeBand]);

  // if(!selectedBandLeftWeight) return <h2 className="text-mainRed text-xl text-center" >{t('left weight for this bond is equal to 0')}</h2>

  return (
    <div className="grid grid-cols-4 gap-x-4 gap-y-8 p-4 relative items-center">
      {/* <div className="col-span-4">
        <Checkbox
          onChange={(e) => handleFixAllPieceData(e)}
          name="fixPieceData"
          id="fixPieceData"
          label="تثبيت معلومات القطعة"
        />
      </div> */}
      {/* غير محدد */}
      {/* {loadingCategories && activeBand.category?.id == 1 && <Spinner />} */}
      {activeBand.category?.id == 1 && (
        <SelectCategorySize
          sizes={sizes}
          setItemsToShowInCaseOfTa2m={setItemsToShowInCaseOfTa2m}
          setAwzanItems={setAwzanItems}
          categoryName="category_id"
          sizeTypeName="size_type"
          showNotDefinedType={false}
          theSizeName="size_unit_id"
        />
      )}
      {/* محدد صنف واحد له مقاس*/}
      {activeBand.category.id > 1 &&
        activeBand.category.type === "single" &&
        !!activeBand.category.has_size && (
          <SelectCategorySize
            initialCategory={activeBand.category}
            categoryName="category_id"
            sizeTypeName="size_type"
            showNotDefinedType={false}
            theSizeName="size_unit_id"
          />
        )}
      {/* محدد صنف واحد ملهوش مقاس*/}
      {activeBand.category.id > 1 &&
        activeBand.category.type === "single" &&
        !!!activeBand.category.has_size && (
          <div className="flex flex-col gap-1">
            <p>{t("classification")}</p>
            <p className="shadows py-1 rounded-md bg-gray-300 h-9 px-3 cursor-default">
              {activeBand.category.name}
            </p>
          </div>
        )}

      {/* محدد طقم */}
      {activeBand.category.id > 1 && activeBand.category.type === "multi" && (
        <div>
          <p>{t("classification")}</p>
          <p className="shadows py-1 rounded-md bg-white h-9 mt-1 px-3 cursor-default">
            {activeBand.category.name}
          </p>
        </div>
      )}

      {/* بتن اضافة المقاسات لو الطقم فيه عناصر ليها مقاسات */}
      {shouldRenderButton() && (
        <Button
          action={() => setAddSizesModal(true)}
          bordered
          className="h-10 mt-7 whitespace-nowrap"
        >
          إضافة مقاسات الطقم
        </Button>
      )}

      {/* رقم الموديل */}
      <BaseInputField
        placeholder={isFetching ? t("loading") : t("model number")}
        label={t("model number")}
        id="model_number"
        type="text"
        name="model_number"
        disabled={isFetching}
        className={isFetching && "bg-mainDisabled"}
        onChange={(e) => {
          setModalNumberChange(e.target.value);

          // const modalNumber = dataSource && dataSource?.find(
          //   (item) =>
          //     item.model_number == e.target.value &&
          //     item.twred_status === "inedara"
          // );

          if (
            modalNumber &&
            modalNumber?.category_id === values.category_id &&
            modalNumber?.karat_value == values.karat_value &&
            modalNumber?.category.selling_type === "all"
          ) {
            setOpenPopup(true);
          }
        }}
      />
      {/* العيار */}
      <div className="flex flex-col gap-1">
        <h2>{t("karats")}</h2>
        <div className="shadows py-1 rounded-md bg-gray-200">
          <p className="px-4  py-[.17rem]">{activeBand.goldKarat}</p>
        </div>
      </div>
      {/* الوزن */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center relative">
          <label htmlFor="wight">{t("weight")}</label>

          <span className="text-sm font-bold text-mainOrange ">
            {" "}
            {t("remaining weight")} {activeBand.leftWeight}
          </span>

          {awzanItems && !!awzanItems?.length && (
            <div className="flex items-center">
              <WeightIcon
                action={() =>
                  detailedWeight_total !== 0 &&
                  !detailedWeight_total &&
                  setWeightItemsModal(true)
                }
              />

              {detailedWeight_total !== 0 && detailedWeight_total && (
                <DeleteIcon
                  // size={10}
                  // className=" -top-2 -start-2"
                  action={() => {
                    setDetailedWeight_total(undefined);
                    values.weightitems = [];
                  }}
                />
              )}
            </div>
          )}
        </div>
        <BaseInputField
          {...{
            id: "wight",
            type: "number",
            name: "weight",
            // label:`${t('weight')}`,
            placeholder: "الوزن",
            onChange: () => {
              setFieldValue("weightitems", []);
            },
            ...(detailedWeight_total !== 0 &&
              detailedWeight_total && {
                value: detailedWeight_total,
                onChange: (e) => {
                  setDetailedWeight_total(+e.target.value);
                },
                disabled: true,
              }),
          }}
          // value={detailedWeight_total !== 0 && detailedWeight_total ? detailedWeight_total : undefined}
          // onChange={(e) => setFieldValue('mezan_weight', e.target.value)}

          // placeholder="الوزن"
          // label="الوزن"
          // id="weight"
          // type="number"
          // name="weight"
          // disabled={selectedBandLeftWeight === 0}
          className={`${
            detailedWeight_total !== 0 && detailedWeight_total && "bg-gray-300"
          } ${values.weight > values.left_weight && "bg-red-100"}`}
        />
      </div>

      {/* المصدر */}
      <Country_city_distract_markets
        countryName="country_id"
        countryFieldKey="id"
      />
      {/* لون الذهب */}
      <SelectColor
        field="id"
        modalTitle="إضافة لون ذهب"
        name="color_id"
        label={t("gold color")}
        // onChange={(option) => {
        //   setFieldValue("color_value", option.value)
        // }}
      />
      {/* الاجرة */}
      <div>
        <BaseInputField
          placeholder={t("fare")}
          label={t("fare")}
          id="wage"
          type="text"
          name="wage"
          onChange={(e) => {
            setEditWage(e.target.value);
          }}
        />
      </div>

      {/* جدول المقاسات */}
      {shouldRenderSizesTable && (
        <div className=" col-span-4">
          <SizesTable sizes={sizes} setSizes={setSizes} />
        </div>
      )}
      {/* صورة القطعة */}
      <div className=" col-span-4 flex flex-col gap-1">
        <label htmlFor="media" className="text-base">
          {t("widget image")}
        </label>
        <DropFile name="media" />
        {/* وصف القطعة */}
      </div>
      <div className="col-span-4 ">
        <TextAreaField
          placeholder={t("Widget description")}
          name="details"
          id="details"
          label={t("Widget description")}
        />
      </div>
      {/* يحتوي علي حجر ام لا */}
      <div
        className={`${
          IsRTL ? "-right-7" : "-left-7"
        } col-span-1 flex items-center justify-center absolute -bottom-16`}
      >
        <CheckBoxField
          name="has_stones"
          label={`${!!!values.has_stones ? "لا" : ""} ${t("contains stones")}`}
        />
        {/* <RadioGroup name="has_stones">
          <RadioGroup.RadioButton
            value={true}
            label="يحتوي علي احجار"
            id="true"
          />
          <RadioGroup.RadioButton
            value={false}
            label="لا يحتوي علي احجار"
            id="false"
          />
        </RadioGroup> */}
      </div>
      {/* /////// */}
      {/* تفاصيل المقاسات */}
      <Modal
        isOpen={addSizesModal && !!itemsToShowInCaseOfTa2m?.length}
        onClose={setAddSizesModal}
        title="إضافة مقاسات الطقم"
      >
        {itemsToShowInCaseOfTa2m?.map((categ) => (
          <Formik
            key={categ.id}
            validationSchema={addTa2mSizesSchema}
            initialValues={{
              sizeIsRequired: true,
              category_id: categ.id,
              size_type: "",
              size_unit_id: "",
            }}
            onSubmit={(values) => {
              if (
                sizes?.some((size) => size.category_id === values.category_id)
              ) {
                notify("error", "هذا المقاس تمت إضافته بالفعل");
                return;
              }
              const { sizeIsRequired, ...filteredValues } = values;
              setSizes((curr) => [
                ...curr,
                { id: crypto.randomUUID(), ...filteredValues },
              ]);

              if (activeBand.category.type === "single") {
                const items = prepareItemsToShowInCaseOfTa2m(categ, sizes);
                items && setItemsToShowInCaseOfTa2m(items);
              }
              notify("success");
            }}
          >
            {({ submitForm }) => (
              <>
                <div className="grid grid-cols-4 gap-x-5">
                  <SelectCategorySize
                    initialCategory={categ}
                    categoryName="category_id"
                    sizeTypeName="size_type"
                    showNotDefinedType={false}
                    theSizeName="size_unit_id"
                  />
                </div>
                <Button
                  type="button"
                  action={submitForm}
                  className="mt-8 mr-auto flex"
                >
                  حفظ
                </Button>
              </>
            )}
          </Formik>
        ))}
      </Modal>

      {/* تفاصيل الاوزان */}
      <Modal
        isOpen={
          !!awzanItems &&
          !!awzanItems.length &&
          weightItemsModal &&
          detailedWeight_total !== 0 &&
          !detailedWeight_total
        }
        onClose={setWeightItemsModal}
        title="الوزن التفصيلي للقطع"
      >
        <>
          <Formik
            initialValues={awzanItemsFormInitValues || {}}
            onSubmit={(vals) => {
              // لو تجميعة الاوزان اكتر من ال leftWeight اريتيرن
              let allWeight = 0;
              const weightitems = Object.entries(vals).map(([key, val]) => {
                // @ts-ignore
                allWeight += +val;
                return { category_id: key, weight: val };
              });
              if (allWeight > activeBand.leftWeight) {
                notify("error", "تجميعة الأوزان اكثر من الوزن المتبقي");
                return;
              }
              if (allWeight <= 0) {
                notify("error", "أدخل اوزان");
                return;
              }

              // ALL ✅
              /* 
              - اعمل ابديت للوزن الاجمالي
              - setFieldValue
              - اقفل المودل
              */
              setFieldValue("weightitems", weightitems);
              setFieldValue("weight", allWeight);
              setDetailedWeight_total(allWeight);
              setWeightItemsModal(false);
            }}
          >
            {({ submitForm, values }) => (
              <>
                <div className="grid grid-cols-4 gap-5 py-20">
                  {awzanItems?.map((item, i) => (
                    <BaseInputField
                      key={item.id}
                      label={item.name}
                      id={`${item.name}_${i}`}
                      name={item.id.toString()}
                      type="number"
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  action={submitForm}
                  className="mt-8 mr-auto flex"
                >
                  {t("confirm")}
                </Button>
              </>
            )}
          </Formik>
        </>
      </Modal>

      <Modal isOpen={openPopup} onClose={() => setOpenPopup(false)}>
        <div className="flex flex-col gap-8 justify-center items-center">
          <Header header={t("")} />
          <div className="w-full mb-4">
            <p className="font-semibold text-lg text-center mb-5">
              {t("This item already exists")}
            </p>
            <div className="w-full flex justify-center">
              {modalNumber?.images[0]?.preview ? (
                <img
                  src={modalNumber?.images[0]?.preview}
                  className="w-[80%] h-[250px]"
                />
              ) : (
                ""
              )}
            </div>
            <div className="flex items-center justify-between mt-10 mx-auto w-1/2">
              <p className="font-semibold">
                {t("Id number")} :{" "}
                <span className="text-mainGreen font-semibold">
                  {modalNumber?.hwya}
                </span>
              </p>
              <p className="font-semibold">
                {t("weight")} :{" "}
                <span className="text-mainGreen font-semibold">
                  {modalNumber?.weight}
                </span>
              </p>
            </div>
          </div>
          {/* <div className="flex gap-4 justify-end items-center w-full">
                  <Button
                    type="submit"
                    action={() => {
                    }}
                  >
                    {`${t("confirm")}`}
                  </Button>
              </div> */}
        </div>
      </Modal>
    </div>
  );
};
