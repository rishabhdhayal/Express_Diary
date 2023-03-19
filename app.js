const express = require('express')
const bodyParser = require('body-parser')
const moongose = require('mongoose');
const methodOverride = require('method-override');
const app = express();
const port = process.env.PORT ||3000;

// set template engine as ejs
app.set('view engine','ejs');

//serving static files
app.use(express.static('Public'))

//BodyParser middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// middleware for method override
app.use(methodOverride('_method'));
//database url 
const url  =  'mongodb+srv://rishabhdhayal:artifloric2023@express-diary.r6zchaz.mongodb.net/?retryWrites=true&w=majority';

//connecting app with databse
moongose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(console.log("Mongo DB Connected")).catch(err => console.log(err));

//import Diary model
const Diary = require('./models/Diary')

//routing 
//routing for /
app.get('/',(req,res)=>{
    res.render('Home');
})
//routing for /about
app.get('/about',(req,res)=>{
    res.render('About');
})
//routing for diary page
app.get('/diary',(req,res)=>{
    Diary.find().then(data=>{
        res.render('Diary',{data:data});
    }).catch(err=>console.log(err));
    
})
//routing for adding records
app.get('/add',(req,res)=>{
    res.render('Add');
})
//Rout for saving diary
app.post('/add-to-diary',(req,res)=>{
    //save data on database
    const Data = new Diary({
        title:req.body.title,
        description:req.body.description,
        date:req.body.date
    })

    Data.save().then(()=>{
        res.redirect('/diary');
    }).catch(err=>console.log(err));
})

//Route for displaying records
app.get('/diary/:id',(req,res)=>{
    Diary.findOne({
        _id:req.params.id
    }).then(data=>{
        res.render('Page',{data:data})
    }).catch(err=>console.log(err))
})

//Route for Edit
app.get('/diary/edit/:id',(req,res)=>{
    Diary.findOne({
        _id:req.params.id
    }).then(data=>{
        res.render('Edit',{data:data})
    }).catch(err=>console.log(err))
})

// Edit Data 
app.put('/diary/edit/:id',(req,res)=>{
    Diary.findOne({
        _id:req.params.id
    }).then(data=>{
        data.title = req.body.title,
        data.description = req.body.description,
        data.date = req.body.date

        data.save().then(()=>{
            res.redirect('/diary');
        }).catch(err=>console.log(err));
    }).catch(err=>console.log(err))
})

//Delete from database

app.delete('/data/delete/:id',(req,res)=>{
    Diary.deleteOne({
        _id:req.params.id
    }).then(()=>{
        res.redirect('/diary');
    }).catch(err=>console.log(err));
})


// listening at port 3000
app.listen(port,()=>{
    console.log(`listening at port ${port}`);
})