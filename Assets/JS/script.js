function returnWikiData(killerName) {
  var queryURL =
    "https://en.wikipedia.org/w/api.php?action=query&titles=" +
    killerName +
    "&prop=extracts&format=json&exintro=1&origin=*";

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var responseKey = Object.keys(response.query.pages);
    var firstResponse = responseKey[0];
    var killerBio = response.query.pages[firstResponse].extract;
    $("#killer-bio").append(killerBio);
    console.log(firstResponse);
  });
}

function returnWikiImage(killerName) {
  var queryURL =
    "https://commons.wikimedia.org/w/api.php?prop=pageimages|info|redirects&gsrnamespace=6&pithumbsize=250&action=query&inprop=url&redirects=&format=json&generator=search&gsrsearch=intitle:" +
    killerName +
    "&gsrlimit=5&origin=*";

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var responseKey = Object.keys(response.query.pages);
    var firstResponse = responseKey[0];
    //url of killer's Image
    killerImg = response.query.pages[firstResponse].thumbnail.source;
    var killerHtmlTag = $("<img>");
    killerHtmlTag.attr("src", killerImg);
    $("#killer-bio").prepend(killerHtmlTag);
    favoriteKillers.push({ name: killerName, image: killerImg });
  });
}
function callMovie(killerName) {
  var queryURL =
    "https://www.omdbapi.com/?s=" +
    killerName +
    "&y=&type=movie&apikey=41a87e5";
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (data) {
    var movieRow = $("<div>").addClass("row items-row");
    var responseArray = data.Search;
    for (var i = 0; i < responseArray.length; i++) {
      var card = $("<div>").addClass("card");
      var imageDiv = $("<div>").addClass(
        "card-image poster waves-effect waves-block waves-light"
      );
      var img = $("<img>")
        .addClass("activator")
        .attr("src", responseArray[i].Poster + "")
        .attr("alt", responseArray[i].Title);
      if (responseArray[i].Poster === "N/A") {
        img.attr("src", "./assets/images/2297419_orig.jpg");
      }
      var cardReveal = $("<div>")
        .addClass("card-reveal")
        .attr("id", "movie-reveal-" + i);
      var cardTitle = $("<span>")
        .addClass("card-title grey-text text-darken-4")
        .text("" + responseArray[i].Title);
      $("<i>")
        .addClass("material-icons right")
        .text("close")
        .appendTo(cardTitle);
      cardTitle.appendTo(cardReveal);
      imageDiv.append(img).appendTo(card);
      cardReveal.appendTo(card);
      card.appendTo(movieRow);
    }
    movieRow.appendTo("#movies");
  });
}

function callBooks(killerName) {
  $.ajax({
    url:
      "https://www.googleapis.com/books/v1/volumes?q=" +
      killerName +
      "+subject",
    method: "GET",
  }).then(function (response) {
    var row = $("<div>").addClass("row items-row");
    var responseArray = response.items;
    console.log(responseArray);
    responseArray.forEach(function (element, index) {
      var cardInfo = "<p>Synopsis: " + element.volumeInfo.description + "</p>";
      // If no synopsis is provided, we just list the publisher info
      if (!element.volumeInfo.description) {
        cardInfo =
          "<h6>Published by " +
          element.volumeInfo.publisher +
          " on " +
          moment(element.volumeInfo.publishedDate, "YYYY-MM-DD").format(
            "MMMM Do, YYYY"
          ) +
          "</p>";
      }
      $("<div>")
        .addClass("card")
        .html(
          '<div class="poster card-image waves-effect waves-block waves-light"> <img class="activator" src="' +
            element.volumeInfo.imageLinks.thumbnail +
            '/400/200" alt="Cover for ' +
            element.volumeInfo.title +
            '"> </div> <div class="card-reveal" id="book-reveal-' +
            index +
            '"> <span class=card-title grey-text text-darken-4">' +
            element.volumeInfo.title +
            '<i class="material-icons right">close</i></span> <h6>By: ' +
            element.volumeInfo.authors[0] +
            "</h6>" +
            cardInfo +
            "</div>"
        )
        .appendTo(row);
    });
    row.appendTo("#books");
  });
}

