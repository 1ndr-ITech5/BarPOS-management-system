export const getLastMonthRange = () => {
    const today = new Date();

    const startOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
    );

    const startOfThisMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );

    return {
        startOfLastMonth,
        startOfThisMonth
    };
};