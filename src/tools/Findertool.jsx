import React from 'react'

// material ui components
import {Card} from 'material-ui/Card'
import {Tabs, Tab} from 'material-ui/Tabs'
// import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Checkbox from 'material-ui/Checkbox'

import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

// icon-material ui
import FontIcon from 'material-ui/FontIcon'
import '../../css/panel.css'

const styles = {
    iconBg: {
        backgroundColor: 'rgb(183, 29, 27)',
        padding: 4,
        fontSize: 20,
        borderRadius: '50%',
        color: '#fff'
    },
    marginCard:{
        marginTop: 8
    },
    iconLoc: {
        backgroundColor: 'rgb(183, 29, 27)',
        padding: 4,
        fontSize: 16,
        color: '#fff',
        borderRadius: '50%'
    },
    iconProj: {
        backgroundColor: 'rgb(183, 29, 27)',
        padding: 4,
        fontSize: 20,
        color: '#fff',
        borderRadius: '50%'
    },
    iconTabs:{
        fontSize: 14,
    },
    tabsColor: {
        backgroundColor: 'rgb(183, 29, 27)'
    },
    finderColor: {
        backgroundColor: 'rgb(138, 0, 0)'
    }
};

const items = [
    <MenuItem value={null} primaryText="Select a settlement" />,
  ];

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

const projectionlist = [
    <MenuItem key={11} value={1} primaryText="Decimal Degree (WGS84)" />,
    <MenuItem key={12} value={2} primaryText="Degree Minutes Seconds (WGS84)" />,
    <MenuItem key={13} value={3} primaryText="UTM 41 North" />,
    <MenuItem key={14} value={4} primaryText="UTM 42 North" />,
    <MenuItem key={15} value={5} primaryText="MGRS" />,
];

