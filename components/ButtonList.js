import React from 'react'
import {StyleSheet, Text, View, Platform} from 'react-native'
import {BorderlessButton} from 'react-native-gesture-handler'
import PropTypes from 'prop-types';
import Colors from "../constants/Colors";
import {LinearGradient} from "expo";
import {RectButton} from "react-native-gesture-handler";
import {Ionicons} from '@expo/vector-icons';
import Layout from "../constants/Layout";


export const HeaderRightButton = ({title, onPress}) => (
    <BorderlessButton onPress={onPress} style={{padding: 14, marginRight: 8,}}>
        <Text
            style={{textAlign: 'center', color: Colors.secondaryColor, fontSize: 16, fontWeight: 'bold'}}>{title}</Text>
    </BorderlessButton>
)

export const BackButton = ({onPress}) => {
    if (Platform.OS === 'android') {
        return (
            <BorderlessButton onPress={onPress} style={[styles.baseHeaderButtonStyles, {marginRight: 14}]}>
                <Ionicons name="md-arrow-back" size={32} color={Colors.secondaryColor}/>
            </BorderlessButton>
        )
    } else {
        return (
            <BorderlessButton onPress={onPress} style={[styles.baseHeaderButtonStyles, {marginLeft: 8}]}>
                <Ionicons name="ios-arrow-back" size={32} color={Colors.secondaryColor}/>
                <Text
                    style={{
                        textAlign: 'center',
                        color: Colors.secondaryColor,
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginLeft: 8,
                    }}>Back</Text>
            </BorderlessButton>
        )
    }
}

export const PrimaryColorButton = ({title, onPress}) => (
    <View style={{justifyContent: 'center', alignItems: 'center', width: '100%'}}>
        <LinearGradient
            colors={[
                '#383896',
                '#514eea',
            ]}
            // start={{x: 0.75, y: 0}}
            end={{x: 1, y: 0.25}}
            style={styles.linearWrapper}>
            <RectButton onPress={onPress}
                        style={styles.addButton}
            >
                <Text style={styles.addButtonText}>{title}</Text>
            </RectButton>
        </LinearGradient>
    </View>
)

HeaderRightButton.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
};

PrimaryColorButton.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
    baseHeaderButtonStyles: {
        height: 80,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 14,
    },
    linearWrapper: {
        width: '80%',
        marginVertical: Layout.window.marginVertical,
        elevation: 3,
        borderRadius: 30,
        // for ios
        shadowColor: 'gray',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5
    },
    addButton: {
        backgroundColor: `rgba(333, 333, 333, 0)`,
        borderRadius: 30
    },
    addButtonText: {
        fontSize: 18,
        paddingVertical: 14,
        color: 'white',
        textAlign: 'center'
    },
})