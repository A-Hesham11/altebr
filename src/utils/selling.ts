import bank from "../assets/bank.svg";
import buying from "../assets/buying.svg";
import clients from "../assets/clients.svg";
import continuity from "../assets/continuity.svg";
import docs from "../assets/docs.svg";
import exchange from "../assets/exchange.svg";
import honesty from "../assets/honesty.svg";
import itemInfo from "../assets/itemInfo.svg";
import mardod from "../assets/mardod.svg";
import management from "../assets/management.svg";
import sadad from "../assets/sadad.svg";
import selling from "../assets/selling.svg";
import trading from "../assets/trading.svg";
import neighbors from "../assets/neighbors.svg";
import { StoneRow_TP } from "../pages/coding/gold/AddStone";

export const sellingCards = [
  {
    icon: selling,
    title_en: "selling",
    title_ar: "البيع",
    route: "/selling",
  },
  {
    icon: buying,
    title_en: "buying",
    title_ar: "الشراء",
    route: "/selling/buying",
  },
  {
    icon: management,
    title_en: "management",
    title_ar: "الادارة",
    route: "/selling/management",
  },
  {
    icon: exchange,
    title_en: "exchange",
    title_ar: "الصرف",
    route: "/selling/exchange",
  },
  {
    icon: clients,
    title_en: "clients",
    title_ar: "العملاء",
    route: "/selling/clients",
  },
  {
    icon: mardod,
    title_en: "returned",
    title_ar: "المردود",
    route: "/selling/payoff",
  },
  {
    icon: sadad,
    title_en: "reimbursement",
    title_ar: "السداد",
    route: "/selling/payment",
  },
  {
    icon: neighbors,
    title_en: "neighbors",
    title_ar: "الجيران",
    route: "/selling/neighbors",
  },
  {
    icon: docs,
    title_en: "reports",
    title_ar: "التقارير",
    route: "/selling/reports",
  },
  {
    icon: itemInfo,
    title_en: "Inventory",
    title_ar: "الجرد",
    route: "/selling/inventory",
  },
  {
    icon: continuity,
    title_en: "continuity",
    title_ar: "الدوام",
    route: "/selling/continuity",
  },
  {
    icon: trading,
    title_en: "trading",
    title_ar: "المتاجرة",
    route: "/selling/trading",
  },
  {
    icon: honesty,
    title_en: "honesty",
    title_ar: "الامانة",
    route: "/selling/honesty",
  },
  {
    icon: bank,
    title_en: "bank",
    title_ar: "البنك",
    route: "/bank",
  },
];
export type DetailsItem_TP = {
  attachment: { image: string }[];
  color_id: number;
  country_id: number;
  date: string;
  details: string | null | number;
  id: number;
  model_number: string;
  selling_price: string | null | number;
  size_unit_id: string | null | number;
  sizes: string | null | number;
  stonesDetails: StoneRow_TP[];
};
export type ItemInRecivedItemTP = {
  classification_id: number;
  diamond_weight: string;
  hwya: string;
  id: number;
  karat_id: number;
  karatmineral_id: number;
  selling_price: number;
  stones_weight: string;
  wage: string;
  wage_total: string;
  weight: string;
  detailsItem: any;
};
export type RecivedItemTP = {
  count_items: number;
  date: string;
  id: number;
  items: ItemInRecivedItemTP[];
  detailsItem: DetailsItem_TP[];
};
