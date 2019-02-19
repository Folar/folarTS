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
            pid:-1,
            positions: [],
            dates: [],
            report:this.props.report

        };
    },
    componentDidMount: function () {


        var func = this.success;
        $.post("/switchPosition", {pid: this.props.pid, jid: this.props.jid}, function (data) {
        //$.post("/journal", {}, function (data) {
                func(data);
                //this.setState({busy: true});
            }
        )
    },

    success: function (data) {
        this.setState({currentId: data.currentId, positions: data.positions, dates: data.dates,pid:data.pid});
        this.props.switchJournal(data.currentId,data.pid);
       // alert(this.state.currentId);
        for (let i in this.state.positions) {
            if (this.state.positions[i].jid == this.state.currentId) {
                if( this.state.positions[i].id != 0)
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
        if(item.last) return 2;
        if (!this.getExpand(item)) return 0;
        return 1;
    },
    getExpand: function (item) {

        return item.last || item.text.length > 0;
    },
    saveNote: function (id, text, dt) {

        var func = this.success;
        let pid = 0
        for (let i in this.state.positions) {
            if (this.state.positions[i].jid == this.state.currentId) {
                pid = this.state.positions[i].id;
                break;
            }
        }
        $.post("/saveNote", {id: id, text: text, jid: this.state.currentId, pid: pid, dt: dt}, function (data) {
            func(data);
            //this.setState({busy: true});
        })
    },
    switchPosition: function (id, jid) {
        var func = this.success;
        $.post("/switchPosition", {pid: id, jid: jid}, function (data) {
            func(data);
            //this.setState({busy: true});
        })
    },
    okNewJournal: function (val,junk,dt,tags) {
        let func = this.switchPosition;
        $.post("/newJournal",
            {
                name: val,
                dt:dt,
                tags:tags
            },
            function (data) {
                if (data.dupName) {
                    alert('Journal ' + data.dupName + ' already exists!')
                }
                func(0, data.jid);

            }
        );
    },
    okModJournal: function (val,junk,dt,tags) {
        let func = this.switchPosition;
        $.post("/modJournal",
            {
                name: val,
                dt:dt,
                id:this.state.currentId,
                tags:tags
            },
            function (data) {
                if (data.dupName) {
                    alert('Journal ' + data.dupName + ' already exists!')
                }
                func(0, data.jid);

            }
        );
    },
    initValEmpty: function () {
        return "";
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
    render: function () {
        let me = this;
        let positionBoxes =
            this.state.positions.map((item, index) => {

                return (
                    <Col xs={2} className="positionLbl"  >
                        <Card bg={this.getBG(item)} fs="18px" fg={this.getFG(item)} name={item.name} height="30px"
                              switchPosition={this.switchPosition} id={item.id} jid={item.jid}
                              width="140px"/>
                    </Col>)
            });
        let newArray = this.state.dates;
        newArray  = newArray.filter(function (item) {
            return  me.props.report == "false" || item.text.length >0 || item.last;
        });

        let notes =
            newArray.map((item, index) => {

                return (
                    <Row xs={12} className="container">
                        <Note bg="#c0c0c0" fs="18px" fg="black" date={item.date} text={item.text}
                              buttonText={this.getButtonText(item)} id={item.id} jid={this.state.currentId}
                              dt={item.dt} idx={index} key={item.id + item.dt}
                              positions={this.state.positions} report={this.props.report || item.last}
                              mode={this.getMode(item)} expand={this.getExpand(item)}/>
                    </Row>
                )
            });
        return (
            <div xs={12} className="container">
                <div xs={12} className="container">
                    <Row xs={12} className="container">
                        <Col xs={2}/>
                        {this.state.report == "true" && <Col xs={2}/>}
                        {this.state.report == "false" && <Col xs={2}>
                            <NameDlg dlgType={1} modal="Modala" buttonLabel="Modify Journal" title="Modify General Journal"
                                     genJournal={[]} gj="false"    dt={this.journalDate()} tags={this.journalTags()}
                                     okFunc={this.okModJournal} label="Name" initVal={this.journalName()}/>
                        </Col> }
                        <Col xs={3}>
                            <h3> Open Positions </h3>
                        </Col>
                        {this.state.report == "false" && <Col xs={2}>
                            <NameDlg dlgType={1} modal="Modaldd" buttonLabel="Create General Journal" title="New General Journal"
                                     genJournal={[]} gj="false"   dt={this.formatDate()} tags=""
                                     okFunc={this.okNewJournal} label="Name" initVal={this.initValEmpty()}/>
                        </Col> }
                    </Row>
                    <Row xs={12} className="container">
                        {positionBoxes}
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




