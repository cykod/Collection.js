# Collection.js

Simple Collection filtering and searching API.

Requires jQuery, use alone or with packery.

# How to use

Create a collection using a particular selector

    var myCollection = $(".item").collection({
      filters: {
        // filter on text of a child member
        "title": "h2",
        // or the value of a attribute or data-attribute on the .item
        "category": "[data-category]"
      },

      update: function() { 
        // Called everytime something is filtered
      },

      // Optionally override hide and show functions

      // hide: function($elem) { $elem.hide(); },
      // show: function($elem) { $elem.fadeIn(500); },
    });

    // Call collection.filtered(filter,value) to filter the collection

    $("#blue-button").on("click",function(e) {
        myCollection.filtered("category","blue");
    });

    $("#red-button").on("click",function(e) {
        myCollection.filtered("category","red");
    });

    $("#all-button").on("click",function(e) {
        myCollection.filtered("category","");
    });

# License

Collection.js is licensed under the MIT License. Included Libraries are under their respective licenses.
    

