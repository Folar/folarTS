

/** @jsx React.DOM */




var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;
var firstName;
var lastName;
var email;
var password ;
var password2;
var phone;
var mobile;
var address1;
var address2;
var city;
var phone;
var zip;
var state;
var company;
var dept;




var Details = React.createClass({
      getDefaultProps: function () {
        return {type: 'input',
                placeholder:'',
                klass:"detailInput",
                errKlass:'hideError',
                errStr:''
                };
      },
    render: function() {

        return (
            <Row>
                  <label className="detail" >{this.props.label}</label> &nbsp;<span><input  placeholder={this.props.placeholder} type={this.props.type} ref={this.props.rid} className={ this.props.klass} />
                  <span className={this.props.errKlass}>{this.props.errStr}</span></span>
            </Row>

        );
    }
});
var Details2 = React.createClass({
    render: function() {

        return (
            <Row>
                <Col xs={3} >
                  <label className="detail2" >{this.props.label}</label> &nbsp;<span><input  placeholder="Optional" ref={this.props.rid} className={ this.props.klass} /> </span>
                </Col>
                 <Col xs={3} >
                     <label className="detail3" >{this.props.label2}</label> &nbsp;<span><input  placeholder="Optional"  ref={this.props.rid2} className={ this.props.klass} /> </span>
                 </Col>
            </Row>

        );
    }
});


