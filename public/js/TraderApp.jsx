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
const WEB_STATE_REG = 4;
const WEB_STATE_LOGIN = 5;

var MenuFolar = React.createClass({

    getInitialState: function () {
        return {focused: this.props.focus};
    },

    clicked: function (index, item) {

        // The click handler will update the state with
        // the index of the focused menu entry
        if (item.style == 'disabled')
            return;
        this.setState({focused: index});
        var func = this.props.func;
        func(index, null, this.setMenuFocus);
    },


    setMenuFocus: function () {

        // The click handler will update the state with
        // the index of the focused menu entry

        this.setState({focused: 0});
    },
    render: function () {

        // Here we will read the items property, which was passed
        // as an attribute when the component was created

        var self = this;

        // The map method will loop over the array of menu entries,
        // and will return a new array with <li> elements.

        return (
            <div  >

                <ul id="menu">

                    { this.props.items.map(function (m, index) {

                        var style = m.style;

                        if (self.state.focused == index) {
                            style = 'focused';
                        }

                        // Notice the use of the bind() method. It makes the
                        // index available to the clicked function:

                        return <li key={index} className={style} onClick={self.clicked.bind(self, index, m)}>{m.name}</li>;

                    }) }

                </ul>


            </div>
        );

    }
});

var TraderApp = React.createClass({
    getInitialState: function () {
        return {
            webState: WEB_STATE_LOGIN,
            jid:-1,
            pid:-1
        };
    },
    quit: function () {
        this.setState({webState: WEB_STATE_LOGIN, firstTime: 5});
    },

    setOffset: function (os) {
        this.setState({offset: os});
    },
    setColumns: function (columns, id, names) {
        this.setState({cols: columns, configNames: names, configSel: id});

    },
    enableMenu: function(){

            this.setState({ menu: [
                {name: 'Journal', style: ''},
                {name: 'Settings', style: ''}]});

    },
    switchJournal:function (jid,pid) {

        this.setState({jid:jid,pid:pid});
    },

    render: function () {
        var me = this;
        var transition = function (state, name, fnc) {



            if (me.state.webState == WEB_STATE_LOGIN || me.state.webState == WEB_STATE_REG) {
                me.setState({userName: name});
            }

            me.setState({webState: state});
        };

        var page ="";


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
           ;
            case WEB_STATE_REG:

               page = <TraderRegister func={transition}/>
        }


        //alert (this.state.webState);
        switch (this.state.webState) {

            case WEB_STATE_REG:
                return (
                    <div className="whiteBG" xs={12}>
                        <TraderRegister func={transition}/>
                    </div>
                );

            case WEB_STATE_LOGIN:
                return (
                    <div className="whiteBG" xs={12}>
                        <TraderLogin func={transition}/>
                    </div>
                );
            default:

                return (
                    <div>
                        <div xs={12} className="container">
                            <Row>
                                <Col xs={2}>
                                    <h3 className="titleFont2">Folar Journal</h3>
                                </Col>
                                <Col xs={6}>
                                    <MenuFolar func={transition} focus="0"
                                               items={ [{name: 'By Position', style: ''}, {name: 'Report', style: ''}, {name: 'Tag', style: ''},{name: 'Archived', style: ''}] }/>

                                </Col>
                                <Col xs={4} className="menuSuffix">
                                    <span className="exit"> Hi {this.state.userName} &nbsp;&nbsp;  <img className="exit"
                                                                                                        width='20'
                                                                                                        height='20'
                                                                                                        onClick={this.quit}
                                                                                                        src='../img/exit.png'/></span>
                                </Col>
                            </Row>
                        </div>
                        <div>
                            {page}
                        </div>
                    </div>
                );

        }
    }
});


React.renderComponent(
    <TraderApp/>,
    //<FileForm />,
    document.getElementById('react-container')
);