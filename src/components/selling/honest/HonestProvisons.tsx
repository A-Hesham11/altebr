/////////// IMPORTS
///
import { useQueryClient } from "@tanstack/react-query"
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Field, Form, useFormikContext } from "formik"
import { t } from "i18next"
import { useState } from "react"
import { AiOutlinePlus } from "react-icons/ai"
import { notify } from "../../../utils/toast"
import { DeleteIcon, EditIcon } from "../../atoms/icons"
import { BaseInputField, Select } from "../../molecules"
import { FilesUpload } from "../../molecules/files/FileUpload"
import { FilesPreview } from "../../molecules/files/FilesPreview"
import { FilesPreviewOutFormik } from "../../molecules/files/FilesPreviewOutFormik"
import SelectCategory from "../../templates/reusableComponants/categories/select/SelectCategory"
import SelectKarat from "../../templates/reusableComponants/karats/select/SelectKarat"

/////////// types
///
type InitialTableData_TP = {
    category_id: JSX.Element | string
    weight: JSX.Element | string
    karat_id: JSX.Element | string
    notes: JSX.Element | string
    media: JSX.Element | string
}
type HonestProvisonsProps_TP = {
    data: any
    setData: any
}
///
export const HonestProvisons = ({ data, setData }: HonestProvisonsProps_TP) => {
    /////////// STATES
    ///
    const [files, setFiles] = useState<any>([])
    const [editRow, setEditRow] = useState(false)
    const [editData, setEditData] = useState({})
    const [selectCategoryValue, setSelectCategoryValue] = useState(null)
    const [selectkaratValue, setSelectKaratValue] = useState(null)
    /////////// FUNCTIONS | EVENTS | IF CASES
    ///
    // functions
    function deleteRowHandler(id: string) {
        setData((prev) => prev.filter((row) => row.id !== id))

    }

    function editRowHandler(row) {
        setEditData(row)
    }
    ///
    ///
    /////////// VARIABLES
    ///
    const columnHelper = createColumnHelper<any>()
    const columns: any = [
        columnHelper.accessor("category_value", {
            header: () => `${t("categories")}`,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("weight", {
            header: () => `${t("weight")}`,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("karat_value", {
            header: () => `${t("karat")}`,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("cost", {
            header: () => `${t("approximate cost")}`,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("notes", {
            header: () => `${t("notes")}`,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("attachments", {
            header: () => `${t("attachments")}`,
            cell: (info) => {
                const media = info?.row?.original?.media.map(file => ({ id: info.row.id, path: URL.createObjectURL(file), preview: URL.createObjectURL(file) }))
                return (
                    < FilesPreviewOutFormik
                        images={media || []}
                        preview
                        pdfs={[]}
                    />
                )
            },
        }),
        columnHelper.accessor("actions", {
            header: `${t("actions")}`,
        }),
    ]
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
    const { values, setFieldValue } = useFormikContext<any>()
    ///
    /////////// CUSTOM HOOKS
    ///
    const queryClient = useQueryClient()
    const categories = queryClient.getQueryData(['categories_all'])?.filter(category => category.type !== 'multi')?.map(category => ({
        id: category.id,
        value: category.name,
        label: category.name
    }))
    const karatOptions = queryClient.getQueryData(['karats'])?.map(karat => ({
        id: karat.id,
        value: karat.name,
        label: karat.name
    }))
    ///
    /////////// SIDE EFFECTS
    ///


    return <>

        <div className="mb-6 overflow-x-scroll lg:overflow-x-visible w-full">
            <Form>
                <table className=" mt-8 w-[840px] lg:w-full">
                    <thead className="bg-mainGreen text-white">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="py-4 px-2 ">
                                {headerGroup.headers.map((header, i) => {
                                    if (i === 1 || i === 3) {
                                        return (
                                            <th
                                                key={header.id}
                                                className="p-4 text-sm font-medium text-white border"
                                            // style={{ minWidth: '180px' }}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </th>
                                        )
                                    } else {
                                        return (
                                            <th
                                                key={header.id}
                                                className="p-4 text-sm font-medium text-white border"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </th>
                                        )
                                    }
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-lightGray">
                        {editRow ? (
                            <tr>
                                <td className="border-l-2 border-l-flatWhite w-[15%]">
                                    <Select
                                        options={categories}
                                        id="category"
                                        noMb={true}
                                        placement="top"
                                        name="category_id"
                                        placeholder={`${t("categories")}`}
                                        value={{
                                            value: values.category_value || editData.category_value,
                                            label:
                                                values.category_value ||
                                                editData.category_value ||
                                                t("categories"),
                                            id: values.category_id || values.category_id,
                                        }}
                                        onChange={(option: any) => {
                                            setFieldValue("category_id", option!.id)
                                            setFieldValue("category_value", option!.value)
                                        }}
                                    />
                                </td>
                                <td>
                                    <Field
                                        id="weight"
                                        name="weight"
                                        type="number"
                                        value={values.weight || editData.weight}
                                        onChange={(e: any) => {
                                            setFieldValue("weight", e.target.value)
                                        }}
                                        className="rounded-md border-2 border-transparent focus:!border-2 focus:!border-mainGreen form-input px-4 py-[.30rem] w-full shadows"
                                    />
                                </td>
                                <td className="w-[15%]">
                                    <Select
                                        options={karatOptions}
                                        id="karat"
                                        name="karat_id"
                                        noMb={true}
                                        placement="top"
                                        placeholder={`${t("karats")}`}
                                        value={{
                                            value: values.karat_value || editData.karat_value,
                                            label:
                                                values.karat_value ||
                                                editData.karat_value ||
                                                t("karats"),
                                            id: values.karat_id || values.karat_id,
                                        }}
                                        onChange={(option: any) => {
                                            setFieldValue("karat_id", option!.id)
                                            setFieldValue("karat_value", option!.value)
                                        }}
                                    />
                                </td>
                                <td className="border-l-2 border-l-flatWhite">
                                    <Field
                                        id="cost"
                                        name="cost"
                                        type="text"
                                        value={values.cost || editData.cost}
                                        onChange={(e: any) => {
                                            setFieldValue("cost", e.target.value)
                                        }}
                                        className="rounded-md border-2 border-transparent focus:!border-2 focus:!border-mainGreen form-input px-4 py-[.30rem] w-full shadows"
                                    />
                                </td>
                                <td>
                                    <Field
                                        id="notes"
                                        name="notes"
                                        type="text"
                                        value={values.notes || editData.notes}
                                        onChange={(e: any) => {
                                            setFieldValue("notes", e.target.value)
                                        }}
                                        className="rounded-md border-2 border-transparent focus:!border-2 focus:!border-mainGreen form-input px-4 py-[.30rem] w-full shadows"
                                    />
                                </td>
                                <td className="border-l-2 border-l-flatWhite">
                                    <FilesPreview images={editData.media} preview pdfs={[]} />
                                </td>
                                <td>
                                    <div className="flex items-center justify-center">
                                        <button
                                            type="submit"
                                            className="relative active:top-[1px] py-2 px-2 font-bold rounded-md border-mainGreen border-2"
                                            onClick={() => {

                                                const index = data.findIndex(
                                                    (item) => item.id === editData.id
                                                )
                                                const updatedData = [...data]
                                                updatedData[index] = {
                                                    ...editData,
                                                    weight: values.weight || editData.weight,
                                                    karat_value:
                                                        values.karat_value || editData.karat_value,
                                                    category_value:
                                                        values.category_value || editData.category_value,
                                                    notes: values.notes || editData.notes,
                                                    cost: values.cost || editData.cost,
                                                }
                                                setData(updatedData)
                                                setEditRow(false)
                                                setFieldValue('category_id', '')
                                                setFieldValue('karat_id', '')
                                                setFieldValue('category_value', '')
                                                setFieldValue('karat_value', '')
                                                setFieldValue('weight', '')
                                                setFieldValue('notes', '')
                                                setFieldValue('cost', '')
                                            }}
                                        >
                                            {t("edit")}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            <tr>
                                <td className="border-l-2 border-l-flatWhite py-[6px] w-[15%]">
                                    <SelectCategory
                                        name="category_id"
                                        onChange={(option) => {
                                            setFieldValue("category_value", option!.value)
                                            setSelectCategoryValue({
                                                id: option!.id,
                                                value: option!.value,
                                                label: option!.label,
                                            })
                                        }}
                                        noMb={true}
                                        placement="top"
                                        showItems={true}
                                        value={selectCategoryValue}
                                    />
                                </td>
                                <td className="border-l-2 border-l-flatWhite">
                                    <BaseInputField id="weight" name="weight" type="number" noMb={true} />
                                </td>
                                <td className="border-l-2 border-l-flatWhite w-[15%]">
                                    <SelectKarat
                                        field="id"
                                        name="karat_id"
                                        noMb={true}
                                        placement="top"
                                        onChange={(option) => {
                                            setFieldValue("karat_value", option!.value)
                                            setSelectKaratValue({
                                                id: option!.id,
                                                value: option!.value,
                                                label: option!.label,
                                            })
                                        }}
                                        value={selectkaratValue}
                                    />
                                </td>
                                <td className="border-l-2 border-l-flatWhite">
                                    <BaseInputField id="cost" name="cost" type="number" noMb={true} />
                                </td>
                                <td className="border-l-2 border-l-flatWhite">
                                    <BaseInputField id="notes" name="notes" type="text" noMb={true} />
                                </td>
                                <td className="border-l-2 border-l-flatWhite">
                                    <FilesUpload files={files} setFiles={setFiles} />
                                </td>
                                <td>
                                    {!editRow && (
                                        <div className="flex items-center justify-center">
                                            <DeleteIcon action={() => {
                                                setFieldValue('category_id', '')
                                                setFieldValue('karat_id', '')
                                                setFieldValue('category_value', '')
                                                setFieldValue('karat_value', '')
                                                setFieldValue('weight', '')
                                                setFieldValue('notes', '')
                                                setFieldValue('cost', '')
                                                setSelectCategoryValue({ label: t('select category') })
                                                setSelectKaratValue({ label: t('select karat') })
                                                setFiles([])
                                            }} />
                                            <AiOutlinePlus
                                                type="button"
                                                className="cursor-pointer text-lg font-bold rounded-md  w-[28px] h-[28px] active:shadow-none active:w-[28px]"
                                                onClick={() => {
                                                    if (!values.category_id || !values.karat_id || !values.weight || !values.cost) {
                                                        notify('info', `${t('complete item data')}`)
                                                    } else {
                                                        const finalValues = {
                                                            ...values,
                                                            media: files,
                                                            id: crypto.randomUUID()
                                                        }
                                                        setData(prev => [...prev, finalValues])
                                                        setFiles([])
                                                        setSelectCategoryValue({ label: t('select category') })
                                                        setSelectKaratValue({ label: t('select karat') })
                                                    }
                                                    setFieldValue('category_id', '')
                                                    setFieldValue('karat_id', '')
                                                    setFieldValue('category_value', '')
                                                    setFieldValue('karat_value', '')
                                                    setFieldValue('weight', '')
                                                    setFieldValue('notes', '')
                                                    setFieldValue('cost', '')
                                                }}
                                            />
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot className="">
                        {table.getRowModel().rows.map((row) => {
                            return (
                                <tr
                                    key={row.id}
                                    className={`${editRow
                                        ? "hidden cursor-not-allowed pointer-events-none"
                                        : "border-b-flatWhite border-b text-center table-shadow last:shadow-0"
                                        }`}
                                >
                                    {row.getVisibleCells().map((cell, i) => {
                                        return ((i + 1) !== row.getVisibleCells().length) ? (
                                            <td
                                                key={cell.id}
                                                className="border-l-2 px-6 whitespace-nowrap border-l-flatWhite text-center bg-lightGray"
                                                style={{
                                                    minWidth: "max-content",
                                                }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ) : (
                                            <td className="border-l-2 px-6 whitespace-nowrap border-l-flatWhite text-center bg-lightGray">
                                                <div className="flex items-center justify-center gap-2">
                                                    {!editRow && (
                                                        <>
                                                            <DeleteIcon
                                                                action={() => {
                                                                    deleteRowHandler(row.original.id)
                                                                }
                                                                }
                                                            />
                                                            <EditIcon
                                                                action={() => {
                                                                    setEditRow(true)
                                                                    editRowHandler(row.original)
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tfoot>
                </table>
            </Form>
        </div>
    </>
}