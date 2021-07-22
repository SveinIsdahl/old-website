//@ts-check


import React from "react"
import Day from "./Day"

class Week extends React.Component{
    render() {
        let days = [];
        days[0] =
            React.createElement(
                Day,
                //Props sent down component chain
                //<Week date0="23.5" text0="lorem ipsum" date1="24.5" text1="lorem ipsum"/>
                {date:this.props["date0"], text: this.props["text0"], leftText:this.props.week}
            )
        for (let i = 1; i < 7; i++) {
                days.push(
                    React.createElement(
                        Day,
                        //Props sent down component chain
                        //<Week date0="23.5" text0="lorem ipsum" date1="24.5" text1="lorem ipsum"/>
                        {date:this.props["date"+i], text: this.props["text"+i]}
                    )
                )
        }
        return(
            <div className="weekContainer">
                {days.map((Day, i) => {
                return (<React.Fragment key={i}>
                            {Day}
                        </React.Fragment>)
            })}
            </div>
            
            
            
        )
    }
}

export default Week