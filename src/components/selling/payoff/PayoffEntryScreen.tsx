import { useState } from "react"
import { PayOffFirstScreen } from "./PayOffFirstScreen"
import { PayOffSecondScreen } from "./PayOffSecondScreen"
import { RejectedItemsAccountingEntry } from "../recieve items/RejectedItemsAccountingEntry"

const PayoffEntryScreen = () => {
    // states
    const [stage, setStage] = useState<number>(1)
    const [sanadId, setSanadId] = useState<number>(0)
    const [selectedItem, setSelectedItem] = useState<any>({})

    // conditional rendering
    const payoffSecondScreen: { [key: string]: any } = {
        1: <PayOffFirstScreen
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            setStage={setStage}
            stage={stage}
        />,
        2: <PayOffSecondScreen
            selectedItem={selectedItem}
            setStage={setStage}
            setSanadId={setSanadId}
        />,
        3:<RejectedItemsAccountingEntry sanadId={sanadId} setStage={setStage}/>
    }

    return (
        <>
            {payoffSecondScreen[stage]}
        </>
    )
}

export default PayoffEntryScreen