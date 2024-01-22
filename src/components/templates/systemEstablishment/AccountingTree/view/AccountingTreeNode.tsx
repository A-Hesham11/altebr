import { t } from "i18next"
import { TreeNode } from "../../../../atoms/tree"
import { TreeNode_TP } from "./AccountingTreeData"
import { useContext } from "react"
import { authCtx } from "../../../../../context/auth-and-perm/auth"

type AccountingTreeNode_TP = {
  tree: TreeNode_TP[]
}

export function AccountingTreeNode({ tree }: AccountingTreeNode_TP) {
  console.log("🚀 ~ AccountingTreeNode ~ tree:", tree)
  const { userData } = useContext(authCtx);
  console.log("🚀 ~ userData:", userData)

 

  
  return (
    <>
      {tree?.map((node, i) => {
        return(
        <TreeNode label={t(`${node.label}`)} key={i}>
          {(node.children && node.children.length > 0) && <AccountingTreeNode tree={node.children} />}
        </TreeNode>
      )})}
    </>
  //   <>
  //   {(tree?.map((node, i) => node)?.filter((child) => ( child?.branch_id === null || child?.branch_id === 12 )) => {
  //     // const test111 = tree?.map((node) => node)?.filter((child) => ( child?.branch_id === null || child?.branch_id === 12 ))
  //     // console.log("🚀 ~ { ~ test111:", test111)
  //     return(
  //     <TreeNode label={t(`${node.label}`)} key={i}>
  //       {(node ) && <AccountingTreeNode tree={node} />}
  //     </TreeNode>
  //   )})}
  // </>
  )
}
