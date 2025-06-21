// computes the difference in days between today and item
export default function dayDifference(item: Date, today: Date = new Date()): number {
    item.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return Math.floor((item.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}