import React,{useState,useEffect} from 'react';
import {StaticMap, MapContext, NavigationControl,Marker} from 'react-map-gl';
import './../App.css';
import DeckGL from 'deck.gl';
import {MAPBOX_TOKEN,MAP_STYLE}from "./../constants/variables";
import {NAV_CONTROL_STYLE} from "./../utils/control";
import {ColumnLayer,LineLayer,GeoJsonLayer,PolygonLayer} from '@deck.gl/layers';
//import {columnLayerCustom} from "./columnLayer";
//import {lineLayerCustom} from "./lineLayer";
import Dashboard from "./../dc/dashboard";

import axios from 'axios';
import {useSelector,useDispatch} from 'react-redux';
import {selectDataFiltered,setDataFilterd} from "./../redux/slice/Data";



const AppLayer=()=> {     
  const [selectionMarked, setselectionMarked] = useState(0);

  const [selectionFilterPoint, setselectionFilterPoint] = useState(1);  
  const [selectionFilterLine, setselectionFilterLine] = useState(1);
  const [selectionFilterPolygon, setselectionFilterPolygon] = useState(0);


  const [pointsubmenu, setpointsubmenu] = useState(0);
  const [cubesubmenu, setcubesubmenu] = useState(0);

  const DataSetFiltered = useSelector(selectDataFiltered);
  const dispatch = useDispatch();
  let stateCircle=0;
  const [polygonMarker, setpolygonMarker] = useState([]);

  const [viewState, setViewState] = useState({
    longitude: -87.68393218513461/* -46.66708952168912*/,
    latitude: 41.83339250270142/*-23.558393625659015*/,
    zoom: 10,
    bearing: 0
  });
 // console.log(datasa)
  //const [dataTest, setdataTest] = useState([]);
  const [dataEdge, setdataEdge] = useState([]);
  const [dataPolygon, setdataPolygon] = useState([]);

const colors=[[255,255,255,255],[251,255,210,255],[254,244,186,255],[255,238,164,255],[255,224,138,255],[252,218,123,255],[253,200,86,255],[251,120,74,255],[255,93,60,255],[255,63,63,255],[252,44,44,255]]
const colorsrgba=["#fff","#fbffd2","#fef4ba","#ffeea4","#ffe08a","#fcda7b","#fdc856","#fb784a","#ff5d3c","#ff3f3f","#fc2c2c"]

  const layers = [
    selectionFilterPolygon?new PolygonLayer({
      id: 'polygon-layer',
      data:dataPolygon,
      pickable: true,   
      filled: true,
      wireframe: true,
      lineWidthMinPixels: 1,
      extruded:true,
      elevationScale: selectionFilterPolygon==1?0:1,
      getPolygon: d => d.location.coordinates,     
      getElevation: d => selectionFilterPolygon==1?1:Math.floor(Math.random() * (100) ),
      getFillColor: d => colors[Math.floor(Math.random() * (10) )],
      getLineColor: [255, 255, 255]      
    }):null,
    selectionFilterLine?new LineLayer({
      id: 'line-layer',
      data: dataEdge,
      pickable: true,
      getWidth: 1,
      getSourcePosition: d => d.location.coordinates[0],
      getTargetPosition: d => d.location.coordinates[1],
      getColor: d =>  [207, 153, 81]//DEBIAR CAMBIAR EL COLOR
    }):null,
    selectionFilterPoint?new ColumnLayer({
      id: 'column-layer',
      data: DataSetFiltered,
      diskResolution: 5,
      radius: 6,
      extruded: true,
      pickable: true,
      elevationScale: selectionFilterPoint==1?0:1,
      getPosition: d => d.location.coordinates,      
      getFillColor: d => colors[Math.floor(Math.random() * (11 + 1) )],     
      getElevation: d => selectionFilterPoint==1?1:Math.floor(Math.random() * (100) ),
    }):null
    

   
  ];
  const  handlerPolygon=async(event)=>{
  
    polygonMarker.shift()                              
    polygonMarker.push(polygonMarker[0])
    const polygon={
      geometry:{
        type : "Polygon",
        coordinates : [
          polygonMarker.map((item)=>[item.longitude,item.latitude])
      ],
      crs: {
        type: "name",
        properties: { name: "urn:x-mongodb:crs:strictwinding:EPSG:4326" }
     }
      }
    }
    const res = await axios.post('http://localhost:4000/api/data/polygon', polygon);

    dispatch(setDataFilterd(res.data.Node))              
    setselectionMarked(0);
    setdataEdge(res.data.Edge);
    setdataPolygon(res.data.Block)
   // console.log(res.data)
    setpolygonMarker([])
    event.stopPropagation();
    
  }

const SubmenuPoint=()=>{    
    return(
      <div style={{top:10,left:50,zIndex:1,backgroundColor:"#fff",border:"1px solid #5e5ef4",borderRadius:"10px",position:"absolute"}}>
          <div style={{display:'flex',flexDirection:"row"}}>
            <div onClick={()=>selectionFilterPoint===1?setselectionFilterPoint(0):setselectionFilterPoint(1)} className={`icons__footer color__marked ${selectionFilterPoint===1?"color__marked-selected":""}`}> <i class={`"uil uil-elipsis-double-v-alt ${selectionFilterPoint===1?"color__marked__icon-selected":""}`}></i></div>                            
            <div onClick={()=>selectionFilterPoint===2?setselectionFilterPoint(0):setselectionFilterPoint(2)}  className={`icons__footer color__marked  ${selectionFilterPoint===2?"color__marked-selected":""}`}><i class={`uil uil-graph-bar ${selectionFilterPoint===2?"color__marked__icon-selected":""}`}></i></div>     
            {/*<div onClick={()=>selectionFilterPoint?setselectionFilterPoint(0):setselectionFilterPoint(1)} className={`icons__footer color__marked ${selectionFilterPoint?"color__marked-selected":""}`}><i class={`uil uil-map-pin ${selectionFilterPoint?"color__marked__icon-selected":""}`}></i></div>*/}                                                  
        </div>
      </div>      
    )
}
const SubmenuCube=()=>{
  
  return(
    <div style={{top:80,left:50,zIndex:1,backgroundColor:"#fff",border:"1px solid #5e5ef4",borderRadius:"10px",position:"absolute"}}>
        <div style={{display:'flex',flexDirection:"row"}}>             
          <div onClick={()=>selectionFilterPolygon===1?setselectionFilterPolygon(0):setselectionFilterPolygon(1)} className={`icons__footer color__marked  ${selectionFilterPolygon===1?"color__marked-selected":""}`}><i class={`"uil uil-square-full  ${selectionFilterPolygon===1?"color__marked__icon-selected":""}`}></i> </div> 
          <div onClick={()=>selectionFilterPolygon===2?setselectionFilterPolygon(0):setselectionFilterPolygon(2)} className={`icons__footer color__marked  ${selectionFilterPolygon===2?"color__marked-selected":""}`}> <i class={`"uil uil-cube ${selectionFilterPolygon===2?"color__marked__icon-selected":""}`}></i>   </div>                                      
      </div>
    </div>      
  )
}
  const handleClick = async({ coordinate }) => {
    switch(selectionMarked) {
       case 1:
         {
             const res = await axios.get('http://localhost:4000/api/data/all/');              
             dispatch(setDataFilterd(res.data.Node)); 
             setdataEdge(res.data.Edge); 
             setdataPolygon(res.data.Block)  
             setselectionMarked(0);                
         break;}
       case 2:
         {               
           if(!stateCircle){
            stateCircle=!stateCircle;
           }else{
              const coordinateXY={
                lng:coordinate[0],
                lat:coordinate[1],
                radius:3     
            };       
            const res = await axios.post('http://localhost:4000/api/data/circle/', coordinateXY);
            stateCircle=!stateCircle;
            dispatch(setDataFilterd(res.data.Node));
            setdataEdge(res.data.Edge);   
            setdataPolygon(res.data.Block)
            //console.log(res.data)
            setselectionMarked(0);   
           }
                        
         break;
        }
       case 3:
         {            
            const coordinateXY={
              longitude:coordinate[0],
              latitude:coordinate[1]      
            };                
            setpolygonMarker([...polygonMarker,coordinateXY]);      
                
         break;}
         case 4:
             {               
              dispatch(setDataFilterd([])) 
              setdataEdge([]);  
              setdataPolygon([]); 
             break;}
       default:
         {       
           break;}        
     } 
   
   };
  return ( <div>
      <DeckGL
        initialViewState= { viewState }
        //onViewStateChange={e => setViewState(e.viewState)}
        controller={true}
        layers={layers}
        ContextProvider={MapContext.Provider}        
        onClick={handleClick}
        >            
          <StaticMap  mapStyle={MAP_STYLE} mapboxApiAccessToken={MAPBOX_TOKEN} />          
          <div style={{zIndex:1000,cursor:"pointer",position:"absolute",backgroundColor:"#fff",bottom:10,right:10,border:"1px solid #5e5ef4",borderRadius:"10px",boxShadow:"1px 1px 10px #b9b9b9"}}>
            <div style={{display:'flex',flexDirection:"column"}}>                                
                <div onClick={()=>selectionMarked===1?setselectionMarked(0):setselectionMarked(1)} className={`icons__footer color__marked ${selectionMarked===1?"color__marked-selected":""}`}><i class={`uil uil-map ${selectionMarked===1?"color__marked__icon-selected":""}`}></i></div>       
                <div onClick={()=>selectionMarked===2?setselectionMarked(0):setselectionMarked(2)} className={`icons__footer color__marked ${selectionMarked===2?"color__marked-selected":""}`}><i class={`uil uil-circle ${selectionMarked===2?"color__marked__icon-selected":""}`}></i></div>
                <div onClick={()=>selectionMarked===3?setselectionMarked(0):setselectionMarked(3)} className={`icons__footer color__marked ${selectionMarked===3?"color__marked-selected":""}`}><i class={`uil uil-polygon ${selectionMarked===3?"color__marked__icon-selected":""}`}></i></div>                                                               
                <div onClick={()=>selectionMarked===4?setselectionMarked(0):setselectionMarked(4)} className={`icons__footer color__marked ${selectionMarked===4?"color__marked-selected":""}`}><i class={`uil uil-trash-alt ${selectionMarked===4?"color__marked__icon-selected":""}`}></i></div>       
            </div>       
        </div>  
        <div style={{zIndex:1000,cursor:"pointer",position:"absolute",backgroundColor:"#fff",top:280,left:10,boxShadow:"1px 1px 10px #b9b9b9"}}>
            <div style={{display:'flex',flexDirection:"column"}}>                
                <div className="color-bars" style={{"background-color":colorsrgba[0]}}></div>                            
                <div className="color-bars" style={{"background-color":colorsrgba[1]}}></div>                            
                <div className="color-bars" style={{"background-color":colorsrgba[2]}}></div>     
                <div className="color-bars" style={{"background-color":colorsrgba[3]}}></div>                            
                <div className="color-bars" style={{"background-color":colorsrgba[4]}}></div>                            
                <div className="color-bars" style={{"background-color":colorsrgba[5]}}></div>   
                <div className="color-bars" style={{"background-color":colorsrgba[6]}}></div>                            
                <div className="color-bars" style={{"background-color":colorsrgba[7]}}></div>                            
                <div className="color-bars" style={{"background-color":colorsrgba[8]}}></div>   
                <div className="color-bars" style={{"background-color":colorsrgba[9]}}></div>                            
                <div className="color-bars" style={{"background-color":colorsrgba[10]}}></div>                                                                   
            </div>       
        </div> 

        <div style={{zIndex:1000,cursor:"pointer",position:"absolute",backgroundColor:"#fff",top:10,left:10,border:"1px solid #5e5ef4",borderRadius:"10px",boxShadow:"1px 1px 10px #b9b9b9"}}>
            <div style={{display:'flex',flexDirection:"column"}}>  
              
            <div onClick={()=>pointsubmenu?setpointsubmenu(0):setpointsubmenu(1)} className={`icons__footer color__marked ${selectionFilterPoint?"color__marked-selected":""}`}><i className={`uil uil-map-pin ${selectionFilterPoint?"color__marked__icon-selected":""}`}></i></div>                            
            <div onClick={()=>selectionFilterLine?setselectionFilterLine(0):setselectionFilterLine(1)} className={`icons__footer color__marked ${selectionFilterLine?"color__marked-selected":""}`}><i className={`uil uil uil-line-alt ${selectionFilterLine?"color__marked__icon-selected":""}`}></i></div>                            
            <div onClick={()=>cubesubmenu?setcubesubmenu(0):setcubesubmenu(1)} className={`icons__footer color__marked ${selectionFilterPolygon?"color__marked-selected":""}`}><i className={`uil uil-square-full ${selectionFilterPolygon?"color__marked__icon-selected":""}`}></i></div>                 
               { /*  
                <div onClick={()=>selectionFilterPoint?setselectionFilterPoint(0):setselectionFilterPoint(1)} className={`icons__footer color__marked ${selectionFilterPoint?"color__marked-selected":""}`}><i class={`uil uil-map-pin ${selectionFilterPoint?"color__marked__icon-selected":""}`}></i></div>                            
                <div onClick={()=>selectionFilterLine?setselectionFilterLine(0):setselectionFilterLine(1)} className={`icons__footer color__marked ${selectionFilterLine?"color__marked-selected":""}`}><i class={`uil uil uil-line-alt ${selectionFilterLine?"color__marked__icon-selected":""}`}></i></div>                            
               
               <div onClick={()=>selectionFilterPolygon?setselectionFilterPolygon(0):setselectionFilterPolygon(1)} className={`icons__footer color__marked ${selectionFilterPolygon?"color__marked-selected":""}`}><i class={`uil uil-square-full ${selectionFilterPolygon?"color__marked__icon-selected":""}`}></i></div>  */    }                  
            </div>       

        </div> 
        {pointsubmenu?<SubmenuPoint/>:null}
        {cubesubmenu?<SubmenuCube/>:null}

        {polygonMarker.map((item)=>
            <Marker latitude={item.latitude} longitude={item.longitude} onClick={handlerPolygon}>
              <i class="uil uil-square-full color__marked"></i>
            </Marker>
          )}                                
      </DeckGL>
      <Dashboard data={DataSetFiltered} state={DataSetFiltered.length}/> </div>)
}
export default AppLayer;
