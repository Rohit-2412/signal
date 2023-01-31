import * as ImagePicker from 'expo-image-picker'

import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'

import { Input } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'
import { db } from '../firebase'

const AddChatScreen = ({ navigation, visible }) => {
    const [input, setInput] = useState("")

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Signal",
        })
    }, [navigation])

    const createChat = async () => {
        await db.collection("chats").add({
            chatName: input,
        }).then(() => {
            Keyboard.dismiss()
            visible(false)
        }).catch((error) => console.log(error))

    }

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImageUrl(result.assets[0].uri);
        } else {
            alert('You did not select any image.');
        }
    };


    return (

        <View className="flex-1 items-center justify-center">
            <View style={styles.modalView}>
                <Text className="text-2xl font-bold mb-5">Add a new Chat</Text>
                <TouchableOpacity
                    onPress={() => visible(false)}
                    className="absolute top-4 right-3">
                    <Ionicons name="close" size={30} color="black" />
                </TouchableOpacity>

                <Input placeholder="Chat name"
                    value={input}
                    onChangeText={(text) => setInput(text)}
                    onSubmitEditing={createChat}
                    containerStyle={{ width: 275 }}
                    leftIcon={{ type: "material", name: "chat", color: "#2C6BED", size: 25 }}
                />

                <View className="w-fit mt-3">
                    <TouchableOpacity
                        disabled={!input.length}
                        onPress={createChat}
                        className="bg-[#2C6BED] rounded-full p-3">
                        <Text className="text-white text-center text-lg">Create new Chat</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    }
});
export default AddChatScreen