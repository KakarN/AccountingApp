import React from 'react'
import {View, StyleSheet, Button, FlatList, Keyboard, Alert, BackHandler} from 'react-native'
import {RectButton} from 'react-native-gesture-handler'
import Layout from '../constants/Layout'
import {inject, observer} from "mobx-react";
import {toJS} from "mobx";
import BudgetItem from "../components/BudgetItem";
import BudgetEditHeader from "../components/BudgetEditHeader";
import BudgetEditFooter from "../components/BudgetEditFooter";
import {BackButton, HeaderRightButton} from "../components/ButtonList";

@inject("ExpenditureStore")
@observer
export default class ExpenditureEditScreen extends React.Component {
    constructor(props) {
        super(props)
        this.myFlatList = React.createRef()
        this.state = {
            isKeyboardOpen: false
        }
    }

    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state

        return {
            headerRight: <HeaderRightButton title='Save' onPress={() => params.pushExpenditureToExpenditureList()}/>,
            headerLeft: <BackButton onPress={() => params.handleBackPress()}/>
        }
    }


    _pushExpenditureToExpenditureList = () => {
        const {ExpenditureStore, navigation} = this.props
        let currentExpenditure = toJS(ExpenditureStore.CurrentExpenditure)
        if (!currentExpenditure.title) {
            Alert.alert(
                `Title`,
                'Please set an awesome title for this expenditure!',
                [
                    // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => console.log('Ok Pressed')},
                ],
                {cancelable: false}
            )
        } else {
            console.log('screen current expenditure', currentExpenditure)
            ExpenditureStore.pushCurrentExpenditureToExpenditureList()
            navigation.goBack()
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({pushExpenditureToExpenditureList: this._pushExpenditureToExpenditureList})
        this.props.navigation.setParams({handleBackPress: this._handleBackPress})
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardOpened);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardClosed);
        BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
    }

    _handleBackPress = () => {
        Alert.alert(
            `Go back?`,
            'Would you like to save before going back?',
            [
                {text: 'OK', onPress: () => this._pushExpenditureToExpenditureList()},
                {text: 'No', onPress: () => this.props.navigation.goBack()},
            ],
            {cancelable: false}
        )
        return true
    }

    keyboardOpened = (event) => {
        console.log('keyboardOpened estimation edit screen')
        const {ExpenditureStore} = this.props
        const ExpenditureComponentIndex = toJS(ExpenditureStore.ExpenditureComponentIndex)
        if (!this.state.isKeyboardOpen && ExpenditureComponentIndex > 0) {
            console.log('keyboard not open')
            this.setState({extraSize: event.endCoordinates.height, isKeyboardOpen: true})
            requestAnimationFrame(() => {
                this.myFlatList.current.scrollToIndex({
                    animated: true,
                    index: ExpenditureComponentIndex,
                    viewOffset: 100
                })
            })
        } else {
            console.log('keyboard already open or expenditure index is < 1')
        }
    }

    keyboardClosed = (event) => {
        this.setState({extraSize: 0, isKeyboardOpen: false})
    }

    _renderItem = ({item}) => {
        return <BudgetItem item={item} storeType={'expenditure'}/>
    }

    _renderHeaderComponent = () => {
        return <BudgetEditHeader storeType={'expenditure'}/>
    }

    _renderFooterComponent = () => {
        return <BudgetEditFooter storeType={'expenditure'}/>
    }

    render() {
        const {ExpenditureStore} = this.props
        const CurrentExpenditure = toJS(ExpenditureStore.CurrentExpenditure)

        return (
            <View style={styles.container}>
                <FlatList
                    ref={this.myFlatList}
                    // style={{backgroundColor: 'red'}}
                    contentContainerStyle={{paddingBottom: this.state.extraSize}}
                    data={CurrentExpenditure.item_list}
                    ListHeaderComponent={this._renderHeaderComponent}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => item.id.toString()}
                    ListFooterComponent={this._renderFooterComponent}
                    onContentSizeChange={this._onContentSizeChange}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: Layout.window.marginHorizontal,
    },
})