import { Dispatch } from "redux";
import { getSiteInfoService } from "../../../services/survey/routes.service";

// export type SiteInfoDataRes = {
//     id: number;
//     brand: string;
//     disp_type: string;
//     h_many_3_0: string;
//     h_many_3_1: string;
//     atg_type: string;
//     overfill_type: string;
//     spill_b_brand: string;
//     vent_brand: string;
//     stp_model: string;
//     relay_brand: string;
//     pos_system: string;
//     customer_id: number;
//     created_at: string;
//     updated_at: string;
// };

interface SiteInfoTank {
    created_at: string; // ISO date string
    diameter: string;
    drain: string;
    fu_type: string;
    h_many_g_bucket: string;
    id: number;
    in_denpth: string;
    leak_detector: string;
    material: string;
    overfill_prev: string;
    sb_brand: string;
    site_info_id: number;
    size: string;
    stp_manf: string;
    stp_sumps: string;
    stps_type: string;
    updated_at: string; // ISO date string
    vent_type: string;
    vents_count: string;
    wall_type: string;
}

export interface SiteInfoDataRes {
    atg_brand: string;
    atg_sensors: string;
    created_at: string; // ISO date string
    customer_id: number;
    dis_brand: string;
    dis_model: string;
    dis_sumps: string;
    dis_type: string;
    fu_brand: string;
    h_many_3_0: string;
    h_many_3_1: string;
    h_many_h_flows: string;
    id: number;
    lock: number;
    pos_system: string;
    relay_brand: string;
    site_info_tanks: SiteInfoTank[];
    tanks_count: string;
    truck_stop: string;
    updated_at: string; // ISO date string
}


export const getSiteInfo = async (dispatch: Dispatch, cus_id: number): Promise<SiteInfoDataRes | null> => {
    try {
        const response = await getSiteInfoService(cus_id)

        console.log("getSiteInfo response ::", response);
        if (response.hasError) {
            console.warn('has error::-> getSiteInfoService ::', response.errorMessage,);
            return null
        } else {
            if (response.data) {
                return response.data
            } else {
                return null
            }
        }
    } catch (error) {
        console.warn("err catch getSiteInfo ::", error);
        return null
    }
}