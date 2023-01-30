import { View, Text, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard, StyleSheet, Modal } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Avatar } from 'react-native-elements'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import firebase from 'firebase/compat/app'
import { db, auth } from '../firebase'

const ChatScreen = ({ navigation, route }) => {

    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [modalVisible, setModalVisible] = useState(false)


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
                <View className="flex-row items-center justify-between space-x-3">
                    <TouchableOpacity activeOpacity={0.5}  >
                        <FontAwesome name="video-camera" size={22} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.5}  >
                        <Ionicons name="call" size={22} color="white" />
                    </TouchableOpacity>

                    {/* more options button */}
                    <View style={styles.container}>
                        <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.5}>
                            <Ionicons name="ellipsis-vertical" size={22} color="white" />
                        </TouchableOpacity>

                        <Modal animationType="slide" transparent={true} visible={modalVisible}>
                            <View style={styles.modalContainer}>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                                    <Ionicons name="close" size={24} color="grey" />
                                </TouchableOpacity>
                                <View style={styles.modalOptionContainer}>
                                    <TouchableOpacity onPress={() => console.log('Clear chat')} style={styles.modalOption}>
                                        <Text style={styles.modalOptionText}>Clear chat</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => console.log('View group info')} style={styles.modalOption}>
                                        <Text style={styles.modalOptionText}>View group info</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>

                </View>
            )
        })
    }, [navigation, messages])

    const sendMessage = () => {

        // check if message is empty
        if (message === "") return

        // remove endline at the end of message
        setMessage(message.replace(/\n+$/, ''))

        // trim message
        setMessage(message.trim())


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

    const convertTime = (time) => {
        const date = new Date(time)
        const hours = date.getHours()
        const minutes = date.getMinutes()

        // add AM or PM
        const meridian = hours >= 12 ? 'PM' : 'AM'

        // convert to 12 hour format
        const hour = hours % 12 || 12

        // add 0 if minutes is less than 10
        const minute = minutes < 10 ? `0${minutes}` : minutes

        return `${hour}:${minute} ${meridian}`
    }

    return (
        <SafeAreaView className="bg-white flex-1 px-1">
            <StatusBar style='dark' />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                        <ScrollView className="h-full">
                            {/* chat goes here */}
                            {messages.length > 0 ? (messages.map(({ id, data }) => (
                                data.email === auth.currentUser.email ? (
                                    <View key={id} className="flex-row items-end justify-end w-full p-[12]">
                                        <Avatar source={{ uri: data.photoURL }}
                                            rounded size={27}
                                            position="absolute"
                                            zIndex={10} />
                                        {/* <View className="bg-[#2b68e6] rounded-2xl p-[10]"> */}
                                        <View className="bg-blue-400 rounded-xl p-2 max-w-[325px] min-w-[80px]">
                                            <Text className="text-black text-sm font-medium">{data.message}</Text>
                                            <Text className="text-[12px] text-gray-100 text-right">
                                                {convertTime(data.timestamp?.toDate().getTime())}
                                            </Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View key={id} className="flex-row items-end justify-start w-full p-[10]">
                                        <Avatar source={{ uri: data.photoURL }}
                                            rounded size={27}
                                            position="absolute"
                                            zIndex={10} />
                                        <View className="bg-[#ececec] rounded-xl p-2 max-w-[325px] min-w-[80px]">
                                            <Text className="mt-[0px] text-indigo-500">~ {data.displayName}</Text>
                                            <Text className="text-gray-600 text-sm font-semibold">{data.message}</Text>
                                            <Text className="text-[12px] text-gray-700 text-right">
                                                {convertTime(data.timestamp?.toDate().getTime())}
                                            </Text>
                                        </View>

                                    </View>
                                )
                            ))) : (
                                <View className="flex-1 items-center justify-center">
                                    <Text className="mt-5 text-gray-500 text-lg font-semibold">No messages yet</Text>
                                </View>
                            )}
                            <View className="my-7" >
                            </View>
                        </ScrollView>

                        <View className="bg-white flex-row items-center w-full absolute h-[50] bottom-0 px-2 mt-1">
                            <TextInput className="flex-1 mr-2 mb-2 border-transparent bg-[#ececec] border p-[10] text-gray-600 rounded-3xl"
                                placeholder='Message'
                                value={message} onChangeText={(text) => setMessage(text)}
                                multiline
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

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 22,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalCloseButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    modalOptionContainer: {
        marginTop: 22,
    },
    modalOption: {
        padding: 10,
    },
    modalOptionText: {
        fontSize: 16,
    },
});

export default ChatScreen