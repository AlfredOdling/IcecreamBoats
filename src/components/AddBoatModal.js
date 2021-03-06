import React, { Component } from 'react';
import { Modal, Text, View, Button, TextInput } from 'react-native';
import * as firebase from 'firebase';
//import styles from '../style/components/addpositionmodal'
import styles from '../style/components/addboatmodal'
import gstyles from '../style/styles'

  export default class AddBoatModal extends Component {

  componentWillMount() {
    this.closeModal = this.closeModal.bind(this)
    this.isMount = true;
    this.state = {
      modalVisible: false,
      name: '',
      phone: '',
      region: '',
      fromTo: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.editBoat) {
      this.loadFirebaseData(nextProps.editBoat)
    }
  }

  loadFirebaseData(ownerName) {
    firebase.database().ref('boats').once('value', (snapshot) => {
      if (this.isMount){
        let snapValue = snapshot.exportVal()
        
        let name = snapValue[ownerName].name
        let phone = snapValue[ownerName].phone
        let region = snapValue[ownerName].region
        let fromTo = snapValue[ownerName].fromTo

        this.setState({
          name,
          phone,
          region,
          fromTo
        })
        this.setModalVisible(true)
        this.props.clearState()
      } 
    })
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  uploadData() {
    const { name, phone, region, fromTo } = this.state
    let longitude = 1.2323
    let latitude = 2.2323 // TODO: What to do Alfred?

    firebase.database().ref('boats/' + name).set({
      name,
			phone,
			region,
			isOut: false,
      latitude,
      longitude,
      fromTo
    }).then(() => {
      if(this.isMount){
        this.setState({});
      this.setModalVisible(false)
      }
    }, (error) => {
      console.log('error', error);
    })
  }

  closeModal() {
    this.isMount = false;
    this.setState({});
    this.setModalVisible(false);
  }

  render() {
    return (
      <View style={gstyles.view}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={gstyles.view}>
          <View>
            <Button
              onPress={this.closeModal}
              title="Stäng"
              color="#e41e13"/>

            <Text>Namn på förare</Text>
              <TextInput
                style={gstyles.textInput}
                onChangeText={(text) => this.setState({name: text})}
                value={this.state.name}
                />
              <Text>Telefon</Text>
              <TextInput
                style={gstyles.textInput}
                onChangeText={(text) => this.setState({phone: text})}
                value={this.state.phone}
                />
              <Text>Region</Text>
              <TextInput
                style={gstyles.textInput}
                onChangeText={(text) => this.setState({region: text})}
                value={this.state.region}
                />

              <Text>Sträcka</Text>
                <TextInput
                  style={gstyles.textInput}
                  onChangeText={(text) => this.setState({fromTo: text})}
                  value={this.state.fromTo}
                  />
              <Button
                onPress={()=>{ this.uploadData() }}
                title="Ladda upp"
                color="#e41e13"/>

          </View>
         </View>
        </Modal>

        <Button
          onPress={()=>{ this.setModalVisible(true) }}
          title="Lägg till båt"
          color="#e41e13"/>

      </View>
    );
  }
}
