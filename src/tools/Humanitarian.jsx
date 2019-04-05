import React from 'react'

import {Card, CardHeader, CardText} from 'material-ui/Card'

import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import FlatButton from 'material-ui/FlatButton'
import DatePicker from 'material-ui/DatePicker'

import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import { Table,TableBody,TableHeader,TableHeaderColumn,TableRow,TableRowColumn, } from 'material-ui/Table';
import TabHumanitarian from './tabHumanitarian'
//tooltip
import 'react-tippy/dist/tippy.css'
import { Tooltip, } from 'react-tippy'

// icon-material ui
import FontIcon from 'material-ui/FontIcon'
import '../../css/panel.css'

function buildUrl(url, parameters) {
    var qs = "";
    for (var key in parameters) {
        var value = parameters[key];
        qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
    }
    if (qs.length > 0) {
        qs = qs.substring(0, qs.length - 1); //chop off last "&"
        url = url + "?" + qs;
    }
    return url;
  }

const styles = {
    marginCard: {
        marginTop: 8
    },
    iconBg: {
        backgroundColor: 'rgb(183, 29, 27)',
        padding: 4,
        fontSize: 20,
        borderRadius: '50%',
        color: '#fff'
    },
};

const items = [
    <MenuItem key={1} value={1} primaryText="Never" />,
    <MenuItem key={2} value={2} primaryText="Every Night" />,
    <MenuItem key={3} value={3} primaryText="Weeknights" />,
    <MenuItem key={4} value={4} primaryText="Weekends" />,
    <MenuItem key={5} value={5} primaryText="Weekly" />,
];

const _valueTypeOfAcident = [
    {data:'Abandonment/Defection'},
    {data:'Arrest'},
    {data:'Attack'},
    {data:'Civilian accident'},
    {data:'Demonstration'},
    {data:'IED'},
    {data:'Kidnapping'},
    {data:'Military / Non-Military Operations'},
    {data:'Murder/Execution'},
    {data:'Others'},
    {data:'Small Arms Fire (SAF)'},
    {data:'UXO'},
    {data:'Weapons'}
]

const _valueTargetOfAcident = [
    {data:'Armed Opposition Group'},
    {data:'Civilians'},
    {data:'Goverment'},
    {data:'Humanitarian Community'},
    {data:'Infrastructure'},
    {data:'International Humanitarian Community'},
    {data:'International Millitary'},
    {data:'Police / Millitary Goverment'},
    {data:'Unknown'},
]

