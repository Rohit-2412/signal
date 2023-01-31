import { View, Text, TouchableOpacity, StyleSheet, Keyboard, Image } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Input } from 'react-native-elements'
import { db } from '../firebase'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { Pressable } from 'react-native'

const AddChatScreen = ({ navigation, visible }) => {
    const [input, setInput] = useState("")
    const [imageUrl, setImageUrl] = useState(null)

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Signal",
        })
    }, [navigation])

    const createChat = async () => {
        await db.collection("chats").add({
            chatName: input,
            chatImage: imageUrl
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

                {/* option to upload profile picture */}

                {
                    imageUrl &&
                    <Image
                        source={{ uri: imageUrl }}
                        style={{ width: 100, height: 100 }}
                        className="rounded-full mb-3"
                    />
                }
                {
                    !imageUrl &&
                    <Pressable onPress={pickImageAsync} className="self-center my-2 border-[#2c6bed] border rounded-full p-[5]">
                        <Text className="text-[#2c6bed] text-center p-2 w-fit text-sm">Upload Profile Picture</Text>

                    </Pressable>}

                <View className="flex-row items-center justify-around mt-4 space-x-5">
                    {
                        imageUrl && <Pressable onPress={() => {
                            setImageUrl(null)
                        }}>
                            <View className="flex-row items-center justify-center gap-x-1">
                                <Text className="text-xl text-center text-red-500">Cancel</Text>
                                <Ionicons name="close-circle" size={20} color="red" />
                            </View>
                        </Pressable>
                    }
                    {
                        imageUrl &&
                        <Pressable
                            onPress={createChat}
                            disabled={!input.length}
                        >
                            <View className="flex-row items-center justify-center gap-x-1">
                                <Text className={`text-xl text-center ${!input.length ? "text-gray-500" : "text-green-500"}`}>Confirm</Text>

                                <Ionicons name="checkmark-circle" size={24}
                                    color={input.length ? "green" : "gray"}
                                />
                            </View>
                        </Pressable>
                    }
                </View>

                {/* <View className="w-fit mt-3">
                    <TouchableOpacity
                        disabled={!input.length}
                        onPress={createChat}
                        className="bg-[#2C6BED] rounded-full p-3">
                        <Text className="text-white text-center text-lg">Create new Chat</Text>
                    </TouchableOpacity>
                </View> */}

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