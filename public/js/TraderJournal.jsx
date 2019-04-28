/** @jsx React.DOM */


var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;
const JOURNAL_POSITION = 0;
const JOURNAL_REPORT = 1;
const JOURNAL_TAG = 2;
const JOURNAL_ARCHIVE = 3;

var TraderJournal = React.createClass({
    getInitialState: function () {
        return {
            logSource: null,
            webState:0,
            jid:-1,
            pid:-1

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
    switchJournal:function (jid,pid) {

        this.setState({jid:jid,pid:pid});
    },

    render: function () {
        var me = this;
        var transition = function (state, name, fnc) {
            me.setState({webState: state});
        };
        var page;

        switch (this.state.webState){
            case JOURNAL_POSITION:
                page = <JournalPosition report="false" key={1} jid={this.state.jid} pid={this.state.pid}
                        switchJournal={this.switchJournal}/>;
                break;
            case JOURNAL_REPORT:
                page = <JournalPosition report="true" key={2}  jid={this.state.jid} pid={this.state.pid}
                                        switchJournal={this.switchJournal}/>;
                break;
            case JOURNAL_TAG:
                page = <JournalTag tag="true" key={3}/>;
                break;
            case JOURNAL_ARCHIVE:
                page = <JournalTag tag="false" key={4}/>;
                break;
        }

        return (

            <div xs={12} className="container">
                <Row xs={12} className="container">
                    <Col xs={4} className="container"/>
                    <Col xs={5} className="container">
                        <MenuFolar func={transition} focus="0"
                                   items={ [{name: 'By Position', style: ''}, {name: 'Report', style: ''}, {name: 'Tag', style: ''},{name: 'Archived', style: ''}] }/>
                    </Col>

                </Row>
                <Row xs={10} className="container">
                    <Col xs={10} className="container">
                        {page}
                    </Col>

                </Row>
            </div>

        );
    }


});




