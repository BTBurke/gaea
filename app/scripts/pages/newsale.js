var React = require('react');
var B = require('react-bootstrap');
var Marty = require('marty');
var _ = require('underscore');

var TopNav = require('../components/topnav');
var Calendar = require('react-bootstrap-calendar').Calendar;
var Directions = require('../components/directions');
var Utils = require('../services/utils');
var Config = require('../config');

var Application = require('../stores/application');
var app = new Application();

class NewSale extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      'open': new Date(this.props.sale.open_date),
      'close': new Date(this.props.sale.close_date),
      'sale_type': this.props.sale.sale_type,
      'sales_copy': this.props.sale.sales_copy
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
  
  onSaveChanges() {
    var update ={
      'sale_id': this.props.sale.sale_id,
      'open_date': this.state.open,
      'close_date': this.state.close,
      'sale_type': this.props.sale.sale_type,
      'sales_copy': this.state.sales_copy
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
                
                
                <B.Input type="select" ref="saletype" label="Sale Type" placeholder="Choose sale type" value={this.props.sale.sale_type} readOnly>
                  <option value={this.props.sale.sale_type}>{Utils.Capitalize(this.props.sale.sale_type)}</option>
                </B.Input>
            </B.Col>
            </B.Row>
            <B.Row>
            <B.Col md={6} lg={6} mdOffset={3} lgOffset={3}>
                
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
reactMixin(EditSale.prototype, Navigation);

module.exports = Marty.createContainer(EditSale, {
  listenTo: ['UserStore', 'SaleStore'],
  fetch: {
    user: function() {
      return this.app.UserStore.getUser();
    },
    sale: function() {
      var sales = this.app.SaleStore.getSales();
      sales.result = _.findWhere(sales.result, {"sale_id": this.props.params.saleID});
      return sales;
    }
  }
});