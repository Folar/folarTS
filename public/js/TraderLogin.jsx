/** @jsx React.DOM */


var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;

var TraderLogin = React.createClass({
    getInitialState: function () {
        return {
            busy: false
        };
    },
    submitText3: function () {
        var name = $(this.refs.name.getDOMNode())[0].value;
        var pw = $(this.refs.pw.getDOMNode())[0].value;
        var func = this.props.func;
        $.post("/login", {name:"lar", pw:"lar"}, function (data) {

                if (data.badLogin)
                    alert("Wrong user and password");

                else {
                    func(3, data.email, 1);
                    //this.setState({busy: false});
                }
            }
        );
        //this.state.loginSource.fetch({ data: { email: name, pw: pw }, success: this.success, fail: this.fail, type: 'POST' });

       this.setState({busy: true});

    },

    onClick: function () {
        this.props.func(5);
    },

    render: function () {
        var buttonContent = this.state.busy ? <img src="img/ajax-loader.gif"></img> : "Login";

        return (
            <div xs={12} className="container">
                <h1 className="titleFont">Folar Trade Station</h1>
                <Row xs={12}>

                    <Col className="col-lg-6 col-md-12 col-sm-12 borderRight">
                        <Row xs={12}>
                            <div >
                                <input ref="name" className="top75 form-control" placeholder="Username"></input>
                            </div>
                        </Row>
                        <Row xs={12}>
                            <div >
                                <input ref="pw" className="top75 form-control" type="password"
                                       placeholder="Password"></input>
                            </div>
                        </Row>
                        <Row xs={12}>
                            <div >
                                <Button className="loginButton" bsSize="large" onClick={this.submitText3}
                                        disabled={this.state.busy}>{buttonContent}</Button>
                            </div>
                        </Row>
                    </Col>
                    <Col className="col-lg-6 col-md-12 col-sm-12 ">

                        <Row xs={12}>
                            <div >
                                <p className='wantto'>Do you want to use the Folar Trade Station, But Don't have an
                                    account?</p>
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




