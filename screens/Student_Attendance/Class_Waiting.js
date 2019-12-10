import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Global from '../../constants/global/Global';
import search from '../../assets/icons/icons8-search-96.png';
import filter from '../../assets/icons/icons8-filter-96.png';
import school from '../../assets/icons/icons8-abc-96.png';
import Tittle from '../Header/Tittle';

const { width: WIDTH } = Dimensions.get('window');
const { height: HEIGHT } = Dimensions.get('window');

class FlatListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <View style={style.viewOneClass}>
        <TouchableOpacity style={style.viewFlatList} onPress={()=>this.props.navigation.navigate('List_Student_Join',{infoClass:this.props.item})}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1, }}>
            <View style={{ width: 50, height: 50, borderWidth: 0, borderRadius: 999, alignItems: 'center', justifyContent: 'center', }}>
              <Image source={school} style={{ width: 50, height: 50 }} />
            </View>
            <View style={{ justifyContent: 'flex-start', width: WIDTH * 0.8, borderWidth: 0, paddingLeft: 30, }}>
              <Text style={{ fontSize: 14, fontWeight: '700', opacity: .7, }}>
                {this.props.item.className}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '700', fontStyle: 'italic', color: '#448aff', }}>
                {this.props.item.teacher}
              </Text>
              <Text style={{ fontSize: 12, color: '#455a64', fontStyle: 'italic' }}>{this.props.item.dateStart} :  {this.props.item.dateFinish}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
const style = StyleSheet.create({
  viewOneClass: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
    width: WIDTH * 0.97,
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

export default class Class_Waiting extends Component {
  static navigationOptions = {
    header: null,
  };
  state = { currentUser: null };
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      class: [],
      classDone: [],
      isChecked:0,
      router: 'HomeScreen',
      tittle: 'DANH SÁCH LỚP ĐANG CHỜ',
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
                    arr.push({ className: value.toJSON().className ,
                              key:element.key,
                              dateFinish:value.toJSON().dateFinish,
                              dateStart:value.toJSON().dateStart,
                              teacher: value.toJSON().teacher,
                              
                              });
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
      console.log('in ra mssv', this.state.userData.MSSV)
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <Tittle {...this.props} />
        <View style={styles.viewCreateClass}>
          <TouchableOpacity style={{ marginRight: 10 }} underlayColor="tomato" onPress={this.onPressAdd}>
            <Image style={{ tintColor: 'blue', width: 30, height: 30 }} source={filter} />
          </TouchableOpacity>
          <TextInput
            style={styles.viewTextInput}
            keyboardType="default"
            placeholderTextColor="gray"
            fontStyle="italic"
            placeholder="Hãy nhập gì đó "
            autoCapitalize="none"
            onChangeText={text => {
              this.setState({ txtSearch: text });
            }}
            value={this.state.txtSearch}
            onSelectionChange={() => this.onSearchNew()}
          />
          <TouchableOpacity
            style={{ marginRight: 10 }}
            underlayColor="tomato"
            onPress={this.onPressAdd}
          >
            <Image style={{ width: 30, height: 30 }} source={search} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.classDone}
          style={{ marginVertical: 6, }}
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
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(112, 119, 127, 0.3)',
    alignItems: 'center',
  },
  viewTextInput: {
    height: 40,
    width: WIDTH * 0.65,
    margin: 10,
    padding: 10,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 5,
  },
  viewCreateClass: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 64,
    paddingHorizontal: 20,
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 0,
    backgroundColor: '#fff'
  },
});
