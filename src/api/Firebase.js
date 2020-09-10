import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const firebaseLogin = (email, password) => {
    return new Promise((resolve, reject) => {
        try {
            auth().signInWithEmailAndPassword(email, password).then(() => {
                firestore().collection("users").doc(auth().currentUser.uid).get().then((usersSnapshot) => resolve(usersSnapshot.data()))
            })

        } catch (error) {
            alert(error.message)
            reject()
        }
    })
}

export const firebaseGetTimetable = (grade, classroom) => {
    return new Promise((resolve, reject) => {
        try {
            firestore().collection("timetable").doc(grade.toString()).get()
                .then((snapshot) => {
                    resolve(snapshot.data()[classroom.toString()])
                })
        } catch (error) {
            alert(error.message)
            reject()
        }
    })
}

export const firebasePutUserAvatarUri = (user, uri) => {
    return new Promise((resolve, reject) => {
        try {
            user["avatar"] = uri
            firestore().collection("users").doc(auth().currentUser.uid).set(user)
                .then(() => {
                    console.log('uri added')
                    resolve()
                })
        } catch (error) {
            alert(error.message)
            reject()
        }
    })
}
