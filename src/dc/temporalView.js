import React from "react";
import * as dc from "dc";
import { scaleLinear,scaleTime, timeMonth,timeParse ,max} from "d3";
import { ChartTemplate } from "./chartTemplate";
import './../App.css';
import {selectDataFiltered,setDataFilterd} from "./../redux/slice/Data";
const MoveChartFunc = (divRef, ndx,dispatch) => {
  //const DataSetFiltered = useSelector(selectDataFiltered);
  

  const dateFmt = timeParse("%d-%m-%Y %H:%M:%S");
 
  const moveChart = dc.lineChart(divRef);  
  
  const dimTime =  ndx.dimension(d => dateFmt(d.Fecha));  
  
  const times = dimTime.group(timeMonth);

  const minDate         = dimTime.bottom(1)[0]["Fecha"];
  const maxDate         = dimTime.top(1)[0]["Fecha"];
   
  const yMin          = 0;
  const yMax          = max(times.all(), function(f) { return f.value })    

  moveChart
  
    .width(1400)
    .height(150)
    .transitionDuration(1000)
    .renderHorizontalGridLines(true)
    .x(scaleTime().domain([dateFmt(minDate),dateFmt(maxDate)]))
    .y(scaleLinear().domain([yMin, yMax]))  
    .renderArea(true)
    .colors(["#f46d43"])    
    .on("filtered", function() {
        //console.log("payasp")
        dispatch(setDataFilterd(dimTime.top(Infinity)));    
        //console.log(dimTime.top(Infinity))
  })     
    .clipPadding(10)     
    .dimension(dimTime)      
    .group(times)   
    .title(function(d) {
      var value = d.value;
      if (isNaN(value)) {
          value = 0;
      }
      return (d.key.toLocaleDateString()) + '  -  ' + parseInt(value);
    })
    .xAxis().tickFormat(function(v) { return v.toLocaleDateString(); });
    moveChart.yAxis().ticks(6);    
  

    return moveChart;
};

export const TemporalView = ()  => (
    <div className="temporal__view">
        <ChartTemplate chartFunction={MoveChartFunc} title="Monthly Price Moves"/>
    </div>
    
)
