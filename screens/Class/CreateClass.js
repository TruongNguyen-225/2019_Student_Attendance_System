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

import icons_add from '../../assets/icons/icon_plus_big.png';
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
      listStudent: [],
      textFail: '',
    };
  }
  componentDidMount () {
    this.getListStudent ();
  }
  getListStudent () {
    var rootRef = firebase.database ().ref ();
    var urlRef = rootRef.child ('Manage_Class/' + this.props.item.key);
    // console.log ('path-urlRef', urlRef.path);
    urlRef.once ('value', childSnapshot => {
      if (childSnapshot.exists ()) {
        const listStudent = [];
        childSnapshot.forEach (doc => {
          var stt=0;
          if (typeof doc.toJSON().email!= 'undefined') {
            stt=1;
          }
          if (stt==1)
          {
            listStudent.push ({
              email: doc.toJSON ().email,
              MSSV: doc.toJSON ().MSSV,
              id: doc.toJSON ().id,
            });
          }
        });
        this.setState ({
          listStudent: listStudent.sort ((a, b) => {
            return a.className < b.className;
          }),
          // listStudent,
        });
        console.log ('kết quả ', this.state.listStudent);
      }
    });
  }
  showInfoClass(){
    alert("chưa làm kịp :v")
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
          //  this.showInfoClass()
          this.props.navigation.navigate('Update_Manage_Class',{thamso:this.props.item})
          },
          text: 'Chỉnh Sửa TT Lớp',
          type: 'primary',
        },
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
          text: 'Xóa Lớp',
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
            onPress={async () => {
              await this.props.navigation.navigate ('FollowClass', {
                listStudent: this.state.listStudent,
                thamso: this.props.item,
           
              });
            }}
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
var pathClass = null;
var count= 0;
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
      router: 'HomeScreen',
      tittle: 'TẠO LỚP MỚI',
    };
    this._onPressAdd = this._onPressAdd.bind (this);
    Global.arrayClass = this.state.class;
    Global.tittle = this.state.tittle;
  }

  async componentDidMount () {
    Global.router = this.state.router;
    this.getUserData ();
    const {currentUser} = firebase.auth ();
    this.setState ({currentUser});
    await system.orderByChild('status').equalTo(this.state.status)
    .on ('value', childSnapshot => {
      const classRoom = [];
      childSnapshot.forEach (doc => {
        classRoom.push ({
          key: doc.key,
          status: doc.toJSON ().status,
          _id: doc.toJSON ()._id,
          className: doc.toJSON ().className,
          class: doc.toJSON ().class,
          subject: doc.toJSON ().subject,
          count: doc.toJSON ().count,
          teacher: doc.toJSON ().teacher,
          student_join: this.state.student_join,
        });
        this.setState ({
          class: classRoom.sort ((a, b) => {
            return a.className > b.className;
          }),
          // count : count,
          loading: true,
        });
      });
      
      console.log ('classRoom ', this.state.class);
    });
  }
  getUserData = async () => {
    await AsyncStorage.getItem ('userData').then (value => {
      const userData = JSON.parse (value);
      this.setState ({userData: userData});
    });
  };

  onSetState = () => {
    alert ('hahah');
  };
  onPressAdd = () => {
    var className = this.state.newClassName
      .concat (' - ')
      .concat (this.state.subject)
      .toUpperCase ();
    var checkRegExp = /^[0-9]*$/;
    if (
      this.state.newClassName.trim () === '' ||
      this.state.subject.trim () === '' ||
      this.state.count.trim () === ''
    ) {
      Alert.alert ('Lỗi', 'Các trường phải được điền đầy đủ !');
      return;
    } else if (checkRegExp.test (this.state.count) == false) {
      Alert.alert ('Lỗi', 'Sĩ số không đúng định dạng  !');
      return;
    }
    try {
      system
        .orderByChild ('className')
        .equalTo (
          this.state.newClassName
            .concat (' - ')
            .concat (this.state.subject)
            .toUpperCase ()
        )
        .once ('value', snapshot => {
          if (snapshot.exists ()) {
            Alert.alert (
              'Thông báo',
              'Lớp học này đã tồn tại , hãy kiểm tra lại !'
            );
          } else {
            // var pathKey = system.push().key
            system
              .push ({
                _id: require ('random-string') ({length: 10}),
                status: this.state.status,
                class: this.state.newClassName,
                subject: this.state.subject,
                className: className,
                count: this.state.count,
                gmail_teacher: this.state.currentUser.email,
                teacher: this.state.userData.fullName,
                member: this.state.member,
                // path: pathClass.key
              })
              // console.log('lopws hojc mowi dc tao cos path la :',pathClass)
              .then (
                this.setState ({
                  count: '',
                  subject: '',
                  newClassName: '',
                })
              );
            // .then(console.log('lopws hojc mowi dc tao cos path la :',pathClass))
          }
        });
    } catch (e) {
      alert (e);
    }
  };
  _onPressAdd () {
    this.refs.addModal.showAddModal ();
  }
  onGoToDetail = () => {
    const {className} = this.state.class;
    if (this.state.newClassName != '') {
      alert (this.state.newClassName);
      this.props.navigation.navigate ('Detail_Class', {
        thamso: this.state.newClassName,
      });
    }
  };

  render () {
    const {currentUser} = this.state;
    return (
      <View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 34 : 0}}>
        <StatusBar backgroundColor="#03a9f4" barStyle="light-content" />
        <OfflineNotice />
        <Tittle {...this.props} />
        <View style={styles.viewCreateClass}>
          <TextInput
            style={styles.viewTextInput}
            keyboardType="default"
            placeholderTextColor="black"
            placeholder="Nhập tên lớp học"
            autoCapitalize="none"
            onChangeText={text => {
              this.setState ({newClassName: text});
            }}
            value={this.state.newClassName}
          />
          <View
            style={{marginRight: 10, width: 42, height: 42}}
            underlayColor="tomato"
          >
            <Text />
          </View>
        </View>
        <View style={styles.viewCreateClass}>
          <TextInput
            style={styles.viewTextInput}
            keyboardType="default"
            placeholderTextColor="black"
            placeholder="Nhập tên môn học"
            autoCapitalize="none"
            onChangeText={text => {
              this.setState ({subject: text});
            }}
            value={this.state.subject}
          />
          <View
            style={{marginRight: 10, width: 42, height: 42}}
            underlayColor="tomato"
          >
            <Text />
          </View>
        </View>
        <View style={styles.viewCreateClass}>
          <TextInput
            style={styles.viewTextInput}
            keyboardType="default"
            placeholderTextColor="black"
            placeholder="Nhập sĩ số lớp học"
            autoCapitalize="none"
            onChangeText={text => {
              this.setState ({count: text});
            }}
            value={this.state.count}
          />
          <TouchableOpacity
            style={{marginRight: 10}}
            underlayColor="tomato"
            onPress={this.onPressAdd}
          >
            <Image style={{width: 42, height: 42}} source={icons_add} />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity>
            <View style={styles.rowCreateClass}>
              <View style={styles.viewImgIcon}>
                <Image source={icons_list} style={{height: 45, width: 45}} />
              </View>
              <View style={styles.viewText}>
                <Text style={styles.textDirector}>
                  Danh Sách Lớp Đang Xử Lí
                </Text>
                <View style={{top: 2 * (HEIGHT / 10)}} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <FlatList
          data={this.state.class}
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
  viewCreateClass: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 64,
  },
  viewTextInput: {
    height: 40,
    width: 250,
    margin: 10,
    padding: 10,
    borderColor: 'green',
    borderWidth: 1,
  },

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
  viewHiden: {
    backgroundColor: 'red',
    height: 64,
    width: WIDTH,
  },
  textDirector: {
    fontSize: 15,
    fontWeight: 'normal',
    margin: 10,
    paddingLeft: 10,
    position: 'absolute',
  },

  follow: {
    height: 50,
    backgroundColor: '#039be5',
    borderColor: '#039be5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH * 0.8,
    marginHorizontal: (WIDTH - WIDTH * 0.8) / 2,
    marginVertical: 20,
  },
});
