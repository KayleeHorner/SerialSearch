//OMDB movie call
function callMovie() {
  //var title = "" This needs the users input before it can be implemented
  var queryURL =
    "https://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=41a87e5";
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (res) {
    console.log(res);
    var availableMovies = {};
    $("<div>").addClass("").attr("id", "movie-list").appendTo("#movie-div");
  });
}

function returnWikiData(killername) {}

function returnWikiImage(killerimage) {}

function callTv() {}

function callBooks(killerName) {
  $.ajax({
    url:
      "https://www.googleapis.com/books/v1/volumes?q=" +
      killerName +
      "+subject",
    method: "GET",
  }).then(function (response) {});
}

function switchScreen() {}

function renderResults() {}
