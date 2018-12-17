import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native'
import {RectButton, BorderlessButton, BaseButton} from 'react-native-gesture-handler'
import {withNavigation} from 'react-navigation';
import Colors from '../constants/Colors'
import Layout from '../constants/Layout'
import {inject, observer} from "mobx-react";
import {Ionicons} from '@expo/vector-icons';
import moment from "moment";

@inject("ExpenditureStore", "EstimationStore")
@observer
class BudgetCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            language: ''
        }
    }

    _gotoExpenditure = () => {
        const {storeType, navigation} = this.props
        console.log(`_goto_${storeType}`)
        let STORE, currentStore, navigateToURL
        switch (storeType) {
            case 'expenditure':
                STORE = this.props.ExpenditureStore
                const expenditure = this.props.expenditure
                currentStore = Object.assign({}, expenditure)
                currentStore['item_list'] = []
                STORE.setCurrentExpenditure(currentStore)
                navigateToURL = 'CurrentExpenditure'
                STORE.getExpenditureItemList(expenditure.id)
                break
            case 'estimation':
                STORE = this.props.EstimationStore
                const estimation = this.props.estimation
                currentStore = Object.assign({}, estimation)
                currentStore['item_list'] = []
                STORE.setCurrentEstimation(currentStore)
                navigateToURL = 'CurrentEstimation'
                STORE.getEstimationItemList(estimation.id)
                break
        }

        navigation.navigate(navigateToURL)
    }

    _deleteAlert = () => {
        Alert.alert(
            `Delete`,
            'Are you sure you want to delete?',
            [
                {text: 'OK', onPress: () => this.deleteObject()},
                {text: 'No', onPress: () => console.log('delete no')},
            ],
            {cancelable: false}
        )
    }

    deleteObject = () => {
        const {storeType} = this.props
        let STORE, currentStore
        switch (storeType) {
            case 'expenditure':
                STORE = this.props.ExpenditureStore
                currentStore = this.props.expenditure
                console.log('delete expenditure')
                break
            case 'estimation':
                STORE = this.props.EstimationStore
                currentStore = this.props.estimation
                console.log('delete estimation')
                break
        }

        STORE.deleteObject(currentStore.id)
    }

    render() {
        const {storeType} = this.props
        let currentStore
        switch (storeType) {
            case 'expenditure':
                currentStore = this.props.expenditure
                break
            case 'estimation':
                currentStore = this.props.estimation
                break
        }
        const title = currentStore.title
        const updatedAt = moment(currentStore.last_update).format('LLLL')
        return (
            <View style={styles.container}>
                <RectButton onPress={this._gotoExpenditure} style={styles.contentWrapper}>
                    <Text style={styles.titleText}>{title}</Text>
                    <Text style={styles.updatedText}>{updatedAt}</Text>
                </RectButton>
                <BorderlessButton style={styles.moreWrapper} onPress={this._deleteAlert}>
                    <Ionicons name="md-more" size={32} color={Colors.secondaryColor}/>
                </BorderlessButton>
            </View>
        )
    }
}

export default withNavigation(BudgetCard);

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    contentWrapper: {
        padding: Layout.window.marginVertical,
        marginLeft: Layout.window.margin,
        flexWrap: 'wrap',
        // backgroundColor: 'green',
        flex: 1,
        flexGrow: 1,
    },

    titleText: {
        fontSize: 20,
        color: Colors.textPrimaryColor
    },
    updatedText: {
        fontSize: 14,
        textAlign: 'right',
        fontStyle: 'italic',
        color: Colors.textSecondaryColor
    },

    moreWrapper: {
        // backgroundColor: 'blue',
        width: 50,
        height: 46,
        justifyContent: 'center',
        alignItems: 'center'
    }
})