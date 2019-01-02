import {observable, action, computed} from "mobx"
import Database from './Database';
import {Share} from "react-native";
import {databaseRollback, databaseCommit} from './database_utils'

class ExpenditureStore {
    @observable ExpenditureList = []

    // DATABASE MANIPULATION

    @action updateExpenditureList = () => {
        Database.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM EXPENDITURES ORDER BY last_update DESC;',
                // `INSERT INTO expenditures (title, max_amount) values ('Priority expenditures', 500), ('expenditures one', 2000);`,
                [],
                (_, {rows: {_array}}) => {
                    console.log('update expenditure list', _array)
                    this.ExpenditureList.replace(_array)
                }
            )
        })
    }

    @action getExpenditureItemList = (expenditure_id) => {
        Database.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM expenditure_items WHERE expenditure_id=?`,
                // `INSERT INTO expenditure_items (name, quantity, price, expenditure_id) values ('cement', 5, 50, 1), ('bricks', 8, 10, 1);`,
                // `delete from expenditure_items where id=5;`,
                [expenditure_id],
                (_, {rows: {_array}}) => {
                    this.CurrentExpenditure.item_list.replace(_array)
                },
                (_, error) => {
                    console.log('getExpenditureItemList error', error)
                }
            )
        })
    }

    @action deleteObject = (expenditure_id) => {
        console.log('deleteObject', expenditure_id)
        Database.transaction(tx => {
            tx.executeSql(
                `BEGIN TRANSACTION;`,
                [],
                (_, ResultSet) => {
                    console.log('delete expenditure begin success', ResultSet)
                },
                (_, error) => {
                    console.log('delete expenditure begin error', error)
                }
            )
            tx.executeSql(
                `DELETE FROM expenditures where id=?`,
                [expenditure_id],
                (_, ResultSet) => {
                    console.log('delete expenditure success', ResultSet)
                    this.updateExpenditureList()
                },
                (_, error) => {
                    console.log('delete expenditure error', error)
                }
            )
            tx.executeSql(
                `DELETE FROM expenditure_items where expenditure_id=?;`,
                [expenditure_id],
                (_, ResultSet) => {
                    console.log('delete expenditure item_list success', ResultSet)
                    databaseCommit()
                    this.updateExpenditureList()
                },
                (_, error) => {
                    databaseRollback()
                    console.log('delete expenditure item_list error', error)
                }
            )
        }, (error) => {
            console.log('error', error)
        }, () => {
            console.log('success')
        })
    }


    // EXPENDITURE MANIPULATION

    @observable CurrentExpenditure = {
        id: new Date().getTime(),
        title: '',
        max_amount: '',
        item_list: [],
        last_update: null,
    }

    @action createNewCurrentExpenditure = expenditure => {
        const newExpenditure = {
            id: new Date().getTime(),
            title: '',
            max_amount: '',
            item_list: [],
            last_update: null,
        }
        this.setCurrentExpenditure(newExpenditure)
    }

    @action setCurrentExpenditure = expenditure => {
        this.updateErrorText('')
        this.CurrentExpenditure = expenditure
    }

    @action setTitle = title => {
        this.CurrentExpenditure.title = title
    }

    @action setMaximumAmount = maxAmount => {
        this.CurrentExpenditure.max_amount = maxAmount
        this.updateErrorText('')
    }

    @computed get remainingExpenditureBalance() {
        let remainingBalance = parseFloat(this.CurrentExpenditure.max_amount)
        // console.log('store remainingBalance', remainingBalance)
        if (this.CurrentExpenditure.item_list.length > 0) {
            for (let i = 0; i < this.CurrentExpenditure.item_list.length; i++) {
                let price = this.CurrentExpenditure.item_list[i].price
                if (!price) {
                    price = 0
                }
                let quantity = this.CurrentExpenditure.item_list[i].quantity
                if (!quantity) {
                    quantity = 0
                }
                let itemTotal = parseFloat(price) * parseInt(quantity)
                // console.log('store loop itemTotal', itemTotal)
                remainingBalance = remainingBalance - itemTotal
                // console.log('store loop balance', remainingBalance)
            }
        }
        return parseFloat(
            Math.round(remainingBalance * 100) / 100
        )
    }

    @action pushCurrentExpenditureToExpenditureList = () => {
        console.log('store current expenditure', this.CurrentExpenditure.max_amount)
        if (this.CurrentExpenditure.last_update) {
            console.log('before has last_update, is', this.CurrentExpenditure.last_update)
            for (let i = 0; i < this.ExpenditureList.length; i++) {
                if (this.CurrentExpenditure.id === this.ExpenditureList[i].id) {
                    console.log('found the expenditure, updating...', this.CurrentExpenditure.max_amount)
                    let expenditure = Object.assign({}, this.CurrentExpenditure)
                    this.updateExpenditureObjectDB(expenditure)
                }
            }
        } else {
            console.log('before no last update, is', this.CurrentExpenditure.last_update)
            const newExpenditure = Object.assign({}, this.CurrentExpenditure)
            this.insertExpenditureObjectDB(newExpenditure)

        }
    }

    @action insertExpenditureObjectDB = (newExpenditure) => {
        Database.transaction(tx => {
            tx.executeSql(
                'INSERT INTO expenditures (title, max_amount) values (?, ?);',
                // `INSERT INTO expenditures (title, max_amount) values ('test1', 50000123);`,
                [newExpenditure.title, newExpenditure.max_amount],
                // [],
                (_, {insertId}) => {
                    console.log('new expenditure insert success insertId', insertId)
                    for (let i = 0; i < newExpenditure.item_list.length; i++) {
                        let expenditureItem = newExpenditure.item_list[i]
                        this.insertExpenditureItemDB(expenditureItem, insertId)
                    }
                    this.updateExpenditureList()
                },
                (_, error) => {
                    console.log('new expenditure insert error', error)
                }
            )
        })
    }

    @action insertExpenditureItemDB = (expenditureItem, expenditure_id) => {
        Database.transaction(tx => {
            tx.executeSql(
                `INSERT INTO expenditure_items (name, quantity, price, expenditure_id) values (?, ?, ?, ?);`,
                [expenditureItem.name, expenditureItem.quantity, expenditureItem.price, expenditure_id],
                (_, {insertId}) => {
                    console.log('new item insert success insertId', insertId)
                },
                (_, error) => {
                    console.log('new item insert ERROR', error)
                }
            )
        })
    }

    @action updateExpenditureObjectDB = (expenditure) => {
        Database.transaction(tx => {
            tx.executeSql(
                `UPDATE expenditures SET title='${expenditure.title}', max_amount=?, last_update=DATETIME('now','localtime') WHERE id=?;`,
                [expenditure.max_amount, expenditure.id],
                (_, ResultSet) => {
                    console.log('updateExpenditureObjectDB success', ResultSet)
                    this.updateExpenditureList()
                    for (let i = 0; i < expenditure.item_list.length; i++) {
                        let expenditureItem = expenditure.item_list[i]
                        this.checkExpenditureItemExistDB(expenditureItem, expenditure.id)
                    }
                },
                (_, error) => {
                    console.log('updateExpenditureObjectDB error', error)
                }
            )
        })
    }

    @action checkExpenditureItemExistDB = (expenditureItem, expenditure_id) => {
        console.log('checkExpenditureItemExistDB expenditureItem id=', expenditureItem.id)
        Database.transaction(tx => {
            tx.executeSql(
                'SELECT COUNT(*) FROM expenditure_items WHERE id=?',
                [expenditureItem.id],
                (_, {rows: {_array}}) => {
                    console.log(`checkExpenditureItemExistDB success ${expenditureItem.id}`, _array)
                    const count = _array[0]["COUNT(*)"]
                    console.log('count', count)
                    // if count is 0, meaning no expenditure item exists, then insert item into db
                    if (count < 1) {
                        this.insertExpenditureItemDB(expenditureItem, expenditure_id)
                    }
                    // else update item
                    else {
                        this.updateExpenditureItemDB(expenditureItem)
                    }
                },
                (_, error) => {
                    console.log('checkExpenditureItemExistDB error', error)
                }
            )
        })
    }

    @action updateExpenditureItemDB = (expenditureItem) => {
        console.log(`updateExpenditureItemDB expenditure item ${expenditureItem.id}`)
        Database.transaction(tx => {
            tx.executeSql(
                `UPDATE expenditure_items SET name='${expenditureItem.name}', quantity=?, price=? WHERE id=?`,
                [expenditureItem.quantity, expenditureItem.price, expenditureItem.id],
                (_, ResultSet) => {
                    console.log('updateExpenditureItemDB success', ResultSet)
                },
                (_, error) => {
                    console.log('updateExpenditureItemDB error', error)
                }
            )
        })
    }


    // ITEM MANIPULATION

    @action addNewItemToExpenditure = () => {
        const item = {
            id: new Date().getTime(),
            quantity: '',
            price: '',
            name: '',
        }

        this.CurrentExpenditure.item_list.push(item)
    }

    @action setQuantity = (item_id, quantity) => {
        // console.log('setQuantitititititit', item_id, quantity)
        for (let i = 0; i < this.CurrentExpenditure.item_list.length; i++) {
            if (item_id === this.CurrentExpenditure.item_list[i].id) {
                this.CurrentExpenditure.item_list[i].quantity = quantity
                this.updateErrorText('')
            }
        }
    }

    @action setPrice = (item_id, price) => {
        // console.log('setPPPRIIICCCEE', item_id, price)
        for (let i = 0; i < this.CurrentExpenditure.item_list.length; i++) {
            if (item_id === this.CurrentExpenditure.item_list[i].id) {
                this.CurrentExpenditure.item_list[i].price = price
                this.updateErrorText('')
            }
        }
    }

    @action setName = (item_id, name) => {
        // console.log('setNANANAMAME', item_id, name)
        for (let i = 0; i < this.CurrentExpenditure.item_list.length; i++) {
            if (item_id === this.CurrentExpenditure.item_list[i].id) {
                // console.log('found item')
                this.CurrentExpenditure.item_list[i].name = name
                this.updateErrorText('')
            }
        }
    }

    @action deleteItemDB = (itemId) => {
        console.log('delete expenditure Item', itemId)

        // find and remove from the item list of current expenditure
        for (let i = 0; i < this.CurrentExpenditure.item_list.length; i++) {
            if (itemId === this.CurrentExpenditure.item_list[i].id) {
                this.CurrentExpenditure.item_list.splice(i, 1);
            }
        }

        // find and delete item from the database
        Database.transaction(tx => {
            tx.executeSql(
                `DELETE FROM expenditure_items where id=?`,
                [itemId],
                (_, ResultSet) => {
                    console.log('delete expenditure item success', ResultSet)

                },
                (_, error) => {
                    console.log('delete expenditure item error', error)
                }
            )
        })
    }

    @action shareExpenditure = (expenditure_id, expenditure_title) => {
        console.log('shareExpenditure', expenditure_id, expenditure_title)
        Database.transaction(tx => {
            tx.executeSql(
                `SELECT * from expenditure_items WHERE expenditure_id=?`,
                [expenditure_id],
                (_, {rows: {_array}}) => {
                    const item_list = _array
                    console.log('shareExpenditure success: expenditure items', item_list)

                    let str_arr = []
                    str_arr.push(`${expenditure_title}\n\n`)
                    for (let i = 0; i < item_list.length; i++) {
                        const str = `${item_list[i].name} = ${item_list[i].quantity} (quantity) x ${item_list[i].price} (price) = ${item_list[i].quantity * item_list[i].price}`
                        str_arr.push(str)
                    }
                    str_arr.push(`\n\nPrepared with AccountingApp.\nDownload for free https://play.google.com/store/apps/details?id=com.techhaste.kakarnyori`)
                    const message = str_arr.join(`\n\n`)
                    const shareOptions = {
                        title: expenditure_title,
                        message: message,
                        url: 'www.techhaste.com',
                        subject: expenditure_title
                    };
                    Share.share(shareOptions)
                },
                (_, error) => {
                    console.log('shareExpenditure error', error)
                }
            )
        })
    }


    // EXPENDITURE ERROR MANIPULATION

    @observable ErrorText = ''

    @action updateErrorText = text => {
        this.ErrorText = text
    }


    // Expenditure Text Item MANIPULATION

    ExpenditureComponentIndex = 0

    @action setItemComponentIndex = id => {
        if(id) {
            for (let i = 0; i < this.CurrentExpenditure.item_list.length; i++) {
                if (id === this.CurrentExpenditure.item_list[i].id) {
                    this.ExpenditureComponentIndex = i
                }
            }
        }
        else {
            this.ExpenditureComponentIndex = 0
        }
    }
}

export default ExpenditureStore