import React, { Fragment } from 'react'
import PieChart from './chart/PieChart'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import BarStackChart from './chart/BarStackChart'
import FontIcon from 'material-ui/FontIcon'
import {Tabs, Tab} from 'material-ui/Tabs'
import Chip from 'material-ui/Chip'
import Avatar from 'material-ui/Avatar'
import Iframe from '@trendmicro/react-iframe'


function removeClass(el, className) {
  if (el.classList) el.classList.remove(className);
  else if (hasClass(el, className)) {
    var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
    el.className = el.className.replace(reg, " ");
  }
}
  
function humanizeTableFormatter(value){
	var v= value;
	if(v>=1000 && v<1000000){
		return (parseFloat((v/1000).toPrecision(3)))+' K'
	}
	else if (v>=1000000 && v<1000000000) {
		return (parseFloat((v/1000000).toPrecision(3)))+' M'
	}else{
		if (v==null || isNaN(parseFloat(v))) {
			v=0;
		}
		return (parseFloat((v*1).toPrecision(3)))
	}
}

const styles = {
    finderColor: {
        backgroundColor: 'rgb(183, 29, 27)'
    },
    iconTabs:{
        fontSize: 14,
    },
    directionImage: {
        backgroundImage: "url(../../static/isdc/img/arrow.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain"
    }
};

