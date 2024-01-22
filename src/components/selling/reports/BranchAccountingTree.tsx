
import { useContext, useEffect, useRef } from "react"
import { t } from "i18next"
import { useFetch } from "../../../hooks"
import AccountingTreeData, { TreeNode_TP } from "../../templates/systemEstablishment/AccountingTree/view/AccountingTreeData"
import { Header } from "../../atoms/Header"
import { Loading } from "../../organisms/Loading"
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch"
import { Back } from "../../../utils/utils-components/Back"
import { Button } from "../../atoms"
import ZoomIn from "../../atoms/icons/ZoomIn"
import ZoomOut from "../../atoms/icons/ZoomOut"
import Reset from "../../atoms/icons/Reset"
import { authCtx } from "../../../context/auth-and-perm/auth"

const BranchAccountingTree = () => {
  const reset = useRef<HTMLButtonElement>(null)
  const { userData } = useContext(authCtx);

  const { 
    data,
    isLoading, 
    isSuccess, 
    error 
  } = useFetch<TreeNode_TP[]>({
    endpoint: `/branchAccount/api/v1/treeAccounts`,
    queryKey: ['view_branch_accounting_tree'],
  })
    console.log("🚀 ~ BranchAccountingTree ~ data:", data)

  useEffect(() => {
    if (data && data.length > 0 && reset.current)
      reset.current.click()
  }, [data])  

  return (
    <>
      {error && (
        <div className=" m-auto">
          <Header
            className="text-center text-2xl  font-bold"
            header={t(`some thing went wrong ${error.response.data.message}`)}
          />
        </div>
      )}
      {isLoading && <Loading mainTitle={t("accounting tree")} />}
      <div dir="ltr" style={{overflowY: 'hidden', height: '100%'}}>
      {isSuccess && !!data && !!data.length &&  (
            <TransformWrapper 
              initialScale={0.5}
              minScale={0.5}
              maxScale={2}
            >
              {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                <>
                  <div className="flex justify-between mb-5 px-10">
                    <div>
                      <Back />
                    </div>
                    <div className="flex gap-2">
                      <button ref={reset} onClick={() => rest.centerView(0.5)}></button>
                      <Button className="bg-mainOrange" action={() => zoomIn()}>
                        <ZoomIn />
                      </Button>
                      <Button
                        className="bg-mainOrange"
                        action={() => rest.centerView(0.5)}
                      >
                        <Reset />
                      </Button>
                      <Button className="bg-mainOrange" action={() => zoomOut()}>
                        <ZoomOut />
                      </Button>
                    </div>
                  </div>
                  <TransformComponent wrapperStyle={{ width: "100%", height: '100%', overflowX: 'clip' }}>
                    <div>
                      <AccountingTreeData data={data} />
                    </div>
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
      )}
        </div>
    </>
  )
}

export default BranchAccountingTree