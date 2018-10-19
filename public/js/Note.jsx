/** @jsx React.DOM */


var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;




var Note= React.createClass({
    getInitialState: function () {
        return {
            mode: this.props.mode,
            buttonText: this.props.buttonText,
            open: false,
            text:this.props.text,
            newText:this.props.text

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
    handleChange: function(e) {
        this.setState({ newText: e.target.value });
    },

    // mode
    // 0 - no text
    // 1 - text read only
    // 2 - edit mode
       setMode: function () {
        let m =2;
        let o = true;
        let t = "SAVE"
        if (this.state.mode == 2) {
            m = 1;
            this.setState({ text: this.state.newText });
            t = "EDIT";
            if(this.state.newText.length == 0){
                m = 0;
                t = "ADD";

            }
        }
        if (this.state.mode == 1) {
            m = 2;
            t = "SAVE";

        }

        this.setState({
            mode: m,
            buttonText:t,
            o : true
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
        let t = "SAVE"
        if (this.state.mode == 2) {
            m = 1;
            t = "EDIT";
            if(this.state.text.length == 0){
                m = 0;
                t = "ADD";

            }
        }
        if (this.state.mode == 1) {
            m = 2;
            t = "SAVE";

        }

        this.setState({
            mode: m,
            buttonText:t,
            open : o
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
                 style={{fontSize:this.props.fs,alignItems:"left",
                     backgroundColor:this.props.bg,
                     color:this.props.fg,height:"40px"}}>
                <Row xs={10} >
                    <Col xs={2} >
                        <div onClick={this.expandCollapse}>{this.props.date}</div>
                    </Col>
                    <Col xs={1} >
                    </Col>
                    <Col xs={1} >
                        <button type="button" style={{ backgroundColor:"blue",color:"white"}} onClick={this.setMode}>{this.state.buttonText}</button>
                    </Col>
                </Row>
                {this.state.mode == 2 &&
                <Row xs={10}>
                    <Col xs={1} >

                    </Col>
                    <Col xs={7} >
                        <textarea  onChange={ this.handleChange } defaultValue={this.state.text}  style={{ height:"80px", marginBottom:"10px"}}
                        />
                    </Col>
                </Row>}
                {this.state.mode == 1 &&
                <Row xs={10}>
                    <Col xs={1} >

                    </Col>
                    <Col xs={2} >
                        <div>{this.state.text}</div>
                    </Col>
                </Row>}
            </div>
        );
    }


});