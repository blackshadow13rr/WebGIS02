var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var Guid = require("guid");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
//处理跨域访问的问题
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


var server = app.listen(8081, (error) => {
    if (!error)
        var host = server.address().address;
    var port = server.address().port;
    console.log("welcome \r\n listening on %s:%s", host, port);
})
module.exports = app;

//引用mysql并创建连接池
const mysql = require("mysql");
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "school",
    password: "NWPYskmPbD5yzH7K",
    database: "school",
    conncetionTimeout: "60000"
});



//登录
app.get("/Admin/Login", (req, res) => {

    var info = {
        user: req.query.userName,
        pwd: req.query.password
    }

    //查询数据库中是否存在相关数据
    let sql = "select * from userlist where Uuser = '" + info.user + "' and Upwd = '" + info.pwd + "'";
    var sqlParams = [info.user, info.pwd];
    db.query(sql, sqlParams, (e, results) => {
        if (results != '' && !e) {
            //创建浏览器token
            var token = jwt.sign(info, "PrivateKey111", {
                expiresIn: 60 * 60 * 24,
            });

            res.json({
                status: "2",
                message: "登录成功！",
                token: token
            });
        } else {
            res.json({
                status: "4",
                message: "用户名或密码错误！"
            });
            return false;
        }
    })
});

app.get("/Role/List", (req, res) => {
    let sql = "select id, Rname, Rdetails from rolelist";
    db.query(sql, (e, results) => {
        if (results != '' && !e) {
            res.send(results)
        }
    })
});

app.get("/Role/GetOne", (req, res) => {
    let sql = "select * from rolelist where RUuser = ?";
    var sqlParams = [req.query["user"]]
    db.query(sql, sqlParams, (e, results) => {
        if (!e) {
            res.send(results);
        } else {
            console.log(e.message);
        }
    })
})

app.post("/Role/Add", (req, res) => {
    let role = {
        roleName: req.body.roleName,
        roleDetails: req.body.roleDetails
    }
    let sqlParams = [role.roleName, role.roleDetails];
    let sql = "insert into rolelist(Rname, Rdetails) values(?, ?)"
    db.query(sql, sqlParams, (e, results, fields) => {
        if (!e && results.affectedRows > 0) {
            res.json({
                status: true,
                message: "添加成功",
            })
        } else {
            res.json({
                status: false,
                message: "添加失败",
            })
        }
    })
});

app.post("/Role/Update", (req, res) => {
    let role = {
        roleName: req.body.roleName,
        roleDetails: req.body.roleDetails,
    };
    let sqlParams = [role.roleDetails, role.roleName];
    let sql = "update rolelist set Rdetails = ? where Rname = ?"
    db.query(sql, sqlParams, (e, results, fields) => {
        if (!e && results.affectedRows > 0) {
            res.json({
                status: true,
                message: "修改成功",
            })
        } else {
            res.json({
                status: false,
                message: "修改失败",
            })
        }
    })
});



app.post("/Role/Delete", (req, res) => {
    let sqlParams = [req.body.roleName]
    let sql = "delete from rolelist where Rname = ?"
    db.query(sql, sqlParams, (e, results) => {
        if (!e && results.affectedRows > 0) {
            res.json({
                status: true,
                message: "删除成功",
            })
        } else {
            res.json({
                status: false,
                message: "删除失败",
            })
        }
    })
})

//分页需要url参数pageSize(每一页的大小)和pageIndex(当前的页码)
app.get("/Course/List", (req, res) => {
    let param = {
        pageSize: 4,
        pageIndex: 5
    }
    let sql = "call GetPage('course', 'id', ?, ?, @pageTotalCount, @lineCount);";
    let sqlParams = [param.pageSize, param.pageIndex]
    db.query(sql, sqlParams, (e, results, fields) => {
        if (!e && results != '') {
            res.send(results)
        } else {
            console.log(e.message);
        }
    })
});

