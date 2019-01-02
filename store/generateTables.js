import Database from './Database'

export const createVersionTable = () => {
    return new Promise((resolve, reject) => {
        Database.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS versions (id integer primary key, version_number integer not null);`,
                [],
                (_, ResultSet) => {
                    resolve('created Version table')
                },
                (_, err) => {
                    reject('version table creation err', err)
                }
            )
        })
    })
}

export const createEstimationTable = () => {
    return new Promise((resolve, reject) => {
        Database.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE if not exists estimations (id integer primary key, title text not null, last_update datetime default (datetime('now', 'localtime')));`,
                [],
                (_, ResultSet) => {
                    // console.log('created table eStimations successful')
                    resolve('created table eStimations successful')
                },
                (_, error) => {
                    console.log('created table eStimations error', error)
                    reject(error)
                }
            )
        })
    })
}

export const createEstimationItemTable = () => {
    return new Promise((resolve, reject) => {
        Database.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE if not exists estimation_items (id integer primary key, name text not null, quantity integer not null, price real not null, estimation_id integer not null, foreign key(estimation_id) references estimations(id));`,
                [],
                (_, ResultSet) => {
                    // console.log('created table eStimation_items successful')
                    resolve('created table eStimation_items successful')
                },
                (_, error) => {
                    console.log('created table eStimation_items error', error)
                    reject(error)
                }
            )
        })
    })
}

export const createExpenditureTable = () => {
    return new Promise((resolve, reject) => {
        Database.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE if not exists expenditures (id integer primary key, title text not null, max_amount real not null, last_update datetime default (datetime('now', 'localtime')));`,
                [],
                (_, ResultSet) => {
                    // console.log('created table expenditure successful', ResultSet)
                    resolve('created table expenditure successful')
                },
                (_, error) => {
                    console.log('created table expenditure error', error)
                    reject(error)
                }
            )
        })
    })
}

export const createExpenditureItemTable = () => {
    return new Promise((resolve, reject) => {
        Database.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE if not exists expenditure_items (id integer primary key, name text not null, quantity integer not null, price real not null, expenditure_id integer not null, foreign key(expenditure_id) references expenditures(id));`,
                [],
                (_, ResultSet) => {
                    // console.log('created table eXpenditure items successful', ResultSet)
                    resolve('created table eXpenditure items successful')
                },
                (_, error) => {
                    console.log('created table eXpenditure items error', error)
                    reject(error)
                }
            )
        })
    })
}