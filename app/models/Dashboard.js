// @flow
import Realm from 'realm';

import realm from '../helpers/realm';

import Insights from './Insights';
import InsightManager from '../helpers/InsightManager';

class Dashboard {

    static createObjectFromMdmFields (mdmFields: Object) {
        return {
            id: mdmFields.mdmId,
            label: mdmFields.mdmConfigLabel,
            accessType: mdmFields.mdmAccessType,
            insightIds: mdmFields.mdmInsightConfigurationIds
        };
    }

    static createObjectFromRealm (realmObj: Object) {
        return {
            id: realmObj.id,
            label: realmObj.label,
            accessType: realmObj.accessType,
            insightIds: realmObj.insightIds.concat()
        };
    }

    static createObjectFromMdmRecord (rawData: Object) {

        const result = this.createObjectFromMdmFields(rawData);

        //Only for single Dashboard Get
        if (rawData.mdmInsightConfigurations) {

            result.insights = rawData.mdmInsightConfigurations.map((mdmInsightConfiguration) =>
                Insights.createObjectFromMdmRecord(mdmInsightConfiguration)
            );

            //Run the query for each Insight. These run asynchronous and should not wait before loading page
            //Show ellipsis loader while !insight.result
            // result.insights.forEach((insight) => {
            //     try {
            //         InsightManager.query(insight.config).then((insightResult) => {
            //             if (insightResult.chartData) {
            //                 insightResult.chartData.insightId = insight.id;
            //             }

            //             insight.result = insightResult;
            //         });
            //     }
            //     catch (e) {
            //         insight.result = {};
            //     }

            // });
            // result.insights.forEach((insight) => {
            //     try {
            //         InsightManager.queryAggregations(insight.config).then((insightResult) => {
            //             if (insightResult.chartData) {
            //                 insightResult.chartData.insightId = insight.id;
            //             }

            //             insight.result = insightResult;
            //         });
            //     }
            //     catch (e) {
            //         insight.result = {};
            //     }

            // });
        }


        if (rawData.mdmDashboardConfiguration) {
            result.config = JSON.parse(rawData.mdmDashboardConfiguration) || {};
        }

        return result;
    }

    static createObjectFromRealmObject (realmObject: Realm.Object) {

        const result = this.createObjectFromRealm(realmObject);

        if (realmObject.insights && realmObject.insights.length) {

            result.insights = realmObject.insights.map((config) =>
                Insights.createObjectFromRealmObject(config)
            );
        }

        if (realmObject.config) {
            result.config = JSON.parse(realmObject.config) || {};
        }

        return result;
    }

    // PERSISTENCE

    static createPersistObj (modelObj) {
        const obj = {};

        obj.id = modelObj.id;
        obj.label = modelObj.label;
        obj.accessType = modelObj.accessType;
        obj.insights = modelObj.insights;

        obj.config = JSON.stringify(modelObj.config);

        return obj;
    }

    static create (dashboard: Object) {
        realm.write(() => {
            realm.create('Dashboard', Dashboard.createPersistObj(dashboard));
        });
    }

    static update (mdmDataId: string, updateObject: Object) {
        const dashboard = this.getWithId(mdmDataId);

        if (dashboard) {
            realm.write(() => {
                Object.assign(dashboard, Dashboard.createPersistObj(updateObject));
            });
        }
    }

    static delete (mdmDataId: string) {
        const dashboard = this.getWithId(mdmDataId);

        if (dashboard) {
            realm.write(() => {
                realm.delete(dashboard);
            });
        }
    }

    static getWithId (mdmDataId: string) {

        const results = realm.objects('Dashboard').snapshot();

        return results.filtered('mdmData.id = $0', mdmDataId).values().next().value;
    }
}

export default Dashboard;
