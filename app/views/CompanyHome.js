// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Image, TouchableHighlight, StatusBar, ScrollView, processColor, Platform, RefreshControl } from 'react-native';
import { TabViewAnimated } from 'react-native-tab-view';
import Modal from 'react-native-simple-modal';
import { Bar } from 'react-native-pathjs-charts';
import _ from 'lodash';
import ImmutablePropTypes from 'react-immutable-proptypes';

// import Picker from 'react-native-wheel-picker';
import SideMenu from 'react-native-side-menu';
import { connect } from 'react-redux';

import {LineChart, PieChart, BarChart} from 'react-native-charts-wrapper';

import { Router } from '../Main';

import Images from '../assets/icons/images/';
import {
    PageHeader,
    IconButton,
    T,
    Icon,
    CardView
} from '../components';

import u from '../helpers/utils/utils';
import c from '../helpers/color';
import { windowSize, ratio } from '../helpers/windowSize';
import SessionHelper from '../helpers/SessionHelper';
import InsightManager from '../helpers/InsightManager';
import Insights from '../models/Insights';
import User from '../models/User';

import {
    currentMenuIdSelector,
    menuDataSelector
} from '../reduxes/selectors';
import {
    showBottomBar,
    toggleMenu,
    fetchDashboards
} from '../reduxes/actions';

import DashboardService from '../services/DashboardService';

const mapStateToProps = (state) => ({
    currentMenuId: currentMenuIdSelector(state),
    menuData: menuDataSelector(state)
});

const mapDispatchToProps = dispatch => ({
    showBottomBar: () => dispatch(showBottomBar()),
    openMenu: () => dispatch(toggleMenu(true)),
    fetchDashboards: () => dispatch(fetchDashboards())
});

class CompanyHome extends Component {
    static propTypes = {
        showBottomBar: PropTypes.func,
        openMenu: PropTypes.func.isRequired,
        fetchDashboards: PropTypes.func.isRequired,
        currentMenuId: PropTypes.string.isRequired,
        menuData: ImmutablePropTypes.list.isRequired
    };

    pickerList: Array<string>;
    graphFilters: Array<Object>;

