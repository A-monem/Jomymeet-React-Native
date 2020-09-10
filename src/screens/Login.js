import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import { Input, Button, Icon, Tile } from 'react-native-elements';
import { firebaseLogin } from '../api/Firebase'



export default function Login({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = () => {
        setIsLoading(true)
        console.log(email)
        console.log(password)
        firebaseLogin(email, password)
            .then((user) => {
                setIsLoading(false)
                if (user.type === 'student') {
                    navigation.navigate('Dashboard', {user: user})
                } else {
                    alert("User is not a student")
                }
            })
            .catch((error) =>  {
                setIsLoading(false)
                alert(error.message)
            })
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.body}>
                    <Tile
                        imageSrc={require('../assets/school.jpg')}
                        title="Sign in"
                        titleStyle={styles.title}
                    />
                    <View style={styles.form}>
                        <Input
                            placeholder="E-mail"
                            leftIcon={<Icon type='font-awesome' name='user' size={24} color='#6ebfc2' />}
                            keyboardType={'email-address'}
                            onChangeText={value => setEmail(value)}
                        />
                        <Input
                            placeholder="Password"
                            leftIcon={<Icon type='font-awesome' name='lock' size={24} color='#6ebfc2' />}
                            secureTextEntry={true}
                            onChangeText={value => setPassword(value)}
                        />
                        <Button
                            onPress={handleLogin}
                            title="Login"
                            buttonStyle={styles.button}
                            raised
                            loading={isLoading} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
    },
    title: {
        color: '#9c27b0',
        fontSize: 30,
    },
    form: {
        width: '80%',
        marginTop: '10%'
    },
    button: {
        backgroundColor: '#9c27b0'
    },
});
