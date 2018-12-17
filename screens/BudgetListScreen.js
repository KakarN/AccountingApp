import React from 'react'
import {View, StyleSheet, FlatList, Text} from 'react-native'
import {toJS} from 'mobx'
import {inject, observer} from 'mobx-react'
import Colors from "../constants/Colors";
import {LinearGradient} from "expo";
import {RectButton} from 'react-native-gesture-handler'
import BudgetCard from "../components/BudgetCard";
import Layout from "../constants/Layout";
import {PrimaryColorButton} from "../components/ButtonList";

@inject("ExpenditureStore", "EstimationStore")
@observer
export default class BudgetListScreen extends React.Component {
    componentDidMount() {
        const {ExpenditureStore, EstimationStore, navigation} = this.props
        const storeType = navigation.getParam('storeType', null)
        switch (storeType) {
            case 'expenditure':
                ExpenditureStore.createTables()
                break
            case 'estimation':
                EstimationStore.createTables()
                break
        }
    }

    _renderItem = ({item}) => {
        const {navigation} = this.props
        const storeType = navigation.getParam('storeType', null)
        switch (storeType) {
            case 'expenditure':
                return <BudgetCard storeType={'expenditure'} expenditure={item}/>
            case 'estimation':
                return <BudgetCard storeType={'estimation'} estimation={item}/>
        }

    }

    _onPress = () => {
        const {navigation} = this.props
        const storeType = navigation.getParam('storeType', null)
        let STORE, navigateToURL
        switch (storeType) {
            case 'expenditure':
                STORE = this.props.ExpenditureStore
                STORE.createNewCurrentExpenditure()
                navigateToURL = 'CurrentExpenditure'
                break
            case 'estimation':
                STORE = this.props.EstimationStore
                STORE.createNewCurrentEstimation()
                navigateToURL = 'CurrentEstimation'
                break
        }
        console.log('create new', storeType)
        navigation.navigate(navigateToURL)
    }

    _renderEmptyListComponent = () => {
        return (
            <View style={styles.emptyListComponent}>
                <Text style={styles.emptyListComponentText}>Your list is empty.</Text>
            </View>
        )
    }

    _renderFooter = () => {
        return (
            <PrimaryColorButton title='Add item' onPress={this._onPress}/>
        )
    }


    render() {
        const {navigation} = this.props
        const storeType = navigation.getParam('storeType', null)
        let STORE, data, buttonTitle
        switch (storeType) {
            case 'expenditure':
                STORE = this.props.ExpenditureStore
                data = toJS(STORE.ExpenditureList)
                buttonTitle = 'Create Expenditure'

                // data = []
                break
            case 'estimation':
                STORE = this.props.EstimationStore
                data = toJS(STORE.EstimationList)
                buttonTitle = 'Create Estimation'
                break
        }

        return (
            <View style={styles.container}>
                <FlatList
                    style={styles.listContainer}
                    contentContainerStyle={{paddingBottom: 30}}
                    data={data}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => item.id.toString()}
                    ItemSeparatorComponent={() => <View style={styles.separatorStyle}/>}
                    ListEmptyComponent={this._renderEmptyListComponent}
                    ListFooterComponent={this._renderFooter}
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: Colors.backgroundColor,
    },
    listContainer: {
        // backgroundColor: 'red',
    },
    separatorStyle: {
        paddingTop: StyleSheet.hairlineWidth,
        backgroundColor: '#cccccc'
    },
    emptyListComponent: {
        padding: 30,
    },
    emptyListComponentText: {
        fontStyle: 'italic',
        fontSize: 18,
        textAlign: 'center',
        color: 'lightgray',
    }
})