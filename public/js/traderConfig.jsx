/** @jsx React.DOM */




var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;




var ColumnCombo = React.createClass({
    getInitialState: function () {
        return {
            col: this.props.val

        };
    },
    render: function () {

        return (

            <Col xs={2}>
                <select className="typeSelector" onChange={ this.props.func}>
                    <option value="iv">Volatility</option>
                    <option value="mid">Mid Price</option>
                    <option value="last">Last</option>
                    <option value="ask">Ask</option>
                    <option value="bid">Bid</option>
                    <option value="change">Change</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                    <option value="open">Open Interest</option>
                    <option value="delta">Delta</option>
                    <option value="gamma">Gama</option>
                    <option value="theta">Theta</option>
                    <option value="vega">Vega</option>
                    <option value="extrinsic">Extrinsic Value</option>
                    <option value="intrinsic">Intrinsic Value</option>
                    <option value="volume">Volume</option>
                    <option value="theoretical ">Theoretical Price</option>
                    <option value="trade">Trade</option>
                    <option value="position">Position</option>
                </select>
            </Col>

        );
    },
    componentDidMount: function () {
        this.setColumn(this.state.col);

    },
    setColumn: function (val) {
        var node = $(this.getDOMNode()).context.children[0];
        this.setState({col: val});
        node.value = val;
    },
    getColumn: function () {

        var node = $(this.getDOMNode()).context.children[0];
        return node.value;
    }
});


var TraderConfig = React.createClass({
    getInitialState: function () {
        return {
            busy: false,
            dirty: false,
            names: [{item: "ded", id: 0}],
            columns: {col1: 'iv', col2: 'iv', col3: 'iv', col4: 'iv', col5: 'iv'},
            sel: -1,
            stocks: "IBM"
        };
    },

    makeDirty: function () {
        $.post("/config", {
                col1: this.refs.col1.getColumn(),
                col2: this.refs.col2.getColumn(),
                col3: this.refs.col3.getColumn(),
                col4: this.refs.col4.getColumn(),
                col5: this.refs.col5.getColumn(),
                stocks: $("#stocks")[0].value.toUpperCase(),
            }, function (data) {
            }
        )

    }
    ,
    chkResult: function () {
    },

    addName: function (data) {
        this.setState({columns: data, names: data.configNames, sel: data.currentConfig});

    },
    ok: function (val) {
        let func = this.addName;
        $.post("/newconfig", {
            name:val,
            col1: this.refs.col1.getColumn(),
            col2: this.refs.col2.getColumn(),
            col3: this.refs.col3.getColumn(),
            col4: this.refs.col4.getColumn(),
            col5: this.refs.col5.getColumn(),
            stocks: $("#stocks")[0].value,
        }, function (data) {
            func(data);
        });

    },

    chgConfig: function (data) {
        var arr = data;
        this.refs.col1.setColumn(data.col1);
        this.refs.col2.setColumn(data.col2);
        this.refs.col3.setColumn(data.col3);
        this.refs.col4.setColumn(data.col4);
        this.refs.col5.setColumn(data.col5);
        this.setState({columns: data, names: data.configNames, sel: data.currentConfig});
        $("#stocks")[0].value = [data.stocks];

    },
    initValEmpty: function () {
        return "";
    },
    switchConfig: function () {

        var id = this.refs.nameCombo.getConfigName();
        let func = this.chgConfig;
        this.setState({sel: id});

        $.post("/chgconfig", {id: id}, function (data) {
                func(data);

            }
        );

    },

    render: function () {
        var me = this;


        return (
            <div xs={12} className="container">
                <Row xs={12} className="container">
                    <Col xs={1} className="configLbl">
                        Config:
                    </Col>
                    <Col xs={1} className="configSel">
                        <ConfigNameCombo ref="nameCombo" names={this.state.names} sel={this.state.sel}
                                         switchConfig={this.switchConfig}/>
                    </Col>
                    <Col xs={1}>
                        <NameDlg modal="Modalc" title="New Config" buttonLabel="Create New Configuration"
                                 dlgType={0} genJournal={[]}  okFunc={this.ok} label="Name" initVal={this.initValEmpty()}/>
                    </Col>
                </Row>
                <Row className='left8'>
                    <ColumnCombo ref="col1" val={this.state.columns.col1} func={this.makeDirty}/>
                    <ColumnCombo ref="col2" val={this.state.columns.col2} func={this.makeDirty}/>
                    <ColumnCombo ref="col3" val={this.state.columns.col3} func={this.makeDirty}/>
                    <ColumnCombo ref="col4" val={this.state.columns.col4} func={this.makeDirty}/>
                    <ColumnCombo ref="col5" val={this.state.columns.col5} func={this.makeDirty}/>
                </Row>
                <Row >
                    <Col xs={1} className="stkMargin">
                        <span > Stocks: </span>
                    </Col>
                    <Col xs={7}>
                        <input id="stocks" className="searchBox" ref="stocks"/>
                    </Col>
                    <Col xs={2} className="stkMargin">
                        <button type="button" className="btn btn-primary" onClick={this.makeDirty}>
                            Save Stocks
                        </button>
                    </Col>
                </Row>

            </div>
        );
    },
    componentDidMount: function () {
        var id = -1;
        let func = this.chgConfig;
        $.post("/chgconfig", {id: id}, function (data) {
            func(data);
        });
    }

});




