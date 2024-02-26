export async function tableValidator( formData ) {

    let errors = [];
    //validate table name is at least two chars
    if (formData.table_name.length < 2) {
        errors.push("Table name must be at least two characters.")
       }
    //validate table capacity is at least 1
    if (formData.capacity < 1  || isNaN(Number(formData.capacity))) {
        errors.push("Table capacity must be at least one.")
        }
    return errors;
  }

export default tableValidator;