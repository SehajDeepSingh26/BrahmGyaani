export default formatDate = (dataString) => {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
    }
    const date = new Date(dataString)
    const formattedDate = date.toLocaleDateString(date, options)

    const hour = date.getHours();
    const minute = date.getMinutes();
    const period = hour >= 12 ? "PM" : "AM";
    const formattedTime = `${hour % 12} : ${minute.toString} ${period}`

    return `${formattedDate} | ${formattedTime}`
}