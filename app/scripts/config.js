// For local development
// var Config = {
//   'baseURL': 'http://127.0.0.1:8080',
//   'homeURL': 'http://127.0.0.1:8081',
//   'logLevel': 'debug',
//   'inventory_required': ['supplier_id', 'name', 'nonmem_price', 'mem_price', 'types']
//}

// For c9 development
var Config = {
    'baseURL': 'http://gserver-btburke75.c9.io',
    'homeURL': 'http://gaea-btburke75.c9.io',
    'logLevel': 'debug',
    'inventory_required': ['supplier_id', 'name', 'nonmem_price', 'mem_price', 'types']
}

module.exports = Config;
