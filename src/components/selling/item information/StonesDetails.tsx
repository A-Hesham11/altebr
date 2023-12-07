import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { t } from 'i18next';
import { useMemo, useState } from 'react';
import { BiShowAlt } from 'react-icons/bi';
import { Button } from '../../atoms';
import { Selling_TP } from '../selling components/data/SellingTableData';
import AllStonesDetails from './AllStonesDetails';

const StonesDetails = ({ dataSource }) => {

  const [open, setOpen] = useState(false)
  const [showData, setShowData] = useState([]);
  // const [model, setModel] = useState(false)

  const sellingCols = useMemo<ColumnDef<Selling_TP>[]>(
    () => [
      {
        header: () => <span>{t("type")}</span>,
        accessorKey: "stone_id",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("color")} </span>,
        accessorKey: "color_id",
        cell: (info) => info.getValue()  || "---",
      },
      {
        header: () => <span>{t("shape")}</span>,
        accessorKey: "shape_id",
        cell: (info) => info.getValue()  || "---",
      },
      {
        header: () => <span>{t("weight")} </span>,
        accessorKey: "weight",
        cell: (info) => info.getValue()  || "---",
      },
      {
        header: () => <span>{t("number")} </span>,
        accessorKey: "count",
        cell: (info) => info.getValue() || "---",
      },
      {
        header: () => <span>{t("nature")} </span>,
        accessorKey: "nature_id",
        cell: (info) => info.getValue()  || "---",
      },
      {
        header: () => <span>{t("purity")} </span>,
        accessorKey: "purity_id",
        cell: (info) => info.getValue()  || "---",
      },
      {
        header: () => <span>{t("weight")} <p>{t("added")} / {t("not_added")}</p></span>,
        accessorKey: "stone_type",
        cell: (info) => info.getValue()  || "---",
      },
      {
        header: () => <span>{t("operations")}</span>,
        accessorKey: "item_id",
        cell: (info) => {
          return (
            <Button  
              className='bg-transparent'               
              action={() => {
                setShowData([info?.row.original])


                  setOpen((prev) => !prev)
                
                // setModel(true)
              }}
            >
              <BiShowAlt 
                className='fill-mainGreen cursor-pointer'
                size={22}
              />
            </Button>
          )
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: dataSource ? dataSource[0]?.detailsItem[0]?.stonesDetails : [],
    columns: sellingCols,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className={`${dataSource?.length !== 0 && 'overflow-x-scroll lg:overflow-x-visible'}`}>
        {dataSource?.length != 0 
          ? (
            <table className=" w-[990px] lg:w-full bill-shadow">
                <thead className="bg-mainGreen text-white">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="py-4 px-2">
                      {headerGroup.headers.map((header) => (
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
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel()?.rows?.map((row) =>{ 
                    return(
                    <>
                      <tr key={row.id} className="text-center">
                        {row.getVisibleCells().map((cell, i) =>  (
                          <td
                            className="px-2 py-2 bg-lightGreen bg-[#295E5608] gap-x-2 items-center border border-[#C4C4C4]"
                            key={cell.id}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                      {open && showData?.length > 0 && showData[0] === row.original && (
                            <tr>
                                <td colSpan="9">
                                  <AllStonesDetails showData={showData}/>
                                </td>
                            </tr>
                        )
                      
                      }
   

                    </>
                  )})}
                </tbody>
            </table>
          )
          : (
            <p className='text-lg font-medium mt-6 mb-2'>{t("there are no stones in this item")}</p>
          )
        }
        {/* <Modal
            isOpen={open}
            onClose={() => {
              setOpen(false)
            }}
        >
          <AllStonesDetails showData={showData}/>
        </Modal>   */}

      </div>
    
            {/* <FilesUpload  /> */}

            
    </>
  )
}

export default StonesDetails


// const [open, setOpen] = useState(false)
// const [model, setModel] = useState(false)

// const [printContent, setPrintContent] = useState(null);
// const handlePrintClick = async () => {
//   setOpen(true); 
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   const contentToPrint = document.getElementsByName('content-to-print');
//   setPrintContent(contentToPrint.innerHTML);
//   await window.print();
//   setOpen(false);
// };

{/* <div>
<div >
  <button   
      type='button'
      onClick={() => {
        setOpen((prev) => !prev)
        setModel(true)
      }} 
        className='bg-[#295E5633] w-9 h-9 flex items-center justify-center rounded-lg'>
        <IoMdAdd className="fill-mainGreen w-5 h-5"                    
      />
  </button>
  {model && (
    <Modal
      isOpen={open}
      onClose={() => {
        setOpen(false)
      }}
    >
      <div className='print-section'>
        <table className="mt-8 w-[815px] lg:w-full">
          <thead className="bg-mainGreen text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="py-4 px-2">
                {headerGroup.headers.map((header) => (
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
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
              <tr className="text-center">
                <td className="!bg-[#C75C5C33] border border-[#C4C4C4]">زمردى </td>
                <td className="!bg-[#C75C5C33] border border-[#C4C4C4]">زمردى </td>
                <td className="!bg-[#C75C5C33] border border-[#C4C4C4]">زمردى </td>
                <td className="!bg-[#C75C5C33] border border-[#C4C4C4]">زمردى </td>
                <td className="!bg-[#C75C5C33] border border-[#C4C4C4]">زمردى </td>
                <td className="!bg-[#C75C5C33] border border-[#C4C4C4]">زمردى </td>
                <td className="!bg-[#C75C5C33] border border-[#C4C4C4]">زمردى </td>
                <td className="!bg-[#C75C5C33] border border-[#C4C4C4]">زمردى </td>
                <td className="!bg-[#C75C5C33] border border-[#C4C4C4]">زمردى </td>


              </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  )}
</div>
<Button 
  className="bg-lightWhite text-mainGreen px-7 py-[6px] border-2 border-mainGreen" 
  onClick={handlePrintClick}>
      {t("print")}
</Button>
</div> */}