import Database from './Database'
import {
    createVersionTable,
    createEstimationTable,
    createEstimationItemTable,
    createExpenditureTable,
    createExpenditureItemTable
} from './generateTables'


const LATEST_SCHEMA_VERSION = 0

export const databaseRollback = () => {
    console.log('databaseRollback');
    Database.transaction(tx => {
        tx.executeSql(
            `ROLLBACK;`,
            [],
            (_, ResultSet) => {
                console.log('databaseRollback success', ResultSet)
            },
            (_, err) => {
                console.log('databaseRollback err', err)
            }
        )
    })
}

export const databaseCommit = () => {
    console.log('databaseCommit');
    Database.transaction(tx => {
        tx.executeSql(
            `COMMIT;`,
            [],
            (_, ResultSet) => {
                console.log('databaseCommit success', ResultSet)
            },
            (_, error) => {
                console.log('databaseCommit error', error)
            }
        )
    })
}

const createNewVersion = () => {
    return new Promise((resolve, reject) => {
        Database.transaction(tx => {
            tx.executeSql(
                `INSERT INTO versions (version_number) values(?);`,
                [LATEST_SCHEMA_VERSION],
                (_, ResultSet) => {
                    console.log('createNewVersion success', ResultSet)
                    resolve('new version inserted successsfully!')
                },
                (_, err) => {
                    console.log('createNewVersion err', err)
                    resolve('new version insertion failed!')
                }
            )
        })
    })
}

const deleteVersion = () => {
    Database.transaction(tx => {
        tx.executeSql(
            `DELETE FROM versions;`,
            [],
            (_, ResultSet) => {
                console.log('deleteVersion successful')
            },
            (_, err) => {
                console.log('deleteVerion err', err)
            }
        )
    })
}

const getLocalSchemaVersion = () => {
    console.log('running getLocalSchemaVersion')

    return new Promise((resolve, reject) => {
        Database.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM versions ORDER BY id ASC LIMIT 1;`,
                [],
                async (_, {
                        rows: {
                            _array
                        }
                    }) => {
                        console.log('____array____', _array)
                        if (_array.length > 0) {
                            version = _array[0]
                            resolve(version.version_number)
                            // deleteVersion()
                        } else {
                            await createNewVersion();
                            resolve(LATEST_SCHEMA_VERSION)
                        }
                    },
                    (_, err) => {
                        console.log('getLocalSchemaVersion err', err)
                        reject('reject getLocalSchemaVersion err', err)
                    }
            )
        })
    })
}

const manageMigration = () => {
    console.log('running manageMigration')
    return new Promise(async (resolve, reject) => {
        try {
            let CLIENT_LOCAL_SCHEMA_VERSION = await getLocalSchemaVersion()
            console.log('before CLIENT_LOCAL_SCHEMA_VERSION', CLIENT_LOCAL_SCHEMA_VERSION)
            console.log('LATEST_SCHEMA_VERSION', LATEST_SCHEMA_VERSION)

            while (CLIENT_LOCAL_SCHEMA_VERSION < LATEST_SCHEMA_VERSION) {
                console.log(`while ${CLIENT_LOCAL_SCHEMA_VERSION} < ${LATEST_SCHEMA_VERSION}`)
                switch (CLIENT_LOCAL_SCHEMA_VERSION) {
                    case 0:
                        console.log('Migrate from 0 to 1')
                        CLIENT_LOCAL_SCHEMA_VERSION = 1
                        break;
                    case 1:
                        console.log('Migrate from 1 to 2')
                        CLIENT_LOCAL_SCHEMA_VERSION = 2
                        break;
                    case 2:
                        console.log('Migrate from 2 to 3')
                        CLIENT_LOCAL_SCHEMA_VERSION = 3
                        break;
                    default:
                        console.log('Migrate from DEFAULT')
                        break;
                }
                CLIENT_LOCAL_SCHEMA_VERSION = await getLocalSchemaVersion();
                console.log('after CLIENT_LOCAL_SCHEMA_VERSION', CLIENT_LOCAL_SCHEMA_VERSION)
            }

            resolve('Manged!')
        } catch (err) {
            console.log('manageMigration err', err)
            reject('not managed!')
        }
    })
}

export const _cacheResourcesAsync = async () => {
    console.log('app started')
    // await new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         console.log('cached!')
    //         resolve('CACHED RESOLVED')
    //     }, 3000)
    // })

    const promiseList = [
        createVersionTable(),
        createEstimationTable(),
        createEstimationItemTable(),
        createExpenditureTable(),
        createExpenditureItemTable()
    ]

    await Promise.all(promiseList)
        .then(res => console.log('promiseList res', res))
        .catch(err => console.log('promiseList err', err))

    const isMigrationManaged = await manageMigration()
    console.log('isMigrationManaged', isMigrationManaged)
}