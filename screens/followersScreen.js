import React, { Component } from 'react';
import { Text, TextInput, View, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, FlatList } from 'react-native';


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


class followersScreen extends Component {
 constructor(props){
 super(props);

 this.state ={
   isLoading: true,
   listOfFollowers: [],
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


//Code to get list of followers
getListOfFollowers(){
  return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + global.id + '/followers', {
    method: 'GET',
    headers: {
      'X-Authorization': global.token
    }
  })
   .then((response) => response.json())
   .then((responseJson) => {
     this.setState({
       isLoading: false,
       listOfFollowers: responseJson,
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
    listOfFollowers: this.state.listOfFollowers
  }, () => {
    this.getListOfFollowers();
  })
}



componentDidMount(){
  this.getListOfFollowers();
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
        data={this.state.listOfFollowers}
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


export default followersScreen
