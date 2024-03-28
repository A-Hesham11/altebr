import { Button } from "../../../components/atoms";
import { AiOutlinePlus } from "react-icons/ai";
import { t } from "i18next";
import TarqeemTotals from "./TarqeemTotals";
import SearchFilter from "./SearchFilter";
import TableOfIdentities from "./TableOfIdentities";
import OperationType from "./OperationType";
import { json, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loading } from "../../../components/organisms/Loading";
import { useFetch, useMutate } from "../../../hooks";
import { Back } from "../../../utils/utils-components/Back";
import { formatDate } from "../../../utils/date";
import { ExportToExcel } from "../../../components/ExportToFile";
import { Modal } from "../../../components/molecules";
import { FilesUpload } from "../../../components/molecules/files/FileUpload";
import { notify } from "../../../utils/toast";
import { mutateData } from "../../../utils/mutateData";
import { useQueryClient } from "@tanstack/react-query";
import ImportTotals from "./ImportTotals";
import { FilesPreview } from "../../../components/molecules/files/FilesPreview";
import { FilesPreviewOutFormik } from "../../../components/molecules/files/FilesPreviewOutFormik";
import { DropFile } from "../../../components/molecules/files/DropFile";

type CodedIdentitiesProps_TP = {
  title: string;
};

const CodedIdentities = ({ title }: CodedIdentitiesProps_TP) => {
  const navigate = useNavigate();
  const [activeClass, setActiveClass] = useState("هويات في الإدارة");
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [operationTypeSelect, setOperationTypeSelect] = useState([]);
  const [importModal, setImportModal] = useState<boolean>(false);
  const [importFiles, setImportFiles] = useState<any>([]);
  const [importData, setImportData] = useState(null);
  const queryClient = useQueryClient();
  // const [operationTypeSelect, setOperationTypeSelect] = useState(() => {
  //   const storedData = localStorage.getItem("operationTypeSelect");

  //   return storedData ? JSON.parse(storedData) : [];
  // });
  const [fetchKey, setFetchKey] = useState(["edara-hwya"]);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [search, setSearch] = useState("");
  const [isSuccessPost, setIsSuccessPost] = useState(false);
  const [fetchEndPoint, setFetchEndPoint] = useState(
    `identity/api/v1/pieces_in_edara`
  );

  const shouldCheck = operationTypeSelect.length === 0;

  useEffect(() => {
    if (shouldCheck) {
      setCheckboxChecked(true);
    } else {
      setCheckboxChecked(false);
    }
  }, [shouldCheck]);

  // useEffect(() => {
  //   localStorage.setItem("operationTypeSelect", JSON.stringify(operationTypeSelect))
  // }, [operationTypeSelect])

  // FETCHING DATA FROM API
  const { data, isLoading, isFetching, isRefetching, refetch } = useFetch({
    queryKey: fetchKey,
    endpoint:
      search === `${fetchEndPoint}?page=${page}` || search === ""
        ? `${fetchEndPoint}?page=${page}`
        : `${search}`,
    pagination: true,
  });

  // FETCHING DATA FROM API TO EXPORT ALL THE DATA TO EXCEL
  const { data: dataExcel, refetch: dataExcelRefetch } = useFetch({
    queryKey: ["excel-data"],
    endpoint:
      search === `${fetchEndPoint}?page=${page}&per_page=10000` || search === ""
        ? `${fetchEndPoint}?page=${page}&per_page=10000`
        : `${search}`,
    pagination: true,
  });

  const {
    mutate,
    isLoading: postIsLoading,
    isSuccess,
  } = useMutate({
    mutationFn: mutateData,
    mutationKey: ["files"],
    onSuccess: (data) => {
      setImportData(data);
      notify("success", t("imported has successfully"));
      queryClient.refetchQueries(fetchKey);
      navigate("/coding/total/import");
    },
    onError: (error: any) => {
      notify("error", error?.message);
    },
  });

  // HANDLE MANAGEMENT EDARA
  const handleManagement = () => {
    setFetchKey(["edara-hwya"]);
    setFetchEndPoint(`identity/api/v1/pieces_in_edara`);
  };

  // HANDLE BRANCH
  const handleBranch = () => {
    setFetchKey(["branch-hwya"]);
    setFetchEndPoint(`identity/api/v1/pieces_in_branch`);
  };

  // HANDLE WAY TO BRANCH
  const handleWayToBranch = () => {
    setFetchKey(["way-to-branch-hwya"]);
    setFetchEndPoint(`identity/api/v1/way_to_branch`);
  };

  // HANDLE WAY TO EDARA
  const handleWayToEdara = () => {
    setFetchKey(["way-to-edara-hwya"]);
    setFetchEndPoint(`identity/api/v1/way_to_edara`);
  };

  // HANDLE PIECE BY WEIGHT
  const handlePieceByWeight = () => {
    setFetchKey(["piece_by_weight"]);
    setFetchEndPoint(`identity/api/v1/ItemWeight`);
  };

  // SEARCH FUNCTIONALITY
  const getSearchResults = async (req: any) => {
    let url = `${fetchEndPoint}?`;
    let first = false;
    Object.keys(req).forEach((key) => {
      if (req[key] !== "") {
        if (first) {
          if (key === "created_at") url += `?cAt[lk]=${formatDate(req[key])}`;
          else if (key === "coding_date_from")
            url += `?cAt[gte]=${formatDate(req[key])}`;
          else if (key === "coding_date_to")
            url += `?cAt[lte]=${formatDate(req[key])}`;
          else url += `?${key}[eq]=${req[key]}`;

          first = false;
        } else {
          if (key === "created_at") url += `&cAt[lk]=${formatDate(req[key])}`;
          else if (key === "coding_date_from")
            url += `&cAt[gte]=${formatDate(req[key])}`;
          else if (key === "coding_date_to")
            url += `&cAt[lte]=${formatDate(req[key])}`;
          else url += `&${key}[eq]=${req[key]}`;
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

  useEffect(() => {
    refetch();
    // dataExcelRefetch();
  }, [page, isSuccessPost, search]);

  useEffect(() => {
    setPage(1);
  }, [fetchKey]);

  // LOADING ....
  if (isLoading || isRefetching || isFetching)
    return <Loading mainTitle={`${t("loading items")}`} />;

  // HANDLE ACTIVE BUTTON
  const handleActiveButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    const clickedButton = event.target as HTMLButtonElement;
    const buttonName = clickedButton.innerText;

    if (buttonName === "هويات في الإدارة") setActiveClass("هويات في الإدارة");
    if (buttonName === "هويات في الفرع") setActiveClass("هويات في الفرع");
    if (buttonName === "هويات جاري تسليمها في الفرع")
      setActiveClass("هويات جاري تسليمها في الفرع");
    if (buttonName === "هويات جاري تسليمها في الإدارة")
      setActiveClass("هويات جاري تسليمها في الإدارة");
    if (buttonName === "قطع بالوزن") setActiveClass("قطع بالوزن");
  };

  const handleImportFiles = async () => {
    await mutate({
      endpointName: "/tarqimGold/api/v1/import",
      values: { file: importFiles[0] },
      dataType: "formData",
    });

    setImportFiles([]);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h2 className="text-xl font-bold text-slate-700">{title}</h2>
        <div className="flex flex-wrap gap-6 items-center">
          <Button
            action={() => navigate("/coding/total/import")}
            className="border-2 border-mainGreen bg-mainGreen text-white flex items-center gap-2"
          >
            {t("import total")}
          </Button>
          <Button
            action={() => navigate("/coding/gold")}
            className="border-2 border-mainOrange bg-transparent text-mainOrange flex items-center gap-2"
          >
            <AiOutlinePlus className="text-xl" />
            <span>{t("gold coded")}</span>
          </Button>
          <Button
            action={() => navigate("/coding/diamond")}
            className="border-2 border-mainOrange bg-transparent text-mainOrange flex items-center gap-2"
          >
            <AiOutlinePlus className="text-xl" />
            <span>{t("diamond coded")}</span>
          </Button>
          <Button
            action={() => navigate("/coding/accessories")}
            className="border-2 border-mainOrange bg-transparent text-mainOrange  flex items-center gap-2"
          >
            <AiOutlinePlus className="text-xl" />
            <span>{t("miscellaneous coded")}</span>
          </Button>
        </div>
      </div>

      {/* TARQIM TOTALS */}
      <TarqeemTotals />

      {/* STATUS OF IDENTITIES */}
      <div className="flex flex-col justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-700 flex-shrink-0">
          {t("status of identities")}
        </h2>
        <div className="flex flex-wrap items-center gap-6 self-center">
          <Button
            action={(e) => {
              handleManagement();
              handleActiveButton(e);
            }}
            className={`${
              activeClass === "هويات في الإدارة"
                ? "bg-mainOrange text-white"
                : "bg-transparent text-mainOrange"
            } border-2 text-sm border-mainOrange flex items-center gap-2`}
          >
            {t("management identities")}
          </Button>
          <Button
            action={(e) => {
              handlePieceByWeight();
              handleActiveButton(e);
            }}
            className={`${
              activeClass === "قطع بالوزن"
                ? "bg-mainOrange text-white"
                : "bg-transparent text-mainOrange"
            } border-2 text-sm border-mainOrange flex items-center gap-2`}
          >
            {t("pieces by weight")}
          </Button>
          <Button
            action={(e) => {
              handleBranch();
              handleActiveButton(e);
            }}
            className={`${
              activeClass === "هويات في الفرع"
                ? "bg-mainOrange text-white"
                : "bg-transparent text-mainOrange"
            } border-2 text-sm border-mainOrange flex items-center gap-2`}
          >
            {t("branch identities")}
          </Button>
          <Button
            action={(e) => {
              handleWayToBranch();
              handleActiveButton(e);
            }}
            className={`${
              activeClass === "هويات جاري تسليمها في الفرع"
                ? "bg-mainOrange text-white"
                : "bg-transparent text-mainOrange"
            } border-2 text-sm border-mainOrange flex items-center gap-2`}
          >
            {t("identities are being delivered to the branch")}
          </Button>
          <Button
            action={(e) => {
              handleWayToEdara();
              handleActiveButton(e);
            }}
            className={`${
              activeClass === "هويات جاري تسليمها في الإدارة"
                ? "bg-mainOrange text-white"
                : "bg-transparent text-mainOrange"
            } border-2 text-sm border-mainOrange flex items-center gap-2`}
          >
            {t("identities are being submitted to the administration")}
          </Button>
        </div>
      </div>

      {/* SEARCH FILTER */}
      <SearchFilter getSearchResults={getSearchResults} refetch={refetch} />

      {/* TABLE OF IDENTITIES */}
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex items-center gap-4 self-end">
          <Button
            action={() => {
              // setCheckboxChecked(false)
              // refetch();
              // setPage(1)
              setOperationTypeSelect([]);
              // localStorage.clear()
            }}
            className="bg-mainGreen text-white"
          >
            {t("empty table")}
          </Button>
          <Button
            action={(e) => {
              setImportData(null);
              setImportModal(true);
            }}
            className="bg-mainGreen text-white"
          >
            {t("import")}
          </Button>
          <Button
            action={(e) => {
              // setCheckboxChecked(false)
              // refetch();
              // setPage(1)
              // setOperationTypeSelect([]);
              // localStorage.clear()

              // COMPONENT FOR EXPORT DATA TO EXCEL FILE ACCEPT DATA AND THE NAME OF THE FILE
              ExportToExcel(dataExcel?.data, activeClass);
            }}
            className="bg-mainGreen text-white"
          >
            {t("export")}
          </Button>
        </div>
        <TableOfIdentities
          dataSource={dataSource}
          setPage={setPage}
          page={page}
          fetchKey={fetchKey}
          operationTypeSelect={operationTypeSelect}
          setOperationTypeSelect={setOperationTypeSelect}
          checkboxChecked={checkboxChecked}
          setCheckboxChecked={setCheckboxChecked}
        />
      </div>

      {/* OPERATION TYPE */}
      {(activeClass === "قطع بالوزن" || activeClass === "هويات في الإدارة") && (
        <OperationType
          refetch={refetch}
          setPage={setPage}
          setOperationTypeSelect={setOperationTypeSelect}
          setIsSuccessPost={setIsSuccessPost}
          operationTypeSelect={operationTypeSelect}
        />
      )}

      {/* BUTTON TO BACK */}
      <Back className="w-32 self-end mt-6" />

      <Modal
        maxWidth="w-[50rem]"
        isOpen={importModal}
        onClose={() => setImportModal(false)}
      >
        <div className="mt-14 mb-10 flex items-center gap-8">
          <FilesUpload
            files={importFiles}
            setFiles={setImportFiles}
            importedFile={true}
          />

          {/* <DropFile key={importFiles} /> */}
          {/* <input
            type="file"
            name="importFiles"
            id="importFiles"
            onChange={(e) => console.log(e.target.value)}
          /> */}
          <Button
            action={handleImportFiles}
            className="bg-mainGreen text-white self-end ml-9"
          >
            {t("save")}
          </Button>
        </div>

        {/* {importData && (
          <ImportTotals importData={importData} postIsLoading={postIsLoading} />
        )} */}
      </Modal>
    </div>
  );
};

export default CodedIdentities;
