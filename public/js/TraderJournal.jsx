/** @jsx React.DOM */


var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;


var TraderJournal = React.createClass({
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


    render: function () {
        var transition = function (state, name, fnc) {


        };
        return (
            <div xs={12} className="container">
                <div xs={12} className="container">
                    <MenuExample func={transition} focus="0"
                                 items={ ['By Position', 'By Date'] }/>
                    <JournalPosition/>
                </div>


            </div>
        );
    }


});



