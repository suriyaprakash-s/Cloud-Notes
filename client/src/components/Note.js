import { Button } from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import '../styles/Note.css'
import api from '../utils/api';
const Note = () =>{
    const {mode, id} = useParams();
    const history = useHistory();
    const [formData, setFormData] = useState(
        {
            title: new Date().toLocaleString(),
            content: ''
        }
    );
    useEffect(()=>{
        const getNote=async()=>{
            const res = await api.get(`/notes/${id}`);
            setFormData({title: res.data.title, content: res.data.content})
        }
        if(mode === 'edit')
        {
            getNote();
        }
        else if(mode !== 'create')
        {
            history.push('/');
        }
        
    },[]);
    
    const [alertType, setAlertType] = useState('');
    const [alertText, setAlertText] = useState('');
    const {title, content} = formData;
    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSave = async ()=>{
        if(!title)
            setFormData({...formData}, {title: new Date().toLocaleString()});
        try{
            if(mode==='edit')
            {
                const res=await api.put(`/notes/${id}`, formData);
                if(res.status === 200)
                {
                    setAlertType('green');
                    setAlertText('Note saved successfully!!!');
                }
            }
                
            else {
                const res = await api.post('/notes', formData);
                if(res.status === 200)
                {
                    setAlertType('green');
                    setAlertText('Note saved successfully!!!');
                    history.push(`/note/edit/${res.data._id}`);
                }                
            }
        }catch(error){
            setAlertType('red');
            setAlertText('Failed to save, try again later!!!');
        }
        setTimeout(()=>{
            setAlertType(''); 
            setAlertText('');
        }, 5000)
    }
    return (
        <div className="note">
            <div className="title">
                <label for="title">Title</label>
                <input type="text" name="title" value={title} onChange={onChange}></input>
            </div>
            <div className="content">
                <label for="content">Content</label>
                <textarea rows="20" cols="30" name="content" value={content} onChange={onChange}></textarea>
            </div>
            <div className="actions">
                <Button color="secondary" onClick={()=>history.push('/')} style={{marginRight:'20px'}} variant="contained" size="small">Back</Button>
                <Button color="primary" onClick={onSave} variant="contained" size="small">Save</Button>
            </div>
            {alertType &&<label style={{color:alertType, paddingLeft: '25px'}}>{alertText}</label>}
        </div>
    );
};

export default Note;