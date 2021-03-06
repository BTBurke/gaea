// For local development
// var Config = {
//   'baseURL': 'http://127.0.0.1:8080',
//   'homeURL': 'http://127.0.0.1:8081',
//   'logLevel': 'debug',
//   'inventory_required': ['supplier_id', 'name', 'nonmem_price', 'mem_price', 'types']
// };

// For c9 development
// var Config = {
//     'baseURL': 'https://gserver-btburke75.c9users.io',
//     'homeURL': 'https://gaea-btburke75.c9users.io',
//     'logLevel': 'debug',
//     'imgURL': 'https://images.guangzhouaea.org',
//     'inventory_required': ['supplier_id', 'name', 'nonmem_price', 'mem_price', 'types']
// }

// var Config = {
// 	'baseURL': 'http://gserver-btburke75.c9.io',
// 	'homeURL': 'http://dev.guangzhouaea.org:8080',
// 	'logLevel': 'debug',
// 	'inventory_required': ['supplier_id', 'name', 'nonmem_price', 'mem_price', 'types']
// }

// for production
var Config = {
  'baseURL': 'https://guangzhouaea.org/api',
  'homeURL': 'https://guangzhouaea.org',
  'imgURL': 'https://guangzhouaea.org/images',
  'logLevel': 'debug',
  'inventory_required': ['supplier_id', 'name', 'nonmem_price', 'mem_price', 'types']
};

module.exports = Config;
