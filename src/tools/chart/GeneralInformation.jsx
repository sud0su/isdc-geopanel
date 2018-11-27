import React from 'react'
import { ResponsivePie } from '@nivo/pie'

// make sure parent container have a defined height when using responsive component,
// otherwise height will be 0 and no chart will be rendered.
// website examples showcase many properties, you'll often use just a few of them.

class GeneralInformation extends React.Component {
    render(){
        return (
            <ResponsivePie
                data={[
                    {
                    "id": "hack",
                    "label": "hack",
                    "value": 297,
                    "color": "hsl(217, 70%, 50%)"
                    },
                    {
                    "id": "python",
                    "label": "python",
                    "value": 515,
                    "color": "hsl(99, 70%, 50%)"
                    }
                ]}
                margin={{
                    "top": 30,
                    "right": 10,
                    "bottom": 10,
                    "left": 10
                }}
                innerRadius={0.2}
                padAngle={0.7}
                // cornerRadius={3}
                colors="nivo"
                colorBy="id"
                borderWidth={1}
                borderColor="inherit:darker(0.3)"
                enableRadialLabels={false}
                slicesLabelsSkipAngle={10}
                slicesLabelsTextColor="#333333"
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                defs={[
                    {
                        "id": "dots",
                        "type": "patternDots",
                        "background": "inherit",
                        "color": "rgba(255, 255, 255, 0.3)",
                        "size": 4,
                        "padding": 1,
                        "stagger": true
                    },
                    {
                        "id": "lines",
                        "type": "patternLines",
                        "background": "inherit",
                        "color": "rgba(255, 255, 255, 0.3)",
                        "rotation": -45,
                        "lineWidth": 6,
                        "spacing": 10
                    }
                ]}
                legends={[
                    {
                        "anchor": "top-left",
                        "direction": "row",
                        "translateY": -20,
                        "itemWidth": 100,
                        "itemHeight": 18,
                        "itemTextColor": "#999",
                        "symbolSize": 18,
                        "symbolShape": "circle",
                        "effects": [
                            {
                                "on": "hover",
                                "style": {
                                    "itemTextColor": "#000"
                                }
                            }
                        ]
                    }
                ]}
            />
        )
    }
}

export default GeneralInformation;