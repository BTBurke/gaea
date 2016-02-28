
var _ = require('underscore');

function calcSubTotal(qty, price) {
  var subTotal = qty * price;
  return subTotal;
}

function calcSubTotalCasePricing(qty, price, caseQty, casePenalty) {
  var qtySubjectToPenalty = qty % caseQty;
  switch (qtySubjectToPenalty) {
    case 0:
      return calcSubTotal(qty, price);
    default:
      var subTotalBeforePenalty = calcSubTotal(qty, price);
      var penaltyPct = casePenalty/100.0;
      var penaltyTotal = calcSubTotal(qtySubjectToPenalty, penaltyPct * price);
      return subTotalBeforePenalty + penaltyTotal;
    }
  }

module.exports = {
  ItemTotal: function(invItem, qty, memberStatus) {

    var price = memberStatus === 'member' ? parseFloat(invItem.mem_price) : parseFloat(invItem.nonmem_price);

    switch(invItem.use_case_pricing) {
    case true:
      return calcSubTotalCasePricing(qty, price, invItem.case_size, invItem.split_case_penalty_per_item_pct);
    default:
      return calcSubTotal(qty, price);
    }
  },

  Total: function(oItems, inventory, memberStatus) {
    return _.reduce(oItems, (tot, item) => {
        var thisItem = _.findWhere(inventory, {'inventory_id': item.inventory_id});

        var price = memberStatus === 'nonmember' ? parseFloat(thisItem.nonmem_price) : parseFloat(thisItem.mem_price);

        switch (thisItem.use_case_pricing) {
          case true:
            return calcSubTotalCasePricing(item.qty, price, thisItem.case_size, thisItem.split_case_penalty_per_item_pct) + tot;
          default:
            return calcSubTotal(item.qty, price) + tot;
        }
    }, 0);
  },

  IsSplitCase: function(qty, invItem) {
    if (!invItem.use_case_pricing) {
      return false;
    }

    var over = qty % invItem.case_size;
    switch(over) {
      case 0:
        return false;
      default:
        return true;
    }
  }

};
