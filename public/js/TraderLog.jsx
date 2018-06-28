/** @jsx React.DOM */


var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;

var theChangedRows = new Array();
var theChangedRowsIdx = new Array();
var transSource2 = {
    localData: [],
    dataType: "json",
    updateRow: function (rowId, rowData, commit) {
        theChangedRows.push(rowData);
        theChangedRowsIdx.push(rowId);

    },

    dataFields: [
        {name: 'action', type: 'string'},
        {name: 'type', type: 'string'},
        {name: 'expiration', type: 'string'},
        {name: 'priceDisplay', type: 'string'},
        {name: 'currentPrice', type: 'string'},
        {name: 'strike', type: 'string'},
        {name: 'symbol', type: 'string'},
        {name: 'mag', type: 'number'},
        {name: 'transTime', type: 'string'}
    ]
};


var dataAdapter3 = new $.jqx.dataAdapter(transSource2);
var transNode2;
var transTableDescription2 = {
    width: 1000,
    height: 400,
    pageable: false,
    sortable: true,
    pagerButtonsCount: 10,
    source: dataAdapter3,
    columnsResize: true,
    editSettings: {
        saveOnPageChange: true, saveOnBlur: true,
        saveOnSelectionChange: false, cancelOnEsc: true,
        saveOnEnter: true, editOnDoubleClick: true, editOnF2: true
    },
    columns: [
        {text: 'Type', dataField: 'type', width: 65, editable: false},
        {text: 'Underlying', dataField: 'symbol', width: 100, editable: false},
        {text: 'Expiration', dataField: 'expiration', width: 100, editable: false},
        {
            text: 'Price', dataField: 'priceDisplay', width: 85, editable: false, initEditor: function () {
            $("#updateT").removeClass("disabled");
        }
        },
        {
            text: 'Current Price', dataField: 'currentPrice', width: 120, editable: false, initEditor: function () {
            $("#updateT").removeClass("disabled");
        }
        },
        {text: 'Strike Price', dataField: 'strike', width: 100, editable: false},
        {text: 'Action', dataField: 'action', width: 100, editable: false},
        {
            text: 'Amount', dataField: 'mag', width: 100, editable: true, initEditor: function () {
            $("#updateT").removeClass("disabled");
        }
        },
        {text: 'Event', dataField: 'transTime', width: 200, editable: false}
    ]
};


