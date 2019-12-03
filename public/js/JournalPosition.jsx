/** @jsx React.DOM */
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;


var JournalPosition = React.createClass({
    getInitialState: function () {
        return {
            currentId: -1,
            pid: -1,
            positions: [],
            dates: [],
            report: this.props.report,
            tags: [],
            tagSel: "All"

        };
    },
    componentDidMount: function () {


        var func = this.success;
        $.post("/switchPosition", {pid: this.props.pid, jid: this.props.jid, tag: "$USECURRENT"}, function (data) {
                console.log("componentDidMount tag=$USECURRENT");
                if(data.res == "OK")
                    func(data);
                else
                    alert (data.res)
                //this.setState({busy: true});
            }
        ).fail(function() {
            alert("Server is not responding.");
        });
    },
    keyg:55,
    newTags:"$",
    hasTag: function (currentTag, tags) {
        console.log(tags + "ct ="+currentTag)
        if(tags == "$N/A" || currentTag == "All" ) return true;
        let ts = tags.split(',');
        for (let i in ts) {
            if (currentTag.toUpperCase() == ts[i].toUpperCase().trim()) {
                return true;
            }
        }
        return false;
    },

    success: function (data) {

        this.setState({
            currentId: data.currentId, positions: data.positions, dates: data.dates, pid: data.pid,
            tags: data.tags, tagSel: data.currentTag
        });
        this.props.switchJournal(data.currentId, data.pid);

        // alert(this.state.currentId);
        for (let i in this.state.positions) {
            if (this.state.positions[i].jid == this.state.currentId) {
                if (this.state.positions[i].id != 0)
                    $("#mybidbuttonModala").addClass("disabled");
                else
                    $("#mybidbuttonModala").removeClass("disabled");
                break;
            }
        }
    },
    scrollToBottom: function () {
        const scrollHeight = this.messageList.scrollHeight;
        const height = this.messageList.clientHeight;
        const maxScrollTop = scrollHeight - height;
        this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    },
    fail: function () {

    },

    getFG: function (item) {
        let col = item.id == 0 ? "#7a414d" : "#20b2aa";
        return item.jid == this.state.currentId ? col : "white";
    },

    getBG: function (item) {
        let col = item.id == 0 ? "#7a414d" : "#20b2aa";
        return item.jid == this.state.currentId ? "white" : col;
    },
    getButtonText: function (item) {
        if (!this.getExpand(item)) return "ADD";
        return "EDIT";
    },

    getMode: function (item) {
        if (item.last) return 2;
        if (!this.getExpand(item)) return 0;
        return 1;
    },
    getExpand: function (item) {

        return item.last || item.text.length > 0;
    },

    switchPosition: function (id, jid) {
        //console.log(`id = ${id} jid = ${jid}`);
        var func = this.success;
        var sel = this.refs.tagsCombo.getConfigName();

        if(!sel)
            sel = "All";
        if( this.newTags != "$" && !this.hasTag(sel,this.newTags)) {
            if(this.newTags.length == 0)
                sel="All";
            else
                sel = this.newTags.split(",")[0].trim();
        }
        this.newTags = "$";
        console.log("switchPositiion sel"+sel);
        $.post("/switchPosition", {pid: id, jid: jid, tag: sel}, function (data) {
            if(data.res == "OK")
                func(data);
            else
                alert (data.res);
        })
    },
    okNewJournal: function (val, junk, dt, tags) {
        console.log("okNewJournal");
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
    okModJournal: function (val, junk, dt, tags) {
        console.log("okModJournal");
        this.newTags = tags;
        let func = this.switchPosition;
        $.post("/modJournal",
            {
                name: val,
                dt: dt,
                id: this.state.currentId,
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
    initValEmpty: function () {

        if (!this.state.tagSel || this.state.tagSel == 'All' )
            return "";

        return this.state.tagSel;
    },
    journalDate: function () {
        for (let i in this.state.positions) {
            if (this.state.positions[i].jid == this.state.currentId) {
                return this.state.positions[i].date;
                break;
            }
        }
        return "";
    },
    journalTags: function () {
        for (let i in this.state.positions) {
            if (this.state.positions[i].jid == this.state.currentId) {
                return this.state.positions[i].tags;
                break;
            }
        }
        return "";
    },
    journalName: function () {
        for (let i in this.state.positions) {
            if (this.state.positions[i].jid == this.state.currentId) {
                return this.state.positions[i].name;
                break;
            }
        }
        return "";
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
    getCurrentPosition:function () {
        for (let i in this.state.positions) {
            if (this.state.positions[i].jid == this.state.currentId) {
                return this.state.positions[i];
            }
        }
        return null;
    },
    switchTags: function () {
        console.log("switchTags");
        var id = this.refs.tagsCombo.getConfigName();
        this.setState({tagSel: id});
        if(this.getCurrentPosition() == null)
            this.switchPosition(-1,-1);
        else if( this.hasTag(id,this.getCurrentPosition().tags)) {
            this.switchPosition(this.props.pid, this.props.jid);
        }else {
            this.switchPosition(-1, -1);
        }
    },
    refreshSelections: function(){},

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
                              switchPosition={this.switchPosition} id={item.id} jid={item.jid}
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


        let newArray = this.state.dates;
        newArray = newArray.filter(function (item) {
            return me.props.report == "false" || item.text.length > 0 || item.last;
        });

        let notes =
            newArray.map((item, index) => {

                return (
                    <Row xs={12} className="container" key={this.state.currentId + item.dt}>
                        <Note bg="#c0c0c0" fs="18px" fg="black" date={item.date} text={item.text}
                              buttonText={this.getButtonText(item)} id={item.id} jid={this.state.currentId}
                              dt={item.dt} idx={index} key={this.state.currentId + item.dt}
                              positions={this.state.positions} report={this.props.report || item.last}
                              mode={this.getMode(item)} expand={this.getExpand(item)}/>
                    </Row>
                )
            });
        return (
            <div xs={12} className="container">
                <div xs={12} className="container">
                    <Row xs={12} className="container">

                        {true && <Col xs={2} className="showError">
                            <StockNameCombo ref="tagsCombo" names={this.state.tags} sel={this.state.tagSel}
                                            switchConfig={this.switchTags}/>
                        </Col>}
                        {this.state.report == "true" && <Col xs={2}/>}
                        {this.state.report == "false" && <Col xs={2}>
                            <JournalDlg dlgType={1} modal="Modala" buttonLabel="Modify Journal"
                                     title="Modify General Journal"
                                     genJournal={[]} gj="false" dt={this.journalDate()} tags={this.state.tags}
                                        setTags={this.journalTags()} rtags={[]}
                                        quit={this.refreshSelections}
                                     okFunc={this.okModJournal} label="Name" initVal={this.journalName()}/>
                        </Col> }
                        <Col xs={3}>
                            <h3> Journals </h3>
                        </Col>
                        {this.state.report == "false" && <Col xs={2}>
                            <JournalDlg dlgType={1} modal="Modaldd" buttonLabel="Create General Journal"
                                     title="New General Journal" rtags={[]}
                                        setTags={this.journalTags()} rtags={[]}
                                     genJournal={[]} gj="false" dt={this.formatDate()} tags={this.state.tags}
                                        quit={this.refreshSelections}
                                     okFunc={this.okNewJournal} label="Name" initVal=""/>
                        </Col> }
                    </Row>

                    <Row xs={12} className="container">
                        {positions}
                    </Row>


                </div>
                <div xs={12} className="container">
                    <Row xs={12} className="container">
                        <Col xs={4}/>
                        <Col xs={3}>
                            <h3> Notes </h3>
                        </Col>
                    </Row>
                    <div xs={11} className="container" style={{
                        fontSize: "18px", alignItems: "left", overflow: "auto",
                        height: '60vh'
                    }}>
                        {notes }
                    </div>
                </div>
            </div>

        );
    }


});




