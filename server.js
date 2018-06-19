/**
 * Created by lawrenceackner on 5/2/18.
 */
var fs = require('fs');
var http = require('http');
var https = require('https');
var request = require('request');
var express = require('express');
const bp = require("body-parser")
var mysql = require('mysql');

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

let dbInfo = {
    host: "localhost",
    user: "root",
    password: "",
    database: "Vproduction"

}
function connectToDB() {
    var con = mysql.createConnection(dbInfo);
    con.connect();
    return con;

}
let token = '';
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
            user.currentPosition = lst[0].currentPosition;
            user.fname = lst[0].fname;
        }
        let result = {email: name, badLogin: bl}
        res.json(result);
        con.end();
    }).catch(function (err) {
        console.log("ERROR ERROR login " + err)
        return;
    });


});

const createConfig = async (con,name, c1,c2,c3,c4,c5, stocks) => {
    var sql = "INSERT INTO user_config (iduser, name,column1,column2,column3,column4,column5,"+
        "stocks ,createDate, modifyDate) VALUES(" +
        +user.idUser+"," +
        "'"+name+"'," +
        "'"+c1+"'," +
        "'"+c2+"'," +
        "'"+c3+"'," +
        "'"+c4+"'," +
        "'"+c5+"'," +
        "'"+stocks+"'," +
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
    var sql = "UPDATE user SET  currentConfig = "+idconfig+" where iduser = "+user.idUser;
    return new Promise((resolve, reject) => {
        con.query(sql, "", (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
};
const newConfig = async(con,name, c1,c2,c3,c4,c5, stocks)  => {

    let data = await createConfig(con,name, c1,c2,c3,c4,c5, stocks);

    let r = await updateCurrentConfig(con,data.insertId);
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
    newConfig(con, name,c1,c2,c3,c4,c5, stocks).then(function (data) {
        let info = user.info;
        info.config.currentConfig = info.currentConfig = user.currentConfig = name;
        info.config.currentConfigId = info.currentConfigId = user.currentConfigId = data.insertId;

        info.config.configNames.push({name:name,idconfig:data.insertId});
        info.configNames =info.config.configNames
        res.json(info.config);
        con.end();
    }).catch(function (err) {
        console.log("ERROR ERROR createconfig " + err)
        return;
    });


});



function editConfig(con, c1,c2,c3,c4,c5, stocks) {

    var sql = "UPDATE user_config SET  column1 = '"+c1+"', column2 = '"+c2 +"', column3 = '"+c3+"', column4 = '"+
        c4 +"', column5 = '" +c5+"', stocks ='"+stocks+"', modifyDate = NOW() where idconfig = "+user.currentConfigId;


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
    editConfig(con, c1,c2,c3,c4,c5, stocks).then(function (lst) {

        let result = {result: "ok"}
        res.json(result);
        con.end();
    }).catch(function (err) {
        console.log("ERROR ERROR editconfig " + err)
        return;
    });


});
const switchConfig = async(con,id)  => {
    let info = user.info;
    let data = await    getConfig(con, id );
    let r = await updateCurrentConfig(con,id);
    return data;
}
app.post('/chgconfig', function (req, res) {

    let con = connectToDB();
    let id = req.body.id;
    let info = user.info;
    if(id == -1) {

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
        switchConfig(con, info.currentConfigId ).then((data) => {
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
            user.currentConfig  = info.config.currentConfig = info.currentConfig;
            user.currentConfigId  = info.config.currentConfigId = info.currentConfigId;

            res.json(info.config);
        }).catch(function (err) {
            console.log("ERROR ERROR config " + err)
            return;
        });
    }

    con.end();
});


const getStockData = async () => {

    return new Promise((resolve, reject) => {
        request(
            'https://smartdocs.tdameritrade.com/smartdocs/v1/sendrequest?targeturl=https%3A%2F%2Fapi.tdameritrade.com%2Fv1%2Fmarketdata%2Fchains%3Fapikey%3DFOLARTS%2540AMER.OAUTHAP%26symbol%3D'
            + "rut" + '%26strikeCount%3D' + 30 + '&_=' + token, function (error, response, body) {
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
    let sql =  "SELECT name, idposition FROM position " +
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

const getConfigNames= async (con, id) => {
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
let stkData = null;
const getAsyncData = async (con, user,trans) => {

    const configData = await  getConfig(con,  user.currentConfigId)
    let stkData =  user.info.stkData;
    if (stkData == null) {
        stkData = await  getStockData();
        user.info.stkData = stkData;
    }
    const configNames = await  getConfigNames(con,user.idUser);
    const positions = await  getPositions(con,user.idUser);
    return [configData,stkData,configNames,positions];
};
function extractData(expMap, underlyingPrice, map,offset) {
    let lst = [];

    let min = 5000;
    let  max =  0;
    let cnt =-1;
    for (let item in expMap) {
        lst.push(item);
        cnt+=1;
        if(cnt<parseInt(offset )|| cnt > parseInt(offset) +2)
            continue;

        let strikes = expMap[item];
        for (let idx in strikes) {
            if (idx < min){
                min = parseInt(idx);
            }
            if (idx >max){
                max = parseInt(idx);
            }
            max = parseInt(idx);
            let elems = strikes[idx];
            for (let i in elems)
                addData( item, elems[i], underlyingPrice, map);

        }
    }
    return [lst,min,max];
}
function getTableName(elem) {

    let exp = elem.symbol.split('_')[1].substring(0, 6);
    let name =  exp ;
    return name;

}
function addData(item,elem, underlyingPrice,  map) {
    let newPeriod = false;
    let tbl = item;


    if (map[tbl] == undefined) {
        map[tbl] = [];
        newPeriod = true;

    }
    map[tbl].push(elem);

    return newPeriod;
}
function generateData(res,info) {

    let callmap=[];
    let putmap=[];
    let arr = extractData(res.callExpDateMap,  res.underlyingPrice, callmap, info.offset);
    info.expNames = arr[0];
    extractData(res.putExpDateMap, res.underlyingPrice, putmap, info.offset);
    info.tradingPeriodCount =  info.expNames.length;
    info.underlyingLast = res.underlyingPrice.toFixed(2);

    info.period1 = info.expNames[info.offset].split(":")[0];
    info.expDay1 = "<" + info.expNames[info.offset ].split(":")[1] + ">";
    info.period2 = info.expNames[parseInt(info.offset) + 1].split(":")[0];
    info.expDay2 = "<" + info.expNames[parseInt(info.offset)+1].split(":")[1] + ">";
    info.period3 = info.expNames[parseInt(info.offset) + 2].split(":")[0];
    info.expDay3 = "<" + info.expNames[parseInt(info.offset) + 2].split(":")[1] + ">";


    let addRow = false;
    let lowLimit =  arr[1];
    let highLimit = arr[2];
    let cnt1 = 0;
    let cnt2 = 0;
    let cnt3 = 0;
    for (let i = lowLimit; i <= highLimit; i +=5) {

        let callRow = new MatrixRow(info.underlyingLast + "");
        callRow.setStrikePrice("" + i);
        let addRow = false;
        let tdp1 = callmap[info.expNames[parseInt(info.offset)]];
        let tdp2 = callmap[info.expNames[parseInt(info.offset) + 1]];
        let tdp3 = callmap[info.expNames[parseInt(info.offset) + 2]];
        let tdr1 = tdp1[cnt1];
        let tdr2 = tdp2[cnt2];
        let tdr3 = tdp3[cnt3];

        if (tdr1.strikePrice == i){
            cnt1++;
            addRow =true;
            mapData(tdr1, callRow, info.config, 1, null, "Call",tdp1, info);
        }
        if (tdr2.strikePrice == i){
            cnt2++;
            addRow =true;
            mapData(tdr2, callRow, info.config, 2, null, "Call",tdp2, info);
        }
        if (tdr3.strikePrice == i) {
            addRow = true;
            cnt3++;
            mapData(tdr3, callRow, info.config, 3, null, "Call", tdp3, info);
        }
        if(addRow)
            info.call.push(callRow);
    }

    cnt1 = 0;
    cnt2 = 0;
    cnt3 = 0;
    for (let i = lowLimit; i <= highLimit; i +=5) {

        let putRow = new MatrixRow(info.underlyingLast + "");
        putRow.setStrikePrice("" + i);
        let addRow = false;
        let tdp1 = putmap[info.expNames[parseInt(info.offset)]];
        let tdp2 = putmap[info.expNames[parseInt(info.offset) + 1]];
        let tdp3 = putmap[info.expNames[parseInt(info.offset) + 2]];
        let tdr1 = tdp1[cnt1];
        let tdr2 = tdp2[cnt2];
        let tdr3 = tdp3[cnt3];

        if (tdr1.strikePrice == i){
            cnt1++;
            addRow =true;
            mapData(tdr1, putRow, info.config, 1, null, "put",tdp1, info);
        }
        if (tdr2.strikePrice == i){
            cnt2++;
            addRow =true;
            mapData(tdr2, putRow, info.config, 2, null, "put",tdp2, info);
        }
        if (tdr3.strikePrice == i) {
            addRow = true;
            cnt3++;
            mapData(tdr3, putRow, info.config, 3, null, "put", tdp3, info);
        }
        if(addRow)
            info.put.push(putRow);
    }

}
function mapData(tdr, row, config, idx, transMap, type, tdp,info) {
    switch(idx) {
        case 1:
            row.setCol1a(selectColumn(config.col1,tdr, transMap, type, tdp));
            row.setCol2a(selectColumn(config.col2,tdr, transMap, type, tdp));
            row.setCol3a(selectColumn(config.col3,tdr, transMap, type, tdp));
            row.setCol4a(selectColumn(config.col4,tdr, transMap, type, tdp));
            row.setCol5a(selectColumn(config.col5,tdr, transMap, type, tdp));
            row.setMida(selectColumn("mid",tdr, transMap, type, tdp));
            row.setIva(selectColumn("iv", tdr, transMap, type, tdp));
            row.setCurrentPrice(parseFloat(info.underlyingLast));
            break;
        case 2:
            row.setCol1b(selectColumn(config.col1,tdr, transMap, type, tdp));
            row.setCol2b(selectColumn(config.col2,tdr, transMap, type, tdp));
            row.setCol3b(selectColumn(config.col3,tdr, transMap, type, tdp));
            row.setCol4b(selectColumn(config.col4,tdr, transMap, type, tdp));
            row.setCol5b(selectColumn(config.col5,tdr, transMap, type, tdp));
            row.setIvb(selectColumn("iv", tdr, transMap, type, tdp));
            row.setMidb(selectColumn("mid", tdr, transMap, type, tdp));

            break;

        case 3:
            row.setCol1c(selectColumn(config.col1,tdr, transMap, type, tdp));
            row.setCol2c(selectColumn(config.col2,tdr, transMap, type, tdp));
            row.setCol3c(selectColumn(config.col3,tdr, transMap, type, tdp));
            row.setCol4c(selectColumn(config.col4, tdr, transMap, type, tdp));
            row.setCol5c(selectColumn(config.col5,tdr, transMap, type, tdp));
            row.setIvc(selectColumn("iv", tdr, transMap, type, tdp));
            row.setMidc(selectColumn("mid", tdr, transMap, type, tdp));

            break;
    }
}
function selectColumn(val, tdr, transMap, type, tdp){
    switch (val){
        case "iv":
            return tdr["volatility"];

        case "mid":
            return parseFloat(((tdr["ask"] + tdr["bid"])/2).toFixed(2));

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
            let key = type + ":" + tdp.expiration +  ":" + tdp.strikePrice;
            if(transMap.get(key) == null || transMap.get(key).getQty()== 0)
                return "";
            else
                return String.valueOf(transMap.get(key).getQty());
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

    let info = user.info;
    let  config =new Config();
    info.offset = offset == -1? 0:offset;

    getAsyncData(con, user,trans).then((data) => {
        let configData = data[0];
        let stkData = data[1];
        info.configNames = data[2];
        for (let i in info.configNames)
             if(user.currentConfigId ==  info.configNames[i].idconfig){
                config.currentConfig =  info.configNames[i].name;
                break;
             }

        info.positionNames = data[3];
        info.idPosition = data[3][user.currentPosition].name;
        info.currentStock = 'RUT';
        info.stockNames = ['RUT'];
        config.setCol1(configData[0].column1);
        config.setCol2(configData[0].column2);
        config.setCol3(configData[0].column3);
        config.setCol4(configData[0].column4);
        config.setCol5(configData[0].column5);
        config.setStocks(configData[0].stocks);
        info.config = config;

        let res = decodeURIComponent(stkData.responseContent);
        res = JSON.parse(res);
        generateData(res,info);

        con.end();
        resp.json(info);
    }).catch(function (err) {
        console.log("ERROR ERROR login " + err)
        return;
    });



});


var httpServer = http.createServer(app);

//Set to 3000, but can be any port, code will only come over https, even if you specified http in your Redirect URI
httpServer.listen(3000);


/*********************************
 const getExchangeRate = async (from, to) => {
  const response = await axios.get('http://data.fixer.io/api/latest?access_key=d32d75de5146611ae7f23de0782ac09b');
  const euro = 1 / response.data.rates[from];
  const rate = euro * response.data.rates[to];
  return rate;
};

 const getCountries = async (currencyCode) => {
  const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
  return response.data.map((country) => country.name);
};

 const convertCurrency = async (from, to, amount) => {
  const rate = await getExchangeRate(from, to);
  const countries = await getCountries(to);
  const convertedAmount = (amount * rate).toFixed(2);
  return `${amount} ${from} is worth ${convertedAmount} ${to}. You can spend it in the following countries: ${countries.join(', ')}`;
};

 convertCurrency('USD', 'USD', 20).then((message) => {
  console.log(message);
});
 */