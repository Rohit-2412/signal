import { StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../firebase'

import React from 'react';

function Message({ id, data }) {

    const isMe = data.email === auth.currentUser.email;

    return (
        <View key={id}
            className={`flex-row items-end justify-${isMe ? 'end' : 'start'} w-full p-[7px]`}
            style={
                isMe ? styles.shadowMe : styles.shadowOther
            }
        >
            <View
                className={`${isMe ? 'bg-blue-500' : 'bg-white'} rounded-2xl ${isMe ? 'rounded-tr-none' : 'rounded-tl-none'} p-2 max-w-[325px] min-w-[80px]`}>
                <Text
                    className={`${isMe ? 'text-white' : 'text-black'} text-base font-medium px-1`}>{data.message}
                </Text>
            </View>
        </ View >
    );
}
const styles = StyleSheet.create({
    shadowMe: {
        shadowColor: '#2b6bed',
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.5,
        shadowRadius: 2.5
    },
    shadowOther: {
        shadowColor: '#0009',
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22
    }
})
export default Message;