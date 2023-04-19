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

export function formatDate(date: Date) {
    let day = date.getDate().toString().padStart(2, '0'); // Obtém o dia do mês (com zero à esquerda, se necessário)
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Obtém o mês (com zero à esquerda, se necessário)
    let year = date.getFullYear(); // Obtém o ano

    return  day + '/' + month + '/' + year;
}