class Findertool extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0,
            findTab: 1,
            checked: true,
            valueprov: null,
            valuedist: null,
            valuesett: null,
            valueprojection: 1,
            pickFromMap: true,
            buttonPickFromMap: false,
            buttonLabelPick : 'Pick from Map',
            prov: [],
            dist: [],
        };
        this._pickFromMap = window.getFunction._pickFromMap;
        this._clearCoordinat = window.getFunction._clearCoordinat;
        this._plotToMap = window.getFunction._plotToMap;
        this._selectProv = window.getFunction._selectedProv;
        this._baseUrl = window.BASE_URL;
        this._serverUrl = window.SERVER_URL;
    }

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
        this.setState({valueprov});
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
            .then(data => this._selectProv(data.features))
            // .then(data => this.setState({ dist: data.features }, ()=> console.log('dist', this.state.dist)))
            .catch(error => console.log(error));
    }


    handleDist = (event, index, valuedist) => this.setState({valuedist});

    handleSett = (event, index, valuesett) => this.setState({valuesett});

    handleProj = (event, index, valueprojection) => this.setState({valueprojection});

    handleCheck = () => { this.setState({checked: !this.state.checked})};

    handleChangeTab = (value) => {
        this.setState({tabIndex: value});
    };

    handleChangeFindTab = (value) => {
        this.setState({findTab: value});
    }

    handlePickFromMap = () => {
        this.setState({ pickFromMap: !this.state.pickFromMap });
        this.setState({buttonPickFromMap: !this.state.buttonPickFromMap});
        if( this.state.buttonPickFromMap === false){
            this.setState({ buttonLabelPick: 'Stop Picking'});
        } else {
            this.setState({ buttonLabelPick: 'Pick from Map'});
        }
        this._pickFromMap(this.state.pickFromMap);
    }

    handleClearCoordinat = () => {
        this.setState({ buttonLabelPick: 'Pick from Map'});
        this.setState({ buttonPickFromMap: false });
        this.setState({ pickFromMap: !this.state.pickFromMap });
        this._pickFromMap(this.state.pickFromMap);
        this._clearCoordinat();
    }

    handlePLotToMap = () => {
        this._plotToMap(this.state.valueprojection);
    }

    _searchFuzzy = (findTab, event, newValue) => {
        let tabType;
        if(findTab === 0){
            tabType = 'settlements'
        } else if (findTab === 1){
            tabType = 'healthfacility'
        } else if (findTab === 2){
            tabType = 'airport'
        } else if (findTab === 3){
            tabType = 's_oasis'
        }
        const provUrl = this._baseUrl + '/geoapi/get_villages';
        const params = {
            start: '0',
            propertyName: '',
            type: tabType,
            dist_code: '',
            prov_code: '',
            search: newValue,
            CQL_FILTER: "strToLowerCase(namelong) like '%"+newValue+"%'",
            typeName: 'geonode:afg_airdrmp',
            fuzzy: true,
            distname: '',
            provname: '',
            service: 'WFS',
            version: '1.1.0',
            request: 'GetFeature',
            srsName: 'EPSG:900913',
            outputFormat: 'json',
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
            .then(data => console.log(data))
            // .then(data => this.setState({ dist: data.features }, ()=> console.log('dist', this.state.dist)))
            .catch(error => console.log(error));
    }

    render() {
        const { handleClose } = this.props;
        const { valueprojection, tabIndex, checked, findTab, buttonPickFromMap, buttonLabelPick, prov, dist } = this.state;

        const cardFinder = (
            <Card>
                <div className={"boxTitle"}>
                    <div className={"geoleft"}>
                        <FontIcon className="material-icons" style={styles.iconBg}>find_in_page</FontIcon>
                    </div>
                    <div className={"georight"}>
                        <div className={"drawerName"}>Finder Tool</div>
                        <FontIcon onClick={handleClose} className={["material-icons","closeDrawer"].join(" ")}>arrow_left</FontIcon>
                    </div>
                </div>
            </Card>
        )

        let dataProv = prov.length > 0 ? this._jsonProv(prov):this._thisProv();
        // let dataDist = dist.length > 0 ? this._jsonDist(dist) : '';

        const selectField = (
            <Card>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
                                >
                                    {this._jsonDist(dist)}
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
                                    hintText="Select a settlement"
                                    hintStyle={{ fontSize: '13px', fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.87)' }}
                                    labelStyle={{ fontSize: '13px', fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.87)' }}
                                    underlineStyle={{ 'border': 'none' }}
                                    underlineDisabledStyle={{ 'border-color': 'transparent' }}
                                    value={this.state.valuesett}
                                    onChange={this.handleSett}
                                    maxHeight={300}
                                    fullWidth={true}
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

        const decimalDegree = (
            <div className={"boxList"}>
                <div className={"optLeft"} style={{ marginTop: '5px' }}>
                    <FontIcon className="material-icons" style={styles.iconProj}>location_on</FontIcon>
                </div>
                <div className={"optRightFinder optRight"}>
                    <TextField
                        className={"inputText"}
                        name="ddlat"
                        hintText="Latitude"
                        underlineFocusStyle={{ borderBottom: '2px solid rgb(183, 29, 27)' }}
                    />
                    <TextField
                        className={"inputText"}
                        name="ddlon"
                        hintText="Longitude"
                        underlineFocusStyle={{ borderBottom: '2px solid rgb(183, 29, 27)' }}
                    />
                </div>
                <div className={"clearfix"}></div>
            </div>
        )

        const degreeMinuteSeconds = (
            <div className={"boxList"}>
                <div className={"optLeft"} style={{ marginTop: '5px' }}>
                    <FontIcon className="material-icons" style={styles.iconProj}>location_on</FontIcon>
                </div>
                <div className={"optRightFinder optRight"}>
                    <div className={"labelCoordinat"}>
                        <label>Latitude</label>
                        <TextField
                            className={"inputTextDMS"}
                            name="latD"
                            underlineFocusStyle={{ borderBottom: '2px solid rgb(183, 29, 27)' }}
                        />°&nbsp;
                        <TextField
                            className={"inputTextDMS"}
                            name="latM"
                            underlineFocusStyle={{ borderBottom: '2px solid rgb(183, 29, 27)' }}
                        />'&nbsp;
                        <TextField
                            className={"inputTextDMS"}
                            name="latS"
                            underlineFocusStyle={{ borderBottom: '2px solid rgb(183, 29, 27)' }}
                        />"
                    </div>

                    <div className={"labelCoordinat"}>
                        <label>Longitude</label>
                        <TextField
                            className={"inputTextDMS"}
                            name="lonD"
                            underlineFocusStyle={{ borderBottom: '2px solid rgb(183, 29, 27)' }}
                        />°&nbsp;
                        <TextField
                            className={"inputTextDMS"}
                            name="lonM"
                            underlineFocusStyle={{ borderBottom: '2px solid rgb(183, 29, 27)' }}
                        />'&nbsp;
                        <TextField
                            className={"inputTextDMS"}
                            name="lonS"
                            underlineFocusStyle={{ borderBottom: '2px solid rgb(183, 29, 27)' }}
                        />"
                    </div>

                </div>
                <div className={"clearfix"}></div>
            </div>
        )

        const utm41 = (
            <div className={"boxList"}>
                <div className={"optLeft"} style={{ marginTop: '5px' }}>
                    <FontIcon className="material-icons" style={styles.iconProj}>location_on</FontIcon>
                </div>
                <div className={"optRightFinder optRight"}>
                    <TextField
                        className={"inputText"}
                        name="north41"
                        hintText="Northing"
                        underlineFocusStyle={{ borderBottom: '2px solid rgb(183, 29, 27)' }}
                    />
                    <TextField
                        className={"inputText"}
                        name="east41"
                        hintText="Easting"
                        underlineFocusStyle={{ borderBottom: '2px solid rgb(183, 29, 27)' }}
                    />
                </div>
                <div className={"clearfix"}></div>
            </div>
        )

        const utm42 = (
            <div className={"boxList"}>
                <div className={"optLeft"} style={{ marginTop: '5px' }}>
                    <FontIcon className="material-icons" style={styles.iconProj}>location_on</FontIcon>
                </div>
                <div className={"optRightFinder optRight"}>
                    <TextField
                        className={"inputText"}
                        name="north42"
                        hintText="Northing"
                        underlineFocusStyle={{ borderBottom: '2px solid rgb(183, 29, 27)' }}
                    />
                    <TextField
                        className={"inputText"}
                        name="east42"
                        hintText="Easting"
                        underlineFocusStyle={{ borderBottom: '2px solid rgb(183, 29, 27)' }}
                    />
                </div>
                <div className={"clearfix"}></div>
            </div>
        )

        const mgrs = (
            <div className={"boxList"}>
                <div className={"optLeft"} style={{ marginTop: '5px' }}>
                    <FontIcon className="material-icons" style={styles.iconProj}>location_on</FontIcon>
                </div>
                <div className={"optRightFinder optRight"}>
                    <TextField
                        className={"inputText100"}
                        hintText="MGRS"
                        name="mgrs"
                        underlineFocusStyle={{ borderBottom: '2px solid rgb(183, 29, 27)' }}
                    />
                </div>
                <div className={"clearfix"}></div>
            </div>
        )

        let _inputCoordinat;
        if (valueprojection === 5) {
            _inputCoordinat = mgrs;
        } else if (valueprojection === 4) {
            _inputCoordinat = utm42;
        } else if (valueprojection === 3) {
            _inputCoordinat = utm41;
        } else if (valueprojection === 2) {
            _inputCoordinat = degreeMinuteSeconds;
        } else {
            _inputCoordinat = decimalDegree;
        }

        const coordinate = (
            <div>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <div className={"boxCoordinat"}>
                        <div className={"boxList"}>
                            <div className={"optLeftFinder optLeft"}>
                                <FontIcon className="material-icons" style={styles.iconProj}>satellite</FontIcon>
                            </div>
                            <div className={"optRightFinder optRight finderSelect"}>
                                <SelectField
                                    floatingLabelText="Projection"
                                    hintStyle={{ fontSize: '13px', fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.87)', height: 35, lineHeight: '45px' }}
                                    labelStyle={{ fontSize: '13px', fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.87)', height: 35, lineHeight: '45px' }}
                                    underlineStyle={{ 'border': 'none' }}
                                    underlineDisabledStyle={{ 'border-color': 'transparent' }}
                                    value={this.state.valueprojection}
                                    onChange={this.handleProj}
                                    maxHeight={300}
                                    fullWidth={true}
                                    menuItemStyle={{ fontSize: '13px'}}
                                >
                                    {projectionlist}
                                </SelectField>
                            </div>
                            <div className={"clearfix"}></div>
                        </div>
                    </div>

                    <div className={"boxCoordinat"}>
                        {_inputCoordinat}
                    </div>
                </div>
            </div>
        )

        const findLocation = (
            <Tabs
                tabItemContainerStyle={styles.tabsColor}
                className={"boxFilter"}
                value={findTab}
                onChange={this.handleChangeFindTab}
            >
                <Tab
                    icon={<FontIcon className="material-icons" style={styles.iconTabs}>domain</FontIcon>}
                    label="Settlements"
                    className={"filterTabs"}
                    value={0}
                />
                <Tab
                    icon={<FontIcon className="material-icons" style={styles.iconTabs}>local_hospital</FontIcon>}
                    label="Health Facilities"
                    className={"filterTabs"}
                    value={1}
                />
                <Tab
                    icon={<FontIcon className="material-icons" style={styles.iconTabs}>airplanemode_active</FontIcon>}
                    label="Airpots"
                    className={"filterTabs"}
                    value={2}
                />
                <Tab
                    icon={<FontIcon className="material-icons" style={styles.iconTabs}>opacity</FontIcon>}
                    label="Settlements Oasis"
                    className={"filterTabs"}
                    value={3}
                />
            </Tabs>
        )

        const getCoordinate = (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <div className={"boxCoordinat"}>
                    <div className={"boxList"}>
                        <table className={"tblInfoCoordinat"}>
                            <tr>
                                <td style={{ verticalAlign: "baseline"}}>DMS (WGS84)</td><td style={{ verticalAlign: "baseline", width: "5%"}}>:</td><td id="wgs84"></td>
                            </tr>
                            <tr>
                                <td style={{ verticalAlign: "baseline"}}>Decimals (WGS84)</td><td style={{ verticalAlign: "baseline", width: "5%"}}>:</td><td id="wgs84dms"></td>
                            </tr>
                            <tr>
                                <td style={{ verticalAlign: "baseline"}}>UTM</td><td style={{ verticalAlign: "baseline", width: "5%"}}>:</td><td id="utm"></td>
                            </tr>
                            <tr>
                                <td style={{ verticalAlign: "baseline"}}>MGRS</td><td style={{ verticalAlign: "baseline", width: "5%"}}>:</td><td id="mgrs"></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        )

        const searchVillageId = (
            <div className={"boxNoHover"}>
                <div className={"boxList"}>
                    <div className={"optLeft searchLeft"} style={{ paddingLeft: '20px' }}>
                        <FontIcon className="material-icons" style={{ fontSize: 24, color: 'rgba(0, 0, 0, 0.3)' }}>location_searching</FontIcon>
                    </div>
                    <div className={"optRight searchRight"}>
                        <TextField
                            style={{ height: '25px', width: '95%' }}
                            hintText="Search by Village ID"
                            inputStyle={{ fontSize: '13px' }}
                            hintStyle={{ fontSize: '14px', fontWeight: 'bold', bottom: '0px' }}
                            underlineStyle={{ borderBottom: '1px solid transparent' }}
                        />
                    </div>
                    <div className={"optRight searchIconRight"}>
                        <FontIcon className="material-icons" style={{ fontSize: 24, color: 'rgba(0, 0, 0, 0.3)' }}>search</FontIcon>
                    </div>
                    <div className={"clearfix"}></div>
                </div>
            </div>
        )

        let _inputSearchID;
        if( findTab === 0 || findTab === 3) {
            _inputSearchID = searchVillageId;
        }

        const searchName = (
            <Card>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <div className={"boxNoHover"}>
                        <div className={"boxList"}>
                            <div className={"optLeft searchLeft"}>
                                <Checkbox
                                    style= {{ marginTop: '2px'}}
                                    labelStyle={{ fontSize: '13px', lineHeight: '20px' }}
                                    label="Fuzzy"
                                    checkedIcon={<FontIcon className="material-icons" style={{ fontSize: 18, marginRight: '0px', fill: "rgb(183, 29, 27)", color: "rgb(183, 29, 27)" }}>check_box</FontIcon>}
                                    uncheckedIcon={<FontIcon className="material-icons" style={{ fontSize: 18, marginRight: '0px', fill: "rgb(183, 29, 27)", color: "rgb(183, 29, 27)" }}>check_box_outline_blank</FontIcon>}
                                    iconStyle={{ marginRight: '0px'}}
                                    onClick={this.handleCheck}
                                    checked={checked}
                                />
                            </div>
                            <div className={"optRight searchRight"}>
                                <TextField
                                    style={{ height: '25px', width: '95%' }}
                                    hintText="Search by Name"
                                    inputStyle={{ fontSize: '13px' }}
                                    hintStyle={{ fontSize: '14px', fontWeight: 'bold', bottom: '0px' }}
                                    underlineStyle={{ borderBottom: '1px solid transparent'}}
                                    // onChange={this._searchFuzzy(findTab)}
                                />
                            </div>
                            <div className={"optRight searchIconRight"}>
                                <FontIcon className="material-icons" style={{ fontSize: 24, color: 'rgba(0, 0, 0, 0.3)' }}>search</FontIcon>
                            </div>
                            <div className={"clearfix"}></div>
                        </div>
                    </div>
                    {_inputSearchID}
                </div>
            </Card>
        )

        let tabBoxOutsideRed;
        if (tabIndex === 0){
            tabBoxOutsideRed = searchName;
        }

        const tabFinder = (
            <Card>
                <Tabs
                    tabItemContainerStyle={styles.finderColor}
                    value={tabIndex}
                    onChange={this.handleChangeTab}
                >
                    <Tab label="Find Location" value={0} className={"titleTabs"}>
                        <div>
                            {findLocation}
                            {selectField}
                        </div>
                    </Tab>
                    <Tab label="Coordinate" value={1} className={"titleTabs"}>
                        <div>
                            {coordinate}
                            <div className={"appdrawer"}>
                                {getCoordinate}
                            </div>

                            <RaisedButton
                                label="Plot to Map"
                                className={"butCoordinat"}
                                labelStyle={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize', paddingRight: '8px'}}
                                icon={<FontIcon className="material-icons" style={{ marginLeft: '5px' }}>map</FontIcon>}
                                onClick={this.handlePLotToMap}
                            />
                            <RaisedButton
                                label={buttonLabelPick}
                                secondary={buttonPickFromMap}
                                className={"butCoordinat"}
                                labelStyle={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize', paddingRight: '8px'}}
                                icon={<FontIcon className="material-icons" style={{ marginLeft: '4px' }}>pin_drop</FontIcon>}
                                onClick={this.handlePickFromMap}
                            />
                            <RaisedButton
                                label="Clear"
                                className={"butCoordinat"}
                                labelStyle={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize', paddingRight: '8px'}}
                                icon={<FontIcon className="material-icons" style={{ marginLeft: '4px' }}>clear_all</FontIcon>}
                                onClick={this.handleClearCoordinat}
                            />
                        </div>
                    </Tab>
                </Tabs>
            </Card>
        )

        return (
            <div>
                <div className={"drawerBar"}>
                    {cardFinder}
                    <div style={styles.marginCard}></div>
                    {tabFinder}
                    <div style={styles.marginCard}></div>
                </div>
                <div className={"appdrawer"}>
                    {tabBoxOutsideRed}
                </div>
                <div id="findertool"></div>
                {/* <div className={"immapcopy"}>&copy; <a href="http://immap.org/">iMMAP</a> Panel</div> */}
            </div>
        );
    }
}

export default Findertool;