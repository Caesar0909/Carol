// @flow
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { TouchableOpacity, View, ScrollView, Platform, processColor } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { Map } from 'immutable';
import { BarChart } from 'react-native-charts-wrapper';

import Base360 from './Base360';

import {
    T,
    Icon,
    Container,
    RoundView,
    CardView,
    SearchCard,
    IconButton,
    RoundOption
} from '../../components';

import {
    fetchGoldenRecord,
    fetchVerticals,
    fetchRelationships
} from '../../reduxes/actions';
import {
    dataModelsSelector,
    basicRecordSelector,
    segmentsSelector,
    relationshipsSelector,
    recordRequestingSelector
} from '../../reduxes/selectors';
import { windowSize, ratio } from '../../helpers/windowSize';
import c from '../../helpers/color';
import { toLatLng } from '../../helpers/LocationHelper';
import StringUtils from '../../helpers/utils/string';
import QueryFactory from '../../helpers/QueryFactory';
import CustomerService from '../../services/CustomerService';
import DataModelService from '../../services/DataModelService';

const contacts = [
    { name: 'Mario Lesus Dalpiaz', address: 'Farroupiha, RS, Brazil' },
    { name: 'Mario Lesus Dalpiaz', address: 'Farroupiha, RS, Brazil' },
    { name: 'Mario Lesus Dalpiaz', address: 'Farroupiha, RS, Brazil' }
];

const chartMarker = {
    enabled: false,
    backgroundTint: processColor('teal'),
    markerColor: processColor('#44C4DB'),
    textColor: processColor('white')
};
const chartAnimation = {
    durationX: 500,
    durationY: 0,
    easingY: 'Linear'
};

const tempWatchlist = [
    { id: '1', label: 'Fluig' },
    { id: '2', label: 'Fluig' },
    { id: '3', label: 'Fluig' }
];

function normalizeRecordType (type) {
    //TODO: remove this function when everything is normalized
    //some environments like TOTVS has different types for Datamodels

    switch (type) {
        case 'organization':
            type = 'company';
            break;
        case 'person':
            type = 'people';
            break;
        case 'location':
        case 'ticket':
            type = 'transaction';
            break;
        default:
            type = type || 'product';
    }

    return type;
}

function getLatLng(address) {
    let location = '';

    if (address.address1) {
        location += address.address1 + ' ';
    }
    if (address.city) {
        location += address.city + ' ';
    }
    if (address.state) {
        location += address.state + ' ';
    }
    if (address.country) {
        location += address.country + ' ';
    }

    return toLatLng(location);
}

function findDataModelByName (dataModels, name) {
    return dataModels.find((dm) => dm.name === name);
}

class Company360 extends Base360 {
    componentWillMount () {
        const { record = {}, category } = this.props.navigation.state.params;
        const address = record.addresses[0] || {};

        this.record = record;
        this.category = category;
        this.address = address;

        getLatLng(address).then(latLng => {
            this.setState({ latLng });
        });

        this.props.fetchGoldenRecord({
            templateId: record.mdmData.entityTemplateId,
            goldenRecordId: record.mdmData.id
        });
        this.props.fetchVerticals();
        this.props.fetchRelationships(category.get('name'));

        this.setState({
            watching: true,
            title: category.get('label'),
            name: record.name,
            tag: '',
            description1: '',
            description2: `${address.city}, ${address.state}, ${address.country}`,
            tagModels: [],
            entity: null,
            chartRelationships: [],
            selectedCardIndex: 0,
            latLng: null,
            currentLocation: null
        });
    }

