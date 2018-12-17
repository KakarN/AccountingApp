import React from 'react'
import {View, StyleSheet, Text, TextInput, Alert} from 'react-native'
import Colors from '../constants/Colors'
import {BorderlessButton} from 'react-native-gesture-handler'
import {inject, observer} from "mobx-react";
import {toJS} from "mobx";


@inject("ExpenditureStore", "EstimationStore")
@observer
export default class BudgetItem extends React.Component {
    constructor(props) {
        super(props);
    }

    handleLayoutChange = () => {
        this.setComponentLayout()
    }

    setComponentLayout = () => {
        const {storeType} = this.props
        let STORE
        switch (storeType) {
            case 'expenditure':
                STORE = this.props.ExpenditureStore
                this.feedPost.measure((fx, fy, width, height, px, py) => {
                    const layout = {
                        height,
                        yOffset: py
                    }
                    STORE.setInitialItemLayout(layout)
                })
                break
            case 'estimation':
                STORE = this.props.EstimationStore
                this.feedPost.measure((fx, fy, width, height, px, py) => {
                    const layout = {
                        height,
                        yOffset: py
                    }
                    STORE.setInitialItemLayout(layout)
                })
                break
        }
    }

    _onFocus = () => {
        const itemId = this.props.item.id
        console.log('_onFocus', itemId)

        const {storeType} = this.props
        let STORE
        switch (storeType) {
            case 'expenditure':
                this.props.ExpenditureStore.setItemComponentIndex(itemId)
                break
            case 'estimation':
                this.props.EstimationStore.setItemComponentIndex(itemId)
                break
        }

        this.setComponentLayout()
    }

    showAlert = () => {

        const itemId = this.props.item.id
        const {storeType} = this.props
        let STORE, currentStore
        switch (storeType) {
            case 'expenditure':
                STORE = this.props.ExpenditureStore
                currentStore = toJS(STORE.CurrentExpenditure)
                break
            case 'estimation':
                STORE = this.props.EstimationStore
                currentStore = toJS(STORE.CurrentEstimation)
                break
        }
        let item = null
        for (let i = 0; i < currentStore.item_list.length; i++) {
            if (itemId === currentStore.item_list[i].id) {
                item = currentStore.item_list[i]
            }
        }

        Alert.alert(
            `Delete`,
            `Are you sure you want to delete "${item.name}"?`,
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => STORE.deleteItemDB(item.id)},
            ],
            {cancelable: true}
        )
    }

    render() {
        const itemId = this.props.item.id

        const {storeType} = this.props
        let STORE, currentStore
        switch (storeType) {
            case 'expenditure':
                STORE = this.props.ExpenditureStore
                currentStore = toJS(STORE.CurrentExpenditure)
                break
            case 'estimation':
                STORE = this.props.EstimationStore
                currentStore = toJS(STORE.CurrentEstimation)
                break
        }
        let item = null
        for (let i = 0; i < currentStore.item_list.length; i++) {
            if (itemId === currentStore.item_list[i].id) {
                item = currentStore.item_list[i]
            }
        }

        let itemTotal = parseFloat(item.price) * parseInt(item.quantity)
        if (!itemTotal) {
            itemTotal = 'Total'
        }


        return (
            <View style={styles.container}
                  onLayout={(event) => {
                      this.handleLayoutChange(event)
                  }}
                  ref={view => {
                      this.feedPost = view;
                  }}
            >
                <TextInput placeholder='Product/Service' style={[styles.textInput, styles.productServiceInput]}
                           onChangeText={(name) => STORE.setName(itemId, name)}
                           value={item.name}
                           onFocus={this._onFocus}
                           multiline={true}
                />
                <TextInput placeholder='Qty' style={[styles.textInput, styles.quantityInput]}
                           keyboardType='number-pad'
                           onChangeText={(quantity) => STORE.setQuantity(itemId, quantity)}
                           value={item.quantity.toString()}
                           onFocus={this._onFocus}
                />
                <TextInput placeholder='Price' style={[styles.textInput, styles.priceInput]}
                           keyboardType='decimal-pad'
                           onChangeText={(price) => STORE.setPrice(itemId, price)}
                           value={item.price.toString()}
                           onFocus={this._onFocus}
                />
                <BorderlessButton style={styles.totalWrapper} onPress={this.showAlert}>
                    <Text style={styles.itemTotal}>{itemTotal}</Text>
                </BorderlessButton>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textInput: {
        fontSize: 14,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.borderColor,
        padding: 6,
        marginHorizontal: 2,
        marginVertical: 4,
        borderRadius: 5,
    },
    productServiceInput: {
        width: '21%',
    },
    quantityInput: {
        width: '25%'
    },
    priceInput: {
        width: '25%'
    },
    totalWrapper: {
        width: '26%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemTotal: {
        // width: 0,
        padding: 6,
        color: '#b4bad5'
    }
})