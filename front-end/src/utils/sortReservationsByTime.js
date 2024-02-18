export default function sortReservationsByTime( a, b ) {

    if ( a.reservation_time < b.reservation_time ){
      return -1;
    }
    if ( a.reservation_time > b.reservation_time ){
      return 1;
    }
    return 0;
  }