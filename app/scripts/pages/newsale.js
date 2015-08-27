var React = require('react');
var B = require('react-bootstrap');
var Marty = require('marty');
var _ = require('underscore');

var TopNav = require('../components/topnav');
var Calendar = require('react-bootstrap-calendar').Calendar;
var Directions = require('../components/directions');
var Utils = require('../services/utils');
var Config = require('../config');
var log = require('../services/logger');
var ErrorBar = require('../components/errorbar');

var Application = require('../stores/application');
var app = new Application();

class NewSale extends React.Component {
  constructor(props) {
    super(props);

    this.transitionPending = false;

    this.state = {
      'error': null,
      'open': new Date(),
      'close': new Date(),
      'sales_copy': '',
      'title': '',
      'require_final': true
    }
  }

  componentWillReceiveProps(newprops) {
    console.log("old props", this.props);
    console.log("new props", newprops);

    if (this.transitionPending) {
       var newSale = _.difference(newprops.sale, this.props.sale)[0];
       log.Debug("Found new sale", newSale);
       window.location = Config.homeURL + '/#/sale/' + newSale.sale_id + '/inventory';
    }
  }

  onDatePickOpen(d) {
    console.log('date receive', d);
    this.setState({'open': new Date(d)});
    console.log('new date state', this.state);
    setTimeout(() => {
      React.findDOMNode(this.refs.opendate).children[1].click();
    }, 300);
  }

  onDatePickClose(d) {

    var newDate = new Date(d);
    this.setState({'close': newDate});
    if (newDate <= this.state.open) {
      this.setState({'error': 'Error: Closing date must be after opening date'});
    } else {
      this.setState({'error': null});
    }
    setTimeout(() => {
      React.findDOMNode(this.refs.closedate).children[1].click();
    }, 300);
  }

  onSalesCopyChange() {
    this.setState({'sales_copy': this.refs.salescopy.getValue()});
  }

  onSalesTitleChange() {
    this.setState({'title': this.refs.title.getValue()});
  }

  onRequireFinalChange() {
    this.setState({'require_final': this.refs.requirefinal.getValue() === 'required' ? true : false});
  }

  onSaveChanges() {
    var sale ={
      'open_date': this.state.open,
      'close_date': this.state.close,
      'sale_type': this.refs.saletype.getValue(),
      'title': this.refs.title.getValue(),
      'require_final': this.refs.requirefinal.getValue() === 'required' ? true : false,
      'sales_copy': this.state.sales_copy
    };

    if (sale.open_date >= sale.close_date) {
      this.setState({'error': 'Error: The close date must be at least one day after the open date.'});
      return;
    }

    if (sale.sales_copy.length === 0) {
      this.setState({'error': 'Error: Enter some sales copy, otherwise the main page announcing the sale will be blank and so will the announcement email.'});
      return;
    } else {
      this.setState({'error': null});
    }

    log.Debug('Adding new sale', sale);
    this.app.SaleQueries.createSale(sale);

  }

  render() {


    var dirs = [
      {'section': 'Open Date', 'text': 'Enter the date you want the sale to begin.  Members will get an email announcing the sale.'},
      {'section': 'Close Date', 'text': 'Enter the date you want the sale to close. No new orders will be accepted after this date. Members will start getting emails 5 days before close for them to submit their order.'},
      {'section': 'Sale Type', 'text': 'Select the type of sale.  You will upload the inventory for the sale in the next step.'},
      {'section': 'Require Finalization', 'text': 'If set to required, then the sale must be manually finalized before customers will get a bill and be invoiced.  This is useful for orders where some costs are variable and allows those costs to be split and added to the bill once known.'},
      {'section': 'Sales Title', 'text': 'Write a snazzy one line description of the sale.  This will appear as the title announcing the sale.'},
      {'section': 'Sales Copy', 'text': 'Write a description of the sale.  This text will appear as the body of the email announcing the sale and as an announcement on the homepage as long as the sale is open.'}
    ];

    var textareasty = {
      'height': "150px"
    };

    return (
      <div>
      <TopNav user={this.props.user.fullName}/>
      <B.Grid>
        <B.Row>
          <B.Col md={8} lg={8} mdOffset={2} lgOffset={2}>
          <Directions title="Creating a new sale" directions={dirs}/>
          </B.Col>
        </B.Row>
        <B.Row>
          <B.Col md={8} lg={8} mdOffset={2} lgOffset={2}>
            <ErrorBar error={this.state.error}/>
          </B.Col>
        </B.Row>

            <div>
            <form>

            <B.Row>
            <B.Col md={4} mdOffset={3} lg={4} lgOffset={3}>

                <B.OverlayTrigger trigger="click" overlay={<B.Popover placement="top"><Calendar onDaySelected={this.onDatePickOpen.bind(this)} selectedDate={this.state['open']}/></B.Popover>}>
                 <B.Input type="text" ref="opendate" label="Open Date" value={this.state['open'].toDateString()} readOnly/>
                </B.OverlayTrigger>

                <B.OverlayTrigger trigger="click" overlay={<B.Popover placement="top"><Calendar onDaySelected={this.onDatePickClose.bind(this)} selectedDate={this.state['close']}/></B.Popover>}>
                 <B.Input type="text" ref="closedate" label="Close Date" value={this.state['close'].toDateString()} readOnly/>
                </B.OverlayTrigger>


                <B.Input type="select" ref="saletype" label="Sale Type" placeholder="Choose sale type" value={this.state.sale_type}>
                  <option value="alcohol">Alcohol</option>
                  <option value="merchandise">Merchandise</option>
                </B.Input>

                <B.Input type="select" ref="requirefinal" label="Require Finalization" placeholder="Choose Finalization Status" value={this.state.require_final ? 'required': 'notrequired'} onChange={this.onRequireFinalChange.bind(this)}>
                  <option value="required">Required</option>
                  <option value="notrequired">Not Required</option>
                </B.Input>
            </B.Col>
            </B.Row>
            <B.Row>
            <B.Col md={6} lg={6} mdOffset={3} lgOffset={3}>
                <B.Input type="text" label="Sales Title" ref="title" value={this.state.title} onChange={this.onSalesTitleChange.bind(this)} />

                <B.Input type="textarea" style={textareasty} label="Sales Copy" ref="salescopy" value={this.state.sales_copy} onChange={this.onSalesCopyChange.bind(this)} />
            </B.Col>
            </B.Row>

             </form>
             </div>
             <B.Row>
             <B.Col md={8} lg={8} mdOffset={3} lgOffset={3}>
              <B.Button bsStyle='info' onClick={this.onSaveChanges.bind(this)}>Next Step: Upload Inventory</B.Button>
             </B.Col>
             </B.Row>
      </B.Grid>

      </div>
    );
  }
}

module.exports = Marty.createContainer(NewSale, {
  listenTo: ['UserStore', 'SaleStore'],
  fetch: {
    user: function() {
      return this.app.UserStore.getUser();
    },
    sale: function() {
      var sales = this.app.SaleStore.getSales();
      //sales.result = _.findWhere(sales.result, {"sale_id": this.props.params.saleID});
      return sales;
    }
  }
});
