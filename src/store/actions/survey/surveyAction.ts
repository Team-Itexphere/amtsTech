import { Dispatch } from "redux";
import { getAmountService, getInvoicesService, getSubmitedAnswersService, getSurveyListService, getSurveysService, getUniqueIdService, postAnswerService, postInvoiceInfo_From_ServiceCall_Service, postPaymentInfoService } from "../../../services/survey/survey.service";
import { Status } from "./routesAction";
import { InvoiceSubItemWithAmount } from "../../../screen/Invoice/SubItems.screen";
import { save_Amount } from "./invoiceAction";

export interface SurveyItem {
    id: number;
    question: string;
}
export interface ExtendedSurveyItem extends SurveyItem {
    answ: 1 | 2 | 3 | null | '',
    description: string,
    image: { hasImg: boolean, imguri: string | undefined },
    gen_comment: string
}

export interface UniqueIdVal {
    // unique_id: number;
    cus_id: number;
    tech_id: number;
    updated_at: string; // ISO 8601 date string
    created_at: string; // ISO 8601 date string
    id: number;
    ro_loc_id: number
    status: Status
    type: any
}

interface ApiError {
    message: string;
    code?: number;
}

export type getUniqueId_Apiqueryparams = { unique_id: number, ro_loc_id: number, cus_id: number, list_id: number }

export enum Answer {
    Yes = "Yes",
    No = "No",
    NA = "N/A",
    NULL = "",
}
export type postAnswer_ApiBody = {
    unique_id: number,
    ques_id: number,
    answer: Answer,
    desc: string,
    file: string,
    gen_comment: string | null
}

export interface postAnswer_res {
    answer: Answer;
    created_at: string;
    desc: string;
    file?: string;
    gen_comment: string | null;
    id: number;
    ques_id: number;
    testing_id: number;
    unique_id: number;
    updated_at: string;
    success: boolean;
}

export interface postPaymentReqBody {
    pay_opt: 'Cash' | 'Check' | 'MO';
    check_no: string | null;
    mo_no: string | null;
    // descript: string
    amount: number;
    items: InvoiceSubItemWithAmount[];
    list_id: number;
    cus_id: number;
    addi_comments: string | null;
    service: string | null;
    id: number | null;
    inv_id: number | null;
}

export type postInvoiceReqBody = Omit<postPaymentReqBody, 'pay_opt' | 'check_no' | 'mo_no'>;
export type postInvoice_from_ServiceCall_ReqBody = Omit<postPaymentReqBody, 'pay_opt' | 'check_no' | 'mo_no' | 'list_id' | 'cus_id' | 'amount'> & {
    customer_id: number
}
export type postInvoice_from_ServiceCall_ReqPaymentBody = Omit<postPaymentReqBody, 'list_id' | 'cus_id' | 'amount' | 'addi_comments' | 'service'> & {
    customer_id: number,
    signature: string | null
}


type TestResultType = {
    id: number;
    testing_id: number;
    ques_id: number;
    answer: Answer | null;
    desc: string | null;
    file: string | null;
    gen_comment: string | null;
    created_at: string;
    updated_at: string;
};

interface getSubmitedSurveyResult {
    extendedSurveyItem: ExtendedSurveyItem[];
    uniqueID: number;
    gen_comment: string | null
}


interface postPaymentInfo_res { 
    id: number;
    invoice_link: string;
}

export const getSurvey = async (dispatch: Dispatch): Promise<ExtendedSurveyItem[]> => {
    try {
        const response = await getSurveyListService();
        if (response.hasError) {
            console.warn(
                'has error::-> getSurveyListService ::',
                response.errorMessage,
            );
            return []
        } else {
            const res: ExtendedSurveyItem[] = response.data.map((item: SurveyItem) => ({
                ...item,
                // answ: 2,
                answ: '',
                description: '',
                image: { hasImg: false, imguri: '' },
                gen_comment: '',
            }));

            return res;
        }
    } catch (error) {
        console.warn('catch error getSurvey ::', error);
        return []
    }
}

export const getSubmitedSurvey = async (dispatch: Dispatch, list_id: number, cus_id: number): Promise<getSubmitedSurveyResult | null> => {
    try {
        const [surveyItems, apiAnswers] = await Promise.all([
            getSurveyListService(),
            getSubmitedAnswers(list_id, cus_id)
        ])

        if (surveyItems.hasError || apiAnswers.length === 0) {
            console.warn(" err getSurveyListService or getSubmitedAnswers");
            return null
        }

        const extendedSurveyResults: ExtendedSurveyItem[] = surveyItems.data.map((survey: SurveyItem) => {
            const answer = apiAnswers.find((ans: TestResultType) => ans.ques_id === survey.id)
            if (answer) {
                return {
                    ...survey,
                    answ: answer.answer === "Yes" ? 1 : answer.answer === "No" ? 2 : 3,
                    description: answer.desc || "",
                    image: {
                        hasImg: !!answer.file,
                        imguri: answer.file || undefined,
                    },
                    gen_comment: answer.ques_id ===  18 ? apiAnswers[17].gen_comment : ""
                } as ExtendedSurveyItem


            } else {
                console.warn("err getSubmitedSurvey -> case where there is no corresponding answer");
                return null
            }
        })

        // Check for any null values in the extended survey results
        if (extendedSurveyResults.some((item) => item === null)) {
            console.warn("Error: Null values found in extendedSurveyResults");
            return null;
        }

        return {
            extendedSurveyItem: extendedSurveyResults,
            uniqueID: apiAnswers[0].testing_id,
            gen_comment: apiAnswers[17]?.gen_comment
        };

    } catch (error) {
        console.warn('catch error getSubmitedSurvey ::', error);
        return null
    }
}

