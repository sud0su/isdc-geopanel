import React from 'react'

//material ui component 
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Drawer from 'material-ui/Drawer'

//tooltip
import 'react-tippy/dist/tippy.css'
import { Tooltip, } from 'react-tippy'

//panel components
import Components from './Import'
import Inspector from './tools/Inspector'
import FontIcon from 'material-ui/FontIcon'

const drawerWidth = 350;

const panel = {
    drawerstyle: {
        height: 'calc(100% - 72px)',
        top: 72,
        backgroundColor: 'rgb(245, 245, 245)'
    },
    rightbox :{
        boxShadow: 'none',
        borderRadius: '0',
        backgroundColor: '#b71c1c',
        padding: '1px'
    }
}


class IsdcPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            settingPanels: [],
            getPackages: [],
            move: 0,
            sInspector: false
        }
    }

    componentWillMount() {
        this.setState({ settingPanels: this.props.panelConfig })
        this.setState({ getPackages: this.props.addPackage })
    }

    handleOpen(e, name) {
        if (this.state.drawer === name) {
            this.setState({ sInspector: false });
            this.setState({ drawer: false });
            this.setState({ activebutton: this.state.activebutton === name ? true : name });
            this.setState({ move: 0 });
        } else {
            this.setState({ sInspector: false });
            this.setState({ drawer: name });
            this.setState({ activebutton: name });
            this.setState({ move: drawerWidth });
            if (name === 'Statistic') {
                this.state.getPackages.map((pckg) => {
                    var JSPATH = STATIC_URL + pckg.package + "/js/" + pckg.js;
                    var JSBUNDLE = STATIC_URL + pckg.package + "/js/" + pckg.bundle;
                    var API = pckg.api;
                    var DOM_ID = pckg.domID;
                    $.getScript(JSPATH, function (data, textStatus, jqxhr) {
                        addDivPackage(DOM_ID);
                        setTimeout(getBundle(JSBUNDLE, API, DOM_ID), 100);
                    });
                })
            }
            if (name === 'Inspector') {
                this.setState({ sInspector: !this.state.sInspector });
                this.setState({ drawer: false });
                this.setState({ activebutton: this.state.activebutton === name ? true : name });
                this.setState({ move: 0 });
            }
        }
    }

    render() {
        const buttonPanel = this.state.settingPanels.map((config) => {
            const ComponentToRender = Components[config.component];
            let IsdcComponent;
            if(config.component === 'Inspector'){
                IsdcComponent = (
                    <ComponentToRender getInspector={this.state.sInspector}/>
                );
            } else {
                IsdcComponent = (
                    <Drawer openSecondary={false} open={this.state.drawer === config.component ? true : false} containerStyle={panel.drawerstyle} width={360}>
                        <ComponentToRender handleClose={(e) => this.handleOpen(e, config.component)}/>
                    </Drawer>
                );
            }

            return (
                <div style={{'margin-left': this.state.move,'transition':'margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)'}}>
                    <Tooltip
                        title={config.tooltip}
                        position="right"
                        arrow={true}
                        trigger="mouseenter"
                        size="big"
                    >
                        <FloatingActionButton
                            mini={true}
                            onClick={(e) => this.handleOpen(e, config.component)}
                            backgroundColor="#b71c1c"
                            style={panel.rightbox}
                            secondary={this.state.activebutton === config.component ? true : false}
                        >
                            <FontIcon className="material-icons">{config.icon}</FontIcon>
                        </FloatingActionButton>
                    </Tooltip>
                    {IsdcComponent}
                </div>
            )
        });

        return (
            <div className={"boxshadow"}>
                {buttonPanel}
            </div>
        );
    }
}

export default IsdcPanel;