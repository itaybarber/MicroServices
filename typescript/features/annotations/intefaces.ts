interface Car {
    name: string;
    year: number;
    broken: boolean;

    summary(): string /* That's ret value */ 
}

const oldCivic = {
  name: 'civic',
  year: 2000,
  broken: true,
  color: 'blue',

  summary(): string {
      return `Name is ${this.name}`
  }
};


const printCar = (car: Car) : void => {
    console.log(car.summary());
};


printCar(oldCivic);