    constructor () {
        super();
        
        this.state = {
            refreshing: false,
            sDatas: [
                {key: 1, isSelected: true, isRise: true, type: 'Sales', text: 'R$24.8M', chartType: 'comp'},
                {key: 2, isSelected: false, isRise: true, type: 'Customers', text: '15040', chartType: 'bar'},
                {key: 3, isSelected: false, isRise: true, type: 'NPS', text: '74', chartType: 'line'},
                {key: 4, isSelected: false, isRise: true, type: 'Verticals', text: '4', chartType: 'pie'}
            ],
            insights: [],
            insightsResults: [],
            selectedCard: 1,
            showMore: false,
            filters: [
                {id: 0, text: '1 Week', selected: false},
                {id: 1, text: '1 Month', selected: false},
                {id: 2, text: '1 Year', selected: false}
            ],
            selectedFilter: -1,
            showFilterView: false,
            pickerSelected: 0,
            showPicker: false,
            wtList: [
                {key: 1110, text: 'Aamazon', typeValue: '1,250,000.00', typeText: 'Market value', value: '65', rise: 1},
                {key: 1111, text: 'Google', typeValue: '1,650,000.00', typeText: 'Market value', value: '59', rise: -1},
                {key: 1112, text: 'Apple', typeValue: '850,000.00', typeText: 'Market value', value: '48', rise: -1},
                {key: 1113, text: 'Chase', typeValue: '2,100,000.00', typeText: 'Market value', value: '62', rise: 1},
                {key: 1114, text: 'JP Morgan', typeValue: '1,900,000.00', typeText: 'Market value', value: '45', rise: -1},
                {key: 1115, text: 'Roche', typeValue: '750,000.00', typeText: 'Market value', value: '62', rise: 1},
                {key: 1116, text: 'Safeway', typeValue: '450,000.00', typeText: 'Market value', value: '55', rise: 1},
                {key: 1117, text: 'Mitsui', typeValue: '2,450,000.00', typeText: 'Market value', value: '61', rise: 1},
                {key: 1118, text: 'Ford', typeValue: '2,200,000.00', typeText: 'Market value', value: '59', rise: -1},
                // {key: 1119, text: 'TOTVS', typeValue: '56', typeText: 'Market value', value: '5', rise: 1}
            ],
            bkIndex: 0,
            pageNum: 0,
            recordLabel: '',
            totalRecords: '',
            marker: {
                enabled: false,
                backgroundTint: processColor('teal'),
                markerColor: processColor('#44C4DB'),
                textColor: processColor('white')
            },
            animation: {
                durationX: 500,
                durationY: 0,
                easingY: 'Linear'
            },
            selectedGPFilter: 1
        };

        this.smallWhiteChartData = [
            //comp
            {
                data: {
                    dataSets: [{
                        key: 1,
                        values: [{y: 2850000, x: 1}, {y: 3049000, x: 2}, {y: 4600000, x: 3}, {y: 3920000, x: 4}, {y: 3850000, x: 5}, {y: 4600000, x: 6}, {y: 4560000, x: 7}, {y: 5000000, x: 8}, {y: 5500000, x: 9}],
                        label: 'Sales',
                        config: {
                            lineWidth: 2,
                            drawCircles: false,
                            color: processColor('white'),
                            bgColor: 'white',
                            valueTextSize: 0,
                            valueFormatter: '##.000',
                            mode: 'HORIZONTAL_BEZIER'
                        }
                    }, {
                        key: 2,
                        values: [{y: 2400000, x: 1}, {y: 3200000, x: 2}, {y: 4250000, x: 3}, {y: 4150000, x: 4}, {y: 4000000, x: 5}, {y: 5100000, x: 6}, {y: 4720000, x: 7}, {y: 4840000, x: 8}, {y: 5600000, x: 9}, {y: 5125000, x: 10}, {y: 5050000, x: 11}, {y: 7025000, x: 12}],
                        label: 'Pending Tickets',
                        config: {
                            lineWidth: 2,
                            drawCircles: false,
                            color: processColor('#0DB3D0'),
                            bgColor: '#0DB3D0',
                            valueTextSize: 0,
                            valueFormatter: '##.000',
                            mode: 'HORIZONTAL_BEZIER'
                        }
                    }]
                }
            },
            //bar
            {
                data: {
                    dataSets: [{
                        values: [{y: [1200], marker: 'Jan'}, {y: [1320], marker: 'Feb'}, {y: [1280], marker: 'Mar'}, {y: [1500], marker: 'Apr'}, {y: [1720, 0.4], marker: 'May'}, {y: [1920], marker: 'Jun'}, {y: [1850], marker: 'July'}, {y: [2100], marker: 'Aug'}, {y: [2150], marker: 'Sep'}],
                        label: 'Stacked Bar dataset',
                        config: {
                            colors: [processColor('white')],
                            stackLabels: ['Engineering', 'Sales'],
                            valueTextColor: processColor('transparent')
                        }
                    }]
                }
            },
            //line
            {
                data: {
                    dataSets: [{
                        values: [{y: 48, x: 1}, {y: 52, x: 2}, {y: 49, x: 3}, {y: 55, x: 4}, {y: 52, x: 5}, {y: 60, x: 6}, {y: 61, x: 7}, {y: 69, x: 8}, {y: 75, x: 9}],
                        label: 'NPS',
                        config: {
                            lineWidth: 2,
                            drawCircles: false,
                            highlightColor: processColor('white'),
                            color: processColor('white'),
                            valueTextSize: 0,
                            valueFormatter: '##.000',
                            mode: 'HORIZONTAL_BEZIER'
                        }
                    }]
                }
            },
            //pie
            {
                data: {
                    dataSets: [{
                        values: [{key: 1, value: 28, label: 'Retail'},
                            {key: 2, value: 15, label: 'Education'},
                            {key: 3, value: 45, label: 'Supply Chain'},
                            {key: 4, value: 12, label: 'HealthCare'}],
                        label: '',
                        config: {
                            colors: [processColor('white'), processColor('#0DB3D0'), processColor('#FC6180'), processColor('#FCFC80')],
                            bgColors: ['white', '#0DB3D0', '#FC6180','#FCFC80'],
                            valueTextSize: 20,
                            valueTextColor: processColor('transparent'),
                            sliceSpace: 1,
                            selectionShift: 5
                        }
                    }]
                }
            },
        ],

        this.smallChartData = [
            //comp
            {
                data: {
                    dataSets: [{
                        key: 1,
                        values: [{y: 2850000, x: 1}, {y: 3049000, x: 2}, {y: 4600000, x: 3}, {y: 3920000, x: 4}, {y: 3850000, x: 5}, {y: 4600000, x: 6}, {y: 4560000, x: 7}, {y: 5000000, x: 8}, {y: 5500000, x: 9}],
                        label: 'Actual',
                        config: {
                            lineWidth: 2,
                            drawCircles: false,
                            color: processColor(c('purple main')),
                            bgColor: c('purple main'),
                            valueTextSize: 0,
                            valueFormatter: '##.000',
                            mode: 'HORIZONTAL_BEZIER'
                        }
                    }, {
                        key: 2,
                        values: [{y: 2400000, x: 1}, {y: 3200000, x: 2}, {y: 4250000, x: 3}, {y: 4150000, x: 4}, {y: 4000000, x: 5}, {y: 5100000, x: 6}, {y: 4720000, x: 7}, {y: 4840000, x: 8}, {y: 5600000, x: 9}, {y: 5125000, x: 10}, {y: 5050000, x: 11}, {y: 7025000, x: 12}],
                        label: 'Forecast',
                        config: {
                            lineWidth: 2,
                            drawCircles: false,
                            color: processColor('#0DB3D0'),
                            bgColor: '#0DB3D0',
                            valueTextSize: 0,
                            valueFormatter: '##.000',
                            mode: 'HORIZONTAL_BEZIER'
                        }
                    }]
                }
            },
            //bar
            {
                data: {
                    dataSets: [{
                        values: [{y: [1200], marker: 'Jan'}, {y: [1320], marker: 'Feb'}, {y: [1280], marker: 'Mar'}, {y: [1500], marker: 'Apr'}, {y: [1720, 0.4], marker: 'May'}, {y: [1920], marker: 'Jun'}, {y: [1850], marker: 'July'}, {y: [2100], marker: 'Aug'}, {y: [2150], marker: 'Sep'}],
                        label: 'Stacked Bar dataset',
                        config: {
                            colors: [processColor('#44C4DB')],
                            stackLabels: ['Engineering', 'Sales'],
                            valueTextColor: processColor('transparent')
                        }
                    }]
                }
            },
            //line
            {
                data: {
                    dataSets: [{
                        values: [{y: 48, x: 1}, {y: 52, x: 2}, {y: 49, x: 3}, {y: 55, x: 4}, {y: 52, x: 5}, {y: 60, x: 6}, {y: 61, x: 7}, {y: 69, x: 8}, {y: 75, x: 9}],
                        label: 'Company X',
                        config: {
                            lineWidth: 2,
                            drawCircles: false,
                            highlightColor: processColor(c('purple main')),
                            color: processColor(c('purple main')),
                            valueTextSize: 0,
                            valueFormatter: '##.000',
                            mode: 'HORIZONTAL_BEZIER'
                        }
                    }]
                }
            },
            //pie
            {
                data: {
                    dataSets: [{
                        values: [{key: 1, value: 28, label: 'Retail'},
                            {key: 2, value: 15, label: 'Education'},
                            {key: 3, value: 45, label: 'Supply Chain'},
                            {key: 4, value: 12, label: 'HealthCare'}],
                        label: '',
                        config: {
                            colors: [processColor('#6F85FF'), processColor('#0DB3D0'), processColor('#FC6180'), processColor('#FCFC80')],
                            bgColors: ['#6F85FF', '#0DB3D0', '#FC6180', '#FCFC80'],
                            valueTextSize: 20,
                            valueTextColor: processColor('transparent'),
                            sliceSpace: 1,
                            selectionShift: 5
                        }
                    }]
                }
            },
            
            
        ];
        this.chartData = [
            //comp
            {
                data: {
                    dataSets: [{
                        key: 1,
                        values: [{y: 2850000, x: 1}, {y: 3049000, x: 2}, {y: 4600000, x: 3}, {y: 3920000, x: 4}, {y: 3850000, x: 5}, {y: 4600000, x: 6}, {y: 4560000, x: 7}, {y: 5000000, x: 8}, {y: 5500000, x: 9}],
                        label: 'Actual',
                        config: {
                            lineWidth: 2,
                            drawCircles: false,
                            color: processColor(c('purple main')),
                            bgColor: c('purple main'),
                            valueTextSize: 0,
                            valueFormatter: '##.000',
                            mode: 'HORIZONTAL_BEZIER'
                        }
                    }, {
                        key: 2,
                        values: [{y: 2400000, x: 1}, {y: 3200000, x: 2}, {y: 4250000, x: 3}, {y: 4150000, x: 4}, {y: 4000000, x: 5}, {y: 5100000, x: 6}, {y: 4720000, x: 7}, {y: 4840000, x: 8}, {y: 5600000, x: 9}, {y: 5125000, x: 10}, {y: 5050000, x: 11}, {y: 7025000, x: 12}],
                        label: 'Forecast',
                        config: {
                            lineWidth: 2,
                            drawCircles: false,
                            color: processColor('#0DB3D0'),
                            bgColor: '#0DB3D0',
                            valueTextSize: 0,
                            valueFormatter: '##.000',
                            mode: 'HORIZONTAL_BEZIER'
                        }
                    }]
                },
                legend: {
                    enabled: true,
                    textColor: processColor(c('black light')),
                    textSize: 10,
                    position: 'BELOW_CHART_RIGHT',
                    form: 'SQUARE',
                    formSize: 0,
                    xEntrySpace: 2,
                    yEntrySpace: 2,
                    formToTextSpace: 5,
                    wordWrapEnabled: true,
                    maxSizePercent: 0.5,
                    custom: {
                        colors: [processColor('transparent')],
                        labels: ['days']
                    }
                },
                xAxis: {
                    valueFormatter: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    axisMaximum: 12,
                    axisMinimum: 1,
                    labelCount: 11,
                    drawAxisLine: false,
                    position: 'BOTTOM'
                },
                yAxis: {
                    left: {// valueFormatter: ['15', '19', '23', '27', '30'],
                        valueFormatter: '##',
                        drawGridLines: false,
                        drawLimitLinesBehindData: false,
                        drawAxisLine: false
                    },
                    right: {
                        enabled: false
                    }
                }
            },
            //bar
            {
                data: {
                    dataSets: [{
                        values: [{y: [1200], x: 1, marker: 'Jan'}, {y: [1320], x: 2, marker: 'Feb'}, {y: [1280], x: 3, marker: 'Mar'}, {y: [1500], x: 4, marker: 'Apr'}, {y: [1720, 0.4], x: 5, marker: 'May'}, {y: [1920], x: 6, marker: 'Jun'}, {y: [1850], x: 7, marker: 'July'}, {y: [2100], x: 8, marker: 'Aug'}, {y: [2150], x: 9, marker: 'Sep'}],
                        config: {
                            colors: [processColor('#44C4DB')],
                            stackLabels: ['Engineering', 'Sales'],
                            valueTextColor: processColor('transparent')
                        }
                    }]
                },
                legend: {
                    enabled: true,
                    textColor: processColor(c('black light')),
                    textSize: 10,
                    position: 'BELOW_CHART_RIGHT',
                    form: 'SQUARE',
                    formSize: 0,
                    xEntrySpace: 2,
                    yEntrySpace: 2,
                    formToTextSpace: 5,
                    wordWrapEnabled: true,
                    maxSizePercent: 0.5,
                    custom: {
                        colors: [processColor('transparent')],
                        labels: ['days']
                    }
                },
                xAxis: {
                    valueFormatter: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', ''],
                    axisMaximum: 13,
                    axisMinimum: 0,
                    labelCount: 13,
                    drawAxisLine: false,
                    position: 'BOTTOM',
                    drawGridLines: false
                },
                yAxis: {
                    left: {// valueFormatter: ['15', '19', '23', '27', '30'],
                        valueFormatter: '##',
                        drawGridLines: true,
                        drawLimitLinesBehindData: false,
                        drawAxisLine: false
                    },
                    right: {
                        enabled: false
                    }
                }
            },
            //line
            {
                data: {
                    dataSets: [{
                        values: [{y: 48, x: 1}, {y: 52, x: 2}, {y: 49, x: 3}, {y: 55, x: 4}, {y: 52, x: 5}, {y: 60, x: 6}, {y: 61, x: 7}, {y: 69, x: 8}, {y: 75, x: 9}],
                        label: 'NPS',
                        config: {
                            lineWidth: 4,
                            drawCircles: false,
                            highlightColor: processColor(c('purple main')),
                            color: processColor(c('purple main')),
                            valueTextSize: 0,
                            valueFormatter: '##.000',
                            mode: 'HORIZONTAL_BEZIER'
                        }
                    }]
                },
                legend: {
                    enabled: true,
                    textColor: processColor(c('black light')),
                    textSize: 10,
                    position: 'BELOW_CHART_RIGHT',
                    form: 'SQUARE',
                    formSize: 0,
                    xEntrySpace: 2,
                    yEntrySpace: 2,
                    formToTextSpace: 5,
                    wordWrapEnabled: true,
                    maxSizePercent: 0.5,
                    custom: {
                        colors: [processColor('transparent')],
                        labels: ['days']
                    }
                },
                xAxis: {
                    valueFormatter: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    axisMaximum: 12,
                    axisMinimum: 1,
                    labelCount: 11,
                    drawAxisLine: false,
                    position: 'BOTTOM'
                },
                yAxis: {
                    left: {// valueFormatter: ['15', '19', '23', '27', '30'],
                        valueFormatter: '##',
                        drawGridLines: false,
                        drawLimitLinesBehindData: false,
                        drawAxisLine: false
                    },
                    right: {
                        enabled: false
                    }
                }
            },
            //pie
            {
                data: {
                    dataSets: [{
                        values: [{key: 1, value: 28, label: 'Retail'},
                            {key: 2, value: 15, label: 'Education'},
                            {key: 3, value: 45, label: 'Supply Chain'},
                            {key: 4, value: 12, label: 'HealthCare'}],
                        label: '',
                        config: {
                            colors: [processColor('#6F85FF'), processColor('#0DB3D0'), processColor('#FC6180'), processColor('#FCFC80')],
                            bgColors: ['#6F85FF', '#0DB3D0', '#FC6180', '#FCFC80'],
                            valueTextSize: 20,
                            valueTextColor: processColor('transparent'),
                            sliceSpace: 1,
                            selectionShift: 5
                        }
                    }]
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    valueFormatter: '##',
                    axisMaximum: 30,
                    axisMinimum: 15,
                    labelCount: 15,
                    drawAxisLine: false,
                    position: 'BOTTOM'
                },
                yAxis: {
                    left: {// valueFormatter: ['15', '19', '23', '27', '30'],
                        valueFormatter: '##',
                        axisMaximum: 8,
                        axisMinimum: 0,
                        drawGridLines: false,
                        labelCount: 5,
                        drawLimitLinesBehindData: false,
                        drawAxisLine: false
                    },
                    right: {
                        enabled: false
                    }
                }
            },
            
            
        ];
        this.pickerList = ['Customer', 'test', 'Customer', 'test', 'Customer', 'test'];
        this.graphFilters = [
            {key: 1, text: 'Week'},
            {key: 2, text: 'Month'},
            {key: 3, text: 'Quarter'},
            {key: 4, text: 'YTD'}
        ];

        let realmInsights = Insights.getAll();
        
        if (realmInsights.length > 0) {
            let tempData = realmInsights.map((item, index) => {
                
                let cloneObj = {};

                cloneObj.id = item.id === '' ? undefined : item.id;
                cloneObj.label = item.label === '' ? undefined : item.label;
                cloneObj.accessType = item.accessType === '' ? undefined : item.accessType;
                cloneObj.namedQueryName = item.namedQueryName === '' ? undefined : item.namedQueryName;
                cloneObj.config = JSON.parse(item.config);

                return {key: index + 1, data: cloneObj};
            });

            this.state.insights = tempData;
        }
    }

