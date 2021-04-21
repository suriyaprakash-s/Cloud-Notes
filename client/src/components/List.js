import React, { useState, useEffect, Fragment } from 'react'
import Button from '@material-ui/core/Button';
import api from '../utils/api';
import "../styles/List.css"
import { useHistory } from 'react-router-dom';
const List = ()=>{
    const onDelete = async(id)=>{
        await api.delete(`/notes/${id}`);
        loadList();
    };
    const loadList=async()=>{
        try {
            const res = await api.get('/notes');
            setNotesList(res.data);
        } catch (error) {
            setNotesList([]);
        }
    }
    useEffect(()=>{
        loadList();
    },[]);
    const history = useHistory();
    const [notesList, setNotesList]=useState([]);
    
    const getList= notesList.map((note)=>
                <div key={note._id}>
                    <span>{note.title}</span>
                    <span>{new Intl.DateTimeFormat('en-IN', { 
                            year: 'numeric', month: 'numeric', day: 'numeric',
                            hour: 'numeric', minute: 'numeric', second: 'numeric',
                            hour12: false
                            }).format(Date.parse(note.date))}</span>
                    <span>
                    <Button color="primary" onClick={()=>history.push(`/note/edit/${note._id}`)}>Edit</Button>
                    <Button color="secondary" onClick={()=>onDelete(note._id)}>Delete</Button>
                    </span>
                </div>
            );
    const addNote = ()=>{
        history.push('/note/create/new')
    };
    return(
        <div class="list">
            <div className="menu-bar"> 
                <span><i>When your heart speaks, take good notes</i> - Judith Exner</span>
                <span><Button color="primary" variant="contained" size="small" onClick={addNote}>Add</Button></span>
            </div>
            <div className="custom-table">
                {notesList.length>0? getList: <span>No Records Avaliable</span>}
            </div>
        </div>
       
    );
};

export default List;