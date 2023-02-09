import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import {
    FlatList,
    Modal,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { auth, db } from "../firebase";

import AddChatScreen from "./AddChatScreen";
import { BlurView } from "expo-blur";
import CustomListItem from "../components/CustomListItem";
import { StatusBar } from "expo-status-bar";
import getRecipientEmail from "../utils/getRecipentEmail";

const HomeScreen = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const user = auth.currentUser;

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Add a new Chat",
            headerBackTitle: "Chats",
        });
    }, [navigation]);

    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace("Login");
        });
    };

    useEffect(
        () =>
            db
                .collection("chats")
                .where("users", "array-contains", user.email)
                .onSnapshot((snapshot) => {
                    setChats(
                        snapshot.docs.map((doc) => ({
                            id: doc.id,
                            users: doc.data().users,
                        }))
                    );
                }),
        []
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Chats",
            headerStyle: {
                backgroundColor: "#fff",
            },
            headerTitleStyle: {
                color: "black",
                fontSize: 20,
            },
            headerLeft: () => (
                <View>
                    <TouchableOpacity>
                        {/* display the first letter of email in a circle */}
                        <View
                            className={`flex-row items-center justify-center ml-1 mb-2 w-[40] h-[40] rounded-full bg-[#2B68E6]`}
                        >
                            <Text className="text-xl font-semibold text-white">
                                {user.email[0].toUpperCase()}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View className="flex-row gap-3 items-center justify-between mr-1 w-[80]">
                    <TouchableOpacity activeOpacity={0.5}>
                        <AntDesign name="camerao" size={24} color="black" />
                    </TouchableOpacity>

                    {/* icon for signout */}
                    <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
                        <AntDesign name="logout" size={23} color="tomato" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, []);

    const enterChat = (id, recipientEmail) => {
        navigation.navigate("Chat", {
            id,
            recipientEmail,
        });
    };

    return (
        <SafeAreaView className="bg-white">
            <StatusBar style="dark" />
            <View className="h-[100%]">
                <FlatList
                    data={chats}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <CustomListItem
                            id={item.id}
                            recipientEmail={getRecipientEmail(
                                item.users,
                                user.email
                            )}
                            enterChat={enterChat}
                        />
                    )}
                />

                <Modal
                    visible={modalVisible}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                    onDismiss={() => setModalVisible(false)}
                >
                    <BlurView tint="dark" intensity={100} style={{ flex: 1 }}>
                        <AddChatScreen
                            navigation={navigation}
                            visible={setModalVisible}
                        />
                    </BlurView>
                </Modal>

            </View>

            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="z-10 absolute bottom-8 right-7 flex-row items-center justify-center space-x-2 bg-[#2196f3] p-5 rounded-full"
            >
                <SimpleLineIcons name="pencil" size={20} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default HomeScreen;
