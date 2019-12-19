import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
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
var thoigian = new Date();
var date = thoigian.getDate();
var month = thoigian.getMonth() + 1;
var year = thoigian.getFullYear();
var datecurrent = year + '-' + month + '-' + date;
export default class QrCode_Attendance extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      tittle: 'ĐIỂM DANH VỚI QRCODE',
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
    //Function to open URL, If scanned 
    Linking.openURL(this.state.qrvalue);
    //Linking used to open the URL in any browser that you have installed
  }
  onBarcodeScan(qrvalue) {
    //called after te successful scanning of QRCode/Barcode
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
              'title': 'Thông báo !',
              'message': 'Camera cần cấp quyền sử dụng camera của thiết bị, hãy nhấn OK '
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //If CAMERA Permission is granted
            that.setState({ qrvalue: '' });
            that.setState({ opneScanner: true });
          } else {
            alert("Camera bị chặn quyền sử dụng ");
          }
        } catch (err) {
          alert("Đã xảy ra lỗi !");
          console.warn(err);
        }
      } 
      //Calling the camera permission function
      requestCameraPermission();
    }else{
      that.setState({ qrvalue: '' });
      that.setState({ opneScanner: true });
    }    
  }
  render() {
    const { userData } = this.state;
    try {
      RootRef.orderByChild('_id')
        .equalTo(this.state.qrvalue)
        .on('child_added', data => {
          data.key;
          try {
            RootRef.child(data.key+`/StudentJoin`).orderByChild('MSSV').equalTo(userData.MSSV)
            .on('value',value =>{
                if(!value.exists())
                {
                    Alert.alert('Thông báo', 'Điểm danh không thành công, có thể bạn chưa gia nhập lớp học này ? ');
                    this.props.navigation.navigate('QrCode_Attendance')
                }
                else {
                  firebase.database().ref().child('Manage_Class/' + data.key +`/Attendance/${this.state.datecurrent}`).orderByChild('MSSV').equalTo(this.state.userData.MSSV)
                  .once('value', childSnapshot => {
                    if (childSnapshot.exists()) {
                      Alert.alert(
                        'Thông báo',
                        'Bạn đã điểm danh rồi , hãy kiểm tra lại !'
                      );
                      this.props.navigation.navigate('HomeScreen')
                    } else{
                        newKey = RootRef.child(data.key+`/Attendance/${this.state.datecurrent}`).push(userData);
                        // keyRoot = RootRef.child(data.key).key;
                        // console.log('keyRoot',keyRoot)
                        // this.state.listClassJoined.push(keyRoot);
                        // this.setState({
                        //   listClassJoined,
                        // });
                        this.props.navigation.navigate('HomeScreen')
                        Alert.alert('Thông báo', 'Điểm danh thành công !');
                        }
                    })                  
                }
              });
          } catch (e) {
            window.location.href =
              'http://stackoverflow.com/search?q=[js]+' + e.message;
          }
        });
    } catch (e) {
      console.log('error', e);
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
          //Show/hide scan frame
          scanBarcode={true}
          //Can restrict for the QR Code only
          laserColor={'blue'}
          //Color can be of your choice
          frameColor={'yellow'}
          //If frame is visible then frame color
          colorForScannerFrame={'black'}
          //Scanner Frame color
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
