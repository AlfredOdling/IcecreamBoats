import React, { Component } from 'react';
import { View } from 'react-native';
import * as firebase from 'firebase';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import { postToArea } from '../utils/notifications';

export default class BackGeo extends Component {
  componentWillMount() {
    BackgroundGeolocation.configure({
      desiredAccuracy: 10,
      stationaryRadius: 1,
      distanceFilter: 50,
      locationTimeout: 30,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      debug: true,
      startOnBoot: false,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.provider.ANDROID_ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false
    });

    BackgroundGeolocation.on('location', (location) => {
      //handle your locations here
      this.upload(location);
    });

    BackgroundGeolocation.on('stationary', (stationaryLocation) => {
      //handle stationary locations here
      this.upload(stationaryLocation);
    });

    BackgroundGeolocation.on('error', (error) => {
      alert('[ERROR] BackgroundGeolocation error:'+JSON.stringify(error));
    });

    BackgroundGeolocation.start(() => {
      alert('[DEBUG] BackgroundGeolocation started successfully');    
    });
  }

  upload(location) {
    //postToArea('Här kommer glassen', location.latitude, location.longitude, 0.000001818511515079166);
    firebase.database().ref('boats/Jonas').update({
      latitude: location.latitude,
      longitude: location.longitude,
    });
  }

  render() {
    return (<View></View>);
  }
}
