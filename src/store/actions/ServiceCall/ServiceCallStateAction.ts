export const saveDataFrom_ServiceCallTo_Invoice = ({ source, customer_id }: { source: string, customer_id: number }) => ({
    type: 'SAVE_DATA_FROM_SERVICECALL_TO_INVOICE',
    payload: { source, customer_id },
});

export const clearServiceCallData = () => ({
    type: "CLEAR_SERVICE_CALL_DATA",
});