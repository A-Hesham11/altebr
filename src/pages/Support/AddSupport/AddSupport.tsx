import React, { useEffect, useState } from "react";
import { Button } from "../../../components/atoms";
import { t } from "i18next";
import { Form, Formik } from "formik";
import {
  BaseInputField,
  Checkbox,
  Select,
  TextAreaField,
} from "../../../components/molecules";
import { FilesUpload } from "../../../components/molecules/files/FileUpload";
import { useFetch, useMutate } from "../../../hooks";
import { notify } from "../../../utils/toast";
import { mutateData } from "../../../utils/mutateData";
import { useQueryClient } from "@tanstack/react-query";

const AddSupport = ({ editData, refetch, setShow, isSub, activeBtn }) => {
  console.log("🚀 ~ AddSupport ~ editData:", editData);
  const [activeAdd, setActiveAdd] = useState(activeBtn || 1);
  const [hasChildCheck, setHasChildCheck] = useState(false);
  const [files, setFiles] = useState([]);
  const queryClient = useQueryClient();
  const [editValues, setEditValues] = useState();

  const initialValues = {
    name_ar: editData?.name_ar || "",
    name_en: editData?.name_en || "",
    desc: editData?.has_child === 1 ? editData?.ck : editData?.desc,
    category_id: editData?.category_id || "",
    parent_id: editData?.parent_id || "",
    ck: editData?.ck || "",
  };

  const {
    data: sectionOption,
    refetch: sectionOptionRefetch,
    isFetching,
    isLoading,
    isRefetching,
  } = useFetch({
    endpoint: `/attachment/api/v1/categories`,
    queryKey: ["section-option"],
    select: (data) =>
      data.map((el) => {
        return {
          id: el.id,
          value: el.id || "",
          label: el.name_ar || "",
        };
      }),
  });

  const {
    data: forkedOption,
    refetch: forkedOptionRefetch,
    isFetching: forkedFetching,
    isLoading: forkedIsLoading,
    isRefetching: forkedRefetching,
  } = useFetch({
    endpoint: `/attachment/api/v1/parent`,
    queryKey: ["forked-option"],
    select: (data) =>
      data.map((el) => {
        return {
          id: el.id,
          value: el.id || "",
          label: el.name_ar || "",
        };
      }),
  });
  console.log("🚀 ~ AddSupport ~ forkedOption:", forkedOption);

  const {
    mutate,
    isLoading: postIsLoading,
    isSuccess,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["mainSection"],
    onSuccess: (data) => {
      notify("success", t("section is added successfully"));
      queryClient.refetchQueries(["support-data"]);
    },
    onError: (error: any) => {
      notify("success", t("section is added successfully"));
      queryClient.refetchQueries(["support-data"]);
      // notify("error", error?.message);
    },
  });

  const PostSectionEdit = (values: any) => {
    mutate({
      endpointName: isSub
        ? `/attachment/api/v1/upSub/${editData?.id}`
        : `/attachment/api/v1/upCat/${editData?.id}`,
      values: {
        ...values,
      },
    });
  };

  const posSectionHandler = (values: any) => {
    let invoice;

    if (activeAdd === 1) {
      invoice = {
        name_ar: values.name_ar,
        name_en: values.name_en,
      };
    } else if (activeAdd === 2) {
      invoice = {
        name_ar: values.name_ar,
        name_en: values.name_en,
        category_id: values.category_id,
        desc: values.desc,
        has_child: 0,
      };
    } else {
      invoice = {
        name_ar: values.name_ar,
        name_en: values.name_en,
        parent_id: values.parent_id,
        has_child: hasChildCheck ? 1 : 0,
        ck: values.ck,
      };
    }

    mutate({
      endpointName:
        activeAdd === 1
          ? "/attachment/api/v1/addCat"
          : "/attachment/api/v1/addSub",
      values: { ...invoice, image: files[0] },
      dataType: "formData",
    });

    console.log({ ...invoice, image: files[0] });
  };

  useEffect(() => {
    if (editData && isSuccess) {
      setShow(false);
      refetch();
    }
  }, [isSuccess]);

  useEffect(() => {
    const best = {
      id: editData?.id || "",
      value: editData?.id || "",
      label: editData?.name_ar || `${t("section")}`,
    };
    setEditValues(best);
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values: any) => {
        if (editData) {
          PostSectionEdit({
            ...values,
          });
        } else {
          posSectionHandler({
            ...values,
          });
        }
      }}
      validationSchema={""}
    >
      {({ values }) => {
        return (
          <Form>
            {/* TABS */}
            <div className="flex items-center gap-4 my-14">
              <Button
                onClick={() => {
                  if (editData && activeAdd !== 1) return;
                  setActiveAdd(1);
                }}
                className={`bg-transparent border border-mainGreen/50 text-mainGreen ${
                  activeAdd === 1 && "bg-mainGreen text-white"
                } ${
                  editData &&
                  activeAdd !== 1 &&
                  "bg-mainDisabled cursor-not-allowed opacity-50"
                }`}
              >
                {t("add section")}
              </Button>
              <Button
                onClick={() => {
                  if (editData && activeAdd !== 2) return;
                  setActiveAdd(2);
                }}
                className={`bg-transparent border border-mainGreen/50 text-mainGreen ${
                  activeAdd === 2 && "bg-mainGreen text-white"
                } ${
                  editData &&
                  activeAdd !== 2 &&
                  "bg-mainDisabled cursor-not-allowed opacity-50"
                }`}
              >
                {t("add sub section")}
              </Button>
              <Button
                onClick={() => {
                  if (editData && activeAdd !== 3) return;
                  setActiveAdd(3);
                }}
                className={`bg-transparent border border-mainGreen/50 text-mainGreen ${
                  activeAdd === 3 && "bg-mainGreen text-white"
                } ${
                  editData &&
                  activeAdd !== 3 &&
                  "bg-mainDisabled cursor-not-allowed opacity-50"
                }`}
              >
                {t("forked")}
              </Button>
            </div>

            {/* CONTENT OF TABS */}
            <div className="my-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <BaseInputField
                id="name_ar"
                name="name_ar"
                type="text"
                label={`${t("name in arabic")}`}
                placeholder={`${t("name in arabic")}`}
                onChange={() => {}}
              />
              <BaseInputField
                id="name_en"
                name="name_en"
                type="text"
                label={`${t("name in english")}`}
                placeholder={`${t("name in english")}`}
                onChange={() => {}}
              />

              {/* ATTACHMENT */}
              <div className="w-44 self-end">
                <FilesUpload files={files} setFiles={setFiles} />
              </div>

              {/* SECOND OPTION */}
              {activeAdd === 2 && (
                <>
                  <div className="">
                    <Select
                      name="category_id"
                      className="rounded-xl !h-12 text-black"
                      placeholder={`${t("section")}`}
                      options={sectionOption}
                      value={editValues}
                      loading={isLoading || isFetching || isRefetching}
                    />
                  </div>
                  <TextAreaField
                    placeholder={`${t("add description")}`}
                    id="desc"
                    name="desc"
                    required
                    value={values?.desc}
                    rows={3}
                  />
                </>
              )}

              {/* THIRD OPTION */}
              {activeAdd === 3 && (
                <>
                  <div className="">
                    <Select
                      name="parent_id"
                      className="rounded-xl !h-12 text-black scrollbar-none mt-auto"
                      placeholder={`${t("forked")}`}
                      options={forkedOption}
                      loading={
                        forkedFetching || forkedIsLoading || forkedRefetching
                      }
                    />
                  </div>

                  {hasChildCheck && (
                    <TextAreaField
                      placeholder={`${t("add description")}`}
                      id="ck"
                      name="ck"
                      required
                      rows={3}
                    />
                  )}

                  <div className="flex items-center">
                    <Checkbox
                      labelClassName="text-base"
                      onChange={(e) => setHasChildCheck((prev) => !prev)}
                      label={t("final forked")}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Button
                type="submit"
                className=""
                action={() => {
                  // console.log(values.values);
                }}
              >
                {t("save")}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddSupport;
