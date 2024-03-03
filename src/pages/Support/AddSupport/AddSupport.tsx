import { Form, Formik, useFormikContext } from "formik";
import { t } from "i18next";
import { useEffect, useState } from "react";
import {
  BaseInputField,
  Modal,
  Select,
  TextAreaField,
} from "../../../components/molecules";
import { IoMdAdd } from "react-icons/io";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FilesUpload } from "../../../components/molecules/files/FileUpload";
import { Button } from "../../../components/atoms";
import AddSupportArticle from "./AddSupportArticle";
import { useFetch, useMutate } from "../../../hooks";
import { notify } from "../../../utils/toast";
import { mutateData } from "../../../utils/mutateData";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FilesPreview } from "../../../components/molecules/files/FilesPreview";

interface AddSupport_TP {
  editData?: any;
  refetch?: () => void;
  levelType?: string;
  title?: string;
}

interface InitialValues {
  level_one_id: string;
  level_two_id: string;
  level_three_id: string;
  level_four_id: string;
  level_one_name_ar: string;
  level_one_name_en: string;
  level_two_name_ar: string;
  level_two_name_en: string;
  level_three_name_ar: string;
  level_three_name_en: string;
  level_four_name_ar: string;
  level_four_name_en: string;
  level_two_desc: string;
  steps_ar: string;
  steps_en: string;
  article_name_ar: string;
  article_name_en: string;
  article_title: string;
}

