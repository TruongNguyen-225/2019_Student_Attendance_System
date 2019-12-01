import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import firebase from 'react-native-firebase';

import AsyncStorage from '@react-native-community/async-storage';

import Tittle from '../Header/Tittle';
import Global from '../../constants/global/Global';
import {listClassJoined} from '../../constants/global/Global';

const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');
const RootRef = firebase.database ().ref ().child ('Manage_Class');
const RootRef_Child = firebase
  .database ()
  .ref ()
  .child ('Manage_Class/' + keypath);

// const RootRef_Child = RootRef.ref('MEMBER_JOIN_CLASS');
// const RootRef
var newKey = null;
var keypath = null;
var path = null;
var keyRoot = null;
export default class ListClass extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor (props) {
    super (props);
    this.state = {
      tittle: 'CÁC LỚP ĐÃ TẠO',
      router: 'Main',
      textId: '',
      userData: {},
      itemData: [],
      newKey: '',
      member: [],
      listClassJoined: [],
    };
    Global.tittle = this.state.tittle;
    Global.router = this.state.router;
    Global.listClassJoined;
  }
  componentDidMount () {
    this.getUserData ();
  }
  getUserData = async () => {
    await AsyncStorage.getItem ('userData').then (value => {
      var userData = JSON.parse (value);
      this.setState ({userData: userData});
    });
  };

  handleLogin = () => {
    const {userData, mssv, listClassJoined} = this.state;
    try {
      RootRef.orderByChild ('_id')
        .equalTo (this.state.textId)
        .on ('child_added', data => {
          data.key;
          try {
            firebase
              .database ()
              .ref ()
              .child ('Manage_Class/' + data.key)
              .orderByChild ('MSSV')
              .equalTo (this.state.userData.MSSV)
              .once ('value', childSnapshot => {
                if (childSnapshot.exists ()) {
                  Alert.alert (
                    'Thông báo',
                    'Bạn đã gia nhập lớp này , hãy kiểm tra lại !'
                  );
                } else {
                  newKey = RootRef.child (data.key).push (userData);
                  keyRoot = RootRef.child (data.key).key;
                  this.state.listClassJoined.push (keyRoot);
                  this.setState ({
                    listClassJoined,
                  });
                  Alert.alert ('Thông báo', 'Tham gia lớp học thành công !');
                  this.props.navigation.navigate('HomeScreen')
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
  };

  show_Info_A_Student = () => {
    path = newKey.path;
    console.log ('LOG RA1', firebase.database ().ref (path));
    firebase
      .database ()
      .ref (path)
      .orderByChild ('id')
      .equalTo (this.state.userData.id)
      .on ('value', childSnapshot => {
        var itemData = [];
        childSnapshot.forEach (doc => {
          itemData.push ({
            id: doc.toJSON ().id,
            email: doc.toJSON ().email,
            MSSV: doc.toJSON ().MSSV,
            fullName: doc.toJSON ().fullName,
            address: doc.toJSON ().numberPhone,
            proofs: doc.toJSON ().proofs,
            sex: doc.toJSON ().sex,
            address: doc.toJSON ().address,
            dateBirthday: doc.toJSON ().dateBirthday,
          });
        });
        this.setState ({
          itemData: itemData,
        });
      });
  };
  render () {
    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor="#03a9f4" barStyle="light-content" />
        <Tittle {...this.props} />
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <TextInput
            style={styles.inputStyle}
            autoCapitalize="none"
            placeholder="Nhập id lớp "
            onChangeText={textId => this.setState ({textId})}
            value={this.state.textId}
          />
          <View style={{marginTop: HEIGHT * 0.02, alignItems: 'center'}}>
            <TouchableOpacity
              style={styles.bigButton}
              onPress={this.handleLogin}
            >
              <Text style={styles.buttonText}>Join Class Now</Text>
            </TouchableOpacity>
          </View>
          <Text>email:{this.state.userData.email}</Text>
          <Text>mssv:{this.state.userData.MSSV}</Text>
          {/* <Text>{JSON.stringify(AsyncStorage.getItem ('userData'))}</Text> */}
          <View style={{marginTop: HEIGHT * 0.02, alignItems: 'center'}}>
            <TouchableOpacity
              style={styles.bigButton}
              onPress={this.show_Info_A_Student}
            >
              <Text style={styles.buttonText}>Show Info A Student Joined</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={this.state.itemData}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity style={styles.viewFlatList}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{paddingLeft: 20}}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'normal',
                        }}
                      >
                        MSSV : {item.MSSV}
                      </Text>
                      <Text>Email:{item.email}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item, id) => item.id}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  inputStyle: {
    width: WIDTH * 0.9,
    height: 50,
    backgroundColor: '#90caf9',
    marginBottom: 10,
    borderRadius: 30,
    paddingLeft: 30,
  },
  bigButton: {
    width: WIDTH * 0.9,
    height: 50,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0093c4',
  },
  buttonText: {
    fontFamily: 'Avenir',
    color: '#fff',
    fontWeight: '400',
  },
  viewFlatList: {
    flexDirection: 'row',
    height: HEIGHT / 9,
    backgroundColor: '#fff',
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1,
    width: WIDTH,
    paddingLeft: 30,
    alignItems: 'center',
  },
});
