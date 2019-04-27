$(document).ready( function () {


 var articleId;
 var noteId;
  function renderArticles() {
    $.getJSON("/articles", function(data) {
      
      for (i = 0; i < data.length; i++) {
        articleId = data[i]._id;
        noteId = data[i].note;
        // Show the article 

        $("#articles").append("<p data-id='" + data[i]._id + "'> TITLE: " + data[i].title + "<br />AUTHOR: " + data[i].author + "<br />LINK: " + data[i].link + "</p>");
        renderNotes(articleId);
    }
  }); 
} 
  function renderNotes(id) {
    if (noteId.length) {

      for(j=0; j < noteId.length; j++) {

        // Append a link to the note, against the article
        $.getJSON("/notes/" + noteId[j], function(result) {

          if (result !== null) {
          
          console.log(result)
          $("[data-id=" + id + "]").append("<br> COMMENT: " + result.body + "  <button note-id='" + result._id +"' type='button'>Delete</button>");
        }
      });
      }
      
    }

  } 

  renderArticles();
 

  $(document).on("click", "button", function() {
    // DELETE ROUTE

    var thisId = $(this).attr("note-id");
    
    


  
    

    $.ajax({
      method: "DELETE",
      url: "/notes/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        renderArticles();
        location.reload();
        
      });
      
  });
  
  // Whenever someone clicks a p tag
  $(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
});