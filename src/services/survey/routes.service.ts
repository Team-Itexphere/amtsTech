import { postImageCaptureReqBody, queryParam_GetImages } from "../../store/actions/survey/picturesAction"
import { responseHandlerType } from "../api/responseHandler"
import { METHODS, client } from "../api/restClient"
import { GET_ALL_IMAGE_LIST, GET_LOCATIONS, GET_MAINTAINS_LOGS, GET_ROUTES, GET_SITE_INFO, GET_STORE_LICENSE, POST_IMAGE_CAPTURED } from "../urls"

export const getRoutesService = async (date: string) => {
    return await client.API(
        METHODS.GET,
        `${GET_ROUTES}?date=${date}`

    ) as responseHandlerType
}

export const getLocationService = async (id: number) => {
    return await client.API(
        METHODS.GET,
        GET_LOCATIONS + id
    ) as responseHandlerType
}

// Image
export const postImageCaptureService = async (reqBody: postImageCaptureReqBody) => {
    let headerConfig = {
        'content-Type': 'application/json',
    };
    return await client.API(
        METHODS.POST,
        POST_IMAGE_CAPTURED,
        reqBody,
        headerConfig
    ) as responseHandlerType;
}

// Image
export const getAllImageListService = async (queryParam: queryParam_GetImages) => {
    const { type, cus_id } = queryParam
    return await client.API(
        METHODS.GET,
        `${GET_ALL_IMAGE_LIST}?type=${type}&cus_id=${cus_id}`
    ) as responseHandlerType
}

// Store License 
export const getStoreLicenseService = async (cus_id: number) => {
    return await client.API(
        METHODS.GET,
        GET_STORE_LICENSE + cus_id
    ) as responseHandlerType
}

// Site Info
export const getSiteInfoService = async (cus_id: number) => {
    return await client.API(
        METHODS.GET,
        GET_SITE_INFO + cus_id
    ) as responseHandlerType
}

// Maintains Logs
export const getMaintainsLogsService = async (cus_id: number) => {
    return await client.API(
        METHODS.GET,
        `${GET_MAINTAINS_LOGS}?cus_id=${cus_id}`
    ) as responseHandlerType
}
