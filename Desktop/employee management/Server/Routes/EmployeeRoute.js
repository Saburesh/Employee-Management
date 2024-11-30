import express, { response } from 'express'
import con from '../utils/db.js';
import jwt from 'jsonwebtoken';
import bcrypt, { hash } from 'bcrypt'


const router = express.Router();

//authentication (employee login page) api...........................................
router.post('/employee_login', (req, res) => {
    const sql = 'SELECT * from employee where email = ?'
    con.query(sql, [req.body.email], (err, result) => {
        
        //condition for QUERY error
        if(err) return res.json({loginStatus: false, Error: "query error :("});
        
        //condition for NO error
        if(result.length > 0){
            //to get the password from backend and the user recent password entered compared if it is valid or not. 
            bcrypt.compare(req.body.password, result[0].password, (err, response) => {
                if(err) return res.json({loginStatus: false, Error: "Wrong password :("});
                if(response){
                    const email = result[0].email;
                    //if the query is correct then check weather the admin is already login or not by using token (jwt)
                    const token = jwt.sign({role: "employee", email: email, id: result[0].id}, "jwt_secret_key", {expiresIn:'1d'});
                    
                    //then this token in added to the browser cookies. the code is in index in cors()
                    res.cookie('token', token)
                    
                    //to generate the cookie
                    return res.json({loginStatus: true, id: result[0].id})
                }
                
            })


        } 
        
        //condition for WRONG password.
        else{
            return res.json({loginStatus: false, Error: "wrong crediantials i.e., email or password invalid :("});
        }


    })
})




router.get('/detail/:id', (req, res)=>{
    const id = req.params.id;
    const sql = "select * from employee where id = ?"

    con.query(sql, [id], (err, result)=>{
        if(err) return res.json({Status: false})
            return res.json(result)
    })
})


router.get('/logout', (req,res)=>{
    res.clearCookie('token')
    return res.json({Status: true})
})

export {router as employeeRouter}