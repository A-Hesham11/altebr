/////////// IMPORTS
///
//import classes from './EmptyDataView.module.css'
///
/////////// Types
///

import { t } from "i18next"
import { Header } from "../../atoms/Header"
import { AddButton } from "../../molecules/AddButton"
import { Modal } from "../../molecules"
import { ReactNode, useState } from "react"

/////////// HELPER VARIABLES & FUNCTIONS
///

type EmptyDataView_TP = { children: ReactNode }
///
export const EmptyDataView = ({ children }: EmptyDataView_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///

  ///
  /////////// STATES
  ///
  const [open, setOpen] = useState(false)

  ///
  /////////// SIDE EFFECTS
  ///

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  ///
  return (
    <>
      <div className="mb-5 pr-5 flex flex-col gap-5 items-center justify-center">
        <Header
          header={t("no items")}
          className="text-center text-2xl font-bold"
        />
        <div className="flex">
          <AddButton
            action={() => setOpen(true)}
            addLabel={t(`Add New`).toString()}
          />
        </div>
      </div>
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false)
        }}
      >
        {children}
      </Modal>
    </>
  )
}
