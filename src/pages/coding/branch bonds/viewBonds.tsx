
/////////// IMPORTS
///
import { t } from "i18next"
import { useContext, useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { Card_TP, FormNames_TP } from "../../system/types-and-helpers"
import { SystemCard } from "../../../components/templates/systemEstablishment/SystemCard"
import { Modal } from "../../../components/molecules"
import { useFetch } from "../../../hooks"
import { SelectOption_TP } from "../../../types"
import { authCtx } from "../../../context/auth-and-perm/auth"
import axios from "axios"
import { Loading } from "../../../components/organisms/Loading"

export const ViewBonds = () => {
  /////////// VARIABLES
  ///
  const navigate = useNavigate()

  const [popupIsOpen, setPopupIsOpen] = useState({
    partners: false,
    add_account: false,
    add_supplier: false,
  })

  const {
    data: branchesOptions,
    isFetching: branchesOptionsFeatching,
    isLoading: branchesLoading,
    refetch: refetchBranches,
    failureReason: branchesErrorReason,
  } = useFetch<SelectOption_TP[]>({
    endpoint: "branch/api/v1/branches?per_page=10000",
    queryKey: ["all-branches"],
  })

  const test = branchesOptions?.map((item) => item?.id)

  const {
    data: countBranchesOptions,
    isLoading: countBranchesLoading,
    isFetching: countBranchesFeatching,
    refetch: refetchCountBranches,
    failureReason: countBranchesErrorReason,
  } = useFetch<SelectOption_TP[]>({
    endpoint: "/sdad/api/v1/countBranches",
    queryKey: ["all-countBranches"],
  })

  console.log("🚀 ~ file: viewBonds.tsx:43 ~ ViewBonds ~ countBranchesOptions:", countBranchesOptions)


  const systemCards: Card_TP<FormNames_TP>[] = [

  ]

if (branchesOptions && !branchesLoading) {
    branchesOptions.forEach((branch) => {

      const countBranchesReyal = countBranchesOptions?.find((item) => item.branch_id === branch.id && item.unit_id === "ريال");
      console.log("🚀 ~ file: viewBonds.tsx:60 ~ branchesOptions.forEach ~ countBranchesReyal:", countBranchesReyal)
      const countBranchesGram = countBranchesOptions?.find((item) => item.branch_id === branch.id && item.unit_id === "جرام");
  
      systemCards.push({
        id: crypto.randomUUID(),
        title: `${branch?.name}`,
        viewLabel: t("view details"),
        viewHandler: () => {
          navigate(`/accept-branchBonds?id=${branch?.id}&name=${branch?.name}`, { branchName: branch?.name });
        },
        viewCountReyal: countBranchesReyal ? `${countBranchesReyal.value} ${countBranchesReyal.unit_id}` : '',
        viewCountGram: countBranchesGram ? `${countBranchesGram.value} ${countBranchesGram.unit_id}` : '',
      });
    });
  }



  //   // XXX
  // ]
  ///
  /////////// CUSTOM HOOKS
  ///

  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const openPopup = (formName: FormNames_TP) =>
    setPopupIsOpen((prev) => ({ ...prev, [formName]: true }))

  const closePopupHandler = (formName: FormNames_TP) =>
    setPopupIsOpen((prev) => ({ ...prev, [formName]: false }))
  ///

  if (branchesOptionsFeatching || countBranchesFeatching)
  return <Loading mainTitle={`${t("loading")}`} />;

  return (
    <>
        <h2 className="underline underline-offset-8 bold text-2xl mb-5">{t('branches')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {systemCards.map(
            ({
                id,
                title,
                addLabel,
                viewHandler,
                viewLabel,
                name,
                viewCountGram,
                viewCountReyal,
            }) => (
                <SystemCard
                key={id}
                viewHandler={viewHandler}
                viewLabel={viewLabel}
                title={title}
                addLabel={addLabel}
                viewCountReyal={viewCountReyal}
                viewCountGram={viewCountGram}
                forStyle
                addHandler={() => openPopup(name as FormNames_TP)}
                />
            )
            )}
        </div>
    </>
  )
}
