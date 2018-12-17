import React from 'react'
import {View, StyleSheet, Text} from 'react-native'
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {inject, observer} from 'mobx-react'
import moment from 'moment'
import {toJS} from "mobx";
import Colors from "../constants/Colors";

@inject('NoteStore')
@observer
export default class NoteListHeader extends React.Component {

    render() {
        // console.log('_____ render _____')
        const {NoteStore} = this.props
        const activeMonth = toJS(NoteStore.activeMonth)
        const activeDate = toJS(NoteStore.activeDate)
        const dayMarkList = toJS(NoteStore.dayMarkList)

        let activeDateFound = false
        for (let i = 0; i < dayMarkList.length; i++) {
            let day = moment(dayMarkList[i]['date(created_at)'])
            if (day.isSame(activeDate, 'day')) {
                activeDateFound = true
                break
            }
        }
        if (activeDateFound) {
            // dayMarkList.push(activeDate)
        } else {
            const day = moment(activeDate)
            const dayString = day.format('YYYY-MM-DD');
            const data = {
                "date(created_at)": dayString
            }
            dayMarkList.push(data)
        }

        let dayListObj = {}
        for (let i = 0; i < dayMarkList.length; i++) {
            let day = dayMarkList[i]['date(created_at)']
            // if is today and active
            if (moment(day).isSame(moment(), 'day') && moment(day).isSame(activeDate, 'day')) {
                dayListObj[`${day}`] = {
                    selected: true,
                    selectedColor: Colors.secondaryColor,
                    marked: true,
                    dotColor: Colors.secondaryColor,
                }
                // console.log('today is active and active')
            }
            // if day today
            else if (moment(day).isSame(moment(), 'day')) {
                dayListObj[`${day}`] = {
                    // selected: true,
                    // selectedColor: 'green',
                    marked: true,
                    dotColor: Colors.secondaryColor,
                }
                // console.log('if date is today')
            }
            // if day is active
            else if (moment(day).isSame(activeDate, 'day')) {
                dayListObj[`${day}`] = {
                    selected: true,
                    selectedColor: Colors.secondaryColor,
                    marked: true,
                    // dotColor: 'red',
                }
                // console.log('if date is active')
            } else {
                // console.log('date is NOT today and not active')
                dayListObj[`${day}`] = {
                    marked: true,
                    dotColor: Colors.secondaryColor,
                    // activeOpacity: 0
                }
            }
        }
        // console.log('dayListObj', dayListObj)

        const markList = {
            '2018-12-12': {selected: true},
            '2018-12-13': {marked: true},
            '2018-12-14': {selectedColor: 'blue'},
            '2018-12-15': {selected: true, marked: true, selectedColor: 'blue'},
            '2018-12-16': {selected: true, marked: true, selectedColor: 'blue'},
            '2018-12-17': {marked: true},
            '2018-12-18': {marked: true, dotColor: 'red', activeOpacity: 0},
            '2018-12-19': {disabled: true, disableTouchEvent: true}
        }

        // Get all the dates which has at least one note

        const momentDate = moment(activeDate).calendar(null, {
            sameDay: function () {
                return '[Today]';
            },
            nextDay: function () {
                return '[Tomorrow]';
            },
            nextWeek: function () {
                return 'dddd';
            },
            lastDay: function () {
                return '[Yesterday]';
            },
            lastWeek: function () {
                return '[Last] dddd';
            },
            sameElse: function () {
                return 'Do MMM';
            },
        });
        return (
            <View style={styles.container}>
                <Text style={[styles.labelText, styles.monthTotalExpense]}>{moment(activeMonth).format('MMMM')}, total
                    expense = {NoteStore.sumActiveMonth}</Text>
                <Calendar


                    // // Initially visible month. Default = Date()
                    // current={'2012-03-01'}
                    // // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                    // minDate={'2012-05-10'}
                    // // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                    // maxDate={'2012-05-30'}


                    // Handler which gets executed on day press. Default = undefined
                    onDayPress={(day) => NoteStore.setActiveDate(day)}
                    // // Handler which gets executed on day long press. Default = undefined
                    // onDayLongPress={(day) => {console.log('selected day', day)}}


                    // // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                    // monthFormat={'yyyy MM'}
                    // Handler which gets executed when visible month changes in calendar. Default = undefined
                    onMonthChange={(month) => NoteStore.setActiveMonth(month)}


                    // // Hide month navigation arrows. Default = false
                    // hideArrows={true}
                    // // Replace default arrows with custom ones (direction can be 'left' or 'right')
                    // renderArrow={(direction) => (<Arrow />)}
                    // // Do not show days of other months in month page. Default = false
                    // hideExtraDays={true}
                    // // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                    // // day from another month that is visible in calendar page. Default = false
                    // disableMonthChange={true}


                    // // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                    // firstDay={1}
                    // // Hide day names. Default = false
                    // hideDayNames={true}
                    // // Show week numbers to the left. Default = false
                    // showWeekNumbers={true}


                    // // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                    // onPressArrowLeft={substractMonth => substractMonth()}
                    // // Handler which gets executed when press arrow icon left. It receive a callback can go next month
                    // onPressArrowRight={addMonth => addMonth()}


                    // markedDates={markList}
                    markedDates={dayListObj}

                    // Specify style for calendar container element. Default = {}
                    style={styles.calendarStyle}
                    // Specify theme properties to override specific styles for calendar parts. Default = {}
                    // theme={calendarThemeStyle}
                />
                <Text style={[styles.labelText, styles.activeDate]}>{momentDate}, total expense
                    = {NoteStore.sumActiveDay}</Text>
            </View>
        )
    }
}


const calendarThemeStyle = {
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleColor: 'red',
    selectedDayBackgroundColor: '#00adf5',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#00adf5',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#00adf5',
    selectedDotColor: '#ffffff',
    arrowColor: 'orange',
    monthTextColor: 'blue',
    textDayFontFamily: 'monospace',
    textMonthFontFamily: 'monospace',
    textDayHeaderFontFamily: 'monospace',
    textMonthFontWeight: 'bold',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16
}

const styles = StyleSheet.create({
    container: {
        // borderWidth: 1,
        // borderColor: 'green',
        paddingTop: 14,
    },
    labelText: {
        fontSize: 18,
        paddingHorizontal: 20,
    },
    monthTotalExpense: {
        fontWeight: '500',
        color: Colors.secondaryColor,
    },
    activeDate: {
        color: Colors.secondaryColor,
        paddingTop: 20,
        paddingBottom: 8,
        // textAlign: 'center',
    },
    calendarStyle: {
        // borderWidth: 1,
        // borderColor: 'gray',
        // height: 350
    },
})