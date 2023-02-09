import * as ImagePicker from 'expo-image-picker'

import { Alert, Image, Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { db, storage } from '../firebase'
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { Input } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'

const AddChatScreen = ({ navigation, visible }) => {
    const [input, setInput] = useState("")
    const [image, setImage] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [url, setUrl] = useState('')

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Signal",
        })
    }, [navigation])

    const createChat = async () => {
        console.log('create chat')
        console.log(input, url)
        await db.collection("chats").add({
            chatName: input,
            photoURL: url
        }).then(() => {
            Keyboard.dismiss()
            visible(false)
        }).catch((error) => console.log(error))

    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1
        })

        const source = { uri: result.assets[0].uri }
        setImage(source)
    };

    const uploadImage = async () => {
        // upload the image to firebase storage
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);

        const storageRef = ref(storage, `profilePicture/${filename}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on('state_changed', (snapshot) => {
            setUploading(true)
            // console.log('snapshot progess ' + (snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        }
            , (error) => {
                setUploading(false)
                // console.log(error)
                Alert.alert('Error', error.message)
            }
            , () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setUploading(false)
                    // console.log('File available at', downloadURL);
                    // setUrl(downloadURL)
                    Alert.alert('Success', 'Image uploaded')
                    // createChat()
                    db.collection("chats").add({
                        chatName: input,
                        photoURL: downloadURL
                    }).then(() => {
                        Keyboard.dismiss()
                        visible(false)
                    }).catch((error) => console.log(error))

                });
            }
        )

    }


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

                {/* choose image */}
                {
                    image &&
                    <View className="flex flex-row items-center justify-center">
                        <Image source={{ uri: image.uri }} style={{ width: 100, height: 100 }} />
                    </View>
                }
                {
                    !image &&
                    <TouchableOpacity onPress={pickImage} className="bg-[#2C6BED] rounded-full p-3 mt-3">
                        <Text className="text-white text-center text-lg">Choose Image</Text>
                    </TouchableOpacity>
                }
                {/* {
                    image &&
                    <TouchableOpacity onPress={uploadImage} className="bg-[#2C6BED] rounded-full p-3 mt-3">
                        <Text className="text-white text-center text-lg">Upload Image</Text>
                    </TouchableOpacity>
                } */}
                <View className="w-fit mt-3">
                    <TouchableOpacity
                        disabled={!input.length && !image}
                        onPress={uploadImage}
                        className="bg-[#2C6BED] rounded-full p-3">
                        <Text className="text-white text-center text-lg">Create new Chat</Text>
                    </TouchableOpacity>
                </View>

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