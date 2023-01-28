import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import AddChatScreen from './screens/AddChatScreen';
import ChatScreen from './screens/ChatScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreenAndroid from './screens/RegisterScreenAndroid';
import RegisterScreenIos from './screens/RegisterScreenIos';

const Stack = createNativeStackNavigator();

const globalScreenOptions = {
    headerStyle: { backgroundColor: "#2C6BED" },
    headerTitleStyle: { color: "white" },
    headerTitleAlign: "center",
    headerTintColor: "white",
};

export default function App() {
    return (
        <NavigationContainer >
            <Stack.Navigator
                // initialRouteName='Home'
                screenOptions={globalScreenOptions}>
                <Stack.Screen name="Login" component={LoginScreen} />
                {
                    Platform.OS === "android" ?
                        <Stack.Screen name="Register" component={RegisterScreenAndroid} /> :
                        <Stack.Screen name="Register" component={RegisterScreenIos} />
                }
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="AddChat" component={AddChatScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
