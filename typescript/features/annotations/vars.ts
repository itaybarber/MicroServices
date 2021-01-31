const apples: number = 5;

let speed: string = "Fast";

let hasName: boolean = true;

let nothingMuch: null = null;
let nothing: undefined = undefined; // null will compile as well

let now: Date = new Date();

let colors: string[] = ["red", "green", "purple"];

class Car {

}
let car: Car = new Car();

let point: {x: number; y: number} = {
  x: 10,
  y: 20
};
                
const logNumber: (i: number) => void = (i: number) => {
  console.log(i);
}


const json = '{"x":10, "y":22}';
const coords: {x: number; y:number} = JSON.parse(json); // The parse returns the any type



// 3) Var whose type can't be inferred correctly
let nums = [-10, -4 , 33];
let numsAboveZero: boolean | number = false;

for (let i = 0; i < nums.length; ++i){
  if (nums[i] > 0){
    numsAboveZero = nums[i];
  }
}

