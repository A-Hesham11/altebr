import { AiFillGolden, AiOutlineGold } from "react-icons/ai";
import { CiExport, CiSettings } from "react-icons/ci";
import { GiBigDiamondRing, GiCutDiamond, GiGems } from "react-icons/gi";
import { IoDiamondOutline, IoDocumentsOutline } from "react-icons/io5";
import { IconType } from "react-icons/lib";
import { RiVipCrownLine } from "react-icons/ri";
import { TbSmartHome } from "react-icons/tb";
import { TebrLogo } from "../components/atoms/icons/TebrLogo";
// import {sideBarLogo} from "../assets/sideBar-logo.svg";
import { t } from "i18next";
export type MenuItem_TP = {
  id: string
  icon: IconType
  label?: string
  link?: string

  items?: {
    id: string
    icon: IconType
    label?: string
    link?: string
    items?: MenuItem_TP[]
  }[]
}

export const sideBarItems: MenuItem_TP[] = [
  {
    id: crypto.randomUUID(),
    icon: TebrLogo,
  },
  {
    id: crypto.randomUUID(),
    icon: TbSmartHome,
    label: 'home',
    link: "/",
  },

  {
    id: crypto.randomUUID(),
    label: 'supply',
    icon: CiExport,
        items: [
          {
            id: crypto.randomUUID(),
            label: 'gold',
            icon: AiOutlineGold,
            items: [
              {
                id: crypto.randomUUID(),
                label: 'gold bonds',
                link: "/gold-bonds",
                icon: RiVipCrownLine,
              },
              {
                id: crypto.randomUUID(),
                label: 'gold bond supply',
                link: "/bonds/gold",
                icon: AiFillGolden,
              },
            ]
          },
          {
            id: crypto.randomUUID(),
            label: 'diamond',
            icon: IoDiamondOutline,
            items: [
              {
                id: crypto.randomUUID(),
                label: 'diamond bonds',
                link: "/diamond-bonds",
                icon: RiVipCrownLine,
              },
              {
                id: crypto.randomUUID(),
                label: 'diamond bond supply',
                link: "/bonds/diamond",
                icon: GiCutDiamond,
              },
            ]
          },
          {
            id: crypto.randomUUID(),
            label: 'accessory',
            icon: GiBigDiamondRing,
            items: [
              {
                id: crypto.randomUUID(),
                label: 'accessory bonds',
                link: "/accessory-bonds",
                icon: RiVipCrownLine,
              },
              {
                id: crypto.randomUUID(),
                label: 'accessories bond supply',
                link: "/bonds/accessories",
                icon: GiGems,
              },
            ]
          },
          // {
          //   id: crypto.randomUUID(),
          //   label: 'accessories bond supply',
          //   link: "accessories",
          //   icon: BiDiamond,
          // },
        ],
  },

  {
    id: crypto.randomUUID(),
    label: 'coding',
    icon: CiExport,
    items: [
      {
        id: crypto.randomUUID(),
        label: 'coded identities',
        link: "/coding",
        icon: RiVipCrownLine,
      },
      // REACT
      // الهويات المرقمة
      // {
      //   id: crypto.randomUUID(),
      //   label: 'coded identities 2',
      //   link: "/coding-react",
      //   icon: RiVipCrownLine,
      // },
      // REACT
      {
        id: crypto.randomUUID(),
        label: 'gold coding',
        link: "/coding/gold",
        icon: RiVipCrownLine,
      },
      {
        id: crypto.randomUUID(),
        label: 'diamond coding',
        link: "/coding/diamond",
        icon: GiCutDiamond,
      },
      {
        id: crypto.randomUUID(),
        label: 'accessories coding',
        link: "/coding/accessories",
        icon: GiCutDiamond,
      },
    ],
  },

  {
    id: crypto.randomUUID(),
    label: 'branches',
    icon: CiExport,
        items: [
          {
            id: crypto.randomUUID(),
            label: 'branch bonds',
            link: "/branch-bonds",
            icon: CiExport,
          },
          {
            id: crypto.randomUUID(),
            label: 'Branches payment',
            icon: CiExport,
            items: [
              {
                id: crypto.randomUUID(),
                label: 'Payment bonds',
                link: "/payment-bonds",
                icon: AiOutlineGold,
              },
              {
                id: crypto.randomUUID(),
                label: 'branches payment view',
                link: "/view-bonds",
                icon: AiOutlineGold,
              },
            ],
          },
          // REACT
          // سندات الفروع
          // {
          //   id: crypto.randomUUID(),
          //   label: 'branch bonds 2',
          //   link: "/branch-bonds-react",
          //   icon: CiExport,
          // },
          // {
          //   id: crypto.randomUUID(),
          //   label: 'return bonds 2',
          //   link: "/return-bonds-react",
          //   icon: CiExport,
          // },
          // REACT
        ]
  },

  {
    id: crypto.randomUUID(),
    label: 'system setting',
    link: "/system",
    icon: CiSettings,
  },
  
  // {
  //   id: crypto.randomUUID(),
  //   label: 'bonds',
  //   icon: IoDocumentsOutline,
  //   items: [
  //     {
  //       id: crypto.randomUUID(),
  //       label: 'supply',
  //       icon: CiExport,
  //       items: [
  //         {
  //           id: crypto.randomUUID(),
  //           label: 'branch bonds',
  //           link: "/branch-bonds",
  //           icon: CiExport,
  //         },
  //         {
  //           id: crypto.randomUUID(),
  //           label: 'gold bonds',
  //           link: "/gold-bonds",
  //           icon: RiVipCrownLine,
  //         },
  //         {
  //           id: crypto.randomUUID(),
  //           label: 'diamond bonds',
  //           link: "/diamond-bonds",
  //           icon: RiVipCrownLine,
  //         },
  //         {
  //           id: crypto.randomUUID(),
  //           label: 'accessory bonds',
  //           link: "/accessory-bonds",
  //           icon: RiVipCrownLine,
  //         },
  //         {
  //           id: crypto.randomUUID(),
  //           label: 'gold bond supply',
  //           link: "/bonds/gold",
  //           icon: AiFillGolden,
  //         },
  //         {
  //           id: crypto.randomUUID(),
  //           label: 'diamond bond supply',
  //           link: "/bonds/diamond",
  //           icon: GiCutDiamond,
  //         },
  //         {
  //           id: crypto.randomUUID(),
  //           label: 'accessories bond supply',
  //           link: "/bonds/accessories",
  //           icon: GiGems,
  //         },
  //         // {
  //         //   id: crypto.randomUUID(),
  //         //   label: 'accessories bond supply',
  //         //   link: "accessories",
  //         //   icon: BiDiamond,
  //         // },
  //       ],
  //     },
  //     // {1
  //     //   id: crypto.randomUUID(),
  //     //   label: 'payment',
  //     //   icon: MdOutlineAttachMoney,

  //     //   items: [
  //     //     {
  //     //       id: crypto.randomUUID(),
  //     //       label: 'bond payment',
  //     //       link: "/return-payment",
  //     //       icon: CiImport,
  //     //     },
  //     //   ],
  //     // },
  //     // {
  //     //   id: crypto.randomUUID(),
  //     //   label: 'payoff',
  //     //   link: "Return",
  //     //   icon: MdOutlinePayments,
  //     //   items: [
  //     //     {
  //     //       id: crypto.randomUUID(),
  //     //       label: 'supply payoff',
  //     //       link: "return-table",
  //     //       icon: MdOutlinePayments,
  //     //     },
  //     //     {
  //     //       id: crypto.randomUUID(),
  //     //       label: 'gold payoff',
  //     //       link: "return-gold",
  //     //       icon: AiFillGolden,
  //     //     },
  //     //     {
  //     //       id: crypto.randomUUID(),
  //     //       label: 'diamond payoff',
  //     //       link: "return-diamond",
  //     //       icon: AiFillGolden,
  //     //     },
  //     //     {
  //     //       id: crypto.randomUUID(),
  //     //       label: 'accessories payoff',
  //     //       link: "return-accessories",
  //     //       icon: AiFillGolden,
  //     //     },
  //     //   ],
  //     // },
  //     // {
  //     //   id: crypto.randomUUID(),
  //     //   label: "employees",
  //     //   link: "/employees",
  //     //   icon: GrGroup,
  //     // }, 
  //     // {
  //     //   id: crypto.randomUUID(),
  //     //   label: 'reserve gold',
  //     //   link: "accessories",
  //     //   icon: MdOutlinePayments,
  //     // },
  //   ],
  // },





      // {1
      //   id: crypto.randomUUID(),
      //   label: 'payment',
      //   icon: MdOutlineAttachMoney,

      //   items: [
      //     {
      //       id: crypto.randomUUID(),
      //       label: 'bond payment',
      //       link: "/return-payment",
      //       icon: CiImport,
      //     },
      //   ],
      // },
      // {
      //   id: crypto.randomUUID(),
      //   label: 'payoff',
      //   link: "Return",
      //   icon: MdOutlinePayments,
      //   items: [
      //     {
      //       id: crypto.randomUUID(),
      //       label: 'supply payoff',
      //       link: "return-table",
      //       icon: MdOutlinePayments,
      //     },
      //     {
      //       id: crypto.randomUUID(),
      //       label: 'gold payoff',
      //       link: "return-gold",
      //       icon: AiFillGolden,
      //     },
      //     {
      //       id: crypto.randomUUID(),
      //       label: 'diamond payoff',
      //       link: "return-diamond",
      //       icon: AiFillGolden,
      //     },
      //     {
      //       id: crypto.randomUUID(),
      //       label: 'accessories payoff',
      //       link: "return-accessories",
      //       icon: AiFillGolden,
      //     },
      //   ],
      // },
      // {
      //   id: crypto.randomUUID(),
      //   label: "employees",
      //   link: "/employees",
      //   icon: GrGroup,
      // }, 
      // {
      //   id: crypto.randomUUID(),
      //   label: 'reserve gold',
      //   link: "accessories",
      //   icon: MdOutlinePayments,
      // },
  // Desimal Number
  // {
  //   id: crypto.randomUUID(),
  //   label: 'settings',
  //   link: "/settings",
  //   icon: CiSettings,
  // },
]