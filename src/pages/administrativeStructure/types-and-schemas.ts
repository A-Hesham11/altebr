import { t } from "i18next"
import * as Yup from "yup"

export type Permission_TP = {
    id: string
    name: string
    routes: string
    permissions: Permission_TP[]
}
export type PermissionGroup_TP = {
    id: string
    name: string
    permissions: Permission_TP[]
}

export const addAdministrativeSchema = () => Yup.object().shape({
    name: Yup.string()
        .trim()
        .required(t('required') || 'هذا الحقل مطلوب'),
})