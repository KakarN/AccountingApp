import React from 'react';
import {AppLoading} from 'expo'
import AppNavigator from './navigation/AppNavigator'
import {Provider} from "mobx-react";
import stores from './store/index'
import { useScreens } from 'react-native-screens';
import {_cacheResourcesAsync} from './store/database_utils'

useScreens();

export default class App extends React.Component {
    state = {
      isReady: false,
    };

    _onFinish = () => {
        console.log('_onFinish')
        this.setState({ isReady: true })
    }

    render() {
        if (!this.state.isReady) {
            return (
                <AppLoading
                startAsync={_cacheResourcesAsync}
                onFinish={this._onFinish}
                onError={console.warn}
                />
            );
        }
        return (
            <Provider {...stores}>
                <AppNavigator/>
            </Provider>
        );
    }
}