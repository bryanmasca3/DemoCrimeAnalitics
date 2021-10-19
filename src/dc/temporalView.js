import React,{useState} from "react";
import * as dc from "dc";
import {extent, scaleLinear,scaleTime, timeMonth,timeParse ,max} from "d3";
import { ChartTemplate } from "./chartTemplate";
import './../App.css';
import {selectDataFiltered,setDataFilterd} from "./../redux/slice/Data";
const MoveChartFunc = (divRef, ndx,dispatch,groupNode,groupPoly) => {  
  const dateFmt = timeParse("%d-%m-%Y %H:%M:%S");
 
  const moveChart = dc.lineChart(divRef);  
  
  const dimTime =  ndx.dimension(d => dateFmt(d.Fecha));  
  
  const times = dimTime.group(timeMonth);

  const minDate         = dimTime.bottom(1)[0]["Fecha"];
  const maxDate         = dimTime.top(1)[0]["Fecha"];
   
  const yMin          = 0;
  const yMax          = max(times.all(), (f)=> f.value )    

  const dimNode          = ndx.dimension((f) => f.codnode);
  const GroupNodes       = dimNode.group().reduceSum((d) => +1);



  console.log(groupPoly.top(Infinity))
  moveChart  
    .width(1450)
    .height(150)
    .transitionDuration(1000)
    .renderHorizontalGridLines(true)
    .x(scaleTime().domain([dateFmt(minDate),dateFmt(maxDate)]))
    .y(scaleLinear().domain([yMin, yMax]))  
    .renderArea(true)
    .colors(["#f46d43"])    
    .on("filtered", function() {
      
     // dispatch(setDataFilterd(dimTime.top(Infinity)));  
     console.log(groupPoly.top(Infinity))  
     console.log(groupNode.top(Infinity));          
 
      
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

export const TemporalView = ()  => {
  const [isShowTempView, setisShowTempView]=useState(false); 
  return(<>
    <div className="button__temp-view" onClick={()=>setisShowTempView(!isShowTempView)}><i class="uil uil-chart-line"></i> </div>        
    <div className={`temporal__view ${isShowTempView?"temporal__view-show":"temporal__view-close"}` }>      
            <ChartTemplate chartFunction={MoveChartFunc} title="Monthly Price Moves"/>        
      </div>
      </>
      
  )
}


