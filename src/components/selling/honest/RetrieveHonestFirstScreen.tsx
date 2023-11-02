/////////// Types
///

import { Form, Formik } from "formik";
import { t } from "i18next";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useFetch, useIsRTL, useMutate } from "../../../hooks";
import { formatDate, getDayAfter } from "../../../utils/date";
import { mutateData } from "../../../utils/mutateData";
import { notify } from "../../../utils/toast";
import { Back } from "../../../utils/utils-components/Back";
import { Button } from "../../atoms";
import { BaseInputField, DateInputField } from "../../molecules";
import { FilesPreviewOutFormik } from "../../molecules/files/FilesPreviewOutFormik";
import { Loading } from "../../organisms/Loading";
import { Table } from "../../templates/reusableComponants/tantable/Table";

/////////// HELPER VARIABLES & FUNCTIONS
///
type RetrieveHonestFirstScreen_TP = {
  selectedItem: never[];
  setSelectedItem: Dispatch<SetStateAction<never[]>>;
  setStage: Dispatch<SetStateAction<number>>;
};
///
export const RetrieveHonestFirstScreen = ({
  selectedItem,
  setSelectedItem,
  setStage,
}: RetrieveHonestFirstScreen_TP) => {
  /////////// VARIABLES
  ///
  const navigate = useNavigate();

  const searchValues = {
    id: "",
    bond_date: '',
  };

  ///
  /////////// STATES
  ///
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  /////////// CUSTOM HOOKS

  const { data, refetch, isLoading, isRefetching } = useFetch({
    endpoint:
      (search === 'branchSafety/api/v1/bondsafety?' || search === "")
        ? `branchSafety/api/v1/bondsafety?page=${page}`
        : `${search}`,
    queryKey: ["all-honest-bonds"],
    pagination: true,
  });

  const { mutate } = useMutate({
    mutationFn: mutateData,
    onSuccess: () => {
      notify("success");
    },
  });
  const isRTL = useIsRTL();
  //////////

  const Cols = useMemo<any>(
    () => [
      {
        cell: (info: any) => (
          <input
            type="radio"
            id={info.row.original.id}
            name="selectedItem"
            onClick={() => {
              setSelectedItem(info.row.original);
            }}
          />
        ),
        accessorKey: "bond_number",
        header: () => <span>{t("#")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "id",
        header: () => <span>{t("bond number")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "client_value",
        header: () => <span>{t("client name")}</span>,
      },
      // {
      //     cell: (info: any) => info.getValue(),
      //     accessorKey: "category_id",
      //     header: () => <span>{t("category")}</span>,
      // },
      // {
      //     cell: (info: any) => info.getValue(),
      //     accessorKey: "weight",
      //     header: () => <span>{t("weight")}</span>,
      // },
      // {
      //     cell: (info: any) => info.getValue(),
      //     accessorKey: "karat_id",
      //     header: () => <span>{t("karat")}</span>,
      // },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "employee_value",
        header: () => <span>{t("employee name")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "bond_date",
        header: () => <span>{t("bond date")}</span>,
      },
      // {
      //     cell: (info: any) => {
      //         // console.log("🚀 ~ file: RetrieveHonestFirstScreen.tsx:114 ~ RetrieveHonestFirstScreen ~ info:", info.row.original.status ,info.row.original.id )

      //         return (
      //             <select id="itemStatusOptions"
      //                 defaultValue={info.row.original.status}
      //                 style={{ color: info.row.original.status === 'ready' ? 'green' : info.row.original.status === 'workshop' ? 'orange' : 'violet' }}
      //                 className={`bg-transparent border-none`}
      //                 onChange={(option) => {
      //                     mutate({
      //                         endpointName: `safety/api/v1/change-status/${info.row.original.id}?status=${option.target.value}`,
      //                     })
      //                 }}
      //             >
      //                 {
      //                     itemStatusOptions.map(option => (
      //                         <option id={option.id} style={{ color: option.color }} value={option.value}>{option.label}</option>
      //                     ))
      //                 }
      //             </select>
      //         )
      //     },
      // {
      //     const media = info?.row?.original?.items?.map(item=>item.images?.map(image=>image))
      //     console.log("🚀 ~ file: RetrieveHonestFirstScreen.tsx:151 ~ media ~ media:", media.flat(1))
      //   return(
      //   <div className="w-12 mx-auto">
      //     <FilesPreviewOutFormik images={[]} preview pdfs={[]}/>
      //   </div>
      // )}
      //     accessorKey: "itemStatus",
      //     header: () => <span>{t("item status")}</span>,
      // },
      {
        cell: (info: any) => {
          const media = info?.row?.original?.items?.map(item => item.images?.map(image => image))
          return (
            !media.flat(1).length ?
              t('no attachments')
              :
              <div className="w-12 mx-auto">
                <FilesPreviewOutFormik images={media.flat(1)} preview />
              </div>
          )
        },
        accessorKey: "attachments",
        header: () => <span>{t("attachments")}</span>,
      },
    ],
    []
  );
  ///

  ///
  /////////// SIDE EFFECTS
  ///
  useEffect(() => {
    setDataSource((data && data.data) || []);
  }, [data]);

  useEffect(() => {
    refetch();
  }, [page]);

  useEffect(() => {
    if (page == 1) {
      refetch();
    } else {
      setPage(1);
    }
  }, [search]);

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const getSearchResults = async (req: any) => {
    let uri = `branchSafety/api/v1/bondsafety?`;
    let first = false;
    Object.keys(req).forEach((key) => {
      if (req[key] !== "") {
        if (first) {
          uri += `?${key}[eq]=${req[key]}`;
          first = false;
        } else {
          uri += `&${key}[eq]=${req[key]}`;
        }
      }
    });
    setSearch(uri);
  };

  ///
  if (isRefetching || isLoading)
    return <Loading mainTitle={t("loading items")} />;
  return (
    <div className="p-12">
      <div className="mb-8 flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-between">
        <Formik
          initialValues={searchValues}
          onSubmit={(values) => {
            getSearchResults({
              ...values,
              bond_date: values.bond_date ? formatDate(getDayAfter(new Date(values.bond_date))) : "",
            });
          }}
        >
          <Form className="w-full lg:w-2/4 flex justify-center">
            <div className="flex items-end gap-3">
              <BaseInputField
                id="id"
                name="id"
                label={`${t("bond number")}`}
                placeholder={`${t("bond number")}`}
                className="shadow-xs"
                type="text"
              />
              <DateInputField
                label={`${t("bond date")}`}
                placeholder={`${t("bond date")}`}
                name="bond_date"
                labelProps={{ className: "mt--10" }}
              />
              <Button
                type="submit"
                disabled={isRefetching}
                className="flex h-[38px] mx-4"
              >
                {t("search")}
              </Button>
            </div>
          </Form>
        </Formik>
        <div className="flex items-center justify-end gap-5">
          <Button
            action={() => navigate("/selling/honesty/new-honest")}
            className="bg-mainOrange"
          >
            {t("new honest")}
          </Button>
        </div>
      </div>
      <Table data={dataSource} columns={Cols}>
        <div className="mt-3 flex items-center justify-center gap-5 p-2">
          <div className="flex items-center gap-2 font-bold">
            {t("page")}
            <span className=" text-mainGreen">{data?.current_page}</span>
            {t("from")}
            {<span className=" text-mainGreen">{data?.total}</span>}
          </div>
          <div className="flex items-center gap-2 ">
            <Button
              className=" rounded bg-mainGreen p-[.18rem]"
              action={() => setPage((prev) => prev - 1)}
              disabled={page == 1}
            >
              {isRTL ? (
                <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
              ) : (
                <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
              )}
            </Button>
            <Button
              className="rounded bg-mainGreen p-[.18rem]"
              action={() => setPage((prev) => prev + 1)}
              disabled={page == data?.pages}
            >
              {isRTL ? (
                <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
              ) : (
                <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
              )}
            </Button>
          </div>
        </div>
      </Table>
      <div className="flex justify-end mt-4 gap-4">
        <Button
          disabled={!Object.keys(selectedItem).length}
          action={() => {
            setStage(2);
          }}
        >
          {t("create receive honest bond")}
        </Button>
        <Back />
      </div>
    </div>
  );
};
