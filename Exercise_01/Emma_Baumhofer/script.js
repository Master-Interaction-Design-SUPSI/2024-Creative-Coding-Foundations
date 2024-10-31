document.addEventListener("DOMContentLoaded", function() {
    const button1 = document.getElementById('button-1');  
    const button2 = document.getElementById('button-2');  
    const button3 = document.getElementById('button-3');  
    const button4 = document.getElementById('button-4');  
    const button5 = document.getElementById('button-5');  
    const button6 = document.getElementById('button-6');
    const button7 = document.getElementById('button-7');
    const button8 = document.getElementById('button-8');  
    const jumpscareContainer = document.getElementById('jumpscare-container');  


    const mediaContainer = document.getElementById('media-container');  
    const gifImage = document.getElementById('gif');  
    const clearButton = document.getElementById('clear-button');  
    const youtubeVideo = document.getElementById("youtube-video");  

    let currentAudio = null;

    // Function to stop and hide all media
    function stopAllMedia() {
        gifImage.style.display = 'none';  // Hide GIF
        youtubeVideo.style.display = 'none';  // Hide video
        mediaContainer.style.display = 'none';  // Hide media container
        youtubeVideo.src = "";  // Stop video
        if (currentAudio) {
            currentAudio.pause();  // Stop the current audio if playing
            currentAudio.currentTime = 0;  // Reset audio to the start
        }
    }

    // Button 1 - GIF + sound
    button1.addEventListener('click', function() {
        stopAllMedia();  // Stop and remove the current media
        gifImage.src = 'https://media.giphy.com/media/BRF2QmzB59VryBsgdQ/giphy.gif';
        gifImage.style.display = 'block';
        mediaContainer.style.display = 'block';
        mediaContainer.scrollIntoView({ behavior: 'smooth' });
    
        // Play sound
        currentAudio = new Audio('https://www.myinstants.com/media/sounds/the-end-meow-by-nekocat-just-3-second-1.mp3');
        currentAudio.play();
    });

    // Button 2 - GIF + sound
    button2.addEventListener('click', function() {
        stopAllMedia();
        gifImage.src = 'https://media.giphy.com/media/aEK2Ln4nChX4UWFXal/giphy.gif';
        gifImage.style.display = 'block';
        mediaContainer.style.display = 'block';
        mediaContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Play sound
        currentAudio = new Audio('https://www.myinstants.com/media/sounds/bette-midler-i-put-a-spell-on-you-hocus-pocus-audiotrimmer.mp3');
        currentAudio.play();
    });

    // Button 3 - GIF + sound
    button3.addEventListener('click', function() {
        stopAllMedia();
        gifImage.src = 'https://media.giphy.com/media/qDLm6t3z7NhByIhaaq/giphy.gif';
        gifImage.style.display = 'block';
        mediaContainer.style.display = 'block';
        mediaContainer.scrollIntoView({ behavior: 'smooth' });

        // Play sound
        currentAudio = new Audio('https://www.myinstants.com/media/sounds/scary-girl.mp3');
        currentAudio.play();
    });

    // Button 4 - YouTube Video
    button4.addEventListener('click', function() {
        stopAllMedia();
        youtubeVideo.src = 'https://www.youtube.com/embed/mcZAY9JzpuQ?autoplay=1';
        youtubeVideo.style.display = 'block';
        mediaContainer.style.display = 'block';
        mediaContainer.scrollIntoView({ behavior: 'smooth' });
    });

    // Button 5 - YouTube Video
    button5.addEventListener('click', function() {
        stopAllMedia();
        youtubeVideo.src = 'https://www.youtube.com/embed/ba4niP3IwLQ?autoplay=1';
        youtubeVideo.style.display = 'block';
        mediaContainer.style.display = 'block';
        mediaContainer.scrollIntoView({ behavior: 'smooth' });
    });

    // Button 6 - YouTube Video
    button6.addEventListener('click', function() {
        stopAllMedia();
        youtubeVideo.src = 'https://www.youtube.com/embed/yRclearNRvc?autoplay=1';
        youtubeVideo.style.display = 'block';
        mediaContainer.style.display = 'block';
        mediaContainer.scrollIntoView({ behavior: 'smooth' });
    });

    // Button 7 - GIF + sound
    button7.addEventListener('click', function() {
        stopAllMedia();
        gifImage.src = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXU4YmlsOGtxcGI3NTg1ejkxdjJ5bXptMmttdDdkanhtOHA1Nmc4eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l378eUqi5ArH3yBJ6/giphy.gif';
        gifImage.style.display = 'block';
        mediaContainer.style.display = 'block';
        mediaContainer.scrollIntoView({ behavior: 'smooth' });

        // Play sound
        currentAudio = new Audio('https://www.myinstants.com/media/sounds/pennywises-creepy-sound_aujFnr8.mp3');
        currentAudio.play();
    });

    // Button 8 - Full-Screen Jump Scare GIF + sound
    button8.addEventListener('click', function() {
        stopAllMedia();
        
        // Full-screen jump scare GIF
        jumpscareContainer.innerHTML = '<img src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHl1M2NrdWkya3ZxaHR0bjdzbzdmZmc5MzZyY2p3bGdieG55eTE3biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/28aGE5xerXkbK/giphy.gif" alt="Jump Scare">';

        // Jump scare container in full screen
        jumpscareContainer.style.display = 'flex';

        // Play sound
        let audio = new Audio('https://www.myinstants.com/media/sounds/jumpscare.mp3');
        audio.play();

        // Remove after 3 seconds
        setTimeout(function() {
            jumpscareContainer.style.display = 'none';
        }, 3000);  // Show for 3 seconds
    });

    // Clear button - Hide all media
    clearButton.addEventListener('click', function() {
        stopAllMedia();
    });
});
