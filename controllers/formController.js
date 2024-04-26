const db = require('../database/models');
const Form = db.Form;

const store = async (req, res) => {
    try {
        const form = {
            nama: req.body.nama,
            tanggal_lahir: req.body.tanggal_lahir,
            alamat: req.body.alamat
        };

        const createdForm = await form.create(form);
        res.json({ 
            status: 200, 
            message: 'Form created successfully', 
            data: createdForm 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 500, 
            message: error.message 
        });
    }
};

const show = async (req, res) => {
    try {
        const formId = req.params.id;
        const form = await Form.findByPk(formId);
        if (form) {
            res.json({ status: 200, data: form });
        } else {
            res.status(404).json({ status: 404, message: 'Form not found' });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

const index = async (req, res) => {
    try {
        const forms = await Form.findAll();
        res.json({ status: 200, data: forms });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const formId = req.params.id;
        const formData = req.body;
        const [updatedCount, updatedForms] = await Form.update(formData, { where: { id: formId } });
        if (updatedCount > 0) {
            res.json({ status: 200, message: 'Form updated successfully', data: updatedForms });
        } else {
            res.status(404).json({ status: 404, message: 'Form not found' });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

const destroy = async (req, res) => {
    try {
        const formId = req.params.id;
        const deletedCount = await Form.destroy({ where: { id: formId } });
        if (deletedCount > 0) {
            res.json({ status: 200, message: 'Form deleted successfully' });
        } else {
            res.status(404).json({ status: 404, message: 'Form not found' });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

module.exports = {
    index, store, show, update, destroy
};
