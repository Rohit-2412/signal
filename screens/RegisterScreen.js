import * as ImagePicker from 'expo-image-picker'

import { Input, Text } from 'react-native-elements'
import { KeyboardAvoidingView, Platform, Pressable, StatusBar, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'

import { Image } from 'react-native'
import { auth } from '../firebase'

const RegisterScreen = ({ navigation }) => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
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

    const register = () => {
        auth.createUserWithEmailAndPassword(email, password)
            .then(authUser => {
                authUser.user.updateProfile({
                    displayName: name,
                    photoURL: imageUrl || "https://links.papareact.com/3ke",
                })
            })
            .catch(error => alert(error.message))
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Login"
        })
    }, [])

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"}
            className="p-3 items-center justify-center flex-1 bg-white -mt-12">
            <StatusBar style='light' />

            <Text h3 className="font-bold mb-10 text-center">Create a Signal account</Text>

            <View className="w-[300]">
                <Input placeholder='Full Name' autoFocus type='text' value={name}
                    onChangeText={(text) => setName(text)} />

                <Input placeholder='Email' type='email' value={email}
                    onChangeText={(text) => setEmail(text)} />

                <Input placeholder='Password' type='password' secureTextEntry value={password}
                    onChangeText={(text) => setPassword(text)} />

                {/* if image is uploaded then display the image */}
                {imageUrl ? <Image source={{ uri: imageUrl }} className="rounded-full h-[125] w-[125] self-center mb-2" /> : null}

                <Pressable onPress={pickImageAsync} className="self-center my-2 border-[#2c6bed] border rounded-full p-[5]">
                    <Text className="text-[#2c6bed] text-center p-2 w-fit">Upload Profile Picture</Text>
                </Pressable>
            </View>

            <View className="w-[150] mt-[10]">
                <Pressable disabled={!(name.length && email.length && password.length)} className="rounded-lg p-[5] bg-[#2c6bed]" onPress={register}>
                    <Text className="text-lg text-white text-center">Register</Text>
                </Pressable>
                <View className="my-2"></View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen