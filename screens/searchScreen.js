import React, { Component } from 'react';
import { Text, TextInput, View, Alert, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8EAF6',
    flex: 1
  },

  flatList: {
    flex: 1
  },

  searchInput: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 'auto'
  },

  searchButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#d5f4e6',
    padding: 10,
    marginTop: 0,
    marginLeft: 150,
    width: 100
  },

  row: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  name: {
    fontSize: 15,
    fontWeight: 'bold',
  },

});

class searchScreen extends Component {
 constructor(props){
 super(props);

 this.state ={
   isLoading: true,
   searchQuery: '',
   searchedUsers: []
 };
}

// sets the text value in the state
handleSearchQuery = (searchQuery) => {
  this.setState({searchQuery: searchQuery})
}

//Code to get the users based on what the user has input in the search field
search = () => {
  return fetch("http://10.0.2.2:3333/api/v0.0.5/search_user?q=" + this.state.searchQuery,
   {
     method: 'GET',
     headers: {
       'X-Authorization': global.token
     }
  })
  .then((response) => response.json())
  .then((responseJson) => {
    this.setState({
      isLoading: false,
      searchedUsers: responseJson
      });
    console.log(this.state.searchedUsers);
    })
    .catch((error) => {
      Alert.alert('Unable to find user');
      console.log(error);
      });
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


 render() {
 return (
    <View style={styles.container}>
    <TextInput
      style={styles.searchInput}
      placeholder='Search for a user'
      onChangeText={this.handleSearchQuery} value={this.state.searchQuery}/>

      <TouchableOpacity
       style={styles.searchButton}
       onPress={this.search}
       >
         <Text>Search</Text>
      </TouchableOpacity>

      <FlatList
        data={this.state.searchedUsers}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent = { this.FlatListItemSeparator}
        renderItem={({item, index}) => (
        <TouchableOpacity style={styles.flatList} onPress={() => this.props.navigation.navigate('OtherUser', item)}>
        <View style={styles.row}>
          <Text style={styles.name}>{item.given_name} {item.family_name}</Text>
        </View>
        </TouchableOpacity>
       )}
      />
    </View>
  );
}


}





export default searchScreen
