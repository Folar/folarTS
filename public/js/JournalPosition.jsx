/** @jsx React.DOM */
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;

const data = {
    currentId: 2,
    dates:[
        // {
        //     date: "Oct Monday 15",
        //     text :"First"
        // },
        // {
        //     date: "Oct Tuesday 16",
        //     text :"second"
        // },
        // {
        //     date: "Oct Wednesday 17",
        //     text :""
        // },
        // {
        //     date: "Oct Thursday 18",
        //     text :"forth"
        // },
        // {
        //     date: "Oct Friday 19",
        //     text: "fifth"
        // }
    ],
    positions: [
        // {
        //     name: "RHINONOV18",
        //     id: 1
        // },
        // {
        //     name: "BUTNOV18",
        //     id: 2
        // },
        // {
        //     name: "BEARNOV18",
        //     id: 3
        // },
        // {
        //     name: "BARBNOV18",
        //     id: 4
        // },
        // {
        //     name: "FROGNOV18",
        //     id: 5
        // },
        // {
        //     name: "COWNOV18",
        //     id: 6
        // }
    ]

};


var JournalPosition = React.createClass({
    getInitialState: function () {
        return {
            currentId:-1,
            positions: [],
            dates:[]

        };
    },
    componentDidMount: function () {


        var func = this.success;
        $.post("/journal", {}, function (data) {
                func(data);
                //this.setState({busy: true});
            }
        )
    },

    success: function (data) {
       this.setState({currentId:data.currentId,positions:data.positions,dates:data.dates});

    },

    fail: function () {

    },

    getFG: function (item) {
        return item.id == this.state.currentId ? "#20b2aa" : "white";
    },

    getBG: function (item) {
        return item.id == this.state.currentId ? "white" : "#20b2aa";
    },
    getButtonText: function (item) {
        if (!this.getExpand(item)) return "ADD";
        return "EDIT";
    },

    getMode: function (item) {
        if (!this.getExpand(item)) return 0;
        return 1;
    },
    getExpand: function (item) {

        return item.text.length > 0;
    },
    saveNote: function (id,text,dt) {

        var func = this.success;
        $.post("/saveNote", {id: id,text:text,pid:this.state.currentId,dt:dt}, function (data) {
            func(data);
            //this.setState({busy: true});
        })
    },
    switchPosition:function (id) {
        var func = this.success;
        $.post("/switchPosition", {pid: id}, function (data) {
            func(data);
            //this.setState({busy: true});
        })
    },
    render: function () {
        var transition = function (state, name, fnc) {


        };
        let positionBoxes =
            this.state.positions.map((item, index) => {

                return (
                    <Col xs={2} className="positionLbl">
                        <Card bg={this.getBG(item)} fs="18px" fg={this.getFG(item)} name={item.name} height="30px"
                              switchPosition= {this.switchPosition} id = {item.id}
                              width="140px"/>
                    </Col>)
            });
        let notes =
            this.state.dates.map((item, index) => {

                return (
                    <Row xs={12} className="container">
                        <Note bg="#c0c0c0" fs="18px" fg="black" date={item.date} text={item.text}
                              buttonText={this.getButtonText(item)} id={item.id} saveNote= {this.saveNote}
                              dt = {item.dt}
                              mode={this.getMode(item)} expand={this.getExpand(item)}/>
                    </Row>
                )
            });
        return (
            <div className="container">
                <div className="container">
                    <Row xs={12} className="container">
                        <h3> Open Positions </h3>
                    </Row>
                    <Row xs={12} className="container">
                        {positionBoxes}
                    </Row>

                </div>
                <div className="container">
                    <Row xs={11} className="container">
                        <h3> Notes </h3>
                    </Row>
                    <div xs={11} className="container" style={{fontSize:"18px",alignItems:"left", overflow:"auto",
                    height:'300px'}}>
                        {notes }
                    </div>
                </div>
            </div>

        );
    }


});




