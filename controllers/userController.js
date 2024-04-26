const { where } = require("sequelize");
const db = require("../database/models");
var bcrypt = require('bcryptjs');
const Users = db.Users;

const show = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Users.findByPk(id);

        if (!data) {
            return res.status(404).json(`${id} not found in db`);
        }

        res.json(data).status(200);
    } catch (error) {
        res.status(422).json(error);
    }
}

const index = async (req, res) => {
    try {
        const result = await Users.findAndCountAll()
        res.json(result).status(200)
    } catch (error) {
        res.json(error).status(422)
    }
}

const store = async (req, res) => {
    try {
        const save = await Users.create(req.body)
        res.json(save).status(200)
    } catch (error) {
        res.json(error).status(422)
    }
}


const update = async (req, res) => {
    try {
    const id = req.params.id;

    if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password);
    }
    const userData = {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password)
    };

    const result = await Users.update (userData, {
        where: { id },
    });
    if (result[0] === 1) {
        res.json({
            message: 'Berhasil',
            data: userData
        });
    } else {
        res.json({
            message: 'Gagal',
            data: userData
        });
    }
} catch (err) {
    res.status(500).json({
        message: err.message || 'Gagal',
        data: null
    });
}
};


const destroy = (req, res) => {
    let msg
    Users.findByPk(req.params.id).then((row) => {
        if (row) {
            row.destroy()
            msg = "success deleted"
        } else {
            msg = `${req.params.id} not found in db`
        }
        res.json({ message: msg })
    }).catch((err) => {
        res.json({ message: err.message })
    })
}

module.exports = {
    show, index, store,
    update, destroy
}