    static route = {
        navigationBar: null,
        styles: {
            gestures: null
        }
    };

    _refreshDashboard = (id) => {
        this.setState({
            refreshing: true,
            insightsResults: [],
            insights: []
        });

        DashboardService.getDashboard(id, (results) => {
            Insights.deleteAll();
            let tempData = results.insights.map((item, index) => {
                Insights.create(item);

                return {key: index + 1, data: item};
            });

            InsightManager.queryRecords(tempData[0].data.config).then((recordResults) => {
                this.setState({wtList: recordResults.records});
            });

            tempData.forEach((insight) => {
                try {
                    // InsightManager.queryRecords(insight.data.config).then((recordResults) => {
                    //     console.log(recordResults);
                    // });
                    InsightManager.queryAggregations(insight.data.config).then((insightResult) => {
                        console.log(insightResult);
                        if (insightResult.chartData) {
                            insightResult.chartData.insightId = insight.data.id;
                        }

                        let temp = this.state.insightsResults;

                        temp[insight.key - 1] = insightResult;
                        this.setState({insightsResults: temp, refreshing: false});
                        
                    });
                }
                catch (e) {
                    console.log(e);
                }
            // DashboardService.getDashboard(selectedDashboard.id, (dashboard) => {
            //     console.log('getDashboard: ');
            //     console.log(dashboard);

            //     //Get records for the first insight (This could also be from the insight the user clicked on)
            
            // });

            });

            if (tempData !== undefined) { this.setState({insights: tempData}); }
        });
    }

    componentWillMount () {
        this.props.showBottomBar();
        this.props.fetchDashboards();
    }

    componentWillReceiveProps (nextProps) {

        if (this.props.currentMenuId !== nextProps.currentMenuId && nextProps.currentMenuId !== 'noDash') {
            this._refreshDashboard(nextProps.currentMenuId);
        }
    }

