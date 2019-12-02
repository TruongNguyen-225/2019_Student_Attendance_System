import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Picker,
  ScrollView,
  Button,
} from 'react-native';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import RNPicker from "rn-modal-picker";
import DateTimePicker from "react-native-modal-datetime-picker";
import Global from '../../constants/global/Global';
import Tittle from '../Header/Tittle';

const { width: WIDTH } = Dimensions.get('window');
const { height: HEIGHT } = Dimensions.get('window');

export default class Update_Schedule extends Component {
  static navigationOptions = {
    header: null,
  };
  state = { currentUser: null };
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      userData: {},
      class: [],
      classDone: [],
      isChecked:'Đã Chốt Lớp , Lớp Có Thể Điểm Danh',
      router: 'HomeScreen',
      tittle: 'CẬP NHẬT THỜI KHÓA BIỂU',
      placeHolderText: "-- Chọn Môn Học --",
      placeHolderText1: "-- Chọn Số Buổi Học --",

      selectedText: ""
    };
    Global.arrayClass = this.state.class;
    Global.tittle = this.state.tittle;
  }

  async componentDidMount() {
    Global.router = this.state.router;
    await this.getUserData();
    const { currentUser } = firebase.auth();
    this.setState({ currentUser });
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
  _selectedValue(index, item) {
    this.setState({ selectedText: item.name });
  }
  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = time => {
    console.log("A date has been picked: ", time);
    this.hideDateTimePicker();
  };
  render() {
      const {classDone}= this.state;
      var arr=[];
      var caHoc=[];
      for(var i=0;i<=classDone.length;i++)
    if (classDone[i])
    {
        arr.push({id:i,name:classDone[i]["className"]});
    }
     
    return (
      <View style={Styles.container}>
        <Tittle {...this.props} />
        <ScrollView style={Styles.viewScrollView}>
            <View style={Styles.content}>
          <Text style={Styles.lable}>Môn Học :</Text>
            <RNPicker
              dataSource={arr }
              dummyDataSource={arr}
              defaultValue={false}
              pickerTitle={"Danh Sách Môn Học"}
              showSearchBar={true}
              disablePicker={false}
              changeAnimation={"none"}
              searchBarPlaceHolder={"Search....."}
              showPickerTitle={true}
              searchBarContainerStyle={this.props.searchBarContainerStyle}
              pickerStyle={Styles.pickerStyle}
              pickerItemTextStyle={Styles.listTextViewStyle}
              selectedLabel={this.state.selectedText}
              placeHolderLabel={this.state.placeHolderText}
              selectLabelTextStyle={Styles.selectLabelTextStyle}
              placeHolderTextStyle={Styles.placeHolderTextStyle}
              dropDownImageStyle={Styles.dropDownImageStyle}
              dropDownImage={require('../../assets/icons/down.png')}
              selectedValue={(index, item) => this._selectedValue(index, item)}
            />  
             <Text style={Styles.lable}>Số Buổi Học/Tuần (Tính Riêng Môn Đang Xét):</Text>
             <View style={Styles.viewModalPicker}>
                  <Picker
                    selectedValue={this.state.sex}
                    value={this.state.sex}
                    style={{
                      fontSize:10,
                      height: 40,
                      borderWidth: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#fff',
                    }}
                    onValueChange={(value, itemIndex) =>
                      this.setState ({sex: value})}
                  >
                    <Picker.Item pickerStyleType={{paddingLeft:12}} label=" -- Số Buổi Học/Tuần --"  />
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="5" value="5" />
                    <Picker.Item label="6" value="6" />
                    <Picker.Item label="7" value="7" />
                    <Picker.Item label="8" value="8" />
                    <Picker.Item label="9" value="9" />
                  </Picker>
                </View>
             <Text style={Styles.lable}>Thời Gian Bắt Đầu Môn Học:</Text>
             <Button title="Thời Gian Vào Tiết Học" onPress={this.showDateTimePicker} />
              <DateTimePicker
                mode="time"
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}
              />
            </View>
        </ScrollView>
      </View>
    );
  }
}
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(112, 119, 127, 0.3)',
    alignItems: 'center',
  },
  viewScrollView:{
    paddingTop:15,
    width:WIDTH*0.97,
    height:'auto',
    backgroundColor:'#fff',
    marginVertical:5,
  },
  content:{
     
  },
  lable:{
    marginLeft:20,
    marginVertical:7,
  },
  row:{
    flexDirection:'row',
    width:'100%',
    borderWidth:1,
  },
  viewModalPicker: {
    borderWidth: 1,
    borderColor: '#999',
    marginLeft: 18,
    width:'92%',
    borderRadius:5,
    marginBottom:10,
    fontSize:12,
  },
  selectLabelTextStyle: {
    color: "#000",
    textAlign: "left",
    width: "95%",
    padding: 10,
    flexDirection: "row"
  },
  placeHolderTextStyle: {
    color: "gray",
    padding: 10,
    textAlign: "left",
    width: "95%",
    flexDirection: "row"
  },
  dropDownImageStyle: {
    marginLeft: 10,
    width: 10,
    height: 10,
    alignSelf: "center"
  },
  listTextViewStyle: {
    color: "#000",
    marginVertical: 10,
    flex: 0.9,
    marginLeft: 20,
    marginHorizontal: 10,
    textAlign: "left"
  },
  pickerStyle: {
    fontSize:14,
    marginLeft: 18,
    elevation:2,
    paddingRight: 25,
    marginRight: 10,
    marginBottom: 10,
    shadowOpacity: 1.0,
    shadowOffset: {
      width: 1,
      height: 1
    },
    borderWidth:1,
    borderColor:'#f1f1f1',
    shadowRadius: 10,
    backgroundColor: "rgba(255,255,255,1)",
    shadowColor: "#d3d3d3",
    borderRadius: 5,
    flexDirection: "row"
  }
});
