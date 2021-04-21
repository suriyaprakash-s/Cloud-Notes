import React from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/Navbar.css'
import setAuthToken from '../utils/setAuthToken';

const Navbar = ({authData, updateAuthData})=>{
    const history = useHistory();
    const onLogout=()=>{
        setAuthToken(null);
        updateAuthData({authenticated: false, user: ''})
    };
    return(
    <div className='navbar'>
        <h3 onClick={()=>history.push('/')}>Cloud Notes</h3>
        <ul>
            {authData.authenticated ? <span>{authData.user}<li onClick={onLogout}>Logout</li></span> :
            <span><li onClick={()=>updateAuthData({showRegister:true})}>Register</li>
            <li onClick={()=>updateAuthData({showLogin:true})}>Login</li></span>}
        </ul>
    </div>
    );
};

export default Navbar