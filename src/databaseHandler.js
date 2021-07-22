//@ts-check
import firebase from "firebase/app";
class DatabaseHandler {
    constructor() {
        this.objectVal = {};
        this.database = firebase.database();
        this.user = {};
        
    }
    /**
     * @param {String} date
     * @param {Boolean} important
     * @param {String} text
     */
    pushToDatabase(date, important, text) {
        const year = String(new Date().getFullYear());
        if(this.user.uid) {
            this.database.ref("calendar/" + this.user.uid + "/" + year).push(
                {
                    "date":date,
                    "important": important,
                    "text": text,
                }
            )
        }
        
    }
    getData([snapshot, loading, error]) {
      
        let database = [];
        const date = new Date();
        let data = [];
        if (snapshot) {
            database = Object.entries(snapshot[date.getFullYear()]).map((value) => {
                return value[1]
            });
        }
        else{
            return [];
        }
        
        //0-6
        const dayOfWeek = date.getDay() - 1;

        //Monday of last week(-1 because it gets added in the loop in the first itteration) 
        let tempDate = new Date();
        tempDate.setDate(tempDate.getDate() - dayOfWeek - 7 - 1);

        for (let i = (this.#getWeekNumber() - 1); i < 53; i++) {
            let weekData = {
                "week": String(i)
            }
           
            for (let j = 0; j < 7; j++) {
                tempDate.setDate(tempDate.getDate() + 1)
                const currentDate = tempDate.getDate() + "." + (tempDate.getMonth() + 1);
                weekData["date" + j] = currentDate;

                if (snapshot) {
                    database.forEach((entry) => {
                      
                        if (String(entry.date) === String(currentDate)) {
                            weekData["text" + j] = entry.text;
                        }
                    })

                }
            }
            data.push(weekData);
        }
        return data
    }
    get ref() {
        return (
            this.database.ref("calendar/" + this.user.uid)
        )
    }
    #getWeekNumber() {
        let d = new Date()
        // Sett til nærmeste torsdag: current date + 4 - current day number
        // Søndag = dag nr 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        // Første dag i året
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        // Full uke til nærmeste torsdag
        //@ts-ignore
        var weekNo = Math.ceil((((d - Number(yearStart)) / 86400000) + 1) / 7);
        // array med år og ukenr
        return weekNo - 1;
    }
}

export default DatabaseHandler