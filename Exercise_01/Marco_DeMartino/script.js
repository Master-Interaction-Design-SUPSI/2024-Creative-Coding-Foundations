const gnome = document.getElementById("gnome");
const woods = document.getElementById("woods");
const distanza = woods.clientWidth + gnome.clientWidth;
const sendAdventure = document.getElementById("send-adventure");
const city = document.getElementById("city");
const getsCone = document.getElementById("gets-cone");
const gnomeImage = document.getElementById("gnome-image");
const popupImage = document.getElementById("popup-image");

const gnomeInCity = () => {
  gnome.removeEventListener("transitionend", gnomeInCity);

  city.appendChild(gnome);

  console.log("gnome in city");

  gnome.style.left = "0px";

  void gnome.offsetWidth;

  const newDistance = city.clientWidth + gnome.clientWidth;

  gnome.style.transition = "left 2s linear";
  gnome.style.left = newDistance + "px";

  gnome.addEventListener("transitionend", gnomeGetsCone);
};

const gnomeGetsCone = () => {
  gnome.removeEventListener("transitionend", gnomeGetsCone);

  getsCone.appendChild(gnome);

  gnome.style.left = "0px";

  void gnome.offsetWidth;

  const endDistance = getsCone.clientWidth + gnome.clientWidth;

  gnome.style.transition = "left 2s linear";
  gnome.style.left = endDistance - 150 + "px";

  gnome.addEventListener("transitionend", gnomeReturnsToCity);
};

const gnomeReturnsToCity = () => {
  console.log("heading back!");
  gnome.removeEventListener("transitionend", gnomeReturnsToCity);

  const endDistance = getsCone.clientWidth + gnome.clientWidth;

  gnome.style.left = endDistance - 150 + "px";

  void gnome.offsetWidth;

  gnome.style.transition = "left 2s linear";
  gnome.style.left = -gnome.clientWidth + "px";

  gnome.addEventListener("transitionend", gnomeReturnsToWoods);
};

const gnomeReturnsToWoods = () => {
  console.log("Back home!");
  gnome.removeEventListener("transitionend", gnomeReturnsToWoods);

  city.appendChild(gnome);

  gnome.style.left = 100 + "%";

  void gnome.offsetWidth;

  gnome.style.transition = "left 2s linear";
  gnome.style.left = -gnome.clientWidth + "px";

  gnome.addEventListener("transitionend", gnomeReturnsHome);
};

const gnomeReturnsHome = () => {
  console.log("HOME!");
  gnome.removeEventListener("transitionend", gnomeReturnsHome);

  woods.appendChild(gnome);

  gnome.style.left = 100 + "%";

  void gnome.offsetWidth;

  gnome.style.transition = "left 2s linear";
  gnome.style.left = "15px";

  gnome.addEventListener("transitionend", coneHead);
};

const coneHead = () => {
  gnome.removeEventListener("transitionend", coneHead);

  if (gnomeImage.src.endsWith("Gnome0.png")) {
    gnomeImage.src = "./assets/imgs/gnome1.png";
    popupImage.src = "./assets/imgs/gnome1.png";
    document.getElementById("level-popup").style.display = "flex";
  } else if (gnomeImage.src.endsWith("gnome1.png")) {
    gnomeImage.src = "./assets/imgs/gnome2.png";
    popupImage.src = "./assets/imgs/gnome2.png";
    document.getElementById("level-popup").style.display = "flex";
  } else {
    gnomeImage.src = "./assets/imgs/gnome3.png";
    popupImage.src = "./assets/imgs/gnome3.png";
    document.getElementById("end-popup").style.display = "flex";
  }

  /*document.getElementById("gnome-image").src = "./assets/imgs/gnome1.png";
  document.getElementById("popup-image").src = "./assets/imgs/gnome1.png";
  document.getElementById("level-popup").style.display = "flex";*/
};

sendAdventure.addEventListener("click", () => {
  console.log("adventure sent!");
  sendAdventure.disabled = true;
  gnome.style.transition = "left 2s cubic-bezier(0.1, 0, 1, 1)";
  gnome.style.left = distanza + "px";
  gnome.addEventListener("transitionend", gnomeInCity);
});

const keepPlaying = document.getElementById("popup-button");

keepPlaying.addEventListener("click", () => {
  console.log("HEY");
  document.getElementById("level-popup").style.display = "none";
  sendAdventure.disabled = false;
});

const restartPlaying = document.getElementById("end-button");

restartPlaying.addEventListener("click", () => {
  console.log("Game Over");
  document.getElementById("end-popup").style.display = "none";
  gnomeImage.src = "./assets/imgs/Gnome0.png";
  sendAdventure.disabled = false;
});
