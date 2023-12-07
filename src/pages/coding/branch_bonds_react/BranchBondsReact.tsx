import { useEffect, useState } from "react";
import BondsTotal from "./BondsTotal";
import BranchBondsSearch from "./BranchBondsSearch";
import { useFetch } from "../../../hooks";
import { Loading } from "../../../components/organisms/Loading";
import { t } from "i18next";
import TableOfBranchBonds from "./TableOfBranchBonds";
import { Back } from "../../../utils/utils-components/Back";

type CodedIdentitiesProps_TP = {
  title: string;
};

const BranchBondsReact = ({ title }: CodedIdentitiesProps_TP) => {
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // FETCHING DATA FROM API
  const { data, isLoading, isFetching, isRefetching, refetch } = useFetch({
    queryKey: ["branch-bond-react", page, search],
    endpoint: 
    search === `/identity/api/v1/thwelBonds?` ||
    search === ""
      ? `/identity/api/v1/thwelBonds?page=${page}`
      : `${search}`,
    
    pagination: true,
  });

  // SEARCH FUNCTIONALITY
  const getSearchResults = async (req: any) => {
    let url = `/identity/api/v1/thwelBonds?`;
    let first = false;
    Object.keys(req).forEach((key) => {
      if (req[key] !== "") {
        if (first) {
          url += `?${key}[eq]=${req[key]}`;
          first = false;
        } else {
          url += `&${key}[eq]=${req[key]}`;
        }
      }
    });
    setSearch(url);
  };

  // EFFECTS
  useEffect(() => {
    if (data) {
      setDataSource(data);
    }
  }, [data]);

  // LOADING ....
  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading items")}`} />;

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold text-slate-700">{title}</h2>

      {/* SEARCH FILTER */}
      <BranchBondsSearch getSearchResults={getSearchResults} />

      {/* BONDS TOTALS */}
      <BondsTotal />

      {/* TABLE */}
      <TableOfBranchBonds
        dataSource={dataSource}
        setPage={setPage}
        page={page}
      />

      {/* BUTTON TO BACK */}
      <Back className="w-32 self-end mt-6" />
    </div>
  );
};

export default BranchBondsReact;
