import { View, StatusBar } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Button, Input, Text } from 'react-native-elements'
import { auth } from '../firebase'

const RegisterScreen = ({ navigation }) => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [imageUrl, setImageUrl] = useState("")

    const register = () => {
        auth.createUserWithEmailAndPassword(email, password)
            .then(authUser => {
                authUser.user.updateProfile({
                    displayName: name,
                    photoURL: imageUrl || "https://links.papareact.com/3ke"
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

        <View className="p-3 items-center justify-center flex-1" >
            <StatusBar style='light' />

            <Text h3 className="font-normal -mt-12 mb-20 text-center">Create a Signal account</Text>

            <View className="w-[300]">
                <Input placeholder='Full Name' autoFocus type='text' value={name}
                    onChangeText={(text) => setName(text)} />

                <Input placeholder='Email' type='email' value={email}
                    onChangeText={(text) => setEmail(text)} />

                <Input placeholder='Password' type='password' secureTextEntry value={password}
                    onChangeText={(text) => setPassword(text)} />

                <Input placeholder='Profile Picture URL (optional)' type='text' value={imageUrl}
                    onChangeText={(text) => setImageUrl(text)} onSubmitEditing={register} />

            </View>

            <View className="w-[150] mt-[10]">
                <Button title='Register' raised onPress={register} />
            </View>
        </View>
    )
}

export default RegisterScreen