import React from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import {Constants} from 'expo';
import {createAppContainer, createStackNavigator} from 'react-navigation'
import MainTabNavigator from "./MainTabNavigator";
import ExpenditureEditScreen from "../screens/ExpenditureEditScreen";
import EstimationEditScreen from "../screens/EstimationEditScreen";
import Colors from "../constants/Colors";

const MainStackNavigator = createStackNavigator({
    Home: {
        screen: MainTabNavigator,
        navigationOptions: {
            header: null
        }
    },
    CurrentExpenditure: {
        screen: ExpenditureEditScreen,
        navigationOptions: {
            title: 'Edit',
            gesturesEnabled: false
        }
    },
    CurrentEstimation: {
        screen: EstimationEditScreen,
        navigationOptions: {
            title: 'Edit',
            gesturesEnabled: false
        }
    }
})

const AppContainer = createAppContainer(MainStackNavigator)

export default class App extends React.Component {
    render() {
        let statusBar = null
        if (Platform.OS === 'android') {
            statusBar = (
                <View style={[styles.statusBar, {backgroundColor: "#6966ff"}]}/>
            )
        } else {
            statusBar = (
                <View style={[styles.statusBar, {backgroundColor: Colors.primaryColor}]}/>
            )
        }
        return (
            <View style={{flex: 1}}>
                {statusBar}
                <AppContainer/>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    statusBar: {
        height: Constants.statusBarHeight,
    },

    // rest of the styles
});
