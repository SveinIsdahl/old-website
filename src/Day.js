//@ts-check
import React, { useState, useEffect, useRef, useContext } from "react";
import { databaseHandlerContext } from "./App";

export default function Day(props) {
    const [text, setText] = useState(props.text)
    const textAreaRef = useRef(null)

    const date = new Date();

    const databaseHandler = useContext(databaseHandlerContext)


    useEffect(() => {
        //Push to database
        if (props.text !== text) {
            databaseHandler.pushToDatabase(props.date, false, text);
        }
    })
    return (
        <div className="day">

            {
                ((date.getDate() + "." + (date.getMonth() + 1)) === props.date) ?
                    <div className="dayTitle" style={{ backgroundColor: "var(--todayBackground)" }}>
                        <div>{props.leftText}</div>
                        <div>{props.date}</div>
                    </div>
                    :
                    <div className="dayTitle">
                        <div>{props.leftText}</div>
                        <div>{props.date}</div>
                    </div>
            }
            <textarea ref={textAreaRef} defaultValue={text} onBlur={() => setText(textAreaRef.current.value)}></textarea>

        </div>
    )
}
