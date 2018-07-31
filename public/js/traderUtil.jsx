

/** @jsx React.DOM */




var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;





var StockNameCombo = React.createClass({
    getInitialState: function() {
        return {
            test :0
        };
    },
    getConfigName:function(){

        var node=$(this.getDOMNode()).context.children[0];
        return node.value;
    },

    setConfigName:function(val){

        var node=$(this.getDOMNode()).context.children[0];
        node.value = val;
    },
    render: function() {

        var items = this.props.names.map(function(item, index) {
            return <option value={item} > {item} </option>;
        });


        if (items.length >1)
            return <div>
                <select value = {this.props.sel}  onChange={ this.props.switchConfig} >
                    {items}
                </select>
            </div>;

        return <div>
            <span> {this.props.sel} </span>
        </div>;
    }

});


var ConfigNameCombo = React.createClass({
     getInitialState: function() {
            return {
                test :0
            };
     },
    getConfigName:function(){

         var node=$(this.getDOMNode()).context.children[0];
         return node.value;
    },

    setConfigName:function(val){

             var node=$(this.getDOMNode()).context.children[0];
             node.value = val;
    },
	render: function() {

		var items = this.props.names.map(function(item, index) {

			return <option value={item.id} > {item.name} </option>;
		});

       console.log("co = "+this.props.sel+  " " +items.length)
		if (items.length >1)
		    return <div>
		          <select value = {this.props.sel}  onChange={ this.props.switchConfig} >
		              {items}
		          </select>
		       </div>;

		    return <div>
               <span> {this.props.sel} </span>
		       </div>;
	}

});
var  dlgTxt = null;
var importSource = {
    localData: [],
    dataType: "json",
    dataFields: [
        {name: 'action', type: 'string'},
        {name: 'type', type: 'string'},
        {name: 'exp', type: 'string'},
        {name: 'price', type: 'string'},
        {name: 'strike', type: 'string'},
        {name: 'underlying', type: 'string'},
        {name: 'mag', type: 'number'}
    ]
};

var importTableDescription = {
    width: 650,
    height: 231,
    pageable: false,
    pagerButtonsCount: 10,
    source: new $.jqx.dataAdapter(importSource),
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
        {text: 'Price', dataField: 'price', width: 85, editable: false},
        {text: 'Strike Price', dataField: 'strike', width: 100, editable: false},
        {text: 'Action', dataField: 'action', width: 100, editable: false},
        {text: 'Amount', dataField: 'mag', width: 100, editable: false}
    ]
};
var newArray = null;
var ImportTransDlg = React.createClass({
    getInitialState: function () {
        return {
            positionNames: [{item: "Default", id: 9}],
            positionSel: 0,
            stockNames: [{item: "Default", id: 9}],
            stockSel: 'All',
            exps: [{item: "Default", id: 9}],
            expsSel: 'All',
            klassName: "showError"
        };
    },
    quit: function (t) {
        this.props.handleHideModal();
    },
    switchStocks: function () {
        var id = this.refs.stockCombo.getConfigName();
        this.setState({stockSel : id});
        debugger;
    },
    switchExps: function () {

        var id = this.refs.expsCombo.getConfigName();
        this.setState({expsSel : id});
        debugger;
    },
    componentDidMount: function () {
        $(this.refs.importtable.getDOMNode()).jqxDataTable(importTableDescription);
        importTableDescription.source = new $.jqx.dataAdapter(importSource);
        $(this.getDOMNode()).modal('show');
        this.setState({stockNames:this.props.data.syms,
            exps:this.props.data.exps})
    },
    render: function () {
        newArray = this.props.data.buf;
        if (this.refs.stockCombo != undefined) {
            var id = this.refs.stockCombo.getConfigName();
            newArray = this.props.data.buf.filter(function (el) {
                if (id == "All") return true;
                if (el.underlying == id) return true;
                return false;
            });
            id = this.refs.expsCombo.getConfigName();
            newArray = newArray.filter(function (el) {
                if (id == "All") return true;
                if (el.exp == id) return true;
                return false;
            });
            if (id!=undefined) {
                importSource.localData = newArray;
                importTableDescription.source = new $.jqx.dataAdapter(importSource);
                $(this.refs.importtable.getDOMNode()).jqxDataTable(importTableDescription);
            }
        }
        importSource.localData= newArray;
        importTableDescription.source = new $.jqx.dataAdapter(importSource);


        return (


                <div className="modal fade"  >
                    <div className="modal-dialog wide">
                        <div className="modal-content">
                            <div className="modal-header">
                                <Row xs={12} className="container">
                                    <Col xs={1} className={this.state.klassName}>
                                        Stocks:
                                    </Col>
                                    <Col xs={1} className={this.state.klassName}>
                                        <StockNameCombo ref="stockCombo" names={this.state.stockNames}
                                                        sel={this.state.stockSel }
                                                        switchConfig={this.switchStocks}/>
                                    </Col>
                                    <Col xs={1}/>
                                    <Col xs={1} className={this.state.klassName}>
                                        Expirations:
                                    </Col>
                                    <Col xs={1} className={this.state.klassName}>
                                        <StockNameCombo ref="expsCombo" names={this.state.exps}
                                                        sel={this.state.expsSel }
                                                        switchConfig={this.switchExps}/>
                                    </Col>

                                </Row>

                                <h4 className="modal-title" id="myimporttrans">Choose Transactions to Import</h4>
                            </div>
                            <div className="modal-body">
                                <div ref="importtable" id="importTable"></div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" onClick={this.quit}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={this.quit}
                                        >Import</button>
                            </div>
                        </div>
                    </div>
                </div>

        );
    }
});


