import { t } from "i18next";
import { TreeNode } from "../../../../atoms/tree";
import { TreeNode_TP } from "./AccountingTreeData";
import { useContext } from "react";
import { authCtx } from "../../../../../context/auth-and-perm/auth";

type AccountingTreeNode_TP = {
  tree: TreeNode_TP[];
};

export function AccountingTreeNode({ tree }: AccountingTreeNode_TP) {
  // console.log("🚀 ~ AccountingTreeNode ~ tree:", tree)
  const { userData } = useContext(authCtx);

  // const test = tree.filter((item) => item.branch_id === 11)
  // console.log("🚀 ~ AccountingTreeNode ~ test:", test)

  return (
    <>
      {tree?.map((node, i) => {
        return (
          <TreeNode label={t(`${node.label}`)} key={i}>
            {node.children && node.children.length > 0 && (
              <AccountingTreeNode tree={node.children} />
            )}
          </TreeNode>
        );
      })}
    </>
  );
}
