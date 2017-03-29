import React, { Component } from 'react';
import MapView from 'react-native-maps';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Animated,
  PanResponder,
  Button
} from 'react-native';
import * as firebase from 'firebase';

import {generate} from '../utils/randomstring';
import {uploadUserLocation} from '../utils/location';


class Overlay extends Component {
  constructor(props) {
    super(props);

    this.state = {id:''};

    this.sendPosition.bind(this);
  }

  sendPosition() {
    // to be implemented
    var id;
    var time = new Date().getTime();

    if (this.state.id === '') {
      id = generate(32);
      this.setState({id: id});
    } else {
      id = this.state.id;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        uploadUserLocation(id, position.coords.latitude, position.coords.longitude, time);
      },
      (error) => alert(JSON.stringify(error))
      //{enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
    );

    

    
  }

  render() {
    return (
      <View style={styles.overlay}>
        <Button
          onPress={this.sendPosition.bind(this)}
          title="Jag vill ha glass"
          accessibilityLabel="Nu kommer vi"
        />
      </View>
    );
  }
}

export default class MapScene extends Component {

  constructor(props) {
    super(props);
    this.state = {
      boats: {},
    };

    firebase.database().ref('boats').on('value', (snapshot) => {
      this.setState({boats: snapshot.exportVal()});
    });
  }

  render() {
    return (
      <View style={styles.MapScene} >
        <Text></Text>
        <MapView 
            style={styles.map}
            ref={(map) => {this.map = map;}}
            region={{
              latitude: 57.653263,
              longitude: 11.777580,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }} >
            
          {Object.keys(this.state.boats).map((name, index) => (
            <MapView.Marker
              draggable
              coordinate={toLatLang(this.state.boats[name])}
              title={this.state.boats[name].boatname}
              key={this.state.boats[name].boatname} >
              {/*<MapView.Callout>
                <Text style={{width: 50, height: 50}}>{this.state.firebase[name].boatname}</Text>
              </MapView.Callout>*/}
            </MapView.Marker>
          ))}
          </MapView>
        <Overlay />
      </View>
    );
  }
}

function toLatLang(object) {
  return {
    latitude: object.latitude,
    longitude: object.longitude,
  };
}

var styles = StyleSheet.create({
  map: {
    flex: 1
  },
  MapScene: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: '#f9f9f9',
    height: 200,
  },
});