import { Dispatch } from "redux";
import { getStoreLicenseService } from "../../../services/survey/routes.service";
export interface LicenseData {
    id: number;
    name: string;
    type: string;
    expire_date: string;
    agency: string;
}

interface LicenseAPIres {
    id: number;
    name: string;
    type: string;
    expire_date: string;
    agency: string;
    doc_path: string | null;
    customer_id: number;
    created_at: string;
    updated_at: string;
    remind_date: string;
}


export const getStoreLicense = async (dispatch: Dispatch, cus_id: number): Promise<LicenseData[]> => {
    try {
        const response = await getStoreLicenseService(cus_id)
        console.log("getStoreLicense response ::", response);
        if (response.hasError) {
            console.warn('has error::-> getStoreLicense ::', response.errorMessage,);
            return []
        } else {
            if (response.data.length > 0) {
                return response.data.map((item: LicenseAPIres) => ({
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    expire_date: item.expire_date,
                    agency: item.agency,
                }));
            } else {
                return []
            }
        }
    } catch (error) {
        console.warn("catch error getStoreLicenseService ::", error);
        return []
    }
}
