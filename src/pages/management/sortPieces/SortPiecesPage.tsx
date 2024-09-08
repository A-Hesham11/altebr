

import { useState } from "react"
import { RecivedItemTP } from "../../../utils/selling"
import { AcceptedItemsAccountingEntry } from "../../../components/selling/recieve items/AcceptedItemsAccountingEntry"
import SortPiecesFirstScreen from "./SortPiecesFirstScreen"
import SortPiecesSecondScreen from "./SortPiecesSecondScreen"

const SortPiecesPage = () => {
    // states
    const [stage, setStage] = useState<number>(1)
    const [sanadId, setSanadId] = useState<number>(0)
    const [selectedItem, setSelectedItem] = useState<RecivedItemTP>({} as RecivedItemTP)

    // conditional rendering
    const recieveItemsSecondScreen: { [key: string]: any } = {
        1: <SortPiecesFirstScreen
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            setStage={setStage}
            setSanadId={setSanadId}
            sanadId={sanadId}
        />,
        2: <SortPiecesSecondScreen
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

export default SortPiecesPage