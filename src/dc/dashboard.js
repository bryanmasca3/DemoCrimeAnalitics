import React from 'react'
import {DataContext}  from "./cxContext";
import { TemporalView} from "./temporalView";
import { ChartView} from "./barchartView";
import BarchartAmenitiesView from "./barchartAmenitiesView";
import './../App.css';

 const Dashboard = ({data,state,polygon})=>{    

    return (
      <>
           <div style={{zIndex:1000,cursor:"pointer",position:"absolute",backgroundColor:"#fff",bottom:10,right:10,border:"1px solid #5e5ef4",borderRadius:"10px",boxShadow:"1px 1px 10px #b9b9b9"}}>                    
          </div>
          {state&&<DataContext 
                dataset={data} > 
              <TemporalView datasetpolygon={polygon}/>
              <ChartView datasetpolygon={polygon}/>
              <BarchartAmenitiesView/></DataContext>}
      </>
    );
}
export default Dashboard;