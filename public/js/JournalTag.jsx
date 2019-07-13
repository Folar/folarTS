/** @jsx React.DOM */
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;


var JournalTag = React.createClass({
    getInitialState: function () {
        return {
            positions: [],
            mySet: new Set(),
            lbl: "Archived",
            tags: [],
            removeTags: [],
            journals: "",
            tagSel:""

        };
    },
    fixTags: function () {
        var func = this.success;
        var id = "All";
        this.setState({tagSel: id});
        $.post("/getTags", {tagFlag: this.props.tag, tag: id}, function (data) {
                func(data);
                //this.setState({busy: true});
            }
        ).fail(function() {
            alert("Server is not responding.");
        })

    },
    switchTags: function () {
        var func = this.success;
        var id = this.refs.tagsCombo.getConfigName();
        this.setState({tagSel: id});
        $.post("/getTags", {tagFlag: this.props.tag, tag: id}, function (data) {
                func(data);
                //this.setState({busy: true});
            }
        ).fail(function() {
            alert("Server is not responding.");
        })

    },
    componentDidMount: function () {
        var func = this.success;
        $("#mybidbuttonModalTag").addClass("disabled");
        $("#mybidbuttonModalTagR").addClass("disabled");
        $("#archBtn").addClass("disabled");
        $.post("/getTags", {tagFlag: this.props.tag, tag: "$USECURRENT"}, function (data) {
                func(data);
                //this.setState({busy: true});
            }
        ).fail(function() {
            alert("Server is not responding.");
        })
    },
    newTags: "$",
    hasTag: function (currentTag, tags) {
        if (tags == "$N/A" || currentTag == "All") return true;
        let ts = tags.split(',');
        for (let i in ts) {
            if (currentTag.toUpperCase() == ts[i].toUpperCase().trim()) {
                return true;
            }
        }
        return false;
    },

    success: function (data) {
        this.mySet.clear();
        this.nameSet.clear();
        this.tagMap = [];
        let buttonLbl = "Archived";
        if (this.props.tag != "true") {
            buttonLbl = "Unarchived";
            // alert(buttonLbl)
        }
        $("#archBtn").addClass("disabled");
        $("#mybidbuttonModalTag").addClass("disabled");
        $("#mybidbuttonModalTagR").addClass("disabled");


        console.log("bligl" +this.state.tagSel);
        if(this.state.tagSel.length >0 && data.currentTag != this.state.tagSel&& data.currentTag == "All"){
            this.state.tagSel = "All";
            this.fixTags();
            console.log("FIXXXXXX");
        }else {
            this.setState({
                positions: data.positions, mySet: this.mySet, lbl: buttonLbl, tags: data.tags,
                tagSel: data.currentTag, removeTags: []
            });
        }


    },

    fail: function () {

    },

    getFG: function (item) {
        let col = item.id == 0 ? "#7a414d" : "#20b2aa";
        return this.state.mySet.has(item.jid) ? col : "white";
    },

    getBG: function (item) {
        let col = item.id == 0 ? "#7a414d" : "#20b2aa";
        return this.state.mySet.has(item.jid) ? "white" : col;
    },


    okNewJournal: function (val, junk, dt, tags) {
        let func = this.switchPosition;
        this.newTags = tags;
        $.post("/newJournal",
            {
                name: val,
                dt: dt,
                tags: tags
            },
            function (data) {
                if (data.dupName) {
                    alert('Journal ' + data.dupName + ' already exists!')
                }
                func(0, data.jid);

            }
        ).fail(function() {
            alert("Server is not responding.");
        });
    },
    fixMapAdd: function (val) {
        let array = [];
        let txt = ""
        this.nameSet.forEach(v => array.push(v));
        for (let i in array) {

            let tags = this.tagMap[array[i]].split(",");
            let s = new Set();
            for (let ii in tags) {
                s.add(tags[ii]);
            }
            tags = val.split(",");
            for (let ii in tags) {
                s.add(tags[ii]);
            }
            let array2 = [];
            s.forEach(v => array2.push(v));
            txt = ""

            for (let j in array2) {

                if (j != 0)
                    txt+=","
                txt += array2[j];
            }
            this.tagMap[array[i]] = txt;
        }
        let ta = this.gatherTags();
        this.setState({removeTags: ta});
    },
    okModJournal: function (val, junk, dt, tags) {
        let cmd = "/tagJournals";
        let array = [];
        let func = this.getJournals;
        let len = this.mySet.size;
        this.fixMapAdd(val);

        this.mySet.forEach(v => array.push(v));

        $.post(cmd, {journals: array, tag: val, len: len}, function (data) {
            func();
        }).fail(function() {
            alert("Server is not responding.");
        });
    },
    fixMapRemove: function (val) {
        let array = [];
        let txt = ""
        this.nameSet.forEach(v => array.push(v));


        for (let i in array) {
            let  tagsForRemoval = val.split(",");
            let tags = this.tagMap[array[i]].split(",");
            let s = new Set();
            for (let ii in tags) {
                if(!tagsForRemoval.includes(tags[ii]))
                    s.add(tags[ii]);
            }

            let array2 = [];
            s.forEach(v => array2.push(v));
            txt = ""

            for (let j in array2) {

                if (j != 0)
                    txt+=","
                txt += array2[j];
            }
            this.tagMap[array[i]] = txt;
        }
        let ta = this.gatherTags();
        this.setState({removeTags: ta});
    },

    okRemoveTags: function (val, junk, dt, tags) {
        let cmd = "/removeJournalTags";
        let array = [];
        let func = this.getJournals;
        let len = this.mySet.size;
        this.fixMapRemove(val);

        this.mySet.forEach(v => array.push(v));

        $.post(cmd, {journals: array, tag: val, len: len}, function (data) {
            func();
        }).fail(function() {
            alert("Server is not responding.");
        });
    },
    initValEmpty: function () {

        if (!this.state.tagSel || this.state.tagSel == 'All')
            return "";

        return this.state.tagSel;
    },

    formatDate: function () {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return year + "-" + month + "-" + day;
    },
    mySet: new Set(),
    nameSet: new Set(),
    tagMap: [],
    keyg:555,
    archived: function () {
        let array = [];
        let cmd = "/unarchivedJournals";
        if (this.props.tag == "true")
            cmd = "/tagJournals";

        let func = this.getJournals;
        let len = this.mySet.size;
        this.mySet.forEach(v => array.push(v));
        $.post(cmd, {journals: array, tag: "archived", len: len}, function (data) {

            func();
        }).fail(function() {
            alert("Server is not responding.");
        });
        // console.log("archived....")

    },
    getJournals: function () {
        // console.log("gj....");
        let func = this.success;
        $.post("/getTags", {tagFlag: this.props.tag, tag: "$USECURRENT"}, function (data) {

            func(data);
        }).fail(function() {
            alert("Server is not responding.");
        });
    },
    gatherTags: function () {
        let s = new Set();
        for (i in this.tagMap) {
            let ts = this.tagMap[i].split(",");
            for (ii in ts) {
                if(ts[ii].trim().length>0)
                    s.add(ts[ii])
            }
        }
        let array = [];
        s.forEach(v => array.push(v));
        return array;

    },
    selectPosition: function (item, jid) {
        let txt = "";

        if (this.mySet.has(jid)) {
            this.mySet.delete(jid);
            delete this.tagMap[item.name];
            this.nameSet.delete(item.name);
        } else {
            this.mySet.add(jid);
            this.nameSet.add(item.name);
            this.tagMap[item.name] = item.tags
        }
        let array = [];
        this.nameSet.forEach(v => array.push(v));
        for (let ii in array) {
            if (ii != 0)
                txt += ",";
            txt += array[ii].trim();
        }

        if (this.mySet.size > 0) {
            $("#mybidbuttonModalTag").removeClass("disabled");
            $("#mybidbuttonModalTagR").removeClass("disabled");
            $("#archBtn").removeClass("disabled");
        } else {
            $("#archBtn").addClass("disabled");
            $("#mybidbuttonModalTag").addClass("disabled");
            $("#mybidbuttonModalTagR").addClass("disabled")
        }
        let ta = this.gatherTags();
        this.setState({mySet: this.mySet, journals: txt, removeTags: ta});
    },

    render: function () {
        let me = this;
        let positionBoxes=[] ;
        for(let i = 0 ;i<this.state.positions.length;i+=5 ) {
            let lim = i + 5 > this.state.positions.length? this.state.positions.length - i:5;
            var clonedArray = JSON.parse(JSON.stringify(this.state.positions));
            let boxes = clonedArray.splice(i, lim).map((item, index) => {
                return (

                    <Col xs={2} className="positionLbl" key={item.jid}>
                        <Card bg={this.getBG(item)} fs="18px" fg={this.getFG(item)} name={item.name} height="30px"
                              switchPosition={this.selectPosition} id={item} jid={item.jid}
                              width="140px"/>
                    </Col>
                )
            });
            positionBoxes.push(boxes);
        }

        let positions = positionBoxes.map((item, index) => {

            return (
                <Row xs={12} className="container" key={this.keyg++}>
                    {positionBoxes[index]}
                </Row>
            )
        });


        return (
            <div xs={12} className="container">
                <div xs={12} className="container">
                    <Row xs={12} className="container">

                        {this.props.tag == "true" && this.state.tags && <Col xs={2} className="showError">
                            <StockNameCombo ref="tagsCombo" names={this.state.tags} sel={this.state.tagSel}
                                            switchConfig={this.switchTags}/>
                        </Col>}

                        <Col xs={2}>
                            <button type="button" id="archBtn" className="btn btn-primary" onClick={this.archived}>
                                {this.state.lbl}
                            </button>
                        </Col>
                        {this.props.tag == "true" && <Col xs={2}>
                            <JournalDlg dlgType={0} modal="ModalTag" buttonLabel={"Tag journals"}
                                        title={"Tag the journals " + this.state.journals} tags={this.state.tags}
                                        rtags={this.state.removeTags}
                                        okFunc={this.okModJournal} label="Name" initVal={""}/>
                        </Col>}
                        {this.props.tag == "true" && <Col xs={2}>
                            <JournalDlg dlgType={2} modal="ModalTagR" buttonLabel={"Remove Tags"}
                                        title={"Remove tags from the journals " + this.state.journals}
                                        tags={this.state.tags}
                                        rtags={this.state.removeTags}
                                        okFunc={this.okRemoveTags} label="Name" initVal={""}/>
                        </Col>}

                    </Row>
                    <div className="overflowy">
                            {positions}

                    </div>

                </div>

            </div>

        );
    }


});




