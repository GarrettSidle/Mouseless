import { Component, ReactNode } from "react";

import "./ValueDisplay.css";
import ColorMap from "../../models/ColorMap";

function getStateColor(valueState: number, colorMap: ColorMap) {
    if (valueState >= colorMap.upperCutoff) {
        return colorMap.isInverted ? "bad" : "good"
    }
    if (valueState >= colorMap.centerCutoff
    ) {
        return "neutral"
    }
    return colorMap.isInverted ? "good" : "bad"
}



interface ValueProps {
    value: number;
    viewable?: string;
    unit?: string;
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
                        <span className="value">
                            {this.props.viewable == null ? this.props.value : this.props.viewable}
                        </span>
                    </div>
                    <div className={`unit-box ${this.props.unit == null ? "hidden" : ""} ${this.props.title}-unit-box`}>
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