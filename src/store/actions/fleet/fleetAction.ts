import { Dispatch } from "redux"
import { submitFleetDataService } from "../../../services/fleet/fleet.service";
export const FLEET_REQUEST = 'LOGIN_REQUEST';
export const FLEET_SUCCESS = 'LOGIN_SUCCESS';
export const FLEET_FAILURE = 'LOGIN_FAILURE';

interface LoginRequestAction {
    type: typeof FLEET_REQUEST;
}
interface LoginSuccessAction {
    type: typeof FLEET_SUCCESS;
    payload: string;
}

interface LoginFailureAction {
    type: typeof FLEET_FAILURE;
    payload: string;
}

export type FleetSubmitActionTypes =
    | LoginRequestAction
    | LoginSuccessAction
    | LoginFailureAction

export const submitFleet = (start_millage: string,
    stop_millage: string) => {
    return async (dispatch: Dispatch<FleetSubmitActionTypes>) => {
        dispatch({ type: 'LOGIN_REQUEST' });
        try {
            const response = await submitFleetDataService(start_millage, stop_millage)

            if (response.hasError) {
                console.warn('hasError submitFleet ::', response);
            } else {
                console.log('success ::', response);
            }
        } catch (error: any) {
            console.warn('catch error submitFleet ::', error);
        }

        return
    };
}