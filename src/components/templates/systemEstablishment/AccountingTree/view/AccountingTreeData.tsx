import { t } from "i18next"
import { Tree } from "../../../../atoms/tree"
import { AccountingTreeNode } from "./AccountingTreeNode"

export type TreeNode_TP = {
  label: string,
  children?: TreeNode_TP[]
}

type AccountingTreeData_TP = {
  data: TreeNode_TP[]
}

const AccountingTreeData = ({data}: AccountingTreeData_TP) => {
  const test: TreeNode_TP[] = [
    {
      label: 'الأصول',
      children: [
        {
          label: 'الأصول الثابتة',
          children: [
            {
              label: 'المباني',
              children: [
                { label: 'المبني الرئيسي للشركة' },
                { label: 'مبني الفرع' },
              ],
            },
            {
              label: 'الأثاث',
              children: [
                { label: 'أثاث الفرع الرئيسي' },
                { label: 'أثاث الفرع 2' },
              ],
            },
          ],
        },
        {
          label: 'الأصول المتداولة',
          children: [
            {
              label: 'النقدية',
              children: [
                { label: 'الصناديق' },
                { label: 'البنوك' },
              ],
            },
            {
              label: 'العملاء',
              children: [
                { label: 'العملاء' },
                { label: 'عملاء في الخارج' },
              ],
            },
          ],
        },
      ],
    },
    {
      label: 'الخصوم',
      children: [
        {
          label: 'الخصوم الثابتة',
          children: [
            { label: 'رأس المال' },
            { label: 'الاحتياطيات' },
            { label: 'المخصصات' },
            { label: 'الأرباح و الخسائر' },
          ],
        },
        {
          label: 'الخصوم المتداولة',
          children: [
            {
              label: 'الموردون',
              children: [
                { label: 'مورد محلي' },
                { label: 'مورد خارجي' },
              ],
            },
            { label: 'التزامات أخري' },
          ],
        },
      ],
    },
    {
      label: 'المصروفات',
      children: [
        {
          label: 'تكاليف النشاط',
          children: [
            { label: 'تكلفة مبيعات المخزون' },
            { label: 'تكلفة مردودات المبيعات' },
            { label: 'الخصم المسموح به' },
          ],
        },
        {
          label: 'المصروفات الادارية',
          children: [
            { label: 'مصروفات ادارية' },
            { label: 'مصروفات اعلامية' },
          ],
        },
      ],
    },
    {
      label: 'الايرادات',
      children: [
        {
          label: 'ايرادات النشاط',
          children: [
            { label: 'ايرادات المبيعات' },
            { label: 'ايراد الذهب' },
            { label: 'ايراد الألماس' },
          ],
        },
        {
          label: 'ايرادات أخري',
          children: [
            { label: 'ايرادات التلميع' },
            { label: 'ايرادات البرامج التقنية' },
          ],
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-6 items-center">
      <Tree label={t('accounting tree')}>
        <AccountingTreeNode tree={data} />
      </Tree>
    </div>
  )
}

export default AccountingTreeData