import { View, Text, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Avatar } from 'react-native-elements'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import firebase from 'firebase/compat/app'
import { db, auth } from '../firebase'

const ChatScreen = ({ navigation, route }) => {

    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Chat",
            headerBackTitleVisible: false,
            headerTitleAlign: "left",
            headerTitle: () => (
                <View className="flex-row items-center">
                    <Avatar source={{
                        uri: messages[0]?.data.photoURL ||
                            "https://www.pngitem.com/pimgs/m/22-223968_default-profile-picture-circle-hd-png-download.png"
                    }} rounded size={27} />
                    <Text className="text-white font-bold ml-[10] text-lg">{route.params.chatName}</Text>
                </View>
            ),
            headerRight: () => (
                <View className="flex-row items-center justify-between w-[65]">
                    <TouchableOpacity activeOpacity={0.5}  >
                        <FontAwesome name="video-camera" size={24} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.5}  >
                        <Ionicons name="call" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation, messages])

    const sendMessage = () => {
        Keyboard.dismiss()

        // send message to db
        db.collection('chats').doc(route.params.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL
        })

        setMessage("")
    }

    useLayoutEffect(() => {
        const unsubscribe = db.collection('chats').doc(route.params.id).collection('messages').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            setMessages(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        })

        return unsubscribe
    }, [])

    return (
        <SafeAreaView className="bg-white flex-1">
            <StatusBar style='light' />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "padding"}
                keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                        <ScrollView className="h-full">
                            {/* chat goes here */}
                            {messages.map(({ id, data }) => (
                                data.email === auth.currentUser.email ? (
                                    <View key={id} className="flex-row items-end justify-end w-full p-[12]">
                                        <Avatar source={{ uri: data.photoURL }}
                                            rounded size={27}
                                            position="absolute"
                                            zIndex={10} />
                                        <View className="flex-row items-center bg-[#2b68e6] rounded-2xl p-[10]">
                                            <Text className="text-white text-sm font-semibold">{data.message}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View key={id} className="flex-row items-end justify-start w-full p-[10]">
                                        <Avatar source={{ uri: data.photoURL }}
                                            rounded size={27}
                                            position="absolute"
                                            zIndex={10} />
                                        <View className="bg-[#ececec] rounded-2xl p-[10]">
                                            <Text className="mt-[0.5] text-indigo-500">~ {data.displayName}</Text>
                                            <Text className="text-gray-600 text-sm font-semibold">{data.message}</Text>
                                        </View>

                                    </View>
                                )
                            ))}
                        </ScrollView>

                        <View className="flex-row items-center w-full absolute h-[40] bottom-1 px-5 mb-2">
                            <TextInput className="flex-1 mr-2 border-transparent bg-[#ececec] border p-[10] text-gray-600 rounded-3xl"
                                placeholder='Type a Message'
                                value={message} onChangeText={(text) => setMessage(text)}
                                onSubmitEditing={sendMessage}
                            />
                            <TouchableOpacity activeOpacity={0.5} onPress={sendMessage} >
                                <Ionicons name='send' size={24} color='#2c6bed' />
                            </TouchableOpacity>
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default ChatScreen