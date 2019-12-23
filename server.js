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

const {Config} = require('./Config.js');
const {TradeInfo} = require('./TradeInfo.js');

const C = new Cookies();
let dbInfo = {
    host: C.MY_HOST,
    user: C.MY_USER,
    password: C.MY_DB_PW,
    database: C.MY_DB

}
let token = C.MY_TOKEN;
let connectCount = 0;
function xxx() {
    console.log("connectCount ="+connectCount);
}

function connectToDB() {
    if(connectCount > 0)
        xxx();
    var con = mysql.createConnection(dbInfo);
    con.connect();
    connectCount++;
    return con;

}

function terminateConnect(con) {
    con.end();
    connectCount--;
}

app = express();
app.use(express.static(__dirname + '/public'));


app.use(bp.urlencoded({extended: false}));


let user = {};

//let r =  new Result();


function login(con, name, pw) {

    var sql = "SELECT fname , user.iduser, userName, userPassword, currentConfig, currentPosition, " +
        "currentStock,currentTag FROM user " +
        "LEFT JOIN  user_info ON user.iduser = user_info.iduser   where userName ='" + name +
        "' and userPassword = '" + pw + "'";

   // console.log("sql " + sql);
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
            user.currentTag = lst[0].currentTag;
            user.currentPositionId = lst[0].currentPosition;
            user.fname = lst[0].fname;
            user.info.stkData = [];
        }
        let result = {email: name, badLogin: bl}
        res.json(result);
        terminateConnect(con);
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

    let data = await getDataFromDB(con, sql);

    sql = "INSERT INTO journal (name, openDate, createDate,modifyDate ,idposition,iduser) VALUES( '" + "First Position" +
        "' ,NOW(), NOW(),NOW()," + data.insertId + "," + user.idUser + ");";
    let r = await getDataFromDB(con, sql);
    return data;
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
        terminateConnect(con);
        let result = {user: data.email, duplicateUser: true};
        return result;
    }
    let cu = await createUser(con, data);
    user.idUser = cu.insertId;
    let cui = await createUserInfo(con, data);
    let cdc = await createDefaultConfig(con);
   // let cdp = await createDefaultPosition(con);
    let r = await updateCurrentConfigPosition(con, cdc.insertId,0);
    terminateConnect(con);
    user.info = new TradeInfo();
    user.info.currentConfigId = user.currentConfigId = cdc.insertId;
    user.info.config = user.config = new Config();

    //user.currentStock = 'RUT';
    user.currentPositionId = 0;

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
        terminateConnect(con);
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

    info.currentPositionId = id;
    // for (let i in info.positionNames) {
    //     if (id == info.positionNames[i].name) {
    //         info.currentPositionId = info.positionNames[i].idposition;
    //         break;
    //     }
    // }
    let con = connectToDB();
    updateCurrentPosition(con, info.currentPositionId).then((data) => {
        terminateConnect(con);
        user.currentPosition = info.currentPosition;
        user.currentPositionId = info.currentPositionId;

        res.json(info);
    }).catch(function (err) {
        console.log("ERROR chg position " + err)
        return;
    });
});
const newPosition = async (con, name, id) => {
    let times = "NOW(),NOW());";
    let sql = null;
    if (id != -1) {
        sql = "SELECT  createDate FROM journal  where idjournal = " + id + ";"
        let journals = await getDataFromDB(con, sql);
        let dt = moment(journals[0].createDate).format('YYYY-MM-DD HH:mm:ss')
        times = "'" + dt + "','" + dt + "');";
    }
    sql = "INSERT INTO position2 (iduser, name, createDate,modifyDate ) VALUES( " +
        +user.idUser + ",'" + name + "' ," + times;
    let data = await getDataFromDB(con, sql);
    sql = "UPDATE user SET   currentPosition =" + data.insertId +
        " where iduser = " + user.idUser;
    let r = await getDataFromDB(con, sql);
    if (id == -1)
        sql = "INSERT INTO journal (name, openDate, createDate,modifyDate ,idposition,iduser) VALUES( '" + name +
            "' ,NOW(), NOW(),NOW()," + data.insertId + "," + user.idUser + ");";
    else
        sql = "UPDATE journal SET   name ='" + name +
            "', idposition = " + data.insertId +
            " where idjournal = " + id;
    r = await getDataFromDB(con, sql);
    return data;
}
app.post('/newPosition', function (req, res) {
    let con = connectToDB();
    let name = req.body.name;
    let jid = req.body.id;
    let info2 = user.info;
    for (let i in info2.positionNames) {
        if (name == info2.positionNames[i].name) {
            let result = {dupName: name}
            res.json(result);
            terminateConnect(con);
            return;
        }
    }
    newPosition(con, name, jid).then(function (data) {
        let info = user.info;
        info.currentPosition = user.currentPosition = name;
        info.currentPositionId = user.currentPositionId = data.insertId;

        info.positionNames.push({name: name, idposition: data.insertId});
        res.json(info);
        terminateConnect(con);
    }).catch(function (err) {
        console.log("ERROR ERROR createposition " + err)
        return;
    });


});

