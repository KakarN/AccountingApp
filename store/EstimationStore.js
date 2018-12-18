import {Share} from 'react-native'
import {observable, action, computed} from 'mobx'
import Database from './Database'


class EstimationStore {
    @observable EstimationList = []

    // DATABASE MANIPULATION
    @action createTables = () => {
        this.createEstimationTable()
        this.createEstimationItemTable()
    }

    @action createEstimationTable = () => {
        Database.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE if not exists estimations (id integer primary key, title text not null, last_update datetime default (datetime('now', 'localtime')));`,
                [],
                (_, ResultSet) => {
                    // console.log('created table eStimations successful')
                    this.updateEstimationList()
                },
                (_, error) => {
                    console.log('created table eStimations error', error)
                }
            )
        })
    }

    @action createEstimationItemTable = () => {
        Database.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE if not exists estimation_items (id integer primary key, name text not null, quantity integer not null, price real not null, estimation_id integer not null, foreign key(estimation_id) references estimations(id));`,
                [],
                (_, ResultSet) => {
                    // console.log('created table eStimation_items successful')
                    // this.testDB()
                },
                (_, error) => {
                    console.log('created table eStimation_items error', error)
                }
            )
        })
    }

    @action updateEstimationList = () => {
        Database.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM estimations ORDER BY last_update DESC;',
                [],
                (_, {rows: {_array}}) => {
                    // console.log('updateEstimationList success', _array)
                    this.EstimationList.replace(_array)
                },
                (_, error) => {
                    console.log('updateEstimationList error', error)
                }
            )
        })
    }

    @action testDB = () => {
        Database.transaction(tx => {
            tx.executeSql(
                // `INSERT INTO estimations (title) values('Picnic estimation');`,
                `INSERT INTO estimation_items (name, quantity, price, estimation_id) values ('chicken', 4, 200, 1), ('pork', 2, 300, 1);`,
                [],
                (_, ResultSet) => {
                    console.log('testDB success ResultSet', ResultSet)
                },
                (_, error) => {
                    console.log('testDB error', error)
                }
            )
        })
    }

    @action getEstimationItemList = (estimation_id) => {
        Database.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM estimation_items WHERE estimation_id=?`,
                // `INSERT INTO estimation_item (name, quantity, price, estimation_id) values ('cement', 5, 50, 1), ('bricks', 8, 10, 1);`,
                // `delete from estimation_item where id=5;`,
                [estimation_id],
                (_, {rows: {_array}}) => {
                    this.CurrentEstimation.item_list.replace(_array)
                },
                (_, error) => {
                    console.log('getExpenditureItemList error', error)
                }
            )
        })
    }

    @action deleteObject = (estimation_id) => {
        console.log('deleteObject', estimation_id)
        Database.transaction(tx => {
            tx.executeSql(
                `DELETE FROM estimations where id=?`,
                [estimation_id],
                (_, ResultSet) => {
                    console.log('delete estimation success', ResultSet)
                    this.updateEstimationList()
                },
                (_, error) => {
                    console.log('delete estimation error', error)
                }
            )
        }, (error) => {
            console.log('error', error)
        }, () => {
            console.log('success')
        })
    }

    // ESTIMATION MANIPULATION

    @observable CurrentEstimation = {
        id: new Date().getTime(),
        title: '',
        item_list: [],
        last_update: null,
    }

    @action createNewCurrentEstimation = estimation => {
        const newEstimation = {
            id: new Date().getTime(),
            title: '',
            item_list: [],
            last_update: null,
        }
        this.setCurrentEstimation(newEstimation)
    }

    @action setCurrentEstimation = estimation => {
        this.updateErrorText('')
        this.CurrentEstimation = estimation
    }

    @action setTitle = title => {
        this.CurrentEstimation.title = title
    }

    @computed get totalAmount() {
        let total = 0
        if (this.CurrentEstimation.item_list.length > 0) {
            for (let i = 0; i < this.CurrentEstimation.item_list.length; i++) {
                let price = this.CurrentEstimation.item_list[i].price
                if (!price) {
                    price = 0
                }
                let quantity = this.CurrentEstimation.item_list[i].quantity
                if (!quantity) {
                    quantity = 0
                }
                total = total + (price * quantity)
            }
        }
        return total
    }

    @action pushCurrentEstimationToEstimationList = () => {
        if (this.CurrentEstimation.last_update) {
            console.log('before has last_update, is', this.CurrentEstimation.last_update)
            for (let i = 0; i < this.EstimationList.length; i++) {
                if (this.CurrentEstimation.id === this.EstimationList[i].id) {
                    console.log('found the estimation, updating...')
                    let estimation = Object.assign({}, this.CurrentEstimation)
                    this.updateEstimationObjectDB(estimation)
                }
            }
        } else {
            console.log('before no last update, is', this.CurrentEstimation.last_update)
            let newEstimation = Object.assign({}, this.CurrentEstimation)
            this.insertEstimationObjectDB(newEstimation)
        }
    }

    @action insertEstimationObjectDB = (newEstimation) => {
        Database.transaction(tx => {
            tx.executeSql(
                `INSERT INTO estimations (title) values (?)`,
                [newEstimation.title],
                (_, {insertId}) => {
                    console.log('new estimation insert success insertId', insertId)
                    for (let i = 0; i < newEstimation.item_list.length; i++) {
                        let estimationItem = newEstimation.item_list[i]
                        this.insertEstimationItemDB(estimationItem, insertId)
                    }
                    this.updateEstimationList()
                },
                (_, error) => {
                    console.log('new estimation insert error', error)
                }
            )
        })
    }

    @action insertEstimationItemDB = (estimationItem, estimation_id) => {
        Database.transaction(tx => {
            tx.executeSql(
                `INSERT INTO estimation_items (name, quantity, price, estimation_id) values (?, ?, ?, ?);`,
                [estimationItem.name, estimationItem.quantity, estimationItem.price, estimation_id],
                (_, {insertId}) => {
                    console.log('new item insert success insertId', insertId)
                },
                (_, error) => {
                    console.log('new item insert ERROR', error)
                }
            )
        })
    }

    @action updateEstimationObjectDB = (estimation) => {
        Database.transaction(tx => {
            tx.executeSql(
                `UPDATE estimations SET title='${estimation.title}', last_update=DATETIME('now','localtime') WHERE id=?;`,
                [estimation.id],
                (_, ResultSet) => {
                    console.log('updateEstimationObjectDB success', ResultSet)
                    this.updateEstimationList()
                    for (let i = 0; i < estimation.item_list.length; i++) {
                        let estimationItem = estimation.item_list[i]
                        this.checkEstimationItemExistDB(estimationItem, estimation.id)
                    }
                },
                (_, error) => {
                    console.log('updateEstimationObjectDB error', error)
                }
            )
        })
    }

    @action checkEstimationItemExistDB = (estimationItem, estimation_id) => {
        console.log('checkExpenditureItemExistDB estimationItem id=', estimationItem.id)
        Database.transaction(tx => {
            tx.executeSql(
                'SELECT COUNT(*) FROM estimation_items WHERE id=?',
                [estimationItem.id],
                (_, {rows: {_array}}) => {
                    console.log(`checkEstimationItemExistDB success ${estimationItem.id}`, _array)
                    const count = _array[0]["COUNT(*)"]
                    console.log('count', count)
                    // if count is 0, meaning no estimation item exists, then insert item into db
                    if (count < 1) {
                        this.insertEstimationItemDB(estimationItem, estimation_id)
                    }
                    // else update item
                    else {
                        this.updateEstimationItemDB(estimationItem)
                    }
                },
                (_, error) => {
                    console.log('checkEstimationItemExistDB error', error)
                }
            )
        })
    }

    @action updateEstimationItemDB = (estimationItem) => {
        console.log(`updateEstimationItemDB estimation item ${estimationItem.id}`)
        Database.transaction(tx => {
            tx.executeSql(
                `UPDATE estimation_items SET name='${estimationItem.name}', quantity=?, price=? WHERE id=?`,
                [estimationItem.quantity, estimationItem.price, estimationItem.id],
                (_, ResultSet) => {
                    console.log('updateEstimationItemDB success', ResultSet)
                },
                (_, error) => {
                    console.log('updateEstimationItemDB error', error)
                }
            )
        })
    }


    // ITEM MANIPULATION

    @action addNewItemToEstimation = () => {
        const item = {
            id: new Date().getTime(),
            quantity: '',
            price: '',
            name: '',
        }

        this.CurrentEstimation.item_list.push(item)
    }

    @action setQuantity = (item_id, quantity) => {
        // console.log('setQuantitititititit', item_id, quantity)
        for (let i = 0; i < this.CurrentEstimation.item_list.length; i++) {
            if (item_id === this.CurrentEstimation.item_list[i].id) {
                this.CurrentEstimation.item_list[i].quantity = quantity
                this.updateErrorText('')
            }
        }
    }

    @action setPrice = (item_id, price) => {
        // console.log('setPPPRIIICCCEE', item_id, price)
        for (let i = 0; i < this.CurrentEstimation.item_list.length; i++) {
            if (item_id === this.CurrentEstimation.item_list[i].id) {
                this.CurrentEstimation.item_list[i].price = price
                this.updateErrorText('')
            }
        }
    }

    @action setName = (item_id, name) => {
        // console.log('setNANANAMAME', item_id, name)
        for (let i = 0; i < this.CurrentEstimation.item_list.length; i++) {
            if (item_id === this.CurrentEstimation.item_list[i].id) {
                // console.log('found item')
                this.CurrentEstimation.item_list[i].name = name
                this.updateErrorText('')
            }
        }
    }

    @action deleteItemDB = (itemId) => {
        console.log('delete estimation Item', itemId)

        // find and remove from the item list of current estimation
        for (let i = 0; i < this.CurrentEstimation.item_list.length; i++) {
            if (itemId === this.CurrentEstimation.item_list[i].id) {
                this.CurrentEstimation.item_list.splice(i, 1);
            }
        }

        // find and delete item from the database
        Database.transaction(tx => {
            tx.executeSql(
                `DELETE FROM estimation_items where id=?`,
                [itemId],
                (_, ResultSet) => {
                    console.log('delete estimation item success', ResultSet)

                },
                (_, error) => {
                    console.log('delete estimation item error', error)
                }
            )
        })
    }

    @action shareEstimation = (estimation_id, estimation_title) => {
        console.log('shareEstimation', estimation_id, estimation_title)
        Database.transaction(tx => {
            tx.executeSql(
                `SELECT * from estimation_items WHERE estimation_id=?`,
                [estimation_id],
                (_, {rows: {_array}}) => {
                    const item_list = _array
                    console.log('shareEstimation success: estimation items', item_list)

                    let str_arr = []
                    str_arr.push(`${estimation_title}\n\n`)
                    for (let i = 0; i < item_list.length; i++) {
                        const str = `${item_list[i].name} = ${item_list[i].quantity} (quantity) x ${item_list[i].price} (price) = ${item_list[i].quantity * item_list[i].price}`
                        str_arr.push(str)
                    }
                    str_arr.push(`\n\nPrepared with AccountingApp.\nDownload for free https://play.google.com/store/apps/details?id=com.techhaste.kakarnyori`)
                    const message = str_arr.join(`\n\n`)
                    const shareOptions = {
                        title: estimation_title,
                        message: message,
                        url: 'www.techhaste.com',
                        subject: estimation_title
                    };
                    Share.share(shareOptions)
                },
                (_, error) => {
                    console.log('shareEstimation error', error)
                }
            )
        })
    }


    // EXPENDITURE ERROR MANIPULATION

    @observable ErrorText = ''

    @action updateErrorText = text => {
        this.ErrorText = text
    }


    // Estimation Text Item MANIPULATION

    EstimationComponentIndex = 0

    @action setItemComponentIndex = id => {
        for (let i = 0; i < this.CurrentEstimation.item_list.length; i++) {
            if (id === this.CurrentEstimation.item_list[i].id) {
                this.EstimationComponentIndex = i
            }
        }
    }
}

export default EstimationStore