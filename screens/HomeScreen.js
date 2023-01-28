import { View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import CustomListItem from '../components/CustomListItem'
import { Avatar } from 'react-native-elements'
import { auth, db } from '../firebase'
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons'

const HomeScreen = ({ navigation }) => {

    const [chats, setChats] = useState([])

    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace("Login")
        })
    }

    useEffect(() => {
        const unsubscribe = db.collection('chats').onSnapshot((snapshot) =>
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
                    <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
                        <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View className="flex-row gap-3 items-center justify-between mr-1 w-[80]">
                    <TouchableOpacity activeOpacity={0.5}  >
                        <AntDesign name="camerao" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("AddChat")}>
                        <SimpleLineIcons name="pencil" size={24} color="black" />
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
        <SafeAreaView>
            <ScrollView className="h-[100%]">
                {chats.map(({ id, data: { chatName } }) => (
                    <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat} />
                ))
                }
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen