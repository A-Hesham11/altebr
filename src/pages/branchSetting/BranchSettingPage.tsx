import { t } from 'i18next'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '../../components/molecules'
import { SystemCard } from '../../components/templates/systemEstablishment/SystemCard'

import AddBranchSetting from '../../components/templates/bankCards/AddBankCardsData'
import AddSellingPolicies from '../../components/templates/sellingPolicies/AddSellingPolicies'


const BranchSettingPage = () => {

    const navigate = useNavigate()
    const globalCards: Card_TP<GlobalFormCards_TP>[] = [

      // {
      //   id: crypto.randomUUID(),
      //   title: t("selling policies"),
      //   name: "selling_policies",
      //   addLabel: `${t("add selling policy")}`,
      //   addComponent: <AddSellingPolicies title={`${t("add selling policy")}`} />,
      //   viewLabel: `${t("view selling policies")}`,
      //   viewHandler: () => navigate("/selling/policiesSelling"),
      // },
    //   {
    //     id: crypto.randomUUID(),
    //     title: t("cities"),
    //     name: "cities",
    //     addLabel: `${t("add city")}`,
    //     addComponent: <AddCities title={`${t("add city")}`} />,
    //     viewLabel: `${t("view cities")}`,
    //     viewHandler: () => navigate("/system/global-and-stones/cities"),
    //   },
    //   {
    //     id: crypto.randomUUID(),
    //     title: t("districts"),
    //     name: "districts",
    //     addLabel: `${t("add district")}`,
    //     addComponent: <AddDistrict title={`${t("add district")}`} />,
    //     viewLabel: `${t("view districs")}`,
    //     viewHandler: () => navigate("/system/global-and-stones/districts"),
    //   },
    //   {
    //     id: crypto.randomUUID(),
    //     title: t("nationalities"),
    //     name: "nationalities",
    //     addLabel: `${t("add nationality")}`,
    //     addComponent: <CreateNationalities title={`${t("add nationality")}`} />,
    //     viewLabel: `${t("view nationalities")}`,
    //     viewHandler: () => navigate("/system/global-and-stones/nationalities"),
    //   },
    ]

    const [globalsPopups, setGlobalsPopups] = useState<{
        [key in GlobalFormCards_TP]: boolean
      }>({
        selling_policies: false,
        cities: false,
        districts: false,
        colors: false,
      })

      const openGlobalPopup = (formName: GlobalFormCards_TP | StonesFormNames_TP) =>
      setGlobalsPopups((prev) => ({ ...prev, [formName]: true }))
  
    const closeGlobalPopup = (
      formName: GlobalFormCards_TP | StonesFormNames_TP
    ) => setGlobalsPopups((prev) => ({ ...prev, [formName]: false }))
  

  return (
    <>
      {/* <Helmet>
        <title>{title}</title>
      </Helmet> */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold underline underline-offset-8">{t("branch settings")}</h1>
        {/* <Back path="/system" /> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {globalCards.map(
          ({
            id,
            title,
            addComponent,
            addLabel,
            viewHandler,
            viewLabel,
            name,
          }) => (
            <SystemCard
              forStyle
              key={id}
              viewHandler={viewHandler}
              viewLabel={viewLabel}
              title={title}
              addLabel={addLabel}
              addHandler={() => openGlobalPopup(name as GlobalFormCards_TP)}
            />
          )
        )}
      </div>

      <br />

      {globalCards.map(({ id, name, addComponent }) => {
        if (name && addComponent) {
          return (
            <Modal
              key={id}
              isOpen={globalsPopups[name as keyof typeof globalsPopups]}
              onClose={() =>
                closeGlobalPopup(name as keyof typeof globalsPopups)
              }
            >
              {addComponent}
            </Modal>
          )
        }
      })}



    </>
  )
}

export default BranchSettingPage