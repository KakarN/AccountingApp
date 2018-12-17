import React from 'react'
import {View, StyleSheet, Text, TextInput} from 'react-native'
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import {toJS} from "mobx";
import {inject, observer} from "mobx-react";
import moment from 'moment'

@inject("ExpenditureStore", "EstimationStore")
@observer
export default class BudgetEditHeader extends React.Component {

    render() {
        const {storeType} = this.props
        let STORE, currentStore, maxAmountComponent
        switch (storeType) {
            case 'expenditure':
                STORE = this.props.ExpenditureStore
                currentStore = toJS(STORE.CurrentExpenditure)
                maxAmountComponent = <View style={styles.maximumWrapper}>
                    <Text style={styles.label}>Maximum amount</Text>
                    <TextInput
                        style={styles.maximumAmountText}
                        placeholder='0'
                        onChangeText={(maxAmount) => STORE.setMaximumAmount(maxAmount)}
                        keyboardType={'decimal-pad'}
                        value={currentStore.max_amount.toString()}
                    />
                </View>
                break
            case 'estimation':
                STORE = this.props.EstimationStore
                currentStore = toJS(STORE.CurrentEstimation)
                maxAmountComponent = null
                break
        }

        let updatedAt = currentStore.last_update
        console.log('updatedAt', updatedAt)
        if(updatedAt) {
            updatedAt = moment(currentStore.last_update).format('LLLL')
        }
        else {
            updatedAt= ''
        }

        return (
            <View style={styles.topWrapper}>
                <Text style={styles.updatedText}>{updatedAt}</Text>
                <TextInput
                    style={styles.titleText}
                    placeholder='Untitled'
                    onChangeText={(title) => STORE.setTitle(title)}
                    value={currentStore.title}
                />
                {maxAmountComponent}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    topWrapper: {
        backgroundColor: Colors.backgroundColor,
        flex: -1,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.borderColor,
        padding: Layout.window.marginVertical,

    },
    updatedText: {
        fontSize: 14,
        textAlign: 'right',
        fontStyle: 'italic',
        color: Colors.textSecondaryColor
    },
    titleText: {
        fontSize: 20,
        fontWeight: '500',
        color: Colors.textPrimaryColor,
        marginVertical: 8,
    },
    maximumWrapper: {
        flex: -1,
        flexDirection: 'row',
        // backgroundColor: 'skyblue',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
    maximumAmountText: {
        fontSize: 16,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.borderColor,
        padding: 5,
    },
})