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

const items = [
    <MenuItem key={1} value={1} primaryText="Never" />,
    <MenuItem key={2} value={2} primaryText="Every Night" />,
    <MenuItem key={3} value={3} primaryText="Weeknights" />,
    <MenuItem key={4} value={4} primaryText="Weekends" />,
    <MenuItem key={5} value={5} primaryText="Weekly" />,
  ];

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
            valueprov: null,
            valuedist: null,
            filter: 'entireAfg'
        }

        this._drawArea = window.getFunction._drawArea;
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

    render() {
        const { handleClose } = this.props;
        const { prov_dist } = this.state;

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

        const cardStatistic = (
            <Card>
                <div className={"boxTitle"}>
                    <div className={"left"}>
                        <FontIcon className="material-icons" style={styles.iconBg}>assignment</FontIcon>
                    </div>
                    <div className={"right"}>
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