var TraderRegister= React.createClass({
    getInitialState: function() {
            return {
                busy:false,
                fnKlass:'detailInput',
                fnErrKlass:'hideError',
                fnErrStr:"First Name can't be empty",
                lnKlass:'detailInput',
                lnErrKlass:'hideError',
                lnErrStr:"Last Name can't be empty",
                pw1Klass:'detailInput',
                pw1ErrKlass:'hideError',
                pw1ErrStr:"Password must be 8 characters or more",
                pw2Klass:'detailInput',
                pw2ErrKlass:'hideError',
                emailErrStr:"Invalid EmailAddress",
                phoneErrStr:"Invalid Phone Number",
                mobileErrStr:"Invalid Mobile Phone Number",
                zipErrStr:"Invalid Zip Code",
                pw2ErrStr:"Confirmation Password does't match",
                regSource: new Collections.regCollection()
            };
    },
    submitText2: function() {
       // if(!this.validate()) return;
        func = this.success;
        $.post("/reg", {
            fn: firstName.value, ln: lastName.value, email:email.value, password:password.value,
            phone: phone.value, mobile: mobile.value, company:company.value,ad1:address1.value,
            ad2: address2.value, city: city.value, state:state.value,zip:zip.value ,
            dept: dept.value, country:country.value
            }, function (data) {
                func(data);
            }
        )

        this.setState({ busy: true });

    },
    success : function(data){

         var func  = this.props.func;
          this.setState({ busy: false })
           if (data.duplicateUser)
               alert(data.user + " Already Exists");
           else
                func(0,data.user,1);


    },

    validate: function() {
        var ret = true;
        var fnErr = "hideError";
        var fnBorder = "hideBorder detailInput";
        var lnErr = "hideError";
        var lnBorder = "hideBorder detailInput";
        var pw1Err = "hideError";
        var pw1Border = "hideBorder detailInput";
        var pw2Err = "hideError";
        var pw2Border = "hideBorder detailInput";
        var emailErr = "hideError";
        var emailBorder = "hideBorder detailInput";
        var phoneErr = "hideError";
        var phoneBorder = "hideBorder detailInput";
        var mobileErr = "hideError";
        var mobileBorder = "hideBorder detailInput";
        var zipErr = "hideError";
        var zipBorder = "hideBorder detailInput";
        if(firstName.value.length == 0){
            ret = false;
            fnErr = "showError error";
            var fnBorder = "detailInput showBorder";

        }
        if(lastName.value.length == 0){
            ret = false;
            lnErr = "showError error";
            var lnBorder = "detailInput showBorder";

        }

         if(password.value.length < 3){
            ret = false;
            pw1Err = "showError error";
            pw1Border = "detailInput showBorder";

         } else if (password.value != password2.value){
           ret = false;
           pw2Err = "showError error";
           pw2Border = "detailInput showBorder";

         }

         if(email.value.length !=0){
             //var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
             var ve =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value);
             if (!ve){
                ret = false;
                emailErr = "showError error";
                emailBorder = "detailInput showBorder";
             }
         } else {
            ret = false;
            emailErr = "showError error";
            emailBorder = "detailInput showBorder";
         }
         if(phone.value.length !=0){
              var ve = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone.value);
              if (!ve){
                 ret = false;

                 phoneErr = "showError error";
                 phoneBorder = "detailInput showBorder";
              }
         } else {
            ret = false;

            phoneErr = "showError error";
            phoneBorder = "detailInput showBorder";
         }
         if(mobile.value.length !=0){
              var ve = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(mobile.value);
              if (!ve){
                 ret = false;
                 mobileErr = "showError error";
                 mobileBorder = "detailInput showBorder";
              }
         }
        this.setState({fnKlass:fnBorder, fnErrKlass:fnErr,
                       lnKlass:lnBorder, lnErrKlass:lnErr,
                       pw1Klass:pw1Border, pw1ErrKlass:pw1Err,
                       pw2Klass:pw2Border, pw2ErrKlass:pw2Err,
                       emailKlass:emailBorder, emailErrKlass:emailErr,
                       phoneKlass:phoneBorder, phoneErrKlass:phoneErr,
                       mobileKlass:mobileBorder, mobileErrKlass:mobileErr});
        return ret;

    },

    render: function() {

      var buttonContent = this.state.busy ? <img src="img/ajax-loader.gif"></img> : "Register";
    return (
        <div  xs={3} className="container" >
            <h1 className="titleFontReg">Folar Trade Station</h1>
            <Details rid="fn" ref="fn"  label="First Name" klass={this.state.fnKlass} errKlass={this.state.fnErrKlass}  errStr={this.state.fnErrStr} />
            <Details rid="ln" ref="ln"   label="Last Name" klass={this.state.lnKlass} errKlass={this.state.lnErrKlass}  errStr={this.state.lnErrStr} />
            <br/>
            <Details  rid="email" ref="email"  placeholder="Becomes username" label="Email"  klass={this.state.emailKlass} errKlass={this.state.emailErrKlass}  errStr={this.state.emailErrStr} />
            <Details type="password" rid="pw"  ref="pw"  placeholder="at least 8 characters" label="Password" klass={this.state.pw1Klass} errKlass={this.state.pw1ErrKlass}  errStr={this.state.pw1ErrStr} />
            <Details type="password" rid="pw2" ref="pw2"  label="Confirm Password" klass={this.state.pw2Klass} errKlass={this.state.pw2ErrKlass}  errStr={this.state.pw2ErrStr} />
            <br/>

             <Details rid="phone" ref="phone" label="Phone" klass={this.state.phoneKlass} errKlass={this.state.phoneErrKlass}  errStr={this.state.phoneErrStr} />
             <Details rid="mobile" ref="mobile"  placeholder="Optional" label="Mobile" klass={this.state.mobileKlass} errKlass={this.state.mobileErrKlass}  errStr={this.state.mobileErrStr} />
             <br/>
             <Details rid="company" ref="company"  placeholder="Optional" label="Company" />
              <Details rid="add1" ref="add1"  placeholder="Optional" label="Address 1"  />
              <Details rid="add2" ref="add2"  placeholder="Optional" label="Address 2" />
             <Details rid="city" ref="city"  placeholder="Optional" label="City"  />
             <Details2 rid="state" ref="state"  label="State" klass="detailInputShort" rid2="zip" label2="Zip" />
             <Details  ref="country"  placeholder="Optional" rid="country" label="Country" />
             <Details rid="dept" ref="dept"  placeholder="Optional" label="Department"  />
              <Row>
                   <Button className="regButton"  bsSize="large" onClick={this.submitText2}
                           disabled={this.state.busy}>{buttonContent}</Button>
              </Row>
        </div>
        );
    },
     componentDidMount: function() {

          firstName = $(this.refs.fn.refs.fn.getDOMNode())[0];
          lastName = $(this.refs.ln.refs.ln.getDOMNode())[0];
          email = $(this.refs.email.refs.email.getDOMNode())[0];
          password = $(this.refs.pw.refs.pw.getDOMNode())[0];
          password2 = $(this.refs.pw2.refs.pw2.getDOMNode())[0];
          phone = $(this.refs.phone.refs.phone.getDOMNode())[0];
          mobile = $(this.refs.mobile.refs.mobile.getDOMNode())[0];
          address1 = $(this.refs.add1.refs.add1.getDOMNode())[0];
          address2 = $(this.refs.add2.refs.add2.getDOMNode())[0];
          city = $(this.refs.city.refs.city.getDOMNode())[0];
          phone = $(this.refs.phone.refs.phone.getDOMNode())[0];
          zip = $(this.refs.state.refs.zip.getDOMNode())[0];
          state = $(this.refs.state.refs.state.getDOMNode())[0];
          company = $(this.refs.company.refs.company.getDOMNode())[0];
          dept = $(this.refs.dept.refs.dept.getDOMNode())[0];
          country = $(this.refs.country.refs.country.getDOMNode())[0];


     }
});


