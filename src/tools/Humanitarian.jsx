import React from 'react'

// material ui components
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import {Tabs, Tab} from 'material-ui/Tabs'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import FlatButton from 'material-ui/FlatButton'
import DatePicker from 'material-ui/DatePicker'
import Toggle from 'material-ui/Toggle'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, } from 'material-ui/Table'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

//tooltip
import 'react-tippy/dist/tippy.css'
import { Tooltip, } from 'react-tippy'

// icon-material ui
import FontIcon from 'material-ui/FontIcon'
import '../../css/panel.css'

const styles = {
    marginCard:{
        marginTop: 8
    },
    iconBg: {
        backgroundColor: 'rgb(183, 29, 27)',
        padding: 4,
        fontSize: 20,
        borderRadius: '50%',
        color: '#fff'
    },
    finderColor: {
        backgroundColor: 'rgb(183, 29, 27)'
    }
};

const items = [
    <MenuItem key={1} value={1} primaryText="Never" />,
    <MenuItem key={2} value={2} primaryText="Every Night" />,
    <MenuItem key={3} value={3} primaryText="Weeknights" />,
    <MenuItem key={4} value={4} primaryText="Weekends" />,
    <MenuItem key={5} value={5} primaryText="Weekly" />,
  ];
  
let datalist, minDate, maxDate;
let indicatorData = [];
class Humanitarian extends React.Component {
    constructor(props){
        super(props);

        minDate = new Date();
        maxDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 1);
        minDate.setHours(0, 0, 0, 0);
        maxDate.setFullYear(maxDate.getFullYear());
        maxDate.setHours(0, 0, 0, 0);

