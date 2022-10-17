const mysql = require('mysql');
const pool = require('./db');

const getItems = ((req, res) => {

    return new Promise((resolve, reject) => {
        let sql = 'SELECT meal_id, meal_name, meal_desc, meal_cost FROM meals WHERE meal_name = ? OR meal_name = ? OR meal_name = ?';
        let query = pool.query(sql, [req[0], req[1], req[2]], (err, result, fields) => {
            if (err) return reject(err);
            resolve(Object.values(JSON.parse(JSON.stringify(result))));
        });
    });

})

const getShipping = ((req, res) => {

    return new Promise((resolve, reject) => {
        let sql = 'SELECT agent_id, agent_firstname, agent_type, agent_cost FROM agents';
        let query = pool.query(sql, (err, result, fields) => {
            if (err) return reject(err);
            resolve(Object.values(JSON.parse(JSON.stringify(result))));
        });
       
    });
})

const insertOrder = ((req, res) => {

    let items = req[1].Items;
    let shipping = req[2].Shipping;
    let name = req[3];

    return new Promise((resolve, reject) => {
        let insertCustomer = 'INSERT INTO customers (customer_name) VALUES(?)';
        let insertOrder = 'INSERT INTO orders (customer_id, order_date) VALUES (?, NOW())';
        let insertOrderLine = 'INSERT INTO order_line (order_id, meal_id, quantity) VALUES (?, ?, ?)';
        let insertPickup = 'INSERT INTO pickup (order_id) VALUES (?)';
        let insertDelivery = 'INSERT INTO delivery (order_id, agent_id, delivery_zip) VALUES (?, ?, ?)';
        let getOrderDate = 'SELECT order_id, order_date FROM orders WHERE order_id = ?';

        pool.query(insertCustomer, [name.fname], (err, result, fields) => {
            if (err) return reject(err);
            pool.query(insertOrder, [result.insertId], (err, result) => {
                if (err) return reject(err);

                for (let i = 0; i < items.length - 1; i++) {
                    pool.query(insertOrderLine, [result.insertId, items[i].meal_id, items[i].quantity], (err, result) => {
                        if (err) return reject(err);
                    })
                }//END INSERTORDERLINE

                if (shipping[0].shipping_type == 'Pick-up') {
                    pool.query(insertPickup, [result.insertId], (err, result) => {
                        if (err) return reject(err);
                    })//END INSERTPICKUP
                }
                else {
                    pool.query(insertDelivery, [result.insertId, shipping[0].shipping_id, name.zip], (err, result) => {
                        if (err) return reject(err);
                        resolve('ok');
                    })//END INSERTDELIVERY
                }

                pool.query(getOrderDate, [result.insertId], (err, result) => {
                    if (err) return reject(err);
                    let obj = Object.values(JSON.parse(JSON.stringify(result)));
                    
                    resolve(obj);
                })//END, RETURN GETORDERDATE
            })//END INSERTORDER
        })//END INSERTCUSTOMER
    });
})

module.exports = {
    getItems,
    getShipping,
    insertOrder
}