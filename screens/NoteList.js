import React from 'react'
import {View, StyleSheet, Text, Keyboard, FlatList} from 'react-native'
import {SQLite} from 'expo'
import Note from "../components/Note";
import {inject, observer} from "mobx-react";
import {toJS} from "mobx";
import NoteListHeader from "../components/NoteListHeader";
import NoteListFooter from "../components/NoteListFooter";

const db = SQLite.openDatabase('AccountingApp')

@inject('NoteStore')
@observer
export default class NoteList extends React.Component {
    constructor(props) {
        super(props)
        this.myNoteFlatList = React.createRef()
        this.state = {
            extraSize: 0,
            keyboardLayout: null,
            flatListHeight: 0,
            isKeyboardOpen: false
        }
    }

    componentDidMount() {
        this.createTable()
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardOpened);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardClosed);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    createTable = async () => {
        const {NoteStore} = this.props
        NoteStore.create_if_not_exist_table()
    }

    keyboardOpened = event => {
        if (!this.state.isKeyboardOpen) {
            this.setState({isKeyboardOpen: true, extraSize: event.endCoordinates.height})
            if(this.props.NoteStore.NoteList.length > 1) {
                requestAnimationFrame(() => {
                    this.myNoteFlatList.current.scrollToIndex({
                        animated: true,
                        index: this.props.NoteStore.NoteList.length - 1,
                        viewOffset: 100
                    })
                })
            }
        }
    }

    keyboardClosed = event => {
        this.setState({extraSize: 0, isKeyboardOpen: false})
    }

    _renderHeader = () => {
        return <NoteListHeader/>
    }

    _renderItem = ({item}) => {
        return <Note note={item}/>
    }

    _renderFooter = () => {
        return <NoteListFooter/>
    }

    _renderEmptyComponent = () => {
        return <View style={styles.emptyComponentWrapper}>
            <Text style={styles.emptyText}>You have no note for this day.</Text>
        </View>
    }

    render() {
        const {NoteStore} = this.props
        const data = toJS(NoteStore.NoteList)
        // const data = []
        return (
            <View style={styles.container}>
                <FlatList
                    ref={this.myNoteFlatList}
                    ListHeaderComponent={this._renderHeader}
                    data={data}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => item.id.toString()}
                    ItemSeparatorComponent={() => <View style={{marginTop: 2}}/>}
                    ListFooterComponent={this._renderFooter}
                    ListEmptyComponent={this._renderEmptyComponent}
                    contentContainerStyle={{paddingTop: 14, paddingBottom: this.state.extraSize}}
                    onContentSizeChange={this._onContentSizeChange}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'red'
    },
    emptyComponentWrapper: {
        paddingHorizontal: 20,
    },
    emptyText: {
        fontSize: 18,
        color: 'lightgray',
        textAlign: 'center',
        fontStyle: 'italic',
    }
})