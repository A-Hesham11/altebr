/////////// IMPORTS
///
import { t } from "i18next";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { CreateSizes } from "../../components/CreateSizes";
import { Modal } from "../../components/molecules";
import { CreateNationalities } from "../../components/templates/CreateNationalities";
import CreateColor from "../../components/templates/reusableComponants/CreateColor";
import CreateCategory from "../../components/templates/reusableComponants/categories/create/CreateCategory";
import { CreateClassification } from "../../components/templates/reusableComponants/classifications/create/CreateClassification";
import CreateKarat from "../../components/templates/reusableComponants/karats/create/CreateKarat";
import CreateStoneNature from "../../components/templates/reusableComponants/stones/create/CreateStoneNature";
import CreateStonePurity from "../../components/templates/reusableComponants/stones/create/CreateStonePurity";
import CreateStoneQuality from "../../components/templates/reusableComponants/stones/create/CreateStoneQuality";
import CreateStoneShape from "../../components/templates/reusableComponants/stones/create/CreateStoneShape";
import CreateStoneType from "../../components/templates/reusableComponants/stones/create/CreateStoneType";
import { AddCities } from "../../components/templates/systemEstablishment/AddCities";
import { AddCountry } from "../../components/templates/systemEstablishment/AddCountry";
import { AddDistrict } from "../../components/templates/systemEstablishment/AddDistrict";
import { StonesCard } from "../../components/templates/systemEstablishment/StonesCard";
import { SystemCard } from "../../components/templates/systemEstablishment/SystemCard";
import { AddMarket } from "../../components/templates/systemEstablishment/markets/AddMarket";
import AddMineralsKarats from "../../components/templates/systemEstablishment/minerals karats/AddMaineralsKarat";
import AddMinerals from "../../components/templates/systemEstablishment/minerals/AddMinerals";
import ProfitMarginSelect from "../../context/settings/ProfitMarginSelect";
import { Back } from "../../utils/utils-components/Back";
import {
  Card_TP,
  GlobalFormNames_TP,
  MineralCardsNames_TP,
  StonesFormNames_TP,
} from "./types-and-helpers";
///
/////////// Types
///
type GlobalAndStonesProps_TP = {
  title: string;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const GlobalAndStones = ({ title }: GlobalAndStonesProps_TP) => {
  /////////// VARIABLES
  ///
  const navigate = useNavigate();
  const globalCards: Card_TP<GlobalFormNames_TP>[] = [
    {
      id: crypto.randomUUID(),
      title: t("countries"),
      name: "countries",
      addLabel: `${t("add Country")}`,
      addComponent: <AddCountry title={`${t("add Country")}`} />,
      viewLabel: `${t("view countries")}`,
      viewHandler: () => navigate("/system/global-and-stones/countries"),
    },
    {
      id: crypto.randomUUID(),
      title: t("cities"),
      name: "cities",
      addLabel: `${t("add city")}`,
      addComponent: <AddCities title={`${t("add city")}`} />,
      viewLabel: `${t("view cities")}`,
      viewHandler: () => navigate("/system/global-and-stones/cities"),
    },
    {
      id: crypto.randomUUID(),
      title: t("districts"),
      name: "districts",
      addLabel: `${t("add district")}`,
      addComponent: <AddDistrict title={`${t("add district")}`} />,
      viewLabel: `${t("view districs")}`,
      viewHandler: () => navigate("/system/global-and-stones/districts"),
    },
    {
      id: crypto.randomUUID(),
      title: t("nationalities"),
      name: "nationalities",
      addLabel: `${t("add nationality")}`,
      addComponent: <CreateNationalities title={`${t("add nationality")}`} />,
      viewLabel: `${t("view nationalities")}`,
      viewHandler: () => navigate("/system/global-and-stones/nationalities"),
    },
    // {
    //   id: crypto.randomUUID(),
    //   title: t("gold colors"),
    //   name: "colors",
    //   addLabel: `${t("add color")}`,
    //   addComponent: <CreateColor title={`${t("add color")}`} />,
    //   viewLabel: `${t("view colors")}`,
    //   viewHandler: () => navigate("/system/global-and-stones/colors"),
    // },
    // {
    //   id: crypto.randomUUID(),
    //   title: t("classifications"),
    //   name: "classifications",
    //   addLabel: `${t("add classification")}`,
    //   addComponent: (
    //     <CreateClassification title={`${t("add classification")}`} />
    //   ),
    //   viewLabel: `${t("view classifications")}`,
    //   viewHandler: () => navigate("/system/global-and-stones/classifications"),
    // },
    // {
    //   id: crypto.randomUUID(),
    //   title: t("karats"),
    //   name: "karats",
    //   addLabel: `${t("add karat")}`,
    //   addComponent: <CreateKarat title={`${t("add karat")}`} />,
    //   viewLabel: `${t("view karats")}`,
    //   viewHandler: () => navigate("/system/global-and-stones/karats"),
    // },
    // {
    //   id: crypto.randomUUID(),
    //   title: t("categories"),
    //   name: "categories",
    //   addLabel: `${t("add category")}`,
    //   addComponent: <CreateCategory title={`${t("add category")}`} />,
    //   viewLabel: `${t("view categories")}`,
    //   viewHandler: () => navigate("/system/global-and-stones/categories"),
    // },
    {
      id: crypto.randomUUID(),
      title: t("sizes"),
      name: "sizes",
      addLabel: `${t("add size")}`,
      addComponent: <CreateSizes title={`${t("add size")}`} />,
      viewLabel: "عرض المقاسات",
      viewHandler: () => navigate("/system/global-and-stones/sizes"),
    },
    {
      id: crypto.randomUUID(),
      title: t("markets"),
      name: "markets",
      addLabel: `${t("add market")}`,
      addComponent: <AddMarket title={`${t("add market")}`} />,
      viewLabel: `${t("view markets")}`,
      viewHandler: () => navigate("/system/global-and-stones/markets"),
    },
  ];

  const stonesCards: Card_TP<StonesFormNames_TP>[] = [
    {
      id: crypto.randomUUID(),
      title: t("stones types"),
      name: "stones",
      addComponent: <CreateStoneType title={`${t("add stones types")}`} />,
      viewHandler: () => navigate("/system/global-and-stones/stones-types"),
    },
    {
      id: crypto.randomUUID(),
      title: t("stones colors"),
      addComponent: <CreateColor title={`${t("add color")}`} />,
      name: "colors",
      viewHandler: () => navigate("/system/global-and-stones/stones-colors"),
    },
    {
      id: crypto.randomUUID(),
      title: t("stones shapes"),
      addComponent: <CreateStoneShape title={`${t("add shape")}`} />,
      name: "shapes",
      viewHandler: () => navigate("/system/global-and-stones/stones-shapes"),
    },
    {
      id: crypto.randomUUID(),
      title: t("stones qualities"),
      addComponent: (
        <CreateStoneQuality title={`${t("add stones qualities")}`} />
      ),
      name: "qualities",
      viewHandler: () => navigate("/system/global-and-stones/stones-qualities"),
    },
    {
      id: crypto.randomUUID(),
      title: t("stones purities"),
      addComponent: <CreateStonePurity title={`${t("add stones purities")}`} />,
      name: "purities",
      viewHandler: () => navigate("/system/global-and-stones/stones-purities"),
    },
    {
      id: crypto.randomUUID(),
      title: t("stones natures"),
      addComponent: <CreateStoneNature title={`${t("add stones natures")}`} />,
      name: "natures",
      viewHandler: () => navigate("/system/global-and-stones/stones-natures"),
    },
  ];

  const mineralCards: Card_TP<MineralCardsNames_TP>[] = [
    {
      id: crypto.randomUUID(),
      title: t("minerals"),
      name: "minerals",
      addLabel: `${t("add minerals")}`,
      addComponent: <AddMinerals title={`${t("add minerals")}`} />,
      viewLabel: `${t("view minerals")}`,
      viewHandler: () => navigate("/system/global-and-stones/minerals"),
    },
    {
      id: crypto.randomUUID(),
      title: t("minerals karats"),
      name: "minerals_karats",
      addLabel: `${t("add minerals karats")}`,
      addComponent: <AddMineralsKarats title={`${t("add minerals karats")}`} />,
      viewHandler: () => navigate("/system/global-and-stones/minerals_karats"),
    },
    {
      id: crypto.randomUUID(),
      title: t("profit margin"),
      name: "profit_margin",
      addLabel: `${t("edit profit margin")}`,
      addComponent: <ProfitMarginSelect />,
    },
  ];
  ///
  /////////// CUSTOM HOOKS
  ///

  ///
  /////////// STATES
  ///
  const [globalsPopups, setGlobalsPopups] = useState<{
    [key in GlobalFormNames_TP]: boolean;
  }>({
    countries: false,
    cities: false,
    districts: false,
    markets: false,
    minerals: false,
    minerals_karats: false,
    colors: false,
    classifications: false,
    categories: false,
    nationalities: false,
    karats: false,
    sizes: false,
    profit_margin: false,
  });

  const [stonesPopups, setStonesPopups] = useState<{
    [key in StonesFormNames_TP]: boolean;
  }>({
    stones: false,
    shapes: false,
    qualities: false,
    purities: false,
    natures: false,
    colors: false,
  });

  const [mineralPopups, setMineralPopups] = useState<{
    [key in MineralCardsNames_TP]: boolean;
  }>({
    minerals: false,
    minerals_karats: false,
    profit_margin: false,
  });
  ///
  /////////// SIDE EFFECTS
  ///

  ///
  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  const openGlobalPopup = (formName: GlobalFormNames_TP | StonesFormNames_TP) =>
    setGlobalsPopups((prev) => ({ ...prev, [formName]: true }));

  const closeGlobalPopup = (
    formName: GlobalFormNames_TP | StonesFormNames_TP
  ) => setGlobalsPopups((prev) => ({ ...prev, [formName]: false }));

  const openStonesPopup = (formName: GlobalFormNames_TP | StonesFormNames_TP) =>
    setStonesPopups((prev) => ({ ...prev, [formName]: true }));

  const closeStonesPopup = (
    formName: GlobalFormNames_TP | StonesFormNames_TP
  ) => setStonesPopups((prev) => ({ ...prev, [formName]: false }));

  const openMineralPopup = (
    formName: GlobalFormNames_TP | MineralCardsNames_TP
  ) => setMineralPopups((prev) => ({ ...prev, [formName]: true }));

  const closeMineralPopup = (
    formName: GlobalFormNames_TP | MineralCardsNames_TP
  ) => setMineralPopups((prev) => ({ ...prev, [formName]: false }));
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold underline underline-offset-8">
          {t("Another")}
        </h1>
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
              addHandler={() => openGlobalPopup(name as GlobalFormNames_TP)}
            />
          )
        )}
      </div>

      <br />
      <div className="mt-12 grid grid-cols-4 gap-6">
        <div className="col-span-1 flex w-full flex-col items-center gap-4">
          <div className="flex w-full items-center justify-center gap-2  rounded-lg  bg-mainGreen p-3 text-white">
            <h2>{t("stones management")}</h2>
          </div>
          {stonesCards.map(
            ({
              id,
              title,
              addComponent,
              addLabel,
              viewHandler,
              viewLabel,
              name,
            }) => (
              <div
                key={id}
                className="flex w-full items-center justify-between rounded-lg border border-mainGreen p-2 text-mainGreen"
              >
                <StonesCard
                  addHandler={() => openStonesPopup(name as GlobalFormNames_TP)}
                  title={title}
                  viewHandler={viewHandler}
                />
              </div>
            )
          )}
        </div>
        {/* المعادن */}
        <div className="col-span-1 flex w-full flex-col items-center gap-4">
          <div className="col-span-1 flex w-full flex-col items-center gap-4">
            <div className="flex w-full items-center justify-center gap-2  rounded-lg  bg-mainGreen p-3 text-white">
              <h2>{t("mineral management")}</h2>
            </div>
            {mineralCards.map(
              ({
                id,
                title,
                addComponent,
                addLabel,
                viewHandler,
                viewLabel,
                name,
              }) => (
                <div
                  key={id}
                  className="flex w-full items-center justify-between rounded-lg border border-mainGreen p-2 text-mainGreen"
                >
                  <StonesCard
                    addHandler={() =>
                      openMineralPopup(name as GlobalFormNames_TP)
                    }
                    title={title}
                    viewHandler={viewHandler}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>

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
          );
        }
      })}

      {stonesCards.map(({ id, name, addComponent }) => {
        if (name && addComponent) {
          return (
            <Modal
              key={id}
              isOpen={stonesPopups[name as keyof typeof stonesPopups]}
              onClose={() =>
                closeStonesPopup(name as keyof typeof stonesPopups)
              }
            >
              {addComponent}
            </Modal>
          );
        }
      })}

      {mineralCards.map(({ id, name, addComponent }) => {
        if (name && addComponent) {
          return (
            <Modal
              key={id}
              isOpen={mineralPopups[name as keyof typeof mineralPopups]}
              onClose={() =>
                closeMineralPopup(name as keyof typeof mineralPopups)
              }
            >
              {addComponent}
            </Modal>
          );
        }
      })}
    </>
  );
};
