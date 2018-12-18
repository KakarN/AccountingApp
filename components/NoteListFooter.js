import React from 'react'
import {View, StyleSheet, TextInput, Text, Alert} from 'react-native'
import {BorderlessButton} from 'react-native-gesture-handler'
import {inject, observer} from "mobx-react";
import {PrimaryColorButton} from "./ButtonList";

@inject('NoteStore')
@observer
export default class NoteListFooter extends React.Component {
    constructor(props) {
        super(props)
        this.noteInputWrapperRef = React.createRef()
        this.noteTextRef = React.createRef()
        this.state = {
            text: '',
            price: ''
        }
    }

    setComponentLayout = () => {
        const {NoteStore} = this.props
        this.noteInputWrapperRef.current.measure((fx, fy, width, height, px, py) => {
            const layout = {
                height,
                yOffset: py
            }
            NoteStore.setInputLayout(layout)
        })
    }

    _onLayout = () => {
        this.setComponentLayout()
    }

    _onFocus = () => {
        this.setComponentLayout()
    }

    _onPress = () => {
        // if no text, display error without cancellable alerts
        if (!this.state.text) {
            Alert.alert(
                `Save note`,
                `Please enter a note title to save a note.`,
                [
                    {text: 'OK', onPress: () => console.log('pressed ok')},
                ],
                {cancelable: true}
            )
        } else {
            // if no price is displayed, display error with cancellable alerts
            this.checkPriceInput()
        }
    }

    checkPriceInput = () => {
        if (!this.state.price) {
            Alert.alert(
                `Save note`,
                `Save the note without entering price?`,
                [
                    {text: 'Yes', onPress: () => this.saveNote()},
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                {cancelable: true}
            )
        } else {
            this.saveNote()
        }
    }

    saveNote = () => {
        const {NoteStore} = this.props
        const newNote = {
            text: this.state.text,
            price: this.state.price
        }
        NoteStore.insertNoteIntoDataBase(newNote)
        this.setState({text: '', price: ''})
    }

    focusTextInput = () => {
        this.noteTextRef.current.focus()
    }

    render() {
        return (
            <View style={styles.container}>
                <BorderlessButton onPress={this.focusTextInput}>
                    <Text style={styles.inputLabel}>Add new note</Text>
                </BorderlessButton>
                <View style={styles.noteInputWrapper} ref={this.noteInputWrapperRef} onLayout={this._onLayout}>
                    <TextInput
                        ref={this.noteTextRef}
                        placeholder={'Note title'}
                        style={[styles.noteInput, styles.noteText]}
                        value={this.state.text}
                        onChangeText={text => this.setState({text})}
                        onFocus={this._onFocus}
                        multiline={true}
                    />
                    <TextInput
                        placeholder={'Price'}
                        style={[styles.noteInput, styles.notePrice]}
                        value={this.state.price.toString()}
                        onChangeText={price => this.setState({price})}
                        keyboardType={'decimal-pad'}
                    />
                </View>
                <PrimaryColorButton title={'Save note'} onPress={this._onPress}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'red'
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        paddingTop: 20,
        color: 'gray',
        paddingHorizontal: 20,
    },
    noteInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
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
    saveButtonWrapper: {
        paddingVertical: 8,
        marginBottom: 50,
    }
})