import { apiRequest } from "@/services/apiService";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useCreateSpeaker = ()=>{
    const {mutate:CreateSpeaker, isPending, error} = useMutation<CreateSpeakerResponse, AxiosError, CreateSpeakerRequest>({
        mutationFn: async(data)=>{
            const res = await  apiRequest("post", "speaker/create", data);
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Speaker created successfully");
        },
        onError:(err, Variable)=>{
            toast.error(`Error creating speaker: ${err.message}`);
            console.log(Variable);
        }
    })

    return {CreateSpeaker, isPending, error};
}

export const useEditSpeaker = ()=>{
    const {mutate:EditSpeaker, isPending, error} = useMutation<CreateSpeakerResponse, AxiosError, CreateSpeakerRequest & {id:string}>({
        mutationFn: async(data)=>{
            const {id, ...rest} = data;
            const res = await  apiRequest("post", `speaker/edit/${id}`, rest);
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Speaker edited successfully");
        },
        onError:(err, Variable)=>{
            toast.error(`Error editing speaker: ${err.message}`);
            console.log(Variable);
        }
    })

    return {EditSpeaker, isPending, error};
}

export const useGetSpeakerList = ()=>{
    const {data:SpeakerList, isPending, error} = useQuery<SpeakerListResponse, AxiosError>({
        queryKey:["speakerList"],
        queryFn: async()=>{
            const res = await apiRequest("get", "speaker/list");
            return res;
        },
        select:(data)=>{
            return data;
        }
    })

    return {SpeakerList, isPending, error};
}

export const useDeleteSpeaker = ()=>{
    const {mutate:DeleteSpeaker, isPending, error} = useMutation<DeleteSpeakerResponse, AxiosError, {id:string}>({
        mutationFn: async({id})=>{
            const res = await apiRequest("delete", `speaker/delete/${id}`);
            return res.data;
        },
        onSuccess:()=>{
            toast.success("Speaker deleted successfully");
        },
        onError:(err, Variable)=>{
            toast.error(`Error deleting speaker: ${err.message}`);
            console.log(Variable);
        }
    })

    return {DeleteSpeaker, isPending, error};
}