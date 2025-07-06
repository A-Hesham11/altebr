import { t } from "i18next";
import { TreeNode } from "../../../../atoms/tree";
import { TreeNode_TP } from "./AccountingTreeData";

type AccountingTreeNode_TP = {
  tree: TreeNode_TP[];
};

export function AccountingTreeNode({ tree }: AccountingTreeNode_TP) {
  return (
    <>
      {tree?.map((node, i) => {
        return (
          <TreeNode
            label={t(`${node.label}`)}
            numericSystem={node.numeric_system}
            key={i}
          >
            {node.children && node.children.length > 0 && (
              <AccountingTreeNode tree={node.children} />
            )}
          </TreeNode>
        );
      })}
    </>
  );
}
