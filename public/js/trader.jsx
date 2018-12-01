

var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;

var tradeColumn = 5;
var lineChartNode = null;

var cursor = 0;
var propertyNode = null;
var tradeNode = null;
var transNode = null;
var tradeNode2 = null;



function setLineChartNode(v) {
    lineChartNode = v;
}


function setPropertyNode(v) {
    propertyNode = v;
}


var sourceArray = [];
var colorSeries = ["#000080", "#800000", "#008000", "#4b0082", "#000000"];
var colors = ["#afeeee", "#0064b9", "#5f9ea0", "#da70d6", "#9370db", "#ffd700", "#d16200", "#974922"];
var colArr1 = [colors[0], colors[1], colors[2], colors[3], colors[4], colors[5], colors[6], colors[7]];
var colArr = [colors[0], colors[1], colors[2], colors[3], colors[4], colors[5], colors[6], colors[7]];
var colArrDrill = [];
var populateColArr = true;
var thePositions = new Array();
var thePositionsArr = new Array();
var theTransactions = new Array();

const WEB_STATE_TRADE = 0;
const WEB_STATE_LOG = 1;
const WEB_STATE_REPORT = 2;
const WEB_STATE_JOURNAL = 3;
const WEB_STATE_CONFIG = 4;
const WEB_STATE_REG = 5;
const WEB_STATE_LOGIN = 6;





var LineChart = React.createClass({
    render: function () {
        return (
            <div>
                <div ref="lineGraph"></div>
            </div>


        )

    },
    componentDidMount: function () {
        setLineChartNode($(this.refs.lineGraph.getDOMNode()));
        $(this.refs.lineGraph.getDOMNode()).highcharts({


            chart: {

                type: 'line'


            },

            pane: {
                size: '40%'
            },


            xAxis: {
                categories: []
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Grade'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.x:.2f} </b></td></tr>',
                footerFormat: '',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                    colorByPoint: true,
                    colors: colArr


                }
            },
            series: []

        });
    }


});


var clk = false;



var TabsSwitcher = React.createClass({
    render: function () {
        var active = this.props.active;
        var items = this.props.items.map(function (item, index) {
            return <a href="#" className={'tab ' + (active === index ? 'tab_selected' : '')}
                      onClick={this.onClick.bind(this, index)}>
                {item.title}
            </a>;
        }.bind(this));
        return <div>{items}</div>;
    },
    onClick: function (index) {
        this.props.onTabClick(index);
    }
});

var TabsContent = React.createClass({
    render: function () {
        var active = this.props.active;
        var items = this.props.items.map(function (item, index) {
            return <div
                className={'tabs-panel ' + (active === index ? 'tabs-panel_selected' : '')}>{item.content}</div>;
        });
        return <div>{items}</div>;
    }
});


var graphZoom = .05;

function repopulateTable() {
    var base = source2.localData[0].strikePrice;

    var tradeLabel;
    if (thePositionsArr.length > 0)
        $("#confirmT").removeClass("disabled");
    else
        $("#confirmT").addClass("disabled");
    for (var x in thePositions) {
        var arr = x.split(":");
        if (arr[1] == label1)
            tradeLabel = "col" + tradeColumn + "a";
        else if (arr[1] == label2)
            tradeLabel = "col" + tradeColumn + "b";
        else if (arr[1] == label3)
            tradeLabel = "col" + tradeColumn + "c";
        else
            return;


        if (arr[0] == 'Call') {
            row = 0;
            for (var i = 0; i < source.localData.length; i++) {
                if (arr[2] == source.localData[row]['strikePrice'])
                    break;
                row++;
            }
            source.localData[row][tradeLabel] = thePositions[x].mag;
        }
        else {
            row = 0;
            for (var i = 0; i < source2.localData.length; i++) {
                if (arr[2] == source2.localData[row]['strikePrice'])
                    break;
                row++;
            }
            source2.localData[row][tradeLabel] = thePositions[x].mag;
        }
    }

}

