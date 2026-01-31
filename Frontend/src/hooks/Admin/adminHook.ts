import { useMutation } from "@tanstack/react-query"
import { adminLogin } from "../../Service/admin/adminService"

export const useAdminLogin =()=>{
    return useMutation({
        mutationFn:adminLogin
    })
}