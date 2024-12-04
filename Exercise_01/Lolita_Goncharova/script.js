
const button1 = document.getElementById('button-1');
const button2 = document.getElementById('button-2');
const button3 = document.getElementById('button-3');
const button4 = document.getElementById('button-4');


const outputParagraph = document.getElementById('output');


button1.addEventListener('click', 
    () => {
        outputParagraph.innerText +="1"; 
    })

    button2.addEventListener('click', 
        () => {
            outputParagraph.innerText +="2"; 
        })

        button3.addEventListener('click', 
            () => {
                outputParagraph.innerText +="3"; 
            })

button4.addEventListener('click', 
                () => {
                    outputParagraph.innerText = "Type here:"; 
                })


                // unfortunatly i couldnot figer out how to creat a sicanse still to be continud