let datalist, minDate, maxDate;
let TypeSelected;

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
            dist_prov: true,
            valueprov: null,
            valuedist: null,
            provID: null,
            prov: [],
            dist: [],
            error: null,
            _typeData: 'all',
            _targetData: 'all',

            allrow: true,
            selectable: true,
            multiSelectable: true,
            deselectOnClickaway: false
        }

        this._drawArea = window.getFunction._drawArea;
        this._selectProv = window.getFunction._selectedProv;
        this._serverUrl = window.SERVER_URL;
        this._targetData = '';
    }

    // handleProv = (event, index, valueprov) => this.setState({valueprov});
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
            this.setState({ prov_dist: false });
            this._thisProv();
        } else {
            this.setState({ prov_dist: true });
            this.setState({ dist_prov: true });
            this.setState({ valuedist: null });
            this.setState({ valueprov: null });
            this.setState({ prov: [] });
            this.setState({ dist: [] });
        }
        this.setState({ filter: filter });
    }

    _changeMinDate = (event, date) => {
        this.setState({minDate: date})
    }

    _changeMaxDate = (event, date) => {
        this.setState({maxDate: date})
    }

    _selectTypeRow = (rows) => {
        var result = rows.slice(0);
        if (result == 'none') {
            result = [];
        }
        this.setState({ _typeData: result })
    }

    _selectTargetRow = (rows) => {
        var result = rows.slice(0);
        if (result == 'none') {
            result = [];
        }
        this.setState({ _targetData: result })
    }

    // areaofinterest
    _thisProv = () => {
        const provUrl = this._serverUrl + 'geonode/wfs';
        const params = {
            service: 'WFS',
            version: '1.1.0',
            request: 'GetFeature',
            typeName: 'geonode:afg_admbnda_adm1',
            srsName: 'EPSG:900913',
            outputFormat: 'json',
            propertyName: 'prov_code,prov_na_en'
        }
        fetch(buildUrl(provUrl, params), {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Accept': '*/*',
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Something wrong...");
                }
            })
            .then(data => this.setState({ prov: data.features }))
            .catch(error => console.log(error));
    }

    _jsonProv = (prov) => {
        let provdata = [];
        for (var i = 0; i < prov.length; i++) {
            provdata[i] = {
                'key': [i],
                'value': prov[i].properties.prov_code,
                'primaryText': prov[i].properties.prov_na_en
            }
        }
        const itemsprov = [];
        for(var j = 0; j < provdata.length; j++){
            itemsprov.push(<MenuItem value={provdata[j].value} key={provdata[j].key} primaryText={provdata[j].primaryText} />);
        }
        return itemsprov
    }

    _District = (prov_id) => {
        const provUrl = this._serverUrl + 'geonode/wfs';
        const params = {
            service: 'WFS',
            version: '1.1.0',
            request: 'GetFeature',
            typeName: 'geonode:afg_admbnda_adm2',
            srsName: 'EPSG:900913',
            outputFormat: 'json',
            CQL_FILTER: 'prov_code = '+prov_id
        }
        fetch(buildUrl(provUrl, params), {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Accept': '*/*',
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Something wrong...");
                }
            })
            .then(data => this.setState({ dist: data.features }))
            .catch(error => console.log(error));
    }

    _jsonDist = (dist) => {
        let distdata = [];
        for (var i = 0; i < dist.length; i++) {
            distdata[i] = {
                'key': [i],
                'value': dist[i].properties.dist_code,
                'primaryText': dist[i].properties.dist_na_en
            }
        }
        const itemsdist = [];
        for(var j = 0; j < distdata.length; j++){
            itemsdist.push(<MenuItem value={distdata[j].value} key={distdata[j].key} primaryText={distdata[j].primaryText} />);
        }
        return itemsdist
    }

    handleProv = (event, index, valueprov) => {
        this.setState({dist_prov: false});
        this.setState({valueprov});
        this._District(valueprov);
        const provUrl = this._serverUrl + 'geonode/wfs';
        const params = {
            service: 'WFS',
            version: '1.1.0',
            request: 'GetFeature',
            typeName: 'geonode:afg_admbnda_adm1',
            srsName: 'EPSG:900913',
            outputFormat: 'json',
            CQL_FILTER: 'prov_code = '+valueprov
        }
        fetch(buildUrl(provUrl, params), {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Accept': '*/*',
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Something wrong...");
                }
            })
            // .then(data => this._selectProv(data.features))
            .then(data => this.setState({provID: data.features}))
            // .then(data => this.setState({ dist: data.features }, ()=> console.log('dist', this.state.dist)))
            .catch(error => console.log(error));

        // this._selectProv(this.state.provID);
    }
    // end of areaofinterest

    render() {
        const { handleClose } = this.props;
        const { prov_dist, dist_prov, prov, dist, allrow, selectable, multiSelectable, deselectOnClickaway, _typeData, _targetData } = this.state;

        const cardHumanitarian = (
            <Card>
                <div className={"boxTitle"}>
                    <div className={"geoleft"}>
                        <FontIcon className="material-icons" style={styles.iconBg}>supervisor_account</FontIcon>
                    </div>
                    <div className={"georight"}>
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
            <div>
                <TabHumanitarian getMinDate={minDate} getMaxDate={maxDate} typeIncident={_typeData} targetIncident={_targetData}/>
            </div>
        )

        const cardRadioButton = (
            <div className={"boxOption boxOptionExpand"}>
                    <RadioButtonGroup name="filter" onChange={this.handleChange} valueSelected={this.state.filter}>
                        <RadioButton
                            value="currentExtent"
                            label="Current Extent"
                            className={"drawerRadio"}
                            iconStyle={{ fill: '#b71d1b' }}
                        />
                        <RadioButton
                            value="entireAfg"
                            label="Entire Afghanistan"
                            className={"drawerRadio"}
                            iconStyle={{ fill: '#b71d1b' }}
                        />
                        <RadioButton
                            value="drawArea"
                            label="Draw Area"
                            className={"drawerRadio"}
                            iconStyle={{ fill: '#b71d1b' }}
                        />
                        <RadioButton
                            value="ProvDist"
                            label="Provinces and Districts"
                            className={"drawerRadio"}
                            iconStyle={{ fill: '#b71d1b' }}
                        />
                    </RadioButtonGroup>
            </div>
        )

        let overlay = prov_dist ? "boxOverlay" : "removeOverlay";
        let dataProv = prov_dist === false && prov.length > 0 ? this._jsonProv(prov) : '';
        let dataDist = dist_prov === false && dist.length > 0 ? this._jsonDist(dist) : '';

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
                                    {dataProv}
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
                                    {dataDist}
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
            <div style={{"max-height":"200px","overflow":"auto"}}>
                <Table
                    selectable={selectable}
                    multiSelectable={multiSelectable}
                    allRowsSelected={allrow}
                    onRowSelection={this._selectTypeRow}
                >
                    <TableHeader
                        displaySelectAll={true}
                        adjustForCheckbox={true}
                        enableSelectAll={true}
                    >
                        <TableRow>
                            <TableHeaderColumn>Tick the type of incident to apply</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={true}
                        deselectOnClickaway={deselectOnClickaway}
                    >
                        {_valueTypeOfAcident.map((row, index) =>
                            <TableRow key={index} selected={_typeData.indexOf(index) !== -1}>
                                <TableRowColumn>{row.data}</TableRowColumn>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>


            </div>
        );

        const ExpandTargetOfAcident = (
            <div style={{"max-height":"200px","overflow":"auto"}}>
                <Table
                    selectable={selectable}
                    multiSelectable={multiSelectable}
                    allRowsSelected={allrow}
                    onRowSelection={this._selectTargetRow}
                >
                    <TableHeader
                        displaySelectAll={true}
                        adjustForCheckbox={true}
                        enableSelectAll={true}
                    >
                        <TableRow>
                            <TableHeaderColumn>Tick the type of incident to apply</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={true}
                        deselectOnClickaway={deselectOnClickaway}
                    >
                        {_valueTargetOfAcident.map((row, index) =>
                            <TableRow key={index} selected={_targetData.indexOf(index) !== -1}>
                                <TableRowColumn>{row.data}</TableRowColumn>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
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

                {/* <div className={"immapcopy"}>&copy; <a href="http://immap.org/">iMMAP</a> Panel</div> */}
            </div>
        )
    }
}
export default Humanitarian;