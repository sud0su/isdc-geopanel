import React from 'react'

// material ui components
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import {Card, CardHeader} from 'material-ui/Card'

import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

// icon-material ui
import FontIcon from 'material-ui/FontIcon'
import '../../css/panel.css'
import { join } from 'path';

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
    iconLoc: {
        backgroundColor: 'rgb(183, 29, 27)',
        padding: 4,
        fontSize: 16,
        color: '#fff',
        borderRadius: '50%'
    },
    titleHeader:{
        paddingRight: 0
    }
};

class Statisctic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prov_dist: true,
            dist_prov: true,
            valueprov: null,
            valuedist: null,
            provID: null,
            filter: 'entireAfg',
            prov: [],
            dist: []
        }

        this._drawArea = window.getFunction._drawArea;
        this._selectProv = window.getFunction._selectedProv;
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
        
        this._selectProv(this.state.provID);
    }
    
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

    render() {
        const { handleClose } = this.props;
        const { prov_dist, dist_prov, prov, dist } = this.state;
        
        const cardRadioButton = (
            <div className={"boxOption"}>
                    <RadioButtonGroup name="filter" onChange={this.handleChange} valueSelected={this.state.filter}>
                        <RadioButton
                            value="currentExtent"
                            label="Current Extent"
                            className={"drawerRadio"}
                            iconStyle={{ fill: 'rgba(255,255,255,0.87)' }}
                            labelStyle={{color: 'rgba(255,255,255,0.87)' }}
                        />
                        <RadioButton
                            value="entireAfg"
                            label="Entire Afghanistan"
                            className={"drawerRadio"}
                            iconStyle={{ fill: 'rgba(255,255,255,0.87)' }}
                            labelStyle={{color: 'rgba(255,255,255,0.87)' }}
                        />
                        <RadioButton
                            value="drawArea"
                            label="Draw Area"
                            className={"drawerRadio"}
                            iconStyle={{ fill: 'rgba(255,255,255,0.87)' }}
                            labelStyle={{color: 'rgba(255,255,255,0.87)' }}
                        />
                        <RadioButton
                            value="ProvDist"
                            label="Provinces and Districts"
                            className={"drawerRadio"}
                            iconStyle={{ fill: 'rgba(255,255,255,0.87)' }}
                            labelStyle={{color: 'rgba(255,255,255,0.87)' }}
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
                                    disabled={dist_prov}
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

        const cardStatistic = (
            <Card>
                <div className={"boxTitle"}>
                    <div className={"geoleft"}>
                        <FontIcon className="material-icons" style={styles.iconBg}>assignment</FontIcon>
                    </div>
                    <div className={"georight"}>
                        <div className={"drawerName"}>Statistics</div>
                        <FontIcon onClick={handleClose} className={["material-icons","closeDrawer"].join(" ")}>arrow_left</FontIcon>
                    </div>
                </div>
            </Card>
        )

        return (
            <div>
                <div className={"drawerBar"}>
                    {cardStatistic}
                    <div style={styles.marginCard}></div>
                    {cardRadioButton}
                </div>
                <div className={"appdrawer"}>
                    {selectField}
                    <div style={styles.marginCard}></div>
                    <Card>
                        <CardHeader
                        title="Select a category to generate the statistics"
                        textStyle={styles.titleHeader}
                        titleStyle={{'font-size':13, 'color': 'rgba(47, 47, 47, 0.87)', 'font-weight': 'bold'}}
                        className={"cardTitle"}
                        />
                        <div className={"boxContent"}>
                            <div id="immap-package" className={"immap-package"}></div>
                        </div>
                    </Card>
                </div>
                <div className={"immapcopy"}>&copy; <a href="http://immap.org/">iMMAP</a> Panel</div>
            </div>
        );
    }
}

export default Statisctic;