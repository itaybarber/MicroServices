const add = (a: number,b: number) : number => {
  return a + b;
};

const todayWeather = {
  date: new Date(),
  weather: 'sunny'
};

const logWeather = (forecast: {date: Date, weather: string}): void => {
  console.log(forecast.weather);
}

const Es2015LogWeather = ({date, weather}: {date: Date, weather: string}) : void => {
  console.log(weather);
}