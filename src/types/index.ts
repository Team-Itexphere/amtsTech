// src/types/index.ts
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOG_OUT = 'LOGOUT';

interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
}
interface LogoutRequestAction {
  type: typeof LOG_OUT;
}

interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: string;
}

interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  payload: string;
}

export type AuthActionTypes =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | LogoutRequestAction;

export enum Status {
  Pending = 'Pending',
  Completed = 'Completed'
}

export enum ServeyStatus {
  Pending = 'pending',
  Completed = 'completed'
}


export interface InvoiceItem {
  location: string;
  id: number;
  invoice_id: number;
  item_name: string;
  category: string | null;
  descript: string;
  qty: number;
  rate: string;
  amount: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: number;
  invoice_no: string;
  date: string;
  customer_id: number;
  route_list_id: number;
  service: string | null;
  price: string | null;
  pay_opt: string;
  check_no: string | null;
  mo_no: string | null;
  comment: string | null;
  payment: string;
  paid_amount: string | null;
  po_no: string | null;
  file_name: string;
  addi_comments: string | null;
  createdBy: number;
  updatedBy: string;
  created_at: string;
  updated_at: string;
  pdf_link: string;
  invoice_items: InvoiceItem[];
}