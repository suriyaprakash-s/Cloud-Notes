const express = require('express');
const connectDB = require('./config/db');
const app = express();

app.use(express.json());
connectDB();

app.use('/api/users', require('./routes/api/users'));
app.use('/api/notes', require('./routes/api/notes'));
app.listen(3080, ()=>console.log("Server lis listening at 3080..."));