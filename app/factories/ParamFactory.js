function ParamFactory () {

  //If this Factory is changed into a Provider, these can be configured at startup.
  var VARIABLE_PREFIX = '@@';
  var CONTROL_TYPE_VARIABLE = 'DROPDOWN';

  function Param () {

      this.name = undefined;
      this.type = undefined;
      this.path = undefined;
      this.value = undefined;
      this.oldValue = undefined;
      this.defaultValue = undefined;
      this.isRequired = false;
      this.isVariable = false;
      this.isComplex = false;
      this.isBooleanOutput = false;
      this.controlType = undefined;
      this.optionValues = undefined;
  }

  Param.prototype.setValue = function (value) {

      if (typeof value === 'string' && value.indexOf(VARIABLE_PREFIX) === 0) {
          this.isVariable = true;
          //this.controlType = CONTROL_TYPE_VARIABLE;
          this.value = parseValue(value);
      }
      else {
          this.isVariable = false;
          this.value = value;
      }

      if (this.oldValue === undefined) {
          this.oldValue = this.value;
      }
  };

  Param.prototype.getValue = function () {
      return this.value;
  };

  Param.prototype.getOldValue = function () {
      return this.oldValue;
  };

  Param.prototype.getJsonValue = function () {

      if (this.name === 'Entity to search in') {
          return this.value;
      }

      return this.isVariable ? VARIABLE_PREFIX + '{' + this.value + '}' : this.value;
  };

  Param.prototype.isEmpty = function () {
      return this.value === undefined || this.value === null || this.value === '';
  };

  Param.prototype.hasChanged = function () {
      return this.value !== this.oldValue;
  };

  Param.prototype.clone = function () {

      var inst = new Param();

      inst.name = this.name;
      inst.type = this.type;
      inst.path = this.path;
      inst.value = this.value;
      inst.isRequired = this.isRequired;
      inst.isVariable = this.isVariable;
      inst.controlType = this.controlType;
      inst.optionValues = this.optionValues;

      return inst;
  };


  ////FACTORY API

  function parseValue (value) {
      if (typeof value === 'string' && value.indexOf(VARIABLE_PREFIX) === 0) {

          value = value.substring(2);

          if (value.indexOf('{') === 0) {
              value = value.substring(1, value.length - 1);
          }
      }

      return value;
  }

  function createEmpty () {
      return new Param();
  }

  function createVariable (type, value, complex) {
      var p = new Param();

      value = parseValue(value);

      p.value = value;
      p.oldValue = value;
      p.type = type;
      p.isVariable = true;
      p.isComplex = complex === true;
      p.controlType = CONTROL_TYPE_VARIABLE;

      return p;
  }

  function createFromJson (rawData, value) {

      var inst = new Param();

      inst.type = rawData.type;
      inst.name = rawData.name;
      inst.path = rawData.path;
      inst.controlType = rawData.controlType;
      inst.defaultValue = rawData.defaultValue;
      inst.isRequired = rawData.required;
      inst.optionValues = rawData.optionValues;

      if (inst.controlType === CONTROL_TYPE_VARIABLE) {
          inst.isVariable = true;
      }

      var firstValue = inst.defaultValue;

      if (value !== null && value !== undefined) {
          firstValue = value;
      }

      inst.setValue(firstValue);

      return inst;
  }

  return {
      createEmpty: createEmpty,
      createVariable: createVariable,
      createFromJson: createFromJson,
      parseValue: parseValue
  };
}

export default new ParamFactory();
