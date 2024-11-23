import { getUniqueId_Apiqueryparams, postInvoice_from_ServiceCall_ReqBody, postInvoice_from_ServiceCall_ReqPaymentBody, postInvoiceReqBody, postPaymentReqBody } from "../../store/actions/survey/surveyAction";
import { responseHandlerType } from "../api/responseHandler";
import { METHODS, client } from "../api/restClient"
import { GET_AMOUNT, GET_SUBMITED_SURVEY_ANSWERS, GET_SURVEY, POST_ANSW, POST_INVOICE_BY_SERVICE_CALL, POST_PAYMENTINFO, POST_UNIQUEID } from "../urls"

export const getSurveyListService = async () => {
    return await client.API(
        METHODS.GET,
        GET_SURVEY
    ) as responseHandlerType;
}

export const getSubmitedAnswersService = async (list_id: number, cus_id: number) => {
    return await client.API(
        METHODS.GET,
        `${GET_SUBMITED_SURVEY_ANSWERS}?list_id=${list_id}&cus_id=${cus_id}`
    ) as responseHandlerType;
}

export const getUniqueIdService = async ({ unique_id, ro_loc_id, cus_id, list_id }: getUniqueId_Apiqueryparams) => {
    let headerConfig = {
        'content-Type': 'application/json',
    };
    return await client.API(
        METHODS.POST,
        POST_UNIQUEID,
        {
            'unique_id': unique_id,
            "ro_loc_id": ro_loc_id,
            'cus_id': cus_id,
            "list_id": list_id
        },
        headerConfig
    ) as responseHandlerType;
}

export const getAmountService = async (ro_loc_id: number) => {
    return await client.API(
        METHODS.GET,
        `${GET_AMOUNT}?ro_loc_id=${ro_loc_id}`
    ) as responseHandlerType;
}

export const getInvoicesService = async (cus_id: number | null) => {
    return await client.API(
        METHODS.GET,
        `${POST_INVOICE_BY_SERVICE_CALL}?cus_id=${cus_id}`
    ) as responseHandlerType;
}

export const postAnswerService = async (formData: any) => {
    let headerConfig = {
        'content-Type': 'application/json',
    };
    return await client.API(
        METHODS.POST,
        POST_ANSW,
        formData,
        headerConfig
    ) as responseHandlerType;
}

export const postPaymentInfoService = async (formData: postPaymentReqBody | postInvoiceReqBody) => {
    let headerConfig = {
        'content-Type': 'application/json',
    };
    return await client.API(
        METHODS.POST,
        POST_PAYMENTINFO,
        formData,
        headerConfig
    ) as responseHandlerType;
}

export const postInvoiceInfo_From_ServiceCall_Service = async (formData: postInvoice_from_ServiceCall_ReqBody | postInvoice_from_ServiceCall_ReqPaymentBody) => {
    let headerConfig = {
        'content-Type': 'application/json',
    };
    return await client.API(
        METHODS.POST,
        POST_INVOICE_BY_SERVICE_CALL,
        formData,
        headerConfig
    ) as responseHandlerType;
}