        this.state= {
            minDate: minDate,
            maxDate: maxDate,
            filter: 'entireAfg',
            autoOk: true,
            expanded: false,
            prov_dist: true,
            valueprov: null,
            valuedist: null,
			error: null,
            tabData: 'type'
        }
    }
    
    handleProv = (event, index, valueprov) => this.setState({valueprov});
    handleDist = (event, index, valuedist) => this.setState({valuedist});

    handleChange = (event, filter) => {
        let drawArea = false;
        if(filter === 'drawArea') {
            drawArea = true;
            this._drawArea(drawArea);
        } else {
            this._drawArea(drawArea);
        }
        if(filter === 'ProvDist'){
            this.setState({ prov_dist: false })
        } else {
            this.setState({ prov_dist: true })    
        }
        this.setState({ filter: filter })
    }

    _changeMinDate = (event, date) => {
        this.setState({minDate: date})
    }

    _changeMaxDate = (event, date) => {
        this.setState({maxDate: date})
    }

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

    handleChangeData = (value) => {
        this.setState({ tabData: value });
        // this._handleOpen(value);
        console.log(value);

        let API_PATH;
        let formData = new URLSearchParams();

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

        formData.append('start_date', minDate.getFullYear()+'-'+minDate.getMonth()+'-'+minDate.getDate());
        formData.append('end_date', maxDate.getFullYear()+'-'+maxDate.getMonth()+'-'+maxDate.getDate());
        formData.append('incident_type', '');
        formData.append('incident_target', '');
        formData.append('filterlock', '');

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

    _selectTypeRow = (selectedRows) => {
        console.log(selectedRows);
        if(selectedRows === "all"){
            this.handleChangeData("type");
        } else {
            const typeArray = ['Abandonment/Defection', 'Arrest', 'Attack', 'Civilian accident', 'Demonstration', 'IED',
                'Kidnapping', 'Military / Non-Military Operations', 'Murder/Execution', 'Others',
                'Small Arms Fire (SAF)', 'UXO', 'Weapons'];
    
            if (selectedRows.length > 0) {
                indicatorData = [];
                for (var i = 0; i < typeArray.length; i++) {
                    for (var j = 0; j < selectedRows.length; j++) {
                        if (selectedRows[j] === i) {
                            indicatorData.push(typeArray[i]);
                        }
                    }
                }
            // } else {
            //     indicatorData = [];
            }
            console.log(indicatorData);
            // return indicatorData;
        }
    }

    render() {
        const { handleClose } = this.props;
        const { prov_dist, tabData } = this.state;

        const cardHumanitarian = (
            <Card>
                <div className={"boxTitle"}>
                    <div className={"left"}>
                        <FontIcon className="material-icons" style={styles.iconBg}>supervisor_account</FontIcon>
                    </div>
                    <div className={"right"}>
                        <div className={"drawerName"}>Humanitarian Access</div>
                        <FontIcon onClick={handleClose} className={"material-icons closeDrawer"}>arrow_right</FontIcon>
                    </div>
                </div>
            </Card>
        )

        let _updateStatus = 'last updated 3 days ago';
        const date = (
            <Card>
                <CardHeader
                    title="Updated Status"
                    subtitle={_updateStatus}
                    titleStyle={{ 'font-size': 12, 'color': 'rgba(47, 47, 47, 0.87)', fontWeight: 'bold' }}
                    subtitleStyle={{ 'font-size': 11 }}
                    className={"cardTitleUpdated"}
                />
                <div className={"boxContent"} style={{ paddingBottom: '1px' }}>
                    <table>
                        <tr>
                            <td className={"labelDate"}>
                                <FontIcon className={"material-icons"}>calendar_today</FontIcon>
                            </td>
                            <td style={{ width: '40%' }}>
                                <Tooltip
                                    title="Start Date"
                                    position="bottom"
                                    arrow={true}
                                    trigger="mouseenter"
                                    size="big"
                                >
                                    <DatePicker
                                        hintText="Start Date"
                                        textFieldStyle={{ fontSize: '14px', fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.87)', width: '100%' }}
                                        autoOk={this.state.autoOk}
                                        style={{ borderBottom: 'solid 1px transparent' }}
                                        className={"dateHeight"}
                                        defaultDate={this.state.minDate}
                                        onChange={this._changeMinDate}
                                    />
                                </Tooltip>
                            </td>

                            <td className={"labelDate"}>
                                <FontIcon className={"material-icons"}>calendar_today</FontIcon>
                            </td>
                            <td style={{ width: '40%' }}>
                                <Tooltip
                                    title="End Date"
                                    position="bottom"
                                    arrow={true}
                                    trigger="mouseenter"
                                    size="big"
                                >
                                    <DatePicker
                                        hintText="End Date"
                                        textFieldStyle={{ fontSize: '14px', fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.87)', width: '100%' }}
                                        autoOk={this.state.autoOk}
                                        style={{ borderBottom: 'solid 1px transparent' }}
                                        className={"dateHeight"}
                                        defaultDate={this.state.maxDate}
                                        onChange={this._changeMaxDate}
                                    />
                                </Tooltip>
                            </td>
                        </tr>
                    </table>
                </div>
            </Card>
        )
        
        const tabtabData = (
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
        )

        const cardRadioButton = (
            <div className={"boxOption boxOptionExpand"}>
                    <RadioButtonGroup name="filter" onChange={this.handleChange} valueSelected={this.state.filter}>
                        <RadioButton
                            value="currentExtent"
                            label="Current Extent"
                            className={"drawerRadio"}
                            iconStyle={{ fill: '#b71d1b' }}
                            // labelStyle={{color: '#b71d1b' }}
                        />
                        <RadioButton
                            value="entireAfg"
                            label="Entire Afghanistan"
                            className={"drawerRadio"}
                            iconStyle={{ fill: '#b71d1b' }}
                            // labelStyle={{color: '#b71d1b' }}
                        />
                        <RadioButton
                            value="drawArea"
                            label="Draw Area"
                            className={"drawerRadio"}
                            iconStyle={{ fill: '#b71d1b' }}
                            // labelStyle={{color: '#b71d1b' }}
                        />
                        <RadioButton
                            value="ProvDist"
                            label="Provinces and Districts"
                            className={"drawerRadio"}
                            iconStyle={{ fill: '#b71d1b' }}
                            // labelStyle={{color: '#b71d1b' }}
                        />
                    </RadioButtonGroup>
            </div>
        )

        let overlay = prov_dist ? "boxOverlay" : "removeOverlay";
        const selectField = (
            <Card>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <div className={overlay}></div>
                    <div className={"boxSelect"}>
                        <div className={"boxList"}>
                            <div className={"optLeft"}>
                                <FontIcon className="material-icons" style={styles.iconLoc}>location_on</FontIcon>
                            </div>
                            <div className={"optRight"}>
                                <SelectField
                                    hintText="Select a province"
                                    hintStyle={{ fontSize: '13px', fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.87)' }}
                                    labelStyle={{ fontSize: '13px', fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.87)' }}
                                    underlineStyle={{ 'border': 'none' }}
                                    underlineDisabledStyle={{ 'border-color': 'transparent' }}
                                    value={this.state.valueprov}
                                    onChange={this.handleProv}
                                    maxHeight={300}
                                    fullWidth={true}
                                    disabled={prov_dist}
                                >
                                    {items}
                                </SelectField>
                            </div>
                            <div className={"clearfix"}></div>
                        </div>
                    </div>
                    <div className={"boxSelect"}>
                        <div className={"boxList"}>
                            <div className={"optLeft"}>
                                <FontIcon className="material-icons" style={styles.iconLoc}>location_on</FontIcon>
                            </div>
                            <div className={"optRight"}>
                                <SelectField
                                    hintText="Select a district"
                                    hintStyle={{ fontSize: '13px', fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.87)' }}
                                    labelStyle={{ fontSize: '13px', fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.87)' }}
                                    underlineStyle={{ 'border': 'none' }}
                                    underlineDisabledStyle={{ 'border-color': 'transparent' }}
                                    value={this.state.valuedist}
                                    onChange={this.handleDist}
                                    maxHeight={300}
                                    fullWidth={true}
                                    disabled={prov_dist}
                                >
                                    {items}
                                </SelectField>
                            </div>
                            <div className={"clearfix"}></div>
                        </div>
                    </div>
                </div>
            </Card>
        ) 

        const ExpandAreaOfInterest = (
            <div>
                {cardRadioButton}
                {selectField}
            </div>
        )

        const ExpandTypeOfAcident = (
            <Table
                multiSelectable={true} 
                allRowsSelected={true}
                onRowSelection={this._selectTypeRow}
            >
                <TableHeader enableSelectAll={true}>
                    <TableRow>
                        <TableHeaderColumn>Tick the type of incident to apply:</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody deselectOnClickaway={false}>
                    <TableRow>
                        <TableRowColumn>Abandonment/Defection</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>Arrest</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>Attack</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>Civilian Accident</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>Demonstration</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>IED</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>Kidanapping</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>Millitary/Non-Millitary Operations</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>Murder/Execution</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>Small Arms Fire (SAF)</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>UXO</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>Weapons</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>Others</TableRowColumn>
                    </TableRow>
                </TableBody>
            </Table>
        );

        const ExpandTargetOfAcident = (
            <Table
                multiSelectable={true}
                allRowsSelected={true}
            >
                <TableHeader enableSelectAll={true}>
                    <TableRow>
                        <TableHeaderColumn>Tick the target of incident to apply:</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableRowColumn>Armed Opposition Group</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>Civilians</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>Goverment</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>Humanitarian Community</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>Infrastructure</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>International Humanitarian Community</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>International Millitary</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>Police / Millitary Goverment</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>Unknown</TableRowColumn>
                    </TableRow>
                </TableBody>
            </Table>
        );

        const areaOfInterest = (
            <Card className={"expandCard"}>
                <CardHeader
                    title="Area Of Interests"
                    actAsExpander={true}
                    titleStyle={{ fontWeight: "bold", fontSize:"14px", color: "rgba(84, 84, 84, 0.87)"}}
                    showExpandableButton={true}
                />
                <CardText expandable={true} style={{padding: '0px'}}>
                    {ExpandAreaOfInterest}
                </CardText>
            </Card>
        )

        const typeOfAcident = (
            <Card className={"expandCard"}>
                <CardHeader
                    title="Type Of Incidents"
                    actAsExpander={true}
                    titleStyle={{ fontWeight: "bold", fontSize:"14px", color: "rgba(84, 84, 84, 0.87)"}}
                    showExpandableButton={true}
                />
                {/* <CardText expandable={true} style={{padding: "0px", borderTop: "solid 1px #ddd"}}> */}
                <CardText expandable={true}>
                    {ExpandTypeOfAcident}
                </CardText>
            </Card>
        )

        const targetOfIncident = (
            <Card>
                <CardHeader
                    title="Target Of Incidents"
                    actAsExpander={true}
                    titleStyle={{ fontWeight: "bold", fontSize:"14px", color: "rgba(84, 84, 84, 0.87)"}}
                    showExpandableButton={true}
                />
                <CardText expandable={true}>
                    {ExpandTargetOfAcident}
                </CardText>
            </Card>
        )

        return (
            <div>
                <div className={"appdrawer"}>
                    {cardHumanitarian}
                </div>
                <div className={"appdrawer"} style={{ paddingTop: '0px' }}>
                    {date}
                </div>
                <div className={"appdrawer"} style={{ paddingTop: '0px' }}>
                    {areaOfInterest}
                </div>
                <div className={"appdrawer"} style={{ paddingTop: '0px' }}>
                    {typeOfAcident}
                </div>
                <div className={"appdrawer"} style={{ paddingTop: '0px' }}>
                    {targetOfIncident}
                </div>
                <div className={"appdrawer"} style={{ paddingTop: '0px' }}>
                    {tabtabData}
                </div>

                <div className={"immapcopy"}>&copy; <a href="http://immap.org/">iMMAP</a> Panel</div>
            </div>
        )
    }
}
export default Humanitarian;