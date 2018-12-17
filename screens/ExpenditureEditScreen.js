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
            keyboardLayout: null,
            contentHeight: 0,
            extraSize: 0,
            contentSize: 0,
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
        if(!currentExpenditure.title) {
            Alert.alert(
                `Title`,
                'Please set an awesome title for this expenditure!',
                [
                    // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => console.log('Ok Pressed')},
                ],
                {cancelable: false}
            )
        }
        else {
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

        // setTimeout(() => {
        //     // this.myFlatList.current.scrollToOffset({offset: this.state.contentSize});
        //     this.myFlatList.current.scrollToEnd()
        // }, 1000)
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
        const keyboardLayout = event.endCoordinates
        this.setState({keyboardLayout}, () => {
            const {ExpenditureStore} = this.props
            const ExpenditureLayout = toJS(ExpenditureStore.ExpenditureLayout)
            const ExpenditureComponentIndex = toJS(ExpenditureStore.ExpenditureComponentIndex)
            // // console.log('ExpenditureLayout', ExpenditureLayout)
            // console.log('ExpenditureComponentIndex', ExpenditureComponentIndex)
            if (ExpenditureLayout) {
                // const position = (ExpenditureComponentIndex + 1) * ExpenditureLayout.height
                const position = (ExpenditureComponentIndex) * ExpenditureLayout.height
                // console.log('position', position)
                const totalHeight = position + ExpenditureLayout.yOffset
                // console.log('totalHeight', totalHeight)
                // console.log('keyboardLayout', this.state.keyboardLayout)
                if (totalHeight > this.state.keyboardLayout.screenY) {
                    // console.log('extraSize YES scroll')
                    this.setState({extraSize: ExpenditureLayout.height + this.state.keyboardLayout.height}, () => {
                        // requestAnimationFrame(() => {
                        //     this.myFlatList.current.scrollToOffset({
                        //         offset: position,
                        //         animated: true
                        //     });
                        // })
                    })
                    requestAnimationFrame(() => {
                        this.myFlatList.current.scrollToOffset({offset: position, animated: true});
                    })
                }
            }
        })
    }

    _onContentSizeChange = (contentWidth, contentHeight) => {
        this.setState({contentSize: contentHeight})
    }

    keyboardClosed = (event) => {
        // console.log('keyboard event', event)
        this.setState({extraSize: 0})
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