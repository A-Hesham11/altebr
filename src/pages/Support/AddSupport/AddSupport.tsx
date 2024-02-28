import { Form, Formik } from "formik";
import { t } from "i18next";
import { useState } from "react";
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

const AddSupport = () => {
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

  return (
    <Formik
      initialValues={""}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values }) => {
        return (
          <Form>
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
                <div className="flex items-end gap-3 w-1/3 lg:w-1/4">
                  <Select
                    id="level_one_id"
                    label={`${t("level one")}`}
                    name="level_one_id"
                    placeholder={`${t("level one")}`}
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
                      setLevelOneModal(true);
                    }}
                    className="bg-[#295E5633] w-9 h-9 flex items-center justify-center rounded-lg duration-300 transition-all hover:bg-[#23514a4e]"
                  >
                    <IoMdAdd className="fill-mainGreen w-6 h-6" />
                  </button>
                </div>
                <div className="flex items-end gap-3 w-1/3 lg:w-1/4">
                  <Select
                    id="level_two_id"
                    label={`${t("level two")}`}
                    name="level_two_id"
                    placeholder={`${t("level two")}`}
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
                      setLevelTwoModal(true);
                    }}
                    className="bg-[#295E5633] w-9 h-9 flex items-center justify-center rounded-lg duration-300 transition-all hover:bg-[#23514a4e]"
                  >
                    <IoMdAdd className="fill-mainGreen w-6 h-6" />
                  </button>
                </div>

                <div className="flex items-end gap-3 w-1/3 lg:w-1/4">
                  <Select
                    id="level_three_id"
                    label={`${t("level three")}`}
                    name="level_three_id"
                    placeholder={`${t("level three")}`}
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
                      setLevelThreeModal(true);
                    }}
                    className="bg-[#295E5633] w-9 h-9 flex items-center justify-center rounded-lg duration-300 transition-all hover:bg-[#23514a4e]"
                  >
                    <IoMdAdd className="fill-mainGreen w-6 h-6" />
                  </button>
                </div>
                <div className="flex items-end gap-3 w-1/3 lg:w-1/4">
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
                </div>
              </div>
            </div>

            {/* ARTICLE */}
            <AddSupportArticle
              dataSource={dataSource}
              setDataSource={setDataSource}
              supportArticleData={supportArticleData}
              setSupportArticleData={setSupportArticleData}
              stepFile={stepFile}
              setStepFile={setStepFile}
            />

            <div className="flex items-center justify-end mt-8">
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
                    <FilesUpload
                      files={filesLevelOne}
                      setFiles={setFilesLevelOne}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Button
                    type="button"
                    className=""
                    action={() => {
                      // console.log(values.values);
                    }}
                  >
                    {t("add")}
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
                      // options={sectionOption}
                      // value={editValues}
                      // loading={isLoading || isFetching || isRefetching}
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
                    <FilesUpload
                      files={filesLevelTwo}
                      setFiles={setFilesLevelTwo}
                    />
                  </div>
                </div>
                <TextAreaField
                  placeholder={`${t("type here")}`}
                  id="level_two_desc"
                  name="level_two_desc"
                  required
                  className="w-[92%]"
                  label={`${t("add description")}`}
                  // value={values?.desc}
                  rows={3}
                />

                <div className="flex items-center justify-end mt-8">
                  <Button
                    type="button"
                    className=""
                    action={() => {
                      // console.log(values.values);
                    }}
                  >
                    {t("add")}
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
                      // console.log(values.values);
                    }}
                  >
                    {t("add")}
                  </Button>
                </div>
              </Modal>
            )}

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
                    {t("add")}
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
