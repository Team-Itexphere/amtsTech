import { Dispatch } from "redux";
import { getLocationService, getRoutesService } from "../../../services/survey/routes.service";

// type Location = {
//     cus_id: string;
//     amount: string;
// };

// export interface RouteItem {
//     amount: string
//     cus_fac_id: string
//     cus_id: string
//     cus_name: string
//     status: 'pending' | 'completed'
// }

// export interface RouteItem {
//     amount: string;
//     created_at: string;
//     cus_fac_id: string;
//     cus_id: number;
//     cus_name: string;
//     id: number;
//     route_id: number;
//     updated_at: string;
//     status: 'pending' | 'completed'
// }

export enum Status {
    Pending = 'Pending',
    Completed = 'Completed'
}

interface Route {
    id: number;
    num: string;
    name: string;
    insp_type: string;
    deleted: string | null;
    created_at: string;
    updated_at: string;
}

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    fleet_id: string | null;
    com_name: string | null;
    own_name: string | null;
    str_addr: string;
    str_phone: string;
    cp_name: string;
    cp_phone: string | null;
    own_email: string;
    email_list: string | null;
    fac_id: string;
    com_to_inv: string;
    role: number;
    login: string;
    deleted: string | null;
}

export interface RouteItem {
    initiated: boolean;
    id: number;
    route_id: number;
    tech_id: number;
    insp_type: string | null;
    start_date: string;
    comp_date: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    no: string;
    name: string;
    str_count: number;
    route: Route;
}

export type NoteType = {
    id: number;
    tech_id: number;
    cus_id: number;
    list_id: number;
    note: string;
    created_at: string;
    updated_at: string;
};

export interface LocationItem {
    route_no: string;
    id: number;
    route_id: number;
    cus_id: number;
    amount: string;
    created_at: string;
    updated_at: string;
    cus_name: string;
    cus_fac_id: string;
    status: Status;
    customer: Customer;
    list_id: number;
    notes: NoteType[]
}

export const getRoutes = async (dispatch: Dispatch, date: string): Promise<RouteItem[]> => {
    try {
        const response = await getRoutesService(date);

        if (response.hasError) {
            console.warn(
                'has error::-> getRoutesService ::',
                response.errorMessage,
            );
            return []
        } else {
            console.log('get getRoutes ::', response);
            if (response.data.length > 0) {
                return response.data
            } else {
                return []
            }

        }
    } catch (error) {
        console.warn('catch error getRoutes ::', error);
        return []
    }
}

export const getLocations = async (dispatch: Dispatch, id: number): Promise<LocationItem[]> => {
    try {
        const response = await getLocationService(id)

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
        console.warn("catch error getLocations ::", error);
        return []
    }
}

export const SaveLocationPressData = (
    ro_loc_id: number, cus_id: number, list_id: number,
    notes: LocationItem['notes'],
    status: LocationItem['status'],
    cus_name: string,
) => ({
    type: 'LOCATION_PRESS_DATA',
    payload: { ro_loc_id, cus_id, list_id, notes, status, cus_name},
});

export const ClearAllRouteData = () => ({ type: 'CLEAR_ALL' });