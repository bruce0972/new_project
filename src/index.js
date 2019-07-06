const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'tmp_uploads/' });
const session = require('express-session');
const moment = require('moment-timezone');
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

//進入server時都會先檢查是否為登入狀態(無論到哪個router)
app.use('/', (req, res, next) => {
    if (req.session.loginUser) {
        res.locals.isLogined = !!req.session.loginUser;
        res.locals.loginUser = req.session.loginUser;
    };
    next();
});

//首頁
app.get('/', (req, res) => {
    const data = {};
    if (req.session.flashMsg) {
        data.flashMsg = req.session.flashMsg;
        delete req.session.flashMsg;
    };
    data.isLogined = !!req.session.loginEmail;
    data.loginEmail = req.session.loginEmail;
    data.loginName = req.session.loginName;
    res.render('home', data);
});

//會員登入
app.post('/', (req, res) => {
    let sql = "SELECT * FROM `member` WHERE `email`=? AND `password`=SHA1(?);";
    db.query(sql, [
        req.body.email,
        req.body.password
    ], (error, results) => {
        if (results[0]) {
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
        console.log('register success');
        console.log(result);
        
        res.render('register_success', result);
    }, (err) => {
        res.render('register', err);
    });
});

app.get('/try-upload', (req, res) => {
    res.render('try-upload');
});

app.post('/try-upload', upload.single('avatar'), (req, res) => {
    console.log(req.file);
    if (req.file && req.file.originalname) {
        if (/\.(jpg|jpeg|png)$/i.test(req.file.originalname)) {
            fs.createReadStream(req.file.path)
                .pipe(
                    fs.createWriteStream('./public/img/' + req.file.originalname)
                );
            res.render('try-upload', {
                result: true,
                name: req.body.name,
                avatar: '/img/' + req.file.originalname
            });
            // return;
        }
    }
    res.render('try-upload', {
        result: false,
        name: '',
        avatar: ''
    });

});

app.get('/try-post-form', (req, res) => {
    res.render('try-post-form');
});

app.post('/try-post-form', (req, res) => {
    console.log(req.body);
    res.render('try-post-form', req.body);
});

app.get('/sales3', (req, res) => {
    var sql = "SELECT * FROM sales;";
    db.query(sql, (error, results, fields) => {
        if (error) throw error;
        console.log(results, fields);
        for (let v of results) {
            v.birthday2 = moment(v.birthday).format('YYYY-MM-DD');
        }
        res.render('sales3', {
            sales: results
        });
    });
});

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