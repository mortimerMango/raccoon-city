const express = require('express');
const pool = require('../models/order-model');

const renderIndex = ((req, res) => {
    res.render('index', {
        title: 'Raccoon City (home)',
        menuCart: '',
        theday: '<script src=\"/js/index-theday.js\"></script>',
        checkcart: '<script src=\"/js/checkCart.js\"></script>',
        orderItem: '',
        receiptPost: ''
    })
})

const renderMenu = ((req, res) => {
    res.render('menu', {
        title: 'Raccoon City (menu)',
        menuCart: '<script src=\"/js/menu-cart.js\"></script>',
        theday: '',
        checkcart: '',
        orderItem: '',
        receiptPost: ''
    })
})

const renderOrder = ((req, res) => {
    res.render('order', {
        title: 'Raccoon City (order)',
        menuCart: '',
        theday: '',
        checkcart: '',
        orderItem: '<script src=\"/js/order-item.js\"></script>',
        receiptPost: ''
    })  
})

const postOrder = ((req, res) => {
    let temp = [];
    async function query() {
        const result = await pool.getItems(req.body);
        temp.push(result);
        const result_2 = await pool.getShipping();
        temp.push(result_2);

        res.setHeader('Content-Type', 'application/json');
        res.send({ data: temp });
    }
    query()
})

const renderReceipt = ((req, res) => {
    res.render('receipt', {
        title: 'Raccoon City (receipt)',
        menuCart: '',
        theday: '',
        checkcart: '',
        orderItem: '',
        receiptPost: '<script src=\"/js/receipt-post.js\"></script>'
    })
})

const postReceipt = ((req, res) => {
    async function createOrder() {
        try {
            const result = await pool.insertOrder(req.body);

            res.setHeader('Content-Type', 'application/json');
            res.send({ data: result });
        } catch (err) {
            console.log('[ERROR DETECTED FROM RECEIPT POST]\n', err, '\n [REDIRECTING TO HOME PAGE]');
            //WE SHOULD ALSO RESEARCH ENV_PRODUCTION before LAUNCHING
        } 
    }
    createOrder()
})

module.exports = {
    renderIndex,
    renderMenu,
    renderOrder,
    postOrder,
    renderReceipt,
    postReceipt
}