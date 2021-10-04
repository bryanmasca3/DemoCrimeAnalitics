import React from "react";
import { CXContext } from "./cxContext";
import * as dc from "dc";
import {useSelector,useDispatch} from 'react-redux';
import {selectDataFiltered,setDataFilterd} from "./../redux/slice/Data";

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
  
  React.useEffect(() => {
   // console.log('ohhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
    const newChart = props.chartFunction(div.current, ndx,dispatch); 
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
