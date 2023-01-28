import { View, Text, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Input } from 'react-native-elements'
import { db } from '../firebase'

const AddChatScreen = ({ navigation }) => {
    const [input, setInput] = useState("")

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Add a new Chat",
            headerBackTitle: "Chats"
        })
    }, [navigation])

    const createChat = async () => {
        await db.collection("chats").add({
            chatName: input
        }).then(() => {
            navigation.goBack()
        }).catch((error) => console.log(error))
    }

    return (
        <View className="p-[30] h-[100%] items-center">
            <Input placeholder="Enter a chat name"
                value={input}
                onChangeText={(text) => setInput(text)}
                onSubmitEditing={createChat}
                leftIcon={{ type: "material", name: "chat", color: "#2C6BED", size: 25 }}
            />
            <View className="w-40">
                <TouchableOpacity
                    disabled={!input.length}
                    onPress={createChat}
                    className="bg-[#2C6BED] rounded-full p-3">
                    <Text className="text-white text-center font-bold text-base">Create new Chat</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default AddChatScreen