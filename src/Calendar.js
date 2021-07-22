//@ts-check

import React, {useContext} from "react"
import Week from "./Week"
import {useObjectVal} from 'react-firebase-hooks/database'
import 'firebase/auth';
import {databaseHandlerContext } from "./App";
import LoadingAnimation from "./LoadingAnimation";


export default function Calendar(props) {
    const databaseHandler = useContext(databaseHandlerContext)
    const [snapshot, loading, error] = useObjectVal(databaseHandler.ref)

    const data = databaseHandler.getData([snapshot, loading, error]);
    
    return (
        <div id="calendar">
            {
                loading ? 
                <LoadingAnimation />
                :
                (data.map((week, i) => {
                    return (
                        <Week {...week} key={i} />
                    )
                }))
                
                
            }
  
        </div>
    )
  }