import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { auth, db } from '../firebase'

import { Ionicons } from '@expo/vector-icons'

const AddChatScreen = ({ navigation, visible }) => {
    const [input, setInput] = useState("")

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Signal",
        })
    }, [navigation])

    // add chat with whom we want to chat
    const createChat = async () => {
        await db.collection("chats").add({
            users: [auth.currentUser.email, input],
        }).then(() => {
            Keyboard.dismiss()
            visible(false)
        }).catch((error) => console.log(error))

    }

    return (


        <TouchableWithoutFeedback
            onPress={() => visible(false)}
            className="z-0 absolute top-0 left-0 w-[100%] h-[100%]"
        >
            <View className="flex-1 items-center justify-center">
                <View style={styles.modalView}>
                    <Text className="text-2xl font-bold mb-5">Start a new Chat</Text>
                    <TouchableOpacity
                        onPress={() => visible(false)}
                        className="absolute top-3 right-3">
                        <Ionicons name="close" size={30} color="black" />
                    </TouchableOpacity>

                    <TextInput placeholder="Email address"
                        style={{ width: 275 }}
                        className="w-full h-12 border-2 border-gray-300 rounded-xl px-3 mb-2"
                        cursorColor={"#2C6BED"}
                        value={input}
                        onChangeText={(text) => setInput(text)}
                        onSubmitEditing={createChat}
                        placeholderTextColor="gray"
                    />

                    <View className="w-fit mt-3">
                        <TouchableOpacity
                            disabled={!input.length}
                            onPress={createChat}
                            className={`${input.length ? 'bg-[#2C6BED]' : 'bg-gray-400'} rounded-full p-3`}>
                            <Text className="text-white text-center text-lg">Create new Chat</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </TouchableWithoutFeedback>
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