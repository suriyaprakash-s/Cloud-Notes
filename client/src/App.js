import { Fragment, useState, useEffect } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Landing from './components/Landing'
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import setAuthToken from './utils/setAuthToken';
import api from './utils/api';
import List from './components/List';
import Note from './components/Note';

function App() {

  useEffect(()=>{
    const loadUser = async ()=>{
      try {
        const res = await api.get('/users');
        updateAuthData({authenticated:true, user:res.data.email});
      } catch (error) {
        setAuthToken(null);
        updateAuthData({authenticated:false, user:''});
      }
    }
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      loadUser();
    }
  },[]);
  const [authData, setAuthData] = useState({
      showRegister: false,
      showLogin: false,
      authenticated: false,
      user:''
  });
  const updateAuthData = (data)=>{
    setAuthData({...authData, ...data})
  }

  return (
    <Router>
      <Fragment>
        <Navbar authData={authData} updateAuthData={updateAuthData}></Navbar>
        <Login authData={authData} updateAuthData={updateAuthData}></Login>
        <Register authData={authData} updateAuthData={updateAuthData} ></Register>
        <Route exact path='/' render={()=>authData.authenticated ? <List authData={authData}/>:<Landing authData={authData} updateAuthData={updateAuthData}/>}></Route>
        <Route exact path='/note/:mode/:id' render={()=>authData.authenticated? <Note/>:<Landing authData={authData} updateAuthData={updateAuthData}/>}></Route>
      </Fragment>
    </Router>
  );
}

export default App;
