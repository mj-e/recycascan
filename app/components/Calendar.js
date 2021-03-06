import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, AsyncStorage, Image } from 'react-native';
import axios from 'axios';
import moment from 'moment';

export default class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collections: [],
      userDetails: {}
    };
    this.getCollections = this.getCollections.bind(this);
    this.getTimeStamp = this.getTimeStamp.bind(this);
  }

  componentDidMount() {
    AsyncStorage.getItem('userDetails', (err, result) => {
      let val = JSON.parse(result);
      this.setState({
        userDetails: val
      });
      if (val !== null) this.getCollections(val.council);
    });
  }

  getCollections (council) {
    axios
      .get(`https://vast-eyrie-43528.herokuapp.com/api/collections?council=${council}`)
      .then((res) => {
        this.getTimeStamp(res.data.collections);
      })
      .catch((err) => {
        alert(err);
      });
  }

  getTimeStamp (collections) {
    let futureBins = [];
    collections.map((collection, i) => {
      let collectionTimestamp = moment(`${collection.day} ${collection.month} ${collection.year} 24:00`, 'DD MMMM YYYY HH:mm').format('X');
      if (collectionTimestamp > moment().format('X')) {
        futureBins.push(collection);
        this.setState({
          collections: futureBins
        });
      }
    });
  }

  render() {
    if (this.state.userDetails === null) return (
      <View style={styles.container}>
        <Image style={styles.logoError} source={require('../images/recycascan.png')}/>
        <Text style={styles.titleError}>Please enter a postcode</Text>
      </View>
    );
    return (
      <ScrollView>
        <View style={styles.container}>
          <Image style={styles.logo} source={require('../images/recycascan.png')}/>
          <Text style={styles.council}>{this.state.userDetails.council} bin collections</Text>
            {this.state.collections.map((collection, key) => {
                return (
                  <View key={key}>
                    <Text style={styles.date}>
                      {collection.day.toString()} {collection.month.toString()} {collection.year.toString()}
                    </Text>
                    <View style={styles.imageView}>
                    {collection.bins.map((bin, i) => {
                      return (
                        <Image key={i} style={styles.binImage} source={{ uri: bin }}/>
                      );
                    })}
                    </View>
                  </View>
                );
              })}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  containerError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddf4c5'
  },
  date: {
    paddingTop: 10,
    paddingBottom: 20,
    fontSize: 20,
    color: '#004400',
    textAlign: 'center'
  },
  titleError: {
    marginBottom: 30,
    fontSize: 20,
    color: '#004400',
  },
  bins: {
    color: 'blue'
  },
  binImage: {
    height: 150,
    width: 97.5,
    marginRight: 8,
    marginLeft: 8
  },
  imageView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 30
  },
  council: {
    paddingTop: 20,
    paddingBottom: 10,
    fontSize: 20,
    color: '#004400',
    fontWeight: 'bold'
  },
  logo: {
    marginTop: 30,
    width: 100,
    height: 50
  },
  logoError: {
    marginTop: 30,
    marginBottom: 30,
    width: 100,
    height: 50
  },
});
