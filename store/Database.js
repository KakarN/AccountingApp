import {SQLite} from 'expo';

// module.exports = SQLite.openDatabase({ name: 'site.db' });
module.exports = SQLite.openDatabase('AccountingApp');

// const database = SQLite.openDatabase('AccountingApp', '1.2.1', 'AccountingApp Database', 1, (db) => {
//     console.log('db', db)
//     if (db.version !== '1.2.1') {
//         console.log('update DB')
//     } else {
//         console.log('no need to update DB')
//     }
// })
// module.exports = database
//
// console.log('dbaaaaa', database)
//
// // database.changeVersion("0", "1.5", () => {
// //     console.log('callback 1')
// // }, (error) => {
// //     console.log('callback 2 error', error)
// // }, () => {
// //     console.log('callback 3 success')
// // })