export const createDateLocal = (data: string, hora: string): Date => {
    const [ano, mes, dia] = data.split("-").map(Number);
    const [horaH, minuto] = hora.split(":").map(Number);
    const dataLocal = new Date(ano, mes - 1, dia, horaH, minuto);

    const offsetMin = dataLocal.getTimezoneOffset(); 
    const utcTime = new Date(dataLocal.getTime() - offsetMin * 60 * 1000);

    return utcTime;
};

export const transfDateTime = (date: string) => {
    const fullDate = new Date(date);
    const formattedDate = fullDate.toLocaleDateString("sv-SE"); 
    const formattedTime = fullDate.toLocaleTimeString("pt-BR", {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    return {
        date: formattedDate,
        time: formattedTime
    };
};