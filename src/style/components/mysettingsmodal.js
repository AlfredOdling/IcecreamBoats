import React, { Component } from 'react';
import { Dimensions, StyleSheet } from 'react-native';

var styles = StyleSheet.create({
	 modalStyle:{
  	borderWidth: 3,
  	borderColor: '#FFF',
   	alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
    margin: 30,
    top: Dimensions.get('window').width/4.5,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: '#07599D',
    shadowColor: '#888',
    shadowOffset:{width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  modalHeader:{
  	alignSelf: 'center',
  	fontSize: 17, 
  	marginBottom: 10, 
  	marginTop: 10, 
  	color: '#FFF',
    fontWeight: 'bold',
  },
  label:{
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    margin: -5,
  },
  modalExit:{
  	position:'absolute', 
  	right: 0, 
  	marginTop: 10,
  },
  cross:{
    fontSize: 22
  },
  buttonsContainer: {
    flexWrap:'wrap', 
    flexDirection: 'row', 
    alignSelf: 'center'
	},
	button: {
		justifyContent: 'center', 
		width: 90, 
		margin: 10,
		height:40, 
		borderRadius: 20,
		borderWidth: 2,
		borderColor: '#FFF' ,
		backgroundColor: '#07599D',
	},
	 textInput: {
    height: 30,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    margin: 10,
    marginLeft: -5,
    marginRight: -5,
    fontSize: 12,
  },
});
export default styles