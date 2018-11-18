var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;

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

                        return <li className={style} onClick={self.clicked.bind(self, index, m)}>{m.name}</li>;

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
            firstTime: 1,
            userName: 'Ed',
            configNames: [{item: "Default", id: 9}],
            configSel: 0,
            fnc: null,
            offset: -1,
            cols: {
                col1: "iv",
                col2: "mid",
                col3: "position",
                col4: "delta",
                col5: "trade"
            },
            menu: [{name: 'Trade', style: ''},
                {name: 'Transaction Log', style: 'disabled'},
                {name: 'Report', style: 'disabled'},
                {name: 'Journal', style: ''},
                {name: 'Settings', style: 'disabled'}]
        };
    },
    quit: function () {
        thePositions = new Array();
        thePositionsArr = new Array();
        transSource.localData = thePositionsArr;
        this.setState({webState: WEB_STATE_LOGIN, firstTime: 1});
    },

    setOffset: function (os) {
        this.setState({offset: os});
    },
    setColumns: function (columns, id, names) {
        this.setState({cols: columns, configNames: names, configSel: id});

    },

    render: function () {
        var me = this;
        var transition = function (state, name, fnc) {

            if(state == 0){
                me.setState({ menu: [{name: 'Trade', style: ''},
                    {name: 'Transaction Log', style: ''},
                    {name: 'Report', style: ''},
                    {name: 'Journal', style: ''},
                    {name: 'Settings', style: ''}]});
            }
            if (state == 1) {
                if (me.state.fnc == null) {
                    me.setState({fnc: fnc});
                }
            }
            if (state == WEB_STATE_TRADE && me.state.webState == 1) {
                // make sure the tab is correct after deleting the position
                me.state.fnc()
            }
            if (me.state.webState == WEB_STATE_LOGIN || me.state.webState == WEB_STATE_REG) {
                me.setState({userName: name});
            }

            me.setState({webState: state});
        };

        var page = <Trader ofunc={this.setOffset} setCol={this.setColumns} firstTime={this.state.firstTime}
                           offset={this.state.offset}/>;
        if (this.state.webState == WEB_STATE_CONFIG) {

            page = <TraderConfig ref="config"/>;
        } else if (this.state.webState == WEB_STATE_LOG) {

            page = <TraderLog func={transition}/>;
        } else if (this.state.webState == WEB_STATE_REPORT) {

            page = <TraderReport />;
        } else if (this.state.webState == WEB_STATE_JOURNAL) {
            page = <TraderJournal/>
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
            case WEB_STATE_TRADE:
            case WEB_STATE_LOG:
            case WEB_STATE_REPORT:
            case WEB_STATE_JOURNAL:
            case WEB_STATE_CONFIG:
                return (
                    <div>
                        <div xs={12} className="container">
                            <Row>
                                <Col xs={2}>
                                    <h3 className="titleFont2">Folar Trade Station</h3>
                                </Col>
                                <Col xs={6}>
                                    <MenuFolar func={transition} focus="3"
                                               items={this.state.menu }/>
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