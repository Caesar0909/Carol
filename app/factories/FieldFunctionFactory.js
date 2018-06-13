import ParamFactory from './ParamFactory';
import tsUser from './User';
import { assignValuesToProperties } from '../helpers/utils/array';

function FieldFunctionFactory () {

  var fieldFunctionMap = {};

  function FieldFunction () {

      this.id = undefined;
      this.name = undefined;
      this.functionType = undefined;
      this.returnType = undefined;
      this.createVarFlag = undefined;
      this.isNested = false;
      this.parameters = undefined;
      this.categoryType = undefined;
      this.invert = false;
      this.oldInvert = false;
  }

  FieldFunction.prototype.setParameterValueAt = function (value, index) {

      var params = this.parameters;

      if (params && params.length > index) {

          params[index].setValue(value);
      }
  };

  FieldFunction.prototype.hasInvalidFormErrors = function () {

      if (!this.id) {
          return true;
      }

      var invalidParam;

      this.parameters.some(function (param) {
          if (param.controlType === 'DROPDOWN' && !param.isVariable) {
              param.setValue(undefined);
              invalidParam = param;

              return true;
          }
          else if (param.isRequired && param.isEmpty()) {
              invalidParam = param;

              return true;
          }
      });

      return invalidParam;
  };

  FieldFunction.prototype.hasChanged = function () {

      if (!this.id) {
          return true;
      }

      if (this.invert !== this.oldInvert) {
          return true;
      }

      var changed = false;

      this.parameters.some(function (param) {
          if (param.hasChanged()) {
              changed = true;
          }

          return changed;
      });


      return changed;
  };

  FieldFunction.prototype.toJson = function () {

      var params = [];

      if (!this.id) {
          return params;
      }

      this.parameters.forEach(function (param, index) {
          if (param.type === 'DATA_MODEL') {
              var tmp = param.clone();

              tmp.value += '.' + this.parameters[index + 1].value;

              params.push(tmp.getJsonValue());
          }
          else if (param.type !== 'DATA_MODEL_FIELD') {
              if (param.isRequired || !param.isEmpty()) {
                  params.push(param.getJsonValue());
              }
          }
      }, this);

      return params;
  };

  ////FACTORY API

  function createFromJson (rawData, paramValues, invert) {

      var inst = new FieldFunction();

      inst.id = rawData.mdmId;
      inst.name = rawData.mdmName;
      inst.functionType = rawData.mdmFunctionType;
      inst.returnType = rawData.mdmReturnType;
      inst.createVarFlag = rawData.mdmCreateNewVariable;
      inst.isBoolean = inst.returnType === 'BOOLEAN';
      inst.isNested = rawData.mdmName === 'IF';
      inst.categoryType = inst.isBoolean ? 'boolean' : 'transform';
      inst.invert = inst.oldInvert = invert;
      inst.label = rawData.mdmLabel[tsUser.language];

      var params = rawData.mdmParameters;

      if (params && params.length) {

          if (paramValues === undefined || params.length >= paramValues.length) {
              inst.parameters = params.map(function (rawParam, idx) {
                  return ParamFactory.createFromJson(rawParam, paramValues && paramValues[idx]);
              });
          }
          else {
              inst.parameters = paramValues.map(function (rawValue, idx) {
                  var rawParam = params[idx] || { type: 'STRING', controlType: 'DROPDOWN' };

                  return ParamFactory.createFromJson(rawParam, rawValue);
              });
          }
      }
      else {
          inst.parameters = [];
      }

      fieldFunctionMap[inst.id] = inst;

      return inst;
  }

  function createFromId (id, paramValues, invert) {

      var fieldFunction = { ...fieldFunctionMap[id] };

      fieldFunction.invert = fieldFunction.oldInvert = invert;
      fieldFunction.parameters = assignValuesToProperties(fieldFunction.parameters, paramValues, ['value', 'oldValue']);

      return fieldFunction;
  }

  function createListFromJson (rawDataList) {
      return rawDataList.map(function (rawData) {
          return createFromJson(rawData);
      });
  }

  function cloneField (fFunc, paramValues, invert) {

      var inst = new FieldFunction();

      if (!fFunc) {
          return inst;
      }

      inst.id = fFunc.id;
      inst.name = fFunc.name;
      inst.functionType = fFunc.functionType;
      inst.returnType = fFunc.returnType;
      inst.createVarFlag = fFunc.createVarFlag;
      inst.isNested = fFunc.isNested;
      inst.isBoolean = fFunc.isBoolean;
      inst.categoryType = fFunc.categoryType;
      inst.invert = inst.oldInvert = invert;
      inst.label = fFunc.label;

      var params = fFunc.parameters;

      if (params && params.length) {

          inst.parameters = params.map(function (param, idx) {

              var param2 = param.clone();

              param2.setValue(paramValues && paramValues[idx]);

              return param2;
          });
      }

      return inst;
  }

  function cloneFieldById (id, paramValues) {
      return cloneField(fieldFunctionMap[id], paramValues);
  }

  function cloneFieldFromRawData (rawData) {

      var id = rawData.mdmFieldFunctionId;

      if (fieldFunctionMap.hasOwnProperty(id)) {
          return cloneField(fieldFunctionMap[id], rawData.mdmParameterValues, rawData.mdmInvert);
      }

      createFromJson(rawData.mdmFieldFunction);

      return cloneField(fieldFunctionMap[id], rawData.mdmParameterValues, rawData.mdmInvert);
  }

  function createEmpty () {
      return new FieldFunction();
  }

  return {
      createFromJson: createFromJson,
      createFromId: createFromId,
      createListFromJson: createListFromJson,
      createEmpty: createEmpty,
      cloneFieldFromRawData: cloneFieldFromRawData,
      cloneFieldById: cloneFieldById,
      cloneField: cloneField
  };
}

export default new FieldFunctionFactory();
