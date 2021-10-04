import React,{useState} from "react";
import * as dc from "dc";
import {extent, scaleLinear,scaleTime, timeMonth,timeParse ,max} from "d3";
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

  const dimNode          = ndx.dimension(function(f) { return f.codnode;});
  const GroupNodes       = dimNode.group().reduceSum(function(d) {return +1;});

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
        //console.log("payasp")
        dispatch(setDataFilterd(dimTime.top(Infinity)));    

       /* const ExtendsData = extent(GroupNodes.all(), function(d) { return d.value; });
        console.log(ExtendsData)
        const ddd=GroupNodes.all().map((s) =>{            
          return  array.find(item => item.osmid == s.key);
      });    
      console.log(ddd)*/
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


