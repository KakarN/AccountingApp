import {observable, action, computed, autorun, reaction} from 'mobx'
import {SQLite} from "expo";

const db = SQLite.openDatabase('AccountingApp')

// db.transaction(tx => {
//     tx.executeSql(
//         `drop notes`,
//         [],
//     )
// })

export default class NoteStore {
    constructor() {
        autorun(() => {
            this.NoteList
            this.updateDaySum()
            this.updateMonthSum()
        });

        const monthReaction = reaction(
            () => this.activeMonth,
            (activeMonth, reaction) => {
                this.updateMonthSum()
                // reaction.dispose();
            }
        );
    }

    @observable NoteList = []

    @observable activeMonth = new Date()
    @observable activeDate = new Date()
    @observable sumActiveMonth = 0
    @observable sumActiveDay = 0
    @observable dayMarkList = []

    @action create_if_not_exist_table = () => {
        db.transaction(tx => {
                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS notes (
                    id INTEGER PRIMARY KEY, 
                    text TEXT NOT NULL, 
                    price REAL NOT NULL, 
                    created_at DATETIME DEFAULT (datetime('now', 'localtime'))
                    )`,
                    '',
                    (_, ResultSet) => {
                        // console.log('create tx success', ResultSet)
                        this.updateNoteList()
                    },
                    (_, error) => {
                        console.log('create tx error', error)
                    }
                )
            },
            (error) => {
                // console.log('create db error', error)
            },
            (success) => {
                // console.log('create db success', success)
            })
    }

    @action updateNoteList = () => {
        const year = this.activeDate.getFullYear()

        const month = `${this.activeDate.getMonth() + 1}`.padStart(2, 0)

        const day = `${this.activeDate.getDate()}`.padStart(2, 0)

        const stringDate = [year, month, day].join("-")
        // console.log('stringDate', stringDate)
        db.transaction(tx => {
                tx.executeSql(
                    `select * from notes where date(created_at)='${stringDate}' order by id ASC;`,
                    [],
                    (_, {rows: {_array}}) => {
                        // console.log('update tx success', _array)
                        this.NoteList = _array
                        // console.log('notelist', this.NoteList)
                    },
                    (_, error) => {
                        console.log('update tx error', error)
                    }
                )
            },
            (error) => {
                // console.log('update db error', error)
            },
            (success) => {
                // console.log('update db success', success)
            })
    }

    @action insertNoteIntoDataBase = (newNote) => {
        const year = this.activeDate.getFullYear()

        const month = `${this.activeDate.getMonth() + 1}`.padStart(2, 0)

        const day = `${this.activeDate.getDate()}`.padStart(2, 0)

        const stringDate = [year, month, day].join("-")

        db.transaction(tx => {
                tx.executeSql(
                    `INSERT INTO NOTES(text, price, created_at) values(?, ?, ?);`,
                    [newNote.text, newNote.price, stringDate],
                    (_, ResultSet) => {
                        // console.log('insert tx success', ResultSet)
                        this.updateNoteList()
                    },
                    (_, error) => {
                        // console.log('insert tx error', error)
                    }
                )
            },
            (error) => {
                console.log('insert db error', error)
            },
            (success) => {
                // console.log('insert db success', success)
            })
    }

    @action setActiveDate = (date) => {
        this.activeDate = new Date(date.dateString)
        this.updateNoteList()
    }

    @action setActiveMonth = (date) => {
        this.activeMonth = new Date(date.dateString)
    }

    @action updateMonthSum = () => {
        const year = this.activeMonth.getFullYear()
        const month = `${this.activeMonth.getMonth() + 1}`.padStart(2, 0)
        const stringDate = [year, month].join("-")
        // console.log('month', stringDate)
        db.transaction(tx => {
            tx.executeSql(
                `SELECT sum(price) FROM notes WHERE strftime('%Y-%m', created_at)='${stringDate}';`,
                [],
                (_, {rows: {_array}}) => {
                    this.sumActiveMonth = _array[0]['sum(price)']
                    if (!this.sumActiveMonth) {
                        this.sumActiveMonth = 0
                    }
                },
                (_, error) => {
                    console.log('monthSum error', error)
                }
            )
        })

        db.transaction(tx => {
            tx.executeSql(
                `SELECT distinct date(created_at) FROM notes WHERE strftime('%Y-%m', created_at)='${stringDate}';`,
                [],
                (_, {rows: {_array}}) => {
                    // console.log('updateDayMarkList success', _array)
                    this.dayMarkList.replace(_array)
                },
                (_, error) => {
                    console.log('updateDayMarkList error', error)
                }
            )
        })
    }

    @action updateDaySum = () => {
        const year = this.activeDate.getFullYear()
        const month = `${this.activeDate.getMonth() + 1}`.padStart(2, 0)
        const day = `${this.activeDate.getDate()}`.padStart(2, 0)
        const stringDate = [year, month, day].join("-")
        db.transaction(tx => {
            tx.executeSql(
                `SELECT sum(price) FROM notes WHERE strftime('%Y-%m-%d', created_at)='${stringDate}';`,
                [],
                (_, {rows: {_array}}) => {
                    this.sumActiveDay = _array[0]['sum(price)']
                    if (!this.sumActiveDay) {
                        this.sumActiveDay = 0
                    }
                },
                (_, error) => {
                    console.log('daySum error', error)
                }
            )
        })
    }


    // HANDLING TEXT INPUT
    @observable inputLayout = null

    @action setInputLayout = layout => {
        this.inputLayout = Object.assign({}, layout)
    }


    // DELETE NOTE
    @action deleteNote = note_id => {
        db.transaction(tx => {
            tx.executeSql(
                // `SELECT * FROM notes WHERE id=?`,
                `DELETE FROM notes WHERE id=?`,
                [note_id],
                (_, {rows: {_array}}) => {
                    console.log('delete note success', _array[0])
                    this.updateNoteList()
                },
                (_, error) => {
                    console.log('delete note error', error)
                }
            )
        })
    }
}