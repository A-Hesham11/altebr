import { css } from '@emotion/css'
import TreeNode, { TreeNodeProps } from './TreeNode'

export interface TreeProps {
  label: TreeNodeProps['label']
  children: TreeNodeProps['children']
}

function Tree({
  children,
  label
}: TreeProps) {
  return (
    <ul
      className={css`
        padding-inline-start: 0;
        margin: 0;
        display: flex;
        min-height: 100%;
      `}
    >
      <TreeNode label={label}>{children}</TreeNode>
    </ul>
  )
}

export default Tree