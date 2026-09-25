export const filterPaymentsByDate = (allPayments, timeFilter) => {
    const today = new Date();

    return allPayments.filter(payment => {
        const date = new Date(payment.createdAt);

        if (timeFilter === "all") {
            return true;
        }

        if (timeFilter === "today") {
            return (
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
            );
        }

        if (timeFilter === "month") {
            return (
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
            );
        }

        if (timeFilter === "week") {
            const startOfWeek = new Date(today);
            const day = today.getDay();

            startOfWeek.setDate(today.getDate() - day);
            startOfWeek.setHours(0, 0, 0, 0);

            return date >= startOfWeek;
        }

        return true;
    })
};

export const filterPaymentsByMethod = (payments, methodFilter) => {
    if (methodFilter === "all") {
        return payments;
    }

    return payments.filter(payment => payment.method === methodFilter);
};