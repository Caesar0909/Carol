import tsDataModelService from 'totvslabs-ui-framework/react-native/rest/services/dataModel.service.js';

import GoldenEntityFactory from './GoldenEntityFactory';
import { sortBy, convertArrayToMap } from '../helpers/utils/array';

class DataModelProductionManager {
    constructor (descriptors) {
        this.descriptors = sortBy(descriptors, 'name');
        this.descriptorMap = convertArrayToMap(descriptors, 'id');
        this.descriptorMapByName = convertArrayToMap(descriptors, 'name');
    }

    getMappedStagingTypes (id) {
        return tsDataModelService.getMappedStagingTypes(id);
    }

    getDescriptor (name) {
        return new Promise((resolve, reject) => {
            const dataModel = this.getDescriptorByName(name);

            if (dataModel) {
                resolve(dataModel);
            }
            else {
                reject('DataModel "' + name + '" NOT found!');
            }
        });
    }

    getDescriptorById (id) {
        return this.descriptorMap[id];
    }

    getDescriptorByName (name) {
        return this.descriptorMapByName[name];
    }

    getDraftDescriptor (name) {
        return this.descriptorMapByName[name];
    }

    getPublishedDescriptor (name) {
        return this.descriptorMapByName[name];
    }

    getPublishedList () {
        return this.descriptors;
    }

    getWorkingCopy (name) {
        return this.getDescriptor(name).then((descriptor) => {

            if (descriptor.isPartial) {
                return tsDataModelService.getEntityTemplate(descriptor.id).then((result) => {
                    return descriptor.update(result);
                });
            }

            return Promise.resolve(descriptor);
        });
    }

    getPossibleFieldTypes () {
        return tsDataModelService.getPossibleFieldTypes();
    }
}

export default class DataModelProductionManagerFactory {
    static getProductionDataModelDescriptors () {
        return tsDataModelService.getEntityTemplatesThatArePublished({pageSize: -1})
            .then((data) => {
                return data.hits.map((rawData) => {
                    return GoldenEntityFactory.createFromJson(rawData);
                });
            });
    }

    static createProduction () {
        return DataModelProductionManagerFactory.getProductionDataModelDescriptors().then((descriptors) => {
            return new DataModelProductionManager(descriptors);
        });
    }
}