export const getSubmitedAnswers = async (list_id: number, cus_id: number): Promise<TestResultType[]> => {
    try {
        const response = await getSubmitedAnswersService(list_id, cus_id)

        if (response.hasError) {
            console.warn(
                'has error::-> getSubmitedAnswers ::',
                response.errorMessage,
            );
            return []
        } else {
            return response.data
        }
    } catch (error) {
        console.warn('catch error getSubmitedAnswersService ::', error);
        return []
    }
}

export const getUniqueId = async (dispatch: Dispatch, queryparams: getUniqueId_Apiqueryparams): Promise<UniqueIdVal | null> => {
    try {
        const response = await getUniqueIdService({
            unique_id: queryparams.unique_id,
            ro_loc_id: queryparams.ro_loc_id,
            cus_id: queryparams.cus_id,
            list_id: queryparams.list_id
        })
        if (response.hasError) {
            console.warn(
                'has error::-> getUniqueIdService ::',
                response.errorMessage,
            );
            return null;
        } else {
            return response.data
        }

    } catch (error) {
        console.warn('catch error getUniqueId ::', error);
        return null
    }
}

export const getAmount = async (dispatch: Dispatch, ro_loc_id: number): Promise<string | null> => {
    try {
        const response = await getAmountService(ro_loc_id);
        if (response.hasError) {
            console.warn(
                'has error::-> getAmountService ::',
                response.errorMessage,
            );
            return null
        } else {
            dispatch(save_Amount(response.data.amount));
            return response.data.amount
        }
    } catch (error) {
        console.warn('catch error getAmount ::', error);
        return null
    }
}

export const getInvoices = async (dispatch: Dispatch, cus_id: number | null): Promise<any[] | null> => {
    try {
        const response = await getInvoicesService(cus_id);
        if (response.hasError) {
            console.warn(
                'has error::-> getInvoicesService ::',
                response.errorMessage,
            );
            return null
        } else {
            return response.data
        }
    } catch (error) {
        console.warn('catch error getInvoices ::', error);
        return null
    }
}

export const getSurveys = async (dispatch: Dispatch, cus_id: number | null): Promise<any[] | null> => {
    try {
        const response = await getSurveysService(cus_id);
        if (response.hasError) {
            console.warn(
                'has error::-> getInvoicesService ::',
                response.errorMessage,
            );
            return null
        } else {
            return response.data
        }
    } catch (error) {
        console.warn('catch error getInvoices ::', error);
        return null
    }
}

export const postAnswer = async (dispatch: Dispatch, formData: postAnswer_ApiBody): Promise<postAnswer_res> => {
    try {
        const response = await postAnswerService(formData)
        console.log("postAnswer response ::", response);
        if (response.hasError) {
            console.warn(
                'has error::-> postAnswerService ::',
                response.errorMessage,
            );
            throw new Error(response.errorMessage);
        } else {
            return response.data
        }

    } catch (error) {
        console.warn('catch error postAnswer ::', error);
        throw error;
    }
}

export const postPaymentInfo = async (dispatch: Dispatch, formData: postPaymentReqBody): Promise<postPaymentInfo_res | null> => {
    try {
        const response = await postPaymentInfoService(formData)
        // console.log("postPaymentInfo res::", response);
        if (response.hasError) {
            console.warn(
                'has error::-> postPaymentInfoService ::',
                response.errorMessage,
            );
            return null;
        } else {
            return response.data
        }
    } catch (error) {
        console.warn('catch error postPaymentInfo ::', error);
        return null
    }
}

export const postInvoiceInfo = async (dispatch: Dispatch, formData: postInvoiceReqBody): Promise<postPaymentInfo_res | null> => {
    try {
        const response = await postPaymentInfoService(formData)
        console.log("postPaymentInfo res::", response);
        if (response.hasError) {
            console.warn(
                'has error::-> postPaymentInfoService ::',
                response.errorMessage,
            );
            return null;
        } else {
            return response.data
        }
    } catch (error) {
        console.warn('catch error postPaymentInfo ::', error);
        return null
    }
}

export const postInvoiceInfo_From_ServiceCall = async (dispatch: Dispatch, formData: postInvoice_from_ServiceCall_ReqBody | postInvoice_from_ServiceCall_ReqPaymentBody): Promise<postPaymentInfo_res | null> => {
    try {
        const response = await postInvoiceInfo_From_ServiceCall_Service(formData)
        // console.log("postInvoiceInfo_From_ServiceCall res::", response);
        if (response.hasError) {
            console.warn(
                'has error::-> postInvoiceInfo_From_ServiceCall_Service ::',
                response.errorMessage,
            );
            return null;
        } else {
            return response.data
        }
    } catch (error) {
        console.warn('catch error postInvoiceInfo_From_ServiceCall ::', error);
        return null
    }
}

export const submitAllSurvey_With_Res = (
    surveyItemArray: ExtendedSurveyItem[],
    unique_id: number
) => ({
    type: 'SUBMIT_SURVEY',
    payload: {
        surveyItemArray,
        unique_id
    },
});

