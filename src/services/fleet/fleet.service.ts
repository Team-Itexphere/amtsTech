import { responseHandlerType } from "../api/responseHandler";
import { METHODS, client } from "../api/restClient";
import { SUBMIT_FLEET } from "../urls";

// -------------- POST-METHOD --------------
export const submitFleetDataService = async (start_millage: string, stop_millage: string) => {
    let headerConfig = {
        'content-Type': 'application/json',
    };
    const body = {
        "date": "2024-05-10",
        'start_millage': start_millage,
        'stop_millage': stop_millage
    }
    return await client.API(
        METHODS.POST,
        SUBMIT_FLEET,
        body,
        headerConfig,
    ) as responseHandlerType;
};