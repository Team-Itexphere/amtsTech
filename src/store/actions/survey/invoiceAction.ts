import { InvoiceSubItemWithAmount } from "../../../screen/Invoice/SubItems.screen";

export const save_Amount = (amount: string) => ({
    type: 'SAVE_AMOUNT',
    payload: {
        amount
    },
});

export const save_SubItems = (items: InvoiceSubItemWithAmount[]) => ({
    type: 'INVOICE_SUBITEMS',
    payload: items,
});