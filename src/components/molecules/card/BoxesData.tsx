import { Header } from "../../atoms/Header"
import { BoxesDataBase } from "../../atoms/card/BoxesDataBase"

type boxesData_TP = {
  header: string
  variant?: "primary" | "secondary"
  className?: string
  boxData: any //change this
}

export const BoxesData = ({ header, variant, boxData }: boxesData_TP) => {

  {boxData?.map((box: any) => {
    console.log("🚀 ~ file: BoxesData.tsx:14 ~ {boxData?.map ~ box:", box)
    
  })}

  return (
    <div className="flex flex-col gap-4 py-4">
      <Header header={header} className={"text-2xl font-bold"} />
      <ul className="grid grid-cols-5 gap-5 ">
        {boxData?.map((box: any) => (
          <>
            <BoxesDataBase data={box} />
          </>
        ))}
      </ul>
    </div>
  )
}
