import React,{useState} from 'react';
import {StaticMap, MapContext, NavigationControl,Marker} from 'react-map-gl';
import './../App.css';
import DeckGL from 'deck.gl';
import {MAPBOX_TOKEN,MAP_STYLE}from "./../constants/variables";
import {NAV_CONTROL_STYLE} from "./../utils/control";
import {ColumnLayer,LineLayer} from '@deck.gl/layers';
//import {columnLayerCustom} from "./columnLayer";
//import {lineLayerCustom} from "./lineLayer";
import Dashboard from "./../dc/dashboard";
import axios from 'axios';
import {useSelector,useDispatch} from 'react-redux';
import {selectDataFiltered,setDataFilterd} from "./../redux/slice/Data";
const AppLayer=()=> {     
  const DataSetFiltered = useSelector(selectDataFiltered);
  const dispatch = useDispatch();

  const [selectorMarked, setselectorMarked] = useState(0);

  const [viewState, setViewState] = useState({
    longitude: /*-87.68393218513461*/ -46.66708952168912,
    latitude: /*41.83339250270142*/-23.558393625659015,
    zoom: 10,
    bearing: 0
  });

  //const [dataTest, setdataTest] = useState([]);
  const [dataEdge, setdataEdge] = useState([]);

  const layers = [
    new ColumnLayer({
      id: 'column-layer',
      data: DataSetFiltered,
      diskResolution: 10,
      radius: 15,
      extruded: true,
      pickable: true,
      elevationScale: 0,
      getPosition: d => d.location.coordinates,
      getFillColor: d => [0, 0, 0, 255],
      getLineColor: [0, 0, 0],
      getElevation: d => 1
    }),
    new LineLayer({
      id: 'line-layer',
      data:dataEdge,
      pickable: true,
      getWidth: 1,
      getSourcePosition: d => d.location.coordinates[0],
      getTargetPosition: d => d.location.coordinates[1],
      getColor: d =>  [207, 153, 81]
    })   
  ];
  const handleClick = async({ coordinate }) => {        
       /*       const coordinateXY={
                lng:-46.66708952168912,
                lat:-23.558393625659015,
                radius:3     
            };       
            const res = await axios.post('http://localhost:4000/api/data/circle/', coordinateXY);        
            dispatch(setDataFilterd(res.data.Node));    
            //setdataTest(res.data.Node);    
            setdataEdge(res.data.Edge);     */
            
            
  };
  return ( <div>
      <DeckGL
        initialViewState= { viewState }
       // onViewStateChange={e => setViewState(e.viewState)}
        controller={true}
        layers={layers}
        ContextProvider={MapContext.Provider}        
        onClick={handleClick}>            
          <StaticMap  mapStyle={MAP_STYLE} mapboxApiAccessToken={MAPBOX_TOKEN} />
          <NavigationControl style={NAV_CONTROL_STYLE} capturePointerMove={true}/>                                     
      </DeckGL>
      <Dashboard data={DataSetFiltered} state={DataSetFiltered.length}/> </div>)
}
export default AppLayer;
