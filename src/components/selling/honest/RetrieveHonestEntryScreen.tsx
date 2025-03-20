/////////// IMPORTS
///
import { useEffect, useState } from "react";
import { CreateHonestSanad } from "./CreateHonestSanad";
import DeliveryBondPreviewScreen from "./DeliveryBondPreviewScreen";
import { RetrieveHonestFirstScreen } from "./RetrieveHonestFirstScreen";
import { useFetch } from "../../../hooks";

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
  const [stage, setStage] = useState(1);
  const [selectedItem, setSelectedItem] = useState([]);
  const [paymentData, setPaymentData] = useState([]);

  const { data: clientInfo } = useFetch<any>({
    endpoint: `branchManage/api/v1/clients/${selectedItem?.client_id}`,
    queryKey: [`clients_info`, selectedItem?.client_id],
    enabled: !!selectedItem?.client_id,
  });

  const stageStatus: { [key: number]: JSX.Element } = {
    1: (
      <RetrieveHonestFirstScreen
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        setStage={setStage}
      />
    ),
    2: (
      <CreateHonestSanad
        setStage={setStage}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        paymentData={paymentData}
        setPaymentData={setPaymentData}
      />
    ),
    3: (
      <DeliveryBondPreviewScreen
        setStage={setStage}
        selectedItem={selectedItem}
        paymentData={paymentData}
        clientInfo={clientInfo}
      />
    ),
  };
  ///
  /////////// SIDE EFFECTS
  ///
  useEffect(() => {
    if (stage === 1) setSelectedItem([]);
  }, [stage]);
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  ///
  return <>{stageStatus[stage]}</>;
};
