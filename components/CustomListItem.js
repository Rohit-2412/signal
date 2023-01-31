import { Alert, Image, KeyboardAvoidingView, Modal, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ListItem, Avatar } from 'react-native-elements'
import { db } from '../firebase'
import { Pressable } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'

const CustomListItem = ({ id, chatName, enterChat, chatImage }) => {

    const [chatMessages, setChatMessages] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [renameModal, setRenameModal] = useState(false)
    const [newName, setNewName] = useState("")
    const [pfChange, setPfChange] = useState(false)
    const [imageUrl, setImageUrl] = useState("")

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

    useEffect(() => {
        const unsubscribe = db.collection("chats").doc(id).collection("messages").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
            setChatMessages(snapshot.docs.map((doc) => doc.data()))
        })

        return unsubscribe;
    }, [])

    // function to delete chat with given id
    const deleteChat = (id) => {
        Alert.alert(
            "Delete Chat",
            "Are you sure you want to delete this chat?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        db.collection("chats").doc(id).delete()
                    }
                }
            ],
            { cancelable: true }
        )
    }

    return (
        <ListItem id={id} bottomDivider onPress={() => enterChat(id, chatName)}
            onLongPress={() => setShowModal(true)} >
            {/* fetch the profile picture for the chat with id, if it is null then display the default pic */}

            <Avatar rounded source={{
                uri: chatImage || "https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png"
            }} size={40} />

            <ListItem.Content>
                <ListItem.Title style={{ fontWeight: "800" }}>
                    {chatName}
                </ListItem.Title>

                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                    <Text className="font-medium">{chatMessages?.[0]?.displayName}{chatMessages?.[0]?.displayName ? ": " : null}</Text>{chatMessages?.[0]?.message}
                    {chatMessages?.[0]?.displayName ? null : "Start messaging!"}
                </ListItem.Subtitle>

            </ListItem.Content>

            {/* Modal to show more options: Rename chat, delete chat */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                style={{ flex: 1 }}

            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                >
                    <View
                        style={{
                            width: "80%",
                            backgroundColor: "white",
                            borderRadius: 20,
                            paddingVertical: 35,
                        }}
                        className="flex-col min-h-[100px] space-y-4 border-separate border-2 border-gray-300 px-2"
                        onPress={() => setShowModal(!showModal)}
                    >
                        <TouchableOpacity
                            style={{
                                width: "55%",
                                borderRadius: 10,
                                justifyContent: "center"
                            }}
                            onPress={() => deleteChat(id)}
                        >
                            <Text className="text-lg">Delete Chat</Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={{
                                width: "55%",
                                borderRadius: 10,
                                justifyContent: "center"
                            }}
                            onPress={() => {
                                setRenameModal(true)
                                setShowModal(false)
                            }}
                        >
                            <Text className="text-lg">Rename Chat</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={{
                                width: "55%",
                                borderRadius: 10,
                                justifyContent: "center"
                            }}
                            onPress={() => {
                                setPfChange(true)
                                setShowModal(false)
                            }}
                        >
                            <Text className="text-lg">Change Chat Picture</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setShowModal(!showModal)}>
                            <Text className="text-lg">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            {/* modal to ask for the name of new chat */}

            <Modal
                animationType="slide"
                transparent={true}
                visible={renameModal}
                style={{ flex: 1 }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                >
                    <View
                        className={"gap-5 items-center justify-center bg-white"}
                        style={{
                            width: "80%",
                            borderRadius: 20,
                            padding: 15,
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}

                    >
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Rename Chat</Text>
                        <TextInput
                            style={{
                                height: 40,
                                width: "75%",
                                borderColor: "gray",
                                borderWidth: 1,
                                borderRadius: 20,
                                padding: 10
                            }}
                            placeholder="Enter new name"
                            onChangeText={text => setNewName(text)}
                            value={newName}
                        />
                        <Pressable
                            style={{
                                width: "75%",
                                height: 40,
                                backgroundColor: "red",
                                borderRadius: 20,
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                            onPress={() => {
                                db.collection("chats").doc(id).update({
                                    chatName: newName
                                })
                                setRenameModal(!renameModal)
                            }}
                        >
                            <Text style={{ color: "white", fontSize: 20 }}>Rename</Text>
                        </Pressable>
                        <Pressable onPress={() => setRenameModal(!renameModal)}>
                            <Text style={{ color: "red", fontSize: 20, marginBottom: 10 }}>Cancel</Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* modal to give option to choose a new profile image of group chat */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={pfChange}
                style={{ flex: 1 }}
            >

                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                >
                    <View
                        style={{
                            width: "80%",
                            backgroundColor: "white",
                            borderRadius: 20,
                            paddingVertical: 35,
                        }}
                    >


                        {imageUrl ? <Image source={{ uri: imageUrl }} className="rounded-full h-[135] w-[135] self-center mb-3" /> : null}

                        <Pressable onPress={pickImageAsync} className="self-center my-2 border-[#2c6bed] border rounded-full p-[5]">
                            <Text className="text-[#2c6bed] text-center p-2 w-fit text-lg">Upload Profile Picture</Text>
                        </Pressable>

                        <View className="flex-row items-center justify-around mt-2">
                            <Pressable onPress={() => {
                                setImageUrl(null)
                                setPfChange(!pfChange)
                            }}>
                                <View className="flex-row items-center justify-center gap-x-1">
                                    <Text className="text-lg text-center text-red-500">Cancel</Text>
                                    <Ionicons name="close-circle" size={20} color="red" />
                                </View>
                            </Pressable>

                            {
                                imageUrl &&
                                <Pressable
                                    onPress={() => {
                                        db.collection("chats").doc(id).update({
                                            chatImage: imageUrl
                                        })
                                        setPfChange(!pfChange)
                                    }}
                                >
                                    <View className="flex-row items-center justify-center gap-x-1">
                                        <Text className="text-lg text-center text-green-500">Confirm</Text>
                                        <Ionicons name="checkmark-circle" size={24} color="green" />
                                    </View>
                                </Pressable>
                            }

                        </View>
                    </View>
                </View>
            </Modal>

        </ListItem >
    )
}

export default CustomListItem