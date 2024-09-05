import { Dispatch } from "redux";
import { getMaintainsLogsService } from "../../../services/survey/routes.service";

export type MaintainsLogs = {
    id: number;
    invoice_id: number;
    cus_id: number;
    category: string;
    descript: string;
    qty: number;
    rate: number | null;
    amount: string;
    date: string;
    location: string;
    company: string;
    tech_id: number;
    created_at: string;
    updated_at: string;
    tech_name: string;
};

export const getMaintainsLogs = async (dispatch: Dispatch, cus_id: number): Promise<MaintainsLogs[]> => {
    try {
        const response = await getMaintainsLogsService(cus_id)
        // console.log("response getMaintainsLogs ::", response);

        if (response.hasError) {
            console.warn('has error::-> getMaintainsLogsService ::', response.errorMessage,);
            return []
        } else {
            if (response.data.length > 0) {
                return response.data
            } else {
                return []
            }
        }
    } catch (error) {
        console.warn("catch error getMaintainsLogs ::", error);
        return []
    }
}