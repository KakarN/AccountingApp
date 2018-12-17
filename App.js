import React from 'react';
import AppNavigator from './navigation/AppNavigator'
import {Provider} from "mobx-react";
import stores from './store/index'
import { useScreens } from 'react-native-screens';

useScreens();

export default class App extends React.Component {
    render() {
        return (
            <Provider {...stores}>
                <AppNavigator/>
            </Provider>
        );
    }
}