app.post("/Admin/Register", (req, res) => {
    let RegData = {
        username: req.body.loginUser,
        password: req.body.loginPwd,
        role: req.body.role,
    }
    let sqlParams = [RegData.username, RegData.role, RegData.password];
    db.query("SELECT * FROM userlist WHERE Uuser = '" + RegData.username + "'", function(error, results, fields) {
        let uName = res[0]
        console.log(uName)
        if (uName == undefined) {
            //    不存在时插入数据
            db.query('insert into userlist (Uuser,Urole,Upwd) values(?, ?, ?)', sqlParams, function(err, data) {
                if (err) {
                    res.send({ statusCode: 0, msg: '注册失败，请重试' })
                } else {
                    res.send({ statusCode: 200, msg: '注册成功' })
                }
            })
        } else {
            res.send({ statusCode: 4, message: '用户名已存在' })
        }
    })
});

app.get("/Map/GetOrderList", (req, res) => {
    db.query("select Oid,Oaddress,Ostate from school.order", function(error, results, fields) {
        if (error) {
            console.log(error)
        } else {
            res.send(results)
        }
    })
});

app.get("/Map/GetOrderPoint", (req, res) => {
    let data = {
        Order: req.query.Ostate,
    }
    let sqlParams = [data.Order];
    db.query("select * from school.order WHERE Ostate = '" + data.Order + "'", function(error, results, fields) {
        if (error) {
            console.log(error)
        } else {
            res.send(results)
        }
    })
});

app.get("/Map/GetOrderPointById", (req, res) => {
    let data = {
        Order: req.query.Oid,
    }
    let sqlParams = [data.Order];
    db.query("select * from school.order WHERE Oid = '" + data.Order + "'", function(error, results, fields) {
        if (error) {
            console.log(error)
        } else {
            res.send(results)
        }
    })
});

app.post("/Map/SetOrder", (req, res) => {
    let RegData = {
        Oid: req.body.Oid,
        Odestination: req.body.Odestination,
        ODlon: req.body.ODlon,
        ODlat: req.body.ODlat,
    }
    let sqlParams = [RegData.Odestination, RegData.ODlat, RegData.ODlon, RegData.Oid];
    db.query('UPDATE school.order SET Odestination = ?, ODlat = ?, ODlon = ?,Ostate = "待处理" WHERE(Oid = ?)', sqlParams, function(err, data) {
        if (err) {
            res.send({ statusCode: 0, msg: '分配失败，请重试' })
        } else {
            res.send({ statusCode: 200, msg: '分配成功' })
        }
    })
});

app.get("/Map/GetHosList", (req, res) => {
    db.query("select Oid,Oaddress,Ostate from school.hospital_order", function(error, results, fields) {
        if (error) {
            console.log(error)
        } else {
            res.send(results)
        }
    })
});

app.get("/Map/GetHosPointById", (req, res) => {
    let data = {
        Order: req.query.Oid,
    }
    db.query("select * from school.hospital_order WHERE Oid = '" + data.Order + "'", function(error, results, fields) {
        if (error) {
            console.log(error)
        } else {
            res.send(results)
        }
    })
});

app.post("/Map/SetHosOrder", (req, res) => {
    let RegData = {
        Oid: req.body.Oid,
        Odestination: req.body.Odestination,
        ODlon: req.body.ODlon,
        ODlat: req.body.ODlat,
    }
    let sqlParams = [RegData.Odestination, RegData.ODlat, RegData.ODlon, RegData.Oid];
    db.query('UPDATE school.hospital_order SET Odestination = ?, ODlat = ?, ODlon = ?,Ostate = "待处理" WHERE(Oid = ?)', sqlParams, function(err, data) {
        if (err) {
            res.send({ statusCode: 0, msg: '分配失败，请重试' })
        } else {
            res.send({ statusCode: 200, msg: '分配成功' })
        }
    })
});

app.get("/Map/GetHosPointById", (req, res) => {
    let data = {
        Order: req.query.Oid,
    }
    db.query("select * from school.hospital_order WHERE Oid = '" + data.Order + "'", function(error, results, fields) {
        if (error) {
            console.log(error)
        } else {
            res.send(results)
        }
    })
});

app.get("/Map/Getvolunteer", (req, res) => {
    db.query("select * from school.rolelist", function(error, results, fields) {
        if (error) {
            console.log(error)
        } else {
            res.send(results)
        }
    })
});
/********************************************小程序的后台**************************************** */





