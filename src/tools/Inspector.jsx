import React from 'react'
import { ResponsivePie } from '@nivo/pie'
import GeneralInformation from './chart/GeneralInformation'
import {Tabs, Tab} from 'material-ui/Tabs'
import FontIcon from 'material-ui/FontIcon'

const styles = {
    finderColor: {
        backgroundColor: 'rgb(183, 29, 27)'
    },
    iconTabs:{
        fontSize: 14,
    }
};

let getLat, getLon;
class Inspector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerInspector: false
        }
        this._setlementsInpector = window.getFunction._setlementsInpector;
        window.inspectorFunction = this;
    }

    _activeInspector = (getInspector) => {
        this._setlementsInpector(getInspector);
        if(this.state.drawerInspector === true) {   
            if(this.props.getInspector === false){
                this.setState({ drawerInspector: false });
            }
        }
    }

    _handleInspector = (lon, lat) => {
        getLon = lon;
        getLat = lat;
        if(this.props.getInspector === true) {
            this.setState({ drawerInspector: true });
        } else {
            this.setState({ drawerInspector: false })
        }
    }

    render() {
        const { inspectorTabs } = this.state;
        const { getInspector } = this.props;
        this._activeInspector(getInspector);

        const TabGeneralInformation = (
            <div className={"boxrow"}>
                <div className={"box-6"}>
                    <div className={"scrollBox"}>
                        <ul>
                            <li>Settlement</li>
                            <li>Language</li>
                            <li>District</li>
                            <li>Province</li>
                            <li>Elevation</li>
                            <li>Area</li>
                            <li>Total Population</li>
                            <li>Average Household Size</li>
                            <li>Number of Building</li>
                            <li>Local Name</li>
                            <li>Local Name Confidence Level</li>
                            <li>Alternative English Name</li>
                        </ul>
                    </div>
                </div>
                <div className={"box-3"}>
                    <div className="boxchart">
                        <GeneralInformation />
                    </div>
                </div>
                <div className={"box-3"}>
                    <div className="boxchart">
                        <GeneralInformation />
                    </div>
                </div>
            </div>
        );

        const TabsInspector = (
            <Tabs
                tabItemContainerStyle={styles.finderColor}
                value={inspectorTabs}
                onChange={this.handleChangeData}
            >
                <Tab
                    icon={<FontIcon className="material-icons" style={styles.iconTabs}>info</FontIcon>}
                    // label="Settlements"
                    className={"filterTabs"}
                    value={0}
                >
                    <div>
                        <div className={"inspectorTitle"}>General Information</div>
                        {TabGeneralInformation}
                    </div>
                </Tab>
                <Tab
                    icon={<FontIcon className="material-icons" style={styles.iconTabs}>supervised_user_circle</FontIcon>}
                    // label="Health Facilities"
                    className={"filterTabs"}
                    value={1}
                >
                    <div className={"inspectorTitle"}>Demographics</div>
                </Tab>
                <Tab
                    icon={<FontIcon className="material-icons" style={styles.iconTabs}>accessibility_new</FontIcon>}
                    // label="Airpots"
                    className={"filterTabs"}
                    value={2}
                >
                    <div className={"inspectorTitle"}>Accessibility</div>
                </Tab>
                <Tab
                    icon={<FontIcon className="material-icons" style={styles.iconTabs}>waves</FontIcon>}
                    // label="Settlements Oasis"
                    className={"filterTabs"}
                    value={3}
                >
                    <div className={"inspectorTitle"}>Flooding</div>
                </Tab>

                <Tab
                    icon={<FontIcon className="material-icons" style={styles.iconTabs}>domain</FontIcon>}
                    // label="Settlements"
                    className={"filterTabs"}
                    value={4}
                >
                    <div className={"inspectorTitle"}>Earthquake</div>
                </Tab>
                <Tab
                    icon={<FontIcon className="material-icons" style={styles.iconTabs}>landscape</FontIcon>}
                    // label="Health Facilities"
                    className={"filterTabs"}
                    value={5}
                >
                    <div className={"inspectorTitle"}>Landslide</div>
                </Tab>
                <Tab
                    icon={<FontIcon className="material-icons" style={styles.iconTabs}>wb_cloudy</FontIcon>}
                    // label="Airpots"
                    className={"filterTabs"}
                    value={6}
                >
                    <div className={"inspectorTitle"}>Weather</div>
                </Tab>
                <Tab
                    icon={<FontIcon className="material-icons" style={styles.iconTabs}>filter_drama</FontIcon>}
                    // label="Settlements Oasis"
                    className={"filterTabs"}
                    value={7}
                >
                    <div className={"inspectorTitle"}>Climate</div>
                </Tab>
                <Tab
                    icon={<FontIcon className="material-icons" style={styles.iconTabs}>ac_unit</FontIcon>}
                    // label="Airpots"
                    className={"filterTabs"}
                    value={8}
                >
                    <div className={"inspectorTitle"}>Snow Cover</div>
                </Tab>
            </Tabs>
        ); 

        return (
            <div>
                <div className={"boxInspector"} style={{ 'display': this.state.drawerInspector === true ? 'block' : 'none' }}>
                    {TabsInspector}
                    {/* <b>Longitude : </b> {getLon}<br /><b>Latitude :</b> {getLat} */}
                    
                </div>
            </div>
        );
    }
}

export default Inspector;