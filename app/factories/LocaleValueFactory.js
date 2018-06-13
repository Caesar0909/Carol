function LocaleValueFactory () {

  function LocaleValue () {

      this.value = undefined;
  }

  LocaleValue.prototype.getValue = function () {
      return this.value;
  };

  LocaleValue.prototype.toLocaleString = function () {
      // return tsResourceBundle.getLocaleStringOf(this.value);
  };

  LocaleValue.prototype.add = function (localeValue) {

      if (localeValue) {
          this.value += localeValue.value;
      }
  };

  LocaleValue.prototype.toString = function () {
      return String(this.value);
  };

  LocaleValue.prototype.clone = function () {
      return createFromValue(this.value);
  };

  function createFromValue (value) {

      var inst = new LocaleValue();

      inst.value = value;

      return inst;
  }

  return {
      createFromValue: createFromValue
  };
}

export default new LocaleValueFactory();
