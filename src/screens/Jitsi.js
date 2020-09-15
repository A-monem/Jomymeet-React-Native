import React, {Component} from 'react';
import { View } from 'react-native';
import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';
import { useRoute, useNavigation } from '@react-navigation/native';

class VideoCall extends React.Component {
  constructor(props) {
    super(props);
    this.onConferenceTerminated = this.onConferenceTerminated.bind(this);
    this.onConferenceJoined = this.onConferenceJoined.bind(this);
    this.onConferenceWillJoin = this.onConferenceWillJoin.bind(this);
    this.navigation = this.props.navigation
    this.user = this.props.route.params.user
    this.class = this.props.route.params.item
    this.day = this.props.route.params.day
    this.avatar = this.props.route.params.avatar
  }

  componentDidMount() {

    setTimeout(() => {
      const url = `https://meet.jit.si/${this.class.subject}${this.user.grade}${this.day[0]}Jomymeet`; // can also be only room name and will connect to jitsi meet servers
      const userInfo = { displayName: `${this.user.firstName} ${this.user.lastName}`, email: `${this.user.email}`, avatar: this.avatar };
      JitsiMeet.call(url, userInfo);
      /* You can also use JitsiMeet.audioCall(url) for audio only call */
      /* You can programmatically end the call with JitsiMeet.endCall() */
    }, 1000);
  }

  onConferenceTerminated(nativeEvent) {
    this.navigation.navigate('Dashboard')
  }

  onConferenceJoined(nativeEvent) {
    /* Conference joined event */
  }

  onConferenceWillJoin(nativeEvent) {
    /* Conference will join event */
  }

  render() {
    return (
      <View style={{ backgroundColor: 'black',flex: 1 }}>
        <JitsiMeetView onConferenceTerminated={this.onConferenceTerminated} onConferenceJoined={this.onConferenceJoined} onConferenceWillJoin={this.onConferenceWillJoin} style={{ flex: 1, height: '100%', width: '100%' }} />
      </View>
    );
  }
}

export default function Login(props){
  const route = useRoute();
  const navigation = useNavigation();

  return <VideoCall {...props} route={route} navigation={navigation}/>
}