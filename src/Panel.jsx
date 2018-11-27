import React from 'react'
import ReactDOM from 'react-dom'
import IsdcPanel from './isdcPanel'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

class Panel {
    constructor(domID, options){
        this._domID = domID;
        this._panelConfig = options.panelConfig;
        this._addPackage = options.addPackage;
    }

    set panelConfig(value){
        this._panelConfig = value;
    }

    set addPackage(value){
        this._addPackage = value;
    }

    panel(){
        ReactDOM.render(
            <MuiThemeProvider>
                <IsdcPanel
                    panelConfig = {this._panelConfig}
                    addPackage = {this._addPackage}
                />
            </MuiThemeProvider>, document.getElementById(this._domID)
        );
    }
}

module.exports = Panel;