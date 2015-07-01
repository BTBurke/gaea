var React = require('react');
var B = require('react-bootstrap');
var Marty = require('marty');
var _ = require('underscore');

var TopNav = require('../components/topnav');
var Calendar = require('react-bootstrap-calendar').Calendar;

var Application = require('../stores/application');
var app = new Application();

class EditSale extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      'open': new Date(this.props.sale.open_date),
      'close': new Date(this.props.sale.close_date)
    }
  }
  
  onDatePick(d) {
    console.log('date receive', d);
    this.setState({'open': new Date(d)});
    console.log('new date state', this.state);
  }

  render() {

    console.log("component receive sale", this.props.sale);
  
    if (this.props.sale) {
      var shortOpen = new Date(this.props.sale.open_date);
      var shortClose = new Date(this.props.sale.close_date);
    }
    
    return (
      <div>
      <TopNav user={this.props.user.fullName}/>
      <B.Grid>
        <B.Row>
          <B.Col md={3} lg={3}>
            
          </B.Col>

          <B.Col md={4} lg={4}>
             <div>
             <form>
                
                <B.OverlayTrigger trigger="click" overlay={<B.Popover placement="top"><Calendar onDaySelected={this.onDatePick.bind(this)} selectedDate={this.state['open']}/></B.Popover>}>
                 <B.Input type="text" ref="opendate" label="Open Date" value={this.state['open'].toDateString()} placeholder="MM/DD/YYYY"/>
                </B.OverlayTrigger>
                
                
                <B.Input type="text" ref="closedate" label="Close Date" value={shortClose.toDateString()} placeholder="MM/DD/YYYY"/>
                <B.Input type="select" ref="saletype" label="Sale Type" placeholder="Choose sale type"/>
             </form>
             </div>
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
      sales.result = _.findWhere(sales.result, {"sale_id": this.props.params.saleID});
      return sales;
    }
  }
});