const memeLibrary = {
    work: {
        images: [
            "https://i.imgflip.com/4/22bdq6.jpg", 
            "https://i.imgflip.com/4/5c7lwq.jpg", 
            "https://i.imgflip.com/4/46e43q.jpg"
        ],
        phrasesTop: [
            "When you realize it's Monday again...", 
            "Me trying to work from home.", 
            "The face I make after my boss emails."
        ],
        phrasesBottom: [
            "And it's only 9 AM.",
            "But my bed keeps calling.",
            "Pretending I didn't see it."
        ]
    },
    friends: {
        images: [
            "https://i.imgflip.com/4/9ehk.jpg", 
            "https://i.imgflip.com/4/28j0te.jpg", 
            "https://i.imgflip.com/4/1bij.jpg"
        ],
        phrasesTop: [
            "When you pretend to be cute but you’re planning something.",
            "Me after a long day.",
            "Why did you wake me up?"
        ],
        phrasesBottom: [      
            "World domination, obviously.",
            "Time for snacks and Netflix.",
            "There better be food."
        ]
    },
    relationship: {
        images: [
            "https://i.imgflip.com/4/2fm6x.jpg", 
            "https://i.imgflip.com/4/43a45p.jpg", 
            "https://i.imgflip.com/4/1tl71a.jpg"
        ],
        phrasesTop: [
            "When they say 'We need to talk...'",
            "Me after trying to win an argument.",
            "When your partner steals the blanket at night."
        ],
        phrasesBottom: [
            "And your heart skips a beat.",
            "But they hit me with logic.",
            "Guess I'm freezing tonight."
        ]
    },
    study: {
        images: [
            "https://i.imgflip.com/4/26am.jpg", 
            "https://i.imgflip.com/4/1g8my4.jpg", 
            "https://i.imgflip.com/4/1c1uej.jpg"
        ],
        phrasesTop: [
            "When I open the textbook at 3 AM.",
            "Trying to focus during an online class.",
            "When the exam is tomorrow and I haven’t started."
        ],
        phrasesBottom: [      
            "And nothing makes sense.",
            "But my brain has other plans.",
            "The panic is real."
        ]
    },
    fusion: {
        images: [
            "https://i.imgflip.com/4/261o3j.jpg", 
            "https://i.imgflip.com/4/1ihzfe.jpg", 
            "https://i.imgflip.com/4/46hhvr.jpg"
        ],
        phrasesTop: [
            "When I think I'm done with the project.",
            "Trying to render a 3D model smoothly.",
            "When the software crashes for the 5th time."
        ],
        phrasesBottom: [     
            "But the client has new requests.",
            "But it takes 2 hours per frame.",
            "I question all my life choices."
        ]
    }
};

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateMeme(category) {
    const memeData = memeLibrary[category];
    if (memeData) {
        const selectedImage = getRandomElement(memeData.images);
        const selectedTopPhrase = getRandomElement(memeData.phrasesTop);
        const selectedBottomPhrase = getRandomElement(memeData.phrasesBottom);
        
        document.getElementById("meme-image").src = selectedImage;
        document.getElementById("top-text").textContent = selectedTopPhrase;
        document.getElementById("bottom-text").textContent = selectedBottomPhrase;
    } else {
        alert("Category not found!");
    }
}