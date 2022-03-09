import React,{useState} from "react";
import './../App.css';
const BarchartAmenitiesView = () => {
    const [isShowHistogramAmenitiesView, setisShowHistogramAmenitiesView]=useState(true); 
    return(<>
        <div className="button__histogram-view_amenities" onClick={()=>setisShowHistogramAmenitiesView(!isShowHistogramAmenitiesView)}><i class="uil uil-chart-bar"></i></div>
           <div className={`histogram__view_amenities ${isShowHistogramAmenitiesView?"histogram__view-show_amenities":"histogram__view-close_amenities"}` }>
            <ul>
                <li><label><input type="checkbox" id="cbox1" value="cbox1"/> Amenenitie 1</label></li>
                <li><label><input type="checkbox" id="cbox2" value="cbox2"/> Amenenitie 2</label></li>
                <li><label><input type="checkbox" id="cbox3" value="cbox3"/> Amenenitie 3</label></li>
                <li><label><input type="checkbox" id="cbox4" value="cbox4"/> Amenenitie 4</label></li>
                <li><label><input type="checkbox" id="cbox5" value="cbox5"/> Amenenitie 5</label></li>
                <li><label><input type="checkbox" id="cbox6" value="cbox6"/> Amenenitie 6</label></li>
                <li><label><input type="checkbox" id="cbox7" value="cbox7"/> Amenenitie 7</label></li>
                <li><label><input type="checkbox" id="cbox8" value="cbox8"/> Amenenitie 8</label></li>
                <li><label><input type="checkbox" id="cbox9" value="cbox9"/> Amenenitie 9</label></li>
                <li><label><input type="checkbox" id="cbox10" value="cbox10"/> Amenenitie 10</label></li>
            </ul>
    
           </div>  
           </>                        
       )
}

export default BarchartAmenitiesView
