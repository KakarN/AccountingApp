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

    _onFocus = () => {
        const {storeType} = this.props
        switch (storeType) {
            case 'expenditure':
                this.props.ExpenditureStore.setItemComponentIndex(null)
                break
            case 'estimation':
                this.props.EstimationStore.setItemComponentIndex(null)
                break
        }
    }

    render() {
        const {storeType} = this.props
        let STORE, currentStore, maxAmountComponent
        switch (storeType) {
            case 'expenditure':
                STORE = this.props.ExpenditureStore
                currentStore = toJS(STORE.CurrentExpenditure)
                maxAmountComponent = (
                    <View style={styles.rowData}>
                        <Text style={styles.rowLabel}>Maximum amount</Text>
                        <TextInput
                            style={styles.rowInput}
                            placeholder='0'
                            onChangeText={(maxAmount) => STORE.setMaximumAmount(maxAmount)}
                            keyboardType={'decimal-pad'}
                            value={currentStore.max_amount.toString()}
                        />
                    </View>
                )
                break
            case 'estimation':
                STORE = this.props.EstimationStore
                currentStore = toJS(STORE.CurrentEstimation)
                maxAmountComponent = null
                break
        }

        let updatedAt = currentStore.last_update
        console.log('updatedAt', updatedAt)
        if (updatedAt) {
            updatedAt = moment(currentStore.last_update).format('LLLL')
        } else {
            updatedAt = ''
        }

        return (
            <View style={styles.topWrapper}>
                <Text style={styles.updatedText}>{updatedAt}</Text>
                <View style={styles.rowData}>
                    <Text style={styles.rowLabel}>Title</Text>
                    <TextInput
                        style={styles.rowInput}
                        placeholder='Enter your title here'
                        onChangeText={(title) => STORE.setTitle(title)}
                        value={currentStore.title}
                        onFocus={this._onFocus}
                    />
                </View>
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
    rowData: {
        // backgroundColor: 'yellow',
        marginBottom: 14,
    },
    rowLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
    },
    rowInput: {
        fontSize: 20,
    }
})