    handleSelect = (event) => {
        if (this.props.currentMenuId !== 'noDash') {
            let entry = event.nativeEvent;
            
            if (entry.x !== undefined) {
                this.setState({bkIndex: entry.x});
                this.loadRecords(entry.x);
            }
        }
    }

    loadRecords = (index = -1, pageNum = 0) => {
        let insight = _.clone(this.state.insights[this.state.selectedCard - 1].data.config);
        
        let selectedBuckets = index >= 0 ? this.state.insightsResults[this.state.selectedCard - 1].buckets[index] : false;
        
        let additionalFilters = [];
        
        if (selectedBuckets) {
            let fieldName = selectedBuckets.fields[0];
            let items = [];

            if (insight.visualization.type === 'BAR') {
                items = [{
                    value: selectedBuckets.lookupValue || selectedBuckets.filterValue || selectedBuckets.label,
                    label: selectedBuckets.label
                }];
                
            }
            else if (insight.visualization.type === 'LINE') {
                items = selectedBuckets.map((line) => {
                    return line.range;
                });
            }

            additionalFilters.push({
                source: 'fields',
                fieldType: selectedBuckets.fieldTypes[0],
                filterType: {id: 'equal', label: 'equals to', input: 'TEXT'}, //selectedBuckets.fieldTypes[0],
                fieldName,
                dataModelName: insight.dataModelName,
                dataModelLabel: insight.dataModelsMap[insight.dataModelName].label,
                value: items[0].value,
                fieldLabel: items[0].label
            });

            additionalFilters = additionalFilters.map((filter) => {
                let label = filter.fieldName.indexOf('.') > -1 ? filter.fieldName.substr(0, filter.fieldName.indexOf('.')) : filter.fieldName;

                filter.fieldLabel = insight.fields[0].fieldLabel;

                return filter;
            });
        }

        let filters = insight.filters;

        filters = _.concat(filters, additionalFilters);
        insight.filters = filters;

        InsightManager.queryRecords(insight, pageNum).then((recordResults) => {
            // console.log("recordlabel", insight.dataModelsMap[insight.dataModelName].label);
            if (pageNum === 0) {
                this.setState({wtList: recordResults.records, showMore: recordResults.totalRecords > recordResults.records.length, recordLabel: insight.dataModelsMap[insight.dataModelName].label + ' (' + recordResults.totalRecordsLocale + ')'});
            }
            else {
                let records = _.clone(this.state.wtList);

                records = _.concat(records, recordResults.records);
                this.setState({wtList: records, showMore: recordResults.totalRecords > recordResults.records.length + this.state.wtList.length});
            }
        });
    }

    _renderHeader = () => {
        const { menuData, currentMenuId } = this.props;
        const currentMenu = menuData.find((item) => item.get('key') === currentMenuId);

        return (<PageHeader
            style = {{
                justifyContent: 'space-between'
            }}
        >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <IconButton
                    circular={true}
                    color={c('transparent')}
                    fill={c('purple border')}
                    name="Hamburger"
                    size= {40}
                    onPress={this.props.openMenu}
                />
                <T style={{
                    fontSize: 16 * ratio,
                    fontWeight: 'bold',
                    marginLeft: 10 * ratio
                }}>
                    {currentMenu && currentMenu.get('text')}
                    {currentMenuId === 'noDash' && 'Sample Dashboard'}
                </T>
            </View>
            {/* <TouchableOpacity
                onPress = {() => { this.setState({showFilterView: true}); }}
            >
                <View
                    style={{
                        height: 29 * ratio,
                        width: 87 * ratio,
                        borderStyle: 'dotted',
                        borderWidth: 1,
                        borderColor: this.state.selectedFilter === -1 ? c('black light') : 'transparent',
                        borderRadius: 6,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: this.state.selectedFilter === -1 ? 'transparent' : c('purple border')
                    }}
                >
                    <Icon
                        name="Filters"
                        width={17 * ratio}
                        height={16 * ratio}
                        fill={this.state.selectedFilter === -1 ? c('black light') : '#FFF'}
                    />
                    <T style={{
                        color: this.state.selectedFilter === -1 ? c('black main') : '#FFF',
                        fontSize: 12 * ratio,
                        marginLeft: 8 * ratio
                    }}>
                        {this.state.selectedFilter === -1 ? 'Filters' : this.state.filters[this.state.selectedFilter].text}
                    </T>
                </View>
            </TouchableOpacity> */}
        </PageHeader>);
    }

    _renderFilterList = () => {
        
        return this.state.filters.map((item) => {
            return (<TouchableOpacity key={'filter' + item.id} style={{
                flex: 1,
                marginRight: 11,
                borderRadius: 6,
                borderColor: c('black light'),
                borderWidth: this.state.selectedFilter !== -1 && item.text === this.state.filters[this.state.selectedFilter].text ? 0 : 1,
                justifyContent: 'center',
                height: 31,
                backgroundColor: this.state.selectedFilter !== -1 && item.text === this.state.filters[this.state.selectedFilter].text ? c('purple border') : 'transparent'
            }}
            onPress = {() => { this.setState({selectedFilter: item.id}); setTimeout(() => { this.setState({showFilterView: false}); }, 400); }} >
                <T style={{color: this.state.selectedFilter !== -1 && item.text === this.state.filters[this.state.selectedFilter].text ? '#FFF' : '#555457', fontSize: 12, textAlign: 'center'}}>{item.text}</T>
            </TouchableOpacity>);
        });
    }

