import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch"
import { Button } from "../../../../atoms"
import Reset from "../../../../atoms/icons/Reset"
import ZoomIn from "../../../../atoms/icons/ZoomIn"
import ZoomOut from "../../../../atoms/icons/ZoomOut"
import AccountingTreeData, { TreeNode_TP } from "./AccountingTreeData"
import { Back } from "../../../../../utils/utils-components/Back"
import { useEffect, useRef } from "react"
import { useFetch } from "../../../../../hooks"
import { Header } from "../../../../atoms/Header"
import { t } from "i18next"
import { Loading } from "../../../../organisms/Loading"

const AccountingTree = () => {
  const reset = useRef<HTMLButtonElement>(null)

  const { 
    data,
    isLoading, 
    isSuccess, 
    error 
  } = useFetch<TreeNode_TP[]>({
    endpoint: 'accounting/api/v1/treeAccounts',
    queryKey: ['view_accounting_tree']
  })

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

export default AccountingTree