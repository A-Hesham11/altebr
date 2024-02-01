import React, { useMemo } from 'react'
import { numberContext } from '../../../context/settings/number-formatter';
import { t } from 'i18next';
import { Table } from '../reusableComponants/tantable/Table';

const ShiftsDetails = ({ item }: { item?: {} }) => {
    const { formatReyal } = numberContext();
  
    // COLUMNS FOR THE TABLE
    const tableColumn = useMemo<any>(
      () => [
        {
          cell: (info: any) => info.getValue(),
          accessorKey: "shift_name",
          header: () => <span>{t("shift")}</span>,
        },
        {
          cell: (info: any) => info.getValue() || "-",
          accessorKey: "shift_from",
          header: () => <span>{t("shift from")}</span>,
        },
        {
          cell: (info: any) => info.renderValue(),
          accessorKey: "shift_to",
          header: () => <span>{t("shift to")}</span>,
        },
      ],
      []
    );
  
    return (
      <>
        <div className="mt-16">
          <Table data={item?.workingshifts || []} columns={tableColumn}></Table>
        </div>
      </>
    );
  };

export default ShiftsDetails