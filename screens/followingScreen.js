import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8EAF6',
    flex: 1
  },

  flatList: {
    flex: 1
  },

  row: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  name: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});


class followingScreen extends Component {
 constructor(props){
 super(props);

 this.state ={
   isLoading: true,
   listOfFollowing: [],
   refreshing: false
 };

}

static navigationOptions = {
  headerShown: false
}

FlatListItemSeparator = () => {
  return(
    <View
      style={{
        height: 2,
        width: "100%",
        backgroundColor: 'white'
      }}
    />
  );
}


//Code to get list of following
getListOfFollowing(){
  //feed in the id of the logged in user into the URL
  return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + global.id + '/following', {
    method: 'GET',
    headers: {
      'X-Authorization': global.token
    }
  })
   .then((response) => response.json())
   .then((responseJson) => {
     this.setState({
       isLoading: false,
       listOfFollowing: responseJson,
       refreshing: false
       });
     })
     .catch((error) => {
       console.log(error);
       });
}


//Function to refresh the flatlist after a chit has been added to it
handleRefresh = () => {
  this.setState({
    refreshing: true,
    listOfFollowing: this.state.listOfFollowing
  }, () => {
    this.getListOfFollowing();
  })
}




componentDidMount(){
  this.getListOfFollowing();
}







  render() {
    if(this.state.isLoading){
      return(
        <View>
         <ActivityIndicator/>
        </View>
       )
    }

  return (
     <View style={styles.container}>
       <FlatList
         style={styles.flatList}
         data={this.state.listOfFollowing}
         keyExtractor={(item, index) => index.toString()}
         refreshing={this.state.refreshing}
         onRefresh={this.handleRefresh}
         ItemSeparatorComponent = { this.FlatListItemSeparator}
         renderItem={({item, index}) => (
         <TouchableOpacity style={styles.row} onPress={() => this.props.navigation.navigate('OtherUser', item)}>
         <View>
           <Text style={styles.name}>{item.given_name} {item.family_name}</Text>
         </View>
         </TouchableOpacity>
        )}
       />
     </View>
   );
 }
}


export default followingScreen
