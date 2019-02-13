import React from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import Toggle from 'material-ui/Toggle'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

let datalist;
const styles = {
    finderColor: {
        backgroundColor: 'rgb(183, 29, 27)'
    },
    thumbOff: {
        backgroundColor: '#ffcccc',
    },
    trackOff: {
        backgroundColor: '#ff9d9d',
    },
    thumbSwitched: {
        backgroundColor: 'red',
    },
    trackSwitched: {
        backgroundColor: '#ff9d9d',
    },
    labelStyle: {
        color:"rgb(117, 117, 117)",
        fontSize: ".9rem"
    },
}

let minDate, maxDate;

class TabHumanitarian extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tabData: 'type',
        }
        this._minDate = props.getMinDate;
        this._maxDate = props.getMaxDate;
    //     this._typeIncident = props.typeIncident;
    //     this._targetIncident = props.targetIncident;
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.typeIncident!==this.props.typeIncident){
            // console.log(this.props.typeIncident);
          }
        
    }

    handleChangeData = (value) => {
        this.setState({ tabData: value });
        console.log(value);

        console.log(this._minDate);
        console.log(this._maxDate);
        // console.log(this._typeIncident);
        // console.log(this._targetIncident);

        let API_PATH;
        // let formData = new URLSearchParams();
        let formData = new FormData();

        if(value === 'type'){
            API_PATH = 'http://localhost:8000/geoapi/sam_params/';
            formData.append('query_type', 'main_type');
            formData.append('query_type', 'type');
        } else if(value === 'target'){
            API_PATH = 'http://localhost:8000/geoapi/sam_params/';
            formData.append('query_type', 'main_target');
            formData.append('query_type', 'target');
        } else {
            API_PATH = 'http://localhost:8000/geoapi/incident_raw/';
            formData.append('query_type', 'main_type');
            formData.append('query_type', 'type');
        }

        formData.append('start_date', this._minDate.getFullYear()+'-'+this._minDate.getMonth()+'-'+this._minDate.getDate());
        formData.append('end_date', this._maxDate.getFullYear()+'-'+this._maxDate.getMonth()+'-'+this._maxDate.getDate());
        formData.append('incident_type', this._typeIncindent);
        formData.append('incident_target', this._targetIncindent);
        formData.append('filterlock', '');

        console.log(formData);
        // fetch(API_PATH, {
		// 	method: "POST",
		// 	dataType: "HTML",
		// 	headers: {
		// 		'Accept': '*/*',
		// 		"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        //     },
        //     body: formData
        //     // body: "query_type=main_type&query_type=type&start_date="+minDate.getFullYear()+"-"+minDate.getMonth()+"-"+minDate.getDate()+"&end_date="+maxDate.getFullYear()+"-"+maxDate.getMonth()+"-"+maxDate.getDate()+"&incident_type=&incident_target=&filterlock="
		// })
		// 	.then(response => {
		// 		if (response.ok) {
		// 			return response.json();
		// 		} else {
		// 			throw new Error('Something wrong ...');
		// 		}
		// 	})
		// 	// .then(data => this.setState({ results: [data.panels_list], isLoading: false }))
		// 	.then(function(data){console.log(data);})
		// 	.catch(error => this.setState({ error }));
    };

    // _handleOpen = (tap) => {
    //     console.log('active');
    //     console.log(tap);
    //     datalist = tap;
    //     return datalist
    //     // this.state.getPackages.map((pckg) => {
    //     //     var JSPATH = STATIC_URL + pckg.package + "/js/" + pckg.js;
    //     //     var JSBUNDLE = STATIC_URL + pckg.package + "/js/" + pckg.bundle;
    //     //     var API = pckg.api;
    //     //     var DOM_ID = pckg.domID;
    //     //     $.getScript(JSPATH, function (data, textStatus, jqxhr) {
    //     //         addDivPackage(DOM_ID);
    //     //         setTimeout(getBundle(JSBUNDLE, API, DOM_ID), 100);
    //     //     });
    //     // })
    // }

    render(){
        const { tabData } = this.state;

        // console.log(this.props.typeIncident);
        // console.log(this.props.targetIncident);

        return(
            <div>

                <div style={{"padding": "5px 15px 10px"}}>
                    <Toggle
                        label="Default data filter"
                        thumbStyle={styles.thumbOff}
                        trackStyle={styles.trackOff}
                        thumbSwitchedStyle={styles.thumbSwitched}
                        trackSwitchedStyle={styles.trackSwitched}
                        labelStyle={styles.labelStyle}
                    />
                </div>
                <Card>

                <Tabs
                    tabItemContainerStyle={styles.finderColor}
                    value={tabData}
                    onChange={this.handleChangeData}
                >
                    <Tab label="Type" value="type" className={"titleTabs"}>
                        <div>
                            {datalist}
                        </div>
                    </Tab>
                    <Tab label="Target" value="target" className={"titleTabs"}>
                        <div>
                            {datalist}
                        </div>
                    </Tab>
                    <Tab label="Incidents" value="incidents" className={"titleTabs"}>
                        <div>
                            {datalist}
                        </div>
                    </Tab>
                </Tabs>
                </Card>
            </div>
        )
    }
}

export default TabHumanitarian