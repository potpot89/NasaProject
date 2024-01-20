//my API key to add to the URL
let apiKey = "VGrzb1RDd78jbBmTl8KoHpZBEBMKGcpKENzWUKPo";

/*
//get today's date but convert it in the format YYYY-MM-DD that we need to make the query in the API
const date = new Date();
const formatter = new Intl.DateTimeFormat("af-ZA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const formattedToday = formatter.format(date);
//console.log(formattedToday);
*/

//set the start date at 16 days before the end date (today) and use millis
let endMillis = Date.now();

let daysMillis = convertDaysInMillis(16);

//set the start date

function convertDaysInMillis(days) {
  //starting from days, calculate how many millis there are
  return (
    days *
    24 * //h
    60 * //min
    60 * //sec
    1000
  ); //millis
}

// startMillis = endMillis - 16 days (in milliseconds)
let startMillis = endMillis - daysMillis;

//queries to add to the API
//let start = "2024-01-01";
let start_date = new Date(startMillis);
//let end = formattedToday;
let end_date = new Date(endMillis);

//convert the date objects in the format for the API (YY-MM-DD)
let [endYear, endMonth, endDay] = [
  end_date.getFullYear(),
  end_date.getMonth() + 1,
  end_date.getDate(),
];

let [startYear, startMonth, startDay] = [
  start_date.getFullYear(),
  start_date.getMonth() + 1,
  start_date.getDate(),
];

let start = `${startYear}-${startMonth}-${startDay}`;
let end = `${endYear}-${endMonth}-${endDay}`;

//variables to target the DOM elements
let mainPicture = document.querySelector("#main-picture");
let picturesContainer = document.querySelector(".pictures-container");

//variable for the mock file for development purpose. It fetches the json file we created and it allows to work offline.
//it allows us to work on fake data / signposts
let astronomyPictures = "mock/astronomy-pictures.json";

//URL to the endpoint with the queries and api key - for final project that goes to the online endpoint - comment the mock variable and comment out below fetch API inquiry, to move from the mock to the actual API app

//let astronomyPictures = `https://api.nasa.gov/planetary/apod?start_date=${start}&end_date=${end}&api_key=${apiKey}&thumbs=true`; //thumbs= true enables the thumbnails url, which gives a preview of a video, in case there is a video instead of an img, using a conditional

//assegno fetch a una variabile. in questo caso fetch è una funzione che al suo interno assegna un'altra fetch.
let fetchPictures = () => {
  let pictures = fetch(astronomyPictures).then((res) => res.json());
  return pictures;
};

//prendiamo le immagini che abbiamo recuperato e a queste concateniamo degli altri then
let fetchedPictures = fetchPictures().then((pictures) => {
  //console.log({ pictures });

  //extract the most recent picture and add it to the mainPicture container, with its title and the date

  let mainPic = document.createElement(`img`);
  let mostRecentPic = pictures.at(-1).url;
  //console.log(mostRecentPic);

  mainPic.src = mostRecentPic;
  mainPicture.appendChild(mainPic);

  let mostRecentDate = pictures.at(-1).date;
  let textContainer = document.createElement(`div`);
  mainPicture.appendChild(textContainer);
  let h3 = document.createElement(`h3`);
  h3.textContent = mostRecentDate;
  textContainer.appendChild(h3);

  let mostRecentTitle = pictures.at(-1).title;
  //console.log(mostRecentTitle);
  let h4 = document.createElement(`h4`);
  h4.textContent = mostRecentTitle;
  textContainer.appendChild(h4);

  //only for the picture of the day, add the description in the article

  let p = document.createElement(`p`);
  p.textContent = pictures.at(-1).explanation;
  textContainer.appendChild(p);

  let copyright = document.createElement(`p`);
  copyright.textContent = `Copyright: ${pictures.at(-1).copyright}`;
  textContainer.appendChild(copyright);
});

//extract the remaining pictures and add them to the 'previous image' section, with their title
//reverse the order of the array and cut out the most recent image that we already added to the main container
let fetchOtherPictures = fetchPictures().then((otherPictures) => {
  //empty the picture container first
  picturesContainer.innerHTML = ``;
  let otherPic = otherPictures.reverse().slice(1);
  console.log({ otherPic });
  otherPic.forEach((item) => {
    let pic2container = document.createElement(`div`);
    picturesContainer.appendChild(pic2container);

    //get date for each picture
    let date = document.createElement(`h3`);
    date.textContent = item.date;
    pic2container.appendChild(date);

    //get img for each picture and make it so that if the picture media type is a video, its thumbnail is displayed
    let img = document.createElement(`img`);
    if (item.media_type === `image`) {
      img.src = item.url;
    } else {
      img.src = item.thumbnail_url;
    }

    pic2container.appendChild(img);
  });
});

//#TODO: add an EventListener to the other pictures so that when clicking on them, the details-container becomes visible (display is changed from none to flex)