    _renderFilterView = () => {
        if (this.state.showFilterView) {
            return (<View style={{
                position: 'absolute',
                width: '100%',
                height: windowSize.height,
                zIndex: 555,
                top: 76 * ratio
            }}>
                <View style={{
                    backgroundColor: '#FBFBFB',
                    height: 62,
                    width: '100%',
                    paddingHorizontal: 21,
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>{
                        this._renderFilterList()
                    }
                    
                </View>
                <View style={{
                    flex: 1,
                    backgroundColor: '#00000040'
                }}
                >
                    <TouchableOpacity
                        style={{flex: 1}}
                        onPress = {() => { this.setState({showFilterView: false}); }}
                    >
                        <T style={{flex: 1}}></T>
                    </TouchableOpacity>
                </View>
            </View>);
        }

        return null;
    }

    _generateSmallChart = (type, cht) => {
        if (type === 'score' || type === 'SCORE') {
            return (<View style={{justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 20 * ratio}}>
                <T style={{fontSize: 16 * ratio, color: cht.key === this.state.selectedCard ? 'white' : c('black main')}}>{cht.text}</T>
                <T style={{fontSize: 10 * ratio, color: cht.key === this.state.selectedCard ? 'white' : c('black light')}}>{cht.type}</T>
            </View>);
        }

        if (type === 'comp') {
            return (<View>
                <LineChart
                    style={{width: 80 * ratio, height: 40 * ratio}}
                    data={cht.data}
                    chartDescription={{text: ''}}
                    legend={{enabled: false}}
                    marker={{enabled: false}}
                    animation={{enabled: false}}
                    xAxis={{enabled: false}}
                    yAxis={{left: {enabled: false}, right: {enabled: false}} }
                    drawGridBackground={false}
                    borderColor={processColor('transparent')}
                    borderWidth={0}
                    drawBorders={false}

                    touchEnabled={false}
                    dragEnabled={false}
                    scaleEnabled={false}
                    scaleXEnabled={false}
                    scaleYEnabled={false}
                    pinchZoom={false}
                    doubleTapToZoomEnabled={false}

                    dragDecelerationEnabled={false}
                    dragDecelerationFrictionCoef={0.99}

                    keepPositionOnRotation={false}
                />
            </View>);
        }
        if (type === 'bar' || type === 'BAR' ) {
            return (<View>
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
                /></View>);
        }
        if (type === 'line' || type === 'LINE') {
            return (<View><LineChart
                style={{width: 80 * ratio, height: 40 * ratio}}
                data={cht.data}
                chartDescription={{text: ''}}
                legend={{enabled: false}}
                marker={{enabled: false}}
                animation={{enabled: false}}
                xAxis={{enabled: false}}
                yAxis={{left: {enabled: false}, right: {enabled: false}} }
                drawGridBackground={false}
                borderColor={processColor('transparent')}
                borderWidth={0}
                drawBorders={false}

                touchEnabled={false}
                dragEnabled={false}
                scaleEnabled={false}
                scaleXEnabled={false}
                scaleYEnabled={false}
                pinchZoom={false}
                doubleTapToZoomEnabled={false}

                dragDecelerationEnabled={false}
                dragDecelerationFrictionCoef={0.99}

                keepPositionOnRotation={false}
            /></View>);
        }
        if (type === 'pie' || type === 'PIE') {
            return (<View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10}}>
                <PieChart
                    style={{width: 40 * ratio, height: 40 * ratio}}
                    logEnabled={false}
                    animation={{enabled: false}}
                    chartBackgroundColor={processColor('transparent')}
                    chartDescription={{text: ''}}
                    data={cht.data}
                    legend={{enabled: false}}

                    entryLabelColor = {processColor('transparent')}
                    entryLabelTextSize = {20}
                    touchEnabled={false}
                    rotationEnabled={false}
                    drawSliceText={false}
                    usePercentValues={false}
                    centerText={''}
                    centerTextRadiusPercent={100}
                    holeRadius={90}
                    holeColor={processColor('transparent')}
                    transparentCircleRadius={90}
                    transparentCircleColor={processColor('transparent')}
                    maxAngle={360}
                />
            </View>);
        }
        
        return null;
    }

