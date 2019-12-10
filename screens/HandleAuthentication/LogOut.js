import React, {Component} from 'react';
import {
  View,
  Alert,
} from 'react-native';
export default class LogOut extends Component {
    constructor () {
        super ();
      this.onSuccess();
    
      }
    onSuccess = () => {
        Alert.alert (
          'Notice',
          'Bạn chắc chắn muốn đăng xuất ?',
          [
            {
              text: 'Cancle',
              onPress: () => {
                this.props.navigation.navigate ('Main');
              },
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                this.onLogOut ();
              },
            },
          ],
          {cancelable: true}
        );
      };
      async onLogOut () {
    
        await AsyncStorage.clear ();
        Alert.alert(this.state.userData.enail);
        this.props.navigation.navigate ('LogIn');
      }
    
    render() {
        return (
           <View></View> 
        );
    }
}