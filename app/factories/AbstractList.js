function AbstractList () {

  function extendAbstractClass (instance, createItemFactory, onItemDelete) {

      var prototype = Object.getPrototypeOf(instance);

      prototype.isEmpty = isEmpty;
      prototype.addItemAt = addItemAt;
      prototype.reorderItem = reorderItem;
      prototype.addItem = addItem;
      prototype.removeItem = removeItem;
      prototype.removeItemAt = removeItemAt;
      prototype.getItemAt = getItemAt;
      prototype.map = map;
      prototype.indexOf = indexOf;
      prototype.forEach = forEach;
      prototype.filter = filter;
      prototype.createItemFactory = createItemFactory;
      prototype.onItemDelete = onItemDelete;

      //instance.$$itemProto = itemProto;
      instance.listItems = [];
  }

  function isEmpty () {
      return this.listItems.length === 0;
  }

  function getItemAt (index) {
      return this.listItems[index];
  }

  function addItem (itemData) {
      return this.addItemAt(itemData);
  }

  function removeItem (item) {

      var fromIndex = this.listItems.indexOf(item);

      this.removeItemAt(item, fromIndex);
  }

  function removeItemAt (item, fromIndex) {

      if (fromIndex >= 0) {

          var doDelete = true;

          if (this.onItemDelete) {
              doDelete = this.onItemDelete(item);
          }

          if (doDelete) {
              this.listItems.splice(fromIndex, 1);
          }
      }
  }

  function map (callback) {
      return this.listItems.map(callback);
  }

  function filter (callback) {
      return this.listItems.filter(callback);
  }

  function forEach (callback) {
      return this.listItems.forEach(callback);
  }

  function indexOf (item, fieldMatch) {
      if (!fieldMatch) {
          return this.listItems.indexOf(item);
      }

      var index = -1;

      this.listItems.some(function (itemData, idx) {
          var matched = true;

          for (var i in fieldMatch) {
              if (fieldMatch.hasOwnProperty(i)) {
                  if (itemData[i] !== fieldMatch[i]) {
                      matched = false;
                      break;
                  }
              }
          }
          if (matched) {
              index = idx;
          }

          return matched;
      });

      return index;
  }

  function addItemAt (itemData, index) {

      var item = this.createItemFactory(itemData);

      var len = this.listItems.length;

      if (isNaN(index)) {
          index = len;
      }

      this.listItems.splice(index, 0, item);

      return item;
  }

  function reorderItem (item, toIndex) {

      var fromIndex = this.listItems.indexOf(item);

      if (fromIndex < toIndex) {
          toIndex--;
      }

      if (toIndex < 0) {
          toIndex = 0;
      }
      else if (isNaN(toIndex)) {
          toIndex = this.listItems.length;
      }

      if (fromIndex >= 0 && fromIndex !== toIndex) {

          this.listItems.splice(fromIndex, 1);

          this.listItems.splice(toIndex, 0, item);
      }
  }

  return {
      extend: extendAbstractClass
  };
}

export default new AbstractList();
