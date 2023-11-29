import { t } from "i18next";
import { useEffect, useState } from "react";
import { Select } from "../../../components/molecules";
import { Form, Formik } from "formik";
import TableOfMerging from "./TableOfMerging";
import { Button } from "../../../components/atoms";
import { useFetch, useMutate } from "../../../hooks";
import { notify } from "../../../utils/toast";
import { mutateData } from "../../../utils/mutateData";

const MergeHwya = ({
  operationTypeSelect,
  setOpenTransformToBranchModal,
  setIsSuccessPost,
}: any) => {
  const [mergeIds, setMergeIds] = useState([]);
  const [selectValue, setSelectValue] = useState("");

  const initialValues = {
    category_id: "",
  };

  console.log(operationTypeSelect);

  // FETCH CATEGORY DATA FROM THE API
  const { data: categoryData, isLoading } = useFetch({
    endpoint: `/classification/api/v1/categories?type=all`,
    queryKey: ["all-category"],
    select: (category: any) =>
      category.map((item: any) => ({
        id: item.id,
        value: item.id,
        label: item.name,
        type: item.type,
      })),
    onError: (err) => notify("info", `${err}`),
  });

  // JUST RETURN THE MULTI CHOICE
  const filterMulty = categoryData?.filter(
    (select: any) => select.type !== "single"
  );

  const { mutate, isLoading: mergeLoading } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["merge-api"],
    onSuccess: (data) => {
      notify("success");
      setIsSuccessPost(data);
    },
    onError: (error) => {
      notify("error", `${error.response.data.msg}`);
    },
  });

  function PostNewValue(value: any) {
    mutate({
      endpointName: "/identity/api/v1/api-damg",
      values: value,
      method: "post",
      dataType: "formData",
    });
  }

  useEffect(() => {
    operationTypeSelect.map((operation: any) => {
      if (!mergeIds.includes(Number(operation.id))) {
        setMergeIds((prev) => [...prev, Number(operation.id)]);
      }
    });
  }, []);

  // SEPERATE MULTI SELECT OF TAQM
  const { data: taqm, refetch } = useFetch({
    endpoint: `/identity/api/v1/api-tqm-items/${selectValue}`,
    queryKey: ["taqm"],
    select: (category: any) =>
      category.map((item: any) => ({
        id: item.id,
        value: item.id,
        label: item.name,
      })),
    onError: (err) => console.log(err),
  });

  // REFETCH WHEN SELECT CHANGE
  useEffect(() => {
    refetch();
  }, [selectValue]);

  return (
    <Formik
      validationSchema=""
      initialValues={initialValues}
      onSubmit={(values) => {
        if (!values.category_id) {
          notify("info", "قم باختيار الصنف");
          return;
        }

        setOpenTransformToBranchModal(false);

        PostNewValue({
          category_id: values.category_id.toString(),
          items: mergeIds,
        });

        console.log({
          category_id: values.category_id.toString(),
          items: mergeIds,
        });
      }}
    >
      <Form>
        <div className="flex flex-col gap-10 mt-6">
          <h2>
            <span className="text-xl ml-4 font-bold text-slate-700">
              {t("identity and numbering management")}
            </span>
            <span>{t("merging identities")}</span>
          </h2>

          {/* TABLE OF merging identities */}
          <TableOfMerging operationTypeSelect={operationTypeSelect} />

          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg ml-4 mb-2 font-bold text-slate-700 col-span-1">
              {t("classification group")}
            </h2>
            <div className="w-72">
              <Select
                id="category"
                isDisabled={operationTypeSelect.length === 0}
                name="category_id"
                placeholder={`${t("category")}`}
                loadingPlaceholder={`${t("loading")}`}
                options={filterMulty}
                loading={isLoading}
                onChange={(option: any) => setSelectValue(option?.value)}
              />
            </div>
          </div>

          {taqm?.length > 0 && (
            <div className="flex gap-3 items-center">
              {taqm?.map((el: any) => {
                return (
                  <p
                    className="text-lg text-white rounded-md bg-mainGreen py-1 px-6"
                    key={el?.id}
                  >
                    {el?.label}
                  </p>
                );
              })}
            </div>
          )}

          <Button
            loading={mergeLoading}
            type="submit"
            className="bg-mainGreen text-white self-end"
          >
            {t("confirm")}
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default MergeHwya;
