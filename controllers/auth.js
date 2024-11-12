const { db } = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;


const register = async (req, res) => {
    // console.log(req.body)
    const {name, email, password, matchPassword} = req.body;
    
    db.query(`SELECT email FROM users WHERE email = ?`,[email], async (error, results) => {
        if (error) {
            console.log(error);
            return res.status('404').json({
                ok: false,
                message: `Hubo un error en el servidor ${error}`
            })
        }
        if (results.length > 0) {
            return res.status('404').json({
                ok: false,
                message: 'Este email esta en uso'
            })
        };
        if (!emailRegex.test(email)) {
            return res.render('register', {
                message: 'Email invalido'
            })
        };
        if (password !== matchPassword) {
            return res.render('register', {
                message: 'Passwords no son iguales'
            })
        };

        //Hashear password
        const passwordHashed = await bcrypt.hashSync(password, 10);

        // Guardar user en DB
        db.query('INSERT INTO users set ?', {name, email, password: passwordHashed}, (error, results) => {
            if (error) {
                console.log(error);
                return;
            }
            console.log(results)
            return res.json({
                ok: true,
                message: 'User created',
                user: {
                    name, password, email
                }
            })
        });
        
    })
}

const login = async (req, res) => {
    const {email, password} = req.body;
    db.query(`SELECT email,password FROM users WHERE email = ?`,[email], async (error, results) => {
        if (error) {
            console.log(error);
            return error
        }
        if (results.length === 0) {
            return res.status('404').json({
                ok: false,
                message: 'Email o contraseña incorrectas'
            })
        };

        // Comparar password
        const comparePassword =await bcrypt.compare(password,results[0].password);

        if (!comparePassword) {
            return res.status('404').json({
                ok: false,
                message: 'Contraseña o email incorrectas'
            })
        }

        // JSON web token 
       
        const token = jwt.sign(results[0].email,process.env.SECRET_KEY)

        return res.json({
            ok: true,
            user : results[0].email,
            token
        })
       
        });
        
    }

module.exports = { register, login }