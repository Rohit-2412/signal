import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Input, Image } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { auth } from "../firebase";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                navigation.replace("Home")
            }
        });

        return unsubscribe;
    }, [])

    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password)
            .catch((error) => {
                Alert.alert("Invalid Credentials", "Please check your email and password and try again", [
                    { text: "OK", onPress: () => console.log("OK Pressed") }],
                )
            })
    }


    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 container items-center justify-center">
            <StatusBar style="light" />

            <Image
                source={require('../assets/signal-logo.png')}
                style={{ width: 125, height: 125 }}
                className="rounded-2xl mb-5"
            />

            <View className="w-[300]">
                <Input
                    placeholder="Email"
                    autoFocus
                    type="email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <Input
                    placeholder="Password"
                    secureTextEntry
                    type="password"
                    value={password}
                    onSubmitEditing={signIn}
                    onChangeText={(text) => setPassword(text)}
                />
            </View>

            <View className="w-[200]">
                <View className="mt-[10]">
                    <Button title="Login" onPress={signIn}
                        disabled={!(email.length && password.length)}
                    />
                </View>
                <View className="mt-[10]">
                    <Button title="Register" type="outline" onPress={() => navigation.navigate("Register")} />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
