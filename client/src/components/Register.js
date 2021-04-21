import React,{useState, useEffect} from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import '../styles/Dialog.css'
import api from '../utils/api';
import setAuthToken from '../utils/setAuthToken';

const Register =({authData, updateAuthData})=>{
const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
    });
const [error, setError] = useState(false);
const [errorText, setErrorText] = useState('');
const { email, password, confirmPassword } = formData;
const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

const onRegister = async ()=>{
  if(password !== confirmPassword)
  {
    setErrorText('Password must be same');
    setError(true);
    return;
  }
  try {
    const res = await api.post('/users/register', {email, password});
    setAuthToken(res.data.token);
    clearForm();
    updateAuthData({showRegister:false, authenticated: true, user:res.data.user});
  } catch (error) {
    setErrorText(error.response.data.errors[0].msg);
    setError(true);
  }
}
const onClose = ()=>{
  setError(false);
  setErrorText('');
  clearForm();
  updateAuthData({showRegister:false})
}
const clearForm = ()=>{
  setFormData({ ...formData, password:'', confirmPassword: ''});
}
return (
    <React.Fragment>
        <Dialog open={authData.showRegister} onClose={onClose}
          aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Register"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className="dialog-form">
                <span><label>Email</label><input type="text" name="email" value={email} onChange={onChange}></input></span>
                <span><label>Password</label><input type="password" name="password" value={password} onChange={onChange}></input></span>
                <span><label>Confirm Password</label><input type="password" name="confirmPassword" value={confirmPassword} onChange={onChange}></input></span>
              </div>
              {error &&<label class="dialog-error">{errorText}</label>}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onRegister} color="primary">Register</Button>
            <Button onClick={onClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
    </React.Fragment>
);
};


export default Register;