function switchScreen() {
  event.preventDefault();
  $("#header-img").remove();
  $("#favorites").remove();
  $("#header").addClass("left");
}

function callTv(killerName) {
  var queryURL =
    "https://www.omdbapi.com/?s=" +
    killerName +
    "&y=&type=series&apikey=41a87e5";
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (data) {
    console.log(data);
    var seriesRow = $("<div>").addClass("row items-row");
    var responseArray = data.Search;
    for (var i = 0; i < responseArray.length; i++) {
      var card = $("<div>").addClass("card");
      var imageDiv = $("<div>").addClass(
        "poster card-image waves-effect waves-block waves-light"
      );
      var img = $("<img>")
        .addClass("activator")
        .attr("src", responseArray[i].Poster + "/400/200")
        .attr("alt", responseArray[i].Title);
      if (responseArray[i].Poster === "N/A") {
        img.attr("src", "./assets/images/2297419_orig.jpg");
      }
      var cardReveal = $("<div>")
        .addClass("card-reveal")
        .attr("id", "movie-reveal-" + i);
      var cardTitle = $("<span>")
        .addClass("card-title grey-text text-darken-4")
        .text("" + responseArray[i].Title);
      $("<i>")
        .addClass("material-icons right")
        .text("close")
        .appendTo(cardTitle);
      cardTitle.appendTo(cardReveal);
      imageDiv.append(img).appendTo(card);
      cardReveal.appendTo(card);
      card.appendTo(seriesRow);
    }
    movieRow.appendTo("#tv");
  });
}
var favoriteKillers;
localStorage.getItem("Killers", favoriteKillers);
var favoriteKillers = JSON.parse(favoriteKillers);
if (favoriteKillers) {
  favoriteKillers.forEach(function (element) {
    var favCard = $("<div>").addClass("card killer-card").val(element.name);
    $("<img>")
      .attr("src", element.image)
      .attr("alt", "Image of " + element.name)
      .appendTo(favCard);
    $("<h6>").text(element.name).appendTo(favCard);
    favCard.appendTo("#favorites");
  });
  // This else turns it into an empty array so that it can be pushed to in returnWikiImage
} else {
  favoriteKillers = [];
}
//On Buttion Click to run search functions
$("#search-btn").on("click", function (event) {
  event.preventDefault();

  //set variable for what person the end user is searching for
  var killerSearchInput = $("#search-bar").val().trim();
  const str = killerSearchInput;
  //Wiki doesnt like it when we dont capitlize the first word of the search this fixes that
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const caps = str.split(" ").map(capitalize).join(" ");
  killerSearchInput = caps;

  ///clear elements
  if (
    ($("#movie-check").prop("checked") ||
      $("#book-check").prop("checked") ||
      $("#tv-check").prop("checked")) &&
    killerSearchInput !== ""
  ) {
    console.log($("search-bar").val);
    switchScreen();
    returnWikiImage(killerSearchInput);
    returnWikiData(killerSearchInput);
    if ($("#movie-check").prop("checked")) {
      callMovie(killerSearchInput);
    }
    if ($("#book-check").prop("checked")) {
      callBooks(killerSearchInput);
    }
    if ($("#tv-check").prop("checked")) {
      callTv(killerSearchInput);
    }
  } else {
    $("<div>")
      .addClass("modal")
      .attr("id", "modal1")
      .html(
        `<div class="modal-content"> <h5>You're killing me!</h5> <p>What are we even doing if you're not going to search for something?!</p> </div> <div class="modal-footer"> <a href="#!" class="modal-close waves-effect waves-green btn-flat">OK</a> </div>`
      )
      .appendTo(".container");
    // Got the following solution for making the modal appear from https://stackoverflow.com/questions/40430576/how-i-can-open-a-materialize-modal-when-a-window-is-ready. I wish I understood most of it.
    const modalVar = document.getElementById("modal1");
    const instance = M.Modal.init(modalVar, { dismissible: false });
    instance.open();
  }
});
