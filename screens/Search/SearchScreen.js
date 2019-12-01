import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firebase from 'react-native-firebase';
import Global from '../../constants/global/Global';
import OfflineNotice from '../Header/OfflineNotice';

import logoBack from '../../assets/icons/back.png';
import loser from '../../assets/icons/nothing.png';
import gif from '../../assets/icons/search.gif';
import school from '../../assets/icons/school.png';
import goto from '../../assets/icons/icons8-more-than-50.png'

var system = firebase.database ().ref ().child ('Manage_Class');

const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');

export default class SearchScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor (props) {
    super (props);
    this.state = {
      dataResult: [],
      txtSearch: '',
      className: '',
      router: 'HomeScreen',
      count: 0,
      resultFail: false,
      textFail: '',
      textInputSearch: '',
      classExample: {},
      // stateEmpty: true,
    };
    Global.tittle = this.state.tittle;
    Global.router = this.state.router;
  }
  async componentDidMount () {
    this.setState ({resultFail: false});
  }
  async onSearch () {
    await this.setState ({resultFail: false});
    // await this.setState ({stateEmpty: false});

    var dataResult = [];
    var txtSearch_Split = this.state.txtSearch.split (' ');
    await system
      .orderByChild ('class')
      .equalTo (this.state.txtSearch)
      .once ('value', snapshot => {
        if (snapshot.exists ()) {
          snapshot.forEach (doc => {
            dataResult.push ({
              // text:`Kết quả tìm kiếm của ${txtSearch_Split} :`,
              className: doc.toJSON ().className,
            });
          });
          this.setState ({
            dataResult: dataResult.sort ((a, b) => {
              return a.date < b.date;
            }),
            // stateEmpty:false,
            textInputSearch: this.state.txtSearch,
            count: dataResult.length,
            txtSearch: '',

          });
        } else {
          dataResult.push ({
            // img: <Image source={loser} style={{width:200, height:300}}/>,
            textFail: `Không thấy kết quả nào phù hợp với ${this.state.txtSearch}!`,
          });
          this.setState ({
            textInputSearch: this.state.txtSearch,
            // stateEmpty:false,
            resultFail: true,
            txtSearch: '',
          });
        }
      });
  }
  render () {
    const viewFlatList = (
      <FlatList
        data={this.state.dataResult}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              style={styles.viewFlatList}
              onPress={() =>
                this.props.navigation.navigate ('FollowClass', {thamso: item})}
            >
              <View style={{flexDirection: 'row', alignItems: 'center',justifyContent:'space-between',flex:1}}>
                <View>
                <Image source={school} style={{width: 50, height: 50}} />

                </View>
                <View style={{justifyContent:'flex-start',width:WIDTH*0.6}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'normal',
                    }}
                  >
                    {item.className}
                  </Text>
                </View>
                <View>
                <Image source={goto} style={{width: 20, height: 20,tintColor:'#333',marginRight:25}} />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, id) => item.id}
      />
    );
    const viewError = (
      <View style={{flex: 1, alignItems: 'center',justifyContent:'center'}}>
        <Text>
          Không thấy kết quả nào phù hợp với {this.state.textInputSearch}!
        </Text>
        <Image source={loser} style={{width: 171, height: 276,}} />
      </View>
    );
    const viewEmpty = (
      <View>
        <Image source={gif} style={{width: 480, height: 240}} />
        <Text>Hãy nhập tên lớp để tìm kiếm</Text>
      </View>
    );
    // const Empty = this.state.stateEmpty ? viewEmpty : viewResult
    const viewResult = this.state.resultFail ? viewError : viewFlatList;
    const {txtSearch} = this.state;
    return (
      <View style={{flex: 1}}>
        <OfflineNotice />
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.contentChild}>
              <TouchableOpacity
                onPress={() => {
                  // this.props.navigation.navigate (Global.router);
                  this.props.navigation.goBack ();
                }}
                style={{height: 30, width: 30}}
              >
                <Image
                  style={{height: 30, width: 30, tintColor: 'white'}}
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
                  this.setState ({txtSearch: text});
                }}
                // onFocus={() => this.props.onGoToSearch ()}
                onSubmitEditing={this.onSearch.bind (this)}
              />
              <View style={{width: 45}}>
                <Text />
              </View>
            </View>
          </View>

          <View style={{flex: 1}}>
            {viewResult}
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create ({
  topBar: {
    // flexDirection: 'column',
    width: WIDTH * 0.87,
    height: HEIGHT / 12,
    backgroundColor: '#03a9f4',
    paddingTop: (HEIGHT / 12 - HEIGHT / 20) / 2,
    // paddingLeft: 10,
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
    // borderWidth:1,
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
