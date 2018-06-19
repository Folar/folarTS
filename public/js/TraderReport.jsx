

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
                         { name: 'name', type: 'string' },
                         { name: 'cost', type: 'string' },
                         { name: 'currentCost', type: 'string' }
                    ]
  };


  var dataAdapter3 = new $.jqx.dataAdapter(perfomanceSource2);
  var transNode2;
  var perfomanceTableDescription2 = {
         width: 400,
          height:400,
          pageable: false,
          sortable:true,
          pagerButtonsCount: 10,
          source: dataAdapter3,
          columnsResize: true,

        columns: [
                     { text: 'Position Name', dataField: 'name', width: 200 ,editable:false },
                     { text: 'Value', dataField: 'cost', width: 100 ,editable:false },
                     { text: 'Current Value', dataField: 'currentCost', width: 100 ,editable:false }
                   ]
  };




var TraderReport = React.createClass({
 getInitialState: function() {
        return {
            exportSource: new Collections.exportCollection(),
            logSource: new Collections.performanceCollection()
          
        };
    },
    componentDidMount: function() {
                  transNode = $(this.refs.perfomanceTable.getDOMNode());
                  $(this.refs.perfomanceTable.getDOMNode()).jqxDataTable(perfomanceTableDescription2);
                  perfomanceTableDescription2.source =  new $.jqx.dataAdapter(perfomanceSource2);
                  $(this.refs.perfomanceTable.getDOMNode()).jqxDataTable({ editable:false });

                   transNode.on('rowSelect',this.rowSelectChg);
                   transNode.on('rowUnselect',this.rowSelectChg);



                  this.state.logSource.fetch({ data: { }, success: this.success, fail: this.fail, type: 'POST' });
    },
    rowSelectChg:function(){
         var selection = transNode.jqxDataTable('getSelection');

         if (selection.length == 0){
             $("#exportT").addClass("disabled");
         } else {
             $("#exportT").removeClass("disabled");
             this.download();
         }
    },
    success: function() {
                  perfomanceSource2.localData = this.state.logSource.models[0].attributes.performance;
                  perfomanceTableDescription2.source =  new $.jqx.dataAdapter(perfomanceSource2);
                  transNode.jqxDataTable(perfomanceTableDescription2);
    },

    fail: function() {
        this.setState({busy: false});
    },
    download:function() {
        var trans = this.state.logSource.models[0].attributes.performance;
        var ft =true;
        var str = "";
        var selection = transNode.jqxDataTable('getSelection');
        for (var i = 0; i < selection.length; i++) {
            // get a selected row.
            if(!ft)
                str += ","
            else
                ft= false;
            var idTran = trans[selection[i].uid]["id"];
            str += idTran;
        }
        $("#exportT").attr("href","export?positions="+str);
    },

    successEx: function() {
                     debugger;
    },

    render: function() {

        return (
            <div  xs={12} className="container" >
                <h1 className="titleFont">Folar Trade Station</h1>
                <div  xs={12} className="container" >
                     <Row>

                          <Col  className='bottomM'xs={2}>
                                <a id="exportT" className="btn btn-primary disabled " href="export?positions=467">Export </a>
                          </Col>
                     </Row>
                     <Row  xs={12}>
                        <div ref="perfomanceTable" id="perfomanceTable"></div>
                     </Row>
                </div>


            </div>
        );
    }


});