var MoveDlg = React.createClass({
    getInitialState: function () {
        return {
            move: (!!this.props.move) || false,
            copy: (!!this.props.copy) || false,
            create: (!!this.props.create) || false
        };
    },
    handleChange: function () {
        this.setState({
            copy: !this.state.copy
        });
    },

    handleChange2: function () {
        this.setState({
            create: !this.state.create,
        });
    },
    handleChange3: function () {

        this.setState({
            move: !this.state.move
        });
    },

    quit: function (t) {
        this.props.okFunc(this.state.move, this.state.copy, this.state.create, $("#newP")[0].value, this.refs.nameCombo.getConfigName());
    },
    switchConfig: function () {

    },
    componentDidMount: function () {
    },
    render: function () {


        var lbl = "my" + this.props.modal + "Label";
        var target = "#my" + this.props.modal;
        var idtarget = "my" + this.props.modal;

        return (
            <div xs={10} className="container">

                <button type="button" id="moveTrans" className="btn btn-primary disabled" data-toggle="modal"
                        data-target={target}>
                    {this.props.buttonLabel}
                </button>

                <div className="modal fade" id={idtarget} tabindex="-1" role="dialog" aria-labelledby={lbl}
                     aria-hidden="true">
                    <div className="modal-dialog wide">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"><span
                                    aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                                <h4 className="modal-title" id={lbl}>{this.props.title}</h4>
                            </div>
                            <div xs={12} className="modal-body container">

                                <Row xs={12} className="container">
                                    <Col xs={1}>
                                        <input id="move"
                                               type="checkbox"
                                               defaultChecked={this.state.move}
                                               ref="move"
                                               onChange={this.handleChange3}
                                        />
                                    </Col>
                                    <Col xs={2}>
                                        <div className="tMargin">
                                            Move to Position
                                        </div>

                                    </Col>
                                    <Col xs={3}>
                                        <ConfigNameCombo id="combo" ref="nameCombo" names={this.props.positionNames}
                                                         sel={this.props.positionSel}
                                                         switchConfig={this.switchConfig}/>
                                    </Col>
                                </Row>
                                <Row xs={12} className="container">
                                    <Col xs={1}>
                                        <input id="copy"
                                               type="checkbox"
                                               defaultChecked={this.state.copy}
                                               ref="copy"
                                               onChange={this.handleChange}
                                        />
                                    </Col>
                                    <Col xs={2}>
                                        <div className="tMargin">
                                            Make a Copy
                                        </div>

                                    </Col>
                                </Row>

                                <Row xs={12} className="container">

                                    <Col xs={1}>
                                        <input id="create"
                                               type="checkbox"
                                               defaultChecked={this.state.create}
                                               ref="create"
                                               onChange={this.handleChange2}
                                        />
                                    </Col>
                                    <Col xs={2}>
                                        <div className="tMargin">
                                            Create a new Position
                                        </div>

                                    </Col>

                                    <Col xs={3}>
                                        <input id="newP" className="searchBox" ref="postxt"/>
                                    </Col>
                                </Row>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={this.quit}
                                        data-dismiss="modal">{this.props.buttonLabel}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var TraderLog = React.createClass({
    getInitialState: function () {
        return {
            name: "Position",
            cost: "$0.00",
            currentValue: "$0.00",
            currentCost: "$0.00",
            transcnt: 0,
            positionNames: [{item: "Default", id: 9}],
            positionSel: 0,
            editPositionSource: new Collections.editPositionCollection(),
            modifyLogSource: new Collections.modifyTansactionCollection(),
            moveTransSource: new Collections.moveTansactionCollection(),
            deletePositionSource: new Collections.deletePositionCollection(),
            logSource: new Collections.logCollection(),
            butTrans: "btn btn-primary",
            modTrans: "btn btn-primary"
        };
    },

    rowSelectChg: function () {

        var selection = transNode.jqxDataTable('getSelection');
        var trans = this.state.logSource.transactions;

        if (selection.length == 0) {
            $("#delTrans").addClass("disabled");
            $("#moveTrans").addClass("disabled");
            $("#exportT").attr("href", "export?positions=-1");
        } else {
            $("#delTrans").removeClass("disabled");
            $("#moveTrans").removeClass("disabled");
            var ft = true;
            var str = "";
            for (var i = 0; i < selection.length; i++) {
                // get a selected row.
                if (!ft)
                    str += ","
                else
                    ft = false;

                var idTran = trans[selection[i].uid]["idTrans"];
                str += idTran;
                $("#exportT").attr("href", "export?positions=-1&trans=" + str);
            }
        }
    },

    componentDidMount: function () {
        transNode = $(this.refs.transtable.getDOMNode());
        $(this.refs.transtable.getDOMNode()).jqxDataTable(transTableDescription2);
        transTableDescription2.source = new $.jqx.dataAdapter(transSource2);
        $(this.refs.transtable.getDOMNode()).jqxDataTable({editable: true});
        $(this.refs.transtable.getDOMNode()).jqxDataTable({
            editSettings: {
                saveOnPageChange: true,
                saveOnBlur: true,
                saveOnSelectionChange: true,
                cancelOnEsc: true,
                saveOnEnter: true,
                editOnDoubleClick: true,
                editOnF2: true
            }
        });

        transNode.on('rowSelect', this.rowSelectChg);
        transNode.on('rowUnselect', this.rowSelectChg);
        

        var func = this.success;
        $.post("/tradelog", {del: ""}, function (data) {
                    func( data);
            //this.setState({busy: true});
            }
        )
    },

    reload: function () {
        this.disableButtons();
        var func = this.success;
        $.post("/tradelog", {del: ""}, function (data) {
                func( data);
                //this.setState({busy: true});
            }
        )
    },


    success: function (data) {

        this.setState({
            name: data.currentPosition,
            logSource:data,
            currentValue: data.currentValue,
            currentCost: data.currentCost,
            cost: data.cost,
            transcnt: data.transcnt
        });
        transSource2.localData = data.transactions;
        transTableDescription2.source = new $.jqx.dataAdapter(transSource2);
        transNode.jqxDataTable(transTableDescription2);

        var id = data.currentPosition;
        var names = data.positionNames;
        this.setState({positionSel: id, positionNames: names});

    },
    fail: function () {
        this.setState({busy: false});
    },
    onClick: function () {
        this.props.func(4);
    },
    okEditPosition: function (val) {
        this.setState({name: val});
        func = this.editPosition;
        $.post("/editposition", {newName: val}, function (data) {
                func( data);
                //this.setState({busy: true});
            }
        );
    },

    editPosition: function (data) {
        this.setState({ positionNames: data});
    },

    initVal: function () {
        return this.state.name

    },

    exportTrans: function () {

        var trans = this.state.logSource.transactions;
        var ft = true;
        var str = "";
        var selection = transNode.jqxDataTable('getSelection');
        for (var i = 0; i < selection.length; i++) {
            // get a selected row.
            if (!ft)
                str += ","
            else
                ft = false;
            var idTran = trans[selection[i].uid]["idTrans"];
            str += idTran;
        }
        if (str.length > 0)
            this.state.logSource.fetch({data: {del: str}, success: this.success, fail: this.fail, type: 'POST'});

    },
    deleteTrans: function () {
        this.disableButtons();
        var trans = this.state.logSource.transactions;
        var ft = true;
        var str = "";
        var selection = transNode.jqxDataTable('getSelection');
        for (var i = 0; i < selection.length; i++) {
            // get a selected row.
            if (!ft)
                str += ","
            else
                ft = false;
            var idTran = trans[selection[i].uid]["idTrans"];
            str += idTran;
        }
        if (str.length > 0) {
            func = this.success;
            $.post("/tradelog", {del: str}, function (data) {
                    func( data);
                    //this.setState({busy: true});
                }
            )
        }
    },
    formatNumber: function (num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    },

    cost: function () {
        var trans = this.state.logSource.transactions;
        var cnt = 0;

        for (var i = 0; i < trans.length; i++) {
            var t = trans[i].mag * trans[i].price;
            cnt += t;
        }
        if (cnt < 0 - 1)
            alert("The total cost of this position is ($" + this.formatNumber(100 * -1 * cnt.toFixed(2)) + ")");
        else
            alert("The total cost of this position is $" + this.formatNumber(100 * cnt.toFixed(2)));
    },


    updateTrans: function () {
        var ft = true;
        var str = "";
        for (var x = 0; x < theChangedRows.length; x++) {
            if (!ft)
                str += ":"
            else
                ft = false;

            var trans = this.state.logSource.transactions[theChangedRowsIdx[x]];
            str += trans.idTrans + "," + theChangedRows[x].priceDisplay + "," + theChangedRows[x].mag;
        }
        if (str.length > 0) {
            func = this.updateSuccess;
            $.post("/modifytrans", {modify: str}, function (data) {
                    func(data);
                    //this.setState({busy: true});
                }
            );

        }

    },
    disableButtons: function () {
        $("#delTrans").addClass("disabled");
        $("#moveTrans").addClass("disabled");
    },
    moveTrans: function (move, copy, create, posname, idpos) {
        this.disableButtons();
        var trans = this.state.logSource.transactions;
        var ft = true;
        var str = "";
        var selection = transNode.jqxDataTable('getSelection');
        for (var i = 0; i < selection.length; i++) {
            // get a selected row.
            if (!ft)
                str += ","
            else
                ft = false;
            var idTran = trans[selection[i].uid]["idTrans"];
            str += idTran;
        }

        if (str.length > 0) {
            let func = this.reload;
            $.post("/movetrans",
                {move: move,
                copy: copy,
                create: create,
                name: posname,
                id: idpos,
                trans: str},
                function (data) {
                    func(data);
                    //this.setState({busy: true});
                }
            );

        }
    },

    updateSuccess: function () {
        theChangedRows = new Array();
        theChangedRowsIdx = new Array();
        $("#updateT").addClass("disabled");
        this.disableButtons();
        var func = this.success;
        $.post("/tradelog", {del: ""}, function (data) {
                func( data);
                //this.setState({busy: true});
            }
        )
    },

    deletePosition: function () {

        func = this.delPosSuccess;
        $.post("/deleteposition", {}, function (data) {
                func( data);
                //this.setState({busy: true});
            }
        )
    },

    delPosSuccess: function () {
        var func = this.props.func;
        func(0, "");
    },

    render: function () {

        return (
            <div xs={12} className="container">
                <h1 className="titleFont">Folar Trade Station</h1>
                <div xs={12} className="container">
                    <Row xs={12} className="container">
                        <Col xs={3}>
                            <h3 className="lbleft">Position: {this.state.name}</h3>
                        </Col>

                        <Col xs={3}>
                            <h3 className="lbleft">Transaction count: {this.state.transcnt}</h3>
                        </Col>

                    </Row>
                    <Row xs={12} className="container">
                        <Col xs={3}>
                            <h3 className="lbleft">Original Cost: {this.state.cost}</h3>
                        </Col>

                        <Col xs={3}>
                            <h3 className="lbleft">Current Cost: {this.state.currentCost}</h3>
                        </Col>

                        <Col xs={3}>
                            <h3 className="lbleft">Profit/Loss: {this.state.currentValue}</h3>
                        </Col>


                    </Row>
                    <Row xs={12}>
                        <br/>
                    </Row>
                    <Row xs={12} className="container">
                        <Col xs={2}>
                            <NameDlg buttonLabel="Edit Position Name" title="Edit Position" okFunc={this.okEditPosition}
                                     label="Name"
                                     modal="Modalb" initVal={this.initVal}/>
                        </Col>

                        <Col xs={2}>
                            <button type="button" id="delTrans" className="btn btn-primary disabled"
                                    onClick={this.deleteTrans}>
                                Delete Transactions
                            </button>
                        </Col>
                        <Col xs={1}>
                            <button type="button" id="updateT" className="btn btn-primary disabled"
                                    onClick={this.updateTrans}>
                                Update
                            </button>
                        </Col>
                        <Col xs={1}>
                            <ImportDlg buttonLabel="Import" title="Import Transactions" func={this.reload}
                                       modal="Modal_import"/>
                        </Col>
                        <Col xs={1}>
                            <MoveDlg modal="Modala" buttonLabel="Move" title="Move/Copy Transactions"
                                     okFunc={this.moveTrans} positionNames={this.state.positionNames}
                                     sel={this.state.positionSel}/>
                        </Col>
                        <Col xs={2}>
                            <button type="button" id="delpos" className="btn btn-primary" onClick={this.deletePosition}>
                                Delete Position
                            </button>
                        </Col>
                        <Col className='bottomM' xs={1}>
                            <a id="exportT" className="btn btn-primary " href="export?positions=-1">Export </a>
                        </Col>
                    </Row>
                    <Row xs={12}>
                        <br/>
                    </Row>
                    <Row xs={12}>
                        <div ref="transtable" id="transTable"></div>
                    </Row>
                </div>


            </div>
        );
    }


});




