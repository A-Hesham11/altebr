import { useContext } from 'react';
import { permissionCtx } from '../context/auth-and-perm/permissions';
import { permissionsRule_TP } from '../types';

const usePermission = (permissions: string[], rule?: permissionsRule_TP) => {

    const { isAllowedTo } = useContext(permissionCtx);
    return isAllowedTo(permissions, rule);
    
}

export default usePermission;