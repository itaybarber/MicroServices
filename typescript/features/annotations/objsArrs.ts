const profile = {
  name: 'itay',
  age: 29,
  coords: {
    lat : 32,
    lng: 37
  },
  setAge(age: number):void {
    this.age = age;
  }
};

const {age, name} : {age: number, name: string } = profile;
const {coords: {lat, lng}} :{coords: {lat: number, lng: number}}  = profile;


const carManu = ['ford, toyota'];
const carByMake = [['f150', 'corol']];


// Tuple:
type Drink = [string, boolean, number];
const pepsi: [string, boolean, number] = ['brown', true, 40];
const cokeZero: Drink = ['black', true, 0]; 