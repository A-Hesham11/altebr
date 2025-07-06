/////////// IMPORTS
import { useQueryClient } from "@tanstack/react-query";
import { Form, Formik, FormikValues } from "formik";
import { t } from "i18next";
import { Dispatch, SetStateAction } from "react";
import * as Yup from "yup";
import { useIsRTL, useMutate } from "../../../../hooks";
import { requiredTranslation } from "../../../../utils/helpers";
import { mutateData } from "../../../../utils/mutateData";
import { notify } from "../../../../utils/toast";
import { HandleBackErrors } from "../../../../utils/utils-components/HandleBackErrors";
import { Button } from "../../../atoms";
import {
  BaseInputField,
  InnerFormLayout,
  OuterFormLayout,
} from "../../../molecules";
import { Country_city_distract_markets } from "../../reusableComponants/Country_city_distract_markets";
import { ViewMarkets_TP } from "../view/ViewMarkets";
import { MarketMainData } from "./MarketMainData";

//import classes from './Markets.module.css'
///
/////////// Types
///
type MarketType = {
  country_name: string;
  city_name: string;
  name_en: string;
  name_ar: string;
  id: string;
  country_id: string;
  city_id: string;
  district_id: string;
};
type AddMarketProps_TP = {
  setDataSource?: Dispatch<SetStateAction<ViewMarkets_TP[]>>;
  editData?: ViewMarkets_TP;
  setEditData?: any;
  setShow?: Dispatch<SetStateAction<boolean>>;
  title?: string;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

const ValidatingSchema = Yup.object({
  country_id: Yup.string().trim().required(requiredTranslation),
  city_id: Yup.string().trim().required(requiredTranslation),
  district_id: Yup.string().trim().required(requiredTranslation),
  name_ar: Yup.string().trim().required(requiredTranslation),
  name_en: Yup.string().trim().required(requiredTranslation),
});
///
export const AddMarket = ({
  editData,
  setDataSource,
  setShow,
  title,
  setEditData,
}: AddMarketProps_TP) => {
  /////////// VARIABLES
  ///
  const isRTL = useIsRTL();

  const initialValues = {
    name_ar: editData ? editData?.name_ar : "",
    name_en: editData ? editData?.name_en : "",
    country_id: editData ? editData?.country_name : "",
    city_id: editData ? editData?.city_name : "",
    district_id: editData ? editData?.district_id : "",
  };
  ///
  /////////// CUSTOM HOOKS
  ///

  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const queryClient = useQueryClient();
  const { mutate, error, isLoading, isSuccess, reset } = useMutate<MarketType>({
    mutationFn: mutateData,
    onSuccess: (data) => {
      notify("success");
      if (data) {
        queryClient.setQueryData(["markets"], (old: any) => {
          return [
            ...(old || []),
            {
              id: data.id,
              name: isRTL ? data.name_ar : data.name_en,
              country_name: data.country_name,
              city_name: data.city_name,
              district_id: data.district_id,
            },
          ];
        });
      }
      if (setDataSource && setShow && !editData && !error) {
        // setDataSource((prev: any) => [...prev, data])
        queryClient.refetchQueries(["AllMarkets"]);
        setShow(false);
      }
      if (setDataSource && setShow && editData && !error) {
        setShow(false);
        queryClient.refetchQueries(["AllMarkets"]);
        // setDataSource((prev: any) =>
        //   prev.map((p: ViewMarkets_TP) => (p.id === data?.id ? data : p))
        // )
      }
    },
    onError: (error) => {
      notify("error");
    },
  });
  const handleSubmit = (values: FormikValues) => {
    mutate({
      endpointName: editData
        ? `governorate/api/v1/markets/${editData?.id}`
        : `/governorate/api/v1/markets`,
      values: {
        name_ar: values.name_ar,
        name_en: values.name_en,
        country_id: values.country_id,
        city_id: values.city_id,
        district_id: values.district_id,
        ...(editData && { _method: "put" }),
      },
      method: "post",
    });
  };
  ///
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={ValidatingSchema}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        <Form>
          <HandleBackErrors errors={error?.response?.data?.errors}>
            <MarketMainData
              editData={editData}
              setEditData={setEditData}
              title={title}
              isSuccessPost={isSuccess}
              resetData={reset}
              isLoading={isLoading}
            />
          </HandleBackErrors>
        </Form>
      </Formik>
    </>
  );
};
