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

var Application = require('../stores/application');
var app = new Application();

class EditSale extends React.Component {
  constructor(props) {
    super(props);
    log.Debug("received props", props);
    var thisSale = _.findWhere(props.sale, {"sale_id": parseInt(props.params.saleID)});
    log.Debug("This sale", thisSale);

    this.state = {
      'sale_id': parseInt(thisSale.sale_id),
      'open': new Date(thisSale.open_date),
      'close': new Date(thisSale.close_date),
      'sale_type': thisSale.sale_type,
      'title': thisSale.title,
      'sales_copy': thisSale.sales_copy,
      'require_final': thisSale.require_final
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
    console.log('date receive', d);
    this.setState({'close': new Date(d)});
    console.log('new date state', this.state);
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
    var update ={
      'sale_id': this.state.sale_id,
      'open_date': this.state.open,
      'close_date': this.state.close,
      'sale_type': this.state.sale_type,
      'title': this.state.title,
      'sales_copy': this.state.sales_copy,
      'require_final': this.state.require_final
    };

    this.app.SaleQueries.updateSale(update);

    setTimeout(function() {
      console.log('context', this.context);
      console.log('this', this);
      window.location = Config.homeURL + '/#/sale';
    }.bind(this), 2000);
  }

  render() {


    var dirs = [
      {'section': 'Open Date', 'text': 'Enter the date you want the sale to begin.  Members will get an email announcing the sale.'},
      {'section': 'Close Date', 'text': 'Enter the date you want the sale to close. No new orders will be accepted after this date. Members will start getting emails 5 days before close for them to submit their order.'},
      {'section': 'Sale Type', 'text': 'The type of sale cannot be changed.  Create a new sale if you need to edit this value.'},
      {'section': 'Require Finalization', 'text': 'If set to required, then the sale must be manually finalized before customers will get a bill and be invoiced.  This is useful for orders where some costs are variable and allows those to be split and added to the bill once known.'},
      {'section': 'Sales Title', 'text': 'Write a snazzy one line description of the sale.  This will appear as the title announcing the sale.'},
      {'section': 'Sales Copy', 'text': 'Write a description of the sale.  This text will appear as an announcement on the homepage as long as the sale is open.'}
    ];

    var textareasty = {
      'height': "150px"
    };

    return (
      <div>
      <TopNav user={this.props.user}/>
      <B.Grid>
        <B.Row>
          <B.Col md={8} lg={8} mdOffset={2} lgOffset={2}>
          <Directions title="Editing a sale" directions={dirs}/>
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


                <B.Input type="select" ref="saletype" label="Sale Type" placeholder="Choose sale type" value={this.state.sale_type} readOnly>
                  <option value={this.state.sale_type}>{Utils.Capitalize(this.state.sale_type)}</option>
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
              <B.Button bsStyle='info' onClick={this.onSaveChanges.bind(this)}>Save Changes</B.Button>
             </B.Col>
             </B.Row>
      </B.Grid>

      </div>
    );
  }
}


module.exports = Marty.createContainer(EditSale, {
  listenTo: ['UserStore', 'SaleStore'],
  fetch: {
    user: function() {
      return this.app.UserStore.getUser();
    },
    sale: function() {
      var sales = this.app.SaleStore.getSales();
      return sales;
    }
  }
});
