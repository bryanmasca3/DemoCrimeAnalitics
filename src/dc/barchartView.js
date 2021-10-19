import React,{useState} from "react";
import * as dc from "dc";
import { ChartTemplate } from "./chartTemplate";
import './../App.css';
import {selectDataFiltered,setDataFilterd} from "./../redux/slice/Data";
const dayOfWeekFunc = (divRef, ndx,dispatch,groupNode,groupPoly) => {
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
    .colors(["#3e6be0"])
    .on("filtered", function() {        
        //dispatch(setDataFilterd(dimCrimeType.top(Infinity)));            
        console.log(groupNode.top(Infinity));      
  })     
    dayOfWeekChart.title(function(d){
        let keyvalue = d.key+" "+d.value;
        return keyvalue;
    });
    return dayOfWeekChart
}

export const ChartView = () =>{
    const [isHistogramView, setisHistogramView]=useState(false);  
    return(<>
     <div className="button__histogram-view" onClick={()=>setisHistogramView(!isHistogramView)}><i class="uil uil-chart-bar"></i></div>
        <div className={`histogram__view ${isHistogramView?"histogram__view-show":"histogram__view-close"}` }>
           
            <ChartTemplate chartFunction={dayOfWeekFunc} title="Weekday" />    
        </div>  
        </>                        
    )
} 

