

/** @jsx React.DOM */

var Models = {}, Collections = {};



Models.Register = Backbone.Model.extend({
    paramRoot: 'Register',
    urlRoot: '/register',
});

Collections.moleculeCollection = Backbone.Collection.extend({
    model: Models.Reaction,
    url: '/register'
});
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;

var Details = React.createClass({
    render: function() {

        return (
            <Row>
              <Col className="top75" xs={1}>{this.props.label} </Col>
              <Col xs={2} ref={this.props.rid}> <input className="top75 form-control" ></input>	 </Col>
            </Row>

        );
    }
});



var Xxx = React.createClass({
 getInitialState: function() {
        return {
            busy:false
        };
    },
       submitText: function() {
//            this.state.moleculeSource.fetch({ data: { input: srch, reactionType: this.state.reactionType }, success: this.success, fail: this.fail, type: 'POST' });
            //this.setState({ busy: true });
            this.props.func(3);
        },
        onClick:function(){
             this.props.func(2);
        },

    render: function() {
        var buttonContent = this.state.busy ? <img src="img/ajax-loader.gif"></img> : "Register";

        return (
            <div  xs={12} className="container" >
                <h1 className="titleFont">Viridis Chem</h1>
                <Row xs={12} >
                    <Details rid="fn" label=""First Name"/>


                </Row>
            </div>
        );
    },

    componentDidMount: function() {




             }


});


