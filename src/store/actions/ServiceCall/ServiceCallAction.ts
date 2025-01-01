import { Dispatch } from "redux";
import { Status } from "../../../types";
import { getServiceCall_HistoryListService, getServiceCallListService, postServiceCall_UpdateService } from "../../../services/ServiceCall/serviceCall.service";
import { FormDataType } from "../../../screen/ServiceCall/ServiceCall_View.screen";

export type ServiceCallListType = {
    id: number;
    wo_number: string;
    customer_id: number;
    status: Status;
    tech_id: number;
    fleet_id: number;
    date: string | null;
    start_date: string | null;
    comp_date: string | null;
    time: string | null;
    comp_time: string | null;
    priority: "High" | "Low";
    comment: string;
    created_at: string;
    updated_at: string;
    store_address: string | null;
    store_name: string;
    ro_loc_id: number | null;
};

export type ExtendedFormDataType = Omit<FormDataType, 'images'> & {
    id: number;
    status: Status | null;
    images: string[];
};

export type postServiceCall_Update_res = Omit<ServiceCallListType, 'store_address' | 'store_name'>;


export type ServiceCall_HistoryType = {
    comment: string | null;
    comp_date: string;
    created_at: string;
    id: number;
    images: string[];
    start_date: string;
    tech_id: number;
    tech_name: string;
    updated_at: string;
    wo_id: number;
    cus_name: string;
    cus_fac_id: string;
    str_address: string;
};

export const getServiceCallList = async (dispatch: Dispatch): Promise<ServiceCallListType[]> => {
    try {
        const response = await getServiceCallListService()
        console.log("response getServiceCallList ::", response);
        if (response.hasError) {
            console.warn('has error::-> getLocationService ::', response.errorMessage,);
            return []
        } else {
            if (response.data.length > 0) {
                return response.data
            } else {
                return []
            }
        }
    } catch (error) {
        console.warn("catch error getServiceCallList ::", error);
        return []
    }
}

export const postServiceCall_Update = async (dispatch: Dispatch, formData: ExtendedFormDataType): Promise<postServiceCall_Update_res | null> => {
    try {

        const response = await postServiceCall_UpdateService(formData)
        console.log("postServiceCall_Update response", formData, response);
        if (response.hasError) {
            console.warn(
                'has error::-> postAnswerService ::',
                response.errorMessage,
            );
            return null;
        } else {
            return response.data
        }

    } catch (error) {
        console.warn('catch error postAnswer ::', error);
        return null
    }
}

export const getServiceCall_HistoryList = async (dispatch: Dispatch, work_order_id: number): Promise<ServiceCall_HistoryType[]> => {
    try {
        const response = await getServiceCall_HistoryListService(work_order_id)
        console.log("response ServiceCall history ::", response);
        if (response.hasError) {
            console.warn('has error::-> getServiceCall_HistoryListService ::', response.errorMessage,);
            return []
        } else {
            if (response.data.length > 0) {
                return response.data
            } else {
                return []
            }
        }
    } catch (error) {
        console.warn("catch error getServiceCall_HistoryList ::", error);
        return []
    }
}