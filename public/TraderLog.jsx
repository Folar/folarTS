

/** @jsx React.DOM */


var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;

var TraderLog = React.createClass({
 getInitialState: function() {
        return {
            name:"Position",
            logSource: new Collections.logCollection()
        };
    },
    submitText3: function() {
            var name  = $(this.refs.name.getDOMNode())[0].value;
            var pw  = $(this.refs.pw.getDOMNode())[0].value;
            this.state.logSource.fetch({ data: { }, success: this.success, fail: this.fail, type: 'POST' });
            this.setState({ busy: true });

    }
    ,
    success: function() {


    },
    fail: function() {
        this.setState({busy: false});
    },
    onClick:function(){
            this.props.func(4);
    },

    render: function() {


        return (
            <div  xs={12} className="container" >
                <h1 className="titleFont">Folar Trade Station</h1>

            </div>
            <div  xs={12} className="container" >
                <h3 className="titleFont">Position {this.state.name}</h1>
            </div>
        );
    }


});




