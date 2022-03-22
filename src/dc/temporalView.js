import React,{useState} from "react";
import * as dc from "dc";
import {scaleLinear,scaleTime, timeMonth,timeParse ,max} from "d3";
import { ChartTemplate } from "./chartTemplate";
import './../App.css';
import {setmaxPolygonAmount,setmaxNodeAmount,setPointData,setPrePolygonData} from "./../redux/slice/Data";

const MoveChartFunc = (divRef, ndx,dispatch,dimPoly,dimNode) => {  

 

  //const dateFmt = timeParse("%d-%m-%Y %H:%M:%S");
  const dateFmt = timeParse("%d-%m-%Y");
 
  const moveChart = dc.lineChart(divRef);  
  
  const dimTime =  ndx.dimension(d => dateFmt(d.Fecha));  
  
  const times = dimTime.group(timeMonth);

  const minDate         = dimTime.bottom(1)[0]["Fecha"];
  const maxDate         = dimTime.top(1)[0]["Fecha"];
   
  const yMin          = 0;
  const yMax          = max(times.all(), (f)=> f.value )    


  moveChart  
    .width(1450)
    .height(150)
    .transitionDuration(1000)
    .renderHorizontalGridLines(true)
    .x(scaleTime().domain([dateFmt(minDate),dateFmt(maxDate)]))
    .y(scaleLinear().domain([yMin, yMax]))  
    .renderArea(true)
    .colors(["#f46d43"])    
    .on("filtered", async function() {
 
      var result = [];
      //var result2 = [];
     // console.log(datasetpolygon);
     /* var subsetGroup=dimPoly.top(Infinity).reduce(function(a, b) {
        var c=b["idpolygons"].map((item)=>{return{"key":item,"value":1}})        
        return a.concat(c);
      }, []);
      
      subsetGroup.reduce(function(res,b){
        if (!res[b.key]) {
          res[b.key] = { "key": b.key, "value": 0};
          result2.push(res[b.key])
        }
        res[b.key].value += b.value;
        return res;
      },{});*/

      dimNode.top(Infinity).reduce(function(res, b) {
       console.log(res[b["location"].coordinates])
        if (!res[b["location"].coordinates]) {
          res[b["location"].coordinates] = { "key": b["location"].coordinates, "value": 0 };
          result.push(res[b["location"].coordinates])
        }     
        res[b["location"].coordinates].value += 1;
        return res;
      }, {});
      
      const MaxPoint          = max(result, (f)=> f.value )  
     // const MaxPolygon          = max(result2, (f)=> f.value )  

     // console.log(times.top(Infinity))
      
      dispatch(setmaxNodeAmount(MaxPoint))
     // dispatch(setmaxPolygonAmount(MaxPolygon?MaxPolygon+2:1))
      dispatch(setPointData(result))
      //dispatch(setPrePolygonData(datasetpolygon))
      //dispatch(setPrePolygonData(result2))
      
      //console.log(dimNode.group().all())
      //dispatch(setPointData(dimNode.group().all()))
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

export const TemporalView = ({datasetpolygon})  => {
  const [isShowTempView, setisShowTempView]=useState(false); 
  
  return(<>
    <div className="button__temp-view" onClick={()=>setisShowTempView(!isShowTempView)}><i class="uil uil-chart-line"></i> </div>        
    <div className={`temporal__view ${isShowTempView?"temporal__view-show":"temporal__view-close"}` }>      
            <ChartTemplate chartFunction={MoveChartFunc} title="Monthly Price Moves"/>        
      </div>
      </>
      
  )
}


