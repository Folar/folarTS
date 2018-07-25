/** @jsx React.DOM */


var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;


var perfomanceSource2 = {
    localData: [],
    dataType: "json",


    dataFields: [
        {name: 'name', type: 'string'},
        {name: 'cost', type: 'string'},
        {name: 'currentCost', type: 'string'},
        {name: 'openDate', type: 'string'},
        {name: 'status', type: 'string'},
        {name: 'realized', type: 'string'},
    ]
};


var dataAdapter3 = new $.jqx.dataAdapter(perfomanceSource2);
var transNode2;
var perfomanceTableDescription2 = {
    width: 730,
    height: 400,
    pageable: false,
    sortable: true,
    pagerButtonsCount: 10,
    source: dataAdapter3,
    columnsResize: true,
    editable : false,
    selectionMode: 'multiplerows',

    columns: [
        {text: 'Position Name', dataField: 'name', width: 200, editable: false},
        {text: 'Value', dataField: 'cost', width: 100, editable: false},
        {text: 'Current Value', dataField: 'currentCost', width: 100, editable: false},
        {text: 'Open Date', dataField: 'openDate', width: 100, editable: false},
        {text: 'Status', dataField: 'status', width: 100, editable: false},
        {text: 'Profit/Loss', dataField: 'realized', width: 100, editable: false}
    ]
};


var TraderReport = React.createClass({
    getInitialState: function () {
        return {
            logSource: null

        };
    },
    componentDidMount: function () {
        transNode = $(this.refs.perfomanceTable.getDOMNode());
       transNode.jqxDataTable(perfomanceTableDescription2);
        perfomanceTableDescription2.source = new $.jqx.dataAdapter(perfomanceSource2);
        transNode.jqxDataTable({editable: false});
        transNode.jqxDataTable({selectionMode: 'multiplerows'});

        transNode.on('rowSelect', this.rowSelectChg);
        transNode.on('rowUnselect', this.rowSelectChg);


        var func = this.success;
        $.post("/report", {xxx: ""}, function (data) {
                func(data);
                //this.setState({busy: true});
            }
        )
    },
    rowSelectChg: function () {
        var selection = transNode.jqxDataTable('getSelection');

        if (selection.length == 0) {
            $("#exportT").addClass("disabled");
        } else {
            $("#exportT").removeClass("disabled");
            this.download();
        }
    },
    success: function (data) {
        this.setState({logSource:data})
        perfomanceSource2.localData = data;
        perfomanceTableDescription2.source = new $.jqx.dataAdapter(perfomanceSource2);
        transNode.jqxDataTable(perfomanceTableDescription2);
    },

    fail: function () {
        this.setState({busy: false});
    },
    download: function () {
        var trans = this.state.logSource;
        var ft = true;
        var str = "";
        var selection = transNode.jqxDataTable('getSelection');
        for (var i = 0; i < selection.length; i++) {
            // get a selected row.
            if (!ft)
                str += ","
            else
                ft = false;
            var idTran = trans[selection[i].uid]["id"];
            str += idTran;
        }
        $("#exportT").attr("href", "export?positions=" + str);
    },

    successEx: function () {
        debugger;
    },

    render: function () {

        return (
            <div xs={12} className="container">
                <h1 className="titleFont">Folar Trade Station</h1>
                <div xs={12} className="container">
                    {/*<Row>*/}

                        {/*<Col className='bottomM' xs={2}>*/}
                            {/*<a id="exportT" className="btn btn-primary disabled "*/}
                               {/*href="export?positions=467">Export </a>*/}
                        {/*</Col>*/}
                    {/*</Row>*/}
                    <Row xs={12}>
                        <div ref="perfomanceTable" id="perfomanceTable"></div>
                    </Row>
                </div>


            </div>
        );
    }


});




