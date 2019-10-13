/** @jsx React.DOM */




var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;


var JournalDlg = React.createClass({
    getInitialState: function () {

        return {
            genJournalSel: -1,
            nameText: this.props.initVal,
            dateText: "",
            tagTxt: "",
            mySet: new Set(),
            tagList: "",
            tags: this.props.tags,
            rtags: this.props.rtags
        };
    },
    nameTxt: "",
    keyg: 5,
    dtTxt: null,
    tagTxt: null,
    mySet: new Set(),
    handleTagChange: function (e) {
        this.setState({tagText: e.target.value});

        if (e.target.value.length > 0) {
            $("#newTag"+ this.props.modal).removeClass("disabled");

        } else {
            $("#newTag"+ this.props.modal).addClass("disabled");
        }
    },
    handleDateChange: function (e) {
        this.setState({dateText: e.target.value});
    },
    handleChange: function (e) {
        this.setState({nameText: e.target.value});
        if (this.props.dlgType == 1) {
            if (e.target.value.trim().length > 0)
                $("#okButton" + this.props.modal).removeClass("disabled");
            else
                $("#okButton" + this.props.modal).addClass("disabled");
        }
    },
    ok: function (t) {
        if (this.props.dlgType == 1) {
            this.props.okFunc($(this.refs.nameTxt.getDOMNode())[0].value,
                this.state.genJournalSel, $(this.refs.dateTxt.getDOMNode())[0].value,
                this.state.tagList);

        } else
            this.props.okFunc(this.state.tagList, this.state.genJournalSel, 0, 0);
        this.mySet.clear();
        this.state.mySet.clear();
        this.setState({mySet: this.mySet, tagList: ""});
        if(this.tagTxt)
            $(this.refs.tagTxt.getDOMNode())[0].value ="";

    },
    quit: function (t) {
        this.props.quit();
        if (this.props.dlgType != 2) {
            $("#newTag" + this.props.modal).addClass("disabled");
            $(this.refs.tagTxt.getDOMNode())[0].value = "";
        }
    },
    componentWillReceiveProps: function () {

        this.setState({tags: this.props.tags});


        if (this.refs.dateTxt) {
            this.setState({dateText: this.props.dt});
            this.setState({nameText: this.props.initVal});
            if (this.props.initVal.length >  0)
                $("#okButton" + this.props.modal).removeClass("disabled");
            if (this.props.title =="Modify General Journal"){
                let t=this.props.setTags.split(",");
                let s = new Set()
                for(let i in t)
                    s.add(t[i]);
                this.mySet = s;
                this.setState({mySet: s, tagList: this.props.setTags})
            }

        }
    },
    componentDidMount: function () {
        if (this.refs.dateTxt) {
            this.dtTxt = $(this.refs.dateTxt.getDOMNode())[0];
            this.nameTxt = $(this.refs.nameTxt.getDOMNode())[0];
        }
    },

    getFG: function (item) {
        let col = "#7a414d";
        return this.state.mySet.has(item) ? "lightblue" : col;
    },

    getBG: function (item) {
        let col = "#7a414d";
        return this.state.mySet.has(item) ? col : "lightblue";
    },
    selectPosition: function (id, jid) {
        if (this.mySet.has(jid)) {
            this.mySet.delete(jid);
        } else {
            this.mySet.add(jid);
        }
        let tagList = ""
        if (this.mySet.size > 0) {
            if (this.props.dlgType != 1)
                $("#okButton" + this.props.modal).removeClass("disabled");
            let array = [];
            this.mySet.forEach(v => array.push(v));
            for (let i in array) {
                if (i != 0)
                    tagList += ",";
                tagList += array[i];
            }
        } else {
            if (this.props.dlgType != 1)
                $("#okButton" + this.props.modal).addClass("disabled");
        }
        this.setState({mySet: this.mySet, tagList: tagList});
    },
    addNewTag: function (t) {

        let tt = $(this.refs.tagTxt.getDOMNode())[0].value;
        $(this.refs.tagTxt.getDOMNode())[0].value = "";
        let nt = tt.split(",");

        for (let i in nt) {
            if (!this.state.tags.includes(nt[i])) {
                this.state.tags.push(nt[i]);
            }
            this.mySet.add(nt[i]);
        }
        if (this.props.dlgType != 1)
            $("#okButton" + this.props.modal).removeClass("disabled");
        let array = [];
        let tagList = "";
        this.mySet.forEach(v => array.push(v));
        for (let i in array) {
            if (i != 0)
                tagList += ",";
            tagList += array[i];
        }
        this.setState({tags: this.state.tags, mySet: this.mySet, tagList: tagList});
    },
    render: function () {


        if (this.nameTxt) this.nameTxt.value = this.state.nameText;
        if (this.dtTxt) this.dtTxt.value = this.state.dateText;
        if (this.tagTxt) this.tagTxt.value = this.state.tagText;
        var lbl = "my" + this.props.modal + "Label";
        var target = "#my" + this.props.modal;
        var idtarget = "my" + this.props.modal;
        var idbutton = "mybidbutton" + this.props.modal;

        var clonedArray = this.props.rtags;
        if (this.props.dlgType != 2) {

            var clonedArray = JSON.parse(JSON.stringify(this.state.tags));

            if (this.state.tags.length > 0)
                clonedArray.splice(0, 1);
        }

        let positionBoxes = [];
        for (let i = 0; i < clonedArray.length; i += 5) {
            let lim = i + 5 > clonedArray.length ? clonedArray.length - i : 5;
            var clonedArray2 = JSON.parse(JSON.stringify(clonedArray));
            let boxes = clonedArray2.splice(i, lim).map((item, index) => {
                return (

                    <Col xs={2} className="positionLbl" key={item.jid}>
                        <Card bg={this.getBG(item)} fs="18px" fg={this.getFG(item)} name={item} height="30px"
                              switchPosition={this.selectPosition} id={item} jid={item}
                              width="140px"/>
                    </Col>
                )
            });
            positionBoxes.push(boxes);
        }

        let tagBoxes = positionBoxes.map((item, index) => {

            return (
                <Row xs={12} className="container" key={this.keyg++}>
                    {positionBoxes[index]}
                </Row>
            )
        });


        return (
            <div xs={10} className="container">

                <button id={idbutton} type="button" className="btn btn-primary " data-toggle="modal"
                        data-target={target}>
                    {this.props.buttonLabel}
                </button>

                <div className="modal fade" id={idtarget} tabindex="-1" role="dialog" aria-labelledby={lbl}
                     aria-hidden="true">
                    <div className="modal-dialog exwide">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"><span
                                    aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                                <h4 className="modal-title" id={lbl} key={this.props.key}>{this.props.title}</h4>
                            </div>
                            <div>

                                {this.props.dlgType == 1 ?
                                    <Row xs={6} className="container">
                                        <Col xs={3} className="positionLbl">
                                            {this.props.label}
                                        </Col>
                                        <Col xs={3} >
                                            <input onChange={this.handleChange} className="searchBox"
                                                                      ref="nameTxt"/>
                                        </Col>

                                    </Row> : ""}

                                {this.props.dlgType == 1 ?
                                    <Row xs={6} className="container">
                                        <Col xs={3} className="positionLbl">
                                            Start Date(YYYY-MM-DD):
                                        </Col>

                                        <Col xs={3}>
                                            <input className="searchBox"
                                                   ref="dateTxt" onChange={this.handleDateChange}/>
                                        </Col>
                                    </Row> : ""}

                            </div>
                            <div className="overflowy">
                                <Row xs={8} className="container">
                                    {this.props.dlgType != 2 ?
                                        <Col xs={1}>
                                            <button type="button" id={"newTag"+ this.props.modal} onClick={this.addNewTag}
                                                    className="btn  btn-primary disabled">Add Tag
                                            </button>
                                        </Col> : ""}
                                    {this.props.dlgType != 2 ?
                                        <Col xs={2}>
                                            <input className="searchBox"
                                                   ref="tagTxt" onChange={this.handleTagChange}/>
                                        </Col> : ""}
                                    <Col xs={5} className="positionLbl">
                                        {this.state.tagList}
                                    </Col>


                                </Row>
                                <Row xs={12} className="container">
                                    {tagBoxes}
                                </Row>
                            </div>
                            <div className="modal-footer">

                                <button type="button" className="btn btn-default" data-dismiss="modal"
                                        onClick={this.quit}>Cancel</button>
                                <button type="button" className="btn btn-primary disabled" onClick={this.ok}
                                        id={"okButton" + this.props.modal}
                                        data-dismiss="modal">{this.props.buttonLabel}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});




