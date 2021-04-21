import React, {useState} from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import '../styles/Dialog.css';
import api from '../utils/api';
import setAuthToken from '../utils/setAuthToken'

const Login =({authData, updateAuthData})=>{
const [formData, setFormData] = useState({
    email: '',
    password: ''
    });
const [error, setError] = useState(false);
const [errorText, setErrorText] = useState('');
const { email, password } = formData;
const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

const onSignIn = async e => {
  try{
    const res = await api.post('/users/login',{email, password});
    setAuthToken(res.data.token);
    clearForm();
    updateAuthData({showLogin:false, authenticated: true, user:res.data.user});
  }catch(error)
  {
    setErrorText(error.response.data.errors[0].msg);
    setError(true);
  }

};
const onClose = ()=>{
  setError(false);
  setErrorText('');
  clearForm();
  updateAuthData({showLogin:false})
}; 
const clearForm = ()=>{
  setFormData({ ...formData, password:'', confirmPassword: ''});
};
return (
    <React.Fragment>
        <Dialog open={authData.showLogin} onClose={onClose}
          aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Sign In"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className="dialog-form">
                <span><label>Email</label><input type="text" name="email" value={email} onChange={onChange}></input></span>
                <span><label>Password</label><input type="password" name="password" value={password} onChange={onChange}></input></span>
              </div>
              {error &&<label class="dialog-error">{errorText}</label>}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onSignIn} color="primary">Sign In</Button>
            <Button onClick={onClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
    </React.Fragment>
);
};


export default Login;