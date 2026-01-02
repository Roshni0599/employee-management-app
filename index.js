const express = require('express');
const app = express();
const PORT = 5000;
 
app.use(express.json());

// adding Routes
const employeeRoutes = require('./routes/employeeRoutes');
app.use('/employees',employeeRoutes);

app.get('/',(req,res) =>{
    res.send('employee management API is running');
});

app.listen(PORT,() =>{
    console.log(`server running on port ${PORT}`);
});