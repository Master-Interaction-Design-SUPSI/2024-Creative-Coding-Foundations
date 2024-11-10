const NAMES = ["Mario", "Jessy", "July", "Marco", "Luca"]
// console.log(NAMES)
// console.log(NAMES[3])

NAMES.splice(3, 1)
console.log(NAMES)
// NAMES = 101
// console.log(NAMES)

for (let name of NAMES){
    console.log(name)
}

const FIRST_STUDENT = {
    name: "Alice",
    age: 25,
    address: {
      street: "Corso Elvezia 6",
      city: "Lugano"
    },
    hobbies: [
        "football",
        "cycling",
        "hicking"
    ]
};

console.log(FIRST_STUDENT.name)
console.log(FIRST_STUDENT.address.city)
console.log(FIRST_STUDENT.hobbies[0])

FIRST_STUDENT.age = 26
console.log(FIRST_STUDENT)

let hobbies = FIRST_STUDENT.hobbies

for (let hobby of hobbies){
    console.log(hobby)
}