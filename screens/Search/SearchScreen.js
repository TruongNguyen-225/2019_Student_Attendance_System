import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity
} from 'react-native';
import firebase from 'react-native-firebase';
import Global from '../../constants/global/Global';
import OfflineNotice from '../Header/OfflineNotice';
import AsyncStorage from '@react-native-community/async-storage';

import logoBack from '../../assets/icons/back.png';
import gif from '../../assets/icons/search.gif';
import school from '../../assets/icons/icons8-abc-96.png';
import left from '../../assets/icons/left.png';

var system = firebase.database().ref().child('Manage_Class');

const { width: WIDTH } = Dimensions.get('window');
const { height: HEIGHT } = Dimensions.get('window');

class FlatListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRowKey: null,
      listStudent: [],
      textFail: '',
    };
  }
 async componentDidMount() {
  }
  showInfoClass() {
    alert("chưa làm kịp :v")
  }
  render() {
    return (
        <View style={ style.viewOneClass}>
          <TouchableOpacity
            style={style.viewFlatList}
            // onPress={async () => {
            //   await this.props.navigation.navigate('FollowClass', {
            //     listStudent: this.state.listStudent,
            //     thamso: this.props.item,
            //   });
            // }}
            >
            <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',flex: 1, }}>
              <View style={{ width: 50, height: 50, borderWidth: 0, borderRadius: 999, alignItems: 'center', justifyContent: 'center', }}>
                <Image source={school} style={{ width: 50, height: 50 }} />
              </View>
              <View style={{ justifyContent: 'flex-start', width: WIDTH * 0.73, borderWidth: 0, paddingLeft: 25, }}>
                <Text style={{fontSize: 14,fontWeight: '700',opacity: .7,}}>
                  {this.props.item.className}
                </Text>
                <Text style={{fontSize: 12, fontWeight: '700', fontStyle: 'italic',color: '#448aff', }}>
                 Đã Tham Gia
                </Text>
              </View>
              <Image
                source={left}
                style={{width: 20, height: 20, tintColor: '#333', marginRight: 15, }} />
            </View>
          </TouchableOpacity>
        </View>
    );
  }
}
const style = StyleSheet.create({
  viewOneClass:{
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewFlatList: {
    flexDirection: 'row',
    height: HEIGHT / 9,
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1,
    width: WIDTH,
    paddingLeft: 10,
    alignItems: 'center',
    width: WIDTH * 0.97,
    backgroundColor: '#fff'
  },
  styleText: {
    fontSize: 12,
    color: 'gray',
  }
});

export default class SearchScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      userData:{},
      isChecked:'Đã Chốt Lớp , Lớp Có Thể Điểm Danh',
      listClassNew: [],
      classDone: [],
      txtSearch: '',
      router: 'HomeScreen',
      condition1: false,
      condition3: true,
    };
    Global.tittle = this.state.tittle;
    Global.router = this.state.router;
  }
  async componentDidMount() {
    await this.getUserData();
    //lấy danh sách lớp HOC SINH ĐÃ THAM GIA VỀ
    await firebase.database().ref().child('Relationship/' + this.state.userData.MSSV).on('value', async (childSnapshot) => {
      const classRoom = [];
      childSnapshot.forEach(doc => {
        classRoom.push({
          key: doc.val(),
        });
        this.setState({
          class: classRoom
        });
      });
      var arr = [];
      this.state.class.forEach(async (element) => {
        await firebase.database().ref("Manage_Class/" + element.key).on('value', (value) => {
          if (value.exists()) {
            if(value.toJSON().isChecked === this.state.isChecked)
            {
              arr.push({ className: value.toJSON().className });
            }
          }
          this.setState({
            classDone: arr
          });
        });
      });
    });
  }
  getUserData = async () => {
    await AsyncStorage.getItem('userData').then(value => {
      const userData = JSON.parse(value);
      this.setState({ userData: userData });
    });
  };
  async onSearch() {
    var key = this.state.txtSearch.toUpperCase();
    var arr_temp = this.state.classDone;
    var arr_search = [];
    var arr_error = [];
    var kt = 0;
    for (let i = 0; i < arr_temp.length; i++) {
      if (key.trim() === "") {
        arr_error.push({ notice: " Bắt đầu tìm kiếm bằng cách hãy nhập gì đó !" })
        this.setState({
          condition1: true,
        })
      }
      else
        if (key != "") {
          if (arr_temp[i].className.toString().toUpperCase().includes(key)) {
            arr_search.push(arr_temp[i]);
            kt = 1;
            this.setState({
              condition1: false,
              isSearch: true,
              condition3:false,
            })
          }
        }
    }
    if (kt == 0)
      console.log("Không có kết quả tìm thấy !")
    else
      this.setState({
        listClassNew: arr_search,
        condition3:false,
      })
  }
  render() {
    const viewFlatList = (
      this.state.condition1 ?
        null
        :
        <FlatList
          style={{ width: WIDTH * 0.97, borderWidth: 0, marginVertical: 5, marginHorizontal: 5 }}
          data={this.state.listClassNew}
          renderItem={({ item, index }) => {
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
    );
    const viewStart = (
      <View style={styles.viewStart}>
        <Text style={{marginVertical:50,}}>Hãy nhập gì đó vào ô tìm kiếm để bắt đầu !</Text>
        <Image source={gif} style={{ width: WIDTH*0.9, height: 240 }} />
      </View>
    );
    const { txtSearch, condition3 } = this.state;
    const viewBig = condition3 ? viewStart: this.state.isSearch ? viewFlatList : <View><Text>Chúng tôi không tìm thấy kết quả nào phù hợp với {this.state.txtSearch}</Text></View>;
    return (
      <View style={{ flex: 1 }}>
        <OfflineNotice />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.contentChild}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
                style={{ height: 30, width: 30 }}
              >
                <Image
                  style={{ height: 30, width: 30, tintColor: 'white' }}
                  source={logoBack}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.topBar}>
              <TextInput
                style={styles.textInput}
                placeholder={'Nhập tên lớp bạn cần tìm ?'}
                placeholderTextColor={'#333'}
                underlineColorAndroid="transparent"
                value={txtSearch}
                onChangeText={text => {
                  this.setState({ txtSearch: text });
                }}
                onSelectionChange={this.onSearch.bind(this)}
                onSubmitEditing={this.onSearch.bind(this)}
              />
              <View style={{ width: 45 }}>
                <Text />
              </View>
            </View>
          </View>
          <View style={styles.content}>
            {viewBig}
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  topBar: {
    width: WIDTH * 0.87,
    height: HEIGHT / 12,
    backgroundColor: '#03a9f4',
    paddingTop: (HEIGHT / 12 - HEIGHT / 20) / 2,
  },
  textInput: {
    height: HEIGHT / 20,
    width: WIDTH * 0.75,
    backgroundColor: '#0288d1',
    opacity: 0.6,
    paddingLeft: 10,
    paddingVertical: 0,
    borderRadius: 20,
    alignItems: 'center',
  },
  icons: {
    height: 45,
    width: 45,
    marginLeft: 10,
  },
  contentChild: {
    height: HEIGHT / 12,
    width: WIDTH * 0.16,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#03a9f4',
  },
content:{ flex: 1 ,alignItems:'center',justifyContent:'center',backgroundColor:'#dddddd'},
viewStart:{ alignItems: 'center',  flex: 1 , width: WIDTH*0.95,backgroundColor:"#FFF",marginVertical:7,borderRadius:6,},
 
});
