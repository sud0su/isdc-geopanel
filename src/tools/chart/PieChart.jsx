import React from 'react'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

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

function pie_label() {
    if (this.y > 0){
        return this.point.name + '<br/>'+humanizeTableFormatter(this.y)+' (' +Highcharts.numberFormat(this.percentage, 2) + '%)';
    }
}

class PieChart extends React.Component {
    constructor(props){
        super(props);
    }
    
    render() {
        const { dataChart, dataTitle } = this.props;
        
        const options = {
            title: {
                text: dataTitle,
                margin: 0,
                style: {
                    font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
                }
            },
            chart: {
                type: 'pie',
                backgroundColor: null
            },
			tooltip: {
				formatter: pie_label
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
			series: [{
				name: dataTitle,
                data: dataChart,
				size: '96%',
				showInLegend:true
			}]
        }

        return (
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        )
    }
}

export default PieChart