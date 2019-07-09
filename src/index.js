const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bluebird = require('bluebird');

const db = require('../models/db_connection');
const toRegister = require('../models/member_register');

bluebird.promisifyAll(db);

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'secret', //加密用字串
    cookie: {
        maxAge: 1000 * 60 * 20 //=20mins session 有效時間
    }
}));

app.use('/', (req, res, next) => {
    if (req.session.loginEmail) {
        res.locals.isLogined = !!req.session.loginEmail;
        res.locals.loginEmail = req.session.loginEmail;
        res.locals.loginName = req.session.loginName;
    }
    next();
});

//首頁
app.get('/', (req, res) => {
    let data = {};
    data.non_repeat_category = new Set();
    let sql = "SELECT * FROM product;";

    db.queryAsync(sql, (error, results) => {

        //全部的products資料給data
        data.products = results;

        //不重複的商品種類，供種類篩選用
        results.forEach(product => {
            data.non_repeat_category.has(product.category) ? '' : data.non_repeat_category.add(product.category);
        })

        if (req.session.flashMsg) {
            data.flashMsg = req.session.flashMsg;
            delete req.session.flashMsg;
        };

        data.isLogined = !!req.session.loginEmail;
        data.loginEmail = req.session.loginEmail;
        data.loginName = req.session.loginName;
        res.render('home', data);
    })
});

//會員登入
app.post('/', (req, res) => {
    let sql = "SELECT * FROM `member` WHERE `email`=? AND `password`=SHA1(?);";
    db.query(sql, [
        req.body.email,
        req.body.password
    ], (error, results) => {
        if (results[0]) {
            req.session.member_id = results[0].member_id;
            req.session.loginEmail = req.body.email;
            req.session.loginName = results[0].name;
        } else {
            req.session.flashMsg = '帳號或密碼錯誤';
            req.session.oriEmail = req.body.email;
            req.session.oriPass = req.body.password;
        }
        res.redirect('/');
    });
});

//會員登出
app.get('/logout', (req, res) => {
    delete req.session.loginEmail;
    delete req.session.loginName;
    res.redirect('/');
});

//到註冊頁面
app.get('/register', (req, res) => {
    res.render('register');
})

// 註冊會員
app.post('/register', (req, res) => {
    let memberData = {
        name: req.body.regName,
        email: req.body.regEmail,
        password: req.body.regPassword,
        create_date: onTime()
    };

    toRegister(memberData).then(result => {
        res.render('register_success', result);
    }, (err) => {
        res.render('register', err);
    });
});

//取得會員資料
app.get('/member_info', (req, res) => {
    if (!!req.session.loginEmail === true) {
        db.queryAsync('SELECT * FROM member WHERE email = ?', req.session.loginEmail)
            .then(results => {
                res.render('member_info', results[0]);
            })
    };
});

//修改會員資料 - 僅可修改名字
app.post('/member_info', (req, res) => {
    db.queryAsync('UPDATE member SET name = ? WHERE email = ?', [req.body.revName, req.session.loginEmail])
        .then(results => {
            // console.log(results);
            if (results.affectedRows === 1) {
                return db.queryAsync('SELECT * FROM member where email = ?', [req.session.loginEmail])
            }
        })
        .then(results => {
            // console.log(results);
            res.locals.revInfo = true;
            console.log(results[0]);
            res.render('member_info', results[0]);
        });

});

//轉入shopping_cart頁面
app.post('/shopping_cart', (req, res) => {
    // console.log("進入shopping_cart --- post");
    let productId = req.body.shopping_cart_id.split(",");
    let productName = req.body.shopping_cart_name.split(",");
    let productQty = req.body.shopping_cart_qty.split(",");
    let productUnitPrice = req.body.shopping_cart_unit_price.split(",")

    let data = {};

    data.productId = productId;
    data.productName = productName;
    data.productQty = productQty;
    data.productUnitPrice = productUnitPrice;

    res.render('shopping_cart', data);
});

app.get('/order_info', (req, res) => {
    let order_Info = {};
    let sql = `SELECT * FROM order_list WHERE member_id = ${req.session.member_id}`;
    db.queryAsync(sql, (error, results) => {
        order_Info.orderInfo = results;
        // console.log(order_Info);
        res.render('order_info', order_Info);
    })
});

app.post('/place_order', (req, res) => {
    let productId = req.body.order_item_id.split(',');
    let productQty = req.body.order_item_qty.split(',');
    let productSubtotal = req.body.order_item_subtotal.split(',');
    let productName = req.body.order_item_name.split(',');
    let temp_max_order_id = 0;
    let new_order = {};

    if (!req.session.loginEmail) {
        res.redirect('/'); //必須先登入
    }

    //個別產品數量扣除
    for (let i = 0; i < productId.length; i++) {
        let sql_Updata = `UPDATE product SET product.quantity = product.quantity - ${productQty[i]} WHERE product.id = ${productId[i]};`;
        db.query(sql_Updata);
    }

    //導出訂單編號
    let sql_Select = `SELECT order_id from order_list ORDER BY order_id DESC LIMIT 1;`;
    db.queryAsync(sql_Select)
        .then(results => {
            temp_max_order_id = results[0].order_id + 1;
            return db.queryAsync(`SELECT * FROM member where email = ?`, [req.session.loginEmail])
                .then(results => {
                    // new_order.memberid = results[0].member_id;
                    // new_order.member_email = results[0].email;
                    let sql_Insert = `INSERT INTO order_list (order_id, member_id, product_id, product_name, order_quantity, order_price, order_date) VALUES (?, ?, ?, ?, ?, ?, ?);`;
                    for (let i = 0; i < productId.length; i++) {
                        db.queryAsync(sql_Insert, [temp_max_order_id, results[0].member_id, productId[i], productName[i], productQty[i], productSubtotal[i], onTime()])
                    }
                    let sql_Select_orderlist = `SELECT * FROM order_list WHERE member_id = ${results[0].member_id};`;
                    return db.queryAsync(sql_Select_orderlist)
                })
                .then(results => {
                    new_order.orderInfo = results
                    console.log(new_order);
                    res.render('order_info', new_order);
                })
        })


});

//無相對路徑時捕捉的middleware
app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - 找不到網頁');
});

app.listen(5000, (req, res) => {
    console.log("Server running");
});


//下面是function定義
function checkEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const result = re.test(email);
    return result;
};

//當下時間捕捉，並轉換mysql格式
const onTime = () => {
    const date = new Date();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const hh = date.getHours();
    const mi = date.getMinutes();
    const ss = date.getSeconds();

    return [date.getFullYear(), "-" +
        (mm > 9 ? '' : '0') + mm, "-" +
        (dd > 9 ? '' : '0') + dd, " " +
        (hh > 9 ? '' : '0') + hh, ":" +
        (mi > 9 ? '' : '0') + mi, ":" +
        (ss > 9 ? '' : '0') + ss
    ].join('');
}