let settlementData, dname, bgColor, bgaColor;
// let weatherData;
// let weatherData = [];
class Inspector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerInspector: false,
			isLoading: false,
            error: null,
			results: [],
            inspectorTabs: 0,
            totSettlements: 0,
            getLat: 0,
            getLon: 0,
            getvuid: [],
            pplp_x: 0,
            pplp_y: 0,
            selected: null
        }
        window.inspectorFunction = this;
        this._setlementsInpector = window.getFunction._setlementsInpector;
        this._baseUrl = window.BASE_URL;
    }

    _activeInspector = (getInspector) => {
        this._setlementsInpector(getInspector);
        if(this.state.drawerInspector === true) {   
            if(this.props.getInspector === false){
                this.setState({ drawerInspector: false });
            }
        }
    }

    _weatherInfo = (_pplx, _pply) => {
        console.log(_pplx, _pply);
        console.log('url', this._baseUrl+'/api/getoverviewmaps/weather?x='+_pplx+'&y='+_pply);
        return <iframe src={this._baseUrl+'/api/getoverviewmaps/weather?x='+_pplx+'&y='+_pply} width="100%" height="300px"></iframe>
    }

    _PieChartData = (results) => {
        let piechart;
        if(this.state.inspectorTabs === 0){
            piechart = results.panels_list.charts.map((items) =>
                <div class="col s12 l3">
                    <PieChart dataChart={items.data.child} dataTitle={items.title} />
                </div>)
        } else if (this.state.inspectorTabs === 1) {
            const ArrayObject = [];
            ArrayObject.push(results.panels_list.charts[1]);
            piechart = ArrayObject.map((items) =>
                <div class="col s12 l3">
                    <PieChart dataChart={items.data.child} dataTitle={items.title} />
                </div>)
        } else if (this.state.inspectorTabs === 3) {
            const no_zero = ['1', '2', '3', '4'];
            let ArrayData = [];
            for (var i = 1; i <= no_zero.length; i++) {
                ArrayData.push(results.panels_list.charts[i]);
            }
            piechart = ArrayData.map((items) =>
                        <div class="row">
                            <div class="col s12 l4">
                                <PieChart dataChart={items.child} dataTitle={items.title} />
                            </div>
                        </div>)
        }
        return piechart
    }

    _BarStackChartData = (results) => {
        const ArrayObject = [];
        ArrayObject.push(results.panels_list.charts[0]);
        const barstackChart = ArrayObject.map((items)=>
                                <div class="col s12 l4">
                                    <BarStackChart barData={items.data.child} barTitle={items.title} />
                                </div>)
        return barstackChart
    }

    _TableData = (results) => {
        const rowdata = (items) => {
            let rowlist;
            rowlist = items.map((item) => <td>{item}</td>)
            return rowlist
        }

        let _tablehead = <table class="settlementTable">
                            <tbody>
                                {results.panels_list.tables[0].child.map((items)=> <tr>{rowdata(items)}</tr>)}
                            </tbody>
                        </table>
        
        return _tablehead
    }

    _TableDataHazardRisk = (results) => {
        const rowdata = (items) => {
            let rowlist;
            rowlist = items.map((item) => <td>{item}</td>)
            return rowlist
        }
        const color = ['#C5CEFB','#9DFAE0','#BEF66E','#FBF051','#F5B940','#EC6E2D','#EB3C25','#7F2321'];
        let _hazardrisk = <div class="col s12 l12">
                                <b>{results.panels_list.tables[1].title}</b>
                                {/* <div className="_rotate"> */}
                                    <table class="tblborder" width="35%">
                                        <tbody>
                                            {results.panels_list.tables[1].child.map((items, index)=> 
                                                <tr style={{'background-color':color[index],'font-weight':'bold'}}>
                                                    {rowdata(items)}
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                {/* </div> */}
                                <ul>
                                    <li>{results.panels_list.tables[1].footnotes[0]}</li>
                                    <li>{results.panels_list.tables[1].footnotes[1]}</li>
                                </ul>
                          </div>
        
        return _hazardrisk
    }

    _TableEarthquakeDesc = (results) => {
        const rowdata = (items) => {
            let rowlist;
            rowlist = items.map((item) => <td>{item}</td>)
            return rowlist
        }
        const rowcolor = (items) => {
            let color;
            if(items === 'Weak'){
                color = '#C5CEFB';
            } else if (items === 'Light') {
                color = '#9DFAE0';
            } else if (items === 'Moderate') {
                color = '#C2FC70';
            } else if (items === 'Strong'){
                color = '#FBF051';
            } else if (items === 'Very strong'){
                color = '#F5B940';
            } else if (items === 'Severe'){
                color = '#EC6E2D';
            } else if (items === 'Violent'){
                color = '#EB3C25';
            } else if (items === 'Extreme'){
                color = '#C1291D';
            } else {    
                color = '#FFFFFF';
            }
            return color
        }

        let description = <div class="col s12 l12">
                            <b>{results.panels_list.tables[3].title}</b>
                                <table class="desctable">
                                    <thead>
                                        <tr style={{ 'font-weight': 'bold' }}>
                                            <th width="100px">{results.panels_list.tables[3].columntitles[0]}</th>
                                            <th width="100px">{results.panels_list.tables[3].columntitles[1]}</th>
                                            <th>{results.panels_list.tables[3].columntitles[2]}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.panels_list.tables[3].child.map((items, index)=> 
                                            <tr style={{'background-color':rowcolor(results.panels_list.tables[3].child[index][1])}}>
                                                {rowdata(items)}
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            <ul>
                                <li>{results.panels_list.tables[3].footnotes[0]}</li>
                                <li>{results.panels_list.tables[3].footnotes[1]}</li>
                            </ul>
                          </div>
        
        return description
    }

    _AccessibilityTableData = (results) => {
        let accessibilityTable = [];
        const child = (items) => {
            accessibilityTable = <tbody>
                <tr>
                    <td>{items[0][0].title}</td>
                    <td>{items[0][1].title}</td>
                </tr>
                <tr>
                    <td>{items[1][0].title}</td>
                    <td>{items[1][1].title}</td>
                </tr>
                <tr>
                    <td>{items[2][0].title}</td>
                    <td>{items[2][1].title}</td>
                </tr>
                <tr>
                    <td>{items[3][0].title}</td>
                    <td>{items[3][1].title}</td>
                </tr>
                <tr>
                    <td>{items[4][0].title}</td>
                    <td>{(() => {
                        let childdata = [];
                        for (var i = 0; i < items[4][1].child.length; i++) {
                            childdata.push(<Fragment><strong>{items[4][1].child[i][0]} : {items[4][1].child[i][1]}</strong><br /></Fragment>);
                        }
                        return childdata;
                    })()}</td>
                </tr>
                <tr>
                    <td>{items[5][0].title}</td>
                    <td>{(() => {
                        let childdata = [];
                        childdata.push(<strong>{items[5][1].title}</strong>);
                        for (var i = 0; i < items[5][1].child.length; i++) {
                            childdata.push(<Fragment><strong>{items[5][1].child[i][0]} : {items[5][1].child[i][1]}</strong><br /></Fragment>);
                        }
                        childdata.push(<div className="direction_arrow" style={Object.assign({},{"width": "50px","transform":"rotate("+items[5][1].direction_angle+"deg)"}, styles.directionImage)}>
                                <div style={{"transform": "rotate("+Math.abs(items[5][1].direction_angle)+"deg)"}}>{items[5][1].direction}</div>
                            </div>);
                        return childdata;
                    })()}</td>
                </tr>
                <tr>
                    <td>{items[6][0].title}</td>
                    <td>{(() => {
                        let childdata = [];
                        childdata.push(<strong>{items[6][1].title}</strong>);
                        for (var i = 0; i < items[6][1].child.length; i++) {
                            childdata.push(<Fragment><strong>{items[6][1].child[i][0]} : {items[6][1].child[i][1]}</strong><br /></Fragment>);
                        }
                        childdata.push(<div className="direction_arrow" style={Object.assign({},{"width": "50px","transform":"rotate("+items[6][1].direction_angle+"deg)"}, styles.directionImage)}>
                                <div style={{"transform": "rotate("+Math.abs(items[6][1].direction_angle)+"deg)"}}>{items[6][1].direction}</div>
                            </div>);
                        return childdata;
                    })()}</td>
                </tr>
                <tr>
                    <td>{items[7][0].title}</td>
                    <td>{(() => {
                        let childdata = [];
                        childdata.push(<strong>{items[7][1].title}</strong>);
                        for (var i = 0; i < items[7][1].child.length; i++) {
                            childdata.push(<Fragment><strong>{items[7][1].child[i][0]} : {items[7][1].child[i][1]}</strong><br /></Fragment>);
                        }
                        childdata.push(<div className="direction_arrow" style={Object.assign({},{"width": "50px","transform":"rotate("+items[7][1].direction_angle+"deg)"}, styles.directionImage)}>
                                <div style={{"transform": "rotate("+Math.abs(items[7][1].direction_angle)+"deg)"}}>{items[7][1].direction}</div>
                            </div>);
                        return childdata;
                    })()}</td>
                </tr>
                <tr>
                    <td>{items[8][0].title}</td>
                    <td>{(() => {
                        let childdata = [];
                        childdata.push(<strong>{items[8][1].title}</strong>);
                        for (var i = 0; i < items[8][1].child.length; i++) {
                            childdata.push(<Fragment><strong>{items[8][1].child[i][0]} : {items[8][1].child[i][1]}</strong><br /></Fragment>);
                        }
                        childdata.push(<div className="direction_arrow" style={Object.assign({},{"width": "50px","transform":"rotate("+items[8][1].direction_angle+"deg)"}, styles.directionImage)}>
                                <div style={{"transform": "rotate("+Math.abs(items[8][1].direction_angle)+"deg)"}}>{items[8][1].direction}</div>
                            </div>);
                        return childdata;
                    })()}</td>
                </tr>
                <tr>
                    <td>{items[9][0].title}</td>
                    <td>{(() => {
                        let childdata = [];
                        childdata.push(<strong>{items[9][1].title}</strong>);
                        for (var i = 0; i < items[9][1].child.length; i++) {
                            childdata.push(<Fragment><strong>{items[9][1].child[i][0]} : {items[9][1].child[i][1]}</strong><br /></Fragment>);
                        }
                        childdata.push(<div className="direction_arrow" style={Object.assign({},{"width": "50px","transform":"rotate("+items[9][1].direction_angle+"deg)"}, styles.directionImage)}>
                                <div style={{"transform": "rotate("+Math.abs(items[9][1].direction_angle)+"deg)"}}>{items[9][1].direction}</div>
                            </div>);
                        return childdata;
                    })()}</td>
                </tr>
                <tr>
                    <td>{(() => {
                        let childdata = [];
                        childdata.push(<Fragment><strong>{items[10][0].title}</strong><br/></Fragment>);
                        for (var i = 0; i < items[10][0].child.length; i++) {
                            childdata.push(<Fragment>- {items[10][0].child[i][0]}<br /></Fragment>);
                        }
                        return childdata;
                    })()}
                    </td>
                    <td>{(() => {
                        let childdata = [];
                        childdata.push(<strong>{items[10][1].title}</strong>);
                        for (var i = 0; i < items[10][1].child.length; i++) {
                            childdata.push(<Fragment><strong>{items[10][1].child[i][0]} : {items[10][1].child[i][1]}</strong><br /></Fragment>);
                        }
                        childdata.push(<div className="direction_arrow" style={Object.assign({},{"width": "50px","transform":"rotate("+items[10][1].direction_angle+"deg)"}, styles.directionImage)}>
                                <div style={{"transform": "rotate("+Math.abs(items[10][1].direction_angle)+"deg)"}}>{items[10][1].direction}</div>
                            </div>);
                        return childdata;
                    })()}</td>
                </tr>
                <tr>
                    <td>{(() => {
                        let childdata = [];
                        childdata.push(<Fragment><strong>{items[11][0].title}</strong><br/></Fragment>);
                        for (var i = 0; i < items[11][0].child.length; i++) {
                            childdata.push(<Fragment>- {items[11][0].child[i][0]}<br /></Fragment>);
                        }
                        return childdata;
                    })()}
                    </td>
                    <td>{(() => {
                        let childdata = [];
                        childdata.push(<strong>{items[11][1].title}</strong>);
                        for (var i = 0; i < items[11][1].child.length; i++) {
                            childdata.push(<Fragment><strong>{items[11][1].child[i][0]} : {items[11][1].child[i][1]}</strong><br /></Fragment>);
                        }
                        childdata.push(<div className="direction_arrow" style={Object.assign({},{"width": "50px","transform":"rotate("+items[11][1].direction_angle+"deg)"}, styles.directionImage)}>
                                <div style={{"transform": "rotate("+Math.abs(items[11][1].direction_angle)+"deg)"}}>{items[11][1].direction}</div>
                            </div>);
                        return childdata;
                    })()}</td>
                </tr>
                <tr>
                    <td>{(() => {
                        let childdata = [];
                        childdata.push(<Fragment><strong>{items[12][0].title}</strong><br/></Fragment>);
                        for (var i = 0; i < items[12][0].child.length; i++) {
                            childdata.push(<Fragment>- {items[12][0].child[i][0]}<br /></Fragment>);
                        }
                        return childdata;
                    })()}
                    </td>
                    <td>{(() => {
                        let childdata = [];
                        childdata.push(<strong>{items[12][1].title}</strong>);
                        for (var i = 0; i < items[12][1].child.length; i++) {
                            childdata.push(<Fragment><strong>{items[12][1].child[i][0]} : {items[12][1].child[i][1]}</strong><br /></Fragment>);
                        }
                        childdata.push(<div className="direction_arrow" style={Object.assign({},{"width": "50px","transform":"rotate("+items[12][1].direction_angle+"deg)"}, styles.directionImage)}>
                                <div style={{"transform": "rotate("+Math.abs(items[12][1].direction_angle)+"deg)"}}>{items[12][1].direction}</div>
                            </div>);
                        return childdata;
                    })()}</td>
                </tr>
            </tbody>
            return accessibilityTable
        }

        let tableAccessibility = <table>
                                        {child(results.panels_list.tables[0].child)}
                                 </table>

        return tableAccessibility
    }

    _TableLandslide = (results) => {
        let headtable = [];
        let color = ["","#A2E794","#54AF6A","#FDF15C","#EF8532","#D1342B"]
        let color2 = ["","","#A2E794","#54AF6A","#FDF15C","#EF8532","#D1342B"]
        const tableHead = (items) => {
            let th = [];
            th.push(<th></th>);
            for(var i=0; i<items.length;i++){
                th.push(<th style={{"padding": "90px 10px 5px","max-width": "10px","background-color":color[i]}}><div className="_rotate">{items[i]}</div></th>)
            }
            return th
        }
        const tableBody = (items) => {
            let td = [];
            for(var i = 0; i<items.length; i++){
                td.push(<td style={{"padding":"5px 5px","background-color":color2[i]}}>{items[i]}</td>);
            }
            return td
        }
        headtable = <Fragment>
                    <table className="susceptibility">
                        <thead>
                            <tr>
                                {tableHead(results.panels_list.tables[1].columntitles)}
                            </tr> 
                        </thead>
                        <tbody>
                            {results.panels_list.tables[1].child.map((items)=>
                                <tr style={{"font-weight":"normal"}}>
                                    {tableBody(items)}
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <ul>
                        {results.panels_list.tables[1].footnotes.map((items)=>
                            <li style={{"font-weight":"normal","font-size":"10px"}}>{items}</li>
                        )}
                    </ul>
            </Fragment>
            
        
        return headtable
    }

    _descLandslide = (results) => {
        let lidata = [];
        const lidesc = (items) => {
            let lidescdata = [];
            for(var i = 0; i<items.length; i++){
                lidescdata.push(<p style={{"font-weight":"normal","text-align": "justify","margin":"0px 0 10px"}}>{items[i]}</p>);
            }
            return lidescdata
        }
        const lititle = (items) => {
            let lititledata = [];
            for(var i =0; i < items.length; i++){
                lititledata.push(<li><b>{items[i].title}</b>{lidesc(items[i].desc)}</li>);
            }
            return lititledata
        }
        lidata = lititle(results.panels_list.desc)
        return lidata
    }

    _getDataSettlement = (results, pplp_x, pplp_y) => {
        let dataReturn;
        if (this.state.inspectorTabs === 0) {
            dataReturn = <Fragment>
                <div className="col s12 l5">
                    {this._TableData(results)}
                </div>
                {this._PieChartData(results)}
            </Fragment>
        }
        else if (this.state.inspectorTabs === 1) {
            dataReturn = <Fragment>
                <div className="col s12 l5">
                    {this._TableData(results)}
                </div>
                {this._BarStackChartData(results)}
                {this._PieChartData(results)}
            </Fragment>
        } else if (this.state.inspectorTabs === 2) {
            dataReturn = <Fragment>
                {this._AccessibilityTableData(results)}
            </Fragment>
        } else if (this.state.inspectorTabs === 3) {
            dataReturn = <Fragment>
                <div className="col s12 l5">
                    {this._TableData(results)}
                </div>
                {this._PieChartData(results)}
            </Fragment>
        } else if (this.state.inspectorTabs === 4) {
            dataReturn = <Fragment>
                <div className="col s12 l5">
                    {this._TableData(results)}
                </div>
                {this._TableDataHazardRisk(results)}
                {this._TableEarthquakeDesc(results)}
            </Fragment>
        } else if (this.state.inspectorTabs === 5) {
            dataReturn = <Fragment>
                <div className="col s12 l6">
                    <div className="row">
                        <div className="col s12 l12">
                            {this._TableData(results)}
                        </div>
                        <div className="col s12 l12" style={{"margin-top":"10px"}}>
                            {this._TableLandslide(results)}
                        </div>
                    </div>
                </div>
                <div className="col s12 m6">
                    <ul>
                        {this._descLandslide(results)}
                    </ul>
                </div>
            </Fragment>
        } else if (this.state.inspectorTabs === 6) {
            dataReturn = <Fragment>
            {console.log('x',this.state.pplp_x)}
                {console.log('y',this.state.pplp_y)}
                            {this._weatherInfo(pplp_x, pplp_y)}
                        </Fragment>
        } else if (this.state.inspectorTabs === 7) {
            dataReturn = <Fragment>
                {this._TableData(results)}
                {/* {this._PieChartData(results)} */}
            </Fragment>
        } else if (this.state.inspectorTabs === 8) {
            dataReturn = <Fragment>
                {this._TableData(results)}
                {/* {this._PieChartData(results)} */}
            </Fragment>
        }

        return dataReturn
    }

    _getVuidData = (e, vuid, pplp_x, pplp_y, dname) => {
        e.preventDefault();
        let Url;
        this.setState({ selected: vuid });
        let chipID, avaID, chipId, avaId;
        if (this.state.selected === null && vuid) {
            chipID = document.getElementById('chip'+vuid).classList;
            avaID = document.getElementById('ava'+vuid).classList;
            chipID.add("vuidsettlementsActive");
            avaID.add("vuidsettlementsAvaActive");
        } else {
            var checkChipActive = document.getElementsByClassName("vuidsettlementsActive");
            var checkAvaActive = document.getElementsByClassName("vuidsettlementsAvaActive");
            if (checkChipActive.length > 0 && checkAvaActive.length > 0) {
                for(var i=0; i<checkChipActive.length; i++){
                    checkChipActive[i].classList.remove("vuidsettlementsActive");
                    checkAvaActive[i].classList.remove("vuidsettlementsAvaActive");
                }
            }
            chipID = document.getElementById('chip'+vuid).classList;
            avaID = document.getElementById('ava'+vuid).classList;
            chipID.add("vuidsettlementsActive");
            avaID.add("vuidsettlementsAvaActive");
        }

        Url = this._baseUrl+'/api/getoverviewmaps/general/?vuid=' + vuid;
        if (this.state.inspectorTabs === 1) {
            Url = this._baseUrl+'/api/getoverviewmaps/demographic/?vuid=' + vuid;
        } else if (this.state.inspectorTabs === 2) {
            Url = this._baseUrl+'/api/getoverviewmaps/accessibility/?vuid=' + vuid;
        } else if (this.state.inspectorTabs === 3) {
            Url = this._baseUrl+'/api/getoverviewmaps/flood/?vuid=' + vuid;
        } else if (this.state.inspectorTabs === 4) {
            Url = this._baseUrl+'/api/getoverviewmaps/earthquake/?vuid=' + vuid;
        } else if (this.state.inspectorTabs === 5) {
            Url = this._baseUrl+'/api/getoverviewmaps/landslide/?vuid=' + vuid;
        } else if (this.state.inspectorTabs === 7) {
            Url = this._baseUrl+'/api/getoverviewmaps/climate/?vuid=' + vuid;
        } else if (this.state.inspectorTabs === 8) {
            Url = this._baseUrl+'/api/getoverviewmaps/snow/?vuid=' + vuid;
        }

        this.setState({ isLoading: true });
        if(this.state.inspectorTabs === 6){
            this.setState({isLoading: false})
            this.setState({pplp_x: pplp_x, pplp_y: pplp_y})
        } else {
            fetch(Url, {
                credentials: 'include',
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                }
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
        }

    }

    _setlementsData = (vuid) => {
        this.setState({totSettlements: vuid.features.length});
        let gi_Data = [];
        for (var i = 0; i < vuid.features.length; i++) {
            let pplp_x = vuid.features[i].properties.pplp_point_x; 
            let pplp_y = vuid.features[i].properties.pplp_point_y;
            let dvuid = vuid.features[i].properties.vuid;
            dname = vuid.features[i].properties.name_en;
            
            var checkChipActive = document.getElementsByClassName("vuidsettlementsActive");
            var checkAvaActive = document.getElementsByClassName("vuidsettlementsAvaActive");
            if (checkChipActive.length > 0 && checkAvaActive.length > 0) {
                for(var i=0; i<checkChipActive.length; i++){
                    checkChipActive[i].classList.remove("vuidsettlementsActive");
                    checkAvaActive[i].classList.remove("vuidsettlementsAvaActive");
                }
            }
            gi_Data.push(<Chip 
                            id={'chip'+dvuid}
                            labelColor="#FFFFFF"
                            onClick={(e) => this._getVuidData(e, dvuid, pplp_x, pplp_y, dname)}
                            className={"vuidsettlements"}>
                            <Avatar color="#FFFFFF" id={'ava'+dvuid} className={"vuidsettlementsAva"} icon={<span class="icon-product_type_map"></span>} />{dname}
                        </Chip>)
        }
        return gi_Data;
    }

    _handleInspector = (lon, lat, vuid) => {
        this.setState({getLat: lat});
        this.setState({getLon: lon});
        this.setState({getvuid: vuid});
        this.setState({ results: [] });
        settlementData = this._setlementsData(this.state.getvuid);
        if(this.props.getInspector === true) {
            this.setState({ drawerInspector: true });
        } else {
            this.setState({ drawerInspector: false })
        }
    }

    _handleChangeData = (value) => {
        this.setState({inspectorTabs: value});
    }

    _activeTab = (value, vuid, pplp_x, pplp_y) => {
        if(vuid !== null){
            let Url;
            this.setState({results: []});
            Url = this._baseUrl+'/api/getoverviewmaps/general/?vuid=' + vuid;
            if (value === 1) {
                Url = this._baseUrl+'/api/getoverviewmaps/demographic/?vuid=' + vuid;
            } else if (value === 2) {
                Url = this._baseUrl+'/api/getoverviewmaps/accessibility/?vuid=' + vuid;
            } else if (value === 3) {
                Url = this._baseUrl+'/api/getoverviewmaps/flood/?vuid=' + vuid;
            } else if (value === 4) {
                Url = this._baseUrl+'/api/getoverviewmaps/earthquake/?vuid=' + vuid;
            } else if (value === 5) {
                Url = this._baseUrl+'/api/getoverviewmaps/landslide/?vuid=' + vuid;
            } else if (value === 7) {
                Url = this._baseUrl+'/api/getoverviewmaps/climate/?vuid=' + vuid;
            } else if (value === 8) {
                Url = this._baseUrl+'/api/getoverviewmaps/snow/?vuid=' + vuid;
            }
            
            this.setState({ isLoading: true });
            if(value === 6){
                this.setState({isLoading: false})
                this.setState({pplpx: pplp_x, pplpy: pplp_y})
            } else {
                fetch(Url, {
                    credentials: 'include',
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    }
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
            }
        } else {
            this.setState({results: []});  
        }
    }

    render() {
        const { inspectorTabs, getLat, getLon, totSettlements, isLoading, error, results, selected, pplp_x, pplp_y, getvuid } = this.state;
        const { getInspector } = this.props;
        this._activeInspector(getInspector);

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
        if (this.state.inspectorTabs === 6){
            AppendData = this._getDataSettlement(results, pplp_x, pplp_y);
        } else {
            AppendData = (results.length === 0) ? 'Please select the settlement to view data' : this._getDataSettlement(results, pplp_x, pplp_y);
        }
        let dataSettlements = isLoading ? loading : AppendData;

        const TabsInspector = (
            <div>
                <div class="smallTitle">
                        There are <b>{totSettlements}</b> settlements around a coordinates (<b>Lon : {getLon}</b>, <b>Lat : {getLat}</b>), please select the settlement to view data
                </div>
                <div className={"inspectorSettlement"}>
                    {settlementData}
                </div>
                <Tabs
                    tabItemContainerStyle={styles.finderColor}
                    value={inspectorTabs}
                    onChange={this._handleChangeData}
                    inkBarStyle={{ background: '#fff' }}
                >
                    <Tab
                        icon={<span class="icon-activity_information_technology iconSize" style={{ 'background-color': '#29B6D2' }}></span>}
                        className={"filterTabs"}
                        value={0}
                        onActive={() => this._activeTab(0, selected, pplp_x, pplp_y)}
                    >
                        <div>
                            <div className="titleInfo">
                                General Information
                                <div className="contentData">
                                    <div class="row">
                                        {dataSettlements}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab
                        icon={<span class="icon-infrastructure_community_building iconSize" style={{ 'background-color': '#29B6D2' }}></span>}
                        className={"filterTabs"}
                        value={1}
                        onActive={() => this._activeTab(1, selected, pplp_x, pplp_y)}
                    >
                        <div>
                            <div className="titleInfo">
                                Demographics
                                <div className="contentData">
                                    <div class="row">
                                        {dataSettlements}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab
                        icon={<span class="icon-other_cluster_coordination iconSize" style={{ 'background-color': '#29B6D2' }}></span>}
                        className={"filterTabs"}
                        value={2}
                        onActive={() => this._activeTab(2, selected, pplp_x, pplp_y)}
                    >
                        <div>
                            <div className="titleInfo">
                                Accessibility
                                <div className="contentData">
                                    <div class="row">
                                        {dataSettlements}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab
                        icon={<span class="icon-disaster_flood iconSize" style={{ 'background-color': '#29B6D2' }}></span>}
                        className={"filterTabs"}
                        value={3}
                        onActive={() => this._activeTab(3, selected, pplp_x, pplp_y)}
                    >
                        <div>
                            <div className="titleInfo">
                                Flooding
                                <div className="contentData">
                                    <div class="row">
                                        {dataSettlements}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>

                    <Tab
                        icon={<span class="icon-disaster_earthquake iconSize" style={{ 'background-color': '#29B6D2' }}></span>}
                        className={"filterTabs"}
                        value={4}
                        onActive={() => this._activeTab(4, selected, pplp_x, pplp_y)}
                    >
                        <div>
                            <div className="titleInfo">
                                Earthquake
                                <div className="contentData">
                                    <div class="row">
                                        {dataSettlements}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab
                        icon={<span class="icon-disaster_landslide iconSize" style={{ 'background-color': '#29B6D2' }}></span>}
                        className={"filterTabs"}
                        value={5}
                        onActive={() => this._activeTab(5, selected, pplp_x, pplp_y)}
                    >
                        <div>
                            <div className="titleInfo">
                                Landslide
                                <div className="contentData">
                                    <div class="row">
                                        {dataSettlements}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab
                        icon={<FontIcon className="material-icons" style={styles.iconTabs}>wb_cloudy</FontIcon>}
                        className={"filterTabs"}
                        value={6}
                        onActive={() => this._activeTab(6, selected, pplp_x, pplp_y)}
                    >
                        <div>
                            <div className="titleInfo">
                                <div className="contentData">
                                    <div class="row">
                                        {dataSettlements}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab
                        icon={<FontIcon className="material-icons" style={styles.iconTabs}>filter_drama</FontIcon>}
                        className={"filterTabs"}
                        value={7}
                        onActive={() => this._activeTab(7, selected, pplp_x, pplp_y)}
                    >
                        <div>
                            <div className="titleInfo">
                                Climate
                                <div className="contentData">
                                    <div class="row">
                                        {dataSettlements}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab
                        icon={<span class="icon-disaster_snowfall iconSize" style={{ 'background-color': '#29B6D2' }}></span>}
                        className={"filterTabs"}
                        value={8}
                        onActive={() => this._activeTab(8, selected, pplp_x, pplp_y)}
                    >
                        <div>
                            <div className="titleInfo">
                                Snow Cover
                                <div className="contentData">
                                    <div class="row">
                                        {dataSettlements}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        ); 

        return (
            <div>
                <div className={"boxInspector"} style={{ 'display': this.state.drawerInspector === true ? 'block' : 'none' }}>
                    {TabsInspector}
                </div>
            </div>
        );
    }
}

export default Inspector;