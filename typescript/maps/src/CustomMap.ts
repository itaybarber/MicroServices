export class CustomMap {
    private googleMap : google.maps.Map

    constructor(divID: string) {
        this.googleMap =  new google.maps.Map(document.getElementById(divID), {
            zoom: 3,
            center: {
              lat: 0,
              lng: 0
            }});
    }
}    