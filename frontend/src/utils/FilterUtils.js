import {getLastMonthRange} from "./dateUtils.js"

export const filterPaymentsByDate = (allPayments, timeFilter) => {
    const today = new Date();

    return allPayments.filter(payment => {
        const date = new Date(payment.createdAt);

        if (timeFilter === "Today") {
            return (
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
            );
        }

        if (timeFilter === "This month") {
            return (
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
            );
        }

        if (timeFilter === "This week") {
            const startOfWeek = new Date(today);
            const day = today.getDay();

            startOfWeek.setDate(today.getDate() - day);
            startOfWeek.setHours(0, 0, 0, 0);

            return date >= startOfWeek;
        }

        if (timeFilter === "This year") {
            return (
                date.getFullYear() === today.getFullYear()
            );
        }

        return true;
    })
};

export const filterPaymentsByLastMonth = (allPayments) => {
    const { startOfLastMonth, startOfThisMonth } = getLastMonthRange();

    return allPayments.filter(payment => {
        const date = new Date(payment.createdAt);

        return date >= startOfLastMonth && date < startOfThisMonth;
    });
};

export const filterPaymentsByMethod = (payments, methodFilter) => {
    if (methodFilter === "all") {
        return payments;
    }

    return payments.filter(payment => payment.method === methodFilter);
};