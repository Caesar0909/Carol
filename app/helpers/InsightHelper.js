class InsightHelper {

    static getFormattedAddress (address) {

        address = address || {};

        if (!address.city && !address.country) {
            return '';
        }

        const street = address.address1 ? address.address1.trim() : '';
        const city = (address.city || '') + '/' + (address.state || '');
        const country = address.country || '';
        const zipCode = address.zipCode || '';

        return street + ', ' + city + ', ' + country + ', ' + zipCode;
    }

    static getAddressMap (valueMap) {

        let address = valueMap.mdmaddress || {};

        if (address.constructor === Array) {
            address = address[0] || {};
        }

        return {
            address1: address.mdmaddress1 || '',
            address2: address.mdmaddress2 || '',
            address3: address.mdmaddress3 || '',
            city: address.mdmcity || '',
            country: address.mdmcountry || '',
            state: address.mdmstate || '',
            zipCode: address.mdmzipcode || ''
        };
    }

    static getFormattedCustomer (goldenRecord) {

        const valueMap = goldenRecord;

        const record = {
            id: valueMap.mdmId,
            name: valueMap.mdmcompanyname,
            code: valueMap.mdmcompanycode,
            dba: valueMap.mdmdba,
            homePage: valueMap.mdmhomepage,
            invoices: valueMap.invoices,
            nps: valueMap.nps,
            opportunities: valueMap.opportunities,
            stateTax: valueMap.mdmstatetaxid,
            startDate: valueMap.mdmfirstpurchasedate,
            taxId: valueMap.mdmtaxid,
            tickets: valueMap.tickets
        };

        record.addressMap = InsightHelper.getAddressMap(valueMap);

        if (valueMap.mdmemail) {
            record.emails = valueMap.mdmemail.map((item) => {
                return item.mdmemailaddress;
            });
        }

        if (valueMap.mdmphone) {
            record.phones = valueMap.mdmphone.map((item) => {
                return item.mdmphonenumber;
            });
        }

        record.address = InsightHelper.getFormattedAddress(record.addressMap);

        return record;
    }

    static getFormattedRecords (dataModel, records) {

        if (dataModel.name === 'mdmcustomer') {
            return records.map(InsightHelper.getFormattedCustomer);
        }

        const profileTitle = dataModel.profileTitleFields[0];

        return records.map((record) => {
            return {
                id: record.mdmId,
                label: record[profileTitle]
            };
        });
    }

    // ex dashboard helper
    static getAggregationsOptions () {
        return [
            {
                description: 'Count',
                value: 'COUNT'
            }
        ];
    }

    static getAbsoluteDateOptions () {
        return [
            {
                description: 'After',
                value: 'AFTER'
            },
            {
                description: 'Before',
                value: 'BEFORE'
            },
            {
                description: 'Between',
                value: 'BETWEEN'
            }
        ];
    }

    static getDistanceOptions () {
        return [
            {
                description: '10 km',
                value: '10km'
            },
            {
                description: '25 km',
                value: '25km'
            },
            {
                description: '50 km',
                value: '50km'
            },
            {
                description: '100 km',
                value: '100km'
            }
        ];
    }

    static getRelativeDateOptions () {
        return [
            {
                description: 'Days',
                value: 'DAYS'
            },
            {
                description: 'Weeks',
                value: 'WEEKS'
            },
            {
                description: 'Months',
                value: 'MONTHS'
            },
            {
                description: 'Years',
                value: 'YEARS'
            }
        ];
    }

    static getStringFunctions () {
        return [
            {
                description: 'Contains',
                value: 'CONTAINS'
            },
            {
                description: 'Equals',
                value: 'EQUALS'
            },
            {
                description: 'Is Empty',
                value: 'IS_EMPTY',
                isBoolean: true
            },
            {
                description: 'Is Not Empty',
                value: 'IS_NOT_EMPTY',
                isBoolean: true
            }
        ];
    }

    static getNumRowsOptions () {
        return [
            {
                description: '10',
                value: '10'
            },
            {
                description: '25',
                value: '25'
            },
            {
                description: '40',
                value: '40'
            },
            {
                description: '50',
                value: '50'
            }
        ];
    }

    static getVisualizationOptions () {
        return [
            {
                description: 'Bar Chart',
                value: 'BAR'
            },
            {
                description: 'Line Chart',
                value: 'LINE'
            },
            {
                description: 'Score',
                value: 'SCORE'
            },
            {
                description: 'Table',
                value: 'TABLE'
            }
        ];
    }

    static hasFilterErrors (filters) {

        filters = filters || [];

        return filters.some((filter) => {
            return !InsightHelper.filterIsValid(filter);
        });
    }

    static filterIsValid (filter) {
        let isValid = true;

        if (filter.source === 'fields') {
            if (!filter.fieldName ||
                !filter.filterType ||
                (
                    !(filter.value || filter.value === false) &&
                    filter.filterType.id !== 'isEmpty' &&
                    filter.filterType.id !== 'notIsEmpty'
                )) {
                isValid = false;
            }
            else if (filter.filterType.input === 'DATES') {
                if (!filter.value.length ||
                    !filter.value[0] ||
                    !filter.value[1]) {
                    isValid = false;
                }
            }
        }
        else {
            isValid = false;
        }

        return isValid;
    }

    static setChartColors (items) {

        const colors = [
            ['#ffffff', '#f8f8f8', '#e9ebeb', '#e9ebeb', '#55add1', '#55add1'],
            ['#ffffff', '#f8f8f8', '#f7c1ba', '#f7c1ba', '#f78474', '#f78474'],
            ['#ffffff', '#f8f8f8', '#f8e3ad', '#f8e3ad', '#f7d272', '#f7d272'],
            ['#ffffff', '#f8f8f8', '#e9ebeb', '#e9ebeb', '#96afb9', '#96afb9']
        ];

        if (!items) {
            return colors[0];
        }

        items = items.map((item, index) => {
            if (item.type === 'BAR' || item.type === 'LINE') {
                item.data = item.data || {};
                item.data.style = colors[index % colors.length];
            }

            return item;
        });

        return items;
    }

    static getChartData (data) {

        if (data.dashboard.type === 'LINE') {
            return InsightHelper.getLineChartData(data);
        }
        else if (data.dashboard.type === 'TABLE') {
            return InsightHelper.getTableData(data);
        }
        else if (data.dashboard.type === 'SINGLE') {
            return InsightHelper.getSingleData(data);
        }

        return InsightHelper.getDefaultChartData(data);
    }

    static getSingleData (data) {
        return {
            computedValues: data.dashboard.computedValues,
            columns: data.dashboard.columns,
            data: {},
            label: data.dashboard.label,
            numRows: data.dashboard.numRows,
            total: data.dashboard.total,
            totalLocale: data.dashboard.totalLocale,
            type: data.dashboard.type
        };
    }

    static getTableData (data) {
        return {
            columns: data.dashboard.columns,
            computedValues: data.dashboard.computedValues,
            data: {},
            label: data.dashboard.label,
            numRows: data.dashboard.numRows,
            records: data.chartData.records ? data.chartData.records : data.chartData,
            totalRecords: data.chartData.total,
            type: data.dashboard.type
        };
    }

    static getDefaultChartData (dashboardData) {

        const chartData = dashboardData.chartData;
        const dashboardInfo = dashboardData.dashboard;
        const maxLabelLength = 20;

        chartData.buckets = chartData.buckets || [];

        chartData.buckets.forEach((value) => {
            if (value.label.length > maxLabelLength) {
                value.label = value.label.substr(0, maxLabelLength - 3) + '...';
            }
        });

        return {
            id: dashboardInfo.id,
            type: dashboardInfo.type,
            data: {
                callback: function () {},
                dataModel: dashboardInfo.dataModel,
                filters: dashboardInfo.filters,
                label: dashboardInfo.label,
                name: dashboardInfo.label,
                options: {
                    xAxis: {
                        maxLength: maxLabelLength,
                        tickValues: chartData.tickValues,
                        tickFormat: chartData.tickFormat,
                        axisLabel: dashboardInfo.xAxisLabel || ''
                    },
                    yAxis: {
                        axisLabel: dashboardInfo.yAxisLabel || ''
                    }
                },
                type: dashboardInfo.type,
                values: chartData.buckets
            }
        };
    }

    static getLineChartData (dashboardData) {
        return InsightHelper.getDefaultChartData(dashboardData);
    }
}

export default InsightHelper;