const AddSupport: React.FC<AddSupport_TP> = ({
  editData,
  refetch,
  levelType,
  title,
}) => {
  const [levelOneModal, setLevelOneModal] = useState(false);
  const [levelTwoModal, setLevelTwoModal] = useState(false);
  const [levelThreeModal, setLevelThreeModal] = useState(false);
  const [levelFourModal, setLevelFourModal] = useState(false);
  const [filesLevelOne, setFilesLevelOne] = useState([]);
  const [filesLevelTwo, setFilesLevelTwo] = useState([]);
  const [filesLevelThree, setFilesLevelThree] = useState([]);
  const [stepFile, setStepFile] = useState([]);
  const [supportArticleData, setSupportArticleData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [articlesData, setArticlesData] = useState([]);
  const [levelOneId, setLevelOneId] = useState(null);
  const [levelTwoId, setLevelTwoId] = useState(null);
  const [levelThreeId, setLevelThreeId] = useState(null);
  const [levelOneSelectEdit, setLevelOneSelectEdit] = useState<any>(null);
  const [levelTwoSelectEdit, setLevelTwoSelectEdit] = useState<any>(null);
  const [levelThreeSelectEdit, setLevelThreeSelectEdit] = useState<any>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const imagePreview = editData?.images?.map((image) => ({
    preview: image.preview,
    path: image.preview,
    type: "image",
  }));

  const initialValues: InitialValues = {
    level_one_id: editData?.cat_support_id || "",
    level_two_id: editData?.level_two_support_id || "",
    level_three_id: editData?.level_third_support_id || "",
    level_four_id: editData?.level_four_id || "",
    level_one_name_ar: editData?.name_ar || "",
    level_one_name_en: editData?.name_en || "",
    level_two_name_ar: editData?.name_ar || "",
    level_two_name_en: editData?.name_en || "",
    level_three_name_ar: editData?.name_ar || "",
    level_three_name_en: editData?.name_en || "",
    level_four_name_ar: editData?.name_ar || "",
    level_four_name_en: editData?.name_en || "",
    level_two_desc: editData?.desc || "",
    steps_ar: editData?.desc_ar || "",
    steps_en: editData?.desc_en || "",
    article_name_ar: editData?.name_ar || "",
    article_name_en: editData?.name_en || "",
    article_title: editData?.level_third_support_name || "",
  };

  useEffect(() => {
    if (editData && levelType == "1") setLevelOneModal(true);
    else if (editData && levelType == "2") setLevelTwoModal(true);
    else if (editData && levelType == "3") setLevelThreeModal(true);
  }, []);

  const {
    data: levelOneOption,
    refetch: levelOneRefetch,
    isFetching: levelOneIsFetching,
    isLoading: levelOneIsLoading,
    isRefetching: levelOneIsRefetching,
  } = useFetch({
    endpoint: `/support/api/v1/catSupport`,
    queryKey: ["level-one-option"],
    select: (data: any) =>
      data.map((el: any) => {
        return {
          id: el.id,
          value: el.id || "",
          label: el.name_ar || "",
        };
      }),
  });

  const {
    data: levelTwoOption,
    refetch: levelTwoRefetch,
    isFetching: levelTwoIsFetching,
    isLoading: levelTwoIsLoading,
    isRefetching: levelTwoIsRefetching,
  } = useFetch({
    endpoint: `/support/api/v1/levelTwoSupport/${levelOneId}`,
    queryKey: ["level-two-option"],
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
    data: levelThreeOption,
    refetch: levelThreeRefetch,
    isFetching: levelThreeIsFetching,
    isLoading: levelThreeIsLoading,
    isRefetching: levelThreeIsRefetching,
  } = useFetch({
    endpoint: `/support/api/v1/levelThirdSupport/${levelTwoId}`,
    queryKey: ["level-three-option"],
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
    mutate,
    isLoading: postIsLoading,
    isSuccess,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["levels"],
    onSuccess: (data) => {
      notify("success", t("level is added successfully"));
      queryClient.refetchQueries(["level-one-option"]);
      queryClient.refetchQueries(["level-two-option"]);
      queryClient.refetchQueries(["level-three-option"]);
      queryClient.refetchQueries(["levels"]);
    },
    onError: (error: any) => {
      notify("error", error?.message);
    },
  });

  // LEVEL ONE HANDLE ADD
  const postLevelOneHandler = (values: any) => {
    const invoice = {
      name_ar: values.level_one_name_ar,
      name_en: values.level_one_name_en,
    };

    mutate({
      endpointName: "/support/api/v1/catSupport",
      values: { ...invoice, media: filesLevelOne },
      dataType: "formData",
    });

    console.log({ ...invoice, media: filesLevelOne });
  };

  // LEVEL TWO HANDLE ADD
  const postLevelTwoHandler = (values: any) => {
    const invoice = {
      name_ar: values.level_two_name_ar,
      name_en: values.level_two_name_en,
      cat_support_id: values.level_one_id,
      desc: values.level_two_desc,
    };

    mutate({
      endpointName: "/support/api/v1/levelTwoSupport",
      values: { ...invoice, media: filesLevelTwo },
      dataType: "formData",
    });

    console.log({ ...invoice, media: filesLevelTwo });
  };

  // LEVEL THREE HANDLE ADD
  const postLevelThreeHandler = (values: any) => {
    const invoice = {
      name_ar: values.level_three_name_ar,
      name_en: values.level_three_name_en,
      cat_support_id: values.level_one_id,
      level_two_support_id: values.level_two_id,
    };

    mutate({
      endpointName: "/support/api/v1/levelThirdSupport",
      values: { ...invoice },
      dataType: "formData",
    });

    console.log({ ...invoice });
  };

  // // LEVEL FOUR HANDLE ADD
  // const postLevelFourHandler = (values: any) => {
  //   const invoice = articlesData?.map((article: any) => {
  //     return {
  //       name_ar: article.name_ar,
  //       name_en: article.name_en,
  //       desc_ar: article.step_ar,
  //       desc_en: article.step_en,
  //       cat_support_id: values.level_one_id,
  //       level_two_support_id: values.level_two_id,
  //       level_third_support_id: values.level_three_id,
  //       media: article.media,
  //     };
  //   });

  //   mutate({
  //     endpointName: "/support/api/v1/levelFourthSupport",
  //     values: { items: invoice },
  //     dataType: "formData",
  //   });
  // };

  // LEVEL ONE HANDLE EDIT
  const PostLevelOneEdit = (values: any) => {
    const invoice = {
      name_ar: values.level_one_name_ar,
      name_en: values.level_one_name_en,
    };

    mutate({
      endpointName: `/support/api/v1/catSupport/${editData?.id}`,
      values: {
        ...invoice,
        _method: "put",
      },
    });
  };

  // LEVEL TWO HANDLE EDIT
  const PostLevelTwoEdit = (values: any) => {
    const invoice = {
      name_ar: values.level_two_name_ar,
      name_en: values.level_two_name_en,
      cat_support_id: values.level_one_id,
      desc: values.level_two_desc,
    };

    mutate({
      endpointName: `/support/api/v1/levelTwoSupport/${editData?.id}`,
      values: {
        ...invoice,
        _method: "put",
      },
    });
  };

  // LEVEL THREE HANDLE EDIT
  const PostLevelThreeEdit = (values: any) => {
    const invoice = {
      name_ar: values.level_three_name_ar,
      name_en: values.level_three_name_en,
      cat_support_id: values.level_one_id,
      level_two_support_id: values.level_two_id,
    };

    mutate({
      endpointName: `/support/api/v1/levelThirdSupport/${editData?.id}`,
      values: {
        ...invoice,
        _method: "put",
      },
    });
  };

  // // LEVEL FOUR HANDLE EDIT
  // const PostLevelFourEdit = (values: any) => {
  //   const invoice = {
  //     name_ar: values?.article_name_ar,
  //     name_en: values?.article_name_en,
  //     desc_ar: values?.steps_ar,
  //     desc_en: values?.steps_en,
  //     cat_support_id: values.level_one_id,
  //     level_two_support_id: values.level_two_id,
  //     level_third_support_id: values.level_three_id,
  //   };

  //   mutate({
  //     endpointName: `/support/api/v1/levelFourthSupport/${editData?.id}`,
  //     values: {
  //       ...invoice,
  //       _method: "put",
  //     },
  //   });
  // };

  // const handleDelete = () => {
  //   mutate({
  //     endpointName: `/employeeSalary/api/v1/delete-deduction/${deleteData?.id}`,
  //     method: "delete",
  //   });
  // };

  useEffect(() => {
    levelTwoRefetch();
  }, [levelOneId]);

  useEffect(() => {
    levelThreeRefetch();
  }, [levelTwoId]);

  useEffect(() => {
    const levelOneSelecet = {
      id: editData?.cat_support_id || "",
      value: editData?.cat_support_name || "",
      label: editData?.cat_support_name || `${t("level one")}`,
    };
    setLevelOneSelectEdit(levelOneSelecet);

    const levelTwoSelecet = {
      id: editData?.level_two_support_id || "",
      value: editData?.level_two_support_name || "",
      label: editData?.level_two_support_name || `${t("level two")}`,
    };
    setLevelTwoSelectEdit(levelTwoSelecet);

    const levelThreeSelecet = {
      id: editData?.level_third_support_id || "",
      value: editData?.level_third_support_name || "",
      label: editData?.level_third_support_name || `${t("level three")}`,
    };
    setLevelThreeSelectEdit(levelThreeSelecet);
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={""}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values }) => {
        return (
          <Form>
            {/* BREAD CRUMBS */}
            <div className="w-full flex justify-between mb-8">
              <div className="flex items-center gap-x-1">
                <p className="font-bold">{t("helper center")}</p>
                <MdKeyboardArrowLeft />
                <p className="font-bold text-[#7D7D7D]">{t("add")}</p>
              </div>
            </div>

            {/* LEVELS */}
            <div>
              <h3 className="mb-4 text-xl font-bold">{t("add level")}</h3>

              <div className="rounded-xl p-8 flex items-center gap-8 bg-mainGreen/5">
                {/* LEVEL ONE */}
                <div className="flex items-end gap-3 w-1/3 lg:w-1/4">
                  <Select
                    id="level_one_id"
                    label={`${t("level one")}`}
                    name="level_one_id"
                    placeholder={`${t("level one")}`}
                    loadingPlaceholder={`${t("loading")}`}
                    options={levelOneOption}
                    fieldKey="id"
                    loading={levelOneIsLoading}
                    value={levelOneSelectEdit}
                    onChange={(option) => {
                      setLevelOneId(option!.id);
                      setLevelOneSelectEdit(option);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLevelOneModal(true);
                    }}
                    className="bg-[#295E5633] w-9 h-9 flex items-center justify-center rounded-lg duration-300 transition-all hover:bg-[#23514a4e]"
                  >
                    <IoMdAdd className="fill-mainGreen w-6 h-6" />
                  </button>
                </div>

                {/* LEVEL TWO */}
                <div className="flex items-end gap-3 w-1/3 lg:w-1/4">
                  <Select
                    id="level_two_id"
                    label={`${t("level two")}`}
                    name="level_two_id"
                    placeholder={`${t("level two")}`}
                    loadingPlaceholder={`${t("loading")}`}
                    options={levelTwoOption}
                    fieldKey="id"
                    isDisabled={levelTwoIsFetching}
                    loading={levelTwoIsLoading}
                    value={levelTwoSelectEdit}
                    onChange={(option) => {
                      setLevelTwoId(option!.id);
                      setLevelTwoSelectEdit(option);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLevelTwoModal(true);
                    }}
                    className="bg-[#295E5633] w-9 h-9 flex items-center justify-center rounded-lg duration-300 transition-all hover:bg-[#23514a4e]"
                  >
                    <IoMdAdd className="fill-mainGreen w-6 h-6" />
                  </button>
                </div>

                {/* LEVEL THREE */}
                <div className="flex items-end gap-3 w-1/3 lg:w-1/4">
                  <Select
                    id="level_three_id"
                    label={`${t("level three")}`}
                    name="level_three_id"
                    placeholder={`${t("level three")}`}
                    loadingPlaceholder={`${t("loading")}`}
                    options={levelThreeOption}
                    isDisabled={levelThreeIsFetching}
                    fieldKey="id"
                    loading={levelThreeIsLoading}
                    value={levelThreeSelectEdit}
                    onChange={(option) => {
                      setLevelThreeId(option);
                      setLevelThreeSelectEdit(option);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLevelThreeModal(true);
                    }}
                    className="bg-[#295E5633] w-9 h-9 flex items-center justify-center rounded-lg duration-300 transition-all hover:bg-[#23514a4e]"
                  >
                    <IoMdAdd className="fill-mainGreen w-6 h-6" />
                  </button>
                </div>
                {/* <div className="flex items-end gap-3 w-1/3 lg:w-1/4">
                  <Select
                    id="level_four_id"
                    label={`${t("level four")}`}
                    name="level_four_id"
                    placeholder={`${t("level four")}`}
                    loadingPlaceholder={`${t("loading")}`}
                    // options={clientsNameOptions}
                    fieldKey="id"
                    // loading={isLoading}
                    onChange={(option) => {
                      console.log(option);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLevelFourModal(true);
                    }}
                    className="bg-[#295E5633] w-9 h-9 flex items-center justify-center rounded-lg duration-300 transition-all hover:bg-[#23514a4e]"
                  >
                    <IoMdAdd className="fill-mainGreen w-6 h-6" />
                  </button>
                </div> */}
              </div>
            </div>

            {/* ARTICLE */}
            {/* {(levelThreeId || (editData && levelType == "4")) && (
              <AddSupportArticle
                editData={editData}
                stepFile={stepFile}
                setStepFile={setStepFile}
                articlesData={articlesData}
                setArticlesData={setArticlesData}
                levelThreeOption={levelThreeId}
                imagePreview={imagePreview}
              />
            )} */}

            {levelOneModal && (
              <Modal
                isOpen={levelOneModal}
                onClose={() => {
                  setLevelOneModal(false);
                }}
                maxWidth="max-w-[70%]"
              >
                <div className="my-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <BaseInputField
                    id="level_one_name_ar"
                    name="level_one_name_ar"
                    type="text"
                    label={`${t("level one name in arabic")}`}
                    placeholder={`${t("level one name in arabic")}`}
                    onChange={() => {}}
                  />
                  <BaseInputField
                    id="level_one_name_en"
                    name="level_one_name_en"
                    type="text"
                    label={`${t("level one name in english")}`}
                    placeholder={`${t("level one name in english")}`}
                    onChange={() => {}}
                  />

                  {/* ATTACHMENT */}
                  <div className="w-44 self-end">
                    {editData ? (
                      <FilesPreview
                        preview
                        images={[...imagePreview] || []}
                        pdfs={[]}
                      />
                    ) : (
                      <FilesUpload
                        files={filesLevelOne}
                        setFiles={setFilesLevelOne}
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Button
                    type="button"
                    className=""
                    action={() => {
                      if (editData) {
                        PostLevelOneEdit(values);
                      } else {
                        postLevelOneHandler(values);
                      }
                      setLevelOneModal(false);
                    }}
                  >
                    {title || t("add")}
                  </Button>
                </div>
              </Modal>
            )}

            {levelTwoModal && (
              <Modal
                isOpen={levelTwoModal}
                onClose={() => {
                  setLevelTwoModal(false);
                }}
                maxWidth="max-w-[70%]"
              >
                <div className="mt-16 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="">
                    <Select
                      name="level_one_id"
                      className="rounded-xl !h-12 text-black"
                      placeholder={`${t("level one")}`}
                      label={`${t("level one")}`}
                      options={levelOneOption}
                      value={levelOneSelectEdit}
                      onChange={(e) => setLevelOneSelectEdit(e)}
                      loading={
                        levelOneIsLoading ||
                        levelOneIsFetching ||
                        levelOneIsRefetching
                      }
                    />
                  </div>
                  <BaseInputField
                    id="level_two_name_ar"
                    name="level_two_name_ar"
                    type="text"
                    label={`${t("level two name in arabic")}`}
                    placeholder={`${t("level two name in arabic")}`}
                    onChange={() => {}}
                  />
                  <BaseInputField
                    id="level_two_name_en"
                    name="level_two_name_en"
                    type="text"
                    label={`${t("level two name in english")}`}
                    placeholder={`${t("level two name in english")}`}
                    onChange={() => {}}
                  />
                  {/* ATTACHMENT */}
                  <div className="w-44 self-end mb-2">
                    {editData ? (
                      <FilesPreview
                        preview
                        images={[...imagePreview] || []}
                        pdfs={[]}
                      />
                    ) : (
                      <FilesUpload
                        files={filesLevelTwo}
                        setFiles={setFilesLevelTwo}
                      />
                    )}
                  </div>
                </div>
                <TextAreaField
                  placeholder={`${t("type here")}`}
                  id="level_two_desc"
                  name="level_two_desc"
                  required
                  className="w-[92%]"
                  label={`${t("add description")}`}
                  value={values?.level_two_desc}
                  rows={3}
                />

                <div className="flex items-center justify-end mt-8">
                  <Button
                    type="button"
                    className=""
                    action={() => {
                      if (editData) {
                        PostLevelTwoEdit(values);
                      } else {
                        postLevelTwoHandler(values);
                      }
                      setLevelTwoModal(false);
                    }}
                  >
                    {title || t("add")}
                  </Button>
                </div>
              </Modal>
            )}

            {levelThreeModal && (
              <Modal
                isOpen={levelThreeModal}
                onClose={() => {
                  setLevelThreeModal(false);
                }}
                maxWidth="max-w-[70%]"
              >
                <div className="mt-16 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="">
                    <Select
                      name="level_one_id"
                      className="rounded-xl !h-12 text-black"
                      placeholder={`${t("level one")}`}
                      label={`${t("level one")}`}
                      options={levelOneOption}
                      value={levelOneSelectEdit}
                      options={levelOneOption}
                      fieldKey="id"
                      onChange={(option) => {
                        setLevelOneId(option!.id);
                        setLevelOneSelectEdit(option);
                      }}
                      loading={
                        levelOneIsLoading ||
                        levelOneIsFetching ||
                        levelOneIsRefetching
                      }
                    />
                  </div>
                  <div className="">
                    <Select
                      name="level_two_id"
                      className="rounded-xl !h-12 text-black"
                      placeholder={`${t("level two")}`}
                      label={`${t("level two")}`}
                      options={levelTwoOption}
                      value={levelTwoSelectEdit}
                      onChange={(option) => {
                        setLevelTwoId(option!.id);
                        setLevelTwoSelectEdit(option);
                      }}
                      loading={
                        levelTwoIsLoading ||
                        levelTwoIsFetching ||
                        levelTwoIsRefetching
                      }
                    />
                  </div>
                  <br />
                  <BaseInputField
                    id="level_three_name_ar"
                    name="level_three_name_ar"
                    type="text"
                    label={`${t("level three name in arabic")}`}
                    placeholder={`${t("level three name in arabic")}`}
                    onChange={() => {}}
                  />
                  <BaseInputField
                    id="level_three_name_en"
                    name="level_three_name_en"
                    type="text"
                    label={`${t("level three name in english")}`}
                    placeholder={`${t("level three name in english")}`}
                    onChange={() => {}}
                  />
                </div>
                <div className="flex items-center justify-end mt-8">
                  <Button
                    type="button"
                    className=""
                    action={() => {
                      if (editData) {
                        PostLevelThreeEdit(values);
                      } else {
                        postLevelThreeHandler(values);
                      }
                      setLevelThreeModal(false);
                    }}
                  >
                    {title || t("add")}
                  </Button>
                </div>
              </Modal>
            )}

            {/* TODO HERE (WILL REMOVE) */}
            {levelFourModal && (
              <Modal
                isOpen={levelFourModal}
                onClose={() => {
                  setLevelFourModal(false);
                }}
                maxWidth="max-w-[70%]"
              >
                <div className="mt-16 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="">
                    <Select
                      name="level_one_id"
                      className="rounded-xl !h-12 text-black"
                      placeholder={`${t("level one")}`}
                      label={`${t("level one")}`}
                      // options={sectionOption}
                      // value={editValues}
                      // loading={isLoading || isFetching || isRefetching}
                    />
                  </div>
                  <div className="">
                    <Select
                      name="level_two_id"
                      className="rounded-xl !h-12 text-black"
                      placeholder={`${t("level two")}`}
                      label={`${t("level two")}`}
                      // options={sectionOption}
                      // value={editValues}
                      // loading={isLoading || isFetching || isRefetching}
                    />
                  </div>
                  <div className="">
                    <Select
                      name="level_three_id"
                      className="rounded-xl !h-12 text-black"
                      placeholder={`${t("level three")}`}
                      label={`${t("level three")}`}
                      // options={sectionOption}
                      // value={editValues}
                      // loading={isLoading || isFetching || isRefetching}
                    />
                  </div>
                  <BaseInputField
                    id="level_four_name_ar"
                    name="level_four_name_ar"
                    type="text"
                    label={`${t("level four name in arabic")}`}
                    placeholder={`${t("level four name in arabic")}`}
                    onChange={() => {}}
                  />
                  <BaseInputField
                    id="level_four_name_en"
                    name="level_four_name_en"
                    type="text"
                    label={`${t("level four name in english")}`}
                    placeholder={`${t("level four name in english")}`}
                    onChange={() => {}}
                  />
                  {/* ATTACHMENT */}
                  <div className="w-44 self-end">
                    <FilesUpload
                      files={filesLevelThree}
                      setFiles={setFilesLevelThree}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end mt-8">
                  <Button
                    type="button"
                    className=""
                    action={() => {
                      // console.log(values.values);
                    }}
                  >
                    {title || t("add")}
                  </Button>
                </div>
              </Modal>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddSupport;

// import React, { useEffect, useState } from "react";
// import { Button } from "../../../components/atoms";
// import { t } from "i18next";
// import { Form, Formik } from "formik";
// import {
//   BaseInputField,
//   Checkbox,
//   Select,
//   TextAreaField,
// } from "../../../components/molecules";
// import { FilesUpload } from "../../../components/molecules/files/FileUpload";
// import { useFetch, useMutate } from "../../../hooks";
// import { notify } from "../../../utils/toast";
// import { mutateData } from "../../../utils/mutateData";
// import { useQueryClient } from "@tanstack/react-query";

// const AddSupport = ({ editData, refetch, setShow, isSub, activeBtn }) => {
//   console.log("🚀 ~ AddSupport ~ editData:", editData);
//   const [activeAdd, setActiveAdd] = useState(activeBtn || 1);
//   const [hasChildCheck, setHasChildCheck] = useState(false);
//   const [files, setFiles] = useState([]);
//   const queryClient = useQueryClient();
//   const [editValues, setEditValues] = useState();

//   const initialValues = {
//     name_ar: editData?.name_ar || "",
//     name_en: editData?.name_en || "",
//     desc: editData?.has_child === 1 ? editData?.ck : editData?.desc,
//     category_id: editData?.category_id || "",
//     parent_id: editData?.parent_id || "",
//     ck: editData?.ck || "",
//   };

//   const {
//     data: sectionOption,
//     refetch: sectionOptionRefetch,
//     isFetching,
//     isLoading,
//     isRefetching,
//   } = useFetch({
//     endpoint: `/attachment/api/v1/categories`,
//     queryKey: ["section-option"],
//     select: (data) =>
//       data.map((el) => {
//         return {
//           id: el.id,
//           value: el.id || "",
//           label: el.name_ar || "",
//         };
//       }),
//   });

//   const {
//     data: forkedOption,
//     refetch: forkedOptionRefetch,
//     isFetching: forkedFetching,
//     isLoading: forkedIsLoading,
//     isRefetching: forkedRefetching,
//   } = useFetch({
//     endpoint: `/attachment/api/v1/parent`,
//     queryKey: ["forked-option"],
//     select: (data) =>
//       data.map((el) => {
//         return {
//           id: el.id,
//           value: el.id || "",
//           label: el.name_ar || "",
//         };
//       }),
//   });
//   console.log("🚀 ~ AddSupport ~ forkedOption:", forkedOption);

//   const {
//     mutate,
//     isLoading: postIsLoading,
//     isSuccess,
//   } = useMutate({
//     mutationFn: mutateData,
//     mutationKey: ["mainSection"],
//     onSuccess: (data) => {
//       notify("success", t("section is added successfully"));
//       queryClient.refetchQueries(["support-data"]);
//     },
//     onError: (error: any) => {
//       notify("success", t("section is added successfully"));
//       queryClient.refetchQueries(["support-data"]);
//       // notify("error", error?.message);
//     },
//   });

//   const PostSectionEdit = (values: any) => {
//     mutate({
//       endpointName: isSub
//         ? `/attachment/api/v1/upSub/${editData?.id}`
//         : `/attachment/api/v1/upCat/${editData?.id}`,
//       values: {
//         ...values,
//       },
//     });
//   };

//   const posSectionHandler = (values: any) => {
//     let invoice;

//     if (activeAdd === 1) {
//       invoice = {
//         name_ar: values.name_ar,
//         name_en: values.name_en,
//       };
//     } else if (activeAdd === 2) {
//       invoice = {
//         name_ar: values.name_ar,
//         name_en: values.name_en,
//         category_id: values.category_id,
//         desc: values.desc,
//         has_child: 0,
//       };
//     } else {
//       invoice = {
//         name_ar: values.name_ar,
//         name_en: values.name_en,
//         parent_id: values.parent_id,
//         has_child: hasChildCheck ? 1 : 0,
//         ck: values.ck,
//       };
//     }

//     mutate({
//       endpointName:
//         activeAdd === 1
//           ? "/attachment/api/v1/addCat"
//           : "/attachment/api/v1/addSub",
//       values: { ...invoice, image: files[0] },
//       dataType: "formData",
//     });

//     console.log({ ...invoice, image: files[0] });
//   };

//   useEffect(() => {
//     if (editData && isSuccess) {
//       setShow(false);
//       refetch();
//     }
//   }, [isSuccess]);

//   useEffect(() => {
//     const best = {
//       id: editData?.id || "",
//       value: editData?.id || "",
//       label: editData?.name_ar || `${t("section")}`,
//     };
//     setEditValues(best);
//   }, []);

//   return (
//     <Formik
//       initialValues={initialValues}
//       onSubmit={(values: any) => {
//         if (editData) {
//           PostSectionEdit({
//             ...values,
//           });
//         } else {
//           posSectionHandler({
//             ...values,
//           });
//         }
//       }}
//       validationSchema={""}
//     >
//       {({ values }) => {
//         return (
//           <Form>
//             {/* TABS */}
//             <div className="flex items-center gap-4 my-14">
//               <Button
//                 onClick={() => {
//                   if (editData && activeAdd !== 1) return;
//                   setActiveAdd(1);
//                 }}
//                 className={`bg-transparent border border-mainGreen/50 text-mainGreen ${
//                   activeAdd === 1 && "bg-mainGreen text-white"
//                 } ${
//                   editData &&
//                   activeAdd !== 1 &&
//                   "bg-mainDisabled cursor-not-allowed opacity-50"
//                 }`}
//               >
//                 {t("add section")}
//               </Button>
//               <Button
//                 onClick={() => {
//                   if (editData && activeAdd !== 2) return;
//                   setActiveAdd(2);
//                 }}
//                 className={`bg-transparent border border-mainGreen/50 text-mainGreen ${
//                   activeAdd === 2 && "bg-mainGreen text-white"
//                 } ${
//                   editData &&
//                   activeAdd !== 2 &&
//                   "bg-mainDisabled cursor-not-allowed opacity-50"
//                 }`}
//               >
//                 {t("add sub section")}
//               </Button>
//               <Button
//                 onClick={() => {
//                   if (editData && activeAdd !== 3) return;
//                   setActiveAdd(3);
//                 }}
//                 className={`bg-transparent border border-mainGreen/50 text-mainGreen ${
//                   activeAdd === 3 && "bg-mainGreen text-white"
//                 } ${
//                   editData &&
//                   activeAdd !== 3 &&
//                   "bg-mainDisabled cursor-not-allowed opacity-50"
//                 }`}
//               >
//                 {t("forked")}
//               </Button>
//             </div>

//             {/* CONTENT OF TABS */}
//             <div className="my-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               <BaseInputField
//                 id="name_ar"
//                 name="name_ar"
//                 type="text"
//                 label={`${t("name in arabic")}`}
//                 placeholder={`${t("name in arabic")}`}
//                 onChange={() => {}}
//               />
//               <BaseInputField
//                 id="name_en"
//                 name="name_en"
//                 type="text"
//                 label={`${t("name in english")}`}
//                 placeholder={`${t("name in english")}`}
//                 onChange={() => {}}
//               />

//               {/* ATTACHMENT */}
//               <div className="w-44 self-end">
//                 <FilesUpload files={files} setFiles={setFiles} />
//               </div>

//               {/* SECOND OPTION */}
//               {activeAdd === 2 && (
//                 <>
//                   <div className="">
//                     <Select
//                       name="category_id"
//                       className="rounded-xl !h-12 text-black"
//                       placeholder={`${t("section")}`}
//                       options={sectionOption}
//                       value={editValues}
//                       loading={isLoading || isFetching || isRefetching}
//                     />
//                   </div>
//                   <TextAreaField
//                     placeholder={`${t("add description")}`}
//                     id="desc"
//                     name="desc"
//                     required
//                     value={values?.desc}
//                     rows={3}
//                   />
//                 </>
//               )}

//               {/* THIRD OPTION */}
//               {activeAdd === 3 && (
//                 <>
//                   <div className="">
//                     <Select
//                       name="parent_id"
//                       className="rounded-xl !h-12 text-black scrollbar-none mt-auto"
//                       placeholder={`${t("forked")}`}
//                       options={forkedOption}
//                       loading={
//                         forkedFetching || forkedIsLoading || forkedRefetching
//                       }
//                     />
//                   </div>

//                   {hasChildCheck && (
//                     <TextAreaField
//                       placeholder={`${t("add description")}`}
//                       id="ck"
//                       name="ck"
//                       required
//                       rows={3}
//                     />
//                   )}

//                   <div className="flex items-center">
//                     <Checkbox
//                       labelClassName="text-base"
//                       onChange={(e) => setHasChildCheck((prev) => !prev)}
//                       label={t("final forked")}
//                     />
//                   </div>
//                 </>
//               )}
//             </div>

//             <div className="flex items-center justify-end">
//               <Button
//                 type="submit"
//                 className=""
//                 action={() => {
//                   // console.log(values.values);
//                 }}
//               >
//                 {t("save")}
//               </Button>
//             </div>
//           </Form>
//         );
//       }}
//     </Formik>
//   );
// };

// export default AddSupport;
