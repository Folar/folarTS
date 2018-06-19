/** @jsx React.DOM */

var Models = {}, Collections = {};

Models.Synthesis = Backbone.Model.extend({
    paramRoot: 'synthesis',
    urlRoot: '/synthesis',
});

Collections.SynthesisCollection = Backbone.Collection.extend({
    model: Models.Synthesis,
    url: '/synthesis'
});

Models.Reaction = Backbone.Model.extend({
    paramRoot: 'reaction',
    urlRoot: '/reaction',
});

Collections.ReactionCollection = Backbone.Collection.extend({
    model: Models.Reaction,
    url: '/reaction'
});

var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Well = ReactBootstrap.Well;
var Button = ReactBootstrap.Button;
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;

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

var ChemicalProperty = React.createClass({
    render: function() {
        if (this.props.data) {
            return (
                <tr>
                    <td>{ this.props.header }</td>
                    <td>{ this.props.data }</td>
                </tr>
            );
        }
        else
            return null;
    }
});

var Chemical = React.createClass({
    render: function() {

        return (
            <Panel header={ this.props.data.name }>
                <Table striped bordered condensed hover>
                    <tbody>
                        <ChemicalProperty header="Amount" data={ this.props.data.amount } />
                        <ChemicalProperty header="Yield" data={ this.props.data.yield } />
                    </tbody>
                </Table>
            </Panel>
        );
    }
});

var Reaction = React.createClass({
    render: function() {
        var reactants = this.props.data.attributes['reactants'].map(function(chemical, key) {
            return (
                <Chemical data={chemical} key={key} />
            );
        });

        var products = this.props.data.attributes['products'].map(function(chemical, key) {
            return (
                <Chemical data={chemical} key={key} />
            );
        });

        var smilesURI = encodeURIComponent(this.props.data.attributes['smiles']);
        var image = this.props.data.attributes['image'] ? <img src={"data:image/png;base64," + this.props.data.attributes['image']}></img> : '';
        return (
            <div>
                <Row>
                    <Col xs={6}>
                        <Panel header="Input">
                            <Accordion>
                                <Panel header="Source text" key={1}>
                                    { this.props.data.attributes['input'] }
                                </Panel>
                                <Panel header="Tagged XML" key={2}>
                                    <CodeBlock language="markup" code={ this.props.data.attributes['xml'] } />
                                </Panel>
                                <Panel header="CML" key={3}>
                                    <CodeBlock language="markup" code={ this.props.data.attributes['cml'] } />
                                </Panel>
                            </Accordion>
                        </Panel>
                    </Col>
                    <Col xs={6}>
                        <Panel header="Output">
                            <Accordion>
                                <Panel header="Image" key={1}>
                                    { image }
                                </Panel>
                                <Panel header="Chemicalize.org" key={2}>
                                    <a href={"http://www.chemicalize.org/structure/#!mol=" + smilesURI}>Reaction SMILES</a>
                                </Panel>
                                <Panel header="Reactants" key={3}>
                                    { reactants }
                                </Panel>
                                <Panel header="Products" key={4}>
                                    { products }
                                </Panel>
                            </Accordion>
                        </Panel>
                    </Col>
                </Row>
            </div>
        );
    }
});

var ViridisApplication = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function() {
        return {
            reactionType: 'found',
            input: 'To a stirred solution of 4-hydroxypiperidine (0.97 g, 9.60 mmol) in anhydrous dimethylformamide (20 mL) at 0°C was added 1-(bromomethyl)-4-methoxybenzene (1.93 g, 9.60 mmol) and triethylamine (2.16 g, 21.4 mmol). The reaction mixture was then warmed to room temperature and stirred overnight. After this time the mixture was concentrated under reduced pressure and the resulting residue was dissolved in ethyl acetate (40 mL), washed with water (20 mL) and brine (20 mL) before being dried over sodium sulfate. The drying agent was filtered off and the filtrate concentrated under reduced pressure. The residue obtained was purified by flash chromatography (silica gel, 0-5% methanol/methylene chloride) to afford 1-(4-methoxybenzyl)piperidin-4-ol as a brown oil (1.70 g, 80%).',
            synthesis: new Models.Synthesis(),
            reactions: new Collections.ReactionCollection()
        };
    },
    submitText: function() {
        //this.state.synthesis.set({ input: this.state.input });
        //this.state.synthesis.save(null, { success: this.success, fail: this.fail });

        this.state.reactions.fetch({ data: { input: this.state.input, reactionType: this.state.reactionType }, success: this.success, fail: this.fail, type: 'POST' });
        this.setState({ busy: true });
    },
    success: function() {
        this.setState({busy: false});
    },
    fail: function() {
        this.setState({busy: false});
    },
    handleRadio: function(event) {
        this.setState({reactionType: event.target.value});
    },
    render: function() {
        var outputElements = this.state.reactions.map(function(reaction, key) {
            return (
                <Panel header={"Reaction " + (key+1)} key={key+1}>
                    <Reaction data={reaction} key={key} />
                </Panel>
            );
        });

        var buttonContent = this.state.busy ? <img src="img/ajax-loader.gif"></img> : "Submit"

        return (
            <div className="container">
                <Row>
                    <Col xs={12}>
                        <InputBox input={this.linkState('input')} />
                    </Col>
                    <Col xs={12}>
                        <span>Display all   </span>
                        <div className="radio-inline">
                            <label>
                                <input type="radio" name="reactionType" defaultChecked value="found" onChange={ this.handleRadio } />
                                found
                            </label>
                        </div>
                        <div className="radio-inline">
                            <label>
                                <input type="radio" name="reactionType" value="complete" onChange={ this.handleRadio } />
                                complete
                            </label>
                        </div>
                        <span>   reactions   </span>
                        <Button bsStyle="default" bsSize="small" onClick={this.submitText} disabled={this.state.busy}>{buttonContent}</Button>
                    </Col>
                    <Col xs={12}>
                        <Accordion>
                            { outputElements }
                        </Accordion>
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