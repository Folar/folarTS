

/** @jsx React.DOM */




var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;

var Models = {}, Collections = {};



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
              ;

                    alert (data.cnt +" transactions have been created");
                    this.uploadFunc();
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

            this.props.func();
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




