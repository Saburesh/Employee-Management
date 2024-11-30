//all api's are listed here...


import express from 'express';
import con from '../utils/db.js';
import jwt from 'jsonwebtoken';
import bcrypt, { hash } from 'bcrypt'
import multer from 'multer'
import path from 'path'

const router = express.Router();


//authentication (login page) api...........................................
router.post('/adminlogin', (req, res) => {
    const sql = 'SELECT * from admin where email = ? and password = ?'
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        
        //condition for QUERY error
        if(err) return res.json({loginStatus: false, Error: "query error :("});

        //condition for NO error
        if(result.length > 0){
            const email = result[0].email;
            //if the query is correct then check weather the admin is already login or not by using token (jwt)
            const token = jwt.sign({role: "admin", email: email, id: result[0].id}, "jwt_secret_key", {expiresIn:'1d'});
            //then this token in added to the browser cookies. the code is in index in cors()

            res.cookie('token', token)
            //to generate the cookie

            return res.json({loginStatus: true})
        } 
        
        //condition for WRONG password.
        else{
            return res.json({loginStatus: false, Error: "wrong crediantials i.e., email or password invalid :("});
        }


    })
})



//api that displays the added category in category section............................
router.get('/category', (req,res) => { 
    const sql = 'select * from category';
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false , Error: 'Query error :?'})
        return res.json({Status: true, Result: result})
    })
})



//add category api..................................................................
router.post('/add_category', (req, res)=> {
    const sql = 'insert into category (`name`) values (?)'
    con.query(sql, [req.body.category], (err, result) => {
        if(err) return res.json({Status: false , Error: 'Query error :?'})
        return res.json({Status: true})
    })
})




//uploading image to the server from the client using multer........................................
const storage = multer.diskStorage({

    //add the destination
    destination: (req, file, cb) => {
        cb(null, 'public/Images')
    },

    //add the file name what is gonna store in the server
    //here we use the file.fieldname to extract the name of our file and add some extra info as date, time etc.
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
})



const upload = multer({
    storage: storage
})



//creating backend api to store add_employee info to database................................................................
router.post('/add_employee', upload.single('image'), (req,res) => {
    const sql = `insert into employee (name, email, password, salary, address, image, category_id) values (?)`;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) return res.json({Status: false , Error: 'Query error(in employee part) :?'})
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.salary,
            req.body.address,
            req.file.filename,
            req.body.category_id
        ]
        con.query(sql, [values], (err, result) => {
            if(err) return res.json({Status: false , Error: 'Query error (::?' + err.message})
            return res.json({Status: true})
        })
    })
})



//to display the employee details after adding in employee page.
router.get('/employee', (req,res) => { 
    const sql = 'select * from employee';
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false , Error: 'Query error :?'})
        return res.json({Status: true, Result: result})
    })
})



//api to fetch the existing employee's details from employee table to edit_employee fields.
router.get('/employee/:id', (req, res) =>{
    const id = req.params.id;
    const sql = 'select * from employee where id = ?';
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false , Error: 'Query error :?'})
            return res.json({Status: true, Result: result})
    })
})



//api to edit the employee at backend when the employee is edited at frontend.
router.put('/edit_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = `update employee 
    set name = ?, email = ?, salary = ?, address = ?, category_id = ? 
    where id = ?`
    const values = [
        req.body.name,
        req.body.email,
        req.body.salary,
        req.body.address,
        req.body.category_id
    ]
    con.query(sql,[...values, id], (err, result) => {
        if(err) return res.json({Status: false , Error: 'Query error :? id'+ err.message})
            return res.json({Status: true, Result: result})
    })
    
})




//api to delete the employee from the employee table when pressed delete table.
router.delete('/delete_employee/:id' , (req, res) => {
    const id = req.params.id;

    const sql = `delete from employee where id = ?`

    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false , Error: 'Query error :? deletion'+ err.message})
            return res.json({Status: true, Result: result})
    })
})



//api to count the number of admins, number of employees and total salary for the home cards.
router.get('/admin_count', (req, res) => {
    const sql = `select count(id) as admin from admin `
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false , Error: 'Query error :? totalAdmin_card'+ err.message})
            return res.json({Status: true, Result: result})
    })
})
router.get('/employee_count', (req, res) => {
    const sql = `select count(id) as employee from employee `
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false , Error: 'Query error :? totalEmployee_card'+ err.message})
            return res.json({Status: true, Result: result})
    })
})
router.get('/salary_count', (req, res) => {
    const sql = `select sum(salary) as salary from employee `
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false , Error: 'Query error :? totalEmployee_card'+ err.message})
            return res.json({Status: true, Result: result})
    })
})

//api to display information of admins in home 
router.get('/admin_records', (req, res)=>{
    const sql = `select * from admin`
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false , Error: 'Query error :? admin_info'+ err.message})
            return res.json({Status: true, Result: result})
    })
})


//api to log out
router.get('/logout', (req, res) =>{
    res.clearCookie('token')
    return res.json({Status: true})
})


//api to delete the category and 

router.delete('/delete_category/:id', (req, res) => {
    const id = req.params.id;

    const sql1 = `DELETE FROM employee WHERE category_id = ? `;
    con.query(sql1, [id], (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: 'Query error: deletion of employees of category ' + err.message });
        }

        const sql2 = `DELETE FROM category WHERE id = ?`;
        con.query(sql2, [id], (err, result) => {
            if (err) {
                return res.json({ Status: false, Error: 'Query error: deletion of category ' + err.message });
            }

            // Return success response if both deletions are successful
            res.json({ Status: true, Result: result });
        });
    });
});

export {router as adminRouter}