/** @jsx React.DOM */


var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;




var Card= React.createClass({
    getInitialState: function () {
        return {
            logSource: null

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

    switchPosition: function () {
        this.props.switchPosition(this.props.id);
    },

    render: function () {

        return (
            <div xs={12}  onClick={this.switchPosition} style={{fontSize:this.props.fs,alignItems:"left",backgroundColor:this.props.bg,
                                  color:this.props.fg,
                                  height:this.props.height, width:this.props.width}}>

            <div  >{this.props.name}</div>



            </div>
        );
    }


});