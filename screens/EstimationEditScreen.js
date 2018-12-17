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
            keyboardLayout: null,
            contentHeight: 0,
            extraSize: 0,
            contentSize: 0,
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
        const keyboardLayout = event.endCoordinates
        this.setState({keyboardLayout}, () => {
            const {EstimationStore} = this.props
            const EstimationLayout = toJS(EstimationStore.EstimationLayout)
            const EstimationComponentIndex = toJS(EstimationStore.EstimationComponentIndex)
            // // console.log('EstimationLayout', EstimationLayout)
            // console.log('EstimationComponentIndex', EstimationComponentIndex)
            if (EstimationLayout) {
                // const position = (EstimationComponentIndex + 1) * EstimationLayout.height
                const position = (EstimationComponentIndex) * EstimationLayout.height
                // console.log('position', position)
                const totalHeight = position + EstimationLayout.yOffset
                // console.log('totalHeight', totalHeight)
                // console.log('keyboardLayout', this.state.keyboardLayout)
                if (totalHeight > this.state.keyboardLayout.screenY) {
                    // console.log('extraSize YES scroll')
                    this.setState({extraSize: EstimationLayout.height + this.state.keyboardLayout.height}, () => {
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

        return (
            <View style={styles.container}>
                <FlatList
                    ref={this.myFlatList}
                    // style={{backgroundColor: 'red'}}
                    contentContainerStyle={{paddingBottom: this.state.extraSize}}
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