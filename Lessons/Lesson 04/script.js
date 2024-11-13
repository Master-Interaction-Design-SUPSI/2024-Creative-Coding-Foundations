const NAMES = ["Mario","Jessi","July","Marco","Luca"]

//console.log(NAMES) 
//console.log(NAMES[3])
 
NAMES.splice(3,1)
console.log(NAMES)


//NAMES = 101
//console.log (NAMES)

for ( let name of NAMES){

    console.log (name)

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


let.hobbies = FIRST.STUDENT.hobbies
console.log(hobbies)

for (let hobby of hobbies){
    console.log(hobby)
}

const DATABASE_PATH = '/assets/data.json'

fetch(DATABASE_PATH)
    .then(response => response.json())
    .then(data => display_data(data))
    .catch(error => console.error('Error:', error))

    function display_data(data){
        console.log(data)

        const CONTAINER = document.getElementById("container")

        let filteredArray = [...data].filter((a) => a.age > 30)

        let sortedArray = [...filteredArray].sort((a, b) => a.age - b.age)

        console.log(sortedArray. lenght)

        let output = ""
        output += "<ul>"


        for (let person of sortedArray){
            console.log(person)

            output += 
                <li>
                    ${person.first_name} ${person.first_name}, ${person.age}
                </li>
        }

        output += "<ul>" 

        CONTAINER.innerHTML = output;
}

function display_error(error){
    console.error('Error:',error)

    CONTAINER.innerHTML = "I'm sorry. The data are not available"
}