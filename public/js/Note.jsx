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
            buttonText: this.props.buttonText,
            open: false,
            text: this.props.text,
            newText: this.props.text

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

    },

    fail: function () {

    },
    handleChange: function (e) {
        this.setState({newText: e.target.value});
        if (e.target.value == this.state.text)
            $("#"+this.props.idx).addClass("disabled");
        else
            $("#"+this.props.idx).removeClass("disabled");
    },

    // mode
    // 0 - no text
    // 1 - text read only
    // 2 - edit mode
    setMode: function () {
        let m = 2;
        let o = true;
        let t = "SAVE"
        if (this.state.mode == 2) {
            m = 1;

            if (this.state.text != this.state.newText) {
                this.setState({text: this.state.newText});
                this.props.saveNote(this.props.id, this.state.newText,this.props.dt);
            }
            t = "EDIT";
            if (this.state.newText.length == 0) {
                m = 0;
                t = "ADD";

            }
        }
        if (this.state.mode == 1) {
            m = 2;
            t = "SAVE";

        }
        if (t == "SAVE")
            $("#"+this.props.idx).addClass("disabled");
        else
            $("#"+this.props.idx).removeClass("disabled");

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
            }
        }
        if (t == "SAVE")
            $("#"+this.props.idx).addClass("disabled");
        else
            $("#"+this.props.idx).removeClass("disabled");
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
                    <Col xs={1}>
                        <button id={this.props.idx} type="button" className="btn btn-primary"
                                style={{backgroundColor: "blue", color: "white"}}
                                onClick={this.setMode}>{this.state.buttonText}</button>
                    </Col>
                </Row>
                {this.state.mode == 2 &&
                <Row xs={10}>
                    <Col xs={1}>

                    </Col>
                    <Col xs={9}>
                        <textarea onChange={ this.handleChange } defaultValue={this.state.text}
                                  style={{height: "80px", marginBottom: "10px"}}
                        />
                    </Col>
                </Row>}
                {this.state.mode == 1 &&
                <Row xs={10}>
                    <Col xs={1}>

                    </Col>
                    <Col xs={9}>
                        <textarea readOnly="true" defaultValue={this.state.text}
                                  style={{height: "80px", marginBottom: "10px", backgroundColor: "lightGray"}}
                        />
                    </Col>
                </Row>}
            </div>
        );
    }


});