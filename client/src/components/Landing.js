import React from 'react';
import '../styles/Landing.css'

const Landing = (props)=>{
    return(
    <div className='landing'>
        <h3>Welcome to Cloud Notes</h3>
        <p>Please <span onClick={()=>props.updateAuthData({showLogin:true})}>Login</span>/
            <span onClick={()=>props.updateAuthData({showRegister:true})}>Register</span> to make Notes</p>
        
    </div>);
};

export default Landing;