import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import OpenDrawer from '../Header/OpenDrawer';
import Search_TextInput from '../Header/Search_TextInput';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Global from '../../constants/global/Global';
import OfflineNotice from '../Header/OfflineNotice';

import icons_add from '../../assets/icons/icons8-add-file-99.png';
import icons_load from '../../assets/icons/QR_Code-256.png';
import icons_checked from '../../assets/icons/icons8-check-file-96.png';
import icons_danger from '../../assets/icons/icon_danger.png';
import icon_done  from '../../assets/icons/icon_check.png'
import icon_wait from '../../assets/icons/icons_circle.png';

const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');

var system = firebase.database ().ref ().child ('Manage_Class');
export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor (props) {
    super (props);
    this.state = {
      userData: {},
      class: [],
      newClassName: '',
      loading: false,
      status: false,
      className: '',
      class: '',
      subject: '',
      path: '',
      count: '',
      teacher: '',
      member: null,
      activeRowKey: null,
      closeClass:true,
      classClosed:[],
      resultFail:false,
    };
    Global.arrayClass = this.state.class;
    this.getUserData ();

  }
  async componentDidMount () {
    Global.router = this.state.router;
    this.getUserData ();
    const {currentUser} = firebase.auth ();
    this.setState ({currentUser});
  }
  getUserData = async () => {
    await AsyncStorage.getItem ('userData').then (value => {
      const userData = JSON.parse (value);
      this.setState ({userData: userData});
      console.log('MSSV',this.state.userData.MSSV)
    });
  };
  onGoToSearch () {
    () => this.props.navigation.navigate ('Search');
  }
  _Alert(){
    Alert.alert('Thông báo !','Vui lòng cập nhật thông tin cá nhân trước khi sử dụng chức năng này ! ')
  }
  _goToAttendance_QrCode(){
    this.state.userData.MSSV ? this.props.navigation.navigate('QrCode_Attendance') : this._Alert();
  }
  _goToJoin_QrCode(){
    this.state.userData.MSSV ? this.props.navigation.navigate('QrCode_Join_Class') : this._Alert();
  }
  _goToList_Attendanced(){
    this.state.userData.MSSV ? this.props.navigation.navigate('List_Attendanced') : this._Alert();
  }
  _goToClass_Joined(){
    this.state.userData.MSSV ? this.props.navigation.navigate('Class_Joined') : this._Alert();
  }
  _goToClass_Waiting(){
    this.state.userData.MSSV ? this.props.navigation.navigate('Class_Waiting') : this._Alert();
  }
  _goToUpdate_Schedule(){
    this.state.userData.MSSV ? this.props.navigation.navigate('Update_Schedule') : this._Alert();
  }
  render () {
    return (
      <View style={{flex: 1}}>
        <OfflineNotice style={{flex: 1}} />
        <StatusBar backgroundColor="#03a9f4" barStyle="light-content" />
        <View style={{flexDirection: 'row'}}>
          <OpenDrawer {...this.props} />
          <Search_TextInput
            onGoToSearch={() => this.props.navigation.navigate ('SearchScreen')}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.content_child}>
            <ScrollView>
              <View style={styles.child_row}>
                <View style={styles.children}>
                  <TouchableOpacity style={styles.styleTouch}
                      // onPress={()=>this.props.navigation.navigate('QrCode_Join_Class')}>
                      onPress={()=>this._goToJoin_QrCode()}>
                    <View style={styles.styleImg}>
                      <Image source={icons_add} style={{width: '80%', height: '80%'}} />
                    </View>
                    <Text style={{fontSize: 15, flexWrap: 'wrap'}}>
                      Tham Gia
                    </Text>
                    <Text style={{fontSize: 15, flexWrap: 'wrap'}}>
                      Lớp Học
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.children}>
                  <TouchableOpacity style={styles.styleTouch}
                      // onPress={()=>this.props.navigation.navigate('QrCode_Attendance')}>
                      onPress={()=>this._goToAttendance_QrCode()}>
                    <View style={styles.styleImg}>
                      <Image source={icons_load} style={{width: '80%', height: '80%'}} />
                    </View>
                    <Text style={{fontSize: 15, flexWrap: 'wrap'}}>
                      Điểm Danh
                    </Text>
                    <Text style={{fontSize: 15, flexWrap: 'wrap'}}>
                      QR Code
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.child_row}>
                <View style={styles.children}>
                  <TouchableOpacity style={styles.styleTouch}
                      onPress={()=>this._goToList_Attendanced()}>
                    <View style={styles.styleImg}>
                      <Image source={icons_checked} style={{width: '80%', height: '80%'}} />
                    </View>
                    <Text style={{fontSize: 15, flexWrap: 'wrap'}}>
                      Thông Tin
                    </Text>
                    <Text style={{fontSize: 15, flexWrap: 'wrap'}}>
                      Điểm Danh
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.children}>
                  <TouchableOpacity style={styles.styleTouch}
                      onPress={()=>this._goToUpdate_Schedule()}>
                    <View style={styles.styleImg}>
                      <Image source={icons_danger} style={{width: '80%', height: '80%'}} />
                    </View>
                    <Text style={{fontSize: 15, flexWrap: 'wrap'}}>
                      Cảnh Báo
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.child_row}>
                <View style={styles.children}>
                  <TouchableOpacity style={styles.styleTouch}
                      onPress={()=>this._goToClass_Joined()}>
                    <View style={styles.styleImg}>
                      <Image source={icon_done} style={{width: '80%', height: '80%'}} />
                    </View>
                    <Text style={{fontSize: 15, flexWrap: 'wrap'}}>
                      Lớp Đã Tham Gia
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.children}>
                  <TouchableOpacity style={styles.styleTouch}
                     onPress={()=>this._goToClass_Waiting()}>
                    <View style={styles.styleImg}>
                      <Image source={icon_wait} style={{width: '80%', height: '80%'}} />
                    </View>
                    <Text style={{fontSize: 15, flexWrap: 'wrap'}}>
                      Lớp Đang Chờ
                    </Text>
                    <Text style={{fontSize: 15, flexWrap: 'wrap'}}>
                      Xác Nhận
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
        </View>
      </View>
      </View>
    );
  }
}
const styles = StyleSheet.create ({
  content: {
    backgroundColor: 'rgba(112, 119, 127, 0.3)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content_child: {
    width: WIDTH * 0.96,
    height: 'auto',
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    marginVertical: 8,
    marginBottom:0,
    borderBottomLeftRadius:0,
    borderBottomRightRadius:0,
    borderRadius: 10,
  },
  child_row: {
    flexDirection: 'row',
    width: WIDTH * 0.9,
    height: 155,
    marginTop: HEIGHT * 0.03,
    justifyContent: 'center',

  },
  children: {
    borderWidth: 1,
    borderColor: '#ddd',
    width: 150,
    height: 155,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    backgroundColor: 'rgba(166,216,207, 0.5)',
  },
 styleTouch:{
  width: 170,
  height: 170,
  alignItems: 'center',
  justifyContent: 'center',
 },
 styleImg:{
  height: 80,
  width: 80,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
},


});

