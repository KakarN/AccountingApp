import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

export default class CalendarNoteScreen extends React.Component {
    render() {
        const vacation = {key: 'vacation', color: 'red', selectedDotColor: 'blue'};
        const massage = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
        const workout = {key: 'workout', color: 'green'};
        return (
            <View style={styles.container}>
                <Calendar
                    // // Initially visible month. Default = Date()
                    // current={'2012-03-01'}
                    // // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                    // minDate={'2012-05-10'}
                    // // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                    // maxDate={'2012-05-30'}
                    // // Handler which gets executed on day press. Default = undefined
                    onDayPress={(day) => {
                        console.log('selected day', day)
                    }}
                    // // Handler which gets executed on day long press. Default = undefined
                    onDayLongPress={(day) => {
                        console.log('selected day', day)
                    }}
                    // // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                    // monthFormat={'yyyy MM'}
                    // // Handler which gets executed when visible month changes in calendar. Default = undefined
                    // onMonthChange={(month) => {console.log('month changed', month)}}
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
                    markedDates={{
                        '2018-12-05': {dots: [vacation, massage, workout], selected: true, selectedColor: 'red'},
                        '2018-12-06': {dots: [massage, workout], disabled: true},
                    }}
                    markingType={'multi-dot'}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#678'
    }
})