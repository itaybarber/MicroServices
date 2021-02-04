import faker from 'faker';

export class Company {
  name: string;
  catchFrase: string;
  location: {
    lat: number;
    lng: number;
  };

  constructor(){
    this.name = faker.company.companyName();
    this.catchFrase = faker.company.catchPhrase();
    this.location = {
      lat: parseFloat(faker.address.latitude()),
      lng: parseFloat(faker.address.longitude()),
    }
  }
}