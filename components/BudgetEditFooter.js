import React from 'react'
import {View, StyleSheet, Text} from 'react-native'
import {LinearGradient} from "expo";
import {RectButton, BorderlessButton} from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import {toJS} from "mobx";
import {inject, observer} from "mobx-react";
import {PrimaryColorButton} from "./ButtonList";

@inject("ExpenditureStore", "EstimationStore")
@observer
export default class BudgetEditFooter extends React.Component {

    addNewItem = () => {
        const {storeType} = this.props
        let STORE, currentStore, lastItem
        switch (storeType) {
            case 'expenditure':
                STORE = this.props.ExpenditureStore
                currentStore = toJS(STORE.CurrentExpenditure)
                lastItem = currentStore.item_list[currentStore.item_list.length - 1];
                if (!currentStore.max_amount) {
                    STORE.updateErrorText('Please enter maximum amount.')
                } else if (STORE.remainingExpenditureBalance <= 0) {
                    STORE.updateErrorText('Maximum amount used up!')
                } else if (!STORE.remainingExpenditureBalance) {
                    STORE.updateErrorText('Please enter digits only.')
                } else if (lastItem && (!lastItem.quantity || !lastItem.price || !lastItem.name)) {
                    STORE.updateErrorText('Please fill all the fields.')
                } else {
                    STORE.addNewItemToExpenditure()
                }
                break
            case 'estimation':
                STORE = this.props.EstimationStore
                currentStore = toJS(STORE.CurrentEstimation)
                lastItem = currentStore.item_list[currentStore.item_list.length - 1];
                if (lastItem && (!lastItem.quantity || !lastItem.price || !lastItem.name)) {
                    STORE.updateErrorText('Please fill all the fields.')
                } else {
                    STORE.addNewItemToEstimation()
                }
                break
        }
    }

    render() {
        const {storeType} = this.props

        let STORE, ErrorText, balanceComponent
        switch (storeType) {
            case 'expenditure':
                STORE = this.props.ExpenditureStore
                ErrorText = toJS(STORE.ErrorText)
                balanceComponent = <View style={styles.balanceWrapper}>
                    <Text style={styles.label}>Your balance</Text>
                    <Text style={styles.balanceText}>{STORE.remainingExpenditureBalance}</Text>
                </View>
                break
            case 'estimation':
                STORE = this.props.EstimationStore
                ErrorText = toJS(STORE.ErrorText)
                balanceComponent = <View style={styles.balanceWrapper}>
                    <Text style={styles.label}>Your total</Text>
                    <Text style={styles.balanceText}>{STORE.totalAmount}</Text>
                </View>
                break
        }

        let error = null
        if (ErrorText) {
            error = <Text style={styles.errorText}>{ErrorText}</Text>
        }

        return (
            <View style={styles.container}>
                {error}
                <PrimaryColorButton title='Add item' onPress={this.addNewItem}/>

                {balanceComponent}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'red'
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    balanceWrapper: {
        marginHorizontal: Layout.window.marginHorizontal,
        flexDirection: 'row',
        alignItems: 'center',
    },
    balanceText: {
        fontSize: 20,
        marginLeft: 20,
        padding: 8,
    },
    errorText: {
        color: 'tomato',
        marginHorizontal: Layout.window.margin,
        marginVertical: Layout.window.marginVertical
    },
})