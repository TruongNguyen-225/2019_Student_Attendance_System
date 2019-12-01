import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Global from '../../constants/global/Global';
import OfflineNotice from '../Header/OfflineNotice';
import Swipeout from 'react-native-swipeout';
import {setItemToAsyncStorage} from '../HandleAuthentication/function';

// import icons_add from '../../assets/icons/icon_plus_big.png';
import icons_list from '../../assets/icons/icon_list.png';
import school from '../../assets/icons/school.png';
import left from '../../assets/icons/left.png';

import Tittle from '../Header/Tittle';

const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');

var system = firebase.database ().ref ().child ('Manage_Class');

class FlatListItem extends Component {
  constructor (props) {
    super (props);
    this.state = {
      activeRowKey: null,
    };
  }
  render () {
    const swipeSettings = {
      autoClose: true,
      onClose: (secId, rowId, direction) => {
        if (this.state.activeRowKey != null) {
          this.setState ({activeRowKey: null});
        }
      },
      onOpen: (secId, rowId, direction) => {
        this.setState ({activeRowKey: this.props.item.key});
      },
      right: [
        {
          onPress: () => {
            const deletingRow = this.state.activeRowKey;
            Alert.alert (
              'Alert',
              'Are you sure you want to delete ?',
              [
                {
                  text: 'No',
                  onPress: () => console.log ('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  onPress: () => {
                    system
                      .orderByChild ('_id')
                      .equalTo (this.props.item._id)
                      .on ('child_added', data => {
                        data.key;
                        system.child (data.key).remove ();
                      });
                  },
                },
              ],
              {cancelable: true}
            );
          },
          text: 'Delete',
          type: 'delete',
        },
      ],
      rowId: this.props.index,
      sectionId: 1,
    };
    return (
      <Swipeout {...swipeSettings}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            // backgroundColor: this.props.index % 2 == 0 ? 'mediumseagreen': 'tomato' ,
            // justifyContent:'space-between',
            // alignItems:'center',
            backgroundColor: 'mediumseagreen',
          }}
        >

          <TouchableOpacity
            style={style.viewFlatList}
            onPress={() =>
              this.props.navigation.navigate ('FollowClass', {
                thamso: this.props.item,
              })}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flex: 1,
              }}
            >
              <Image source={school} style={{width: 50, height: 50}} />
              <View style={{justifyContent: 'flex-start', width: WIDTH * 0.6}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'normal',
                    paddingLeft: 25,
                  }}
                >
                  {this.props.item.className}
                </Text>
              </View>
              <Image
                source={left}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: '#333',
                  marginRight: 25,
                }}
              />
            </View>

          </TouchableOpacity>
        </View>
      </Swipeout>
    );
  }
}
const style = StyleSheet.create ({
  flatListItem: {
    color: 'white',
    padding: 10,
    fontSize: 16,
  },
  viewFlatList: {
    flexDirection: 'row',
    height: HEIGHT / 9,
    backgroundColor: '#fff',
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1,
    width: WIDTH,
    paddingLeft: 30,
    // justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class CreateClass extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {currentUser: null};
  constructor (props) {
    super (props);
    this.state = {
      userData: {},
      show: false,
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
      router: 'Main',
      tittle: 'DANH sÁCH LỚP',
      dataResult:[],
      textFail:'',
      listClassJoined:[],
    };
    // this._onPressAdd = this._onPressAdd.bind (this);
    Global.arrayClass = this.state.class;
    Global.tittle = this.state.tittle;
    Global.router = this.state.router;
    // Global.listClassJoined = this.state.listClassJoined;
  }

  componentDidMount () {
    this.getUserData ();
    this.getListStudent();
  //  console.log('in ra trên componentDidMout ',this.state.listClassJoined)
  }

  getUserData = async () => {
    await AsyncStorage.getItem ('userData').then (value => {
      const userData = JSON.parse (value);
      this.setState ({userData: userData});
    });
  };
  getListStudent =()=> {
    var rootRef = firebase.database ().ref ();
    var urlRef = rootRef.child('Manage_Class').child('');
    urlRef.orderByChild('MSSV')
    .equalTo(this.state.userData.MSSV)
    .once ('value', childSnapshot => {
      if (childSnapshot.exists ()) {
        const listClassJoined = [];
        childSnapshot.forEach (doc => {
          // var stt=0;
          // if (typeof doc.toJSON().email!= 'undefined') {
          //   stt=1;
          // }
          // if (stt==1)
          // {
            listClassJoined.push ({
              className:doc.toJSON().MSSV
            });
          // }
        });
        this.setState ({
          listClassJoined: listClassJoined.sort ((a, b) => {
            return a.className < b.className;
          })
        });
        console.log ('kết quả ', this.state.listClassJoined)
      }
    });
  }
  render () {
    const {currentUser} = this.state;
    return (
      <View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 34 : 0}}>
        <StatusBar backgroundColor="#03a9f4" barStyle="light-content" />
        <OfflineNotice />
        <Tittle {...this.props} />
        <View>
          <TouchableOpacity>
            <View style={styles.rowCreateClass}>
              <View style={styles.viewImgIcon}>
                <Image source={icons_list} style={{height: 45, width: 45}} />
              </View>
              <View style={styles.viewText}>
                <Text style={styles.textDirector}>
                  Danh Sách Lớp Bạn Đã Tham Gia Học
                </Text>
                <View style={{top: 2 * (HEIGHT / 10)}} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={this.showGlobal}>
            <Text>Click</Text>
          </TouchableOpacity>
          <Text>{this.state.userData.email}</Text>
        </View>

        <FlatList
          data={this.state.dataResult}
          renderItem={({item, index}) => {
            return (
              <FlatListItem
                item={item}
                index={index}
                parentFlatList={this}
                {...this.props}
              />
            );
          }}
          keyExtractor={(item, id) => item.id}
        />

      </View>
    );
  }
}
const styles = StyleSheet.create ({
  rowCreateClass: {
    flexDirection: 'row',
    height: HEIGHT / 11,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingLeft: 20,
    backgroundColor: '#f1f1f1',
  },
  viewImgIcon: {
    justifyContent: 'center',
  },
  viewText: {
    height: HEIGHT / 11,
    justifyContent: 'center',
  },
  textDirector: {
    fontSize: 15,
    fontWeight: 'normal',
    margin: 10,
    paddingLeft: 10,
    position: 'absolute',
  },
});
