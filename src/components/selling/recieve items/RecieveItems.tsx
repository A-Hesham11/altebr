import { useState } from "react"
import { RecivedItemTP } from "../../../utils/selling"
import { AcceptedItemsAccountingEntry } from "./AcceptedItemsAccountingEntry"
import RecieveItemsFirstScreen from "./RecieveItemsFirstScreen"
import RecieveItemsSecondScreen from "./RecieveItemsSecondScreen"

const RecieveItems = () => {
    // states
    const [stage, setStage] = useState<number>(1)
    const [sanadId, setSanadId] = useState<number>(0)
    const [selectedItem, setSelectedItem] = useState<RecivedItemTP>({} as RecivedItemTP)

    // conditional rendering
    const recieveItemsSecondScreen: { [key: string]: any } = {
        1: <RecieveItemsFirstScreen
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            setStage={setStage}
            setSanadId={setSanadId}
            sanadId={sanadId}
        />,
        2: <RecieveItemsSecondScreen
            selectedItem={selectedItem}
            setStage={setStage}
            setSanadId={setSanadId}
        />,
        3: <AcceptedItemsAccountingEntry
            sanadId={sanadId}
            setStage={setStage}
        />,

    }

    return (
        <>
            {recieveItemsSecondScreen[stage]}
        </>
    )
}

export default RecieveItems