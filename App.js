import React from 'react';
import Loading from "./Loading";
import * as Location from "expo-location";
import {Alert} from "react-native";
import axios from "axios";
import Weather from './Weather';

const API_KEY = "4a93e6f78f5ddedca8ffbac13b5c1b6c";

export default class extends React.Component{
  state = {
    isLoading: true
  }
  getWeather = async(latitude, longitude) => {
    const {
      data: {
        main: { temp },
        weather
      }
    } = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`);
    console.log(temp);
    console.log(weather);
    this.setState({
      isLoading: false, 
      condition: weather[0].main,
      temp: temp});
  }
  getLocation = async() => {
    try {
      const response = await Location.requestPermissionsAsync();
      const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
      console.log(latitude, longitude);
      this.setState({ isLoading: false});
    } catch(error){
      Alert.alert("Can't find you.", "So sad");
    }
    
  }
  componentDidMount(){
    this.getLocation();
  }

  render(){
    const { isLoading, temp, condition } = this.state;
    return isLoading ? <Loading></Loading> : <Weather condition={condition} temp={Math.round(temp)}/>;
  }
}
