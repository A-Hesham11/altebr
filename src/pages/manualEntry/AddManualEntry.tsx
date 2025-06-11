import { t } from "i18next";
import { Form, Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import { authCtx } from "../../context/auth-and-perm/auth";
import { useFetch, useMutate } from "../../hooks";
import { notify } from "../../utils/toast";
import { mutateData } from "../../utils/mutateData";
import { useLocation, useNavigate } from "react-router-dom";
import ManualEntryMainData from "./ManualEntryMainData";
import ManualEntryTableData from "./ManualEntryTableData";
import { Loading } from "../../components/organisms/Loading";
import { Button } from "../../components/atoms";
import * as Yup from "yup";

type Entry = {
  bond_number: null;
  date: Date;
  description: string;
  entry_archive: string;
  account_id: string;
  account_name: string;
  indebted_gram: string;
  creditor_gram: string;
  indebted_reyal: string;
  creditor_reyal: string;
};

// const validationSchema = Yup.object().shape({
//   bond_number: Yup.number()
//     .typeError("Document number must be a number")
//     .min(0, "Document number cannot be less than 0")
//     .required("Document number is required"),
// });

const AddManualEntry = () => {
  const [dataSource, setDataSource] = useState<Entry[]>([]);
  console.log("🚀 ~ AddManualEntry ~ dataSourse:", dataSource);
  const [editEntryBond, setEditEntryBond] = useState<any>(null);
  console.log("🚀 ~ AddManualEntry ~ editEntryBond:", editEntryBond);
  const [steps, setSteps] = useState(1);
  const [files, setFiles] = useState([]);
  const [branchID, setBranchID] = useState<Number>(1);
  const { userData } = useContext(authCtx);
  const navigate = useNavigate();
  const location = useLocation();

  const { data: nextBond, isFetching: isFetchingNextBomd } = useFetch<any[]>({
    endpoint: `/journalEntry/api/v1/nextBond`,
    queryKey: ["nextBond"],
  });
  console.log("🚀 ~ AddManualEntry ~ nextBond:", nextBond);

  const indebtedGram = dataSource?.reduce((acc: number, curr: any) => {
    acc += +curr.indebted_gram;
    return acc;
  }, 0);

  const creditorGram = dataSource?.reduce((acc: number, curr: any) => {
    acc += +curr.creditor_gram;
    return acc;
  }, 0);

  const indebtedReyal = dataSource?.reduce((acc: number, curr: any) => {
    acc += +curr.indebted_reyal;
    return acc;
  }, 0);

  const creditorReyal = dataSource?.reduce((acc: number, curr: any) => {
    acc += +curr.creditor_reyal;
    return acc;
  }, 0);

  const { data: allAccounts, isFetching: isFetchingAccounts } = useFetch<any[]>(
    {
      endpoint: `/journalEntry/api/v1/allAccounts/${branchID}`,
      queryKey: ["manual_entry_accounts", branchID],
      enabled: !!branchID,
    }
  );

  const allAccountOptions = allAccounts?.map((account) => ({
    id: account.id,
    label: `${account.name} (${account.numeric_system})`,
    value: account.numeric_system,
    unit_id: account.unit_id,
    type: account.type,
  }));

  const { data, isFetching } = useFetch<any>({
    endpoint: `/journalEntry/api/v1/entries/${location?.state?.id}`,
    queryKey: [`edit_entry`, location?.state?.id],
    onSuccess(data) {
      console.log("🚀 ~ onSuccess ~ data:", data);
      setEditEntryBond(data);
      const entryData = data?.boxes?.map((box: any) => {
        const unit_id = allAccountOptions?.filter(
          (account) => account.value === box.numeric_system
        )?.[0]?.unit_id;

        return {
          account_id: box.accountable_id,
          item_id: box.numeric_system,
          account_name: box.account,
          comments: box.text,
          creditor_gram:
            box.computational_movement === "creditor" && box.unit === 2
              ? box.value
              : "",
          creditor_reyal:
            box.computational_movement === "creditor" && box.unit === 1
              ? box.value
              : "",
          indebted_gram:
            box.computational_movement === "debtor" && box.unit === 2
              ? box.value
              : "",
          indebted_reyal:
            box.computational_movement === "debtor" && box.unit === 1
              ? box.value
              : "",
          type: box.type,
          unit_id,
        };
      });

      const sameCollection = entryData?.reduce((prev, curr) => {
        const index = prev.findIndex(
          (item) => item.account_name === curr.account_name
        );
        if (index === -1) {
          prev.push(curr);
        } else {
          prev[index].indebted_gram += curr.indebted_gram;
          prev[index].indebted_reyal += curr.indebted_reyal;
          prev[index].creditor_gram += curr.creditor_gram;
          prev[index].creditor_reyal += curr.creditor_reyal;
        }
        return prev;
      }, [] as typeof dataSource);

      setDataSource(sameCollection);
    },
    enabled: !!location?.state?.id && allAccountOptions?.length > 0,
  });

  const initialValues = {
    item_id: editEntryBond ? editEntryBond?.id : null,
    branch_id: editEntryBond ? editEntryBond?.branch_id : null,
    branch_name: editEntryBond ? editEntryBond?.branch : null,
    bond_number: editEntryBond ? editEntryBond?.bond_number : null,
    date: editEntryBond?.date ? new Date(editEntryBond?.date) : new Date(),
    operation_date: editEntryBond?.operation_date
      ? new Date(editEntryBond?.operation_date)
      : new Date(),
    media:
      editEntryBond?.attachment?.length > 0
        ? editEntryBond?.attachment?.map((image: any) => ({
            id: image.id,
            preview: image?.preview,
            path: image?.preview,
            type: "image",
          }))
        : [],
    entry_type: editEntryBond ? editEntryBond?.entry_type : "daily",
    description: editEntryBond ? editEntryBond?.comments : "",
    entry_archive: editEntryBond ? editEntryBond?.entry_archive : 0,
    account_id: null,
    account_name: "",
    indebted_gram: "",
    creditor_gram: "",
    indebted_reyal: "",
    creditor_reyal: "",
    // comments: "",
    type: "",
    unit_id: "",
    isEdit: false,
  };

  const isEntryRight =
    indebtedGram != creditorGram || indebtedReyal != creditorReyal;

  const {
    mutate,
    error: errorQuery,
    isLoading,
  } = useMutate<any>({
    mutationFn: mutateData,
    onSuccess: async (data) => {
      await notify("success");
      navigate("/viewManualEntry");
    },
    onError: (error) => {
      notify("error");
    },
  });

  const accounts = dataSource?.flatMap((data: any) => {
    const common = {
      id: data?.account_id,
      type: data?.type,
      comment: data?.comments || "---",
    };

    if (data?.unit_id === 3) {
      return [
        {
          ...common,
          value: Number(data?.indebted_gram || data?.creditor_gram),
          unit_id: 2,
          movement: data?.indebted_gram ? "debtor" : "creditor",
        },
        {
          ...common,
          value: Number(data?.indebted_reyal || data?.creditor_reyal),
          unit_id: 1,
          movement: data?.indebted_reyal ? "debtor" : "creditor",
        },
      ];
    }

    return {
      ...common,
      unit_id: data?.unit_id,
      movement:
        data.indebted_gram !== "" || data.indebted_reyal !== ""
          ? "debtor"
          : "creditor",
      value: Number(
        data?.indebted_gram ||
          data?.creditor_gram ||
          data?.indebted_reyal ||
          data?.creditor_reyal
      ),
    };
  });

  const handleSubmit = (payload: any) => {
    console.log("🚀 ~ handleSubmit ~ payload:", payload);
    if (isEntryRight) {
      notify("error", `${t("there is an error in the entry")}`);
      return;
    }

    const onlyFiles = payload.media.filter((item) => item instanceof File);

    const filterMedia = editEntryBond?.attachment.filter(
      (item) => !payload.media.some((ref) => ref.id === item.id)
    );

    const finalOldMedia = filterMedia?.map((item) => item.id);

    mutate({
      endpointName: !!editEntryBond?.id
        ? `/journalEntry/api/v1/journal-entries/${editEntryBond?.id}`
        : "/journalEntry/api/v1/journal-entries",
      values: {
        bond_number: payload.bond_number,
        branch_id: payload.branch_id,
        entry_type: payload.entry_type,
        is_archive: Number(payload.entry_archive) || 0,
        date: payload.date,
        operation_date: payload.operation_date,
        employee_id: userData?.id,
        comments: payload.description,
        media: onlyFiles,
        oldFiles: finalOldMedia,
        accounts,
      },
      dataType: "formData",
    });
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [steps]);

  if (isFetching) return <Loading mainTitle="" />;

  return (
    <div className="">
      <div className="">
        <div className="flex items-center justify-between mb-4 ">
          <h2 className="text-2xl font-bold">{t("manual entry")}</h2>
          {steps === 2 && (
            <Button
              action={() => {
                setSteps((prev) => prev - 1);
              }}
              bordered
            >
              {t("back")}
            </Button>
          )}
        </div>

        <Formik
          initialValues={initialValues}
          // validationSchema={validationSchema}
          onSubmit={(data) => {
            handleSubmit(data);
          }}
          enableReinitialize={!!editEntryBond?.id}
        >
          <Form className="">
            {steps === 1 && (
              <ManualEntryMainData
                setSteps={setSteps}
                editEntryBond={editEntryBond}
                dataSource={dataSource}
                setBranchID={setBranchID}
                nextBond={nextBond?.nextBond}
              />
            )}

            {steps === 2 && (
              <ManualEntryTableData
                dataSource={dataSource}
                setDataSource={setDataSource}
                isLoading={isLoading}
                setBranchID={setBranchID}
                allAccountOptions={allAccountOptions}
                isFetchingAccounts={isFetchingAccounts}
                editEntryBond={editEntryBond}
              />
            )}
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default AddManualEntry;
