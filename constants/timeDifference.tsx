// computes the difference in days between today and item
const dayDifference = (item: Date, today?: Date) => {
    const now = today || new Date();
    now.setHours(0, 0, 0, 0);
    const then = item;
    then.setHours(0, 0, 0, 0);

    return Math.ceil((then.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default dayDifference;