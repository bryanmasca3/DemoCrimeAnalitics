import React from "react";
import * as crossfilter from "crossfilter2";
import {csv,timeFormat,timeParse,format} from 'd3'
import "dc/dc.css";
import datasss from './../data/crimes.csv';

export const CXContext = React.createContext("CXContext");
export const  dateFormatSpecifier = '%m/%d/%Y';

export const dateFormat = timeFormat(dateFormatSpecifier);
export const dateFormatParser = timeParse(dateFormatSpecifier);
export const numberFormat = format('.2f');

export class DataContext extends React.Component {  
  constructor(props) {
    super(props);
    this.state={hasNDX:false};
    console.log("aoaoaoaoaoao")
  }
  componentDidMount(){
    console.log("repayaso")
      if (this.state.hasNDX){
          return
      }
      
      this.ndx = crossfilter(this.props.dataset); //TODO possibly need to update this
      this.setState({hasNDX:true})            
  }
  componentWillUnmount() {
    console.log("Bye");
  }
  render() {
    console.log("render")
      if(!this.state.hasNDX){
          return null;
      }
    return (
      <CXContext.Provider value={{ndx:this.ndx}}>
        <div ref={this.parent}>           
            {this.props.children}
        </div>
      </CXContext.Provider>
    );
  }
}
