var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var importSource = {
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

var dataAdapter2 = new $.jqx.dataAdapter(importSource);

var importTableDescription = {
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


var ImportDlg = React.createClass({

    quit: function (t) {
        this.props.okFunc();
    },
    componentDidMount: function () {

        importNode = $(this.refs.importtable.getDOMNode());
        $(this.refs.importtable.getDOMNode()).jqxDataTable(importTableDescription);
        importTableDescription.source = new $.jqx.dataAdapter(importSource);
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
                                <div ref="importtable" id="importTable"></div>
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
