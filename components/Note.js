import React from 'react'
import {View, StyleSheet, Text, Alert} from 'react-native'
import {RectButton} from 'react-native-gesture-handler'
import {inject, observer} from 'mobx-react'


@inject('NoteStore')
@observer
export default class Note extends React.Component {
    _onPress = () => {
        const {NoteStore, note} = this.props
        console.log('_onPress')
        Alert.alert(
            `Delete note?`,
            'Are you sure you want to delete this note?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => NoteStore.deleteNote(note.id)},
            ],
            {cancelable: false}
        )
    }

    render() {
        const {note} = this.props
        return (
            <RectButton
                underlayColor='red'
                style={styles.rectButton}
                onPress={this._onPress}>
                <View style={styles.container}>
                    <Text style={styles.noteInput}>{note.text}</Text>
                    <Text style={styles.noteInput}>{note.price}</Text>
                </View>
            </RectButton>
        )
    }
}

const styles = StyleSheet.create({
    rectButton: {
        backgroundColor: '#f9f9f9',
    },
    container: {
        // backgroundColor: '#f9f6ff',
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 8,
        justifyContent: 'space-between',
    },
    noteInput: {
        fontSize: 16,
        padding: 8,
    }
})