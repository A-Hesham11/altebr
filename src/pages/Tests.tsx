import { Form, Formik } from "formik"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { BaseInput } from "../components/atoms"
import { default as NinjaTable } from "../components/molecules/NinjaTable"
import { ColumnTP } from "../components/molecules/table/types"
// import yup
import * as yup from "yup"

type Person = {
  id: number
  name: string
  experience: number
  salary?: number
}

const data: Person[] = [
  {
    id: 1,
    name: "John Doe",
    experience: 10,
  },
  {
    id: 2,
    name: "Mike Tyson",
    experience: 5,
  },
  {
    id: 3,
    name: "Alison 1",
    experience: 2,
  },
  {
    id: 4,
    name: "Alison 2",
    experience: 2,
  },
  {
    id: 5,
    name: "Alison 3",
    experience: 2,
  },
  {
    id: 6,
    name: "Alison 4",
    experience: 2,
  },
]

const ninja2Columns = [
  {
    name: "id",
    label: "ID",
  },
  {
    name: "name",
    label: "Name",
    validate: yup.string().required(),
  },
  {
    name: "experience",
    label: "Experience",
    editComponent: (props) => {
      return <BaseInput {...props} />
    },
    validate: yup.number().required().min(0).max(100),
  },
  {
    name: "salary",
    label: "Salary",
    compute: {
      formula: (row) => {
        return row.experience * 1000
      },
      dependencies: ["experience"],
    },
  },
  {
    name: "doubleSalary",
    label: "Double Salary",
    compute: {
      formula: (row) => {
        return row.salary * 2
      },
      dependencies: ["salary"],
    },
  },
  // {
  //   name: "actions",
  //   label: "Actions",
  //   actions: [
  //     {
  //       label: "Edit",
  //       icon: <AiFillEdit onClick={(row) => {
  //         alert(`Trying to edit row ${row}`)
  //       }} />,
  //     },
  //     {
  //       label: "Delete",
  //       icon: <AiFillDelete className="text-red-700" onClick={(row) => {
  //         alert(`Trying to delete row ${row}`)
  //       }} />,
  //     }
  //   ],
  // },
] as ColumnTP[]


export const Tests = () => {
  const [dataSource, setDataSource] = useState<Person[]>(data)




  return (
    <>
      <Helmet>
        <title>Tests</title>
      </Helmet>
      <Formik
        initialValues={{
          selection: "none",
        }}
        onSubmit={(values) => {
          console.log("old", values)
        }}
      >
        <Form>
          <div className="flex flex-col gap-6 items-center">
            <NinjaTable
              columns={ninja2Columns}
              data={dataSource}
              setData={setDataSource}
              onAddRow={(row) => {
                alert(`Added row: ${JSON.stringify(row)}`)
              }}
              PKey="id"
              expandable
              creatable={true}
              collapseLabel="Collapse"
              expandLabel="Expand"
            />
          </div>

        </Form>
      </Formik>
    </>
  )
}
