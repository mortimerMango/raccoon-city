const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

const {
    renderIndex,
    renderMenu,
    renderOrder,
    postOrder,
    renderReceipt,
    postReceipt
} = require('../controllers/index_ctrl');

//HOME PAGE
router.get('/', renderIndex)

//MENU PAGE
router.get('/menu', renderMenu)

//ORDER PAGE
router.get('/order', renderOrder)
router.post('/order', postOrder)

//RECEIPT PAGE
router.get('/receipt', renderReceipt)
router.post('/receipt', postReceipt)

module.exports = router;