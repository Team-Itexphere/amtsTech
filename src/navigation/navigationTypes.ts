import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Status } from '../types';

export type RootStackParamList = {
    Dashboard: undefined;
    Route: undefined;
    ServiceCall: undefined;
    Fleet: undefined;
    Settings: undefined;
    ImageView: undefined;
    Survey: undefined;
    Camera: undefined;
    InvoiceGenerate: undefined;
    PaymentOption: undefined;
    PdfReader: { invoice_link: string },
    LocationList: { ro_loc_id: number };
    StoreList: undefined;
    InvoiceSubItems: { source: string, customer_id?: number };
    StoreLicense: undefined;
    ATG_I: undefined;
    ATG_S: undefined;
    SiteInfo: undefined;
    ServiceCallView: {
        id: number;
        wo_number: string;
        customer_id: number;
        status: Status;
        tech_id: number;
        fleet_id: number;
        date: string | null;
        start_date: string | null;
        comp_date: string | null;
        time: string | null;
        priority: string;
        comment: string;
        created_at: string;
        updated_at: string;
    };
    ServiceCall_Histroy: { work_order_id: number };
    Notes: undefined;
    MaintainsLogs: undefined;
};

// Survey: { userId: string };  // Survey screen expects a parameter named userId
// ~~ navigation.navigate('Survey', { userId: '123' }); ~~ // Pass the required parameter

export type NavigationProp = StackNavigationProp<RootStackParamList>;

export type LocationListProp = RouteProp<RootStackParamList, 'LocationList'>
export type SurveyRouteProp = RouteProp<RootStackParamList, 'Survey'>
export type InvoiceGenerateRouteProp = RouteProp<RootStackParamList, 'InvoiceGenerate'>
export type PaymentOptionRouteProp = RouteProp<RootStackParamList, 'PaymentOption'>
export type PdfReaderRouteProp = RouteProp<RootStackParamList, 'PdfReader'>
export type StoreListProp = RouteProp<RootStackParamList, 'StoreList'>
export type ServiceCallViewProp = RouteProp<RootStackParamList, 'ServiceCallView'>
export type ServiceCallHistoryProp = RouteProp<RootStackParamList, 'ServiceCall_Histroy'>
export type InvoiceSubItemsProp = RouteProp<RootStackParamList, 'InvoiceSubItems'>

