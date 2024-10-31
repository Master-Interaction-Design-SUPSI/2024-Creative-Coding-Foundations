/* simple array */

console.log("/* simple array */");

const cats = ["Leopard", "Lion", "Jaguar", "Tiger", "Leopard", "Lion", "Jaguar", "Tiger", "Leopard", "Lion", "Jaguar", "Tiger"];

console.log("cats[0]: " + cats[0]);
console.log("cats[1]: " + cats[1]);
console.log("cats[2]: " + cats[2]);
console.log("cats[3]: " + cats[3]);

console.log("for loop");

for (let i = 0; i < cats.length; i++) {
    console.log("for loop cats[i=" + i + "]: " + cats[i]);
}

console.log("/* for ... of */");

for(const c of cats) {
    console.log(c);
}

console.log("/* map() */");

const catsUpperCase = cats.map((c) => {
    return c.toUpperCase();
});

console.log(catsUpperCase);

console.log("/* filter() */");

const catsWithT = cats.filter((c) => {
    return c.includes("T");
});

console.log(catsWithT);


cats[0] = "Panter";   // change the first element of the array

console.log("First element changed to panther");

console.log("cats[0]: " + cats[0]);

let myName = "Marco";
console.log(myName);

myName = "Giovanni";
console.log(myName);

/* more complex arrays */

console.log("/* more complex arrays */");

const complexArray = ["JavaScript", 100, 3.14, [1, 2, 3, 4], [["X", "Y", "Z"], "B", "C"]];

console.log(complexArray[0]);
console.log(complexArray[1]);
console.log(complexArray[3]);
console.log(complexArray[4][0][2]);

complexArray[4][0][2] = "K";

console.log(complexArray[4][0][2]);


/* find elements inside an array */

console.log("/* find elements inside an array */")

let dogs = ["Chihuaua", "Terrier", "Bulldog", "Labrador"];

let chihuauaIndex = dogs.indexOf("Chihuaua");

console.log(chihuauaIndex);

dogs[chihuauaIndex] = "Rotweiler";

console.log(dogs);

dogs.push("Setter");    // add element to the end of the array
console.log(dogs);

dogs.pop();     // remove last element
console.log(dogs);

dogs.shift();   // remove the first element
console.log(dogs);

let removedDogs = dogs.splice(1, 1);  // remove 2 elements starting from index 1
console.log(dogs);
console.log(removedDogs);