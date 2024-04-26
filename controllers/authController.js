// Komentar Tambahan:

// Import library yang dibutuhkan
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const passwordHash = require('password-hash');
const Joi = require('joi');
require('dotenv').config();

const db = require('../database/models');
const Users = db.Users;
const Blacklist = db.Blacklist
const Form_users = db.Form_users

// Joi validation schema untuk registrasi pengguna
const registerSchema = Joi.object({
    username: Joi.string().trim().alphanum().min(3).max(30).required(),
    fullname: Joi.string().trim().min(3).max(255).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().required(),
});

// Joi validation schema untuk login
const loginSchema = Joi.object({
    email: Joi.string().trim().required(),
    password: Joi.string().required(),
});

// Joi validation schema untuk forgot password
const forgotPasswordSchema = Joi.object({
    email: Joi.string().trim().email().required(),
});

// Joi validation schema untuk form pendaftaran
const formUsersSchema = Joi.object({
    nama: Joi.string().required(),
    tanggal_lahir: Joi.string().required(), // Menggunakan .string() tanpa .email()
    alamat: Joi.string().required(), // Menggunakan .string().required() untuk alamat
});


// Method untuk melakukan registrasi pengguna
const register = async (input, res) => {
    try {
        const { error } = registerSchema.validate(input);
        if (error) {
            return res.status(422).json({ status: 422, message: error.details[0].message });
        }

        const hashedPassword = passwordHash.generate(input.password);

        const save = await Users.create({
            username: input.username,
            fullname: input.fullname,
            email: input.email,
            password: hashedPassword,
        });

        res.json({ status: 200, message: 'success', data: save });
    } catch (error) {
        res.json({ status: 422, message: error.message });
    }
};

// Method untuk melakukan login pengguna
// Method untuk melakukan login pengguna
const login = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(422).json({ status: 422, message: error.details[0].message });
        }

        const email = req.body.email.trim();
        const password = req.body.password.trim();

        const user = await Users.findOne({ where: { email: email } });

        if (!user) {
            return res.status(422).json({ status: 422, message: 'Email not found' });
        }

        // Periksa password dengan menggunakan passwordHash.verify
        const isPasswordValid = passwordHash.verify(password, user.password);

        if (!isPasswordValid) {
            return res.status(422).json({ status: 422, message: 'Incorrect password' });
        }

        const userToken = {
            id: user.id,
            email: user.email,
        };

        jwt.sign({ userToken }, process.env.JWT_KEY, {
            expiresIn: '1d',
        }, (err, token) => {
            if (err) {
                return res.status(500).json({ status: 500, message: 'Error generating token' });
            }

            res.json({ status: 200, message: 'success', token: token, email: email, password: password, });
        });
    } catch (error) {
        res.status(422).json({ status: 422, message: `Error: ${error.message}` });
    }
};


// Method untuk melakukan proses forgot password
const forgotPassword = async (req, res) => {
    try {
        const { error } = forgotPasswordSchema.validate(req.body);
        if (error) {
            return res.status(422).json({ status: 422, message: error.details[0].message });
        }

        const email = req.body.email.trim();

        const user = await Users.findOne({ where: { email: email } });

        if (!user) {
            return res.status(422).json({ status: 422, message: 'Email not found' });
        }

        const resetToken = jwt.sign({ userId: user.id }, process.env.RESET_PASSWORD_KEY, { expiresIn: '1h' });

        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.MAILTRAP_USER,
            to: email,
            subject: 'Reset Password Link',
            text: `Click on the following link to reset your password: ${process.env.APP_URL}/reset-password/${resetToken}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ status: 500, message: 'Error sending email' });
            }

            res.json({ status: 200, message: 'Reset password link sent to your email' });
        });
    } catch (error) {
        res.status(422).json({ status: 422, message: `Error: ${error.message}` });
    }
};

// Method untuk melakukan logout
const logout = async (req, res) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1]
            await Blacklist.create({ token: token })
            res.json({ msg: 'Logout sucessfully' }).status(200);
        } else {
            res.json({ msg: 'Token required' }).status(422);
        }
    } catch (error) {
        console.log(error);
        res.json({ msg: error }).status(422);
    }
};

const processForm = async (req, res) => {
    try {
        let value = req.body;

        // Ubah tipe data tanggal menjadi string sebelum validasi menggunakan Joi
        value.tanggal_lahir = new Date(value.tanggal_lahir).toISOString(); // Konversi ke string format ISO

        // Validasi input menggunakan schema Joi setelah mengonversi tanggal_lahir menjadi string
        const { error } = formUsersSchema.validate(value, { convert: false });
        if (error) {
            return res.status(422).json({ status: 422, message: error.details[0].message });
        }

        // Lakukan validasi atau proses lainnya sesuai kebutuhan
        // Misalnya, simpan data ke database menggunakan model Form_users
        const savedData = await Form_users.create(value);

        res.json({ status: 200, message: 'success', data: savedData });
    } catch (error) {
        res.status(422).json({ status: 422, message: `Error: ${error.message}` });
    } 
    
};


  


module.exports = {
    register, login, forgotPassword, logout, processForm
};