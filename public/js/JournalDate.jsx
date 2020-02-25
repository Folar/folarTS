/** @jsx React.DOM */
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;


var JournalDate = React.createClass({
    getInitialState: function () {
        return {
            dates: [],
            tags: [],
            tagSel: "All"

        };
    },
    componentDidMount: function () {


        var func = this.success;
        $.post("/switchPositionForDate", {tag: "$USECURRENT"}, function (data) {
                console.log("componentDidMount tag=$USECURRENT");
                if (data.res == "OK")
                    func(data);
                else
                    alert(data.res)
                //this.setState({busy: true});
            }
        ).fail(function () {
            alert("Server is not responding.");
        });
    },
    keyg: 55,
    newTags: "$",
    hasTag: function (currentTag, tags) {
        console.log(tags + "ct =" + currentTag)
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

        this.setState({dates: data.dates, tags: data.tags, tagSel: data.currentTag});

    },
    scrollToBottom: function () {
        const scrollHeight = this.messageList.scrollHeight;
        const height = this.messageList.clientHeight;
        const maxScrollTop = scrollHeight - height;
        this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    },
    fail: function () {

    },

    getFG: function (item) {
        let col = item.id == 0 ? "#7a414d" : "#20b2aa";
        return item.jid == this.state.currentId ? col : "white";
    },

    getBG: function (item) {
        switch (item.category) {
            case "Todo":
                col = "#013220";
                break;
            case "Journal":
                col = "#7a414d";
                break;


            case "Strategy":
                col = "blue";
                break;
        }

        return item.jid == this.state.currentId ? "white" : col;
    },
    getButtonText: function (item) {
        if (!this.getExpand(item)) return "ADD";
        return "EDIT";
    },

    getMode: function (item) {
        if (item.last) return 2;
        if (!this.getExpand(item)) return 0;
        return 1;
    },
    getExpand: function (item) {

        return item.last || item.text.length > 0;
    },

    switchPosition: function () {

        var func = this.success;
        var sel = this.refs.tagsCombo.getConfigName();

        if (!sel)
            sel = "All";
        console.log("switchPositiion sel" + sel);
        $.post("/switchPositionForDate", {tag: sel}, function (data) {
            if (data.res == "OK")
                func(data);
            else
                alert(data.res);
        })
    },
    switchTags: function () {
        debugger;
        console.log("switchTags");
        var id = this.refs.tagsCombo.getConfigName();
        this.setState({tagSel: id});
        this.switchPosition();

    },
    refreshSelections: function () {
    },

    render: function () {
        let me = this;


        let newArray = this.state.dates;


        let notes =
            this.state.dates.map((item2, index2) => {
                debugger;
                item2.dateObj.entries.map((item, index) => {
                debugger;
                    return (
                        <Row xs={12} className="container" key={item.jid + item.dt}>
                            <Note bg="#c0c0c0" fs="18px" fg="black" date={item.date} text={item.text}
                                  buttonText=" " id={item.id} jid={item.jid}
                                  dt={item.dt} idx={index}
                                  positions={this.state.dates} report={item.last}
                                  mode={this.getMode(item)} expand={this.getExpand(item)}/>
                        </Row>
                    )
                });
            });
        return (
            <div xs={12} className="container">

                <Row xs={12} className="container">

                    <Col xs={2} className="showError">
                        <StockNameCombo ref="tagsCombo" names={this.state.tags} sel={this.state.tagSel}
                                        switchConfig={this.switchTags}/>
                    </Col>

                </Row>

                <div xs={12} className="container">
                    <Row xs={12} className="container">
                        <Col xs={4}/>
                        <Col xs={3}>
                            <h3> Notes </h3>
                        </Col>
                    </Row>
                    <div xs={11} className="container" style={{
                        fontSize: "18px", alignItems: "left", overflow: "auto",
                        height: '60vh'
                    }}>
                        {notes}
                    </div>
                </div>

            </div>
        );
    }


});




