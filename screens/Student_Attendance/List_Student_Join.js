import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import firebase from 'react-native-firebase';
import Global from '../../constants/global/Global';
import Tittle from '../Header/Tittle';
import samesame from '../../assets/images/samesamemon.jpg';

const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');

export default class List_Student_Join extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor (props) {
    super (props);
    this.state = {
      loading: false,
      refesh: false,
      listStudent:[],
      tittle: 'DANH SÁCH HỌC SINH',
      router: 'HomeScreen',
    };
    const infoClass = this.props.navigation.state.params.infoClass;
    Global.router = this.state.router;
    Global.tittle = infoClass.className;
  }
   componentDidMount(){
    const infoClass = this.props.navigation.state.params.infoClass;
    firebase.database().ref().child('Manage_Class/'+infoClass.key).on('value',value=>{
        if(value.exists())
        {
            Global.siso = value.toJSON().count;
            firebase.database().ref().child('Manage_Class/'+infoClass.key+'/StudentJoin').on('value', async (childSnapshot) => {
                const classRoom = [];
                Global.dathamgia = childSnapshot.numChildren();
                childSnapshot.forEach(x=>{
                    if(x.exists()){
                        classRoom.push({
                            MSSV: x.toJSON().MSSV,
                            email: x.toJSON().email,
                            address: x.toJSON().address,
                            dateBirthday:x.toJSON().dateBirthday,
                            fullName:x.toJSON().fullName,
                            numberPhone:x.toJSON().numberPhone,
                            sex:x.toJSON().sex,
                            avt:x.toJSON().proofs[0]["url"],
                        });
                    }
                    this.setState({listStudent:classRoom});
                });
                });
        }
    })
  }
  refesh () {
    this.setState ({
      refesh: true,
    });
  }
  render () {
    return (
      <View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 34 : 0}}>
        <StatusBar backgroundColor="#03a9f4" barStyle="light-content" />
        <Tittle {...this.props} />
        <ScrollView>
          <View style={{zIndex: 1}}>
            <FlatList
              refreshing={this.state.refesh} // 2 hàm cần thiết để làm fullFresh
              onRefresh={() => {
                this.refesh ();
              }}
              onEndReachedThreshold={-0.2} //2 hàm cần để khi lướt đến cuối trang thì sẽ load thêm dữ liệu :v
              onEndReached={() => {
                this.refesh ();
              }}
              data={this.state.listStudent}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate ('Profile',{infoStudent:item})}
                  >
                    <View style={styles.row}>
                      <View style={styles.left}>
                        <Image
                          style={{
                            width: HEIGHT / 10,
                            height: HEIGHT / 10,
                            borderRadius: HEIGHT / 20,
                          }}
                          source={samesame}
                        />
                      </View>
                      <View style={styles.right}>
                       
                      <Text style={{fontSize: 14, fontWeight: '600'}}>
                          MSSV : {item.MSSV}
                        </Text>
                        <Text style={{fontSize: 14, fontWeight: '600'}}>
                          Email : {item.email}
                        </Text>
                        {/* <Text style={{fontSize: 14, fontWeight: '600'}}>
                          Name : {item.fullName}
                        </Text> */}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item, id) => item.id}
            />
          </View>
        </ScrollView>
        <View style={styles.viewResult}>
          <View style={styles.viewResultChild}>
            <Text style={styles.textResult}>Sĩ Số :{Global.siso}</Text>
            <Text style={styles.textResult}>
              Đã tham gia: {Global.dathamgia}
            </Text>
          </View>
          <View style={styles.viewResultChild}>
            <Text style={styles.textResult}>
              Chưa tham gia : {Global.siso - Global.dathamgia}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create ({
  row: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    height: HEIGHT / 8,
    color: 'red',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    height: HEIGHT / 10,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    flex: 2,
    height: HEIGHT / 10,
    width: 'auto',
    justifyContent: 'center',
    marginLeft: 15,
  },
  viewResult: {
    zIndex: 10,
    backgroundColor: '#4bacb8',
    height: HEIGHT / 9,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  textResult: {
    marginVertical: 5, 
    fontSize: 15,
    width: WIDTH * 0.4
    },
  viewResultChild: {
    flexDirection: 'row', 
    marginHorizontal: WIDTH / 14
    },
});