var ImportDlg   = React.createClass({
        getInitialState: function() {
                return {data_uri: null}
            },

        handleSubmit: function() {
            var formData = new FormData($('form')[0]);

            $.ajax({
                url: '/upload',
                type: "POST",
                cache: false,
                processData: false,

                contentType: false,
                data: formData,
                success: function(data) {

                    //alert (data.cnt +" transactions have been created");
                    this.uploadFunc(data);
                }.bind(this),
                error: function(xhr, status, err) {
                    // do stuff
                }.bind(this)
            });
            return false;
        },
        handleFile: function(e) {
            var reader = new FileReader();
            var file = e.target.files[0];

            reader.onload = function(upload) {
                this.setState({
                    data_uri: upload.target.result
                });
                console.log(this.state.data_uri)
            }.bind(this);

            reader.readAsDataURL(file);
        },
        uploadFunc : function(t){
            this.props.func(t);
        },
        render: function() {


        var lbl = "my"+this.props.modal+"Label";
        var target = "#my"+this.props.modal;
        var idtarget = "my"+this.props.modal;

        return (
            <div  xs={10} className="container" >

                <button type="button" className="btn btn-primary " data-toggle="modal" data-target={target}>
                 {this.props.buttonLabel}
                </button>

                <div className="modal fade" id={idtarget} tabindex="-1" role="dialog" aria-labelledby={lbl} aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                        <h4 className="modal-title" id={lbl}>{this.props.title}</h4>
                      </div>
                      <div className="modal-body">
                          <form  >
                              <input className="tall" type="file" name="file"  id="file" onChange={this.handleFile} />
                          </form>
                      </div>
                      <div className="modal-footer">
                          <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                          <button type="button" className="btn btn-primary" onClick={this.handleSubmit}  data-dismiss="modal" >Upload</button>
                      </div>

                    </div>
                  </div>
                </div>
            </div>
        );
    }
    });

var NameDlg= React.createClass({

        quit : function(t){
            this.props.okFunc($(this.refs.txt.getDOMNode())[0].value);
        },
        componentDidMount: function() {
            dlgTxt =  $(this.refs.txt.getDOMNode())[0]
        },
        render: function() {

        if(dlgTxt) dlgTxt.value = this.props.initVal();
        var lbl = "my"+this.props.modal+"Label";
        var target = "#my"+this.props.modal;
        var idtarget = "my"+this.props.modal;

        return (
            <div  xs={10} className="container" >

                <button type="button" className="btn btn-primary " data-toggle="modal" data-target={target}>
                 {this.props.buttonLabel}
                </button>

                <div className="modal fade" id={idtarget} tabindex="-1" role="dialog" aria-labelledby={lbl} aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                        <h4 className="modal-title" id={lbl}>{this.props.title}</h4>
                      </div>
                      <div className="modal-body">
                          {this.props.label}  <input   className="searchBox"  ref="txt"   />
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={this.quit}  data-dismiss="modal" >{this.props.buttonLabel}</button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        );
    }
    });




