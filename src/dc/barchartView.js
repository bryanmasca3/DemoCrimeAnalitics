import React,{useState} from "react";
import * as dc from "dc";
import {max,scaleLinear} from "d3";
import { ChartTemplate } from "./chartTemplate";
import {setmaxPolygonAmount,setmaxNodeAmount,setPointData,setPrePolygonData} from "./../redux/slice/Data";
import './../App.css';
const dayOfWeekFunc = (divRef, ndx,dispatch,dimPoly,dimNode) => {
    
    const dayOfWeekChart = dc.rowChart(divRef)
    //data.map(a=>a.atribute.map(item=>dataParse.push({"date":item.Fecha})))
    var dimCrimeType     = ndx.dimension((d) =>d.Type);
    var CrimeTypes       = dimCrimeType.group();

    const xMax          = max(CrimeTypes.all(), (f)=> f.value ) 
    //console.log(groupNode.top(Infinity));  
    dayOfWeekChart
    .dimension(dimCrimeType)
    .group(CrimeTypes)
    .width(250)
    .height(250)
    .margins({top: 10, right: 40, bottom: 25, left: 10})
    .renderTitle(true)
    .title(function(d) { return d.key + "  " + d.value })    
    .rowsCap(5)    
    .x(scaleLinear().domain([0,xMax]))
    .elasticX(true)
    .ordinalColors(['#708036', '#9F9F45', '#BFB155', '#DFB265', '#FFAE76']) 
    .othersGrouper(false)  
    .on("filtered", function() {        
        var result = [];
        //var result2 = [];
  
      /*  var subsetGroup=dimPoly.top(Infinity).reduce(function(a, b) {
          var c=b["idpolygons"].map((item)=>{return{"key":item,"value":1}})        
          return a.concat(c);
        }, []);*/
        
       /* subsetGroup.reduce(function(res,b){
          if (!res[b.key]) {
            res[b.key] = { "key": b.key, "value": 0};
            result2.push(res[b.key])
          }
          res[b.key].value += b.value;
          return res;
        },{});*/
  
        dimNode.top(Infinity).reduce(function(res, b) {
          if (!res[b["location"].coordinates]) {
            res[b["location"].coordinates] = { "key": b["location"].coordinates, "value": 0 };
            result.push(res[b["location"].coordinates])
          }     
          res[b["location"].coordinates].value += 1;
          return res;
        }, {});
        
        const MaxPoint          = max(result, (f)=> f.value )  
       // const MaxPolygon          = max(result2, (f)=> f.value )  
  
  
        dispatch(setmaxNodeAmount(MaxPoint))
       // dispatch(setmaxPolygonAmount(MaxPolygon?MaxPolygon+2:1))
        dispatch(setPointData(result))
        //dispatch(setPrePolygonData(datasetpolygon))
       // dispatch(setPrePolygonData(result2))
        
  })     

    return dayOfWeekChart
}

export const ChartView = ({datasetpolygon}) =>{
    const [isHistogramView, setisHistogramView]=useState(false);  
    return(<>
     <div className="button__histogram-view" onClick={()=>setisHistogramView(!isHistogramView)}><i class="uil uil-chart-bar"></i></div>
        <div className={`histogram__view ${isHistogramView?"histogram__view-show":"histogram__view-close"}` }>
           
            <ChartTemplate chartFunction={dayOfWeekFunc} title="Weekday"/>    
        </div>  
        </>                        
    )
} 

