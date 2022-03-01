import React from "react";
import  AppLayer  from "./layers/app";
import { store } from './redux/store';
import { Provider } from 'react-redux';

const  App =()=>{
    return (      
      <Provider store={store}>          
         < AppLayer/> 
      </Provider>
    );
}

export default App;