//关键词查询
app.get("/query", (req, res) => {
    var queryParam = {
        word: req.query.keyword
    };
    var sqlParams = [queryParam.word];
    let sql = 'select * from xyhos where Name like "%"?"%"; ';
    db.query(sql, sqlParams, (e, results) => {
        if (!e) {
            res.send(results)
        } else {
            console.log(e.message);
        }
    })
});



app.get("/order/query/user", (req, res) => {
    let sql = 'SELECT * FROM school.order where Ouser = ?;';
    var sqlParams = [req.query["username"]];
    db.query(sql, sqlParams, (e, results) => {
        if (!e) {
            res.send(results);
        } else {
            console.log(e.message);
        }
    })
})


app.get("/order/query", (req, res) => {
    let sql = 'SELECT * FROM school.order;';
    var sqlParams = [];
    db.query(sql, sqlParams, (e, results) => {
        if (!e) {
            res.send(results);
        } else {
            console.log(e.message);
        }
    })
})

app.get("/order/update", (req, res) => {
    let sql = 'update school.order set Ostate = "进行中" where Oid = ?;';
    var sqlParams = [req.query["Oid"]];
    db.query(sql, sqlParams, (e, results) => {
        if (!e) {
            res.send(results);
        } else {
            console.log(e.message);
        }
    })
})

app.post("/order/add", (req, res) => {
    let sql = "insert into school.order(Oid, Ouser, Oaddress, OPlat, OPlon, Odetail, Ostate) values(?, ?, ?, ?, ?, ?, '待分配');";
    let Oid = Guid.raw();
    var sqlParams = [Oid, req.body["Ouser"], req.body["Oaddress"], req.body["OPlat"], req.body["OPlon"], req.body["Odetail"]];
    db.query(sql, sqlParams, (e, results) => {
        if (!e) {
            res.send(results);
        } else {
            console.log(e.message);
        }
    })
})


app.get("/hospital_order/query", (req, res) => {
    let sql = 'SELECT * FROM school.hospital_order;';
    var sqlParams = [];
    db.query(sql, sqlParams, (e, results) => {
        if (!e) {
            res.send(results);
        } else {
            console.log(e.message);
        }
    })
})

app.post("/hospital_order/add", (req, res) => {
    let sql = "insert into school.hospital_order(Oid, Ouser, Oaddress, OPlat, OPlon, Oparams, Ostate) values(?, ?, ?, ?, ?, ?, '待分配');";
    let Oid = Guid.raw();
    var sqlParams = [Oid, req.body["Ouser"], req.body["Oaddress"], req.body["OPlat"], req.body["OPlon"], req.body["Oparams"]];
    db.query(sql, sqlParams, (e, results) => {
        if (!e) {
            res.send(results);
        } else {
            console.log(e.message);
        }
    })
})

app.get("/FeverClinic/query", (req, res) => {
    let sql = "select * from school.feverclinic";
    var sqlParams;
    db.query(sql, sqlParams, (e, results) => {
        if (!e) {
            res.send(results);
        } else {
            console.log(e.message);
        }
    })
})

app.get("/testInstitution/query", (req, res) => {
    let sql = "select * from school.testinstitution";
    var sqlParams;
    db.query(sql, sqlParams, (e, results) => {
        if (!e) {
            res.send(results);
        } else {
            console.log(e.message);
        }
    })
})

app.get("/emergencyTreatment/query", (req, res) => {
    let sql = "select * from school.emergencytreatment";
    var sqlParams;
    db.query(sql, sqlParams, (e, results) => {
        if (!e) {
            res.send(results);
        } else {
            console.log(e.message);
        }
    })
})

app.get("/epidemicArea/query", (req, res) => {
    let sql = "select * from school.epidemicArea  ";
    if (req.query["limit"] != null) {
        sql += "limit " + req.query["limit"]
    }
    var sqlParams;
    db.query(sql, sqlParams, (e, results) => {
        if (!e) {
            res.send(results);
        } else {
            console.log(e.message);
        }
    })
})



app.get("/map", (req, res) => {
    res.sendFile(__dirname + "/" + "test.html")
})