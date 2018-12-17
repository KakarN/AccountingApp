import React from 'react'
import {View, StyleSheet, TextInput, Button, Text} from 'react-native'
import {inject, observer} from "mobx-react";
import {PrimaryColorButton} from "./ButtonList";

@inject('NoteStore')
@observer
export default class NoteListFooter extends React.Component {
    constructor(props) {
        super(props)
        this.noteInputRef = React.createRef()
        this.state = {
            text: '',
            price: ''
        }
    }

    setComponentLayout = () => {
        const {NoteStore} = this.props
        this.noteInputRef.current.measure((fx, fy, width, height, px, py) => {
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
        if (this.state.text) {
            const {NoteStore} = this.props
            const newNote = {
                text: this.state.text,
                price: this.state.price
            }
            NoteStore.insertNoteIntoDataBase(newNote)
            this.setState({text: '', price: ''})
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.inputLabel}>Add new note</Text>
                <View style={styles.noteInputWrapper} ref={this.noteInputRef} onLayout={this._onLayout}>
                    <TextInput
                        placeholder={'Note'}
                        style={[styles.inputText, styles.noteText]}
                        value={this.state.text}
                        onChangeText={text => this.setState({text})}
                        onFocus={this._onFocus}
                    />
                    <TextInput
                        placeholder={'Price'}
                        style={[styles.inputText, styles.notePrice]}
                        value={this.state.price.toString()}
                        onChangeText={price => this.setState({price})}
                    />
                </View>
                <PrimaryColorButton title={'Save note'} onPress={this._onPress}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // paddingVertical: 50,
        // paddingHorizontal: 20,
        // borderWidth: 1,
        // borderColor: 'red',
    },
    noteInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        paddingTop: 20,
        color: 'gray',
        paddingHorizontal: 20,
    },
    inputText: {
        // padding: 8,
        fontSize: 16,
        flexGrow: 1,
    },
    noteText: {},
    notePrice: {
        textAlign: 'right',
    },
    saveButtonWrapper: {
        paddingVertical: 8,
        marginBottom: 50,
    }
})