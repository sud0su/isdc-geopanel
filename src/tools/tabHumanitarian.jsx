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
        this._baseUrl = window.BASE_URL;
    }

    handleChangeData = (value) => {
        this.setState({ tabData: value });
        console.log('propsType=',this.props.typeIncident,'+propsTarget=',this.props.targetIncident);

        let API_PATH;
        let formData = new URLSearchParams();

        if(value === 'type'){
            API_PATH = this._baseUrl+'/geoapi/sam_params/';
            formData.append('query_type', 'main_type');
            formData.append('query_type', 'type');
        } else if(value === 'target'){
            API_PATH = this._baseUrl+'/geoapi/sam_params/';
            formData.append('query_type', 'main_target');
            formData.append('query_type', 'target');
        } else {
            API_PATH = this._baseUrl+'/geoapi/incident_raw/';
            formData.append('query_type', 'main_type');
            formData.append('query_type', 'type');
        }

        const month2DigitStart = (this.props.getMinDate.getMonth() < 10 ? '0': '') + (this.props.getMinDate.getMonth()+1);
        const date2DigitStart = (this.props.getMinDate.getDate() < 10 ? '0': '') + (this.props.getMinDate.getDate());
        const month2DigitEnd = (this.props.getMaxDate.getMonth() < 10 ? '0': '') + (this.props.getMaxDate.getMonth()+1);
        const date2DigitEnd = (this.props.getMaxDate.getDate() < 10 ? '0': '') + (this.props.getMaxDate.getDate());

        formData.append('start_date', this.props.getMinDate.getFullYear()+'-'+month2DigitStart+'-'+date2DigitStart);
        formData.append('end_date', this.props.getMaxDate.getFullYear()+'-'+month2DigitEnd+'-'+date2DigitEnd);

        const typeArray = ['Abandonment/Defection', 'Arrest', 'Attack', 'Civilian accident', 'Demonstration', 'IED',
        'Kidnapping', 'Military / Non-Military Operations', 'Murder/Execution', 'Others',
        'Small Arms Fire (SAF)', 'UXO', 'Weapons'];
        if (this.props.typeIncident === 'all') {
            formData.append('incident_type', '')
        } else {
            for (var i = 0; i < this.props.typeIncident.length; i++) {
                for (var j = 0; j < typeArray.length; j++) {
                    if (this.props.typeIncident[i] === j) {
                        formData.append('incident_type', typeArray[j])
                    }
                }
            }
        }

        const targetArray = ['Armed Opposition Group','Civilians','Goverment','Humanitarian Community','Infrastructure',
        'International Humanitarian Community','International Millitary','Police / Millitary Goverment','Unknown'];
        if (this.props.targetIncident === 'all') {
            // _getTargetData.push('all');
            formData.append('incident_target', '')
        } else {
            for (var i = 0; i < this.props.targetIncident.length; i++) {
                for (var j = 0; j < targetArray.length; j++) {
                    if (this.props.targetIncident[i] === j) {
                        formData.append('incident_target', targetArray[j])
                    }
                }
            }
        }

        formData.append('filterlock', '');

        fetch(API_PATH, {
			method: "POST",
			dataType: "HTML",
			headers: {
				'Accept': '*/*',
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: formData
		})
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('Something wrong ...');
				}
			})
			// .then(data => this.setState({ results: [data.panels_list], isLoading: false }))
			.then(function(data){console.log(data);})
			.catch(error => this.setState({ error }));
    };

    render(){
        const { tabData } = this.state;
        
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