import { t } from "i18next";
import { SystemCard } from "../../components/templates/systemEstablishment/SystemCard";
import { FormNames_TP } from "./types-and-helpers";

type EstablishingSystemCard_TP = {
  titleKey: string;
  index: number;
  systemCards: any;
  openPopup: any;
  total: any;
  permission: any;
};

type SystemCard_TP = {
  id: number;
  title: string;
  addComponent: any;
  addLabel: any;
  viewHandler: any;
  viewLabel: any;
  name: string;
  permission: any;
};

const EstablishingSystem = ({
  titleKey,
  index,
  systemCards,
  openPopup,
  total,
}: EstablishingSystemCard_TP) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6 border-2 border-mainGreen text-mainGreen px-4 py-1 rounded-md">
        <h2 className="under bold text-lg font-semibold">{t(titleKey)}</h2>
        <p className="text-sm">
          ({index} {t("from")} {total}) {t("From the founding")}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {systemCards.map(
          ({
            id,
            title,
            addComponent,
            addLabel,
            viewHandler,
            viewLabel,
            name,
            permission,
          }: SystemCard_TP) => (
            <SystemCard
              key={id}
              viewHandler={viewHandler}
              viewLabel={viewLabel}
              title={title}
              addLabel={addLabel}
              addHandler={() => openPopup(name as FormNames_TP)}
              permission={permission}
            />
          )
        )}
      </div>
    </div>
  );
};

export default EstablishingSystem;