    _generateSampleChart = (type, cht) => {
        if (type === 'score') {
            return (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <T style={{fontSize: 40 * ratio}}>{cht.text}</T>
                <T style={{fontSize: 20 * ratio, color: c('black light')}}>{cht.type}</T>
            </View>);
        }
        if (type === 'comp') {
            return (<View>
                <LineChart
                    style={{width: windowSize.width - 30, height: 160}}
                    data={cht.data}
                    chartDescription={{text: ''}}
                    legend={cht.legend}
                    marker={this.state.marker}
                    animation={this.state.animation}
                    xAxis={cht.xAxis}
                    yAxis={cht.yAxis}
                    drawGridBackground={false}
                    borderColor={processColor('transparent')}
                    borderWidth={0}
                    drawBorders={false}

                    touchEnabled={true}
                    dragEnabled={false}
                    scaleEnabled={true}
                    scaleXEnabled={true}
                    scaleYEnabled={true}
                    pinchZoom={true}
                    doubleTapToZoomEnabled={false}

                    dragDecelerationEnabled={true}
                    dragDecelerationFrictionCoef={0.99}

                    keepPositionOnRotation={false}
                    onChartSelect={this.handleSelect.bind(this)}
                />
                <View style={{flexDirection: 'row', justifyContent: 'center', height: 20}}>
                    {cht.data.dataSets.map((item) => {
                        return (<View key={'legend' + item.key} style={{flexDirection: 'row', marginRight: item.key === cht.data.length ? 0 : 20, justifyContent: 'flex-start', alignItems: 'center'}}>
                            <View style={{marginRight: 6, width: 10, height: 10, borderRadius: 3, backgroundColor: item.config.bgColor}}></View>
                            <T style={{color: c('black light'), fontSize: 10}}>{item.label}</T>
                        </View>);
                    })
                    }
                </View></View>);
        }
        if (type === 'bar') {
            return (<View><T style={{height: 20, marginBottom: -15, fontSize: 10, marginLeft: 10 * ratio}}>{cht.yLabel}</T>
                <BarChart
                    style={{width: windowSize.width - 30, height: 160}}
                    xAxis={cht.xAxis}
                    yAxis={cht.yAxis}
                    animation={this.state.animation}
                    data={cht.data}
                    legend={cht.legend}
                    drawValueAboveBar={false}
                    chartDescription={{text: ''}}
                    marker={this.state.marker}
                    onChartSelect={this.handleSelect.bind(this)}
                /></View>);
        }
        if (type === 'line') {
            return (<View><T style={{height: 20, marginBottom: -15, fontSize: 10, marginLeft: 10 * ratio}}>{cht.yLabel}</T><LineChart
                style={{width: windowSize.width - 30, height: 160}}
                data={cht.data}
                chartDescription={{text: ''}}
                legend={cht.legend}
                marker={this.state.marker}
                animation={this.state.animation}
                xAxis={cht.xAxis}
                yAxis={cht.yAxis}
                drawGridBackground={false}
                borderColor={processColor('transparent')}
                borderWidth={0}
                drawBorders={false}

                touchEnabled={true}
                dragEnabled={false}
                scaleEnabled={true}
                scaleXEnabled={true}
                scaleYEnabled={true}
                pinchZoom={true}
                doubleTapToZoomEnabled={false}

                dragDecelerationEnabled={true}
                dragDecelerationFrictionCoef={0.99}

                keepPositionOnRotation={false}
                onChartSelect={this.handleSelect.bind(this)}
            /></View>);
        }
        if (type === 'pie') {
            return (<View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10}}>
                <PieChart
                    style={{width: 160, height: 160}}
                    logEnabled={true}
                    animation={this.state.animation}
                    chartBackgroundColor={processColor('transparent')}
                    chartDescription={{text: ''}}
                    data={cht.data}
                    legend={cht.legend}

                    entryLabelColor = {processColor('transparent')}
                    entryLabelTextSize = {20 * ratio}
                
                    rotationEnabled={false}
                    drawSliceText={false}
                    usePercentValues={false}
                    centerText={'center\ntest'}
                    centerTextRadiusPercent={100}
                    holeRadius={90}
                    holeColor={processColor('transparent')}
                    transparentCircleRadius={90}
                    transparentCircleColor={processColor('transparent')}
                    maxAngle={360}
                    onChartSelect={this.handleSelect.bind(this)}
                />
                <View style={{height: 160, justifyContent: 'center', width: windowSize.width - 230}}>
                    {cht.data.dataSets[0].values.map((item) => {
                        return (<View key={'legend' + item.key} style={{flexDirection: 'row', marginBottom: 10, justifyContent: 'flex-start', alignItems: 'center'}}>
                            <View style={{marginRight: 6, width: 10, height: 10, borderRadius: 3, backgroundColor: cht.data.dataSets[0].config.bgColors[item.key - 1]}}></View>
                            <T>{item.label}</T>
                        </View>);
                    })
                    }
                </View>
            </View>);
        }
        
        return null;
    }

    _generateChart = (idx) => {
        if (!this.state.insightsResults[idx - 1] || !this.state.insightsResults[idx - 1].buckets) { return null; }
        let type = this.state.insights[idx - 1].data.config.visualization.type;
        let buckets = _.clone(this.state.insightsResults[idx - 1].buckets);
        
        buckets.sort((a, b) => {
            return a.label.localeCompare(b.label);
        });
        // if (type === 'comp') {
        //     return (<View><T style={{height: 20, marginBottom: -15, fontSize: 10 * ratio, marginLeft: 10}}>K dollars</T>
        //         <LineChart
        //             style={{width: windowSize.width - 30, height: 140}}
        //             data={cht.data}
        //             chartDescription={{text: ''}}
        //             legend={cht.legend}
        //             marker={this.state.marker}
        //             animation={this.state.animation}
        //             xAxis={cht.xAxis}
        //             yAxis={cht.yAxis}
        //             drawGridBackground={false}
        //             borderColor={processColor('transparent')}
        //             borderWidth={0}
        //             drawBorders={false}

        //             touchEnabled={true}
        //             dragEnabled={false}
        //             scaleEnabled={true}
        //             scaleXEnabled={true}
        //             scaleYEnabled={true}
        //             pinchZoom={true}
        //             doubleTapToZoomEnabled={false}

        //             dragDecelerationEnabled={true}
        //             dragDecelerationFrictionCoef={0.99}

        //             keepPositionOnRotation={false}
        //             onChartSelect={this.handleSelect.bind(this)}
        //         />
        //         <View style={{flexDirection: 'row', justifyContent: 'center', height: 20}}>
        //             {cht.data.dataSets.map((item) => {
        //                 return (<View key={'legend' + item.key} style={{flexDirection: 'row', marginRight: item.key === cht.data.length ? 0 : 20, justifyContent: 'flex-start', alignItems: 'center'}}>
        //                     <View style={{marginRight: 6, width: 10, height: 10, borderRadius: 3, backgroundColor: item.config.bgColor}}></View>
        //                     <T style={{color: c('black light'), fontSize: 10}}>{item.label}</T>
        //                 </View>);
        //             })
        //             }
        //         </View></View>);
        // }
            
        if (type === 'score' || type === 'SCORE') {
            return (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <T style={{fontSize: 40 * ratio}}>{this.state.insightsResults[idx - 1].totalRecordsLocale}</T>
                <T style={{fontSize: 20 * ratio, color: c('black light')}}>{type}</T>
            </View>);
        }

        if (type === 'bar' || type === 'BAR') {
            

            let vals = buckets.map((item) => {
                return {y: [item.value, 0], marker: item.label};
            });

            let labels = buckets.map((item) => {
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

            return (<View><T style={{height: 20, marginBottom: -15, fontSize: 10, marginLeft: 10 * ratio, color: c('black light')}}>{this.state.insightsResults[idx - 1].chartData.options.yAxis.axisLabel}</T>
                <BarChart
                    style={{width: windowSize.width - 30, height: 160}}
                    xAxis={xAxis}
                    yAxis={yAxis}
                    animation={this.state.animation}
                    data={data}
                    scaleEnabled={false}
                    dragEnabled={false}
                    pinchZoom={false}
                    doubleTapToZoomEnabled={false}
                    touchEnabled={true}
                    legend={legend}
                    drawValueAboveBar={false}
                    chartDescription={{text: ''}}
                    marker={this.state.marker}
                    onChartSelect={this.handleSelect.bind(this)}
                /></View>);
        }
        if (type === 'line' || type === 'LINE') {
            let vals = [];

            for (let i = 0; i < buckets.length; i++) {
                vals.push({y: buckets[i].value, x: i});
            }
            let labels = buckets.map((item) => {
                return item.label;
            });
            let data = {
                dataSets: [{
                    values: vals,
                    label: 'Company X',
                    config: {
                        lineWidth: 1,
                        drawCircles: false,
                        highlightColor: processColor(c('purple main')),
                        color: processColor(c('purple main')),
                        valueTextSize: 0,
                        valueFormatter: '##.000'
                        // mode: 'HORIZONTAL_BEZIER'
                    }
                }]
            };
            let legend = {
                enabled: false
                // textColor: processColor(c('black light')),
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
                //     labels: ['days']
                // }
            };

            let xAxis = {
                valueFormatter: labels,
                // axisMaximum: 30,
                // axisMinimum: 15,
                labelCount: 5,
                drawAxisLine: false,
                position: 'BOTTOM',
                textColor: processColor('#737373'),
                gridColor: processColor('#737373')
            };

            let yAxis = {
                left: {// valueFormatter: ['15', '19', '23', '27', '30'],
                    valueFormatter: '##',
                    // axisMaximum: 8,
                    // axisMinimum: 0,
                    drawGridLines: false,
                    labelCount: 5,
                    drawLimitLinesBehindData: false,
                    drawAxisLine: false,
                    textColor: processColor('#737373'),
                    gridColor: processColor('#737373')
                },
                right: {
                    enabled: false
                }
            };

            return (<View><T style={{height: 20, marginBottom: -15, fontSize: 10, marginLeft: 10 * ratio}}>{this.state.insightsResults[idx - 1].chartData.options.yAxis.axisLabel}</T><LineChart
                style={{width: windowSize.width - 30, height: 160}}
                data={data}
                chartDescription={{text: ''}}
                legend={legend}
                marker={this.state.marker}
                animation={this.state.animation}
                xAxis={xAxis}
                yAxis={yAxis}
                drawGridBackground={false}
                borderColor={processColor('transparent')}
                borderWidth={0}
                drawBorders={false}

                touchEnabled={false}
                dragEnabled={false}
                scaleEnabled={false}
                scaleXEnabled={false}
                scaleYEnabled={false}
                pinchZoom={false}
                doubleTapToZoomEnabled={false}

                dragDecelerationEnabled={true}
                dragDecelerationFrictionCoef={0.99}

                keepPositionOnRotation={false}
                onChartSelect={this.handleSelect.bind(this)}
            /></View>);
        }
        // if (type === 'pie' || type === 'PIE') {
        //     return (<View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10}}>
        //         <PieChart
        //             style={{width: 160, height: 160}}
        //             logEnabled={true}
        //             animation={this.state.animation}
        //             chartBackgroundColor={processColor('transparent')}
        //             chartDescription={{text: ''}}
        //             data={cht.data}
        //             legend={cht.legend}

        //             entryLabelColor = {processColor('transparent')}
        //             entryLabelTextSize = {20 * ratio}
                
        //             rotationEnabled={false}
        //             drawSliceText={false}
        //             usePercentValues={false}
        //             centerText={'center\ntest'}
        //             centerTextRadiusPercent={100}
        //             holeRadius={90}
        //             holeColor={processColor('transparent')}
        //             transparentCircleRadius={90}
        //             transparentCircleColor={processColor('transparent')}
        //             maxAngle={360}
        //             onChartSelect={this.handleSelect.bind(this)}
        //         />
        //         <View style={{height: 160, justifyContent: 'center', width: windowSize.width - 230}}>
        //             {cht.data.dataSets[0].values.map((item) => {
        //                 return (<View key={'legend' + item.key} style={{flexDirection: 'row', marginBottom: 10, justifyContent: 'flex-start', alignItems: 'center'}}>
        //                     <View style={{marginRight: 6, width: 10, height: 10, borderRadius: 3, backgroundColor: cht.data.dataSets[0].config.bgColors[item.key - 1]}}></View>
        //                     <T>{item.label}</T>
        //                 </View>);
        //             })
        //             }
        //         </View>
        //     </View>);
        // }
        
        return null;
    }

    _generateSampleCardContent = (key, isSelected, isRise, type, text, chtype) => {
        let color = 'white';

        if (key !== this.state.selectedCard && isRise) {
            color = '#44C4DB';
        }
        if (key !== this.state.selectedCard && !isRise) {
            color = '#FC6180';
        }

        return (<View style={{width: '100%'}}>
            <TouchableOpacity
                onPress={() => { this.setState({selectedCard: key}); }}
            >
                <View style={{
                    height: 61 * ratio,
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
                    <View style = {{ width: 80 * ratio, height: 40 * ratio, marginTop: -3 * ratio}}>
                        {key !== this.state.selectedCard && this._generateSmallChart(chtype, this.smallChartData[key - 1])}
                        {key === this.state.selectedCard && this._generateSmallChart(chtype, this.smallWhiteChartData[key - 1])}
                    </View>
                </View>
                <View style = {{
                    backgroundColor: key === this.state.selectedCard ? c('transparent') : '#FCFCFC',
                    height: 45 * ratio - 4,
                    justifyContent: 'center',
                    borderRadius: 6,
                    paddingLeft: 6 * ratio,
                    borderWidth: key === this.state.selectedCard ? 0 : 0.3 * ratio,
                    borderColor: '#D5DBFE',
                    marginHorizontal: Platform.OS === 'android' ? 1: 0,
                    marginBottom: 2,
                    opacity: chtype !== 'score' ? 1 : 0
                }}>
                    <T style={{fontSize: 16 * ratio, color: key === this.state.selectedCard ? 'white' : c('black main')}}>{text}</T>
                    <T style={{fontSize: 10 * ratio, marginTop: 2 * ratio, fontWeight: 'normal', color: key === this.state.selectedCard ? 'white' : c('black light')}}>{type}</T>
                </View>
            </TouchableOpacity>
        </View>);
    }

    _generateCardContent = (key, isSelected, isRise, type, text, chtype) => {
        let color = 'white';

        if (key !== this.state.selectedCard && isRise) {
            color = '#44C4DB';
        }
        if (key !== this.state.selectedCard && !isRise) {
            color = '#FC6180';
        }

        let tempChart = [];

        if ( chtype === 'score' || chtype === 'SCORE' ) {
            tempChart = { text, type, key};
        }

        if (this.state.insightsResults[key - 1] && this.state.insightsResults[key - 1].buckets) {
            
            let buckets = _.clone(this.state.insightsResults[key - 1].buckets);

            buckets.sort((a, b) => {
                return a.label.localeCompare(b.label);
            });

            if (chtype === 'line' || chtype === 'LINE') {
                // tempChart = this.smallChartData[0];
                let vals = [];

                for (let i = 0; i < buckets.length; i++) {
                    vals.push({y: buckets[i].value, x: i});
                }

                tempChart = {
                    data: {
                        dataSets: [{
                            values: vals,
                            label: 'Company X',
                            config: {
                                lineWidth: 1,
                                drawCircles: false,
                                highlightColor: key !== this.state.selectedCard ? processColor(c('purple main')) : processColor('#FFFFFF'),
                                color: key !== this.state.selectedCard ? processColor(c('purple main')) : processColor('#FFFFFF'),
                                valueTextSize: 0,
                                valueFormatter: '##.000'
                                // mode: 'HORIZONTAL_BEZIER'
                            }
                        }]
                    }
                };
            }

            // //pie
            // {
            //     data: {
            //         dataSets: [{
            //             values: [{key: 1, value: 50, label: 'Sales'},
            //                 {key: 2, value: 30, label: 'Pending Tickets'},
            //                 {key: 3, value: 20, label: 'Tchurn Risk'}],
            //             label: '',
            //             config: {
            //                 colors: [processColor('#6F85FF'), processColor('#0DB3D0'), processColor('#FC6180')],
            //                 bgColors: ['#6F85FF', '#0DB3D0', '#FC6180'],
            //                 valueTextSize: 20,
            //                 valueTextColor: processColor('transparent'),
            //                 sliceSpace: 1,
            //                 selectionShift: 5
            //             }
            //         }]
            //     }
            // },

            if (chtype === 'bar' || chtype === 'BAR') {
                
                let vals = buckets.map((item) => {
                    return {y: [item.value, 0], marker: item.label};
                });
                let clrs = key !== this.state.selectedCard ? [processColor('#44C4DB'), processColor('#FC6180')] : [processColor('#FFFFFF'), processColor('#FC6180')];

                tempChart = {
                    data: {
                        dataSets: [{
                            values: vals,
                            label: 'Stacked Bar dataset',
                            config: {
                                colors: clrs,
                                stackLabels: ['Engineering', 'Sales'],
                                valueTextColor: processColor('transparent')
                            }
                        }]
                    }
                };
            }

        }

        return (<View style={{width: '100%'}}>
            <TouchableOpacity
                onPress={() => { this.setState({selectedCard: key}); setTimeout(() => { this.loadRecords(); }, 100); }}
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
                    backgroundColor: key === this.state.selectedCard ? c('transparent') : '#FCFCFC',
                    height: 50 * ratio,
                    justifyContent: 'center',
                    borderRadius: 6,
                    paddingLeft: 6 * ratio,
                    borderWidth: key === this.state.selectedCard ? 0 : 0.3 * ratio,
                    borderColor: '#D5DBFE',
                    marginHorizontal: Platform.OS === 'android' ? 1 : 0,
                    opacity: chtype !== 'score' && chtype !== 'SCORE' ? 1 : 0
                }}>
                    <T style={{fontSize: 16 * ratio, color: key === this.state.selectedCard ? 'white' : c('black main')}}>{text}</T>
                    <T style={{fontSize: 10 * ratio, marginTop: 2 * ratio, fontWeight: 'normal', color: key === this.state.selectedCard ? 'white' : c('black light')}}>{type}</T>
                </View>
            </TouchableOpacity>
        </View>);
    }

    _renderSampleCardSlide = () => {
        return this.state.sDatas.map((item) => {
            return (<CardView
                key={'cardview' + item.key}
                Mkey={item.key}
                Mwidth={80 * ratio}
                Mheight={101 * ratio}
                Mstartcolor={item.key === this.state.selectedCard ? '#A887D8' : c('transparent')}
                Mendcolor={item.key === this.state.selectedCard ? c('purple main') : c('transparent')}
                Mcontent={this._generateSampleCardContent(item.key, item.isSelected, item.isRise, item.type, item.text, item.chartType)}
            />);
        });
    }

    _renderCardSlide = () => {
        console.log('insightsResults', this.state.insights);
        if ( this.state.insights.length > 0) {
            return this.state.insights.map((item) => {
                return (<CardView
                    key={'cardview' + item.key}
                    Mkey={item.key}
                    Mwidth={80 * ratio}
                    Mheight={101 * ratio}
                    Mstartcolor={item.key === this.state.selectedCard ? '#A887D8' : c('transparent')}
                    Mendcolor={item.key === this.state.selectedCard ? c('purple main') : c('transparent')}
                    Mcontent={this._generateCardContent(item.key, true, true, item.data.label, this.state.insightsResults[item.key - 1] ? this.state.insightsResults[item.key - 1].totalRecordsLocale : '', item.data.config.visualization.type)}
                />);
            });
        }
        
        return null;
    }

    _generateWatchlistCard = (data) => {
        // alert(this.props.currentMenuId);
        if (this.props.currentMenuId === 'noDash') {
            return (<View style={{
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
            }} key={'wtcard' + data.key}>
                <T style={{fontSize: 14 * ratio, color: '#485465', width: '35%'}}>{data.text}</T>
                <View style={{width: '65%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: '#F3F3F4', paddingLeft: 20}}>
                    <View style={{}}>
                        <T style={{color: c('black main'), fontSize: 16 * ratio}}>{data.typeValue}</T>
                        <T style={{color: c('black light'), fontSize: 10 * ratio}}>{data.typeText}</T>
                    </View>
                    <View style={{width: 43 * ratio, height: 22 * ratio, backgroundColor: data.rise === 1 ? '#0DB3D0' : '#FC6180', borderRadius: 3, justifyContent: 'center', flexDirection: 'row', alignItems: 'center'}}>
                        <T style={{textAlign: 'center', color: 'white', marginRight: 3}}>{data.value}</T>
                        {data.rise === 1 && <Icon
                            name={'UpArrow'}
                            width={10 * ratio}
                            height={10 * ratio}
                            color = {'white'}
                            fill = {'white'}
                        />}
                        {data.rise === -1 && <Icon
                            name={'DownArrow'}
                            width={10 * ratio}
                            height={10 * ratio}
                            color = {'white'}
                            fill = {'white'}
                        />}
                    </View>
                </View>
            </View>);
        }

        if (data.id === undefined) {
            return null;
        }

        return (<View style={{
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
        </View>);
    }

    onPikcerSelect = (index) => {
        this.setState({
            pickerSelected: index
        });
    }

    _renderPicker = () => {

        // let PickerItem = Picker.Item;
        
        // if (this.state.showPicker) {
        //     return (<View style={{backgroundColor: '#0000006E', flex: 1, position: 'absolute', zIndex: 555, left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
        //         <View style={{width: 180, height: 263, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
        //             <View style={{paddingHorizontal: 8, paddingVertical: 13, borderBottomColor: c('purple border'), borderBottomWidth: 1, width: '100%'}}>
        //                 <T style={{color: c('purple border'), fontSize: 16}}>Please Select</T>
        //             </View>
        //             <Picker style={{width: 150, height: 180, marginTop: -15, marginBottom: 15}}
        //                 selectedValue={this.state.pickerSelected}
        //                 itemStyle={{color: '#555457', fontSize: 26, borderColor: 'red'}}
        //                 onValueChange={(index) => this.onPikcerSelect(index)}>
        //                 {this.pickerList.map((value, i) => (
        //                     <PickerItem label={value} value={i} key={'money' + value}/>
        //                 ))}
        //             </Picker>
        //             <View style={{paddingVertical: 11, height: 38, borderTopColor: c('black light'), borderTopWidth: 1, width: '100%'}}>
        //                 <TouchableOpacity onPress = { () => { this.setState({showPicker: false}); }}>
        //                     <T style={{fontSize: 14, textAlign: 'center'}}>Done</T>
        //                 </TouchableOpacity>
        //             </View>
        //         </View>
        //     </View>);
        // }
        
        return null;
        
    }

    _onRefresh = () => {
        if (this.props.currentMenuId !== 'noDash') {
            this._refreshDashboard(this.props.currentMenuId);
        }
    }

    render () {
        return (
            <View style={{backgroundColor: 'white'}}>
                
                <StatusBar barStyle="default" />
                {this._renderPicker()}
                {this._renderHeader()}
                {this._renderFilterView()}
                
                <View style={{
                    height: windowSize.height - 100 * ratio,
                    marginBottom: 40 * ratio
                }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh.bind(this)}
                                title="Loading..."
                            />
                        }
                    >
                        <View style={{
                            paddingTop: 28 * ratio
                        }}>
                            <T style={{color: c('purple main'), fontSize: 14 * ratio, marginLeft: 19}}>Swipe to explore more</T>
                            <ScrollView horizontal= {true}
                                showsHorizontalScrollIndicator={false}
                                style={{paddingVertical: 13 * ratio}}>
                                {this.state.insights.length > 0 && this.props.currentMenuId !== 'noDash' && this._renderCardSlide()}
                                {this.props.currentMenuId === 'noDash' && this._renderSampleCardSlide()}
                            </ScrollView>
                        </View>

                        <View style={{marginTop: 4 * ratio, paddingHorizontal: 19}}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <T style={{fontSize: 14 * ratio}}>{this.state.insights[this.state.selectedCard - 1] ? this.state.insights[this.state.selectedCard - 1].data.label : ''}</T>
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

                        <View style={{height: 230, paddingHorizontal: 15, width: windowSize.width, flex: 1, marginTop: 18}}>
                            
                            {this.props.currentMenuId !== 'noDash' && this.state.insightsResults[this.state.selectedCard - 1] && this._generateChart(this.state.selectedCard)}
                            {this.props.currentMenuId === 'noDash' && this._generateSampleChart(this.state.sDatas[this.state.selectedCard - 1].chartType, this.chartData[this.state.selectedCard - 1])}
                            {/* <View style={{flexDirection: 'row', width: '100%', height: 30, marginTop: 25, paddingHorizontal: 10}}>
                                { this.graphFilters.map((item) => {
                                    return (
                                        <TouchableOpacity key={'gpfilter' + item.key}
                                            style={{flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: 6,
                                                borderColor: item.key === this.state.selectedGPFilter ? c('purple border') : c('transparent'), borderWidth: 1}}
                                            onPress={() => { this.setState({selectedGPFilter: item.key}); }}>
                                            <T style={{color: item.key === this.state.selectedGPFilter ? c('purple border') : '#555457', fontSize: 12 * ratio}}>{item.text}</T>
                                        </TouchableOpacity>);
                                })
                                }
                            </View> */}
                        </View>

                        <View style={{backgroundColor: 'white', paddingTop: 0, paddingHorizontal: 6}}>
                            {this.state.recordLabel !== '' && <View style={{flexDirection: 'row', justifyContent: 'space-between', height: 21 * ratio, paddingHorizontal: 15, marginBottom: 24}}>
                                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => { this.setState({showPicker: true}); }}>
                                    <T style={{color: c('purple border'), fontSize: 16 * ratio}}>{this.state.recordLabel}</T>
                                    {/* <Icon
                                        name={'ArrowDown'}
                                        width={15 * ratio}
                                        height={15 * ratio}
                                        fill={'#555457'}
                                    /> */}
                                </TouchableOpacity>
                                <View>
                                    <IconButton
                                        name={'Order'}
                                        size={20 * ratio}
                                        fill={c('black light')}
                                        color={c('black light')}
                                    />
                                </View>
                            </View>}
                            {this.state.wtList.map((item) => { return this._generateWatchlistCard(item); })}
                            {this.state.showMore && <View style={{paddingVertical: 20, alignItems: 'center'}}>
                                <TouchableOpacity
                                    style={{
                                        height: 40 * ratio,
                                        width: 132 * ratio,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        borderColor: c('purple border'),
                                        borderRadius: 6
                                    }}
                                    onPress={() => { this.loadRecords(this.bkIndex, this.state.pageNum + 1); this.setState({pageNum: this.state.pageNum + 1}); }}
                                >
                                    <T style={{fontSize: 14 * ratio}}>see more</T>
                                </TouchableOpacity>
                            </View>}
                        </View>
                        <View style={{width: 100, height: 40}}></View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

CompanyHome.propTypes = {
    navigation: PropTypes.any,
    route: PropTypes.any
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyHome);
