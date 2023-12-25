/////////// IMPORTS
///
import { Formik } from "formik";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../../components/atoms/Header";
import { useFetch, useLocalStorage } from "../../../hooks";
import { useGetQueryData } from "../../../hooks/useGetQueryData";
import { Category_TP, SelectOption_TP, SetState_TP } from "../../../types";
import { notify } from "../../../utils/toast";
import {
  GoldCodingSanad_initialValues_TP,
  GoldCodingStoneValues_TP,
  GoldSanadBand_TP,
  GoldSanad_TP,
  SizePopup_TP,
  codingSanad_initialValues,
  codingSanad_schema,
} from "../coding-types-and-helpers";
import { GoldCodingSanadFormHandler } from "./GoldCodingSanadFormHandler";
///
/////////// Types
///
type CodingSanadProps_TP = {
  addedPieces: GoldCodingSanad_initialValues_TP[];
  setAddedPieces: SetState_TP<GoldCodingSanad_initialValues_TP[]>;
  stage: number;
  setStage: SetState_TP<number>;
  selectedSanad: GoldSanad_TP | undefined;
  setSelectedSanad: SetState_TP<GoldSanad_TP | undefined>;
};
/////////// HELPER VARIABLES & FUNCTIONS
///
const maxPiecesNumber = 30;
///
export const CodingSanad = ({
  setAddedPieces,
  addedPieces,
  stage,
  setStage,
  selectedSanad,
  setSelectedSanad,
  isSuccess
}: CodingSanadProps_TP) => {

  /////////// VARIABLES
  ///
  const { sanadId } = useParams();
  const [addedPiecesLocal, setAddedPiecesLocal] = useLocalStorage<
    GoldCodingSanad_initialValues_TP[]
  >(`addedPiecesLocal_${sanadId}`);

  ///
  /////////// CUSTOM HOOKS
  ///

  const { data: categories } = useFetch<SelectOption_TP[]>({
    endpoint: "classification/api/v1/categories?per_page=10000",
    queryKey: ["categories"],
  });
  ///
  /////////// STATES
  ///

  const [sizes, setSizes] = useState<SizePopup_TP[]>([]);

  const [stones, setStones] = useState<GoldCodingStoneValues_TP[]>([]);

  const [detailedWeight_total, setDetailedWeight_total] = useState<
    number | undefined
  >();

  const [activeBand, setActiveBand] = useState<GoldSanadBand_TP | undefined>();

  ///
  /////////// SIDE EFFECTS
  ///
  useEffect(() => {
    // const x = OTF(addedPieces)
    // localStorage.setItem(`addedPiecesLocal_${sanadId}`, JSON.stringify(x))

    setAddedPiecesLocal(addedPieces);
  }, [addedPieces]);
  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const isAbleToCodeMore = () => {
    let goAhead = true;

    if (addedPieces.length === maxPiecesNumber - 2) {
      notify(
        "info",
        `قمت بإدخال عدد ${addedPieces.length + 1} قطع وباقي قطعة واحدة`
      );
    }

    if (addedPieces.length === maxPiecesNumber) {
      notify("error", "قمت بإدخال الحد الأقصي للقطع");
      goAhead = false;
    }
    return goAhead;
  };

  const updateBandWithNewWeight = (
    values: GoldCodingSanad_initialValues_TP
  ) => {
    if (activeBand) {
      const newBand = () => {
        if (stones.some((stone) => stone.stone_type === "not_added")) {
          const notAddedStones = stones.filter(
            (stone) => stone.stone_type === "not_added"
          );
          const tableWeight = notAddedStones.reduce(
            (acc, curr) => acc + +curr.weight,
            0
          );

          setAddedPieces((curr) => [
            ...curr,
            {
              ...values,
              front_key: crypto.randomUUID(),
              mezan_weight: values.weight - tableWeight * 0.2,
              front_key_twred:activeBand.front_key_twred
            },
          ]);
          
          return {
            ...activeBand,
            leftWeight:
              activeBand.leftWeight - (values.weight - tableWeight * 0.2),
              front_key_twred:activeBand.front_key_twred
          };
        } else {

          setAddedPieces((curr) => [
            ...curr,
            {
              ...values,
              front_key: crypto.randomUUID(),
              mezan_weight: values.weight,
              front_key_twred:activeBand.front_key_twred
            },
          ]);

          return {
            ...activeBand,
            leftWeight: +activeBand.leftWeight - +values.weight,
            front_key_twred:activeBand.front_key_twred
          };
        }
      };

      const theBand: GoldSanadBand_TP = newBand();
      setActiveBand(theBand);

      setSelectedSanad((curr) => ({
        ...curr,
        items: curr?.items.map((band) => {
          if (band.id === activeBand.id) {
            return theBand;
          } else {
            return band;
          }
        }),
      }));
    }
  };

  function finalSubmit(values: GoldCodingSanad_initialValues_TP) {
    if (!isAbleToCodeMore()) return;

    updateBandWithNewWeight(values);
    // setAddedPieces((curr) => [...curr, { ...values, stones }])
    // setAddedPieces((curr) => [
    //   ...curr,
    //   { ...values, front_key: crypto.randomUUID() },
    // ])

    // setActiveBand((curr) => {
    //   return { ...curr, leftWeight: curr?.leftWeight - values.weight }
    // })
  }
  ///
  return (
    <>
      <div className="flex w-full flex-col gap-6">
        <Header header={t("gold coding")} className="text-2xl" />
        <div className="flex w-full flex-col gap-6">
          <Formik
            validationSchema={codingSanad_schema}
            initialValues={codingSanad_initialValues}
            onSubmit={(values) => {
              const  weightitemsDetails = activeBand?.category?.items?.map(category=>({
                category_id : category.id,
                weight:0
              }))
              notify("success", `${t("piece has been added")}`);
              // VARS
              const selectedCateg = categories?.find(
                (categ) => categ.id === values.category_id
              );
              const hasSize = selectedCateg?.has_size;
              const isTa2m = selectedCateg?.type === "multi";
              const thereAreSizes = !!sizes.length;
              const thereAreWeightItems = !!values.weightitems?.length;
              //--------------------------
              let {
                size_type,
                size_unit_id,
                sizeIsRequired,
                left_weight,
                stones: Omitted,
                weightitems,
                init_wage,
                front_key_twred,
                ...baseValues
              } = values;

              if (values.has_stones && !!stones?.length) {
                baseValues = { ...baseValues, stones };
              }

              // ---> فير محدد او صنف عادي - صنف له مقاس - تم اضافة المقاس
              if (hasSize && !!values.size_type && !!values.size_unit_id) {
                const vals = {
                  ...baseValues,
                  size_type: values.size_type,
                  size_unit_id: values.size_unit_id,
                  front_key_twred: values.front_key_twred,
                };

                finalSubmit(vals);
                return;
              }
              // ---> غير محدد - طقم - يوجد مقاسات مفصلة
              if (isTa2m) {
                const vals = {
                  ...baseValues,
                  ...(thereAreSizes && { sizes }),
                  ...(thereAreWeightItems ? {
                    weightitems: values.weightitems,
                  } :{ weightitems: weightitemsDetails}),
                };

                finalSubmit(vals);
                return;
              }
              finalSubmit(baseValues);
            }}
          >
            {({ values, setFieldValue, submitForm, errors }) => (
              <>
                <GoldCodingSanadFormHandler
                  selectedSanad={selectedSanad}
                  setSelectedSanad={setSelectedSanad}
                  detailedWeight_total={detailedWeight_total}
                  setDetailedWeight_total={setDetailedWeight_total}
                  sizes={sizes}
                  setSizes={setSizes}
                  stones={stones}
                  setStones={setStones}
                  addedPieces={addedPieces}
                  setAddedPieces={setAddedPieces}
                  stage={stage}
                  setStage={setStage}
                  activeBand={activeBand}
                  setActiveBand={setActiveBand}
                  isSuccess={isSuccess}
                />
              </>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};
