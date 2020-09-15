import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions, Image } from 'react-native';
import { Avatar, Text, Button, Tile } from 'react-native-elements';
import { firebaseGetTimetable, firebasePutUserAvatarUri } from '../api/Firebase'
import ImagePicker from 'react-native-image-picker';
import Carousel from 'react-native-snap-carousel';

export default function Login({ navigation, route }) {
    const grade = useRef(route.params.user.grade)
    const classroom = useRef(route.params.user.classroom)
    const firstName = useRef(route.params.user.firstName)
    const date = useRef(new Date())
    const [avatarUri, setAvatarUri] = useState(route.params.user.avatar)
    const [carouselItems, setCarouselItems] = useState()
    const [currentTime, setCurrentTime] = useState({})
    const sliderWidth = Dimensions.get('window').width;
    const itemWidth = Math.round(sliderWidth * 0.8);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const classesTime = [{start: {hour: 8, minute: 30}, finish: {hour: 9, minute: 15}},
                        {start: {hour: 9, minute: 30}, finish: {hour: 10, minute: 15}}, 
                        {start: {hour: 10, minute: 30}, finish: {hour: 11, minute: 15}}, 
                        {start: {hour: 11, minute: 30}, finish: {hour: 12, minute: 15}}, 
                        {start: {hour: 12, minute: 30}, finish: {hour: 13, minute: 15}}]
    const time = {}
    const day = days[date.current.getDay()]
    useEffect(() => {
        firebaseGetTimetable(grade.current, classroom.current)
            .then((timetableSnapshot) => {
                time['hour'] = date.current.getHours()
                time['minute'] = date.current.getMinutes()
                setCurrentTime(time)
                if (timetableSnapshot[day]) {
                    createCarouselItems(timetableSnapshot[day])
                } else {
                    setTimetable('No school today. Have a great weekend')
                }
                getCurrentTime()
            })
            .catch((error) => alert(error))
    }, [])

    const getCurrentTime = () => {
        setInterval(() => {
            date.current = new Date()
            time['hour'] = date.current.getHours()
            time['minute'] = date.current.getMinutes()
            setCurrentTime(time)
        }, 60000)
    }

    const handleAvatarEdit = () => {
        const options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            maxWidth: 400, 
            maxHeight: 400
        };

        ImagePicker.showImagePicker(options, (response) => {
            //console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const source = { uri: 'data:image/jpeg;base64,' + response.data };
                firebasePutUserAvatarUri(route.params.user, source.uri)
                setAvatarUri(source.uri)
            }
        });
    }

    const createCarouselItems = (classes) => {
        const y = classes.map((subject, i) => {
            const carouselItem = {}
            carouselItem['subject'] = subject
            carouselItem['startHour'] = classesTime[i].start.hour
            carouselItem['startMinute'] = classesTime[i].start.minute
            carouselItem['finishHour'] = classesTime[i].finish.hour
            carouselItem['finishMinute'] = classesTime[i].finish.minute
            return carouselItem
        })
        setCarouselItems(y)
    }

    const renderItem = ({ item, index }) => {
        let carouselImage = ''
        switch (item.subject) {
            case 'Math':
                carouselImage = require(`../assets/Math.jpg`)
                break;
            case 'English':
                carouselImage = require(`../assets/English.jpg`)
                break;
            case 'French':
                carouselImage = require(`../assets/French.jpg`)
                break;
            case 'Art':
                carouselImage = require(`../assets/Art.jpg`)
                break;
            case 'Biology':
                carouselImage = require(`../assets/Biology.jpg`)
                break;
            case 'History':
                carouselImage = require(`../assets/History.png`)
                break;
            case 'Chemistry':
                carouselImage = require(`../assets/Chemistry.jpg`)
                break;
            default:
                carouselImage = require(`../assets/school.jpg`)
                break;
        }
        return (
            <View style={{
                backgroundColor: '#E6E7E9',
                borderRadius: 20,
                height: itemWidth,
                marginLeft: 25,
                marginRight: 25
            }}>
                <Image source={carouselImage} style={styles.carouselImage} />
                <View style={styles.carouselInfo}>
                    <Text style={{ fontSize: 30 }}>{item.subject}</Text>
                    <Text>
                        {item.startHour}:{item.startMinute} - {item.finishHour}:{item.finishMinute}
                    </Text>
                    <Button
                        onPress={() => navigation.navigate('Jitsi', {user: route.params.user, item: item, day: day, avatar: avatarUri})}
                        title="Join Class"
                        buttonStyle={styles.button}
                        raised
                        disabled={currentTime.hour > item.finishHour ? true 
                            : (currentTime.hour === item.finishHour && currentTime.minute > item.finishMinute) ? true
                            : false}
                    />
                </View>
            </View>

        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <View style={styles.dateContainer}><Text style={styles.date}>{date.current.toDateString()}</Text></View>
                <View style={styles.avatar}>
                {avatarUri
                    ? <Avatar
                        rounded
                        size={60}
                        overlayContainerStyle={{ backgroundColor: '#A0B2B5' }}
                        onPress={handleAvatarEdit}
                        activeOpacity={0.7}
                        showEditButton 
                        source={{uri: avatarUri}}
                        />
                    : <Avatar
                        rounded
                        size={60}
                        icon={{ name: 'user-edit', type: 'font-awesome-5' }}
                        overlayContainerStyle={{ backgroundColor: '#A0B2B5' }}
                        onPress={handleAvatarEdit}
                        activeOpacity={0.7}
                        showEditButton
                    />
                }
                    <Text h3 style={styles.welcome}>Welcome {firstName.current}</Text>
                </View>
            </View>
            <View style={styles.body}>
                {carouselItems
                    ?
                    <Carousel
                        layout={'tinder'}
                        data={carouselItems}
                        renderItem={renderItem}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        containerCustomStyle={{ flexGrow: 0 }}
                        onSnapToItem={(index) => console.log(index)}
                    />

                    : <ActivityIndicator size="large" color="#6ebfc2" />
                }

            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: '#9c27b0',
    },
    info: {
        width: '100%',
        flex: 1,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    date: {
        fontWeight: 'bold',
        padding: '5%',
        color: 'white'
    },
    avatar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    welcome: {
        color: 'white',
        padding: '5%'
    },
    body: {
        flex: 2,
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#9c27b0',
    },
    carouselImage: {
        height: '50%',
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    carouselInfo: {
        paddingHorizontal: 30, 
        flex: 1, 
        justifyContent: 'space-evenly'
    }
});