const newJournal = async (con, name, dt, tags) => {

    sql = "INSERT INTO journal (name, tags, openDate, createDate,modifyDate ,idposition,iduser) VALUES( '" + name +
        "' ,'" + tags + "','" + dt + "', '" + dt + "','" + dt + "',0," + user.idUser + ");";
    r = await getDataFromDB(con, sql);
    return r.insertId;
}
app.post('/newJournal', function (req, res) {
    let con = connectToDB();
    let name = req.body.name;
    let dt = req.body.dt;
    let tags = req.body.tags;
    let info2 = user.info;
    for (let i in info2.positionNames) {
        if (name == info2.positionNames[i].name) {
            let result = {dupName: name}
            res.json(result);
            terminateConnect(con);
            return;
        }
    }
    newJournal(con, name, dt, tags).then(function (data) {
        terminateConnect(con);
        let result = {jid: data}
        res.json(result);
    }).catch(function (err) {
        console.log("ERROR ERROR createjournal " + err)
        return;
    });


});

const modJournal = async (con, name, dt, id, tags) => {


    var sql = "UPDATE journal SET  name = '" + name + "', tags = '" + tags + "'," +
        "openDate = '" + dt + "', " +
        "createDate = '" + dt + "', modifyDate = '" +
        dt + "' where idJournal = " + id;
    r = await getDataFromDB(con, sql);
    return id;
}


app.post('/modJournal', function (req, res) {
    let con = connectToDB();
    let name = req.body.name;
    let dt = req.body.dt;
    let id = req.body.id;
    let tags = req.body.tags;
    let info2 = user.info;
    for (let i in info2.positionNames) {
        if (name == info2.positionNames[i].name) {
            let result = {dupName: name}
            res.json(result);
            terminateConnect(con);
            return;
        }
    }

    modJournal(con, name, dt, id, tags).then(function (data) {
        terminateConnect(con);
        let result = {jid: id}
        res.json(result);
    }).catch(function (err) {
        console.log("ERROR ERROR  modify  journal " + err)
        return;
    });


});
const newConfig = async (con, name, c1, c2, c3, c4, c5, stocks) => {

    let data = await createConfig(con, name, c1, c2, c3, c4, c5, stocks);

    let r = await updateCurrentConfig(con, data.insertId);
    return data;
}

