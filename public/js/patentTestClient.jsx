/** @jsx React.DOM */

var Models = {}, Collections = {};

Models.Reaction = Backbone.Model.extend({
    paramRoot: 'reaction',
    urlRoot: '/reaction',
});

Collections.ReactionCollection = Backbone.Collection.extend({
    model: Models.Reaction,
    url: '/reaction'
});

Models.Patent = Backbone.Model.extend({
    paramRoot: 'patent',
    urlRoot: '/patent',
    idAttribute: 'patentID'
});

Collections.PatentCollection = Backbone.Collection.extend({
    model: Models.Patent,
    url: '/patent'
});

var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;
var Glyphicon = ReactBootstrap.Glyphicon;

var InputBox = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getDefaultProps: function() {
        return { input: '' };
    },
    render: function() {
        return (
            <textarea className="form-control" rows="10" valueLink={this.props.input}></textarea>
        );
    }
});

var CodeBlock = React.createClass({
    componentDidMount: function() {
        Prism.highlightElement(this.getDOMNode());
    },
    componentDidUpdate: function(prevProps, prevState) {
        Prism.highlightElement(this.getDOMNode());
    },
    render: function() {
        var codeClass = "language-" + this.props.language;
        return <pre className={ codeClass }><code className={ codeClass }>{ this.props.code }</code></pre>
    }
});

var ViridisApplication = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    componentWillMount: function() {
        var patentCollection = this.state.patentCollection;

        patentCollection.fetch({
            async: false
        });

        this.loadPatent();
    },
    componentDidUpdate: function(prevProps, prevState) {
        if (this.state.currentPatentIndex != prevState.currentPatentIndex)
            this.loadPatent();
    },
    getInitialState: function() {
        return {
            patentCollection: new Collections.PatentCollection(),
            reactionCollection: new Collections.ReactionCollection(),
            currentPatentIndex: 0,
            comments: "",
            chemicalTaggerText: "",
            busy: false
        };
    },
    success: function() {
        this.setState({ busy: false, chemicalTaggerText: this.state.reactionCollection.models.length });
    },
    fail: function() {
        this.setState({ busy: false, chemicalTaggerText: "Error processing patent text." });
    },
    prev: function() {
        this.setState({ currentPatentIndex: this.state.currentPatentIndex <= 0 ? this.patentCount() - 1 : this.state.currentPatentIndex - 1 });
    },
    next: function() {
        this.setState({ currentPatentIndex: this.state.currentPatentIndex >= this.patentCount() - 1 ? 0 : this.state.currentPatentIndex + 1 });
    },
    loadPatent: function() {
        this.setState({ busy: true });

        if (this.patentText() != null) {
            this.state.reactionCollection.fetch({ data: { input: this.patentText(), reactionType: 'found' }, async: true, success: this.success, fail: this.fail, type: 'POST' });
        }
    },
    patent: function() {
        return this.patentCount() > this.state.currentPatentIndex ?
            this.state.patentCollection.models[this.state.currentPatentIndex] : null;
    },
    patentCount: function() {
        return this.state.patentCollection != null ? this.state.patentCollection.models.length : 0;
    },
    patentText: function() {
        var patent = this.patent();

        if (patent != null) {
            var patentDescriptions = patent.get('patentDescription')['patentDescriptions'];
            var count = Object.keys(patentDescriptions).length;

            return patentDescriptions[count];
        }

        return null;
    },
    render: function() {
        var buttonContent = this.state.busy ? <img src="img/ajax-loader.gif"></img> : "Submit";
        var patent = this.patent();

        var chemicalTaggerContent = this.state.busy ? <img src="img/ajax-loader.gif"></img> : this.state.chemicalTaggerText;

        return (
            <div className="container">
                <Row>
                    <Col md={6}>
                        <Row>
                            <Col md={12}>
                                <Row>
                                    <Col md={3}>
                                        <Button onClick={this.prev}><Glyphicon glyph="backward" /></Button>
                                    </Col>
                                    <Col md={6}>
                                        <div className="centertext">
                                            { patent != null ? patent.get('patentTitle') : "" }
                                        </div>
                                   </Col>
                                    <Col md={3}>
                                         <Button onClick={this.next}><Glyphicon glyph="forward" /></Button>
                                    </Col>
                                </Row>
                                <div className="overflowy">
                                    { patent != null ? this.patentText() : "" }
                                </div>
                            </Col>
                            <Col md={12}>
                                <div className="overflowy">
                                    { chemicalTaggerContent }
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={6}>
                        <Row>
                            <Col md={12}>
                                <div className="overflowy">
                                </div>
                            </Col>
                            <Col md={12}>
                                <h2>Comments</h2>
                                <InputBox input={this.linkState('comments')} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
});

React.renderComponent(
  <ViridisApplication />,
  document.getElementById('react-container')
);