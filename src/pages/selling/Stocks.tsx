import { t } from "i18next";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Loading } from "../../components/organisms/Loading";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useFetch, useIsRTL } from "../../hooks";
import { authCtx } from "../../context/auth-and-perm/auth";
import { Table } from "../../components/templates/reusableComponants/tantable/Table";
import { Button } from "../../components/atoms";
import { numberContext } from "../../context/settings/number-formatter";
import { Back } from "../../utils/utils-components/Back";

const Stocks = () => {
  // STATE
  const isRTL = useIsRTL();
  const [dataSource, setDataSource] = useState([]);
  const { userData } = useContext(authCtx);
  const [page, setPage] = useState(1);
  const { formatGram, formatReyal } = numberContext();

  // FETCHING CREDITS DATA FROM API
  const {
    data: credit,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useFetch({
    queryKey: ["credits-data", page],
    endpoint: `/branchAccount/api/v1/BranchTrigger/${userData?.branch_id}?page=${page}`,
    select: (data: object[]) => {
      return {
        ...data,
        data: data?.data?.map((credit: any, i: number) => ({
          ...credit,
          index: i + 1,
        })),
      };
    },
    pagination: true,
  });

  // COLUMNS FOR THE TABLE
  const tableColumn = useMemo<any>(
    () => [
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "index",
        header: () => <span>{t("#")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "numeric_system",
        header: () => <span>{t("numeric system")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "accountable",
        header: () => <span>{t("account name")}</span>,
      },
      {
        cell: (info: any) => {
          return info.row.original.unit_id === 1
            ? formatReyal(Number(info.getValue()))
            : formatGram(Number(info.getValue()));
        },
        accessorKey: "debtor",
        header: () => <span>{t("debtor")}</span>,
      },
      {
        cell: (info: any) => {
          return info.row.original.unit_id === 1
            ? formatReyal(Number(info.getValue()))
            : formatGram(Number(info.getValue()));
        },
        accessorKey: "creditor",
        header: () => <span>{t("creditor")}</span>,
      },
      {
        cell: (info: any) => info.getValue(),
        accessorKey: "unit",
        header: () => <span>{t("unit id")}</span>,
      },
    ],
    []
  );

  // EFFECTS
  useEffect(() => {
    if (credit) {
      setDataSource(credit?.data);
    }
  }, [credit]);

  // LOADING ....
  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading credits")}`} />;

  return (
    <div className="p-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className=" text-base font-bold">{t("credits")}</h2>
        <Back />
      </div>

      <div className="">
        <Table data={dataSource || []} columns={tableColumn}>
          {dataSource?.length === 0 ? (
            <p className="text-center text-xl text-mainGreen font-bold">
              {t("there is no pieces available")}
            </p>
          ) : (
            <div className="mt-3 flex items-center justify-center gap-5 p-2">
              <div className="flex items-center gap-2 font-bold">
                {t("page")}
                <span className=" text-mainGreen">{credit?.current_page}</span>
                {t("from")}
                {<span className=" text-mainGreen">{credit?.pages}</span>}
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
                  disabled={page == credit?.pages}
                >
                  {isRTL ? (
                    <MdKeyboardArrowLeft className="h-4 w-4 fill-white" />
                  ) : (
                    <MdKeyboardArrowRight className="h-4 w-4 fill-white" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </Table>
      </div>
    </div>
  );
};

export default Stocks;