const getDataFromDB = async (con, sql) => {
    return new Promise((resolve, reject) => {
        con.query(sql, "", (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
};



const getDataFromDBParam = async (con, sql, params) => {
    return new Promise((resolve, reject) => {
        con.query(sql, params, (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
};

function hasTag(currentTag, tags) {
    let ts = tags.split(',');
    for (let i in ts) {
        if (currentTag.toUpperCase() == ts[i].trim().toUpperCase()) {
            return true;
        }
    }
    return false;
}

const setAsyncTags = async (con, journals, tagName) => {


    // journal only code

    let ops = [];


    for (let i in journals) {
        sql = "SELECT  idjournal, tags FROM journal  where idjournal = " + journals[i] + " ;"
        let j = await getDataFromDB(con, sql);
        let existingTags = j[0].tags;
        let allTags = existingTags.split(",");
        let tmpSet = new Set();
        for (let ii in allTags)
            tmpSet.add(allTags[ii]);
        allTags = tagName.split(",");
        for (let ii in allTags)
            tmpSet.add(allTags[ii]);
        let array = [];
        let tagList = "";
        tmpSet.forEach(v => array.push(v));
        for (let ii in array) {
            if (ii != 0)
                tagList += ",";
            tagList += array[ii].trim();
        }
        ;
        sql = "UPDATE journal SET   tags = '" + tagList +
            "' where idjournal = " + journals[i];
        let r = await getDataFromDB(con, sql);
        // if (tagName != "archived") {
        //     let t = tagName.split(",")[0].trim();
        //     sql = "UPDATE user SET   currentTag ='" + t +
        //         "' where iduser = " + user.idUser;
        //     user.currentTag = t;
        //
        //     let re = await getDataFromDB(con, sql);
        // }
    }

    terminateConnect(con);


    return;
};

const removeAsyncTags = async (con, journals, tagName) => {


    // journal only code

    let ops = [];



    for (let i in journals) {
        sql = "SELECT  idjournal, tags FROM journal  where idjournal = " + journals[i] + " ;"
        let j = await getDataFromDB(con, sql);
        let tagsForRemoval = tagName.split(",");
        let existingTags = j[0].tags;
        let allTags = existingTags.split(",");
        let tmpSet = new Set();
        for (let ii in allTags){
            if (!tagsForRemoval.includes(allTags[ii]))
                tmpSet.add(allTags[ii]);
        }
        let array = [];
        let tagList = "";
        tmpSet.forEach(v => array.push(v));
        for (let ii in array) {
            if (ii != 0)
                tagList += ",";
            tagList += array[ii].trim();
        }
        ;
        sql = "UPDATE journal SET   tags = '" + tagList +
            "' where idjournal = " + journals[i];
        let r = await getDataFromDB(con, sql);
        // if (tagName != "archived") {
        //     let t = tagName.split(",")[0].trim();
        //     sql = "UPDATE user SET   currentTag ='" + t +
        //         "' where iduser = " + user.idUser;
        //     user.currentTag = t;
        //
        //     let re = await getDataFromDB(con, sql);
        // }
        // if (!tagsForRemoval.includes(user.currentTag)){
        //     sql = "UPDATE user SET   currentTag ='" + "All" +
        //             "' where iduser = " + user.idUser;
        //         user.currentTag = "All";
        //
        //         let re = await getDataFromDB(con, sql);
        // }
    }

    terminateConnect(con);


    return;
};
const removeAsyncArchived = async (con, journals, tagName) => {


    // journal only code

    let ops = [];


    for (let i in journals) {
        sql = "SELECT  idjournal, tags FROM journal  where idjournal = " + journals[i] + " ;"
        let j = await getDataFromDB(con, sql);
        let tag = j[0].tags;
        if (tag.trim() == "archived") {
            tag = "";
        } else
            tag = tag.substr(0, tag.length - 9);
        sql = "UPDATE journal SET   tags = '" + tag +
            "' where idjournal = " + journals[i];
        let r = await getDataFromDB(con, sql);
    }

    terminateConnect(con);


    return;
};
const getAsyncTags = async (con, tagFlag, tag) => {


        // journal only code

        let ops = [];

        let sql;

        // check for tag switch
        if (tag != "$USECURRENT" && tag != user.currentTag) {
            sql = "UPDATE user SET   currentTag ='" + tag +
                "' where iduser = " + user.idUser;
            user.currentTag = tag;
           // console.log(`in getAsyncTag sql = ${sql}`);
            let re = await getDataFromDB(con, sql);
        }
        // get the general journals
        sql = "SELECT  idjournal, idposition, tags, name,createDate FROM journal  where iduser = " + user.idUser +
            " AND idposition = 0 ORDER BY createdate ASC;"

        let journals = await getDataFromDB(con, sql);
        terminateConnect(con);
        let tagSet = new Set();
        for (let i in journals) {
            if (journals[i].tags.length != 0) {
                let ts = journals[i].tags.split(',');
                if (journals[i].tags.length != 0) {
                    if(ts.includes("archived") && tagFlag == "true")
                        continue;
                    for (let t in ts) {
                        if(ts[t].trim().length== 0)
                            continue;
                        tagSet.add(ts[t].trim());
                    }
                }
            }
            if (tagFlag == "false" && hasTag("archived", journals[i].tags)) {
                ops.push({
                    id: 0,
                    jid: journals[i].idjournal,
                    name: journals[i].name,
                    tags: journals[i].tags,
                    date: moment(journals[i].createDate, 'YYYY-MM-DD HH:mm:ss').format("YYYY-MM-DD")
                });
            }
            if (tagFlag == "true" && !hasTag("archived", journals[i].tags) &&
                (user.currentTag == "All" || hasTag(user.currentTag, journals[i].tags))) {

                ops.push({
                    id: 0,
                    jid: journals[i].idjournal,
                    name: journals[i].name,
                    tags: journals[i].tags,
                    date: moment(journals[i].createDate, 'YYYY-MM-DD HH:mm:ss').format("YYYY-MM-DD")
                });
            }

        }
        let tagArray = ["All"];
        if (tagSet.size != 0) {
            tagSet.forEach(v => tagArray.push(v));
        }


        return [ops, tagArray];
    }
;

app.post('/unarchivedJournals', function (req, resp) { // switch journal
    let obj = req.body;
    let arr = obj["journals[]"];
    if (obj.len == 1)
        arr = [arr];
    let con = connectToDB();
    removeAsyncArchived(con, arr).then((data) => {

        resp.json({positions: 1});
    }).catch(function (err) {
        console.log("ERROR ERROR tag journal " + err);
        return;
    });

});

app.post('/tagJournals', function (req, resp) { // switch journal
    let obj = req.body;
    let arr = obj["journals[]"];
    if (obj.len == 1)
        arr = [arr];
    let con = connectToDB();
    setAsyncTags(con, arr, obj.tag).then((data) => {

        resp.json({positions: 1});
    }).catch(function (err) {
        console.log("ERROR ERROR tag journal " + err);
        return;
    });

});app.post('/removeJournalTags', function (req, resp) { // switch journal
    let obj = req.body;
    let arr = obj["journals[]"];
    if (obj.len == 1)
        arr = [arr];
    let con = connectToDB();
    removeAsyncTags(con, arr, obj.tag).then((data) => {

        resp.json({positions: 1});
    }).catch(function (err) {
        console.log("ERROR ERROR remove tag journal " + err);
        return;
    });

});

app.post('/tagJournals', function (req, resp) { // switch journal
    let obj = req.body;
    let arr = obj["journals[]"];
    if (obj.len == 1)
        arr = [arr];
    let con = connectToDB();
    setAsyncTags(con, arr, obj.tag).then((data) => {

        resp.json({positions: 1});
    }).catch(function (err) {
        console.log("ERROR ERROR tag journal " + err);
        return;
    });

});
app.post('/getTags', function (req, resp) { // switch journal
    let con = connectToDB();
    let obj = req.body;
   // console.log(`flag = ${obj.tagFlag} jid = ${obj.tag}`);
    getAsyncTags(con, obj.tagFlag, obj.tag).then((data) => {
        if(obj.tagFlag == "true" && data[0].length == 0){

            let con = connectToDB();
            getAsyncTags(con, obj.tagFlag, "All").then((data) => {
                resp.json({positions: data[0], tags: data[1], currentTag: user.currentTag});
            }).catch(function (err) {
                console.log("ERROR ERROR gettags " + err);
                return;
            });
        }
        else
            resp.json({positions: data[0], tags: data[1], currentTag: user.currentTag});
    }).catch(function (err) {
        console.log("ERROR ERROR gettags " + err);
        return;
    });
});
const getAsyncTradePerformance = async (con, journal, specificJID, specificPID, tag) => {
    let info = [];
    let tagSet = new Set();

    // figure out which positions are open



    // journal only code

    let ops = [];
    let pid = -1;
    let openDate;


    let journalAssigned = false;
    let spid = specificPID != -1 ? specificPID : user.currentPositionId;
    let jid = specificJID;
    let gjDate = null;
    // figure out the journal buttons
    for (let tp in info) {
        if (info[tp].status == "Open") {
            if (!journalAssigned) {
                journalAssigned = true;
                pid = info[tp].id;
                openDate = info[tp].openDate;
            }

            if (info[tp].id == spid) {
                pid = spid;
                openDate = info[tp].openDate;
            }
            sql = "SELECT  idjournal FROM journal where idposition = " + info[tp].id + ";";
            let r = await getDataFromDB(con, sql);
            if (pid == info[tp].id)
                jid = r[0].idjournal;
            ops.push({
                id: info[tp].id,
                jid: r[0].idjournal,
                name: info[tp].name,
                tags: "$N/A"
            })
        }
    }

    // check for tag switch
    if (tag != "$USECURRENT" && tag != user.currentTag) {
        sql = "UPDATE user SET   currentTag ='" + tag +
            "' where iduser = " + user.idUser;
        user.currentTag = tag;

        let re = await getDataFromDB(con, sql);

    }
    // get the general journals
    sql = "SELECT  idjournal, idposition, tags, name,createDate FROM journal  where iduser = " + user.idUser +
        " AND idposition = 0 ORDER BY createdate DESC;"

    let journals = await getDataFromDB(con, sql);
    let assignedJid = false;
    for (let i in journals) {
        if (!journalAssigned && jid == -1) {
            assignedJid = true;
            jid = journals[i].idjournal;
            gjDate = journals[i].createDate;
        }
        if (specificJID == journals[i].idjournal) {
            jid = specificJID;
            assignedJid = false;
            gjDate = journals[i].createDate;
        }
        journalAssigned = true;
        if (journals[i].tags.length != 0) {
            let ts = journals[i].tags.split(',');
            if(ts.includes("archived"))
                continue;
            for (let t in ts) {
                if(ts[t].trim().length== 0)
                    continue;
                tagSet.add(ts[t].trim());
            }
        }
        if (hasTag("archived", journals[i].tags)) {
            continue;
        }
        if (user.currentTag == "All" || hasTag(user.currentTag, journals[i].tags)) {
            if (assignedJid) {
                jid = journals[i].idjournal;
                gjDate = journals[i].createDate;
                assignedJid = false;
            }
            ops.push({
                id: 0,
                jid: journals[i].idjournal,
                name: journals[i].name,
                tags: journals[i].tags,
                date: moment(journals[i].createDate, 'YYYY-MM-DD HH:mm:ss').format("YYYY-MM-DD")
            });
        }
    }
    let tagArray = ["All"];
    if (tagSet.size != 0) {
        tagSet.forEach(v => tagArray.push(v));
    }
    let retJournal = [];
    let start;
    if (journalAssigned) {
        if (gjDate == null) {
            start = moment(openDate, 'YYYY-MM-DD');

            for (let i in positions) {
                if (pid == positions[i].idposition) {
                    start = moment(positions[i].createDate, 'YYYY-MM-DD HH:mm:ss');
                    break;
                }

            }
            if (moment(openDate, "YYYY-MM-DD") < start)
                start = openDate;
        } else {
            start = moment(gjDate, 'YYYY-MM-DD HH:mm:ss');
        }
        let end = moment().format("YYYY-MM-DD") + " 23:59:59";
        end = moment(end, 'YYYY-MM-DD HH:mm:ss');
        let weekdayCounter = 0;
        sql = "SELECT * FROM tr_journal_entries where  journal_id =" + jid + " ORDER BY tr_date ASC;";
        let jdata = await getDataFromDB(con, sql);
        let idx = 0;
        let item = jdata[idx];
        start = moment(start, "YYYY-MM-DD")
        while (start <= end) {
            if (true || start.format('ddd') !== 'Sat' && start.format('ddd') !== 'Sun') {
                weekdayCounter++; //add 1 to your counter if its not a weekend day
                let x = {
                    date: moment(start).format('dddd MMMM Do'),
                    id: -1,
                    text: "",
                    dt: start.format('YYYY-MM-DD'),
                    last: false
                };
                if (start.format('YYYY-MM-DD') == end.format('YYYY-MM-DD'))
                    x.last = true;
                if (item && moment(item.tr_date).format('YYYY-MM-DD') == start.format('YYYY-MM-DD')) {
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
    terminateConnect(con);
   // console.log("jid =" + jid);
    return [jid, ops, retJournal, pid, tagArray];
};

app.post('/switchPosition', function (req, resp) { // switch journal
    let con = connectToDB();
    let obj = req.body;
    getAsyncTradePerformance(con, true, obj.jid, obj.pid, obj.tag).then((data) => {
        resp.json({res:"OK",
            currentId: data[0], positions: data[1], dates: data[2], pid: data[3],
            tags: data[4], currentTag: user.currentTag
        });
    }).catch(function (err) {
        var d = Date(Date.now());

        // Converting the number of millisecond in date string
        let a = d.toString();
        let er = "ERROR switch positions ("+a+")" + err +"jid ="+ obj.jid+ " pid="+ obj.pid + " tag="+obj.tag;
        resp.json({res:er });
        return;
    });
});

const getAsyncSaveNote = async (con, specificJID, specificPID, noteId, text, dt) => {
    // edit a note in the journal
    let rid = noteId;
    if (noteId == -1) {
        if (text.length != 0) {
            sql = "INSERT INTO tr_journal_entries ( create_date,modified_date,tr_date,entry,journal_id )"
                + " VALUES( NOW(),NOW(),'" + dt + "',?," + specificJID + ");";
            let res = await getDataFromDBParam(con, sql, [text]);
            rid = res.insertId;
        }

    } else {
        if (text.length == 0) {
            sql = "DELETE FROM tr_journal_entries WHERE id = " + noteId + ";";
            await getDataFromDB(con, sql);
            rid = -1;
        } else {
            sql = "UPDATE tr_journal_entries SET  entry = ? WHERE id = " + noteId + ";";
            await getDataFromDBParam(con, sql, [text]);
        }

    }
    terminateConnect(con);
    return rid;
}
app.post('/saveNote', function (req, resp) {
    let con = connectToDB();
    let obj = req.body;
    getAsyncSaveNote(con, obj.jid, obj.pid, obj.id, obj.text, obj.dt).then((data) => {
        resp.json({rid: data});
    }).catch(function (err) {
        console.log("ERROR ERROR savenote " + err)
        return;
    });

});


app.post('/report', function (req, resp) {
    let con = connectToDB();

    getAsyncTradePerformance(con, false, -1, -1, -1).then((data) => {
        resp.json({data: data});
    }).catch(function (err) {
        console.log("ERROR report " + err)
        return;
    });
});
app.post('/deleteposition', function (req, resp) {
    let con = connectToDB();

    getAsyncDelPosition(con).then((data) => {
        user.currentPositionId = data[0].idposition;
        user.currentPosition = data[0].name;
        resp.json({success: true});
    }).catch(function (err) {
        let dt = moment().format('YY-MM-DD_HH-mm');
        let er = "ERROR deleteposition(" +dt+") "+ err + " pid ="+ data[0].idposition + " name= "+data[0].name;
        console.log(er)
        resp.json({success: false});
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
    terminateConnect(con);
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


const getAsyncExport = async (con, pos, trans) => {
    if (pos == -1) {
        pos = user.currentPositionId;
    }
    let sql = "SELECT  strike,qty,type,action,symbol,price, t.opra,t.transaction_time FROM position_transaction pt" +
        "  left join transaction t on  pt.idtransaction = t.idtransaction where idposition in (" + pos + ")";
    if (trans != undefined) {
        sql += " and t.idtransaction in (" + trans + ")";
    }
    sql += ";";
    let data = await getDataFromDB(con, sql);
    terminateConnect(con);
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
        let exec = moment(data[i].transaction_time).format('YYYY-MM-DD HH:mm:ss');
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
        sql = "INSERT INTO journal (name, openDate, createDate,modifyDate ,idposition,iduser) VALUES( '" + val +
            "' ,NOW(), NOW(),NOW()," + idPosition + "," + user.idUser + ");";
        let rr = await getDataFromDB(con, sql);
    } else {
        idPosition = pos;

    }
    let arr = sel.split(",");
    for (i in arr) {
        let idx = parseInt(arr[i]);
        let it = user.importTrans.buf[idx];
        let exp = moment(it.exp, 'YYYY-MM-DD').format('YYYY-MM-DD');
        let opra = it.underlying;
        let dt = exp.split("-");
        opra += dt[0].substring(2) + dt[1] + dt[2] +
            it.type.substring(0, 1) + it.strike;
        let ttime = it.transaction_time;
        let sql = "INSERT INTO transaction (iduser, strike,qty,type,action,symbol,price,expiration, opra," +
            "transaction_time, createDate,modifyDate ) VALUES(" +
            +user.idUser + "," +
            it.strike + "," +
            it.mag + "," +
            "'" + it.type.toLowerCase() + "'," +//call,put
            "'" + it.action.toLowerCase() + "'," +
            "'" + it.underlying + "'," +
            parseFloat(it.price) + "," +
            "'" + exp + "'," +
            "'" + opra + "'," +
            "'" +
            ttime +
            "'," +
            "NOW(),NOW());";
        let r = await getDataFromDB(con, sql);
        sql = "INSERT INTO position_transaction (idposition, idtransaction,  createDate,modifyDate ) VALUES(" +
            +idPosition + "," +
            +r.insertId + "," +
            "NOW(),NOW());";
        r = await getDataFromDB(con, sql);
    }
    terminateConnect(con);
    return arr.length;
};
let lastTransTime = 0

class ImportTrans {

    constructor(cnt, line) {
        let arr = line.split(",");
        this.cnt = cnt;
        if (arr[0].length < 2)
            this.transaction_time = lastTransTime;
        else {
            let ttime = arr[0];
            if (ttime.length < 18)
                ttime = moment(ttime, "MM/D/YY HH:mm:ss").format('YYYY-MM-DD HH:mm:ss');
            lastTransTime = this.transaction_time = ttime;
        }
        this.type = arr[7];
        this.underlying = arr[4];
        if (arr[5].includes(' ')) {
            this.exp = moment(arr[5], "D MMM YY").format('YYYY-MM-DD')
        } else
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
    let sel = req.body.sel;
    let pos = req.body.pos;
    let val = req.body.val;
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
    let trade_days = [];
    let form = new formidable.IncomingForm();
    let cnt = 0;
    form.parse(req, function (err, fields, files) {
        var fn = files.file;
        let firstLine = 0;
        let continueToRead = true;
        lineReader.eachLine(fn.path, function (line, last) {
            if (firstLine == 0) {
                if (line.includes("Account Trade History"))
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
                    let td = it.transaction_time.split(" ")[0];
                    if (!trade_days.includes(td)) {
                        trade_days.push(td);
                    }
                    buf.push(it);
                } else
                    continueToRead = false;
            }
            if (last) {
                user.importTrans = {};
                user.importTrans.buf = buf;
                exps.splice(0, 0, "All");
                user.importTrans.exps = exps;
                syms.splice(0, 0, "All");
                user.importTrans.syms = syms;
                trade_days.splice(0, 0, "All");
                user.importTrans.trade_days = trade_days;
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
try {

    var httpServer = http.createServer(app);

    //Set to 3000, but can be any port, code will only come over https, even if you specified http in your Redirect URI
    httpServer.listen(3000);
} catch (e) {
    consle.log ("SERVER err ("+moment().format('YY-MM-DD_HH-mm')+") "+err)

}




