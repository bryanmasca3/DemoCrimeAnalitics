import React from "react";
import * as dc from "dc";
import { ChartTemplate } from "./chartTemplate";
import './../App.css';

const dayOfWeekFunc = (divRef, ndx) => {
    const dayOfWeekChart = dc.rowChart(divRef)
    //data.map(a=>a.atribute.map(item=>dataParse.push({"date":item.Fecha})))
    var dimCrimeType     = ndx.dimension((d) =>d.Type);
    var CrimeTypes       = dimCrimeType.group();

    dayOfWeekChart
    .dimension(dimCrimeType)
    .group(CrimeTypes)
    .width(500)
    .height(450)
    .transitionDuration(1000)
    .margins({top: 10, right: 40, bottom: 25, left: 10})
    .renderTitle(true)
    .title(function(d) { return d.key + "  " + d.value })
    .colors(["#66c2a5"])
    dayOfWeekChart.title(function(d){
        let keyvalue = d.key+" "+d.value;
        return keyvalue;
    });
    return dayOfWeekChart
}

export const ChartView = () =>{
    return(
  
        <div className="histogram__view">
            <ChartTemplate chartFunction={dayOfWeekFunc} title="Weekday" />    
        </div>
            
      
        
    )
} 

