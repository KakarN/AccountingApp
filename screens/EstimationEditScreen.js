import React from 'react'
import {View, StyleSheet, BackHandler, FlatList, Keyboard, Alert} from 'react-native'
import {RectButton} from 'react-native-gesture-handler'
import Layout from '../constants/Layout'
import {inject, observer} from "mobx-react";
import {toJS} from "mobx";
import BudgetItem from "../components/BudgetItem";
import BudgetEditHeader from "../components/BudgetEditHeader";
import BudgetEditFooter from "../components/BudgetEditFooter";
import {BackButton, HeaderRightButton} from "../components/ButtonList";

@inject("EstimationStore")
@observer
export default class EstimationEditScreen extends React.Component {
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
            headerRight: <HeaderRightButton title='Save' onPress={() => params.pushEstimationToEstimationList()}/>,
            headerLeft: <BackButton onPress={() => params.handleBackPress()}/>
        }
    }


    _pushEstimationToEstimationList = () => {
        const {EstimationStore, navigation} = this.props
        const currentEstimation = toJS(EstimationStore.CurrentEstimation)
        if (!currentEstimation.title) {
            Alert.alert(
                `Title`,
                'Please set an awesome title for this estimation!',
                [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => console.log('Ok Pressed')},
                ],
                {cancelable: false}
            )
        } else {
            EstimationStore.pushCurrentEstimationToEstimationList()
            navigation.goBack()
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({pushEstimationToEstimationList: this._pushEstimationToEstimationList})
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
                {text: 'OK', onPress: () => this._pushEstimationToEstimationList()},
                {text: 'No', onPress: () => this.props.navigation.goBack()},
            ],
            {cancelable: false}
        )
        return true
    }

    keyboardOpened = (event) => {
        console.log('keyboardOpened estimation edit screen')
        const {EstimationStore} = this.props
        const EstimationComponentIndex = toJS(EstimationStore.EstimationComponentIndex)
        console.log('EstimationComponentIndex', EstimationComponentIndex)
        if (!this.state.isKeyboardOpen) {
            console.log('keyboard not open')
            if(EstimationComponentIndex > 0) {
                this.setState({extraSize: event.endCoordinates.height, isKeyboardOpen: true})
                requestAnimationFrame(() => {
                    this.myFlatList.current.scrollToIndex({
                        animated: true,
                        index: EstimationComponentIndex,
                        viewOffset: 100
                    })
                })
            }
            else {
                console.log('estimation index is < 1')
            }
        } else {
            console.log('keyboard already open')
        }
    }

    keyboardClosed = (event) => {
        this.setState({extraSize: 0, isKeyboardOpen: false})
    }

    _renderItem = ({item}) => {
        return <BudgetItem item={item} storeType={'estimation'}/>
    }

    _renderHeaderComponent = () => {
        return <BudgetEditHeader storeType={'estimation'}/>
    }

    _renderFooterComponent = () => {
        return <BudgetEditFooter storeType={'estimation'}/>
    }

    render() {
        const {EstimationStore} = this.props
        const CurrentEstimation = toJS(EstimationStore.CurrentEstimation)
        console.log('CurrentEstimation', CurrentEstimation)
        console.log('CurrentEstimation.item_list', CurrentEstimation.item_list)

        return (
            <View style={styles.container}>
                <FlatList
                    ref={this.myFlatList}
                    // style={{backgroundColor: 'red'}}
                    contentContainerStyle={{paddingBottom: this.state.extraSize}}
                    data={CurrentEstimation.item_list}
                    data={CurrentEstimation.item_list}
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