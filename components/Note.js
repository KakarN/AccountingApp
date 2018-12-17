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
            {cancelable: true}
        )
    }

    render() {
        const {note} = this.props
        return (
            <RectButton
                underlayColor='red'
                style={styles.rectButton}
                onPress={this._onPress}>
                <Text style={[styles.noteInput, styles.noteText]}>{note.text}</Text>
                <Text style={[styles.noteInput, styles.notePrice]}>{note.price}</Text>
            </RectButton>
        )
    }
}

const styles = StyleSheet.create({
    rectButton: {
        backgroundColor: '#f5f5f5',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        justifyContent: 'space-between',
    },
    noteInput: {
        fontSize: 16,
        paddingHorizontal: 8,
    },
    noteText: {
        width: '71%',
    },
    notePrice: {
        width: '28%',
    },
})