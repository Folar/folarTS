

/** @jsx React.DOM */


var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;

var ViridisLogin = React.createClass({
 getInitialState: function() {
        return {
            busy:false,
            loginSource: new Collections.loginCollection()
        };
    },
    submitText3: function() {
            var name  = $(this.refs.name.getDOMNode())[0].value;
            var pw  = $(this.refs.pw.getDOMNode())[0].value;
            this.state.loginSource.fetch({ data: { email: name, pw: pw }, success: this.success, fail: this.fail, type: 'POST' });
            this.setState({ busy: true });

    }
    ,
    success: function() {
             var func  = this.props.func;
               this.setState({ busy: false })
               var temp = this.state.loginSource.map(function(data, key) {

                    if (data.attributes.duplicateUser)
                        alert("Wrong user and password");
                    else
                         func(3,data.attributes.user,data.attributes.queries_left);

               });


    },
    fail: function() {
        this.setState({busy: false});
    },
    onClick:function(){
            this.props.func(4);
    },

    render: function() {
        var buttonContent = this.state.busy ? <img src="img/ajax-loader.gif"></img> : "Login";

        return (
            <div  xs={12} className="container" >
                <h1 className="titleFont">Folar Trade Station</h1>
                <Row xs={12} >

                    <Col className="col-lg-6 col-md-12 col-sm-12 borderRight">
                        <Row xs={12}>
                            <div >
                                 <input ref="name" className="top75 form-control" placeholder="Username"></input>
                            </div>
                        </Row>
                        <Row xs={12}>
                            <div >
                                 <input  ref="pw" className="top75 form-control" type="password" placeholder="Password"></input>
                            </div>
                        </Row>
                        <Row xs={12}>
                            <div >
                                  <Button className="loginButton"  bsSize="large" onClick={this.submitText3} disabled={this.state.busy}>{buttonContent}</Button>
                            </div>
                        </Row>
                    </Col>
                          <Col className="col-lg-6 col-md-12 col-sm-12 ">

                               <Row xs={12}>
                                    <div >
                                         <p  className='wantto' >Do you want to use Viridis Chem, But Don't have an account?</p>
                                    </div>
                               </Row>
                              <Row xs={12}>
                                  <div >
                                       <a href="#" className='registerLink' onClick={this.onClick.bind(this)}>Register Now</a>
                                  </div>
                              </Row>
                          </Col>

                </Row>
            </div>
        );
    }


});




