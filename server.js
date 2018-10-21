/**
 * Created by lawrenceackner on 5/2/18.
 */

var http = require('http');
var https = require('https');
var request = require('request');
var express = require('express');
const bp = require("body-parser")
var mysql = require('mysql');
var moment = require('moment');
var currencyFormatter = require('currency-formatter');
const {Cookies} = require('./Cookies.js');
const {Result} = require('./Result.js');
const {MatrixRow} = require('./MatrixRow.js');
const {Config} = require('./Config.js');
const {Transaction} = require('./Transaction.js');
const {TradeInfo} = require('./TradeInfo.js');
const {TradeLogInfo} = require('./TradeLogInfo.js');
const {TradePerformanceInfo} = require('./TradePerformanceInfo.js');
const {TradePerformance} = require('./TradePerformance.js');
const {TradeDataRow} = require('./TradeDataRow.js');
const {TradeDataCache} = require('./TradeDataCache.js');
const {TradeDataRepository} = require('./TradeDataRepository.js');
const {TradeDataPeriod} = require('./TradeDataPeriod.js');
const C = new Cookies();
let dbInfo = {
    host: C.MY_HOST,
    user: C.MY_USER,
    password: C.MY_DB_PW,
    database: C.MY_DB

}
let token = C.MY_TOKEN;
function connectToDB() {
    var con = mysql.createConnection(dbInfo);
    con.connect();
    return con;

}

app = express();
app.use(express.static(__dirname + '/public'));


app.use(bp.urlencoded({extended: false}));


let user = {};
//let r =  new Result();