on_Done_all_slides = () => {
  this.setState ({
    show_Main_App: true,
    show_Main: true,
  });
  this.setState ({stateWelcome: true});
};

on_Skip_slides = () => {
  this.setState ({show_Main_App: true, show_Main: true});
  this.setState ({stateWelcome: true});
};

ShowHideComponent = () => {
  if (this.state.show == true) {
    this.setState ({show: false});
  } else {
    this.setState ({show: true});
  }
};

const slides = [
  {
    key: 'k3',
    title: ' Face Recognition',
    text: 'Detect And Recognize Face',
    image: {
      uri: 'https://reactnativecode.com/wp-content/uploads/2019/04/computer.png',
    },
    titleStyle: styles.title,
    textStyle: styles.text,
    imageStyle: styles.image,
    backgroundColor: '#282C34',
  },
  {
    key: 'k4',
    title: 'Attendance System',
    text: ' Attendance System With Face',
    image: {
      uri: 'https://reactnativecode.com/wp-content/uploads/2019/04/flight.png',
    },
    titleStyle: styles.title,
    textStyle: styles.text,
    imageStyle: styles.image,
    backgroundColor: '#49a7cc',
  },
  {
    key: 'k5',
    title: 'Smart & Easy',
    text: ' Smarthing :v',
    image: {
      uri: 'https://reactnativecode.com/wp-content/uploads/2019/04/restaurants.png',
    },
    titleStyle: styles.title,
    textStyle: styles.text,
    imageStyle: styles.image,
    backgroundColor: '#FF3D00',
  },
];
