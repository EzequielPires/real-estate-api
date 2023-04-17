export function addHours(numOfHours) {
    let date = new Date();
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

    return date;
}
export function isValidHours(date: Date) {
    const now = new Date();
    if(date.getTime() > now.getTime()) {
        return true;
    } else {
        return false;
    }
}