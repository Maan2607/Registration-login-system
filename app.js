const express= require("express") ;
const mysql=require("mysql")
const path= require('path') 
const dotenv=require('dotenv')
const jwt = require('jsonwebtoken')
const bcrypt =require('bcryptjs')
const app=express() 
const router = express.Router();
const authcontroller = require('./controllers/auth') ;

dotenv.config({path:'./.env'}) ;          
const publicDirectory= path.join(__dirname,'./public') ;
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended:false })) ;
app.use(express.json()) ;

app.set('view engine','hbs') ;
const db=mysql.createConnection({
    // alter user 'root'@'localhost' identified with mysql_native_password by 'Mantaran16@1'; used this line in mysql to remove authentication error.
    host : process.env.Host_database,
    user: process.env.user_database,
    password: process.env.password_database,
    database:process.env.DATABASE,
});
 db.connect((error)=>{
    if(error){
        console.log(error) ;
    }
    else{
        console.log("successfully connected") ;
    }
 })
 app.get('/',(req,res)=>{
    res.render('ho') ;
})                                                   

app.get('/register',(req,res)=>{
    res.render('register') ;
}) 
app.get('/log',(req,res)=>{
    res.render('log') ;
})

app.use('/auth',(req,res)=>{
    console.log(req.body) ;
    const name=req.body.nam ;
    const email =req.body.emai ;
    const password=req.body.passwor ;
    const confirm =req.body.conpasswor ;
    db.query('SELECT email from login_info WHERE email=?', [email],async(error,results)=>{
        if(error){
            console.log(error) ;
        }
        if(results.length > 0){
          return res.render('register',{
            message : 'This email is already in use' 
          })
        }else if(password!=confirm){
            return res.render('register',{
                message : 'Password do not Match' 
            })     
        }
        // else{
        //     return res.render('registered successfully') ;
        // }
      let hashedpass =await bcrypt.hash(password,8)
       console.log(hashedpass) ;
    //    res.render('registered successfully') ;
       db.query("insert into login_info(name,email,password,confirm_password)values( '"+name+"','"+email+"','"+hashedpass+"' ,'"+hashedpass+"')",(error,results)=>{
        if(error){
            console.log(error)
        }
        else{
            console.log(results) ;
            return res.send('registered successful');
        }
       })
 })    
})

app.use('/auth2',(req,res)=>{
    const lemail=req.body.ema ;
    const lpass=req.body.passwo ;
    db.query("SELECT* from login_info WHERE email= '"+lemail+"'   ",async(error,results)=>{
        if(error){
            console.log(error) ;
        }
        if(results.length > 0){
           if(!await bcrypt.compare(lpass,results[0].password)){
            return res.render('log',{
                message : 'Authentication failed'  
              })
           }
             else{
                res.send('login successful') ;
             }
          }
          else{
            return res.render('log',{
                message : 'no email of such' 
              })
          }


    } ) 
  
})



app.listen(process.env.PORT,()=>{
    console.log(`server started on port ${process.env.PORT}`) ;
});                                                                                                                                                           