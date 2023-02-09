import { Avatar, ListItem } from "react-native-elements";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { db } from "../firebase";

const CustomListItem = ({ id, recipientEmail, enterChat, photoURL }) => {
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        const unsubscribe = db
            .collection("chats")
            .doc(id)
            .collection("messages")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
                setChatMessages(snapshot.docs.map((doc) => doc.data()));
            });

        return unsubscribe;
    }, []);

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <ListItem
            id={id}
            bottomDivider
            onPress={() => enterChat(id, recipientEmail)}
        >
            <View className="items-center justify-center bg-gray-300 rounded-full h-12 w-12">
                <Text className="font-bold text-xl">
                    {capitalizeFirstLetter(recipientEmail.split("@")[0])[0]}
                </Text>
            </View>
            <ListItem.Content>
                <ListItem.Title style={{ fontWeight: "800" }}>
                    {capitalizeFirstLetter(recipientEmail.split("@")[0])}
                </ListItem.Title>

                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                    {chatMessages?.[0]?.displayName
                        ? `${chatMessages?.[0]?.displayName}: ${chatMessages?.[0]?.message}`
                        : "Start Messaging!"}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    );
};

export default CustomListItem;
