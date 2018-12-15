// does jquery support es6??

// grab all scraped jobs
$.getJSON("/jobs", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#jobs")
        .append("<div class='card col-lg-6''><div class='card-body'><a href=" + data[i].link + "><h5 data-id='" + data[i]._id + "' class='card-title'>" + data[i].title + "</h5></a><p class='card-text'>" + data[i].summary + "</p></h5></div></div>")
    }
  });