    componentDidMount () {
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                currentLocation: position
            });
        });
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.relationships !== nextProps.relationships && nextProps.relationships.size > 0) {
            const subjectEntityName = this.category.get('name');
            const relatedModels = nextProps.relationships.filter(r =>
                (subjectEntityName === r.get('mdmSourceEntityName') || subjectEntityName === r.get('mdmTargetEntityName'))
            ).map(r => {
                if (subjectEntityName === r.get('mdmSourceEntityName')) {
                    return r.get('mdmTargetEntityName');
                }

                return r.get('mdmSourceEntityName');
            });
            const tagModels = relatedModels.map(rm => {
                const searched = nextProps.dataModels.find(dm =>
                    dm.get('tags').includes('mobile') && !dm.get('transactionDataModel') && dm.get('name') === rm
                );

                return searched || Map();
            });
            const entity = tagModels.get(0);

            this._handleTagModelSelect(entity);
            this.setState({
                tagModels
            });
        }
        if (this.props.segments !== nextProps.segments) {
            const currentModel = findDataModelByName(nextProps.dataModels.toJS(), this.category.get('name'));
            const segment = nextProps.segments.find((s) => s.get('mdmId') === currentModel.segmentId);

            this.setState({
                description1: StringUtils.capitalizeFirstLetter(segment.get('mdmName'))
            });
        }
    }

    loadRelationships (relationships, record, entity) {
        const dataModels = this.props.dataModels.toJS();
        const lang = 'en-US';
        const promises = [];

        relationships.forEach((relationship) => {

            // const sourceEntity = rsDataModelProductionManager.descriptorMapByName[relationship.sourceEntityName];
            // const targetEntity = rsDataModelProductionManager.descriptorMapByName[relationship.targetEntityName];
            const sourceEntity = findDataModelByName(dataModels, relationship.mdmSourceEntityName);
            const targetEntity = findDataModelByName(dataModels, relationship.mdmTargetEntityName);
            const isSource = sourceEntity.name === entity.get('name');
            const listingTypes = ['person', 'company', 'people', 'organization'];

            const relationshipEntity = isSource ? targetEntity : sourceEntity;
            let hasFilter = true;

            relationship.filter = Object.keys(relationship.mdmSourceTargetFieldName).map((sourceFieldName) => {

                const targetFieldName = relationship.mdmSourceTargetFieldName[sourceFieldName];
                const relationshipFieldName = isSource ? targetFieldName : sourceFieldName;
                const relationshipField = relationshipEntity.fields.find((e) => e.mdmName === relationshipFieldName);
                const mdmFieldAndValueMap = record._raw.mdmGoldenFieldAndValues || record._raw.mdmMasterFieldAndValues;

                const value = mdmFieldAndValueMap[isSource ? sourceFieldName : targetFieldName];

                if (!value) {
                    hasFilter = false;
                }

                return {
                    dataModelName: relationshipEntity.name,
                    fieldLabel: relationshipField && relationshipField.mdmCustomLabel[lang],
                    fieldName: relationshipField && relationshipField.mdmName,
                    fieldType: relationshipField && (relationshipField.mdmName === 'mdmId' ? relationshipEntity.id : 'STRING' /* relationshipField.mdmFieldType */),
                    filterType: 'equal',
                    source: 'fields',
                    value
                };
            });

            hasFilter = hasFilter && relationship.filter.length;

            relationship.profileTitleFields = relationshipEntity.profileTitleFields || [];
            relationship.sourceEntityLabel = sourceEntity.label;
            relationship.label = relationshipEntity.label;
            relationship.entity = findDataModelByName(dataModels, relationshipEntity.name);

            relationship.fullListQueryParams = {
                datamodel: relationshipEntity.name,
                a: 'GOLDEN',
                q: '',
                r: JSON.stringify(relationship.filter.map((filter) => {
                    return {
                        source: filter.source,
                        field: filter.fieldName,
                        value: filter.value,
                        filterType: filter.filterType
                    };
                }))
            };

            if (hasFilter && listingTypes.indexOf(normalizeRecordType(relationshipEntity.type)) === -1) {

                relationship.groupByOptions = relationshipEntity.fields.filter((field) => {
                    return field.mdmMappingDataType === 'DATE';
                });

                if (relationship.groupByOptions.length) {
                    relationship.groupByField = relationship.groupByOptions[0].mdmName;
                    relationship.dateFilter = {};
                    this.processGroupByQuery(relationship);
                }
            }

            if (hasFilter) {
                promises.push(QueryFactory
                    .create()
                    .entity(relationshipEntity.name)
                    .index('Golden')
                    .filter(relationship.filter)
                    .pageSize(10)
                    .run()
                    .then((result) => {
                        relationship.data = result;
                        relationship.loaded = true;

                        return result;
                    })
                );
            }
            else {

                relationship.loaded = true;
            }

        });

        Promise.all(promises).then(() => {
            this.setState({
                chartRelationships: relationships,
                selectedCardIndex: 0
            });
        });
    }

    processGroupByQuery (relationship) {

        var additionalFilter = [];
        var groupBy = {
            dataModel: relationship.entity.name,
            type: 'DATE',
            name: relationship.groupByField
        };

        relationship.chartData = {};
        relationship.chartLoaded = false;

        if (relationship.dateFilter.firstDate || relationship.dateFilter.secondDate) {
            var firstDate = relationship.dateFilter.firstDate;
            var secondDate = relationship.dateFilter.secondDate || moment().toISOString();
            var absoluteDateOption = firstDate && secondDate ? 'BETWEEN' : 'BEFORE';

            if (absoluteDateOption === 'BETWEEN') {
                var diff = moment(firstDate).diff(moment(secondDate), 'days', true);

                if (Math.abs(diff) <= 28) {
                    groupBy.bucketFormat = 'DD MMM';
                    groupBy.aggregationFormat = '1D';
                }
            }

            additionalFilter.push({
                dateFunction: 'ABSOLUTE',
                name: relationship.groupByField,
                type: 'DATE',
                items: [{
                    firstDate,
                    secondDate,
                    absoluteDateOption
                }]
            });
        }

        var chartName = relationship.mdmTargetEntityName + '_' + relationship.mdmRelationshipName;

        QueryFactory
            .create()
            .entity(relationship.entity.name)
            .index('Golden')
            .filter(relationship.filter.concat(additionalFilter))
            .sortBy(relationship.groupByField)
            .groupBy(groupBy)
            .run()
            .then((result) => {
                relationship.chartData = this.generateChart(chartName, result, {bucketFormat: groupBy.aggregationFormat});
                relationship.chartLoaded = true;
            });
    }

    generateChart (chartName, chartData, chartConfig) {
        var maxLabelLength = 20;

        if (!chartData.buckets) {
            return {};
        }

        chartData.buckets = chartData.buckets.map((item) => {

            if (item.label && item.label.length > maxLabelLength) {
                item.label = item.label.substr(0, maxLabelLength - 3) + '...';
            }

            return item;
        });

        return {
            name: chartName,
            style: ['#ffffff', '#f8f8f8', '#e9ebeb', '#e9ebeb', '#55add1', '#55add1'],
            callback: () => {},
            values: chartData.buckets,
            config: chartConfig || {},
            options: {
                xAxis: {
                    tickValues: chartData.tickValues,
                    tickFormat: chartData.tickFormat,
                    axisLabel: ''
                },
                yAxis: {
                    axisLabel: ''
                }
            },
            singleBarSelection: true
        };
    }


    _renderCardSlide = (relationships, selectedCardIndex) => {
        if (relationships.length > 0) {
            return (
                <View style={{
                    paddingTop: 10 * ratio
                }}>
                    <T style={{color: c('purple main'), fontSize: 14 * ratio}}>Swipe to explore more</T>
                    <ScrollView horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{paddingVertical: 13 * ratio}}
                    >
                        {
                            relationships.map((relationship, index) => {
                                const isSelected = index === selectedCardIndex;

                                return (<CardView
                                    key={index}
                                    Mwidth={80 * ratio}
                                    Mheight={101 * ratio}
                                    Mstartcolor={isSelected ? '#A887D8' : c('transparent')}
                                    Mendcolor={isSelected ? c('purple main') : c('transparent')}
                                    Mcontent={this._generateCardContent(relationship, index, isSelected, true)}
                                />);
                            })
                        }
                    </ScrollView>
                </View>
            );
        }
        
        return null;
    }

    _renderChartDetails = (relationship) => {
        if (!relationship) {
            return null;
        }

        return (
            <View>
                <View style={{ marginTop: 4 * ratio }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <T style={{fontSize: 14 * ratio}}>{relationship.label}</T>
                        {/* <TouchableHighlight>
                            <View style={{flexDirection: 'row', backgroundColor: '#44C4DB', borderRadius: 3, height: 22 * ratio, width: 63 * ratio, justifyContent: 'center', alignItems: 'center'}}>
                                <T style={{color: 'white', fontSize: 14 * ratio}}>+ 12% </T>
                                <Icon
                                    name = {'UpArrow'}
                                    width = {10 * ratio}
                                    size = {10 * ratio}
                                    color = {'white'}
                                    fill = {'white'}
                                />
                            </View>
                        </TouchableHighlight> */}
                    </View>
                </View>

                <View style={{height: 230, width: windowSize.width, flex: 1, marginTop: 18}}>
                    { this._generateChart(relationship) }
                </View>

                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', height: 21 * ratio, marginBottom: 20 * ratio}}>
                    <TouchableOpacity
                        style={{flexDirection: 'row', alignItems: 'center'}}
                        onPress={() => {}}
                    >
                        <T style={{color: c('purple border'), fontSize: 16 * ratio}}>{'Products'}</T>
                        {/* <Icon
                            name={'ArrowDown'}
                            width={15 * ratio}
                            height={15 * ratio}
                            fill={'#555457'}
                        /> */}
                    </TouchableOpacity>
                    <View>
                        <IconButton
                            name="Order"
                            size={20 * ratio}
                            fill={c('black light')}
                            color={c('black light')}
                        />
                    </View>
                </View>

                { tempWatchlist.map((item) => this._generateWatchlistCard(item)) }
            </View>
        );
    }

    _generateChart = (relationship) => {
        const { values } = relationship.chartData;
        let vals = values.map((item) => {
            return {y: [item.value, 0], marker: item.label};
        });

        let labels = values.map((item) => {
            return item.label;
        });

        let data = {
            dataSets: [{
                values: vals,
                label: 'Stacked Bar dataset',
                config: {
                    colors: [processColor('#44C4DB'), processColor('#FC6180')],
                    stackLabels: ['Engineering', 'Sales'],
                    valueTextColor: processColor('transparent')
                }
            }]
        };

        let legend = {
            enabled: false,
            // textSize: 10,
            // position: 'BELOW_CHART_RIGHT',
            // form: 'SQUARE',
            // formSize: 0,
            // xEntrySpace: 2,
            // yEntrySpace: 2,
            // formToTextSpace: 5,
            // wordWrapEnabled: true,
            // maxSizePercent: 0.5,
            // custom: {
            //     colors: [processColor('transparent')],
            //     labels: [this.state.insightsResults[idx - 1].chartData.options.xAxis.axisLabel]
            // }
        };

        let xAxis = {
            // enabled: false
            valueFormatter: labels,
            labelCount: labels.length,
            // labelRotationAngle: 90,
            drawAxisLine: false,
            position: 'BOTTOM',
            drawGridLines: false,
            textSize: 8,
            textColor: processColor('#737373'),
            gridColor: processColor('#737373')
        };

        let yAxis = {
            left: {// valueFormatter: ['15', '19', '23', '27', '30'],
                valueFormatter: '##',
                // axisMaximum: 8.5,
                // axisMinimum: 0,
                drawGridLines: true,
                // labelCount: 5,
                drawLimitLinesBehindData: false,
                drawAxisLine: false,
                textColor: processColor('#737373'),
                gridColor: processColor('#737373')
            },
            right: {
                enabled: false
            }
        };

        return (
            <View>
                <T style={{height: 20, marginBottom: -15, fontSize: 10, marginLeft: 10 * ratio, color: c('black light')}}>
                    {/* relationship.chartData.options.yAxis.axisLabel */}
                </T>
                <BarChart
                    style={{width: windowSize.width - 30, height: 160}}
                    xAxis={xAxis}
                    yAxis={yAxis}
                    animation={chartAnimation}
                    data={data}
                    scaleEnabled={false}
                    dragEnabled={false}
                    pinchZoom={false}
                    doubleTapToZoomEnabled={false}
                    touchEnabled={true}
                    legend={legend}
                    drawValueAboveBar={false}
                    chartDescription={{text: ''}}
                    marker={chartMarker}
                    onChartSelect={this._handleChartSelect}
                />
            </View>
        );
    }

    _generateCardContent = (relationship, currentCardIndex, isSelected, isRise) => {
        let color = 'white';
        const chtype = 'bar';

        if (!isSelected && isRise) {
            color = '#44C4DB';
        }
        if (!isSelected && !isRise) {
            color = '#FC6180';
        }

        let tempChart = [];
        const data = relationship.chartData;

        if (data && data.values) {
            let vals = data.values.map((item) => {
                return {y: [item.value, 0], marker: item.label};
            });
            let clrs = !isSelected ? [processColor('#44C4DB'), processColor('#FC6180')] : [processColor('#FFFFFF'), processColor('#FC6180')];

            tempChart = {
                data: {
                    dataSets: [{
                        values: vals,
                        label: relationship.entity.label,
                        config: {
                            colors: clrs,
                            stackLabels: ['Engineering', 'Sales'],
                            valueTextColor: processColor('transparent')
                        }
                    }]
                }
            };

        }

        return (<View style={{width: '100%'}}>
            <TouchableOpacity
                onPress={() => this._handleChartCardClick(currentCardIndex)}
            >
                <View style={{
                    height: 51 * ratio,
                    paddingTop: 10 * ratio
                }}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginRight: 8 * ratio}}>
                        <Icon
                            name = {isRise ? 'UpArrow' : 'DownArrow'}
                            width = {10 * ratio}
                            height = {11 * ratio}
                            color = {color}
                            fill = {color}
                        />
                    </View>
                    <View style = {{ width: 80 * ratio, height: 40 * ratio, marginTop: -7 * ratio}}>
                        {tempChart !== [] && this._generateSmallChart(chtype, tempChart)}
                    </View>
                </View>
                <View style = {{
                    backgroundColor: isSelected ? c('transparent') : '#FCFCFC',
                    height: 50 * ratio,
                    justifyContent: 'center',
                    borderRadius: 6,
                    paddingLeft: 6 * ratio,
                    borderWidth: isSelected ? 0 : 0.3 * ratio,
                    borderColor: '#D5DBFE',
                    marginHorizontal: Platform.OS === 'android' ? 1 : 0,
                    opacity: chtype !== 'score' && chtype !== 'SCORE' ? 1 : 0
                }}>
                    <T style={{fontSize: 16 * ratio, color: isSelected ? 'white' : c('black main')}}>{'N/A'}</T>
                    <T style={{fontSize: 10 * ratio, marginTop: 2 * ratio, fontWeight: 'normal', color: isSelected ? 'white' : c('black light')}}>{relationship.label}</T>
                </View>
            </TouchableOpacity>
        </View>);
    }

    _generateSmallChart = (type, cht) => {
        return (
            <View>
                <BarChart
                    style={{width: 80 * ratio, height: 40 * ratio}}
                    xAxis={{enabled: false}}
                    yAxis={{left: {enabled: false}, right: {enabled: false}} }
                    animation={{enabled: false}}
                    data={cht.data}
                    touchEnabled={false}
                    legend={{enabled: false}}
                    drawValueAboveBar={false}
                    chartDescription={{text: ''}}
                    marker={{enabled: false}}
                />
            </View>
        );
    }

    _generateWatchlistCard = (data) => {
        if (data.id === undefined) {
            return null;
        }

        return (
            <View style={{
                backgroundColor: 'white',
                borderRadius: 6,
                marginBottom: 10 * ratio,
                height: 50 * ratio,
                shadowRadius: 5,
                elevation: 2,
                shadowOffset: { width: 0, height: 3 },
                shadowColor: '#000',
                shadowOpacity: 0.15,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14
            }} key={'wtcard' + data.id}>
                <T style={{fontSize: 14 * ratio, color: '#485465', flex: 1}}>{data.label}</T>
                <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: '#F3F3F4', paddingLeft: 20}}>
                    <View style={{}}>
                        <T style={{color: c('black main'), fontSize: 16 * ratio}}>R$ 20K</T>
                        <T style={{color: c('black light'), fontSize: 10 * ratio}}>Market Value</T>
                    </View>
                    <View style={{width: 43 * ratio, height: 22 * ratio, backgroundColor: '#FC6180', borderRadius: 3, justifyContent: 'center', flexDirection: 'row', alignItems: 'center'}}>
                        <T style={{textAlign: 'center', color: 'white', marginRight: 3}}>12</T>
                        <Icon
                            name={'UpArrow'}
                            width={10 * ratio}
                            height={10 * ratio}
                            color = {'white'}
                            fill = {'white'}
                        />
                        {/* {data.rise === -1 && <Icon
                            name={'DownArrow'}
                            width={10 * ratio}
                            height={10 * ratio}
                            color = {'white'}
                            fill = {'white'}
                        />} */}
                    </View>
                </View>
            </View>
        );
    }
    
    _handleChartSelect = (event) => {
        let entry = event.nativeEvent;
        
        if (entry.x !== undefined) {
            // this.setState({bkIndex: entry.x});
            // this.loadRecords(entry.x);
        }
    }

    _handleChartCardClick = (index) => {
        this.setState({
            selectedCardIndex: index
        });
    }

    _handleTagModelSelect = async (entity) => {
        const name = entity.get('name');

        this.setState({ entity });

        const nestedRelationships = await DataModelService.getRelationships(name);

        switch (name) {
            case 'mdmcustomer':
                CustomerService.getAllWithTaxIds(this.record.taxId, (records) => {
                    this.loadRelationships(nestedRelationships, records[0], entity);
                });
                break;
            default:
        }
    }

    _handleSeeMore = () => {

    }

    _renderInfoItem = ({ icon, title, description }) => {
        return (
            <View
                style={{
                    paddingHorizontal: 20 * ratio,
                    paddingVertical: 7 * ratio,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <Icon
                    name={icon}
                    color={c('black light')}
                    fill={c('black light')}
                    width={25 * ratio}
                    height={25 * ratio}
                    style={{ marginRight: 12 * ratio }}
                />
                <View>
                    <T style={{ fontSize: 12 * ratio }}>{title}</T>
                </View>
            </View>
        );
    }

    _renderProfile = () => {
        return (
            <View style={{
                marginTop: 10 * ratio,
                paddingBottom: 5 * ratio,
                borderColor: '#c6c6c6',
                shadowRadius: 1 * ratio,
                shadowOffset: { width: 0, height: 2 * ratio },
                shadowColor: '#c6c6c6',
                shadowOpacity: 0.5
            }}>
                { this._renderInfoItem({
                    icon: 'Phone',
                    title: this.record.phones[0].phoneNumber
                })}
                { this._renderInfoItem({
                    icon: 'Mail',
                    //title: basicRecord.get('mdmemail[0].mdmemail')
                })}
            </View>
        );
    }

    _renderChart = () => {
        return (
            <View style={{ marginTop: 20 * ratio, paddingHorizontal: 20 * ratio }}>
                <T style={{fontSize: 14 * ratio, color: c('purple main')}}>See as a:</T>
                <View style={{ marginTop: 10 * ratio, flexDirection: 'row', flexWrap: 'wrap' }}>
                {
                    this.state.tagModels.map((tag) =>
                        <RoundOption
                            key={tag.get('id')}
                            label={tag.get('label')}
                            value={tag}
                            isActive={this.state.entity === tag}
                            style={{ marginRight: 10 * ratio, marginBottom: 7 * ratio }}
                            onPress={this._handleTagModelSelect}
                        />
                    )
                }
                </View>

                { this._renderCardSlide(this.state.chartRelationships, this.state.selectedCardIndex) }
                { this._renderChartDetails(this.state.chartRelationships[this.state.selectedCardIndex]) }
            </View>
        );
    }

    _renderAdditionalInfo = () => {
        return (
            <View
                style={{
                    borderColor: '#c6c6c6',
                    shadowRadius: 1 * ratio,
                    shadowOffset: { width: 0, height: 2 * ratio },
                    shadowColor: '#c6c6c6',
                    shadowOpacity: 0.5
                }}
            >
                <View style={{
                    marginTop: 20 * ratio,
                    marginBottom: 15 * ratio,
                    paddingLeft: 20 * ratio,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Icon
                        name={'NewBuildings'}
                        color={c('purple main')}
                        fill={c('purple main')}
                        width={22}
                        height={22}
                    />
                    <T style={{fontSize: 18, color: c('purple main'), marginLeft: 17}}>Additional Info</T>
                </View>
                { this._renderMap(this.address, this.state.currentLocation, this.state.latLng) }
                <Container
                    MalignCenter
                    style={{
                        marginVertical: 20 * ratio
                    }}
                >
                    <RoundView
                        Mstate="border-purple"
                        style={{
                            paddingHorizontal: 22 * ratio,
                            paddingVertical: 18 * ratio
                        }}
                        onPress={this._handleSeeMore}
                    >
                        <T>see additional info</T>
                    </RoundView>
                </Container>
            </View>
        );
    }

    _renderContacts = () => {
        return (
            <View
                style={{
                    marginBottom: 25 * ratio
                }}
            >
                <View style={{
                    paddingLeft: 17 * ratio,
                    marginTop: 50 * ratio,
                    marginBottom: 19 * ratio,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Icon
                        name={'Globe'}
                        width={32}
                        height={32}
                        color={c('purple main')}
                        fill={c('purple main')}
                    />
                    <T style={{fontSize: 18, color: c('purple main'), paddingLeft: 12}}>Contacts(8)</T>
                </View>
                <ScrollView
                    horizontal
                    style={{
                        marginLeft: 5 * ratio,
                        paddingVertical: 12 * ratio
                    }}
                >
                    { contacts.map((contact, i) => (
                        <TouchableOpacity key={`${contact.name}-${i}`}>
                            <CardView
                                Mwidth={windowSize.width / 4 * 3}
                                Mcontent={<SearchCard
                                    tagLabel="Watchlist"
                                    title1={contact.name}
                                    description2="Address"
                                    description3={contact.address}
                                />}
                                MalignCenter={false}
                                style={{
                                    marginRight: 10 * ratio
                                }}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    }

    _renderContent = () => {
        return (
            <View>
                { this._renderProfile() }
                { this._renderChart() }
                { this._renderAdditionalInfo() }
                {/* { this._renderContacts() } */}
            </View>
        );
    }
}

Company360.propTypes = {
    requesting: PropTypes.bool.isRequired,
    basicRecord: ImmutablePropTypes.contains().isRequired,
    relationships: ImmutablePropTypes.list.isRequired,
    dataModels: ImmutablePropTypes.list.isRequired,
    segments: ImmutablePropTypes.list.isRequired,
    fetchRelationships: PropTypes.func.isRequired,
    fetchVerticals: PropTypes.func.isRequired,
    fetchGoldenRecord: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    requesting: recordRequestingSelector(state),
    basicRecord: basicRecordSelector(state),
    segments: segmentsSelector(state),
    relationships: relationshipsSelector(state),
    dataModels: dataModelsSelector(state)
});

const mapDispatchToProps = {
    fetchRelationships,
    fetchVerticals,
    fetchGoldenRecord
};

export default connect(mapStateToProps, mapDispatchToProps)(Company360);
