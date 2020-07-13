import React, { Component } from 'react';
import { Text, TextInput, View, TouchableOpacity, StyleSheet, Alert } from 'react-native';



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8EAF6',
    flex: 1
  },
  emailLabel: {
    padding: 8,
    paddingTop: 150,
    alignSelf: 'center'
  },

  passwordLabel: {
    padding: 8,
    paddingTop: 10,
    alignSelf: 'center'
  },

  inputEmail: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 5,
    width: 200,
    alignSelf: 'center',
    borderRadius: 10
  },

  inputPassword: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 5,
    width: 200,
    alignSelf: 'center',
    borderRadius: 10
  },

  loginButton: {
    backgroundColor: '#d5f4e6',
    alignItems: 'center',
    width: 150,
    padding: 10,
    marginTop: 25,
    alignSelf: 'center',
    borderRadius: 10
  },

  createAccountText: {
    color: 'blue',
    padding: 8,
    paddingTop: 20,
    alignSelf: 'baseline',
    marginLeft: 90,
    flexWrap: 'wrap'
  }
});



class loginScreen extends Component {
 constructor(props){
 super(props);

 this.state={
   email: '',
   password: '',
   id: '',
   token: ''
  };
 }


 // sets the text value in the state
 handleEmailInput = (email) => {
   this.setState({email: email})
 }

 handlePasswordInput = (password) => {
   this.setState({password: password})
 }


//Code to log a user in
login = () => {
  return fetch("http://10.0.2.2:3333/api/v0.0.5/login",
   {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       email: this.state.email,
       password: this.state.password
     })
  })

  .then((response) => {
    return response.json();
  })
  .then((responseJson) => {
    //Set the state values as the JSON equivalent, and then set
    //these values as the values in the global folder to be used
    //in all screens at any time
    this.setState({
      id: responseJson.id,
      token: responseJson.token,
      });
      global.id = this.state.id;
      global.token = this.state.token;
      this.props.navigation.navigate('Home')
  })

  //If the user inputs the incorrect details,
  //load the login page again
  .catch((error) => {
    if (error) {
      this.props.navigation.navigate('Login')
      Alert.alert("Incorrect details! Try again.")
    }

  });
}






 render() {
 return (
    <View style={styles.container}>
      <Text style={styles.emailLabel}>Email:</Text>
      <TextInput
        style={styles.inputEmail}
        placeholder='e.g. zameel@hotmail.co.uk'
        onChangeText={this.handleEmailInput} value={this.state.email}/>

      <Text style={styles.passwordLabel}>Password:</Text>
      <TextInput
       style={styles.inputPassword}
       placeholder='Any character'
       onChangeText={this.handlePasswordInput} value={this.state.password}
       secureTextEntry={true}/>

       <TouchableOpacity
        style={styles.loginButton}
        onPress={this.login}
        >
          <Text>Login</Text>
       </TouchableOpacity>

        <Text
        style={styles.createAccountText}
        onPress={() => this.props.navigation.navigate('CreateAccount')}
        >Not signed up? Create new account</Text>
    </View>
   );
 }

}



export default loginScreen
