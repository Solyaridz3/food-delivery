
const totalTime = 62;

const date = new Date();

const minutes = totalTime % 60;
const hours = (totalTime / 60).toFixed(0);

date.setMinutes(date.getMinutes()+totalTime);   

const deliveryTime = `${date.getHours()}:${date.getMinutes()}`;

console.log(deliveryTime);
