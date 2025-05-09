import { Dispatch } from "redux";
import { deleteImageService, getAllImageListService, postImageCaptureService } from "../../../services/survey/routes.service";

export enum ImageType {
    ATGS = "atgs",
    ATGI = "atgi",
    PICTURE = "picture",
    REC_LOG = "rec_log"
}

export type postImageCaptureReqBody = {
    cus_id: number,
    // list_id: number,
    image: string,
    type: ImageType
}

export type queryParam_GetImages = {
    cus_id: number,
    type: ImageType
}

export type ImageDataRes = {
    images: string[];
    total: number;
};

export const postImageCapture = async (dispatch: Dispatch, reqBody: postImageCaptureReqBody): Promise<ImageDataRes | null> => {
    try {
        const response = await postImageCaptureService(reqBody)
        // console.log("postImageCapture response ::", response);
        if (response.hasError) {
            console.warn(
                'has error::-> postImageCapture ::',
                reqBody.type,
                response.errorMessage,
            );
            return null;
        } else {
            return response.data
        }

    } catch (error) {
        console.warn('catch error postImageCaptureService ::', reqBody.type, error);
        return null
    }
}

export const getAllImageList = async (dispatch: Dispatch, queryParam: queryParam_GetImages): Promise<ImageDataRes | null> => {
    try {
        const response = await getAllImageListService(queryParam)
        // console.log("response getAllImageList ::", response);
        if (response.hasError) {
            console.warn('has error::-> getAllImageList ::', queryParam.type, response.errorMessage);
            return null
        } else {
            if (response.data) {
                return response.data
            } else {
                return null
            }
        }
    } catch (error) {
        console.warn("catch error getAllImageListService ::", queryParam.type, error);
        return null
    }
}

export const deleteImage = async (id: number) => {
    try {
        const response = await deleteImageService(id)

        if (response.hasError) {
            console.warn('has error::-> deleteImage ::', id, response.errorMessage);
            return false
        } else {
            if (response.data) {
                return response.data
            } else {
                return false
            }
        }
    } catch (error) {
        console.warn("catch error deleteImageService ::", id, error);
        return false
    }
}
