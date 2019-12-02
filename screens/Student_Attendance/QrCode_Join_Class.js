import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  PermissionsAndroid, 
  Platform,
} from 'react-native';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Tittle from '../Header/Tittle';
import Global from '../../constants/global/Global';
import { CameraKitCameraScreen, } from 'react-native-camera-kit';

const RootRef = firebase.database().ref().child('Manage_Class');
var keyRoot = null;
var thoigian = new Date();
var date = thoigian.getDate();
var month = thoigian.getMonth() + 1;
var year = thoigian.getFullYear();
var datecurrent = year + '-' + month + '-' + date;

export default class QrCode_Join_Class extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      tittle: 'THAM GIA LỚP HỌC',
      router: 'HomeScreen',
      textId: '',
      userData: {},
      itemData: [],
      newKey: '',
      member: [],
      listClassJoined: [],
      datecurrent:datecurrent,
      qrvalue: '',
      opneScanner: false,
    };
    Global.tittle = this.state.tittle;
    Global.router = this.state.router;
    Global.listClassJoined;
  }
  componentDidMount() {
    this.getUserData();
  }
  getUserData = async () => {
    await AsyncStorage.getItem('userData').then(value => {
      var userData = JSON.parse(value);
      this.setState({ userData: userData });
    });
  };
  onOpenlink() {
    Linking.openURL(this.state.qrvalue);
  }
  onBarcodeScan(qrvalue) {
    this.setState({ qrvalue: qrvalue });
    this.setState({ opneScanner: false });
  }
  onOpneScanner() {
    var that =this;
    if(Platform.OS === 'android'){
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,{
              'title': 'CameraExample App Camera Permission',
              'message': 'CameraExample App needs access to your camera '
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //If CAMERA Permission is granted
            that.setState({ qrvalue: '' });
            that.setState({ opneScanner: true });
          } else {
            alert("CAMERA permission denied");
          }
        } catch (err) {
          alert("Camera permission err",err);
          console.warn(err);
        }
      }
      requestCameraPermission();
    }else{
      that.setState({ qrvalue: '' });
      that.setState({ opneScanner: true });
    }    
  }
  render() {
    const { userData } = this.state;
    try {
      RootRef.orderByChild ('_id').equalTo (this.state.qrvalue).on ('child_added', data => {
        data.key;
        try {
          firebase.database ().ref ().child ('Manage_Class/' + data.key + '/StudentJoin').once ('value', value => {
            if (value.numChildren () >=10) {
              Alert.alert ('Thông báo','Lớp đã đủ người tham gia ,vui lòng kiểm tra lại !');
              this.props.navigation.navigate ('HomeScreen');
            } 
            else{
              firebase.database ().ref ().child ('Manage_Class/' + data.key+'/StudentJoin').orderByChild ('MSSV').equalTo (this.state.userData.MSSV).once ('value', childSnapshot => {
                if (childSnapshot.exists ()) {
                  Alert.alert ('Thông báo','Bạn đã gia nhập lớp này , hãy kiểm tra lại !');
                  this.props.navigation.navigate ('HomeScreen');
                } else {
                  newKey = RootRef.child ( data.key + '/StudentJoin').push (userData);
                  keyRoot = RootRef.child (data.key).key;
                  firebase.database ().ref ().child ('Relationship/' + this.state.userData.MSSV).push (keyRoot);
                  Alert.alert ('Thông báo','Tham gia lớp học thành công !'); 
                  this.props.navigation.navigate ('HomeScreen');
                }
              });
            }
          });
          } catch (e) {
            window.location.href =
              'http://stackoverflow.com/search?q=[js]+' + e.message;
          }
        });
    } catch (e) {
      console.log ('error', e);
    }
    if (!this.state.opneScanner) {
      return (
        <View style={{flex:1}}>
        <Tittle {...this.props} />

        <View style={styles.container}>
            <Text style={styles.heading}>QUÉT QRCODE ĐỂ ĐIỂM DANH</Text>
            {this.state.qrvalue.includes("http") ? 
              <TouchableOpacity
                onPress={() => this.onOpenlink()}
                style={styles.button}>
                  <Text style={{ color: '#FFFFFF', fontSize: 12 }}>NHẤN ĐỂ ĐIỂM DANH</Text>
              </TouchableOpacity>
              : null
            }
            <TouchableOpacity
              onPress={() => this.onOpneScanner()}
              style={styles.button}>
                <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
                QUÉT QR CODE
                </Text>
            </TouchableOpacity>
        </View>
        </View>

      );
    }
    return (
      <View style={{ flex: 1 }}>
        <CameraKitCameraScreen
          showFrame={false}
          scanBarcode={true}
          laserColor={'blue'}
          frameColor={'yellow'}
          colorForScannerFrame={'black'}
          onReadCode={event =>
            this.onBarcodeScan(event.nativeEvent.codeStringValue)
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'white'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#537791',
    padding: 10,
    width:300,
    marginTop:16
  },
  heading: { 
    color: 'black', 
    fontSize: 19, 
    alignSelf: 'center', 
    padding: 10, 
    marginTop: 30 
  },
  simpleText: { 
    color: 'black', 
    fontSize: 20, 
    alignSelf: 'center', 
    padding: 10, 
    marginTop: 16
  }
});
