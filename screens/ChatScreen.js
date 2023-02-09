import { Image, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { auth, db } from '../firebase'

import { Avatar } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'
import Message from '../components/Message'
import { StatusBar } from 'expo-status-bar'
import firebase from 'firebase/compat/app'

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
                    <Text className="text-white font-bold ml-[10] text-lg">{
                        (route.params.recipientEmail).split("@")[0]
                    }</Text>
                </View>
            ),
            headerRight: () => (
                <View className="flex-row items-center justify-between space-x-3">

                    <TouchableOpacity activeOpacity={0.5}  >
                        <Ionicons name="call" size={22} color="white" />
                    </TouchableOpacity>

                </View>
            )
        })
    }, [navigation, messages])

    const sendMessage = () => {
        // check if message is empty
        if (message === "") return

        // trim message
        setMessage(message.trim())
        const msg = message.trim()

        // send message to db
        db.collection('chats').doc(route.params.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: msg,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL
        })

        setMessage('')
    }

    useLayoutEffect(() =>
        db.collection('chats').doc(route.params.id).collection('messages').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            setMessages(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        })
        , [])

    return (
        <SafeAreaView className="bg-white flex-1 px-1">
            <StatusBar style='dark' />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                        {
                            messages.length === 0 &&
                            <View className="min-h-full">
                                <View className="flex-1 items-center justify-center bg--200">
                                    <Image
                                        source={require('../assets/empty-chat.png')}
                                        style={{ width: 200, height: 200 }}
                                    />
                                    <Text className="font-medium text-3xl mb-3 mt-5">No messages yet</Text>
                                    <Text className="font-base">Looks like you haven't initiated a conversation </Text>
                                </View>
                            </View>
                        }
                        {/* chat goes here */}
                        <ScrollView className={`${messages.length > 0 ? 'h-full' : ''} bg-[#f1f1f1]`}>
                            {
                                messages.map(({ id, data }) => (
                                    <Message key={id} id={id} data={data} />
                                ))
                            }
                            {
                                messages.length !== 0 && <View className="my-7" />
                            }
                        </ScrollView>

                        <View className="bg-white flex-row items-center w-full absolute h-[50] bottom-0 px-2 mt-1">
                            <TextInput className="flex-1 mr-2 mb-2 border-transparent bg-white border p-[10] text-gray-600 rounded-3xl"
                                placeholder='Message'
                                value={message} onChangeText={(text) => setMessage(text)}
                                onSubmitEditing={sendMessage}
                            />
                            <TouchableOpacity activeOpacity={0.5} onPress={sendMessage} >
                                <Ionicons name='send' size={24} color='#2b6bed' />
                            </TouchableOpacity>
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default ChatScreen