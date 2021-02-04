import {User} from './User';
import {Company} from './Company';

const user = new User();
const company = new Company();

console.log(company);

var map = new google.maps.Map(document.getElementById('map'), {
  zoom: 11,
  center: {
    lat: 0,
    lng: 0
  }});