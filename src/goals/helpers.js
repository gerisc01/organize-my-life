export const formatDate = (date) => {
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of the year
    return `${month}/${day}/${year}`;
}

export const padGoals = (goals, goalNum) => {
    const result = [];
    if (!goals || goals.length === 0) return [null, null, null];
    while (result.length < goalNum) {
        const goal = goals.shift();
        result.push(goal ? goal : null);
    }
    return result;
}

export const getWeeklyGoalsId = (collection) => {
    if (!collection || !collection.attributes || !collection.attributes.weekly_goals) {
        return null;
    }
    return collection?.attributes?.weekly_goals;
}
