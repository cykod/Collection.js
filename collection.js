(function(global) {

  var collections = {};

  var dataMatch = /^\[data\-([^\]]+)\]$/i;
  var attrMatch =  /^\[([^\]]+)\]$/i;

  $.fn.extend({

    filtered: function(facet, value, strictFilter) {
      value = "" + (value || "");

      var collection = collections[this.selector || this];

      if(!collection) { console.log("invalid collection"); return; }
      collection.facets = collection.facets || {};
      collection.facets[facet] = value;

      var selector = collection.filters[facet];
      if(!selector) { console.log("invalid filter"); return; }

      $(this).each(function() {

        var dataAttribute, attrAttribute, attributeValue = "";

        var filters = $(this).data("filters") || {};

        if(dataAttribute = selector.match(dataMatch)) {
          var attr = dataAttribute[1];
          attributeValue = "" + ($(this).data(attr)||"")
        } else if(attrAttribute = selector.match(attrMatch)) {
          var attr = dataAttribute[1];
          attributeValue= ($(this).attr(attr)||"")
        } else {
          var $child = $(this).find(selector);

          if($child.first().is("input")) {
            attributeValue = $child.val();
          } else if($child.length > 0) {
            attributeValue = $child.map(function() { return $(this).text(); }).get().join(" ").toLowerCase();
          }
        }

        if(!value) {
          filters[facet] = true;
        } else if(strictFilter) {
          filters[facet] = attributeValue.toLowerCase() == value.toLowerCase()
        } else {
          filters[facet] =  attributeValue.toLowerCase().indexOf(value.toLowerCase()) != -1
        }

        $(this).data("filters",filters);
      });

      this.updateCollection();

      return $(this.selector || this);
    },

    updateCollection: function() {

      var collection = collections[this.selector || this];

      $(this).each(function() {
        var $this = $(this);
        var filters = $this.data("filters") || {};
        var visible = true;
        $.each(filters,function(key,value) {
          if(!value) { visible = false; }
        });

        var existing = $this.data("collectionVisible");
        if(existing === undefined) { existing = true; }

        if(existing != visible) {
          if(!visible) { 
            if(collection.hide) {
              collection.hide($this);
            } else {
              $this.hide();
            }
          } else {
            if(collection.show) {
              collection.show($this);
            } else {
              $this.show();
            }
          }
        }

        $this.data("collectionVisible",visible);

      });

      if(collection.update) {
        collection.update();
      }
    },

    collection: function(options) {
      var selector = this.selector || this;
      
      collections[selector] = options;
      return $(selector);
    }
  })


})(window);
