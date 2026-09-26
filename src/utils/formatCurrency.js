export function formatCurrency(amount) {
    if (isNaN(amount) || amount === null || amount === undefined) {
        return 'ETB 0.00';
    }
    return `ETB ${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}
