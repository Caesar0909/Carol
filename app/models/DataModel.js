// @flow

const ICON_MAP = {
    mdmcompany: 'NewBuildings',
    mdmopportunity: 'NewBuildings',
    mdmcustomer: 'NewBuildings',
    mdmproduct: 'NewBuildings'
};

class DataModel {
    static createObjectFromMdmFields (rawData: Object) {

        const lang = 'en-US';

        const obj = {
            id: rawData.mdmId,
            name: rawData.mdmName,
            label: rawData.mdmLabel[lang],
            description: rawData.mdmDescription[lang],
            lastUpdated: new Date(rawData.mdmLastUpdated),
            created: new Date(rawData.mdmCreated),
            groupName: rawData.mdmGroupName,
            profileTitleFields: rawData.mdmProfileTitleFields,
            tags: rawData.mdmTags,
            fields: rawData.mdmFields,
            transactionDataModel: rawData.mdmTransactionDataModel
        };

        if (rawData.mdmEntityTemplateType && rawData.mdmEntityTemplateType.length) {
            obj.type = rawData.mdmEntityTemplateType[0].mdmName;
            obj.typeId = rawData.mdmEntityTemplateTypeIds[0];
        }

        if (rawData.mdmVerticalIds && rawData.mdmVerticalIds.length) {
            obj.mdmVerticals = rawData.mdmVerticalIds;
            obj.segmentId = rawData.mdmVerticalIds[0];
        }

        obj.icon = ICON_MAP[obj.name];

        return obj;
    }

    static createObjectFromMdmRecord (rawData: Object) {
        return {
            ...this.createObjectFromMdmFields(rawData)
        };
    }
}

export default DataModel;
