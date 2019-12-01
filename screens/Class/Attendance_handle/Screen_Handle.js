import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  TextInput,
  Image,
  FlatList,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  ScrollView,
  NativeModules,
} from 'react-native';
// import Video from 'react-native-video';
var ImagePicker = NativeModules.ImageCropPicker;

import Global from '../../../constants/global/Global';
import Tittle from '../../Header/Tittle';
import icons_list from '../../../assets/icons/icon_list.png';
import camera from '../../../assets/icons/icons8-compact-camera-96.png';
import img from '../../../assets/icons/icons8-full-image-96.png';

const {width: WIDTH} = Dimensions.get ('window');
const {height: HEIGHT} = Dimensions.get ('window');

export default class CreateClass extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor () {
    super ();
    this.state = {
      image: null,
      images: null,
      tittle: '',
      router:'ListClass',
      
    };
    const idType = this.props.navigation.state.params.thamso;
    
    Global.tittle = idType.className;
    Global.router = this.state.router;

  }

  pickSingleWithCamera (cropping, mediaType = 'photo') {
    ImagePicker.openCamera ({
      cropping: cropping,
      width: 500,
      height: 500,
      includeExif: true,
      mediaType,
    })
      .then (image => {
        console.log ('received image', image);
        this.setState ({
          image: {
            uri: image.path,
            width: image.width,
            height: image.height,
            mime: image.mime,
          },
          images: null,
        });
      })
      .catch (e => alert (e));
  }
  pickSingle (cropit, circular = false, mediaType = 'photo') {
    ImagePicker.openPicker ({
      width: 500,
      height: 500,
      includeExif: true,
    })
      .then (image => {
        console.log ('received image', image);
        this.setState ({
          image: {
            uri: image.path,
            width: image.width,
            height: image.height,
            mime: image.mime,
          },
          images: null,
        });
      })
      .catch (e => {
        console.log (e);
        Alert.alert (e.message ? e.message : e);
      });
  }
  pickMultiple () {
    ImagePicker.openPicker ({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
    })
      .then (images => {
        this.setState ({
          image: null,
          images: images.map (i => {
            console.log ('received image', i);
            return {
              uri: i.path,
              width: i.width,
              height: i.height,
              mime: i.mime,
            };
          }),
        });
      })
      .catch (e => alert (e));
  }

  onPressAdd = () => {
    if (this.state.newClassName.trim () === '') {
      alert ('class name is blank');
      return;
    }
    try {
      system.push ({
        className: this.state.newClassName,
      });
    } catch (e) {
      alert (e);
    }
  };
  onGoToDetail = () => {
    const {className} = this.state.class;
    if (this.state.newClassName != '') {
      alert (this.state.newClassName);
      this.props.navigation.navigate ('CLASS_DETAILS', {
        thamso: this.state.newClassName,
      });
    }
  };
  refesh () {
    this.setState ({
      refesh: true,
    });
  }
  render () {
    const viewHiden = (
      <View style={styles.viewHiden}>
        <View style={styles.viewImg}>
          <Image
            source={this.state.image}
            style={{height: HEIGHT / 3, width: WIDTH - 10}}
          />
        </View>

        <View style={styles.viewButton}>
          <TouchableHighlight
            style={styles.follow}
            onPress={() => this.props.navigation.navigate ('FollowClass')}
          >
            <Text style={{color: 'white', fontSize: 16}}>
              Trở Về
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.follow}
            onPress={() => this.props.navigation.navigate ('FollowClass')}
          >

            <Text style={{color: 'white', fontSize: 16}}>
              Điểm Danh 
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
    const checkView = this.state.image ? viewHiden : <View />;
    // const productImageHeight = HEIGHT * 0.33;
    // const productWidth = productImageHeight * this.state.image.width / this.state.image.height;
    return (
      <View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 34 : 0}}>
        <StatusBar backgroundColor="#03a9f4" barStyle="light-content" />
        <Tittle {...this.props}/>
        <View style={styles.addClass}>
          <TouchableHighlight
            onPress={() => this.props.navigation.navigate ('Attendance')}
          >
            <View style={styles.rowCreateClass}>
              <View style={styles.viewImgIcon}>
                <Image source={icons_list} style={{height: 45, width: 45}} />
              </View>
              <View style={styles.viewText}>
                <Text style={styles.textDirector}>
                  Xem Danh Sách Sinh Viên
                </Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.addClass}>
          <TouchableHighlight
            // onPress={() => this.props.navigation.navigate ('CAMERA')}
            onPress={() => this.pickSingleWithCamera (false)}
          >
            <View style={styles.rowCreateClass}>
              <View style={styles.viewImgIcon}>
                <Image source={camera} style={{height: 45, width: 45}} />
              </View>
              <View style={styles.viewText}>
                <Text style={styles.textDirector}>
                  Điểm Danh Bằng Camera
                </Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.addClass}>
          <TouchableHighlight
            // onPress={() => this.props.navigation.navigate ('CAMERA')}
            onPress={this.pickSingle.bind (this)}
          >
            <View style={styles.rowCreateClass}>
              <View style={styles.viewImgIcon}>
                <Image source={img} style={{height: 45, width: 45}} />
              </View>
              <View style={styles.viewText}>
                <Text style={styles.textDirector}>
                  Điểm Danh Bằng Hình Ảnh
                </Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
        {checkView}

      </View>
    );
  }
}
const styles = StyleSheet.create ({
  rowCreateClass: {
    flexDirection: 'row',
    height: HEIGHT / 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingLeft: 20,
    backgroundColor: '#f1f1f1',
  },
  viewImgIcon: {
    justifyContent: 'center',
  },
  viewText: {
    height: HEIGHT / 10,
    justifyContent: 'center',
  },
  textDirector: {
    fontSize: 15,
    fontWeight: 'normal',
    margin: 10,
    paddingLeft: 10,
    position: 'absolute',
  },
  viewHiden: {
    height: HEIGHT * 0.6,
    width: WIDTH,
    alignItems: 'center',
  },
  viewImg: {
    height: HEIGHT / 3 + 10,
    width: WIDTH - 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:10,
  },
  follow: {
    height: 43,
    backgroundColor: '#039be5',
    borderColor: '#039be5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH * 0.35,
    marginHorizontal: 10,
    marginVertical: 15,
  },
});
