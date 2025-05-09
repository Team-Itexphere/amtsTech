import { InvoiceSubItemWithAmount } from "../../screen/Invoice/SubItems.screen";
import { ServeyStatus, Status } from "../../types";
import { LocationItem } from "../actions/survey/routesAction";
import { ExtendedSurveyItem } from "../actions/survey/surveyAction";

export interface RouteState {
    unique_id: number | null,
    res_Amount: string | null,
    surveyItemArray: ExtendedSurveyItem[],
    invoice: {
        service: string | null;
        comment: string | null;
        // descript: string,
        items: InvoiceSubItemWithAmount[]
    },
    location: {
        ro_loc_id: number | null,
        cus_id: number | null,
        list_id: number | null,
        notes: LocationItem['notes'],
        status: LocationItem['status'],
        cus_name: string | null,
        rec_logs: string | number | null,
        hasInvoice?: boolean | undefined,
        allowInv?: boolean | undefined,
    },
    serviceCall: {
        source: string,
        customer_id: number | null
    }
    cus_id: number | null
}

const initialState: RouteState = {
    unique_id: null,
    res_Amount: null,
    location: {
        ro_loc_id: null,
        cus_id: null,
        list_id: null,
        notes: [],
        status: ServeyStatus.Pending,
        cus_name: null,
        rec_logs: null,
    },
    surveyItemArray: [],
    invoice: {
        // descript: '',
        items: [],
        comment: null,
        service: null
    },
    serviceCall: {
        source: "",
        customer_id: null
    },
    cus_id: null
}

function routeReducer(state = initialState, action: any): RouteState {
    switch (action.type) {
        case "SUBMIT_SURVEY":
            return {
                ...state,
                surveyItemArray: action.payload.surveyItemArray,
                unique_id: action.payload.unique_id
            }
        case "SAVE_AMOUNT":
            return {
                ...state,
                res_Amount: action.payload.amount, // TODO: inside the -> invoice
                // invoice: {
                //     ...state.invoice,
                //     descript: action.payload.descript,
                // }
            }
        case "INVOICE_SUBITEMS":
            return {
                ...state,
                invoice: {
                    ...state.invoice,
                    items: action.payload,
                }
            }
        case "LOCATION_PRESS_DATA":
            return {
                ...state,
                location: {
                    ...state.location,
                    cus_id: action.payload.cus_id,
                    list_id: action.payload.list_id,
                    ro_loc_id: action.payload.ro_loc_id,
                    notes: action.payload.notes,
                    status: action.payload.status,
                    cus_name: action.payload.cus_name,
                    rec_logs: action.payload.rec_logs,
                    hasInvoice: action.payload.hasInvoice,
                    allowInv: action.payload.allowInv,
                }
            }
        case "SAVE_DATA_FROM_SERVICECALL_TO_INVOICE":
            return {
                ...state,
                serviceCall: {
                    ...state.serviceCall,
                    source: action.payload.source,
                    customer_id: action.payload.customer_id,
                }
            }
        case "CLEAR_SERVICE_CALL_DATA":
            console.info("CLEAR all serviceCall reducer ::");
            return {
                ...state,
                serviceCall: initialState.serviceCall
            }
        case "CLEAR_ALL":
            console.info("CLEAR all Route reducer ::");
            return initialState
        default:
            return state;
    }
}

export default routeReducer;