function drawOptionGraph(start, end,cp) {

    let ser = new Array();
    let ser3 = new Array();
    let y;
    let y1;
    let y2;
    let min = 1000;
    let min2 = 1000;
    let draw = true;

    // figure out series1
    for (var i = start; i < end; i += 1) {
        y1 = 0;
        for (var x in thePositions) {  // positions are the entries not in the database
            draw = true;
            y1 += calcPrice(i, thePositions[x]);
        }
        y2 = 0;
        for (var x in theTransactions) { // transactions are from the database
            draw = true;
            y2 += calcPrice(i, theTransactions[x]);
        }
        y = y1 + y2
        if (y < min) min = y
        ser.push(y);
    }

    // figure out series 2
    var ind = 0;
    var c2 = 0;

    // calculate the cost
    for (var x in theTransactions) {
        let mul = 1;
        if ( theTransactions[x].action == 'Sell')
            mul = -1;
        c2 += theTransactions[x].price * theTransactions[x].mag * mul;
    }
    for (var x in thePositions) {
        let mul = 1;
        if ( thePositions[x].action == 'Sell')
            mul = -1;
        c2 += thePositions[x].price * thePositions[x].mag * mul;

    }

    for (var i = start; i < end; i += 1) {
        y1 = 0;
        for (var x in thePositions) {
            draw = true;
            var exp = new Date(thePositions[x].exp);
            var now = new Date();
            var timeDiff = Math.abs(exp.getTime() - now.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            var v = BlackScholes(thePositions[x].type, i, thePositions[x].strike, diffDays / 365, .02, thePositions[x].iv );
            var mag = thePositions[x].mag;

            if (thePositions[x].action == "Sell")
                mag *= -1;
            y1 += v * mag;

        }
        y2 = 0;

        for (var x in theTransactions) {
            draw = true;
            var exp = new Date(theTransactions[x].expiration);
            var now = new Date();
            var timeDiff = Math.abs(exp.getTime() - now.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            var v = BlackScholes(theTransactions[x].type, i, theTransactions[x].strike, diffDays / 365, .02, theTransactions[x].iv);
            var mag = theTransactions[x].mag;
            if (theTransactions[x].action == "Sell")
                mag *= -1;
            y2 += v * mag;

        }
        y = y1 + y2 -c2;

        if (y < min) min = y;
        ser3.push(y );
    }

    chart.yAxis.min = min;

    chart.plotOptions.series.pointStart = start;
    chart.series = [{
        data: ser
    }, {data: ser3}];

    lineChartNode.highcharts(chart);
    lineChartNode.highcharts().series[0].show();
}

// prepare the data
var url = "http://localhost:8080/tradetable";
var source =
    {
        dataType: "json",

        updateRow: function (rowId, rowData, commit) {

            let bnds = calcBounds(source2.localData[rowId].currentPrice);
            let start = bnds.start;
            let end = bnds.end;
            addPostions('Call', source, rowData, rowId, start, end);

            drawOptionGraph(start, end,source2.localData[rowId].currentPrice);


        },
        dataFields: [
            {name: 'strikePrice', type: 'string'},

            {name: 'col1a', type: 'string'},
            {name: 'col2a', type: 'string'},
            {name: 'col3a', type: 'string'},
            {name: 'col4a', type: 'string'},
            {name: 'col5a', type: 'string'},

            {name: 'col1b', type: 'string'},
            {name: 'col2b', type: 'string'},
            {name: 'col3b', type: 'string'},
            {name: 'col4b', type: 'string'},
            {name: 'col5b', type: 'string'},

            {name: 'col1c', type: 'string'},
            {name: 'col2c', type: 'string'},
            {name: 'col3c', type: 'string'},
            {name: 'col4c', type: 'string'},
            {name: 'col5c', type: 'string'}

        ],
        id: 'id',
        //url: url
        localdata: []
    };


var underlyingSymbol = "RUT";

function position(label, type, mid, val, strike, start, end, iv) {
    
    this.buy = true;
    this.exp = label;
    this.type = type;
    this.mid = mid;
    this.val = parseInt( val);
    this.underlying = underlyingSymbol;
    this.strike = parseInt(strike);

    this.price =   mid;
    if (val < 0) this.buy = false;
    this.action = this.buy ? "Buy" : "Sell";
    this.mag = Math.abs(val);
    this.qty = parseInt(val);
    this.iv = iv ;//  / 100;


    if (this.type == 'Call') {
        if (!this.buy)
            this.min = this.price - (end - this.strike) * this.mag;
        else
            this.min = this.price * this.mag;
    } else {
        if (!this.buy)
            this.min = this.price - (this.strike - start ) * this.mag;
        else
            this.min = this.price * this.mag;
    }
}


function addPostions(type, source, rowData, rowId, start, end) {
    let strikePrice = source.localData[rowId]["strikePrice"];

    let tradeLabel = "";

    if (rowData["col" + tradeColumn + "a"] != "") {
        tradeLabel = "col" + tradeColumn + "a";
        let mid = source.localData[rowId]["mida"];
        let iv = source.localData[rowId]["iva"];
        var p = new position(label1, type, mid, rowData[tradeLabel], strikePrice, start, end, iv);

        thePositions [type + ":" + label1 + ":" + strikePrice] = p
    }

    if (rowData["col" + tradeColumn + "b"] != "") {
        tradeLabel = "col" + tradeColumn + "b";
        mid = source.localData[rowId]["midb"];
        iv = source.localData[rowId]["ivb"];
        thePositions [type + ":" + label2 + ":" + strikePrice] = new position(label2, type, mid, rowData[tradeLabel], strikePrice, start, end, iv);

    }

    if (rowData["col" + tradeColumn + "c"] != "") {
        tradeLabel = "col" + tradeColumn + "c";
        mid = source.localData[rowId]["midc"];
        iv = source.localData[rowId]["ivc"];
        thePositions [type + ":" + label3 + ":" + strikePrice] = new position(label3, type, mid, rowData[tradeLabel], strikePrice, start, end, iv);
    }
    if(tradeLabel.length == 0){

        let idx = 0;
        for (var i in thePositions) {

            if (i == (type + ":" + label1 + ":" + strikePrice) || i == (type + ":" + label2 + ":" + strikePrice) ||
                i == (type + ":" + label3 + ":" + strikePrice)){
                thePositions = thePositions.splice(idx,1);
            }
            idx++;
        }
    }


    thePositionsArr = new Array();
    for (var i in thePositions) {
        if (rowData[tradeLabel] == 0 ){
            continue;
        }
        thePositionsArr.push(thePositions[i]);

    }
    transSource.localData = thePositionsArr;
    transTableDescription.source = new $.jqx.dataAdapter(transSource);
    transNode.jqxDataTable(transTableDescription);
}

function calcPrice(i, pos) {
    if (pos.mag == 0) return 0;
    if (pos.type == 'Call') {
        if (i <= pos.strike)
            return pos.price * pos.qty * -1 ;
        else {
            if (pos.buy)
                return (pos.price * pos.qty * -1 + (i - pos.strike) * pos.mag);
            else
                return (pos.price * pos.qty * -1 - (i - pos.strike) * pos.mag);
        }

    } else {
        if (i >= pos.strike)
            return pos.price  * pos.qty * -1;
        else {
            if (!pos.buy) // sell
                return pos.price  * pos.qty * -1  - ( pos.strike - i ) * pos.mag;
            else
                return (pos.price * pos.qty * -1  + ( pos.strike - i) * pos.mag);
        }

    }
}

function calcBounds(currentPrice) {
    var midPoint = Math.round(currentPrice / 10) * 10;
    var start = midPoint - graphZoom * midPoint;
    start = Math.round(start / 10) * 10;
    var end = midPoint + (midPoint - start);
    return {start: start, end: end};
}

var source2 =
    {
        dataType: "json",
        updateRow: function (rowId, rowData, commit) {


            var bnds = calcBounds(source2.localData[rowId].currentPrice);
            var start = bnds.start;
            var end = bnds.end;

            addPostions('Put', source2, rowData, rowId, start, end);
            drawOptionGraph(start, end,source2.localData[rowId].currentPrice);

        },
        dataFields: [
            {name: 'strikePrice', type: 'string'},

            {name: 'col1a', type: 'string'},
            {name: 'col2a', type: 'string'},
            {name: 'col3a', type: 'string'},
            {name: 'col4a', type: 'string'},
            {name: 'col5a', type: 'string'},

            {name: 'col1b', type: 'string'},
            {name: 'col2b', type: 'string'},
            {name: 'col3b', type: 'string'},
            {name: 'col4b', type: 'string'},
            {name: 'col5b', type: 'string'},

            {name: 'col1c', type: 'string'},
            {name: 'col2c', type: 'string'},
            {name: 'col3c', type: 'string'},
            {name: 'col4c', type: 'string'},
            {name: 'col5c', type: 'string'}

        ],
        id: 'id',
        //url: url
        localdata: []
    };
var dataAdapter = new $.jqx.dataAdapter(source);
var colMap = {
    "iv": "Volatility",
    "mid": "Mid",
    "last": "Last",
    "ask": "Ask",
    "bid": "Bid",
    "change": "Change",
    "high": "High",
    "low": "Low",
    "open": "Open Interest",
    "delta": "Delta",
    "gamma": "Gamma",
    "theta": "Theta",
    "vega": "Vega",
    "extrinsic": "Extrinsic",
    "intrinsic": "Intrinsic",
    "volume": "Volume",
    "theoretical ": "Theoretical",
    "trade": "Trade",
    "position": "Position"
};


var tradeTableDescription = {
    width: 1040,
    height: 231,
    sortable: true,
    pageable: false,
    pagerButtonsCount: 10,
    source: dataAdapter,
    columnsResize: true,
    editSettings: {
        saveOnPageChange: true, saveOnBlur: true,
        saveOnSelectionChange: false, cancelOnEsc: true,
        saveOnEnter: true, editOnDoubleClick: true, editOnF2: true
    },
    columns: [
        {text: 'Call', dataField: 'strikePrice', width: 45, editable: false},

        {
            text: 'Mid', dataField: 'col1a', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Volatility', dataField: 'col2a', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Delta', dataField: 'col3a', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Trade', dataField: 'col4a', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Pos', dataField: 'col5a', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },

        {
            text: 'Mid', dataField: 'col1b', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Volatility', dataField: 'col2b', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Delta', dataField: 'col3b', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Trade', dataField: 'col4b', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Pos', dataField: 'col5b', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },

        {
            text: 'Mid', dataField: 'col1c', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Volatility', dataField: 'col2c', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Delta', dataField: 'col3c', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Trade', dataField: 'col4c', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Pos', dataField: 'col5c', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        }


    ]
};
var tradeTableDescription2 = {
    width: 1040,
    height: 231,
    sortable: true,
    pageable: false,
    pagerButtonsCount: 10,
    source: dataAdapter,
    columnsResize: true,
    editSettings: {
        saveOnPageChange: true, saveOnBlur: true,
        saveOnSelectionChange: false, cancelOnEsc: true,
        saveOnEnter: true, editOnDoubleClick: true, editOnF2: true
    },
    columns: [
        {text: 'Put', dataField: 'strikePrice', width: 45, editable: false},

        {
            text: 'Mid', dataField: 'col1a', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Volatility', dataField: 'col2a', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Delta', dataField: 'col3a', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Trade', dataField: 'col4a', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Pos', dataField: 'col5a', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },

        {
            text: 'Mid', dataField: 'col1b', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Volatility', dataField: 'col2b', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Delta', dataField: 'col3b', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Trade', dataField: 'col4b', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Pos', dataField: 'col5b', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },

        {
            text: 'Mid', dataField: 'col1c', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Volatility', dataField: 'col2c', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Delta', dataField: 'col3c', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Trade', dataField: 'col4c', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        },
        {
            text: 'Pos', dataField: 'col5c', width: 65, editable: false, initEditor: function () {
            $("#confirmT").removeClass("disabled");
        }
        }


    ]
};


var transSource = {
    localData: [],
    dataType: "json",
    dataFields: [
        {name: 'action', type: 'string'},
        {name: 'type', type: 'string'},
        {name: 'exp', type: 'string'},
        {name: 'mid', type: 'string'},
        {name: 'strike', type: 'string'},
        {name: 'underlying', type: 'string'},
        {name: 'mag', type: 'number'}
    ]
};

var dataAdapter2 = new $.jqx.dataAdapter(transSource);

var transTableDescription = {
    width: 650,
    height: 231,
    pageable: false,
    pagerButtonsCount: 10,
    source: dataAdapter2,
    columnsResize: true,
    editSettings: {
        saveOnPageChange: true, saveOnBlur: true,
        saveOnSelectionChange: false, cancelOnEsc: true,
        saveOnEnter: true, editOnDoubleClick: true, editOnF2: true
    },
    columns: [
        {text: 'Type', dataField: 'type', width: 65, editable: false},
        {text: 'Underlying', dataField: 'underlying', width: 100, editable: false},
        {text: 'Expiration', dataField: 'exp', width: 100, editable: false},
        {text: 'Price', dataField: 'mid', width: 85, editable: false},
        {text: 'Strike Price', dataField: 'strike', width: 100, editable: false},
        {text: 'Action', dataField: 'action', width: 100, editable: false},
        {text: 'Amount', dataField: 'mag', width: 100, editable: false}
    ]
};


var TransDlg = React.createClass({

    quit: function (t) {
        this.props.okFunc();
    },
    componentDidMount: function () {

        transNode = $(this.refs.transtable.getDOMNode());
        $(this.refs.transtable.getDOMNode()).jqxDataTable(transTableDescription);
        transTableDescription.source = new $.jqx.dataAdapter(transSource);
    },
    render: function () {


        var lbl = "my" + this.props.modal + "Label";
        var target = "#my" + this.props.modal;
        var idtarget = "my" + this.props.modal;

        return (
            <div xs={10} className="container">

                <button id="confirmT" type="button" className="btn btn-primary disabled" data-toggle="modal"
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
                            <div className="modal-body">
                                <div ref="transtable" id="transTable"></div>
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

var label1 = "";
var label2 = "";
var label3 = "";
var labelDay1 = "";
var labelDay2 = "";
var labelDay3 = "";

var Trader = React.createClass({


    getInitialState: function () {
        return {
            showModal:false,
            dataSource: null,
            offset: 0,
            lastPrice: 500,
            positionNames: [{item: "Default", id: 9}],
            positionSel: 0,
            stockNames: [{item: "Default", id: 9}],
            genJournal: [],
            stockSel: '00',
            klassName: "showError",
            maxPeriod: 0,
            importTransData:[]
        };
    },
    handleHideModal: function(){
        this.setState( {showModal: false});
        this.fetch("");
    },
    handleShowModal: function(){
        this.setState( {showModal: true})
    },
    back: function () {
        if (this.state.offset == 0) return;
        this.state.offset = this.state.offset - 1;
        this.props.ofunc(this.state.offset);
        this.fetch("");
    },

    forward: function () {
        if (this.state.offset == this.state.maxPeriod - 3) return;
        this.state.offset = parseInt(this.state.offset) + 1;
        this.props.ofunc(this.state.offset);
        this.fetch("");

    },

    fetch: function (trans) {
        let func = this.success;
        $.post("/tradetable",
            {
                underlying: this.state.stockSel,
                offset: this.state.offset,
                firstTime: this.props.firstTime,
                trans: trans
            },
            function (data) {
                func(data);

            }
        );

    },

    deletePosition: function () {
        this.state.deletePositionSource.fetch({
            data: {}, success: this.deleteThePosition, fail: this.fail, type: 'POST'
        });
    },
    okNewPosition: function (val,id) {
        let func = this.addNewPosition;
        $.post("/newPosition",
            {
                name: val,
                id : id
            },
            function (data) {
                    if(data.dupName){
                        alert('Position  '+data.dupName+ ' already exists!')
                    }
                func(data);

            }
        );
    },
    deleteThePosition: function () {
        this.reload("");
    },
    addNewPosition: function (data) {

        this.setState({positionNames: data.positionNames, positionSel: data.currentPosition });
        this.fetch("");
    },

    clearTrans: function () {
        thePositions = new Array();
        thePositionsArr = new Array();
        transSource.localData = thePositionsArr;
        transTableDescription.source = new $.jqx.dataAdapter(transSource);
        transNode.jqxDataTable(transTableDescription);
    },

    addTrans: function () {
        var str = "";
        var first = true;

        if (thePositionsArr.length > 0) {

            for (var x = 0; x < thePositionsArr.length; x++) {
                if (!first) {
                    str += ":";
                } else {
                    first = false;
                }
                str += thePositionsArr[x].type + "," + thePositionsArr[x].underlying + "," + thePositionsArr[x].exp + "," + thePositionsArr[x].mid + "," +
                    thePositionsArr[x].strike + "," + thePositionsArr[x].action + "," + thePositionsArr[x].mag;
            }
            this.clearTrans();
            this.fetch(str);

        }

    },

    okEditPosition: function (val) {

        for (var x in this.state.positionNames) {
            if (this.state.positionNames[x].id == this.state.positionSel) {
                this.state.positionNames[x].item = val;
                break;

            }
        }

        this.state.editPositionSource.fetch({
            data: {
                newName: val

            }, success: this.editPosition, fail: this.fail, type: 'POST'
        });
    },

    editPosition: function () {

    },

    switchStocks: function () {

        if (thePositionsArr.length > 0) {
            if (!confirm("You have " + thePositionsArr.length + " pending transactions, do you wish to continue?")) {
                return;
            }
        }
        var id = this.refs.nameCombo2.getConfigName();

        this.state.stockSel = id;
        this.clearTrans();
        this.fetch("");

    },

    switchPosition: function (e) {
        if (thePositionsArr.length > 0) {
            if (!confirm("You have " + thePositionsArr.length + " pending transactions, do you wish to continue?")) {
                return;
            }
        }
        var id = e.target.value;
        this.setState({positionSel: id});
        let func = this.chgPosition;
        $.post("/chgPosition",
            {
                name: id
            },
            function (data) {
                func(data);

            }
        );
    },

    chgPosition: function (data) {
        this.setState({positionSel: data.currentPosition, offset: -1});
        this.clearTrans();
        this.fetch("");
    },
    reload: function () {
        this.fetch("");
    },


    initValEmpty: function () {
        return "";
    },
    displayImportTrans: function (data) {
        this.setState({importTransData:data.importTrans, showModal: true})

    },
    render: function () {

        if (this.state.dataSource != null) {
            let data = this.state.dataSource;
            label1 = data.period1
            label2 = data.period2;
            label3 = data.period3;
            labelDay1 = data.period1 + data.expDay1;
            labelDay2 = data.period2 + data.expDay2;
            labelDay3 = data.period3 + data.expDay3;
        }


        return (

            <div className="analyzer  marg10">
                <div xs={12} className="container">

                    <div className="row">
                       {this.state.showModal ? <ImportTransDlg  data={this.state.importTransData}
                                                                handleHideModal={this.handleHideModal}/> : null}
                    </div>
                    <Row xs={12} className="container">
                        <Col xs={1} className="positionLbl">
                            Position:
                        </Col>
                        <Col xs={3} className={this.state.klassName}>
                            <ConfigNameCombo ref="nameCombo" names={this.state.positionNames}
                                             sel={this.state.positionSel}
                                             switchConfig={this.switchPosition}/>
                        </Col>
                        <Col xs={2}>
                            <NameDlg modal="Modala" buttonLabel="Create New Position" title="New Position"
                                     okFunc={this.okNewPosition} label="Name" initVal={this.initValEmpty}
                                     genJournal={this.state.genJournal} />
                        </Col>

                        <Col xs={1}>
                            <TransDlg buttonLabel="Confirm" title="Confirm Transactions" okFunc={this.addTrans}
                                      modal="Modal_trans"/>
                        </Col>
                        <Col xs={1}>

                            <ImportDlg buttonLabel="Import" title="Import Transactions"
                                       func={this.displayImportTrans}
                                       modal="Modal_import"/>
                        </Col>

                    </Row>

                    <Row xs={12} className="container">
                        <Col xs={1} className={this.state.klassName}>
                            Stocks:
                        </Col>
                        <Col xs={1} className={this.state.klassName}>
                            <StockNameCombo ref="nameCombo2" names={this.state.stockNames} sel={this.state.stockSel}
                                             switchConfig={this.switchStocks}/>
                        </Col>

                        <Col xs={2}>
                            <span>Price: {this.state.lastPrice}</span>
                        </Col>
                    </Row>

                </div>
                <div className="graphRight">
                    <LineChart/>
                </div>
                <div>


                    <span>
                        <label className="arrowDisplay"><span onClick={this.back}>&nbsp; &lt;</span> <span
                            onClick={this.forward}>&gt;</span></label>
                        <label className="periodDisplay">{labelDay1}</label>
                        <label className="periodDisplay">{labelDay2}</label>
                        <label className="periodDisplay">{labelDay3}</label>
                    </span>

                    <div ref="tradetable" id="tradeTable"></div>
                    <br/>
                    <div ref="tradetable2" id="tradeTable2"></div>
                </div>
            </div>
        );
    },

    componentDidMount: function () {
        this.state.offset = this.props.offset;
        this.fetch("");
        tradeNode = $(this.refs.tradetable.getDOMNode());
        tradeNode2 = $(this.refs.tradetable2.getDOMNode());
        $(this.refs.tradetable.getDOMNode()).jqxDataTable(tradeTableDescription);
        $(this.refs.tradetable.getDOMNode()).jqxDataTable({editable: true});
        $(this.refs.tradetable.getDOMNode()).jqxDataTable({
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

        $(this.refs.tradetable2.getDOMNode()).jqxDataTable(tradeTableDescription2);
        $(this.refs.tradetable2.getDOMNode()).jqxDataTable({editable: true});
        $(this.refs.tradetable2.getDOMNode()).jqxDataTable({
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

    },
    success: function (data) {
        this.props.enableMenu();
        var j = 1;
        var id = data.currentPositionId;
       // alert(id);
        var names = data.positionNames;

        var sid = data.currentStock;
        var snames = data.stockNames;
        underlyingSymbol = sid;


        this.props.setCol(data.config, data.idConfig, data.configNames);
        this.setState({
            positionSel: data.currentPositionId, positionNames: names, dataSource: data,
            lastPrice: data.underlyingLast,
            offset: data.offset,
            stockSel: sid,
            stockNames: snames,
            genJournal :data.genJornal
        });
        this.props.ofunc(this.state.offset);
        source.localData = data.call;

        source2.localData = data.put;
        this.state.maxPeriod = data.tradingPeriodCount;
        theTransactions = data.transactions;

        repopulateTable();
        for (i = 1; i < 4; i++) {

            tradeTableDescription2.columns[j].text = colMap[data.config.col1];
            tradeTableDescription2.columns[j].editable = tradeTableDescription2.columns[j].text == "Trade";
            tradeTableDescription.columns[j].editable = tradeTableDescription2.columns[j].text == "Trade";
            if (tradeTableDescription2.columns[j].text == "Trade") tradeColumn = 1;
            tradeTableDescription.columns[j++].text = colMap[data.config.col1];

            tradeTableDescription2.columns[j].text = colMap[data.config.col2];
            tradeTableDescription2.columns[j].editable = tradeTableDescription2.columns[j].text == "Trade";
            tradeTableDescription.columns[j].editable = tradeTableDescription2.columns[j].text == "Trade";
            if (tradeTableDescription2.columns[j].text == "Trade") tradeColumn = 2;
            tradeTableDescription.columns[j++].text = colMap[data.config.col2];

            tradeTableDescription2.columns[j].text = colMap[data.config.col3];
            tradeTableDescription2.columns[j].editable = tradeTableDescription2.columns[j].text == "Trade";
            tradeTableDescription.columns[j].editable = tradeTableDescription2.columns[j].text == "Trade";
            if (tradeTableDescription2.columns[j].text == "Trade") tradeColumn = 3;
            tradeTableDescription.columns[j++].text = colMap[data.config.col3];

            tradeTableDescription2.columns[j].text = colMap[data.config.col4];
            tradeTableDescription2.columns[j].editable = tradeTableDescription2.columns[j].text == "Trade";
            tradeTableDescription.columns[j].editable = tradeTableDescription2.columns[j].text == "Trade";
            if (tradeTableDescription2.columns[j].text == "Trade") tradeColumn = 4;
            tradeTableDescription.columns[j++].text = colMap[data.config.col4];

            tradeTableDescription2.columns[j].text = colMap[data.config.col5];
            tradeTableDescription2.columns[j].editable = tradeTableDescription2.columns[j].text == "Trade";
            tradeTableDescription.columns[j].editable = tradeTableDescription2.columns[j].text == "Trade";
            if (tradeTableDescription2.columns[j].text == "Trade") tradeColumn = 5;
           tradeTableDescription.columns[j++].text = colMap[data.config.col5];


        }

        var bnds = calcBounds(source2.localData[0].currentPrice);
        var start = bnds.start;
        var end = bnds.end;
        drawOptionGraph(start, end,source2.localData[0].currentPrice);
        tradeTableDescription.source = new $.jqx.dataAdapter(source);
        tradeTableDescription2.source = new $.jqx.dataAdapter(source2);
        tradeNode.jqxDataTable(tradeTableDescription);
        tradeNode2.jqxDataTable(tradeTableDescription2);
        tradeNode.jqxDataTable({editable: true});
        tradeNode.jqxDataTable({
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

        tradeNode2.jqxDataTable({editable: true});
        tradeNode2.jqxDataTable({
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

        var cnt = source.localData.length;
        if (cnt > 7) {
            cnt = Math.floor(cnt / 2 - 3.5);
            if (cnt < 0)
                cnt = 0;
            cnt *= 33;
            tradeNode.jqxDataTable('scrollOffset', cnt, 0);
            tradeNode2.jqxDataTable('scrollOffset', cnt, 0);
        } else {
            tradeNode.jqxDataTable('scrollOffset', 0, 0);
            tradeNode2.jqxDataTable('scrollOffset', 0, 0);
        }

    },
    chkResult: function () {
    },
    fail: function () {
    },
    submitText: function () {


    },

});

function BlackScholes(PutCallFlag, S, X, T, r, v) {

    var d1, d2;
    d1 = (Math.log(S / X) + (r + v * v / 2.0) * T) / (v * Math.sqrt(T));
    d2 = d1 - v * Math.sqrt(T);


    if (PutCallFlag == "Call")
        return S * CND(d1) - X * Math.exp(-r * T) * CND(d2);
    else
        return X * Math.exp(-r * T) * CND(-d2) - S * CND(-d1);

}

/* The cummulative Normal distribution function: */

function CND(x) {

    var a1, a2, a3, a4, a5, k;

    a1 = 0.31938153, a2 = -0.356563782, a3 = 1.781477937, a4 = -1.821255978 , a5 = 1.330274429;

    if (x < 0.0)
        return 1 - CND(-x);
    else
        k = 1.0 / (1.0 + 0.2316419 * x);
    return 1.0 - Math.exp(-x * x / 2.0) / Math.sqrt(2 * Math.PI) * k * (a1 + k * (-0.356563782 + k * (1.781477937 + k * (-1.821255978 + k * 1.330274429))));

}

var chart = {
    chart: {
        type: 'line'
    },

    pane: {
        size: '65%'
    },


    xAxis: {
        type: "int"
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Price/Lost'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.x:.2f} </b></td></tr>',
        footerFormat: '',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0,
            colorByPoint: true,
            colors: colArr
        },
        series: {
            pointStart: 0,
            pointInterval: 1
        }
    },
    series: [{
        data: [0]
    }]

};
var LineChart = React.createClass({
    render: function () {
        return (
            <div>
                <div>
                    <select id='zoom' className="zoomSelector" onChange={this.selectZoom}>
                        <option value=".05">5%</option>
                        <option value=".1">10%</option>
                        <option value=".2">20%</option>
                        <option value=".3">30%</option>
                    </select>
                </div>
                <div ref="lineGraph"></div>
            </div>


        )

    },
    selectZoom: function (xxx) {

        if (xxx.target[0].selected) {
            graphZoom = .05;
        } else if (xxx.target[1].selected) {

            graphZoom = .1;
        } else if (xxx.target[2].selected) {
            graphZoom = .2;
        } else {
            graphZoom = .3;

        }

        var bnds = calcBounds(source2.localData[0].currentPrice);
        var start = bnds.start;
        var end = bnds.end;
        drawOptionGraph(start, end,source2.localData[0].currentPrice);
    },
    componentDidMount: function () {
        setLineChartNode($(this.refs.lineGraph.getDOMNode()));
        $(this.refs.lineGraph.getDOMNode()).highcharts(chart);

        lineChartNode.highcharts().setTitle({text: "Positions"});
        lineChartNode.highcharts().legend.allItems[0].update({name: "Call"});
        lineChartNode.highcharts().series[0].hide();
        var node = $(this.getDOMNode()).context.children[0].children[0];
        if (graphZoom == .05)
            node.selectedIndex = 0;
        else
            node.selectedIndex = 10 * graphZoom;


    }


});


