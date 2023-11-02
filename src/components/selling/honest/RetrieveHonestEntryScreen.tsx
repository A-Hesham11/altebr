/////////// IMPORTS
///
import { useEffect, useState } from "react"
import { CreateHonestSanad } from "./CreateHonestSanad"
import DeliveryBondPreviewScreen from "./DeliveryBondPreviewScreen"
import { RetrieveHonestFirstScreen } from "./RetrieveHonestFirstScreen"

/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const RetrieveHonestEntryScreen = () => {
    /////////// VARIABLES
    ///

    ///
    /////////// CUSTOM HOOKS
    ///

    ///
    /////////// STATES
    ///
    const [stage, setStage] = useState(1)
    const [selectedItem, setSelectedItem] = useState([])
    const [paymentData, setPaymentData] = useState([])
    const stageStatus: { [key: number]: JSX.Element } = {
        1: <RetrieveHonestFirstScreen selectedItem={selectedItem} setSelectedItem={setSelectedItem} setStage={setStage} />,
        2: <CreateHonestSanad setStage={setStage} selectedItem={selectedItem} setSelectedItem={setSelectedItem} paymentData={paymentData} setPaymentData={setPaymentData} />,
        3: <DeliveryBondPreviewScreen setStage={setStage} selectedItem={selectedItem} paymentData={paymentData} />,
    }
    ///
    /////////// SIDE EFFECTS
    ///
    useEffect(() => {
        if (stage === 1)
            setSelectedItem([])
    }, [stage])
    /////////// FUNCTIONS | EVENTS | IF CASES
    ///

    ///
    return <>
        {
            stageStatus[stage]
        }
    </>
}