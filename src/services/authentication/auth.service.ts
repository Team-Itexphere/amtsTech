import { responseHandlerType } from "../api/responseHandler";
import { METHODS, client } from "../api/restClient";
import { USER_LOGIN } from "../urls";

// -------------- POST-METHOD --------------
export const submitSignOffDataService = async (email: string, password: string) => {
    let headerConfig = {
        'content-Type': 'application/json',
    };
    const body = {
        'email': email,
        'password': password
    }
    return await client.API(
        METHODS.POST,
        USER_LOGIN,
        body,
        headerConfig,
    ) as responseHandlerType;
};