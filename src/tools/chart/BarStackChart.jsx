import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

class BarStackChart extends React.Component {
    constructor(props) {
        super(props);
    }

    _valuebar = (barData) => {
        let _value=[];
        let _positive=[];
        let _negative=[];
        for(var i = 0; i<barData.length;i++){
            _negative.push(barData[i][1]);
            _positive.push(barData[i][2]);
        }
        _value.push({"name":"male","data":_negative},{"name":"female","data":_positive});
        return _value
    }

    _categories = (barData) => {
        let _categories=[];
        for(var i = 0; i<barData.length;i++){
            _categories.push(barData[i][0])
        }
        return _categories
    }

    render() {
        const { barData, barTitle } = this.props;
        const options = {
            title: {
                text: barTitle,
                margin: 0,
                style: {
                    font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
                }
            },
            chart: {
                type: 'bar',
                backgroundColor: null
            },
            xAxis: [{
                categories: this._categories(barData),
                reversed: false,
                labels: {
                    step: 1
                }
            }],
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    formatter: function () {
                        return Math.abs(this.value) + '%';
                    }
                }
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: this._valuebar(barData),
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
                        'Population: ' + Highcharts.numberFormat(Math.abs(this.point.y), 2)+'%';
                }
            },
            credits: {
                enabled: false
            }
        }

        return (
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        )
    }
}

export default BarStackChart