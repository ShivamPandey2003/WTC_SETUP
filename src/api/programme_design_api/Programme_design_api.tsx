import { apiRequest } from "@/services/apiService";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useCreateSession = ()=>{
    const {mutate:CreateSession, isPending, error} = useMutation<CreateSessionResponse, AxiosError, CreateSessionRequest>({
        mutationFn: async(data)=>{
            const res = await  apiRequest("post", "session/create", data);
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Session created successfully");
        },
        onError:(err, Variable)=>{
            toast.error(`Error creating session: ${err.message}`);
            console.log(Variable);
        }
    })

    return {CreateSession, isPending, error};
}

export const useGetSessionList = ()=>{
    const {data:SessionList, isPending, error} = useQuery<SessionListResponse, AxiosError>({
        queryKey:["sessionList"],
        queryFn: async()=>{
            const res = await apiRequest("get", "session/list");
            return res;
        },
        select:(data)=>{
            return data;
        }
    })

    return {SessionList, isPending, error};
}

export const useDeleteSession = ()=>{
    const {mutate:DeleteSession, isPending, error} = useMutation<DeleteSessionResponse, AxiosError, {id:string}>({
        mutationFn: async({id})=>{
            const res = await apiRequest("delete", `session/delete/${id}`);
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Session deleted successfully");
        },
        onError:(err, Variable)=>{
            toast.error(`Error deleting session: ${err.message}`);
            console.log(Variable);
        }
    })

    return {DeleteSession, isPending, error};
}