function login(con, name, pw) {

    var sql = "SELECT fname , user.iduser, userName, userPassword, currentConfig, currentPosition, " +
        "currentStock FROM user " +
        "LEFT JOIN  user_info ON user.iduser = user_info.iduser   where userName ='" + name +
        "' and userPassword = '" + pw + "'";


    return new Promise((resolve, reject) => {
        con.query(sql, "", (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });

}
app.post('/login', function (req, res) {
    let con = connectToDB();
    let name = req.body.name;
    let pw = req.body.pw;
    login(con, name, pw).then(function (lst) {
        let bl = lst.length == 0;
        if (!bl) {
            user.info = new TradeInfo();
            user.info.config = user.config = new Config();
            user.info.currentConfigId = user.currentConfigId = lst[0].currentConfig;
            user.idUser = lst[0].iduser;
            user.currentStock = lst[0].currentStock;
            user.currentPositionId = lst[0].currentPosition;
            user.fname = lst[0].fname;
            user.info.stkData = [];
        }
        let result = {email: name, badLogin: bl}
        res.json(result);
        con.end();
    }).catch(function (err) {
        console.log("ERROR ERROR login " + err)
        return;
    });


});
const chkDuplicateUser = async (con, data) => {
    var sql = "SELECT userName FROM user WHERE userName = '" + data.email + "'";
    return new Promise((resolve, reject) => {
        con.query(sql, "", (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
};

const createUser = async (con, data) => {
    var sql = "INSERT INTO user (userName, userPassword, currentConfig, currentPosition,currentStock, createDate,modifyDate ) VALUES(" +
        "'" + data.email + "'," +
        "'" + data.pw + "'," +
        "0," +
        "0," +
        "'RUT'," +
        "NOW(),NOW());"
    return new Promise((resolve, reject) => {
        con.query(sql, "", (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
};
const createUserInfo = async (con, data) => {
    var sql = "INSERT INTO user_info (iduser,fname,lname,addr1,addr2,city,state,zip,country,email,telephone,mobile_tel,company,department, createDate,modifyDate ) VALUES(" +
        user.idUser + "," +
        "'" + data.fn + "'," +
        "'" + data.ln + "'," +
        "'" + data.ad1 + "'," +
        "'" + data.ad2 + "'," +
        "'" + data.city + "'," +
        "'" + data.state + "'," +
        "'" + data.zip + "'," +
        "'" + data.country + "'," +
        "'" + data.email + "'," +
        "'" + data.phone + "'," +
        "'" + data.mobile + "'," +
        "'" + data.company + "'," +
        "'" + data.dept + "'," +
        "NOW(),NOW());";
    return new Promise((resolve, reject) => {
        con.query(sql, "", (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
};
const createPosition = async (con, name) => {
    let sql = "INSERT INTO position2 (iduser, name, createDate,modifyDate ) VALUES( " +
        +user.idUser + ",'" + name + "' , NOW(),NOW());";
    return new Promise((resolve, reject) => {
        con.query(sql, "", (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
};
const createDefaultPosition = async (con) => {
    let sql = "INSERT INTO position2 (iduser,  createDate,modifyDate ) VALUES( " +
        +user.idUser + " , NOW(),NOW());";
    return new Promise((resolve, reject) => {
        con.query(sql, "", (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
};
const createDefaultConfig = async (con) => {
    var sql = "INSERT INTO user_config (iduser,  createDate,modifyDate ) VALUES(" +
        user.idUser + "," + "NOW(),NOW());";
    return new Promise((resolve, reject) => {
        con.query(sql, "", (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
};
const updateCurrentPosition = async (con, idposition) => {
    var sql = "UPDATE user SET   currentPosition =" + idposition +
        " where iduser = " + user.idUser;
    return new Promise((resolve, reject) => {
        con.query(sql, "", (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
};
const updateCurrentConfigPosition = async (con, idconfig, idposition) => {
    var sql = "UPDATE user SET  currentConfig = " + idconfig + ", currentPosition =" + idposition +
        " where iduser = " + user.idUser;
    return new Promise((resolve, reject) => {
        con.query(sql, "", (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
};
const register = async (con, data) => {
    let info = user.info;
    let cdu = await chkDuplicateUser(con, data);
    if (cdu.length > 0) {
        con.end();
        let result = {user: data.email, duplicateUser: true};
        return result;
    }
    let cu = await createUser(con, data);
    user.idUser = cu.insertId;
    let cui = await createUserInfo(con, data);
    let cdc = await createDefaultConfig(con);
    let cdp = await createDefaultPosition(con);
    let r = await updateCurrentConfigPosition(con, cdc.insertId, cdp.insertId);
    con.end();
    user.info = new TradeInfo();
    user.info.currentConfigId = user.currentConfigId = cdc.insertId;
    user.info.config = user.config = new Config();

    //user.currentStock = 'RUT';
    user.currentPositionId = cdp.insertId;

    let result = {user: data.email, duplicateUser: false};
    return result;
}
app.post('/reg', function (req, res) {
    let con = connectToDB();
    let d = {
        email: req.body.email,
        ad1: req.body.ad1,
        ad2: req.body.ad2,
        zip: req.body.zip,
        fn: req.body.fn,
        ln: req.body.ln,
        pw: req.body.password,
        phone: req.body.phone,
        mobile: req.body.mobile,
        city: req.body.city,
        state: req.body.state,
        dept: req.body.dept,
        company: req.body.company,
        country: req.body.country
    }
    register(con, d).then(function (data) {
        res.json(data);

    }).catch(function (err) {
        console.log("ERROR ERROR register " + err)
        return;
    });


});

app.post('/newConfig', function (req, res) {
    let con = connectToDB();
    let name = req.body.name;
    let c1 = req.body.col1;
    let c2 = req.body.col2;
    let c3 = req.body.col3;
    let c4 = req.body.col4;
    let c5 = req.body.col5;
    let stocks = req.body.stocks;
    newConfig(con, name, c1, c2, c3, c4, c5, stocks).then(function (data) {
        let info = user.info;
        info.config.currentConfig = info.currentConfig = user.currentConfig = name;
        info.config.currentConfigId = info.currentConfigId = user.currentConfigId = data.insertId;

        info.config.configNames.push({name: name, idconfig: data.insertId});
        info.configNames = info.config.configNames
        res.json(info.config);
        con.end();
    }).catch(function (err) {
        console.log("ERROR ERROR register " + err)
        return;
    });


});


const createConfig = async (con, name, c1, c2, c3, c4, c5, stocks) => {
    var sql = "INSERT INTO user_config (iduser, name,column1,column2,column3,column4,column5," +
        "stocks ,createDate, modifyDate) VALUES(" +
        +user.idUser + "," +
        "'" + name + "'," +
        "'" + c1 + "'," +
        "'" + c2 + "'," +
        "'" + c3 + "'," +
        "'" + c4 + "'," +
        "'" + c5 + "'," +
        "'" + stocks + "'," +
        "NOW(),NOW());";
    return new Promise((resolve, reject) => {
        con.query(sql, "", (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
};

const updateCurrentConfig = async (con, idconfig) => {
    var sql = "UPDATE user SET  currentConfig = " + idconfig + " where iduser = " + user.idUser;
    return new Promise((resolve, reject) => {
        con.query(sql, "", (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
};

app.post('/chgposition', function (req, res) {
    let id = req.body.name;
    let info = user.info;

    info.currentPosition = id;
    for (let i in info.positionNames) {
        if (id == info.positionNames[i].name) {
            info.currentPositionId = info.positionNames[i].idposition;
            break;
        }
    }
    let con = connectToDB();
    updateCurrentPosition(con, info.currentPositionId).then((data) => {
        con.end();
        user.currentPosition = info.currentPosition;
        user.currentPositionId = info.currentPositionId;

        res.json(info);
    }).catch(function (err) {
        console.log("ERROR ERROR config " + err)
        return;
    });
});
const newPosition = async (con, name, c1, c2, c3, c4, c5, stocks) => {

    let data = await createPosition(con, name);

    let r = await updateCurrentPosition(con, data.insertId);
    return data;
}
app.post('/newPosition', function (req, res) {
    let con = connectToDB();
    let name = req.body.name;

    newPosition(con, name).then(function (data) {
        let info = user.info;
        info.currentPosition = user.currentPosition = name;
        info.currentPositionId = user.currentPositionId = data.insertId;

        info.positionNames.push({name: name, idposition: data.insertId});
        res.json(info);
        con.end();
    }).catch(function (err) {
        console.log("ERROR ERROR createposition " + err)
        return;
    });


});


const newConfig = async (con, name, c1, c2, c3, c4, c5, stocks) => {

    let data = await createConfig(con, name, c1, c2, c3, c4, c5, stocks);

    let r = await updateCurrentConfig(con, data.insertId);
    return data;
}
app.post('/newConfig', function (req, res) {
    let con = connectToDB();
    let name = req.body.name;
    let c1 = req.body.col1;
    let c2 = req.body.col2;
    let c3 = req.body.col3;
    let c4 = req.body.col4;
    let c5 = req.body.col5;
    let stocks = req.body.stocks;
    newConfig(con, name, c1, c2, c3, c4, c5, stocks).then(function (data) {
        let info = user.info;
        info.config.currentConfig = info.currentConfig = user.currentConfig = name;
        info.config.currentConfigId = info.currentConfigId = user.currentConfigId = data.insertId;

        info.config.configNames.push({name: name, idconfig: data.insertId});
        info.configNames = info.config.configNames
        res.json(info.config);
        con.end();
    }).catch(function (err) {
        console.log("ERROR ERROR createconfig " + err)
        return;
    });


});


function editConfig(con, c1, c2, c3, c4, c5, stocks) {

    var sql = "UPDATE user_config SET  column1 = '" + c1 + "', column2 = '" + c2 + "', column3 = '" + c3 + "', column4 = '" +
        c4 + "', column5 = '" + c5 + "', stocks ='" + stocks + "', modifyDate = NOW() where idconfig = " + user.currentConfigId;


    return new Promise((resolve, reject) => {
        con.query(sql, "", (err, res) => {
            if (err)
                return reject(err);
            resolve(res);
        });
    });

}

app.post('/config', function (req, res) {
    let con = connectToDB();
    let c1 = req.body.col1;
    let c2 = req.body.col2;
    let c3 = req.body.col3;
    let c4 = req.body.col4;
    let c5 = req.body.col5;
    let stocks = req.body.stocks;
    editConfig(con, c1, c2, c3, c4, c5, stocks).then(function (lst) {

        let result = {result: "ok"}
        res.json(result);
        con.end();
    }).catch(function (err) {
        console.log("ERROR ERROR editconfig " + err)
        return;
    });


});
const switchConfig = async (con, id) => {
    let info = user.info;
    let data = await    getConfig(con, id);
    let r = await updateCurrentConfig(con, id);
    return data;
}
app.post('/chgconfig', function (req, res) {

    let con = connectToDB();
    let id = req.body.id;
    let info = user.info;
    if (id == -1) {

        info.config.configNames = info.configNames;
        res.json(info.config);

    } else {
        info.currentConfig = id;
        for (let i in info.configNames) {
            if (id == info.configNames[i].name) {
                info.currentConfigId = info.configNames[i].idconfig;
                break;
            }
        }
        let con = connectToDB();
        switchConfig(con, info.currentConfigId).then((data) => {
            con.end();
            let configData = data[0];
            let config = new Config();
            config.setCol1(configData.column1);
            config.setCol2(configData.column2);
            config.setCol3(configData.column3);
            config.setCol4(configData.column4);
            config.setCol5(configData.column5);
            config.setStocks(configData.stocks);
            info.config = config;
            info.config.configNames = info.configNames;
            user.currentConfig = info.config.currentConfig = info.currentConfig;
            user.currentConfigId = info.config.currentConfigId = info.currentConfigId;

            res.json(info.config);
        }).catch(function (err) {
            console.log("ERROR ERROR config " + err)
            return;
        });
    }

});


const getStockData = async () => {

    return new Promise((resolve, reject) => {
        request(
            'https://smartdocs.tdameritrade.com/smartdocs/v1/sendrequest?targeturl=https%3A%2F%2Fapi.tdameritrade.com%2Fv1%2Fmarketdata%2Fchains%3Fapikey%3DFOLARTS%2540AMER.OAUTHAP%26symbol%3D'
            + user.currentStock + '%26strikeCount%3D' + 40 + '&_=' + token, function (error, response, body) {
                if (!error && response.statusCode == 200) {

                    let res = null;
                    try {
                        res = JSON.parse(body);
                        resolve(res);
                    }
                    catch (err) {
                        console.log("ERROR ERROR " + err)
                        reject(err);
                    }
                } else
                    reject(error);

            });

    });
}
const getPositions = async (con, id) => {
    let sql = "SELECT name, idposition FROM position2 " +
        "  where iduser =" + id;
    return new Promise((resolve, reject) => {
        con.query(sql, "", (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
};
const getConfig = async (con, id) => {
    let sql = "SELECT column1 , column2, column3, column4,column5, stocks FROM user_config " +
        "  where idconfig = " + id;
    return new Promise((resolve, reject) => {
        con.query(sql, "", (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
};


const getConfigNames = async (con, id) => {
    let sql = "SELECT name, idconfig FROM user_config " +
        "  where iduser =" + id;
    return new Promise((resolve, reject) => {
        con.query(sql, "", (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
};


const getDataFromDB = async (con, sql) => {
    return new Promise((resolve, reject) => {
        con.query(sql, "", (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
};
const getAsyncData = async (con, user, trans, underlying) => {

    const configData = await  getConfig(con, user.currentConfigId);
    // make sure underlying is in config
    let stockNames = configData[0].stocks.split(",");
    if (!stockNames.includes(user.currentStock)) {
        underlying = user.currentStock = user.info.currentStock = stockNames[0];
        const result = await getDataFromDB(con,
            "UPDATE user SET  currentStock = '" + underlying + "' where iduser = " + user.idUser);
    }
    if (!user.info.stkData)
        user.info.stkData = [];
    let stkData = user.info.stkData;

    const configNames = await  getConfigNames(con, user.idUser);
    const positions = await  getPositions(con, user.idUser);
    if (underlying != "00" && user.currentStock != underlying) {
        user.currentStock = underlying;
        const result = await getDataFromDB(con,
            "UPDATE user SET  currentStock = '" + underlying + "' where iduser = " + user.idUser
        );
    }


    if (trans.length > 0) {
        let R = new Result();
        // create new transactions
        let iduser = user.idUser;
        let transactionsStr = trans.split(":");
        for (let i = 0; i < transactionsStr.length; i++) {
            let transactionStr = transactionsStr[i].split(",");

            let opra = underlying;
            let dt = transactionStr[R.EXP].split("-");
            opra += dt[0].substring(2) + dt[1] + dt[2] +
                transactionStr[R.T_TYPE].substring(0, 1) + transactionStr[R.STRIKE];
            let sql = "INSERT INTO transaction (iduser, strike,qty,type,action,symbol,price,expiration,opra, createDate,modifyDate ) VALUES(" +
                +iduser + "," +
                transactionStr[R.STRIKE] + "," +
                transactionStr[R.MAG] + "," +
                "'" + transactionStr[R.T_TYPE].toLowerCase() + "'," +
                "'" + transactionStr[R.T_ACTION].toLowerCase() + "'," +
                "'" + transactionStr[R.UNDERLYING] + "'," +
                transactionStr[R.MID] + "," +
                "'" + transactionStr[R.EXP] + "'," +
                "'" + opra + "'," +
                "NOW(),NOW());";

            let resu = await getDataFromDB(con, sql);
            let idtrans = resu.insertId;
            sql = "INSERT INTO position_transaction (idposition, idtransaction,  createDate,modifyDate ) VALUES(" +
                +user.currentPositionId + "," +
                +idtrans + "," +
                "NOW(),NOW());";
            resu = await getDataFromDB(con, sql);
        }
    }
    // get transactions and merge
    let sql = "SELECT  strike,qty,type,action,symbol,price,expiration, t.createDate FROM position_transaction pt" +
        "  left join transaction t on  pt.idtransaction = t.idtransaction where idposition = " + user.currentPositionId + ";";
    resultSet = await getDataFromDB(con, sql);


    con.end();
    if (stkData[user.currentStock] == undefined) {
        let stk = await  getStockData();
        user.info.stkData[user.currentStock] = stk;
    }
    return [configData, user.info.stkData[user.currentStock], configNames, positions, resultSet];
}

function extractData(expMap, underlyingPrice, map, offset) {
    let lst = [];

    let min = 5000;
    let max = 0;
    let cnt = -1;
    for (let item in expMap) {
        lst.push(item);
        cnt += 1;
        if (cnt < parseInt(offset) || cnt > parseInt(offset) + 2)
            continue;

        let strikes = expMap[item];
        for (let idx in strikes) {
            if (idx < min) {
                min = parseInt(idx);
            }
            if (idx > max) {
                max = parseInt(idx);
            }
            max = parseInt(idx);
            let elems = strikes[idx];
            for (let i in elems)
                addData(item, elems[i], underlyingPrice, map);

        }
    }
    return [lst, min, max];
}

function getTableName(elem) {

    let exp = elem.symbol.split('_')[1].substring(0, 6);
    let name = exp;
    return name;

}

function addData(item, elem, underlyingPrice, map) {
    let newPeriod = false;
    let tbl = item;


    if (map[tbl] == undefined) {
        map[tbl] = [];
        newPeriod = true;

    }
    map[tbl].push(elem);

    return newPeriod;
}

function generateData(res, info, transMap) {

    let callmap = [];
    let putmap = [];
    let arr = extractData(res.callExpDateMap, res.underlyingPrice, callmap, info.offset);
    info.expNames = arr[0];
    extractData(res.putExpDateMap, res.underlyingPrice, putmap, info.offset);
    info.tradingPeriodCount = info.expNames.length;
    info.underlyingLast = res.underlyingPrice.toFixed(2);

    info.period1 = info.expNames[info.offset].split(":")[0];
    info.expDay1 = "<" + info.expNames[info.offset].split(":")[1] + ">";
    info.period2 = info.expNames[parseInt(info.offset) + 1].split(":")[0];
    info.expDay2 = "<" + info.expNames[parseInt(info.offset) + 1].split(":")[1] + ">";
    info.period3 = info.expNames[parseInt(info.offset) + 2].split(":")[0];
    info.expDay3 = "<" + info.expNames[parseInt(info.offset) + 2].split(":")[1] + ">";
    info.call = [];
    info.put = []

    let addRow = false;
    let lowLimit = arr[1];
    let highLimit = arr[2];
    let cnt1 = 0;
    let cnt2 = 0;
    let cnt3 = 0;
    for (let i = lowLimit; i <= highLimit; i += 2.5) {

        let callRow = new MatrixRow(info.underlyingLast + "");
        callRow.setStrikePrice("" + i);
        let addRow = false;
        let tdp1 = callmap[info.expNames[parseInt(info.offset)]];
        let tdp2 = callmap[info.expNames[parseInt(info.offset) + 1]];
        let tdp3 = callmap[info.expNames[parseInt(info.offset) + 2]];
        let tdr1 = tdp1[cnt1];
        let tdr2 = tdp2[cnt2];
        let tdr3 = tdp3[cnt3];

        if (tdr1 != undefined && tdr1.strikePrice == i) {
            cnt1++;
            addRow = true;
            mapData(tdr1, callRow, info.config, 1, transMap, "call", info.period1, info);
        }
        if (tdr2 != undefined && tdr2.strikePrice == i) {
            cnt2++;
            addRow = true;
            mapData(tdr2, callRow, info.config, 2, transMap, "call", info.period2, info);
        }
        if (tdr3 != undefined && tdr3.strikePrice == i) {
            addRow = true;
            cnt3++;
            mapData(tdr3, callRow, info.config, 3, transMap, "call", info.period3, info);
        }
        if (addRow)
            info.call.push(callRow);
    }

    cnt1 = 0;
    cnt2 = 0;
    cnt3 = 0;
    for (let i = lowLimit; i <= highLimit; i += 2.5) {

        let putRow = new MatrixRow(info.underlyingLast + "");
        putRow.setStrikePrice("" + i);
        let addRow = false;
        let tdp1 = putmap[info.expNames[parseInt(info.offset)]];
        let tdp2 = putmap[info.expNames[parseInt(info.offset) + 1]];
        let tdp3 = putmap[info.expNames[parseInt(info.offset) + 2]];
        let tdr1 = tdp1[cnt1];
        let tdr2 = tdp2[cnt2];
        let tdr3 = tdp3[cnt3];

        if (tdr1 != undefined && tdr1.strikePrice == i) {
            cnt1++;
            addRow = true;
            mapData(tdr1, putRow, info.config, 1, transMap, "put", info.period1, info);
        }
        if (tdr2 != undefined && tdr2.strikePrice == i) {
            cnt2++;
            addRow = true;
            mapData(tdr2, putRow, info.config, 2, transMap, "put", info.period2, info);
        }
        if (tdr3 != undefined && tdr3.strikePrice == i) {
            addRow = true;
            cnt3++;
            mapData(tdr3, putRow, info.config, 3, transMap, "put", info.period3, info);
        }
        if (addRow)
            info.put.push(putRow);
    }

}

function mapData(tdr, row, config, idx, transMap, type, tdp, info) {
    switch (idx) {
        case 1:
            row.setCol1a(selectColumn(config.col1, tdr, transMap, type, tdp));
            row.setCol2a(selectColumn(config.col2, tdr, transMap, type, tdp));
            row.setCol3a(selectColumn(config.col3, tdr, transMap, type, tdp));
            row.setCol4a(selectColumn(config.col4, tdr, transMap, type, tdp));
            row.setCol5a(selectColumn(config.col5, tdr, transMap, type, tdp));
            row.setMida(selectColumn("mid", tdr, transMap, type, tdp));
            row.setIva(selectColumn("iv", tdr, transMap, type, tdp));
            row.setCurrentPrice(parseFloat(info.underlyingLast));
            break;
        case 2:
            row.setCol1b(selectColumn(config.col1, tdr, transMap, type, tdp));
            row.setCol2b(selectColumn(config.col2, tdr, transMap, type, tdp));
            row.setCol3b(selectColumn(config.col3, tdr, transMap, type, tdp));
            row.setCol4b(selectColumn(config.col4, tdr, transMap, type, tdp));
            row.setCol5b(selectColumn(config.col5, tdr, transMap, type, tdp));
            row.setIvb(selectColumn("iv", tdr, transMap, type, tdp));
            row.setMidb(selectColumn("mid", tdr, transMap, type, tdp));

            break;

        case 3:
            row.setCol1c(selectColumn(config.col1, tdr, transMap, type, tdp));
            row.setCol2c(selectColumn(config.col2, tdr, transMap, type, tdp));
            row.setCol3c(selectColumn(config.col3, tdr, transMap, type, tdp));
            row.setCol4c(selectColumn(config.col4, tdr, transMap, type, tdp));
            row.setCol5c(selectColumn(config.col5, tdr, transMap, type, tdp));
            row.setIvc(selectColumn("iv", tdr, transMap, type, tdp));
            row.setMidc(selectColumn("mid", tdr, transMap, type, tdp));

            break;
    }
}

function selectColumn(val, tdr, transMap, type, tdp) {
    switch (val) {
        case "iv":
            return parseFloat(tdr["volatility"]) / 100;

        case "mid":
            return parseFloat(((tdr["ask"] + tdr["bid"]) / 2).toFixed(2));

        case "volume":
        case "delta":
        case "gamma":
        case "theta":
        case "vega":
        case "ask":
        case "bid":
        case "last":
        case "open":
            return tdr[val];
        case "trade":
            return "";
        case "position":
            if (tdr.strikePrice == undefined)
                return "";
            let key = type + ":" + tdp + ":" + tdr.strikePrice;
            if (transMap[key] == undefined || transMap[key].getQty() == 0)
                return "";
            else
                return transMap[key].getQty();
    }
    return "tbd";
}

app.post('/tradetable', function (req, resp) {
    let con = connectToDB();
    let obj = req.body;
    let underlying = obj.underlying;
    let offset = obj.offset;
    let trans = obj.trans;
    let firstTime = obj.firstTime;
    let clear = false;
    let setOffset = false;
    let offsetExp = null;
    let TransMap = [];

    let info = user.info;
    let config = new Config();
    info.offset = offset == -1 ? 4 : offset;

    getAsyncData(con, user, trans, underlying).then((data) => {
        let trdata = data[4];
        for (let i in trdata) {
            let action = trdata[i].action == "buy" ? "Buy" : "Sell";
            let qty = parseInt(trdata[i].qty);
            let dt = moment(trdata[i].expiration).format('YYYY-MM-DD');
            let tm = moment(trdata[i].createDate).format('YYYY-MM-DD HH:mm:ss');
            let tr = new Transaction(parseFloat(trdata[i].strike), parseInt(trdata[i].qty), trdata[i].type == "call" ? "Call" : "Put",
                action, user.currentStock, parseFloat(trdata[i].price), dt, tm, 0);
            let finalTR = tr;
            let key = tr.getType().toLowerCase() + ":" + tr.getExpiration() + ":" + tr.getStrike();
            if (TransMap[key] != undefined) {
                finalTR = TransMap[key];
                let a = tr.getQty();
                let b = finalTR.getQty();
                let c = a + b;
                finalTR.qty = c;
                finalTR.action = c < 0 ? "Buy" : "Sell";
            }
            TransMap[key] = finalTR;
        }
        info.transactions = []
        for (let k in TransMap) {
            let tr = TransMap[k];
            if (tr.getQty() == 0) continue;

            info.transactions.push(tr);

        }
        let configData = data[0];
        let stkData = data[1];
        info.configNames = data[2];
        for (let i in info.configNames)
            if (user.currentConfigId == info.configNames[i].idconfig) {
                config.currentConfig = info.configNames[i].name;
                break;
            }

        info.positionNames = data[3];
        for (let i in info.positionNames)
            if (user.currentPositionId == info.positionNames[i].idposition) {
                info.currentPosition = info.positionNames[i].name;
                break;
            }
        info.currentStock = user.currentStock;
        info.stockNames = configData[0].stocks.split(",");

        config.setCol1(configData[0].column1);
        config.setCol2(configData[0].column2);
        config.setCol3(configData[0].column3);
        config.setCol4(configData[0].column4);
        config.setCol5(configData[0].column5);
        config.setStocks(configData[0].stocks);
        info.config = config;

        let res = decodeURIComponent(stkData.responseContent);
        res = JSON.parse(res);
        generateData(res, info, TransMap);

        user.info.res = res;

        for (let i in info.transactions) {
            let tr = info.transactions[i];
            var a = moment(tr.expiration);
            var b = moment();
            let w = a.diff(b, 'days')
            let strikeMap = res.callExpDateMap
            if (tr.type == "Put")
                strikeMap = res.putExpDateMap
            let strikes = strikeMap[tr.expiration + ":" + (parseInt(w) + 1)];

            for (let idx in strikes) {
                let elems = strikes[idx];
                for (let i in elems) {
                    if (elems[i].strikePrice == tr.strike) {
                        tr.iv = parseFloat(elems[i]["volatility"]) / 100;
                        tr.currentPrice = parseFloat(((elems[i]["ask"] + elems[i]["bid"]) / 2).toFixed(2));
                    }
                }
            }


        }
        resp.json(info);
    }).catch(function (err) {
        console.log("ERROR ERROR tradetable " + err)
        return;
    });


});
const getAsyncLog = async (con, del) => {

    user.currentPositionId
    let sql;
    if (del.length > 0) {
        // delete transactions
        let idTrans = del.split(",");
        for (let i in idTrans) {
            sql = "DELETE FROM transaction WHERE idtransaction = " + idTrans[i] + ";";
            let result = await getDataFromDB(con, sql);
            sql = "DELETE FROM position_transaction WHERE idtransaction = " + idTrans[i] + ";";
            result = await getDataFromDB(con, sql);
        }
    }
    sql = "SELECT name, idposition FROM position2 where iduser =" + user.idUser;
    const pos = await getDataFromDB(con, sql);

    sql = "SELECT  strike,qty,type,action,symbol,price,expiration, opra, t.idtransaction, t.createDate FROM position_transaction pt" +
        "  left join transaction t on  pt.idtransaction = t.idtransaction where idposition = " + user.currentPositionId + ";";
    const trans = await getDataFromDB(con, sql);
    con.end();
    return [pos, trans];
}
app.post('/tradelog', function (req, resp) {
    let con = connectToDB();
    let obj = req.body;
    let del = obj.del;
    getAsyncLog(con, del).then((data) => {
        let info = user.info;
        info.positionNames = data[0];
        for (let i in info.positionNames) {
            if (user.currentPositionId == info.positionNames[i].idposition) {
                info.currentPosition = info.positionNames[i].name;
                break;
            }
        }
        let trdata = data[1];
        let res = info.res;
        info.transactions = [];
        let cost = 0;
        let currentCost = 0;
        let now = moment().format('YYYY-MM-DD');
        let allExpired = true;
        let firstOpen = now;
        let allTrans = [];
        for (let i in trdata) {
            let action = trdata[i].action == "buy" ? "Buy" : "Sell";
            let qty = parseInt(trdata[i].qty);
            let dt = moment(trdata[i].expiration).format('YYYY-MM-DD');
            let cd = moment(trdata[i].createDate).format('YYYY-MM-DD');
            let tm = moment(trdata[i].createDate).format('YYYY-MM-DD HH:mm:ss');

            if (cd < firstOpen)
                firstOpen = cd;


            if (action == "Sell")
                qty *= -1;

            let tr = new Transaction(parseFloat(trdata[i].strike), qty, trdata[i].type == "call" ? "Call" : "Put",
                action, user.currentStock, parseFloat(trdata[i].price), dt, tm, trdata[i].idtransaction);
            allTrans.push(tr);
        }
        for (let i in allTrans) {
            let tr = allTrans[i];
            a = moment(tr.expiration);
            var b = moment();
            let w = a.diff(b, 'days')
            let strikeMap = res.callExpDateMap
            if (tr.type == "Put")
                strikeMap = res.putExpDateMap
            let strikes = strikeMap[tr.expiration + ":" + (parseInt(w) + 1)];

            for (let idx in strikes) {
                let elems = strikes[idx];
                for (let i in elems) {
                    if (elems[i].strikePrice == tr.strike) {
                        tr.currentPrice = parseFloat(((elems[i]["ask"] + elems[i]["bid"]) / 2).toFixed(2));
                    }
                }
            }


            info.transactions.push(tr);
        }
        let perf = calcPerformance("x", 0, trdata)
        info.currentValue = perf.realized;
        info.currentCost = perf.currentCost;
        info.cost = perf.cost;
        info.transcnt = info.transactions.length;
        resp.json(info);
    });
});

app.post('/editposition', function (req, resp) {
    let con = connectToDB();
    let obj = req.body;
    let name = obj.newName;
    let sql = "UPDATE position2 SET  name = '" + name + "' where idposition = " + user.currentPositionId;
    getDataFromDB(con, sql).then((data) => {
        con.end();
        for (let i in user.info.positionNames) {
            if (user.currentPositionId == user.info.positionNames[i].idposition) {
                user.info.positionNames[i].name = name;
                break;
            }
        }
        user.currentPosition = name;
        resp.json({data: user.info.positionNames});
    });
});

const getAsyncDelPosition = async (con,) => {

    let sql = "delete transaction FROM transaction  inner join position_transaction pt " +
        " on pt.idtransaction = transaction.idtransaction where idposition =" + user.currentPositionId + ";";
    let res = await getDataFromDB(con, sql);

    sql = "DELETE FROM position_transaction WHERE idposition = " + user.currentPositionId + ";";
    res = await getDataFromDB(con, sql);

    sql = "DELETE FROM position2 WHERE idposition = " + user.currentPositionId + ";";
    res = await getDataFromDB(con, sql);

    sql = "SELECT name, idposition FROM position2 " + "  where iduser =" + user.idUser + " limit 1";
    res = await getDataFromDB(con, sql);

    con.end();
    return res;
};
function calcPerformance(name, id, trdata) {
    let res = user.info.res;
    let now = moment().format('YYYY-MM-DD');
    let openDate = now;
    let consolidateTrans = [];
    let cost = 0;
    let currentCost = 0;
    for (let t in trdata) {
        let tr = trdata[t];

        if (consolidateTrans[tr.opra] == undefined)
            consolidateTrans[tr.opra] = [];
        consolidateTrans[tr.opra].push(tr);
        let cd = moment(tr.createDate).format('YYYY-MM-DD');
        if (cd < openDate)
            openDate = cd;

    }
    let closed = true;
    let realizedSum = 0;
    for (let t in consolidateTrans) {


        let realizedQty = 0;
        let realizedCost = 0;
        let pct = 0;
        for (let ii in consolidateTrans[t]) {

            let tr = consolidateTrans[t][ii];

            let action = tr.action == "buy" ? "Buy" : "Sell";
            let qty = parseInt(tr.qty);
            if (action == "Buy")
                qty *= -1;
            if (realizedQty == 0) {
                realizedQty = qty;
                realizedCost = qty * tr.price;
            } else {
                if ((realizedQty > 0 && qty < 0) || (realizedQty < 0 && qty > 0)) {
                    if (Math.abs(realizedQty) >= Math.abs(qty)) {
                        pct = Math.abs(qty) / Math.abs(realizedQty)
                        realizedSum += pct * realizedCost + qty * tr.price;
                        realizedCost = pct * realizedCost;
                        realizedQty = realizedQty + qty;
                    } else {
                        realizedSum += realizedCost + realizedQty * tr.price *
                            (realizedQty > 0 ? -1 : 1);
                        realizedCost = (realizedQty + qty) * tr.price;
                        realizedQty = realizedQty + qty;
                    }

                } else {
                    realizedCost += qty * tr.price;
                    realizedQty += realizedQty + qty;
                }
            }
        }

        if (realizedQty != 0) {
            let currentPrice = 0;
            let tr = consolidateTrans[t][0]

            let dt = moment(tr.expiration).format('YYYY-MM-DD');
            let type = tr.type == "call" ? "Call" : "Put";


            let price = parseFloat(tr.price);
            let strike = parseFloat(tr.strike);
            let a = moment(tr.expiration);
            let b = moment();
            let w = a.diff(b, 'days');
            let strikeMap = res.callExpDateMap
            if (type == "Put")
                strikeMap = res.putExpDateMap
            let strikes = strikeMap[dt + ":" + (parseInt(w) + 1)];

            for (let idx in strikes) {
                let elems = strikes[idx];
                for (let i in elems) {
                    if (elems[i].strikePrice == tr.strike) {
                        currentPrice = parseFloat(((elems[i]["ask"] + elems[i]["bid"]) / 2).toFixed(2));
                    }
                }
            }
            if (dt > now) {
                closed = false;
                cost += realizedCost;
                currentCost += realizedQty * currentPrice;
            } else { // expired
                let action = tr.action == "buy" ? "Buy" : "Sell";
                if (type == "Call") {
                    if (action == "Buy") {
                        if (tr.strike < user.info.underlyingLast) {
                            realizedSum += (user.info.underlyingLast - tr.strike) * Math.abs(realizedQty) - Math.abs(realizedCost);

                        } else {
                            realizedSum -= Math.abs(realizedCost);
                        }
                    } else {
                        if (tr.strike > user.info.underlyingLast) {
                            realizedSum += Math.abs(realizedCost);
                        } else {
                            realizedSum += -1 * ( user.info.underlyingLast - tr.strike  ) * Math.abs(realizedQty) + Math.abs(realizedCost);
                        }

                    }
                } else {
                    if (action == "Buy") { // put
                        if (tr.strike < user.info.underlyingLast) {
                            realizedSum += (user.info.underlyingLast - tr.strike) * Math.abs(realizedQty) - Math.abs(realizedCost);

                        } else {
                            realizedSum += -1 * Math.abs(realizedCost);
                        }
                    } else { // sell
                        if (tr.strike > user.info.underlyingLast) {
                            realizedSum += Math.abs(realizedCost);
                        } else {
                            realizedSum += -1 * (user.info.underlyingLast - tr.strike) * Math.abs(realizedQty) + Math.abs(realizedCost);
                        }

                    }
                }

            }
        }
    }
    realizedSum = currencyFormatter.format(realizedSum.toFixed(2) * 100, {code: 'USD'});
    let c = currencyFormatter.format(cost.toFixed(2) * 100, {code: 'USD'});
    let cc = currencyFormatter.format(currentCost.toFixed(2) * 100, {code: 'USD'});
    return new TradePerformance(name, c, cc, id, openDate, closed, realizedSum);
}
const getAsyncTradePerformance = async (con, journal, specficId, modNote, noteId, text,dt) => {
    let info = []
    let sql = "SELECT  iduser, idposition, name FROM position2 where iduser = " + user.idUser + ";";
    let positions = await getDataFromDB(con, sql);
    for (let i in positions) {
        let name = positions[i].name;

        let id = positions[i].idposition;
        sql = "SELECT  qty, action,price,expiration,type,strike,opra,t.createDate FROM position_transaction pt" +
            "  left join transaction t on  pt.idtransaction = t.idtransaction where idposition = " + id +
            ";";
        let trdata = await getDataFromDB(con, sql);


        info.push(calcPerformance(name, id, trdata));

    }


    if (!journal) {
        con.end();
        return info;
    }
    if (modNote) {
        if (noteId == -1) {
            if (text.length != 0) {
                sql = "INSERT INTO tr_journal_entries ( create_date,modified_date,tr_date,entry,position_id )"
                +" VALUES( NOW(),NOW(),'" +dt+"','"+text+"',"+specficId+");";
                await getDataFromDB(con, sql);
            }

        } else {
            if (text.length == 0) {
                sql = "DELETE FROM tr_journal_entries WHERE id = " + noteId + ";";
                await getDataFromDB(con, sql);
            }
            else {
                sql = "UPDATE tr_journal_entries SET  entry = '" + text + "' WHERE id = " + noteId + ";";
                 await getDataFromDB(con, sql);
            }

        }
    }
    let ops = [];
    let pid = -1;
    let openDate;
    let positionAssigned = false;
    let sid = specficId != -1 ? specficId : user.currentPosition;
    for (let tp in info) {
        if (info[tp].status == "Open") {
            if (!positionAssigned) {
                positionAssigned = true;
                pid = info[tp].id;
                openDate = info[tp].openDate;
            }

            if (info[tp].id == sid) {
                pid = sid;
                openDate = info[tp].openDate;
            }
            ops.push({
                id: info[tp].id,
                name: info[tp].name
            })
        }

    }
    let retJournal = [];
    if (positionAssigned) {


        let start = moment(openDate, 'YYYY-MM-DD'); //Pick any format
        let end = moment(); //right now (or define an end date yourself)
        let weekdayCounter = 0;
        sql = "SELECT * FROM tr_journal_entries where position_id =" + pid + " ORDER BY tr_date ASC;";
        let jdata = await getDataFromDB(con, sql);
        let idx = 0;
        let item = jdata[idx];

        while (start <= end) {
            if (start.format('ddd') !== 'Sat' && start.format('ddd') !== 'Sun') {
                weekdayCounter++; //add 1 to your counter if its not a weekend day
                let x = {
                    date: moment(start).format('dddd MMMM Do'),
                    id: -1,
                    text: "",
                    dt:start.format('YYYY-MM-DD')
                };
                if (moment(item.tr_date).format('YYYY-MM-DD') == start.format('YYYY-MM-DD')) {
                    x.id = item.id;
                    x.text = item.entry;
                    if (jdata.length - 1 > idx)
                        idx++;
                    item = jdata[idx];
                }
                retJournal.push(x);
            }
            start = moment(start, 'YYYY-MM-DD').add(1, 'days'); //increment by one day
        }

    }
    con.end();
    return [pid, ops, retJournal];
};

app.post('/switchPosition', function (req, resp) {
    let con = connectToDB();
    let obj = req.body;
    getAsyncTradePerformance(con, true, obj.pid, false, 0, "","2018-10-09").then((data) => {
        resp.json({currentId: data[0], positions: data[1], dates: data[2]});
    }).catch(function (err) {
        console.log("ERROR ERROR tradeperformance " + err)
        return;
    });
});
app.post('/saveNote', function (req, resp) {
    let con = connectToDB();
    let obj = req.body;
    getAsyncTradePerformance(con, true, obj.pid, true, obj.id, obj.text,obj.dt).then((data) => {
        resp.json({currentId: data[0], positions: data[1], dates: data[2]});
    }).catch(function (err) {
        console.log("ERROR ERROR tradeperformance " + err)
        return;
    });
});
app.post('/journal', function (req, resp) {
    let con = connectToDB();

    getAsyncTradePerformance(con, true, -1, false, 0, "","2018-10-09").then((data) => {
        resp.json({currentId: data[0], positions: data[1], dates: data[2]});
    }).catch(function (err) {
        console.log("ERROR ERROR tradeperformance " + err)
        return;
    });
});

app.post('/report', function (req, resp) {
    let con = connectToDB();

    getAsyncTradePerformance(con, false, -1, false, 0, "","2018-10-09").then((data) => {
        resp.json({data: data});
    }).catch(function (err) {
        console.log("ERROR ERROR tradeperformance " + err)
        return;
    });
});
app.post('/deleteposition', function (req, resp) {
    let con = connectToDB();

    getAsyncDelPosition(con).then((data) => {
        user.currentPositionId = data[0].idposition;
        user.currentPosition = data[0].name;
        resp.json({success: true});
    });
});

const getAsyncModTrans = async (con, trans) => {
    let transactionsStr = trans.split(":");
    for (let i in transactionsStr) {
        let transactionStr = transactionsStr[i].split(",");
        let sql = "UPDATE transaction SET  price = " + transactionStr[1] + ", qty = " +
            transactionStr[2] + " where idtransaction = " + transactionStr[0];
        let res = await getDataFromDB(con, sql);
    }
    con.end();
    return [];
};
app.post('/modifytrans', function (req, resp) {
    let con = connectToDB();
    let obj = req.body;
    let trans = obj.modify;

    getAsyncModTrans(con, trans).then((data) => {
        resp.json({success: true});
    });
});
const getAsyncMoveTrans = async (con, copy, move, create, mvpos, name, trans) => {
    let idNewPosition = 0;
    let idPosition = user.currentPositionId;
    let iduser = user.idUser;

    // create the new position
    let res;
    if (create) {

        let sql = "INSERT INTO position2 (iduser, name, createDate,modifyDate ) VALUES(" +
            +iduser + "," +
            "'" + name + "'," +
            "NOW(),NOW());";
        res = await getDataFromDB(con, sql);
        idNewPosition = res.insertId;
        if (!copy) {
            sql = "UPDATE position_transaction SET  idposition = " + idNewPosition + " where idposition  = " + idPosition +
                " AND idtransaction IN (" + trans + ");";
            res = await getDataFromDB(con, sql);
        } else {
            let idTrans = trans.split(",");
            for (let i = 0; i < idTrans.length; i++) {
                let transid = idTrans[i];
                sql = "INSERT INTO transaction (iduser, strike,qty,type,action,symbol,price,expiration, opra, createDate,modifyDate ) " +
                    "SELECT iduser, strike,qty,type,action,symbol,price,expiration, opra, createDate,modifyDate FROM transaction where idtransaction = " +
                    transid + ";";
                res = await getDataFromDB(con, sql);
                let idNewTransaction = res.insertId;
                sql = "INSERT INTO position_transaction (idposition, idtransaction,  createDate,modifyDate ) VALUES(" +
                    idNewPosition + "," +
                    +idNewTransaction + "," +
                    "NOW(),NOW());";
                res = await getDataFromDB(con, sql);
            }
        }
        if (move) {
            let idTrans = trans.split(",");
            for (let i = 0; i < idTrans.length; i++) {
                let transid = idTrans[i];
                sql = "INSERT INTO transaction (iduser, strike,qty,type,action,symbol,price,expiration, opra, createDate,modifyDate ) " +
                    "SELECT iduser, strike,qty,type,action,symbol,price,expiration, opra, createDate,modifyDate FROM transaction where idtransaction = " +
                    transid + ";";
                res = await getDataFromDB(con, sql);
                let idNewTransaction = res.insertId;
                sql = "INSERT INTO position_transaction (idposition, idtransaction,  createDate,modifyDate ) VALUES(" +
                    mvpos + "," +
                    +idNewTransaction + "," +
                    "NOW(),NOW());";
                res = await getDataFromDB(con, sql);
            }
        }


    }
    else if (!copy && move) {
        let sql = "UPDATE position_transaction SET  idposition = " + mvpos + " where idposition  = " + idPosition +
            " AND idtransaction IN (" + trans + ");";
        res = await getDataFromDB(con, sql);

    } else if (move) {
        let idTrans = trans.split(",");
        for (let i = 0; i < idTrans.length; i++) {
            let transid = idTrans[i];
            let sql = "INSERT INTO transaction (iduser, strike,qty,type,action,symbol,price,expiration, opra, createDate,modifyDate ) " +
                "SELECT iduser, strike,qty,type,action,symbol,price,expiration, opra, createDate,modifyDate FROM transaction where idtransaction = " +
                transid + ";";
            res = await getDataFromDB(con, sql);
            let idNewTransaction = res.insertId;
            sql = "INSERT INTO position_transaction (idposition, idtransaction,  createDate,modifyDate ) VALUES(" +
                mvpos + "," +
                +idNewTransaction + "," +
                "NOW(),NOW());";
            res = await getDataFromDB(con, sql);

        }
    }


    con.end();
    return [];
};

app.post('/movetrans', function (req, resp) {
    let con = connectToDB();
    let obj = req.body;
    let copy = obj.copy == "true";
    let move = obj.move == "true";
    let create = obj.create == "true";
    let trans = obj.trans;
    let mvpos = obj.id;
    let name = obj.name;
    for (let i in user.info.positionNames) {
        if (mvpos == user.info.positionNames[i].name) {
            mvpos = user.info.positionNames[i].idposition;
            break;
        }
    }
    getAsyncMoveTrans(con, copy, move, create, mvpos, name, trans).then((data) => {
        resp.json({success: true});
    }).catch(function (err) {
        console.log("ERROR ERROR mmovetrans " + err)
        return;
    });
});


const getAsyncExport = async (con, pos, trans) => {
    if (pos == -1) {
        pos = user.currentPositionId;
    }
    let sql = "SELECT  strike,qty,type,action,symbol,price, t.opra,t.createDate FROM position_transaction pt" +
        "  left join transaction t on  pt.idtransaction = t.idtransaction where idposition in (" + pos + ")";
    if (trans != undefined) {
        sql += " and t.idtransaction in (" + trans + ")";
    }
    sql += ";";
    let data = await getDataFromDB(con, sql);
    con.end();
    let mm = ["", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let froot = "positions_export_" + moment().format('YY-MM-DD_HH-mm') + ".csv"
    let fn = "/tmp/" + froot;
    var fs = require('fs');
    let logStream = fs.createWriteStream(fn, {'flags': 'w'});
    await logStream.write("Account Trade History\n");
    await logStream.write("Exec Time,Spread,Side,Qty,Symbol,Exp,Strike,Type,Price,Net Price,Opra\n");
    let cnt = 0;
    for (let i in data) {
        let strike = data[i].strike;
        let qty = data[i].qty;
        let type = data[i].type === "call" ? "CALL" : "PUT";
        let action = data[i].action === "buy" ? "BUY" : "SELL";
        let symbol = data[i].symbol;
        let price = data[i].price;
        let opra = data[i].opra;
        let month = opra.substring(symbol.length + 2, symbol.length + 4);
        month = mm[parseInt(month)];
        let exp = opra.substring(symbol.length + 4, symbol.length + 6) + " " + month + " " + opra.substring(symbol.length, symbol.length + 2);
        let exec = moment(data[i].createDate).format('M/D/YY HH:mm:ss');
        if (action == "SELL")
            qty *= -1;

        let line = exec + ",," + action + "," + qty + "," + symbol + "," + exp + "," + strike + "," +
            type + "," + price + "," + parseInt(qty) * parseFloat(price) + "," + opra + "\n";
        if (cnt == data.length - 1)
            await logStream.end(line);
        else
            await logStream.write(line);
        cnt++;
    }


    return fn;
};

app.get('/export', function (req, resp) {

    let con = connectToDB();
    let trans = req.param("trans");
    let positions = parseInt(req.param("positions"));


    getAsyncExport(con, positions, trans).then((fn) => {
        setTimeout(function () {
            resp.download(fn);
        }, 500);
    }).catch(function (err) {
        console.log("ERROR ERROR export " + err)
        return;
    });
});
const getAsyncUpload = async (sel, pos, val) => {

    let con = connectToDB();
    let res;
    let idPosition;
    if (pos == "Create...") {

        let sql = "INSERT INTO position2 (iduser, name, createDate,modifyDate ) VALUES(" +
            +user.idUser + "," +
            "'" + val + "'," +
            "NOW(),NOW());";
        res = await getDataFromDB(con, sql);
        idPosition = res.insertId;
        user.info.positionNames.push({name: val, idposition: idPosition})
    } else {
        for (let i in user.info.positionNames) {
            if (pos == user.info.positionNames[i].name) {
                idPosition = user.info.positionNames[i].idposition;
                break;
            }
        }
    }
    let arr = sel.split(",");
    for (i in arr) {
        let idx = parseInt(arr[i]);
        let it = user.importTrans.buf[idx];
        let exp = moment(it.exp).format('YYYY-MM-DD');
        let opra = it.underlying;
        let dt = exp.split("-");
        opra += dt[0].substring(2) + dt[1] + dt[2] +
            it.type.substring(0, 1) + it.strike;
        let sql = "INSERT INTO transaction (iduser, strike,qty,type,action,symbol,price,expiration, opra, createDate,modifyDate ) VALUES(" +
            +user.idUser + "," +
            it.strike + "," +
            it.mag + "," +
            "'" + it.type.toLowerCase() + "'," +//call,put
            "'" + it.action.toLowerCase() + "'," +
            "'" + it.underlying + "'," +
            parseFloat(it.price) + "," +
            "'" + exp + "'," +
            "'" + opra + "'," +
            "NOW(),NOW());";
        let r = await getDataFromDB(con, sql);
        sql = "INSERT INTO position_transaction (idposition, idtransaction,  createDate,modifyDate ) VALUES(" +
            +idPosition + "," +
            +r.insertId + "," +
            "NOW(),NOW());";
        r = await getDataFromDB(con, sql);
    }
    con.end();
    return arr.length;
};
class ImportTrans {

    constructor(cnt, line) {
        let arr = line.split(",");
        this.cnt = cnt;
        this.type = arr[7];
        this.underlying = arr[4];
        this.exp = arr[5];
        this.price = arr[8];
        this.strike = arr[6];
        this.action = arr[2];
        this.qty = arr[3];
        if (this.action == "SELL")
            this.qty = this.qty * -1;
        this.mag = this.qty < 0 ? -1 * this.qty : this.qty;

    }
}

app.post('/import', function (req, resp) {
    let sel = req.param("sel");
    let pos = req.param("pos");
    let val = req.param("val");
    getAsyncUpload(sel, pos, val).then(function (cnt) {
        resp.json({cnt: cnt});
    }).catch(function (err) {
        console.log("ERROR ERROR upload " + err)
        return;
    });


});
app.post('/upload', function (req, resp) {

    let formidable = require('formidable');
    let lineReader = require('line-reader');
    let buf = [];
    let syms = [];
    let exps = [];
    let form = new formidable.IncomingForm();
    let cnt = 0;
    form.parse(req, function (err, fields, files) {
        var fn = files.file;
        let firstLine = 0;
        let continueToRead = true;
        lineReader.eachLine(fn.path, function (line, last) {
            if (firstLine == 0) {
                if (line == "Account Trade History")
                    firstLine = 1;
            } else if (firstLine == 1) {
                firstLine = 2;
            } else {
                if (line.length != 0 && continueToRead) {
                    let it = new ImportTrans(cnt++, line);
                    if (!exps.includes(it.exp))
                        exps.push(it.exp);
                    if (!syms.includes(it.underlying))
                        syms.push(it.underlying);
                    buf.push(it);
                }
                else
                    continueToRead = false;
            }
            if (last) {
                user.importTrans = {};
                user.importTrans.buf = buf;
                exps.splice(0, 0, "All");
                user.importTrans.exps = exps;
                syms.splice(0, 0, "All");
                user.importTrans.syms = syms;
                var clonedArray = JSON.parse(JSON.stringify(user.info.positionNames));
                clonedArray.push({name: "Create...", idposition: 0})
                user.importTrans.positionNames = clonedArray;
                user.importTrans.currentPosition = user.info.currentPosition;
                resp.json({importTrans: user.importTrans});

            }
        });
        let a = 0;
    });

});


var httpServer = http.createServer(app);

//Set to 3000, but can be any port, code will only come over https, even if you specified http in your Redirect URI
httpServer.listen(3000);


