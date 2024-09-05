import { Asset, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';

export type resultAssets = {
    base64: string | undefined;
    uri: string | undefined;
} | null

export const handleCameraLaunch = async () => {
    const result = await launchCamera({
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 2000,
        maxWidth: 2000
    });

    if (result.didCancel) {
        console.log('User cancelled the camera process');
    } else if (result.errorMessage) {
        console.warn('Error with react-native-image-picker:', result.errorMessage);
    } else if (result.errorCode) {
        switch (result.errorCode) {
            case 'camera_unavailable':
                console.warn('Camera unavailable');
                break;
            case 'permission':
                console.warn('Camera permission issue');
                break;
            case 'others':
                console.warn('Other camera issue found');
                break;
        }
    } else {
        const imageUri = result.assets?.[0];

        console.log('Image URI:', imageUri);

        return {
            base64: imageUri?.base64,
            uri: imageUri?.uri
        }
    }

    return null
};


export const ImageLibraryPicker = async (): Promise<resultAssets> => {
    try {
        const result: ImagePickerResponse = await launchImageLibrary({
            mediaType: 'photo',
            includeBase64: true,
            maxHeight: 2000,
            maxWidth: 2000,
        });

        if (result.didCancel) {
            console.log('User cancelled the image library');
        } else if (result.errorCode) {
            switch (result.errorCode) {
                case 'camera_unavailable':
                    console.warn('Camera unavailable');
                    break;
                case 'permission':
                    console.warn('Permission issue');
                    break;
                case 'others':
                    console.warn('Other issue found');
                    break;
            }
        } else if (result.assets && result.assets.length > 0) {
            const imageAsset: Asset = result.assets[0];
            console.log('Image Asset:', imageAsset);
            return {
                base64: imageAsset.base64,
                uri: imageAsset.uri,
            };
        }
    } catch (error) {
        console.error('Error with react-native-image-picker:', error);
    }

    return null;
};