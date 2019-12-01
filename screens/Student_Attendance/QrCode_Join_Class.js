import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';

import Tittle from '../Header/Tittle';
import Global from '../../constants/global/Global';
const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');
const RootRef = firebase.database ().ref ().child ('Manage_Class');

var newKey = null;
var keypath = null;
var path = null;
var keyRoot = null;
export default class QrCode_Join_Class extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor (props) {
    super (props);
    this.state = {
      tittle: 'THAM GIA LỚP HỌC',
      // router: 'Main',
      textId: '',
      userData: {},
      itemData: [],
      newKey: '',
      member: [],
      listClassJoined: [],
    };
    Global.tittle = this.state.tittle;
    // Global.router = this.state.router;
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

  handle_Join_Class = () => {
    const {userData, mssv, listClassJoined} = this.state;
    try {
      RootRef.orderByChild ('_id').equalTo (this.state.textId).on ('child_added', data => {
        data.key;
        try {
          firebase.database ().ref ().child ('Manage_Class/' + data.key + '/StudentJoin').once ('value', value => {
            // console.log ('numberChild', value.numChildren ());
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
                  keyRoot = RootRef.child (data.key).key;this.state.listClassJoined.push (keyRoot);this.setState ({listClassJoined,});
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
  };
  render () {
    return (
      <View style={{flex: 1}}>
        <Tittle {...this.props} />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 0,
            backgroundColor: 'rgba(112, 119, 127, 0.3)',
          }}
        >
          <View style={styles.styleContent}>
            <View style={styles.rowInput}>
              <View style={styles.stylesLable}>
                <Text>ID Lớp </Text>
              </View>
              <TextInput
                style={styles.viewTextInput}
                keyboardType="default"
                placeholderTextColor="gray"
                fontStyle="italic"
                placeholder="Nhập ID lớp "
                autoCapitalize="none"
                onChangeText={textId => this.setState ({textId})}
                value={this.state.textId}
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                height: HEIGHT / 8,
                justifyContent: 'center',
                paddingTop: 220,
              }}
            >
              <TouchableOpacity
                style={styles.bigButton}
                onPress={this.handle_Join_Class}
              >
                <Text style={styles.buttonText}>Tham Gia Lớp Học</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* <Text>email:{this.state.userData.email}</Text>
          <Text>mssv:{this.state.userData.MSSV}</Text> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  rowInput: {
    flexDirection: 'row',
    height: HEIGHT / 13,
    width: WIDTH * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    marginVertical: 10,
  },
  stylesLable: {
    justifyContent: 'center',
    backgroundColor: 'rgba(112, 119, 127, 0.3)',
    borderBottomLeftRadius: 7,
    borderTopLeftRadius: 7,
    width: WIDTH * 0.22,
    height: HEIGHT / 13,
    paddingLeft: 10,
    borderLeftColor: 'rgba(112, 119, 127, 0.3)',
    borderWidth: 1,
    borderTopColor: '#dddddd',
    borderBottomColor: '#dddddd',
    borderRightWidth: 0,
  },
  styleContent: {
    backgroundColor: '#fff',
    width: WIDTH * 0.96,
    borderRadius: 5,
    alignItems: 'center',
    // justifyContent:'center',
    paddingTop: 60,
    flex: 1,
    marginVertical: 7,
  },
  viewTextInput: {
    height: HEIGHT / 13,
    width: WIDTH * 0.65,
    // margin: 10,
    padding: 10,
    borderColor: 'rgba(112, 119, 127, 0.3)',
    borderWidth: 1,
    // borderBottomWidth:1,
    backgroundColor: '#fff',
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
});
