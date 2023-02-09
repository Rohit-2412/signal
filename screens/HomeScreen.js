import { AntDesign, SimpleLineIcons } from '@expo/vector-icons'
import { Modal, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { auth, db } from '../firebase'

import AddChatScreen from './AddChatScreen'
import { Avatar } from 'react-native-elements'
import { BlurView } from 'expo-blur';
import CustomListItem from '../components/CustomListItem'
import { StatusBar } from 'expo-status-bar'

const HomeScreen = ({ navigation }) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Add a new Chat",
            headerBackTitle: "Chats"
        })
    }, [navigation])

    const [chats, setChats] = useState([])
    const [modalVisible, setModalVisible] = useState(false)

    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace("Login")
        })
    }

    useEffect(() => {
        const unsubscribe = db.collection('chats').orderBy('chatName', 'asc').onSnapshot((snapshot) =>
            setChats(snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data()
            }))
            )
        )
        return unsubscribe;
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Signal",
            headerStyle: { backgroundColor: "#fff" },
            headerTitleStyle: { color: "black" },
            headerLeft: () => (
                <View>
                    <TouchableOpacity>
                        <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View className="flex-row gap-3 items-center justify-between mr-1 w-[80]">
                    <TouchableOpacity activeOpacity={0.5}  >
                        <AntDesign name="camerao" size={24} color="black" />
                    </TouchableOpacity>

                    {/* icon for signout */}
                    <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
                        <AntDesign name="logout" size={23} color="tomato" />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [])

    const enterChat = (id, chatName) => {
        navigation.navigate("Chat", {
            id,
            chatName
        })
    }

    return (
        <SafeAreaView className="bg-white">
            <StatusBar style="dark" />
            <ScrollView className="h-[100%]">
                {chats.map(({ id, data: { chatName, photoURL } }) => (
                    <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat} photoURL={photoURL} />
                ))}

                <Modal visible={modalVisible} animationType='fade' transparent={true} >
                    <BlurView tint='dark' intensity={100} style={{ flex: 1 }} >
                        <AddChatScreen navigation={navigation} visible={setModalVisible} />
                    </BlurView>
                </Modal>
            </ScrollView>

            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="z-10 absolute bottom-8 right-7 flex-row items-center justify-center space-x-2 bg-[#2196f3] p-5 rounded-full rounded-br-3xl">
                <SimpleLineIcons name="pencil" size={20} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    )
}


export default HomeScreen