import React, { useState } from 'react'
import { AcceptedItemsAccountingEntry } from './AcceptedItemsAccountingEntry'
import { RejectedItemsAccountingEntry } from './RejectedItemsAccountingEntry';
type AccountingEntryStage = {
    [key: number]: JSX.Element;
  };
const AccountingEntryStages = ({sanadId,isInPopup}:{sanadId:number,isInPopup?:boolean}) => {
    const [stage,setStage] = useState(1)
    const accountingEntryStage:AccountingEntryStage = {
        1:<AcceptedItemsAccountingEntry sanadId={sanadId} isInPopup={true} setStage={setStage} />,
        2:<RejectedItemsAccountingEntry sanadId={sanadId} isInPopup={true} setStage={setStage}/>
    }
  return (
    <div>
        {accountingEntryStage[stage]}
    </div>
  )
}

export default AccountingEntryStages