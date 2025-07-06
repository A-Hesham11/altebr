/////////// IMPORTS
///

import { useFormikContext } from "formik";
import { t } from "i18next";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Permission_TP } from "../../../context/auth-and-perm/auth-permissions-types";
import { PermissionGroup_TP } from "../../../pages/administrativeStructure/types-and-schemas";
import { CheckBoxField } from "../../molecules";

///
/////////// Types
///
type PermissionGroupProps_TP = {
  permissions: Permission_TP[];
  name: string;
  editData?: PermissionGroup_TP | undefined;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const PermissionGroup = ({
  name,
  permissions,
  editData,
}: PermissionGroupProps_TP) => {
  /////////// VARIABLES
  ///
  const memoizedEditData = useMemo(() => editData, []);
  ///
  /////////// CUSTOM HOOKS
  ///
  const { setFieldValue, values } = useFormikContext();
  ///
  /////////// STATES
  ///
  const [flag, setFlag] = useState(false);
  ///
  /////////// SIDE EFFECTS
  ///

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///
  useEffect(() => {
    const groupIds = permissions.map((group) => group.id);
    const checkedBoxes = Object.entries(values)
      .map(([key, value]) => {
        return groupIds.filter((id) => id == key && value == true);
      })
      .flat()
      .filter((item) => item);
    if (groupIds.length !== checkedBoxes.length) setFlag(false);
    else setFlag(true);
  }, []);

  const handleChange = (e: any) => {
    permissions.map((group) => {
      if (name !== "name" && e.target.name === name)
        Object.values(group).map((value, index) => {
          setFieldValue(value, e.target.checked);
        });
    });
  };

  ///
  return (
    <div className="flex flex-col w-full gap-4 border-b-2 border-mainGreen border-opacity-20 pb-5 border-dashed">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center text-lg ml-8">{t(`${name}`)}</h4>
        <div>
          <input
            type="checkbox"
            id={name}
            checked={flag}
            name={name}
            onChange={handleChange}
            className="mx-2 text-mainGreen rounded"
          />
          <label htmlFor={name}>{t("select group")}</label>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {permissions.map(({ id, name }) => (
          <div key={id}>
            <CheckBoxField
              label={name}
              type="checkbox"
              id={id}
              name={id}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                e.target.checked
                  ? setFieldValue(id, true)
                  : setFieldValue(id, false);
              }}
              editData={memoizedEditData}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
