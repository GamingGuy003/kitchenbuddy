// computes the difference in days between today and item
const dayDifference = (item: Date, today?: Date) => {
    return Math.floor((item.getTime() - (today || new Date()).getTime()) / (1000 * 60 * 60 * 24));
}

export default dayDifference;