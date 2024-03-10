// Task1: initiate app and run server at 3000
const express = require("express");
const morgan=require('morgan');
const app = express();
// const EmployeeDb = require("Employeedb");

app.use(morgan('dev'));
app.use(express.json());

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));

// Task2: create mongoDB connection 

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://vaistvvp:vaistvvp@cluster0.wxditfv.mongodb.net/EmployeeDB")

//create a schema

const Schema = mongoose.Schema;
const employeeSchema = new Schema({
    name:String,
    location:String,
    position:String,
    salary:String
},{versionKey:false});

const EmployeeDb = mongoose.model('workers',employeeSchema);

// module.exports = EmployeeDb;

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below







//TODO: get data from db  using api '/api/employeelist'

app.get('/api/employeelist',(req,res)=>{
  EmployeeDb.find().then((data)=>{
      res.send(data);
    })
  })


//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/api/employeelist/:id', (req, res) => {
  const employeeId = req.params.id;
  EmployeeDb.findById(employeeId).then(employeedata => {
      if (!employeedata) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.json(employeedata);
    })
    .catch(err => res.status(500).json({ error: 'Internal server error' }));
});


//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/api/employeelist',(req,res)=>{
  try {
   var employeedata = new EmployeeDb({
       name:req.body.name,
       location:req.body.location,
       position:req.body.position,
       salary:req.body.salary
   })
   console.log(employeedata);
   employeedata.save()
   res.status(201).json({Success:true})

  }catch(error){
    res.send("Cannot insert data.." + error)
  }
})


//TODO: delete a employee data from db by using api '/api/employeelist/:id'

app.delete('/api/employeelist/:id',(req,res) => {
  try{
  const employeeId = req.params.id;
  EmployeeDb.findByIdAndDelete(employeeId).then((data)=>{
    res.send(data);
})  
}catch(error){
res.status(400).json({err:error})
}
})



//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.put('/api/employeelist', (req, res) => {
  try{
    const query = {"name":req.body.name};
    EmployeeDb.findOne(query).then((employeedata)=>{
      // employeedata.name = req.body.name;
      employeedata.location = req.body.location;
      employeedata.position = req.body.position;
      employeedata.salary = req.body.salary;
      employeedata.save().then(()=>{
        console.log("Updated");
        res.status(201).json({Success:true})
    })
})
}catch(error){
res.status(400).json({err:error})
}
})
  


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});

app.listen(3000,()=>{
    console.log("Server started...");
})


