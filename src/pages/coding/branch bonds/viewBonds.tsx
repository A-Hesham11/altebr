
/////////// IMPORTS
///
import { t } from "i18next"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { Card_TP, FormNames_TP } from "../../system/types-and-helpers"
import { SystemCard } from "../../../components/templates/systemEstablishment/SystemCard"
import { Modal } from "../../../components/molecules"
import { useFetch } from "../../../hooks"
import { SelectOption_TP } from "../../../types"

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
    isLoading: branchesLoading,
    refetch: refetchBranches,
    failureReason: branchesErrorReason,
  } = useFetch<SelectOption_TP[]>({
    endpoint: "branch/api/v1/branches?per_page=10000",
    queryKey: ["all-branches"],
  })
  console.log("🚀 ~ file: viewBonds.tsx:39 ~ ViewBonds ~ branchesOptions:", branchesOptions)


  const systemCards: Card_TP<FormNames_TP>[] = [

  ]

  if (branchesOptions && !branchesLoading) {
    const branch = branchesOptions.map((branch) => branch);
    // console.log("🚀 ~ file: viewBonds.tsx:46 ~ ViewBonds ~ branchId:", branchId)
  
    // Assuming you want to add a card for each branch
    branchesOptions.forEach((branch) => {
    // console.log("🚀 ~ file: viewBonds.tsx:55 ~ branchNames.forEach ~ branchName:", branchName)

      systemCards.push({
        id: crypto.randomUUID(),
        title:`${branch?.name}`,
        viewLabel: t("view details"),
        // viewHandler: () => navigate("/accept-branchBonds", { branch: "fknm" }),    
          viewHandler: () => {
            // Add console.log for debugging
            // console.log("Navigating to accept-branchBonds with branch:", branchName);
            
            // Ensure the 'navigate' function is available and 'accept-branchBonds' is the correct route
            navigate(`/accept-branchBonds?id=${branch?.id}&name=${branch?.name}`, { branchName: branch?.name });
          },
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
            }) => (
                <SystemCard
                key={id}
                viewHandler={viewHandler}
                viewLabel={viewLabel}
                title={title}
                addLabel={addLabel}
                forStyle
                addHandler={() => openPopup(name as FormNames_TP)}
                />
            )
            )}
        </div>
    </>
  )
}
