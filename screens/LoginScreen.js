import { View } from "react-native";
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
            .catch((error) => alert(error))
    }


    return (
        <View className=" flex-1 container items-center justify-center p-10">
            <StatusBar style="light" />

            <Image
                source={{
                    uri: "https://upload.wikimedia.org/wikipedia/commons/5/56/Logo_Signal..png ",
                }}
                style={{ width: 200, height: 200 }}
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
                    <Button title="Login" onPress={signIn} />
                </View>
                <View className="mt-[10]">
                    <Button title="Register" type="outline" onPress={() => navigation.navigate("Register")} />
                </View>
                <View className="h-[50]" />
            </View>
        </View>
    );
};

export default LoginScreen;
