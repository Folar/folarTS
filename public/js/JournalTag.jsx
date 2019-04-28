/** @jsx React.DOM */
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;


var JournalTag = React.createClass({
    getInitialState: function () {
        return {
            positions: [],
            mySet: new Set(),
            lbl: "Archived"

        };
    },
    componentDidMount: function () {
        var func = this.success;
        $("#mybidbuttonModalTag").addClass("disabled");
        $("#archBtn").addClass("disabled");
        $.post("/getTags", {tag: this.props.tag}, function (data) {
                func(data);
                //this.setState({busy: true});
            }
        )
    },
    newTags: "$",
    hasTag: function (currentTag, tags) {
        if (tags == "$N/A" || currentTag == "All") return true;
        let ts = tags.split(',');
        for (let i in ts) {
            if (currentTag.toUpperCase() == ts[i].toUpperCase().trim()) {
                return true;
            }
        }
        return false;
    },

    success: function (data) {
        this.mySet.clear();
        let buttonLbl = "Archived";
        if (this.props.tag != "true") {
            buttonLbl = "Unarchived";
            // alert(buttonLbl)
        }
        this.setState({positions: data.positions, mySet: this.mySet, lbl: buttonLbl});


    },

    fail: function () {

    },

    getFG: function (item) {
        let col = item.id == 0 ? "#7a414d" : "#20b2aa";
        return this.state.mySet.has(item.jid) ? col : "white";
    },

    getBG: function (item) {
        let col = item.id == 0 ? "#7a414d" : "#20b2aa";
        return this.state.mySet.has(item.jid) ? "white" : col;
    },


    okNewJournal: function (val, junk, dt, tags) {
        let func = this.switchPosition;
        this.newTags = tags;
        $.post("/newJournal",
            {
                name: val,
                dt: dt,
                tags: tags
            },
            function (data) {
                if (data.dupName) {
                    alert('Journal ' + data.dupName + ' already exists!')
                }
                func(0, data.jid);

            }
        );
    },
    okModJournal: function (val, junk, dt, tags) {
        let cmd = "/tagJournals";
        let array = [];
        let func = this.getJournals;
        let len = this.mySet.size;
        this.mySet.forEach(v => array.push(v));
        $.post(cmd, {journals: array, tag: val, len: len}, function (data) {
            func();
        })
    },
    initValEmpty: function () {

        if (!this.state.tagSel || this.state.tagSel == 'All')
            return "";

        return this.state.tagSel;
    },

    formatDate: function () {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return year + "-" + month + "-" + day;
    },
    mySet: new Set(),
    archived: function () {
        let array = [];
        let cmd = "/unarchivedJournals";
        if (this.props.tag == "true")
            cmd = "/tagJournals";

        let func = this.getJournals;
        let len = this.mySet.size;
        this.mySet.forEach(v => array.push(v));
        $.post(cmd, {journals: array, tag: "archived", len: len}, function (data) {

            func();
        });
        // console.log("archived....")

    },
    getJournals: function () {
        // console.log("gj....");
        let func = this.success;
        $.post("/getTags", {tag: this.props.tag}, function (data) {

            func(data);
        });
    },
    selectPosition: function (id, jid) {

        if (this.mySet.has(jid)) {
            this.mySet.delete(jid);
        } else {
            this.mySet.add(jid);
        }

        if (this.mySet.size > 0) {
            $("#mybidbuttonModalTag").removeClass("disabled");
            $("#archBtn").removeClass("disabled");
        } else {
            $("#archBtn").addClass("disabled");
            $("#mybidbuttonModalTag").addClass("disabled");
        }
        this.setState({mySet: this.mySet});
    },

    render: function () {
        let me = this;
        let positionBoxes =
            this.state.positions.map((item, index) => {

                return (
                    <Col xs={2} className="positionLbl" key={item.jid}>
                        <Card bg={this.getBG(item)} fs="18px" fg={this.getFG(item)} name={item.name} height="30px"
                              switchPosition={this.selectPosition} id={item.id} jid={item.jid}
                              width="140px"/>
                    </Col>
                )
            });

        return (
            <div xs={12} className="container">
                <div xs={12} className="container">
                    <Row xs={12} className="container">


                        <Col xs={2}>
                            <button type="button" id="archBtn" className="btn btn-primary" onClick={this.archived}>
                                {this.state.lbl}
                            </button>
                        </Col>
                        {this.props.tag == "true" && <Col xs={2}>
                            <NameDlg dlgType={0} modal="ModalTag" buttonLabel="Tag Journals"
                                     title="Tag Journal"
                                     genJournal={[]} gj="false" dt={""} tags={[]}
                                     okFunc={this.okModJournal} label="Name" initVal={""}/>
                        </Col>}

                    </Row>
                    <Row xs={12} className="container">
                        {positionBoxes}
                    </Row>


                </div>

            </div>

        );
    }


});




