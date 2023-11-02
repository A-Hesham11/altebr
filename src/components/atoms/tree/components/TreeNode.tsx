import * as React from 'react'
import { css, cx } from '@emotion/css'
import type { ReactNode } from 'react'

export interface TreeNodeProps {
  label: React.ReactNode
  className?: string
  children?: ReactNode
}

const verticalLine = css`
  content: '';
  position: absolute;
  top: 0;
  height: 20px;
  box-sizing: border-box;
`
const childrenContainer = css`
  display: flex;
  padding-inline-start: 0;
  margin: 0;
  padding-top: 20px;
  position: relative;
  ::before {
    ${verticalLine};
    left: calc(50% - 1px / 2);
    width: 0;
    border-left: 2px solid
      #295E56;
  }
`
const node = css`
  flex: auto;
  text-align: center;
  position: relative;
  display: inline-block;
  min-width: max-content;
  list-style-type: none;
  padding: 20px 5px 0px 5px;
`

const nodeLines = css`
  ::before,
  ::after {
    ${verticalLine};
    right: 50%;
    width: 50%;
    border-top: 2px solid
      #295E56;
  }
  ::after {
    left: 50%;
    border-left: 2px solid
      #295E56;
  }
  :only-of-type {
    padding: 0;
    ::after,
    :before {
      display: none;
    }
  }
  :first-of-type {
    ::before {
      border: 0 none;
    }
    ::after {
      border-radius: 5px 0 0 0;
    }
  }
  :last-of-type {
    ::before {
      border-right: 2px solid
        #295E56;
      border-radius: 0 5px 0 0;
    }
    ::after {
      border: 0 none;
    }
  }
`

const nodeSpan = css`
  background: #295E56;
  color: #FFF;
  display: inline-block;
  padding: 10px;
  border-radius: 10px;
`

function TreeNode({ children, label, className }: TreeNodeProps) {
  return (
    <li className={cx(node, nodeLines, className)}>
      <span className={nodeSpan}>{label}</span>
      {React.Children.count(children) > 0 && (
        <ul className={childrenContainer}>{children}</ul>
      )}
    </li>
  )
}

export default TreeNode