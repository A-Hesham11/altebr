import { useQueryClient } from "@tanstack/react-query"

export const useGetQueryData = <T>(key: [string] | [string, string] | [string, number]) => {
    return useQueryClient().getQueryData<T>(key)
}