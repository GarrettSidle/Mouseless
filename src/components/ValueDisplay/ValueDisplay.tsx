import { Component, ReactNode } from "react";

import "./ValueDisplay.css";

function getStateColor(valueState: number, colorMap: ColorMap) {
    if (valueState >= colorMap.goodCutoff) {
        return "good"
    }
    if (valueState >= colorMap.neutralCutoff
    ) {
        return "neutral"
    }
    return "bad"
}

interface ColorMap {
    goodCutoff: number;
    neutralCutoff: number;
}


interface ValueProps {
    value: number;
    unit: string;
    title: string;
    colorMap: ColorMap;
}


export class ValueDisplay extends Component<ValueProps> {




    public render() {
        return (
            <div className="value-display">
                <h1>{this.props.title}</h1>
                <div className="reading">
                    <div className={`value-circle ${getStateColor(this.props.value, this.props.colorMap)}-background`}>
                        <span className="value">{this.props.value}</span>
                    </div>
                    <div className={`unit-box ${this.props.unit ==""?"hidden":""}`}>
                        <span className="unit">{this.props.unit}</span>
                    </div>
                </div>
            </div>
        );
    }


}
export default ValueDisplay;


<div className="circle-container">
    <div className="circle">
        <span className="value">42</span>
    </div>
    <div className="unit-box">
        <span className="unit">kg</span>
    </div>
</div>