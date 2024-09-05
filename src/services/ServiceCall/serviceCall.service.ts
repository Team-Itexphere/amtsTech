import { responseHandlerType } from "../api/responseHandler"
import { client, METHODS } from "../api/restClient"
import { GET_SERVICE_CALL, POST_SERVICE_CALL_HISTORY, POST_SERVICE_CALL_UPDATE } from "../urls"

export const getServiceCallListService = async () => {
    return await client.API(
        METHODS.GET,
        GET_SERVICE_CALL
    ) as responseHandlerType
}

export const postServiceCall_UpdateService = async (formData: any) => {
    let headerConfig = {
        'content-Type': 'application/json',
    };
    return await client.API(
        METHODS.POST,
        POST_SERVICE_CALL_UPDATE,
        formData,
        headerConfig
    ) as responseHandlerType;
}

export const getServiceCall_HistoryListService = async (work_order_id: number) => {
    return await client.API(
        METHODS.GET,
        `${POST_SERVICE_CALL_HISTORY}?id=${work_order_id}`
    ) as responseHandlerType
}
