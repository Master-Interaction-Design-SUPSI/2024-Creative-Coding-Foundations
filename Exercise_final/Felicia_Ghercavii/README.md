# Project title
Gutenberg Galaxy

## Author
Felicia Ghercavii

## Concept description
Starting from my Public Library API project I did for Exercise 4, I used the three.js library to add another dimension to the data, and create a sort of galaxy of books sorted by subject. Additionally, I added a slider that can be used to control the displayed titles by year, and used the Gutenberg WEB API, so all the books displayed are public property and free to read and, my favourite, free to use for design projects! 

The user can click on words, which triggers a sound, camera transition to center, and the "planets" (books) related to the clicked word to appear in orbit. The words continuously face the camera. Hovering on the planets displays a tooltip overlay with detailed information about the title, author, year, subjects, languages, and download counts of the book. I used raycasting for the interactivity, to detect clicks and hovers with precision. 

Two sliders (start year, end year) allow the user to filter books by publication or author related years, when unavailable, updating the word cloud visibility according to the time range. Through three.js and the TWEEN add-on, the user can rotate around the cloud, zoom in and out, and pan accross the space.

I started by importing the necessary library & add-ons, then initiliased a scene, camera, lighting, renderer, orbit controls – all on a responsive canvas. I fetched the API data, only the first 3 pages so the loading time wouldn't be a week, tokenized them into words, and counted the frequency (in order to size accordingly); each word is stored in a Map structure then linked to its associated book. The words are evenly distributed on a sphere, with their sizes determined logarithmically based on frequency (so sizes are balanced accross the galaxy). 

Find the presentation with my process here:
https://www.figma.com/slides/QVbsEN9nNgxWhFx4APP38l/CCF_Final_Felicia_G?node-id=21-13&t=t5hEN9rkCeYx6hx2-1