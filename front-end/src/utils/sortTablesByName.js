export default function sortTablesByName( a, b ) {

    return a.table_name.localeCompare(b.table_name);

  }