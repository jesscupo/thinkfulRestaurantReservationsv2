
export default async function reservationValidator( formData ) {
    let errors = [];
    //create var for reservation time in datetime format
    const reservationDateTime = new Date(formData.reservation_date + ' ' + formData.reservation_time)
    //validate reservation datetime is in the future
    if (reservationDateTime <= new Date()) {
        errors.push("Date must be in the future.")
    }
    //validate reservation day is not a tuesday
    if (reservationDateTime.getDay() === 2) {
        errors.push("Restaurant is closed on Tuesdays.")
    }

    if (formData.reservation_time < "10:30:00" || formData.reservation_time > "21:30:00") {
        errors.push("Reservation must be between 10:30am - 9:30pm.")
    }

    //validate data type for people
    if (isNaN(Number(formData.people))) {
        errors.push("People must be a number greater than zero.")
    }
    return errors;
}