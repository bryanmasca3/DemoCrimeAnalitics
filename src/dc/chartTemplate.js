import React from "react";
import { CXContext } from "./cxContext";
import * as dc from "dc";
import {useDispatch} from 'react-redux';



const ResetButton = props => {

  return (
    <span style={{"cursor":"pointer","position":"absolute","bottom":"0","right":"0"}}
      onClick={() => {
        props.chart.filterAll();
        dc.redrawAll();
      }}
    >
      <i class="uil uil-minus-circle" style={{"fontSize":"1.2em"}}></i>
    </span>
  );
};
export const ChartTemplate = props => {
  
  const dispatch = useDispatch();
  const context = React.useContext(CXContext);
  const [chart,updateChart] = React.useState(null);
  const ndx = context.ndx;
  const div = React.useRef(null);
  var dimNode   = ndx.dimension((d) => d["location"].coordinates);  
  var dimPoly   = ndx.dimension((d) => d["idpolygons"]);

  /*var dimNode   = ndx.dimension((d) => d["location"].coordinates);
  var groupNode = dimNode.group();
  
  var dimPoly   = ndx.dimension((d) => d["idpolygons"]);
  var groupPoly = dimPoly.group();*/
  
  
  /*DATA*/
  /*var subsetGroup=groupPoly.top(Infinity).reduce(function(a,b) {
    var c=b["key"].map((item)=>{return{"key":item,"value":b["value"]}})
    return a.concat(c);
  },[]);
  
  var result = [];

  subsetGroup.reduce(function(res, b) {
    if (!res[b.key]) {
      res[b.key] = { "key": b.key, "value": 0 };
      result.push(res[b.key])
    }
    res[b.key].value += b.value;
    return res;
  }, {});

  console.log(result)*/
  /*DATA*/
  React.useEffect(() => {   
    //console.log(props.datasetpolygon)
    const newChart = props.chartFunction(div.current, ndx,dispatch,dimPoly,dimNode);     
    newChart.render();
    updateChart(newChart);
  },[]);

  return (
    <div
      ref={div}      
    >    
      <div><ResetButton chart={chart} /></div>
    </div>
  );
};
