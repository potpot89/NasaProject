//my API key to add to the URL
let apiKey = "VGrzb1RDd78jbBmTl8KoHpZBEBMKGcpKENzWUKPo";

//get today's date but convert it in the format YYYY-MM-DD that we need to make the query in the API
const date = new Date();
const formatter = new Intl.DateTimeFormat("af-ZA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const formattedToday = formatter.format(date);
//console.log(formattedToday);

//queries to add to the API
let start_date = "2024-01-01";
let end_date = formattedToday;

//variables to target the DOM elements
let mainPicture = document.querySelector("#main-picture");
let picturesContainer = document.querySelector(".pictures-container");

//variable for the mock file for development purpose. It fetches the json file we created and it allows to work offline.
//it allows us to work on fake data / signposts
let astronomyPictures = "mock/astronomy-pictures.json";

//URL to the endpoint with the queries and api key - for final project that goes to the online endpoint - comment the mock variable and comment out below fetch API inquiry, to move from the mock to the actual API app

//let astronomyPictures = `https://api.nasa.gov/planetary/apod?start_date=${start_date}&end_date=${end_date}&api_key=${apiKey}`;

//assegno fetch a una variabile. in questo caso fetch è una funzione che al suo interno assegna un'altra fetch.
let fetchPictures = () => {
  let pictures = fetch(astronomyPictures).then((res) => res.json());
  return pictures;
};

//prendiamo le immagini che abbiamo recuperato e a queste concateniamo degli altri then
let fetchedPictures = fetchPictures().then((pictures) => {
  //console.log(pictures);

  //extract the most recent picture and add it to the mainPicture container

  let mainPic = document.createElement(`img`);
  let mostRecentPic = pictures.at(-1).url;
  //console.log(mostRecentPic);
  mainPic.src = mostRecentPic;
  mainPicture.appendChild(mainPic);
});

//extract the remaining pictures and add them to the 'previous image' section
//reverse the order of the array and cut out the most recent image that we already added to the main container

let fetchOtherPictures = fetchPictures().then((otherPictures) => {
  let otherPic = otherPictures.reverse().slice(1);
  console.log({ otherPic });
  otherPic.forEach((item) => {
    let img = document.createElement(`img`);
    img.src = item.url;
    picturesContainer.appendChild(img);
  });
});

//add descriptions and titles
