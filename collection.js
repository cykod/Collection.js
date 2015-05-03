(function(global) {

  var collections = {};

  var dataMatch = /^\[data\-([^\]]+)\]$/i;
  var attrMatch =  /^\[([^\]]+)\]$/i;


  function getAttributeValue(elem, selector) {
    var attrAttribute, attributeValue = "", dataAttribute;

    if(dataAttribute = selector.match(dataMatch)) {
      var attr = dataAttribute[1];
      attributeValue = "" + ($(elem).data(attr)||"")
    } else if(attrAttribute = selector.match(attrMatch)) {
      var attr = dataAttribute[1];
      attributeValue= ($(elem).attr(attr)||"")
    } else {
      var $child = $(elem).find(selector);

      if($child.first().is("input")) {
        attributeValue = $child.val();
      } else if($child.length > 0) {
        attributeValue = $child.map(function() { return $(this).text(); }).get().join(" ").toLowerCase();
      }
    }

    return attributeValue;
  }

  $.fn.extend({


    ordered: function(facet) {
      var collection = collections[this.selector || this];

      if(!collection) { console.log("invalid collection"); return; }

      var selector = collection.filters[facet];
      if(!selector) { console.log("invalid filter"); return; }

      var attributeValue = null;

      var $sorted = $(this);

      $sorted.sort(function(a,b) {
        
        var aValue = getAttributeValue(a,selector);
        var bValue = getAttributeValue(b,selector);

        if(!isNaN(aValue) && !isNaN(bValue)) {
          aValue = parseFloat(aValue);
          bValue = parseFloat(bValue);
        } else {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if(aValue > bValue) {
          return 1;
        }
        if(aValue < bValue) {
          return -1;
        }
        return 0;

      });

      var $container = $sorted.parent();

      $sorted.detach().appendTo($container);

      if(collection.ordered) {
        collection.ordered();
      }

      if(collection.update) {
        collection.update();
      }


      return $(this.selector || this);

    },

    filtered: function(facet, value, strictFilter) {
      value = "" + (value || "");

      var collection = collections[this.selector || this];

      if(!collection) { console.log("invalid collection"); return; }
      collection.facets = collection.facets || {};
      collection.facets[facet] = value;

      var selector = collection.filters[facet];
      if(!selector) { console.log("invalid filter"); return; }

      $(this).each(function() {


        var filters = $(this).data("filters") || {};

        var attributeValue = getAttributeValue(this,selector);

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


      if(collection.filtered) {
        collection.filtered();
      }
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
