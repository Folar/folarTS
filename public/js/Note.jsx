/** @jsx React.DOM */


var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;


var Note = React.createClass({
    getInitialState: function () {
        return {
            mode: this.props.mode,
            id: this.props.id,
            buttonText: this.props.buttonText,
            open: false,
            text: this.props.text,
            newText: this.props.text,
            textHeight: "80px",
            report: this.props.report

        };
    },
    componentDidMount: function () {


        // var func = this.success;
        // $.post("/report", {xxx: ""}, function (data) {
        //         func(data);
        //         //this.setState({busy: true});
        //     }
        // )
    },

    success: function (data) {
        this.setState({id: data.rid})
    },

    fail: function () {

    },
    timeHandle: null,
    handleChange: function (e) {
        let sz = 90;

        let len = e.target.value.split(/r\n|\r|\n/).length;
        if (len > 2)
            sz = (len + 1) * 30;
        this.setState({newText: e.target.value,textHeight: sz});

        if (e.target.value == this.state.text) {
            $("#" + this.props.idx).addClass("disabled");
            if (this.timeHandle != null) {
                clearTimeout(this.timeHandle);
                this.timeHandle = null;
            }
        } else {
            $("#" + this.props.idx).removeClass("disabled");
            if (this.timeHandle != null) {
                clearTimeout(this.timeHandle);
            }
            this.timeHandle = setTimeout(this.save, 3000)
        }
    },

    // mode
    // 0 - no text
    // 1 - text read only
    // 2 - edit mode
    hitButton: function () {
        let m = 2;
        let o = true;
        let t = "SAVE"
        if (this.state.mode == 2) {
            m = 1;
            t = "EDIT";
            if (this.state.newText.length == 0) {
                m = 0;
                t = "ADD";

            }
        }
        if (this.state.mode == 1) {
            this.adjustHeight();
            m = 2;
            t = "SAVE";

        }
        if (t == "SAVE")
            $("#" + this.props.idx).addClass("disabled");
        else
            $("#" + this.props.idx).removeClass("disabled");

        this.setState({
            mode: m,
            buttonText: t,
            o: true
        });

        // this.setState((prevState) => {

        //     alert(prevState.mode);
        //     return {
        //         mode: m
        //     };
        // });
    },

    save: function () {
        let m = 2;
        let o = true;
        let t = "SAVE"
        if (this.timeHandle != null) {
            clearTimeout(this.timeHandle);
            this.timeHandle = null;
        }

        if (this.state.text != this.state.newText) {
            this.setState({text: this.state.newText});
            this.saveNote(this.state.id, this.state.newText, this.props.dt);
        }


        $("#" + this.props.idx).addClass("disabled");


    },

    expandCollapse: function () {
        let o = !this.state.open;
        let t = "SAVE";
        let m = 2;
        if (this.state.mode == 2) {
            m = 1;
            t = "EDIT";
            if (this.state.text.length == 0) {
                m = 0;
                t = "ADD";
            }
        }
        if (this.state.mode == 1) {
            m = 2;
            t = "SAVE";
            if (this.state.text.length == 0) {
                m = 0;
                t = "ADD";
            } else {
                this.adjustHeight();
            }
        }
        if (t == "SAVE")
            $("#" + this.props.idx).addClass("disabled");
        else
            $("#" + this.props.idx).removeClass("disabled");
        this.setState({
            mode: m,
            buttonText: t,
            open: o
        });

        // this.setState((prevState) => {

        //     alert(prevState.mode);
        //     return {
        //         mode: m
        //     };
        // });
    },

    adjustHeight: function () {
        let len = this.state.newText.split(/r\n|\r|\n/).length;
        if (len < 2)
            this.setState({textHeight: "90px"});
        else {
            len = (len + 1) * 30;
            this.setState({textHeight: len})

        }
    },
    saveNote: function (id, text, dt) {
        console.log(`id = ${id} text = ${text} dt = ${dt}`);
        var func = this.success;
        let pid = 0;
        for (let i in this.props.positions) {
            if (this.props.positions[i].jid == this.props.jid) {
                pid = this.props.positions[i].id;
                break;
            }
        }
        console.log(`jid = ${this.props.jid} pid = ${pid}`);
        $.post("/saveNote", {id: id, text: text, jid: this.props.jid, pid: pid, dt: dt}, function (data) {
            func(data);
            //this.setState({busy: true});
        })
    },
    render: function () {

        return (
            <div xs={10}
                 style={{
                     fontSize: this.props.fs, alignItems: "left",
                     backgroundColor: this.props.bg,
                     color: this.props.fg, height: "40px"
                 }}>
                <Row xs={10}>
                    <Col xs={3}>
                        <div onClick={this.expandCollapse}>{this.props.date}</div>
                    </Col>
                    <Col xs={1}>
                    </Col>
                    {false && <Col xs={1}>
                        <button id={this.props.idx} type="button" className="btn btn-primary"
                                style={{backgroundColor: "blue", color: "white"}}
                                onClick={this.hitButton}>{this.state.buttonText}</button>
                    </Col>}
                </Row>
                {this.state.mode == 2 &&
                <Row xs={10}>
                    <Col xs={1}>

                    </Col>
                    <Col xs={9}>
                        <textarea onChange={ this.handleChange } defaultValue={this.state.text} onBlur={this.save}
                                  style={{height: this.state.textHeight, marginBottom: "10px"}}
                        />
                    </Col>
                </Row>}
                {this.state.mode == 1 &&
                <Row xs={10}>
                    <Col xs={1}>

                    </Col>
                    <Col xs={9}>
                        <p style={{
                            padding: "3px",
                            whiteSpace: "pre-wrap",
                            marginBottom: "10px",
                            backgroundColor: "lightGray"
                        }}>
                            {this.state.text}
                        </p>
                    </Col>
                </Row>}

            </div>
        );
    }


});