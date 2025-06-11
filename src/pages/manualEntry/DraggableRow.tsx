import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "../../components/atoms";
import { DeleteIcon, EditIcon } from "../../components/atoms/icons";
import { BiSortAlt2 } from "react-icons/bi";
import { flexRender } from "@tanstack/react-table";
import { notify } from "../../utils/toast";
import { t } from "i18next";

const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners } = useSortable({
    id: rowId,
  });
  return (
    <button type="button" {...attributes} {...listeners}>
      <BiSortAlt2 size={20} className="text-mainGreen" />
    </button>
  );
};

const DraggableRow = ({
  row,
  dataSource,
  setDataSource,
  values,
  setFieldValue,
}: any) => {
  console.log("🚀 ~ values:", values);
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.item_id,
  });

  const style: any = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };

  const handleDeleteRow = (itemId: number) => {
    dataSource?.findIndex((item: { item_id: number }) => {
      return item.item_id == itemId;
    });

    const newData = dataSource?.filter((item: { item_id: number }) => {
      return item.item_id !== itemId;
    });

    setDataSource(newData);
  };

  const handleEditRow = () => {
    if (
      !!values?.creditor_gram ||
      !!values?.creditor_reyal ||
      !!values?.indebted_gram ||
      !!values?.creditor_reyal
    ) {
      notify(
        "info",
        `${t("The existing modification process must be completed first.")}`
      );
      return;
    }
    setFieldValue("isEdit", true)
    const {
      entry_type,
      branch_id,
      branch_name,
      bond_number,
      date,
      operation_date,
      media,
      description,
      entry_archive,
      isEdit,
      ...restValues
    } = values;
    Object.keys(restValues).map((key) => {
      setFieldValue(key, row?.original[key]);
    });
    handleDeleteRow(row.original.item_id);
  };

  return (
    <tr ref={setNodeRef} style={style} key={row} className="text-center">
      {row.getVisibleCells().map((cell: any) => (
        <td
          className="p-2 bg-[#295E5608] border border-[#C4C4C4]"
          key={cell.id}
          style={{ width: cell.column.getSize() }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
      <td className=" bg-lightGreen border border-[#C4C4C4]">
        <Button action={() => handleEditRow()} className="bg-transparent px-2">
          <EditIcon size={16} className="fill-mainGreen w-6 h-6 mb-[2px]" />
        </Button>
        <Button
          action={() => handleDeleteRow(row.original.item_id)}
          className="bg-transparent px-2"
        >
          <DeleteIcon className="fill-[#C75C5C] w-6 h-6" />
        </Button>
      </td>
      <td className="bg-lightGreen p-0 border border-[#C4C4C4]">
        <RowDragHandleCell rowId={row.original.item_id} />
      </td>
    </tr>
  );
};

export default DraggableRow;
