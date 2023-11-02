/////////// IMPORTS
///
import { t } from "i18next"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useFetch } from "../../../../hooks"
import { SelectOption_TP } from "../../../../types"
import { Select } from "../../../molecules"
import { SingleValue } from "react-select"
import { useFormikContext } from "formik"
import { AccountLevel_TP } from "./AccountingTree"
import { RefetchErrorHandler } from "../../../molecules/RefetchErrorHandler"
///
/////////// Types
///
type AccountingTreeForm_TP = {
  level: number
  tree_id: { id: string; name: string }
  setTree_id: (value: { id: string; name: string }) => void
  account_id: { [key: string]: any } | any
  setAccount_id: Dispatch<SetStateAction<SingleValue<SelectOption_TP>>>
}
/////////// HELPER VARIABLES & FUNCTIONS
///

///

export const AccountingTreeForm = ({
  level,
  account_id,
  setAccount_id,
  tree_id,
  setTree_id,
}: AccountingTreeForm_TP) => {
  ///
  /////////// CUSTOM HOOKS
  ///
  ///
  /////////// STATES
  ///

  const [secondNewValue, setSecondNewValue] =
    useState<SingleValue<SelectOption_TP> | null>()
  const [newValue, setNewValue] =
    useState<SingleValue<SelectOption_TP> | null>()
  /////////// VARIABLES
  ///
  const { setFieldValue, values } = useFormikContext<{
    [key: string]: any
  }>()
  // مستوي اول
  const {
    data: firstLevel,
    isLoading: isLoadingFirstLevel,
    refetch: refetchFirstLevel,
    failureReason: failureReasonFirstLevel,
  } = useFetch<SelectOption_TP[], AccountLevel_TP[]>({
    queryKey: ["firstLevel"],
    endpoint: "/accounting/api/v1/trees?per_page=10000",
    select: (firstLevel) =>
      firstLevel?.map((first) => ({
        id: first.id,
        name: first.name,
        value: first.name,
        label: first.name,
      })),
    enabled: level !== 1,
  })
  // مستوي ثاني
  const {
    data: secondLevel,
    isLoading: isLoadingSecondLevel,
    refetch: refetchSecondLevel,
    failureReason: failureReasonSecondLevel,
  } = useFetch<SelectOption_TP[], AccountLevel_TP[]>({
    queryKey: ["secundLevel", `tree_id: ${tree_id?.id}`],
    endpoint: `/accounting/api/v1/accounts?tree_id=${tree_id?.id}?per_page=10000`,
    select: (secondLevel) =>
      secondLevel?.map((second) => ({
        id: second.id,
        name: second.name,
        value: second.name,
        label: second.name,
      })),
    enabled: !!tree_id?.id,
  })
  // مستوي ثالث
  const {
    data: threeLevel,
    isLoading: isLoadingThreeLevel,
    refetch: refetchThreeLevel,
    failureReason: failureReasonThreeLevel,
  } = useFetch<SelectOption_TP[], AccountLevel_TP[]>({
    queryKey: ["threeLevel", `account_id: ${account_id?.id}`],
    endpoint: `/accounting/api/v1/sub_accounts?account_id=${account_id?.id}?per_page=10000`,
    select: (threeLevel) =>
      threeLevel?.map((three) => ({
        id: three.id,
        name: three.name,
        value: three.name,
        label: three.name,
      })),
    enabled: !!account_id?.id,
  })

  /////////// SIDE EFFECTS
  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  useEffect(() => {
    if (secondLevel) {
      console.log("first")
      setNewValue(null)
      setSecondNewValue(null)
      // setTree_id({ id: "", label: "" })
      // setSecondNewValue(null)
      setFieldValue("account_id", "")
    }
  }, [JSON.stringify(secondLevel)])

  useEffect(() => {
    if (threeLevel) {
      setSecondNewValue(null)
      // setAccount_id({ id: "", label: "", value: "", name: "" })
      setFieldValue("parent_id", "")
    }
  }, [JSON.stringify(threeLevel)])
  return (
    <>
      {/* firstLevel */}
      {(level === 2 || level === 3 || level === 4) && (
        <div className="flex flex-col gap-1 justify-center">
          <Select
            label={t("choose level one account").toString()}
            name="tree_id"
            id="tree_id"
            placeholder={
              firstLevel && firstLevel?.length > 0
                ? t("level one").toString()
                : t("not a thing").toString()
            }
            required
            loadingPlaceholder={t("Loading...").toString()}
            loading={isLoadingFirstLevel}
            options={firstLevel}
            fieldKey="id"
            isDisabled={!isLoadingFirstLevel && !!failureReasonFirstLevel}
            onChange={(option: SingleValue<SelectOption_TP>) => {
              setFieldValue("tree_id", option?.id)
              setTree_id(option)
              // refetchSecondLevel()
            }}
            // defaultValue={{
            //   value: firstLevel ? firstLevel[0].name:'',
            //   label: firstLevel ? firstLevel[0].name:'',
            // }}
          />
          <RefetchErrorHandler
            failureReason={failureReasonFirstLevel}
            isLoading={isLoadingFirstLevel}
            refetch={refetchFirstLevel}
          />
        </div>
      )}
      {/* SecondLevel */}
      {(level === 3 || level === 4) && (
        <div className="flex flex-col gap-1 justify-center">
          <Select
            label={t("choose level two account").toString()}
            name="account_id"
            id="account_id"
            required
            placeholder={
              tree_id?.id
                ? secondLevel?.length !== 0
                  ? t("level two").toString()
                  : t("not a thing").toString()
                : t("choose level one first").toString()
            }
            loadingPlaceholder={
              !tree_id?.id
                ? t("choose level one first").toString()
                : t("Loading...").toString()
            }
            loading={isLoadingSecondLevel}
            options={secondLevel}
            isDisabled={!!!tree_id?.id}
            fieldKey="id"
            onChange={(option: SingleValue<SelectOption_TP>) => {
              setFieldValue("account_id", option?.id)
              setAccount_id(option)
              setNewValue(option)
              // refetchThreeLevel()
            }}
            value={newValue}
          />
          <RefetchErrorHandler
            failureReason={failureReasonSecondLevel}
            isLoading={isLoadingSecondLevel}
            refetch={refetchSecondLevel}
          />
        </div>
      )}
      {/* threeLevel */}
      {level === 4 && (
        <div className="flex flex-col gap-1 justify-center">
          <Select
            label={t("choose level three account").toString()}
            name="parent_id"
            id="parent_id"
            required
            placeholder={
              account_id?.id
                ? threeLevel?.length !== 0
                  ? t("level three").toString()
                  : t("not a thing").toString()
                : t("choose level tow first").toString()
            }
          
            loadingPlaceholder={
              !account_id?.id
                ? t("choose level two first").toString()
                : t("Loading...").toString()
            }
            loading={isLoadingThreeLevel}
            options={threeLevel}
            isDisabled={!!!account_id?.id}
            fieldKey="id"
            onChange={(option: SingleValue<SelectOption_TP>) => {
              setFieldValue("parent_id", option?.id)
              setSecondNewValue(option)
            }}
            value={secondNewValue}
          />
          <RefetchErrorHandler
            failureReason={failureReasonThreeLevel}
            isLoading={isLoadingThreeLevel}
            refetch={refetchThreeLevel}
          />
        </div>
      )}
    </>
  )
}
