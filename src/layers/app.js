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

const colors=[[255,255,255,255],[136,209,164,255],[171,221,164,255],[230,245,152,255],[255,255,191,255],[255,255,191,255],[254,224,139,255],[253,174,97,255],[244,109,67,255],[244,76,67,255],[246,56,56,255],[128,0,38,255]]

  const layers = [
    new PolygonLayer({
      id: 'polygon-layer',
      data:dataPolygon,
      pickable: true,
      stroked: true,
      filled: true,
      wireframe: true,
      lineWidthMinPixels: 1,
      getPolygon: d => d.location.coordinates,     
      getFillColor: d => colors[Math.floor(Math.random() * (255 + 1) ),Math.floor(Math.random() * (255 + 1) ),Math.floor(Math.random() * (255 + 1) )],
      getLineColor: [179, 255, 0],
      getLineWidth: 1
    }),
    new LineLayer({
      id: 'line-layer',
      data: dataEdge,
      pickable: true,
      getWidth: 1,
      getSourcePosition: d => d.location.coordinates[0],
      getTargetPosition: d => d.location.coordinates[1],
      getColor: d =>  [207, 153, 81]//DEBIAR CAMBIAR EL COLOR
    }),
    new ColumnLayer({
      id: 'column-layer',
      data: DataSetFiltered,
      diskResolution: 10,
      radius: 15,
      extruded: true,
      pickable: true,
      elevationScale: 0,
      getPosition: d => d.location.coordinates,
      getFillColor: d => colors[Math.floor(Math.random() * (11 + 1) )],//DEBIAR CAMBIAR EL COLOR      
      getElevation: d => 1
    })
    
   /* new GeoJsonLayer({
      id: 'geojson-layer',
      data:datasa,
      pickable: true,
      stroked: false,
      filled: true,      
      pointType: 'circle',
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getFillColor: [0, 0, 205, 200],
      getLineColor: d => [179, 255, 0],
      getPointRadius: 100,
      getLineWidth: 1,
      getElevation: 30
    })*/
   
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
       // onViewStateChange={e => setViewState(e.viewState)}
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
        <div style={{zIndex:1000,cursor:"pointer",position:"absolute",backgroundColor:"#fff",top:10,left:10,border:"1px solid #5e5ef4",borderRadius:"10px",boxShadow:"1px 1px 10px #b9b9b9"}}>
            <div style={{display:'flex',flexDirection:"column"}}>                
                <div onClick={()=>selectionMarked===1?setselectionMarked(0):setselectionMarked(1)} className={`icons__footer color__marked ${selectionMarked===1?"color__marked-selected":""}`}><i class={`uil uil-square-full ${selectionMarked===1?"color__marked__icon-selected":""}`}></i></div>                            
                <div onClick={()=>selectionMarked===1?setselectionMarked(0):setselectionMarked(1)} className={`icons__footer color__marked ${selectionMarked===1?"color__marked-selected":""}`}><i class={`uil uil uil-line-alt ${selectionMarked===1?"color__marked__icon-selected":""}`}></i></div>                            
                <div onClick={()=>selectionMarked===1?setselectionMarked(0):setselectionMarked(1)} className={`icons__footer color__marked ${selectionMarked===1?"color__marked-selected":""}`}><i class={`uil uil-map-pin ${selectionMarked===1?"color__marked__icon-selected":""}`}></i></div>                            
            </div>       
        </div> 
        {polygonMarker.map((item)=>
            <Marker latitude={item.latitude} longitude={item.longitude} onClick={handlerPolygon}>
              <i class="uil uil-square-full color__marked"></i>
            </Marker>
          )}                                
      </DeckGL>
      <Dashboard data={DataSetFiltered} state={DataSetFiltered.length}/> </div>)
}
export default AppLayer;
