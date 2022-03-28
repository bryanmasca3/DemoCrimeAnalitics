import React,{useState,useEffect} from 'react';
import {StaticMap, MapContext,Marker} from 'react-map-gl';
import './../App.css';
import DeckGL from 'deck.gl';
import 'rc-slider/assets/index.css';
import {MAPBOX_TOKEN,MAP_STYLE,MAP_STYLE1}from "./../constants/variables";
import Slider from 'rc-slider';
import {IconLayer,ColumnLayer,LineLayer,PolygonLayer} from '@deck.gl/layers';
//import {columnLayerCustom} from "./columnLayer";
//import {lineLayerCustom} from "./lineLayer";
import Dashboard from "./../dc/dashboard";
import {useDispatch} from 'react-redux';
import Swal from "sweetalert2";
import axios from 'axios';
import {useSelector} from 'react-redux';
import {setAmenityDataG,setPointData,selectPointData,selectAmenityData,selectmaxPolygonAmount,selectmaxNodeAmount} from "./../redux/slice/Data";
import {COLOR_ICON_AMENITY,AMENITY_CATEGORIES}from "./globals"


const AppLayer=()=> {     
  const dispatch = useDispatch();
  
  //const dif=0.00002
  const dif=0

  const [selectionMarked, setselectionMarked] = useState(0);

  const [selectionMap, setselectionMap] = useState(0);

  const [selectionFilterPoint, setselectionFilterPoint] = useState(1);  
  const [selectionFilterLine, setselectionFilterLine] = useState(1);

  const [selectionFilterBuild, setselectionFilterBuild] = useState(0);
  const [selectionFilterAmenity, setselectionFilterAmenity] = useState(0);

  const [selectionFilterPolygon, setselectionFilterPolygon] = useState(0);

  const [valueSlider, setvalueSlider] = useState(50);

  const [pointsubmenu, setpointsubmenu] = useState(0);
  const [cubesubmenu, setcubesubmenu] = useState(0);

  const PointData = useSelector(selectPointData);
  const AmenityData=useSelector(selectAmenityData);
 // const PolygonData = useSelector(selectPrePolygonData);
  const maxPolygonAmount = useSelector(selectmaxPolygonAmount);
  const maxNodeAmount = useSelector(selectmaxNodeAmount);
  
  const valueP=50;
  let stateCircle=0;
  const [polygonMarker, setpolygonMarker] = useState([]);

  const [viewState, setViewState] = useState({
    longitude: /*-87.68393218513461-46.66708952168912*/-73.977857,
    latitude: /*41.83339250270142-23.558393625659015*/40.731603,
    zoom: /*10*/15,
    bearing: 0
  });
  //const [slider, setslider] = useState(255);
 // console.log(datasa)
  //const [dataTest, setdataTest] = useState([]);
  //const [alldata, setalldata] = useState([]);

  const [dataEdge, setdataEdge] = useState([]);
  const [dataPolygon, setdataPolygon] = useState([]);
 // const [dataAmenity, setdataAmenity] = useState([]);
  const [dataBuild, setdataBuild] = useState([]);

  const [countAllCrimes, setcountAllCrimes] = useState(0);
  const ICON_MAPPING = {
    restaurant: {x: 0, y: 0, width: 128, height: 128, mask: true},
    fast_food: {x: 128, y: 0, width: 128, height: 128, mask: true},
    bicycle_parking: {x: 256, y: 0, width: 128, height: 128, mask: true},
    bar: {x: 384, y: 0, width: 128, height: 128, mask: true},
    other: {x: 512, y: 0, width: 128, height: 128, mask: true},
  };
  const [selectPolygon, setselectPolygon] = useState([]);
const colors=[[255,255,255,255],[251,255,210,255],[254,244,186,255],[255,238,164,255],[255,224,138,255],[252,218,123,255],[253,200,86,255],[251,120,74,255],[255,93,60,255],[255,63,63,255],[252,44,44,255]]
const colorsrgba=["#f8f8f8","#fbffd2","#fef4ba","#ffeea4","#ffe08a","#fcda7b","#fdc856","#fb784a","#ff5d3c","#ff3f3f","#fc2c2c"]

const transformCoordinates=(coordinates)=>{

  let arrayData=[]
  let arrayDataFinal=[]



  let x1=0
  let y1=0

  let x2=0
  let y2=0

  let Xmid=0
  let Ymid=0

  let newX=0
  let newY=0
  for (let i = 0; i < coordinates.length-1; i++) {
    x1=coordinates[i][0]
    y1=coordinates[i][1]

    x2=coordinates[i+1][0]
    y2=coordinates[i+1][1]

    Xmid=parseFloat(((x1+x2)/2).toFixed(7))
    Ymid=parseFloat(((y1+y2)/2).toFixed(7))    

    newX=parseFloat((x2<Xmid?x2+dif:x2-dif).toFixed(7))
    newY=parseFloat((y2<Ymid?y2+dif:y2-dif).toFixed(7))

    arrayData.push([newX,newY])
 }
 arrayData.unshift(arrayData[arrayData.length-1])
 arrayDataFinal.push(arrayData)
  
 return arrayDataFinal
}
const layers=[
  selectionFilterPoint?new ColumnLayer({
    id: 'column-layer',
    data: PointData,
    diskResolution: 5,
    radius: 3,
    extruded: true,
    pickable: true,
    elevationScale: selectionFilterPoint===1?0:3,
    getPosition: d => d.key,      
    getFillColor: d => colors[parseInt((d.value*(colors.length-1))/maxNodeAmount)],     
    getElevation: d => selectionFilterPoint===1?1:d.value,
  }):null,  
    selectionFilterBuild?new PolygonLayer({
      id: 'polygon-layer',
     /* data:dataPolygon.filter(item => {const resul=PrePolygonData?.find( dat => dat.key === item.osmid );
                                                        item["value"]=resul?.value;
                                                        return resul}),*/
      data:dataBuild,                                           
      pickable: true,   
      filled: true,
      wireframe: true,
      lineWidthMinPixels: 1,
      extruded:true,      
      elevationScale: 5,
      getPolygon: d => transformCoordinates(d.location.coordinates[0]),       
      getElevation: d => 5,
      getFillColor: d => [0,255,0,100], 
      getLineColor: [255, 255, 255]      
    }):null,
 /* selectionFilterAmenity?new ColumnLayer({
    id: 'column-layer',
    data: AmenityData,
    diskResolution: 5,
    radius: 3,
    extruded: true,
    pickable: true,
    elevationScale: 1,
    getPosition: d => d.location.coordinates,      
    getFillColor: d => [0,0,0,255],     
    getElevation: d => 1,
  }):null,*/
  selectionFilterAmenity?new IconLayer({
    id: 'icon-layer',
    data:AmenityData,
    pickable: false,
    // iconAtlas and iconMapping are required
    // getIcon: return a string
    //iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
    iconAtlas: 'https://raw.githubusercontent.com/bryanmasca3/DemoCrimeAnalitics/master/public/img/icons.png',
    /*iconAtlas: d=>{
      console.log(d)
      const idx=AmenitiesIcon.findIndex(item=>item.type===d.Amenity)!=-1     
      console.log(idx) 
      if(idx!==-1){
       return AmenitiesIcon[idx].url        
      }else{
        return AmenitiesIcon[0].url
      }
    },*/ 
    iconMapping: ICON_MAPPING,    
    getIcon: d => ICON_MAPPING[d.Amenity]?d.Amenity:'other',
    sizeScale: 5,
    getPosition: d => d.location.coordinates,
    getSize: d => 4,
    getColor: d => {
      const idx=AMENITY_CATEGORIES.findIndex(item=>item===d.Amenity)
      if(idx!==-1){
        return COLOR_ICON_AMENITY[idx]
      }else{
        return COLOR_ICON_AMENITY[idx+1]
      }
    }
  }):null,
    selectionFilterPolygon?new PolygonLayer({
      id: 'polygon-layer',
     /* data:dataPolygon.filter(item => {const resul=PrePolygonData?.find( dat => dat.key === item.osmid );
                                                        item["value"]=resul?.value;
                                                        return resul}),*/
      data:dataPolygon,                                           
      pickable: true,   
      filled: true,
      wireframe: true,
      lineWidthMinPixels: 1,
      extruded:true,      
      elevationScale: selectionFilterPolygon===1?0:10,
      getPolygon: d => transformCoordinates(d.location.coordinates[0]),   
      onClick: (info) => {
        if(selectionFilterAmenity||selectionFilterBuild){
          Swal.fire({
            position: "center",
            type: "warning",
            text: "Primero desactiva la opción Amenity o Build",
            showConfirmButton: false,
            timer: 1500,
          });
        }else{
          info.object.selected=info.object?.selected?false:true   
          if(info.object.selected){
            setselectPolygon([...selectPolygon,info.object])
          }else{
            setselectPolygon(selectPolygon.filter((item)=>item.osmid!=info.object.osmid))          
          }
        }
       },
      getElevation: d => Math.floor(Math.random() * (10) ),
      updateTriggers: {
        getFillColor: [selectPolygon,valueSlider]
      },
      getFillColor: d =>   d.selected ? [100, 105, 155,valueSlider] :  [100, 105, 155], //    
      getLineColor: [255, 255, 255]      
    }):null,
    selectionFilterLine?new LineLayer({
      id: 'line-layer',
      data: dataEdge,
      pickable: true,
      getWidth: 1,
      getSourcePosition: d => d.location.coordinates[0],
      getTargetPosition: d => d.location.coordinates[1],
      getColor: d =>  [207, 153, 81]
    }):null
  ];



 

  const hanlderAmenities=async()=>{
     
   if(selectPolygon.length){
    const multipolygon={
      geometry:{
        type : "MultiPolygon",
        coordinates : 
          selectPolygon.map((item)=>{            
            let aa=item.location.coordinates[0].map((item)=>item)
            aa.push(aa[0])
            return [aa]
          })    
      }
    } 
   const res = await axios.post('http://localhost:4000/api/data/Amenities', multipolygon);
    console.log(res.data.Amenity)
    dispatch(setAmenityDataG(res.data.Amenity));
    setselectionFilterAmenity(1);
   }else{
    Swal.fire({
      position: "center",
      type: 'info',
      text: "No hay Blocks seleccionados",
      showConfirmButton: false,
      timer: 1500
    })
   }
  }

  const hanndleBuild=async()=>{
    if(selectPolygon.length){
      const multipolygon={
        geometry:{
          type : "MultiPolygon",
          coordinates : 
            selectPolygon.map((item)=>{            
              let aa=item.location.coordinates[0].map((item)=>item)
              aa.push(aa[0])
              return [aa]
            })          
        }
      } 
     const res = await axios.post('http://localhost:4000/api/data/Builds', multipolygon);
    setdataBuild(res.data.Builds)
    setselectionFilterBuild(1);
    }else{
      Swal.fire({
        position: "center",
        type: 'info',
        text: "No hay Blocks seleccionados",
        showConfirmButton: false,
        timer: 1500
      })
    }
   
  }
  const handlerPolygon=async(event)=>{
                        
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

    dispatch(setPointData(res.data.Node));       

    setdataEdge(res.data.Edge);
    setdataPolygon(res.data.Block);
    setcountAllCrimes(res.data.count);

    setselectionMarked(0);  
    setpolygonMarker([])

    event.stopPropagation();
    
  }

const SubmenuPoint=()=>{    
  console.log(PointData)
    return(
      <div style={{top:10,left:50,zIndex:1,backgroundColor:"#fff",border:"1px solid #5e5ef4",borderRadius:"10px",position:"absolute"}}>
          <div style={{display:'flex',flexDirection:"row"}}>
            <div onClick={()=>selectionFilterPoint===1?setselectionFilterPoint(0):setselectionFilterPoint(1)} className={`icons__footer color__marked ${selectionFilterPoint===1?"color__marked-selected":""}`}> <i class={`"uil uil-elipsis-double-v-alt ${selectionFilterPoint===1?"color__marked__icon-selected":""}`}></i></div>                            
            <div onClick={()=>selectionFilterPoint===2?setselectionFilterPoint(0):setselectionFilterPoint(2)}  className={`icons__footer color__marked  ${selectionFilterPoint===2?"color__marked-selected":""}`}><i class={`uil uil-graph-bar ${selectionFilterPoint===2?"color__marked__icon-selected":""}`}></i></div>                 
        </div>
      </div>      
    )
}
const LocalValue=()=>Array.from(Array(10).keys()).map((el)=>
  <div className="color-bars">{(el*(maxNodeAmount)/11).toFixed(2)} -</div>
).reverse()

const GlobalValue=()=>Array.from(Array(10).keys()).map((el)=>
  <div className="color-bars">{(el*(countAllCrimes)/11).toFixed(2)} -</div>
).reverse()
const handleResetSelectCube=()=>{
  try {
  Swal.fire({
    title: "¿Deseas eliminar la selección?",
    confirmButtonText: "Aceptar",
    showCancelButton: true,
    text:"Esto eliminará los Blocks seleccionados, Amenities y Buildings."
  }).then(async (result) => {
    if (result.value) {
      console.log("que pasoooooooooooo")
      console.log(result.isConfirmed) 
      setselectPolygon([]);
      setdataPolygon(dataPolygon.map(({ selected, ...item })=>item));
      setdataBuild([]);
      dispatch(setAmenityDataG([])); 
      setselectionFilterBuild(0);
      setselectionFilterAmenity(0);
        
    }
  });
  } catch (e) {   
    Swal.fire({
      position: "center",
      type: "error",
      title: "Error al Eliminar",
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
const handleMenuCube=()=>{
  setselectionFilterPolygon(0)
  setcubesubmenu(0)
}
const SubmenuCube=()=>{
  
  return(
    <div style={{top:80,left:50,zIndex:1,backgroundColor:"#fff",border:"1px solid #5e5ef4",borderRadius:"10px",position:"absolute"}}>
        <div style={{display:'flex',flexDirection:"row"}}>             
          <div onClick={()=>selectionFilterPolygon===1?handleMenuCube():setselectionFilterPolygon(1)} className={`icons__footer color__marked  ${selectionFilterPolygon===1?"color__marked-selected":""}`}><i class={`"uil uil-square-full  ${selectionFilterPolygon===1?"color__marked__icon-selected":""}`}></i> </div> 
          <div onClick={()=>selectionFilterPolygon===2?handleMenuCube():setselectionFilterPolygon(2)} className={`icons__footer color__marked  ${selectionFilterPolygon===2?"color__marked-selected":""}`}> <i class={`"uil uil-cube ${selectionFilterPolygon===2?"color__marked__icon-selected":""}`}></i>   </div>                                      
          <div onClick={()=>selectPolygon.length?handleResetSelectCube():null} className={`icons__footer color__marked `}> <i class={`uil-trash`}></i></div>                                      
      </div>
    </div>      
  )
}
const handleRemoveAll=()=>{
        
    //console.log("TRASH")               
     dispatch(setPointData([]));
     setdataEdge([]);  
     setdataPolygon([]); 
     setdataBuild([]); 
     dispatch(setAmenityDataG([])); 
  
}
  const handleClick = async({ coordinate }) => {

    switch(selectionMarked) {
      /* case 1:
         {
             const res = await axios.get('http://localhost:4000/api/data/all/');              
             //dispatch(setDataFilterd(res.data.Node)); 
             setalldata(res.data.Node);
             setdataEdge(res.data.Edge); 
             setdataPolygon(res.data.Block);               
             setselectionMarked(0);                
         break;}*/
       case 2:
         {               
         /*  if(!stateCircle){
            stateCircle=!stateCircle;
           }else{
              const coordinateXY={
                lng:coordinate[0],
                lat:coordinate[1],
                radius:3     
            };       
            const res = await axios.post('http://localhost:4000/api/data/circle/', coordinateXY);
            stateCircle=!stateCircle;
            
            setalldata(res.data.Node);
            setdataEdge(res.data.Edge);   
            setdataPolygon(res.data.Block)
            
            setselectionMarked(0);   
           }
                        
         break;*/
         break;
        }
       case 3:
         {      
           if (coordinate){        
            const coordinateXY={
              longitude:coordinate[0],
              latitude:coordinate[1]      
            };                  
            setpolygonMarker([...polygonMarker,coordinateXY]);      
           }           
                
         break;}      
       default:
         {       
           break;}        
     } 
   
   };
  return ( <>
      <DeckGL
        initialViewState= { viewState }
        //onViewStateChange={e => setViewState(e.viewState)}
        controller={true}
        layers={layers}
        ContextProvider={MapContext.Provider}        
        onClick={handleClick}
        >  
         <StaticMap  mapStyle={!selectionMap?MAP_STYLE:MAP_STYLE1} mapboxApiAccessToken={MAPBOX_TOKEN} />  
         {polygonMarker?.map((item)=>{
            return <Marker latitude={item?.latitude} longitude={item?.longitude} onClick={handlerPolygon}>
              <i class="uil uil-square-full color__marked"></i>
            </Marker>}
          )}                     
      </DeckGL>
         
      <div style={{backgroundColor:"red"}}>
          <div style={{zIndex:1000,cursor:"pointer",position:"absolute",backgroundColor:"#fff",top:200,left:10,border:"1px solid #5e5ef4",borderRadius:"10px",boxShadow:"1px 1px 10px #b9b9b9"}}>
          <div style={{display:'flex',flexDirection:"column"}}>                                
                <div  onClick={()=>selectionMap===1?setselectionMap(0):setselectionMap(1)} className={`icons__footer color__marked ${selectionMap===1?"color__marked-selected":""}`}><i class={`uil uil-image ${selectionMap===1?"color__marked__icon-selected":""}`}></i></div>       
                <div  onClick={()=>selectionMap===0?setselectionMap(1):setselectionMap(0)} className={`icons__footer color__marked ${selectionMap===0?"color__marked-selected":""}`}><i class={`uil uil-image-times ${selectionMap===0?"color__marked__icon-selected":""}`}></i></div>                 
            </div>   
          </div>                 
          <div style={{zIndex:1000,cursor:"pointer",position:"absolute",backgroundColor:"#fff",bottom:10,right:10,border:"1px solid #5e5ef4",borderRadius:"10px",boxShadow:"1px 1px 10px #b9b9b9"}}>
            <div style={{display:'flex',flexDirection:"column"}}>                                
               {/* <div onClick={()=>selectionMarked===1?setselectionMarked(0):setselectionMarked(1)} className={`icons__footer color__marked ${selectionMarked===1?"color__marked-selected":""}`}><i class={`uil uil-map ${selectionMarked===1?"color__marked__icon-selected":""}`}></i></div>       */}
                <div onClick={()=>selectionMarked===2?setselectionMarked(0):setselectionMarked(2)} className={`icons__footer color__marked ${selectionMarked===2?"color__marked-selected":""}`}><i class={`uil uil-circle ${selectionMarked===2?"color__marked__icon-selected":""}`}></i></div>
                <div onClick={()=>selectionMarked===3?setselectionMarked(0):setselectionMarked(3)} className={`icons__footer color__marked ${selectionMarked===3?"color__marked-selected":""}`}><i class={`uil uil-polygon ${selectionMarked===3?"color__marked__icon-selected":""}`}></i></div>                                                               
                <div onClick={()=>selectionMarked===4?setselectionMarked(0):setselectionMarked(4)} className={`icons__footer color__marked ${selectionMarked===4?"color__marked-selected":""}`}><i class={`uil uil-trash-alt ${selectionMarked===4?"color__marked__icon-selected":""}`}></i></div>       
            </div>       
        </div>  
        {maxNodeAmount? <div style={{zIndex:1000,cursor:"pointer",position:"absolute",backgroundColor:"#fff",top:300,left:10,boxShadow:"1px 1px 10px #b9b9b9",fontSize:"0.65rem",padding:"10px 5px"}}>
          <div style={{display:'flex',justifyContent:"space-around",fontWeight:"600",padding:"2px 0px"}}>
            <div className="color-bars">Global</div>                            
            <div className="color-bars">Local </div>  
          </div>
          <div style={{display:'flex',gap:'0.2rem'}}>
            <div style={{display:'flex',flexDirection:"column",justifyContent:"space-between"}}>   
              <div className="color-bars">{`${countAllCrimes}.00`} -</div>                                         
                {<GlobalValue/>}              
            </div>
            <div style={{display:'flex',flexDirection:"column",justifyContent:"flex-end"}}>                
                <div  className="color-bars" 
                style={{ height:`${(maxNodeAmount*100)/countAllCrimes}%`,backgroundImage: "linear-gradient(0deg, rgba(248,248,248,1) 0%, rgba(254,244,186,1) 19%, rgba(255,224,138,1) 37%, rgba(253,200,86,1) 57%, rgba(255,93,60,1) 80%, rgba(252,44,44,1) 100%)",
                color: "darkred"}}
                //style={{height:"100%",                
                //backgroundColor:"linear-gradient(90deg, rgba(248,248,248,1) 0%, rgba(254,244,186,1) 19%, rgba(255,224,138,1) 37%, rgba(253,200,86,1) 57%, rgba(255,93,60,1) 80%, rgba(252,44,44,1) 100%)"}}
                ></div>                                                                                                             
            </div>     
            <div style={{display:'flex',flexDirection:"column",justifyContent:"space-between"}}>   
                <div className="color-bars">{`${maxNodeAmount}.00`} </div>
                {<LocalValue/>}                           
            </div>
            <div style={{display:'flex',flexDirection:"column" ,justifyContent:"space-between"}}>                
                <div className="color-bars" style={{"background-color":colorsrgba[10]}}></div>                            
                <div className="color-bars" style={{"background-color":colorsrgba[9]}}></div>                            
                <div className="color-bars" style={{"background-color":colorsrgba[8]}}></div>     
                <div className="color-bars" style={{"background-color":colorsrgba[7]}}></div>                            
                <div className="color-bars" style={{"background-color":colorsrgba[6]}}></div>                            
                <div className="color-bars" style={{"background-color":colorsrgba[5]}}></div>   
                <div className="color-bars" style={{"background-color":colorsrgba[4]}}></div>                            
                <div className="color-bars" style={{"background-color":colorsrgba[3]}}></div>                            
                <div className="color-bars" style={{"background-color":colorsrgba[2]}}></div>   
                <div className="color-bars" style={{"background-color":colorsrgba[1]}}></div>                            
                <div className="color-bars" style={{"background-color":colorsrgba[0]}}></div>                                                                   
            </div>    
          </div>           
        </div> :null}
       
        <div style={{zIndex:1000,cursor:"pointer",position:"absolute",backgroundColor:"#fff",top:10,left:120,border:"1px solid #5e5ef4",borderRadius:"10px",boxShadow:"1px 1px 10px #b9b9b9"}}>
              
            {selectionFilterPolygon&&selectPolygon.length?
            <div style={{width:"100px",padding:"5px 10px"}}>
              <Slider
                onChange={(nextValues) => {
                  console.log('Change:', nextValues);
                  setvalueSlider(nextValues);
                }}
                value={valueSlider}

                min={0}
                max={255}
                step={17}
              /><p style={{fontSize:"0.7rem", margin:"0"}}>{selectPolygon.length+" bl. seleccionados"}</p></div>:null}
                  

        </div> 
        <div style={{zIndex:1000,cursor:"pointer",position:"absolute",backgroundColor:"#fff",top:10,left:10,border:"1px solid #5e5ef4",borderRadius:"10px",boxShadow:"1px 1px 10px #b9b9b9"}}>
            <div style={{display:'flex',flexDirection:"column"}}>  
              
            <div onClick={()=>pointsubmenu?setpointsubmenu(0):setpointsubmenu(1)} className={`icons__footer color__marked ${selectionFilterPoint?"color__marked-selected":""}`}><i className={`uil uil-map-pin ${selectionFilterPoint?"color__marked__icon-selected":""}`}></i></div>                            
            <div onClick={()=>selectionFilterLine?setselectionFilterLine(0):setselectionFilterLine(1)} className={`icons__footer color__marked ${selectionFilterLine?"color__marked-selected":""}`}><i className={`uil uil uil-line-alt ${selectionFilterLine?"color__marked__icon-selected":""}`}></i></div>                            
            <div onClick={()=>cubesubmenu?setcubesubmenu(0):setcubesubmenu(1)} className={`icons__footer color__marked ${selectionFilterPolygon?"color__marked-selected":""}`}><i className={`uil uil-square-full ${selectionFilterPolygon?"color__marked__icon-selected":""}`}></i></div>                 
            <div onClick={()=>selectionFilterBuild?setselectionFilterBuild(0):hanndleBuild()} className={`icons__footer color__marked ${selectionFilterBuild?"color__marked-selected":""}`}><i className={`uil uil-building ${selectionFilterBuild?"color__marked__icon-selected":""}`}></i></div>                 
            <div onClick={()=>selectionFilterAmenity?setselectionFilterAmenity(0):hanlderAmenities()} className={`icons__footer color__marked ${selectionFilterAmenity?"color__marked-selected":""}`}><i className={`uil uil-location-arrow-alt ${selectionFilterAmenity?"color__marked__icon-selected":""}`}></i></div>                 
               { /*  
                <div onClick={()=>selectionFilterPoint?setselectionFilterPoint(0):setselectionFilterPoint(1)} className={`icons__footer color__marked ${selectionFilterPoint?"color__marked-selected":""}`}><i class={`uil uil-map-pin ${selectionFilterPoint?"color__marked__icon-selected":""}`}></i></div>                            
                <div onClick={()=>selectionFilterLine?setselectionFilterLine(0):setselectionFilterLine(1)} className={`icons__footer color__marked ${selectionFilterLine?"color__marked-selected":""}`}><i class={`uil uil uil-line-alt ${selectionFilterLine?"color__marked__icon-selected":""}`}></i></div>                            
               
               <div onClick={()=>selectionFilterPolygon?setselectionFilterPolygon(0):setselectionFilterPolygon(1)} className={`icons__footer color__marked ${selectionFilterPolygon?"color__marked-selected":""}`}><i class={`uil uil-square-full ${selectionFilterPolygon?"color__marked__icon-selected":""}`}></i></div>  */    }                  
            </div>       

        </div> 
        {pointsubmenu?<SubmenuPoint/>:null}
        {cubesubmenu?<SubmenuCube/>:null}          
          </div>
      <Dashboard 
          data={PointData} 
          dataAmenities={AmenityData}
          polygon={dataPolygon} 
          state={PointData.length}
          stateAmenities={AmenityData.length}/>           
          </>)
}
export default AppLayer;
