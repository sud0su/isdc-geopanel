import React, { Fragment } from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import Toggle from 'material-ui/Toggle'
import RefreshIndicator from 'material-ui/RefreshIndicator'

import {Card} from 'material-ui/Card'

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
			isLoading: false,
            error: null,
            results: [],
            toggleStatus: true
        }
        this._baseUrl = window.BASE_URL;
    }

    handleChangeData = (value) => {
        this.setState({ tabData: value });
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
			.then(data => this.setState({ results: data, isLoading: false }))
            .catch(error => this.setState({ error, isLoading: false }));
    };

    tableType = (results) => {
        const tblTitle = results.values_titles.map((items, index) => <td key={index} style={{ "font-weight":"bold" }}>{items}</td>)
        const tblFooter =<Fragment>
                <tr>
                    <td style={{ "font-weight":"bold" }}>Total</td>
                    <td style={{ "font-weight":"bold" }}>{ results.total_incident }</td>
                    <td style={{ "font-weight":"bold" }}>{ results.total_dead }</td>
                    <td style={{ "font-weight":"bold" }}>{ results.total_injured }</td>
                    <td style={{ "font-weight":"bold" }}>{ results.total_violent }</td>
                </tr>
                <tr>
                    <td colspan="5" style={{ "text-align":"center", "font-weight":"bold" }}>LAST UPDATED</td>
                </tr>
                <tr>
                    <td colspan="3" style={{ "font-weight":"bold" }}>Last incidents </td><td colspan="2">{ results.last_incidentdate }</td>
                </tr>
                <tr>
                    <td colspan="3" style={{ "font-weight":"bold" }}>Last synchronized </td><td colspan="2">{ results.last_incidentsync }</td>
                </tr>
            </Fragment>
        const listChild = (listchild) => {
            let getListChild = []
            for(var j=0; j < listchild.length; j++){
                getListChild.push(<td>{listchild[j]}</td>)
            }
            return getListChild
        }
        const childBody = (childs) => {
            let childdata = [];
            for(var i=0;i < childs.length; i++){
                childdata.push(<tr>{listChild(childs[i])}</tr>)
            }
            return childdata
        }
        const tblBody = results.values.map((items) =>
            <Fragment>
                <tr><td colspan="5" style={{ "font-weight":"bold" }}>{items.title}</td></tr>
                {childBody(items.values)}
            </Fragment>
        )
        let template = <table class="securitytable">
                            <thead>
                                <tr><th colspan="5" style={{ "text-align":"center", "font-weight":"bold" }}>Type of Incidents</th></tr>
                                <tr>{tblTitle}</tr>
                            </thead>
                            <tbody>
                                {tblBody}
                                {tblFooter}
                            </tbody>
                        </table>;
        return template;
    }

    tableTarget = (results) => {
        const tblTitle = results.values_titles.map((items, index) => <td key={index} style={{ "font-weight":"bold" }}>{items}</td>)
        const tblFooter =<Fragment>
                <tr>
                    <td style={{ "font-weight":"bold" }}>Total</td>
                    <td style={{ "font-weight":"bold" }}>{ results.total_incident }</td>
                    <td style={{ "font-weight":"bold" }}>{ results.total_dead }</td>
                    <td style={{ "font-weight":"bold" }}>{ results.total_injured }</td>
                    <td style={{ "font-weight":"bold" }}>{ results.total_violent }</td>
                </tr>
                <tr>
                    <td colspan="5" style={{ "text-align":"center", "font-weight":"bold" }}>LAST UPDATED</td>
                </tr>
                <tr>
                    <td colspan="3" style={{ "font-weight":"bold" }}>Last incidents </td><td colspan="2">{ results.last_incidentdate }</td>
                </tr>
                <tr>
                    <td colspan="3" style={{ "font-weight":"bold" }}>Last synchronized </td><td colspan="2">{ results.last_incidentsync }</td>
                </tr>
            </Fragment>
        const listChild = (listchild) => {
            let getListChild = []
            for(var j=0; j < listchild.length; j++){
                getListChild.push(<td>{listchild[j]}</td>)
            }
            return getListChild
        }
        const childBody = (childs) => {
            let childdata = [];
            for(var i=0;i < childs.length; i++){
                childdata.push(<tr>{listChild(childs[i])}</tr>)
            }
            return childdata
        }
        const tblBody = results.values.map((items) =>
            <Fragment>
                <tr><td colspan="5" style={{ "font-weight":"bold" }}>{items.title}</td></tr>
                {childBody(items.values)}
            </Fragment>
        )
        let template = <table class="securitytable">
                            <thead>
                                <tr><th colspan="5" style={{ "text-align":"center", "font-weight":"bold" }}>Target of Incidents</th></tr>
                                <tr>{tblTitle}</tr>
                            </thead>
                            <tbody>
                                {tblBody}
                                {tblFooter}
                            </tbody>
                        </table>;
        return template;
    }

    tableIncident = (results) => {
        const tblTitle = results.values_titles.map((items, index) => <td key={index} style={{ "font-weight":"bold", "text-align":"center" }}>{items}</td>)
        const tblFooter =<Fragment>
                <tr>
                    <td colspan="2" style={{ "text-align":"center", "font-weight":"bold" }}>LAST UPDATED</td>
                </tr>
                <tr>
                    <td style={{ "font-weight":"bold" }}>Last incidents </td><td>{ results.last_incidentdate }</td>
                </tr>
                <tr>
                    <td style={{ "font-weight":"bold" }}>Last synchronized </td><td>{ results.last_incidentsync }</td>
                </tr>
            </Fragment>

        const tblBody = results.values.map((items, index) =>
            <tr>
                <td style={{ "font-weight":"bold", "vertical-align": "initial", "text-align":"center", "width":"110px" }}>{items[0]}</td>
                <td style={{ "word-break": "break-word" }}>{items[1]}</td>
            </tr>
        )
        let template = <table class="incidentTable">
                            <thead>
                                <tr><th colspan="2" style={{ "text-align":"center", "font-weight":"bold" }}>Incident list</th></tr>
                                <tr>{tblTitle}</tr>
                            </thead>
                            <tbody>
                                {tblBody}
                                {tblFooter}
                            </tbody>
                        </table>;
        return template;
    }

    _onToggle = (value) => {
        console.log(value);
        this.setState({ toggleStatus: !this.state.toggleStatus })
        console.log(this.state.toggleStatus)
    }

    render(){
        const { tabData, error, isLoading, results, toggleStatus } = this.state;

        const loading = (
			<div style={styles.container}>
				<RefreshIndicator
					loadingColor="rgb(0, 188, 212)"
					size={40}
					left={-20}
					top={10}
					status={'loading'}
					style={{marginLeft: '50%'}}
				/>
			</div>
        )

		if (error) {
			return <p>{error.message}</p>;
        }

        let AppendData;
        if(tabData === 'type'){
            AppendData = (results.length === 0) ? '<button>reload</button>' : this.tableType(results);
        } else if(tabData === 'target'){
            AppendData = (results.length === 0) ? '<button>reload</button>' : this.tableTarget(results);
        } else if(tabData === 'incidents'){
            AppendData = (results.length === 0) ? '<button>reload</button>' : this.tableIncident(results);
        }
        let humanitarianAccess = isLoading ? loading : AppendData;

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
                        toggled={toggleStatus}
                        onToggle={this._onToggle}
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
                            {humanitarianAccess}
                        </div>
                    </Tab>
                    <Tab label="Target" value="target" className={"titleTabs"}>
                        <div>
                            {humanitarianAccess}
                        </div>
                    </Tab>
                    <Tab label="Incidents" value="incidents" className={"titleTabs"}>
                        <div>
                            {humanitarianAccess}
                        </div>
                    </Tab>
                </Tabs>
                </Card>
            </div>
        )
    }
}

export default TabHumanitarian