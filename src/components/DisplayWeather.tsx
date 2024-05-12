import React, { useEffect, useState } from 'react'
import { MainWrapper } from './style.module'
import { AiOutlineSearch } from "react-icons/ai";
import { WiHumidity } from "react-icons/wi";
import { SiTailwindcss } from "react-icons/si";
import { BsFillSunFill,BsCloudyFill,BsFillCloudRainFill,BsCloudFog2Fill } from "react-icons/bs";
import { RiLoaderFill } from "react-icons/ri";
import { TiWeatherPartlySunny } from "react-icons/ti";
import axios from 'axios'

interface WeatherDataProps {
    name:string;

    main:{
        temp:number;
        humidity:number;
    };
    sys:{
        country:string;
    };
    weather:{
        main:string;
    }[];
    wind:{
        speed:number;
    }
}

const DisplayWeather = () => {

    const api_key="0cc86d16bf572f78cdc96c096c7627e5"
    const api_Endpoint="https://api.openweathermap.org/data/2.5/"

    const [weatherData,setWeatherData]=useState<WeatherDataProps | null>(null)

    const [isLoading,setIsLoading]=useState(false)

    const [searchCity,setSearchCity]=useState('')

    const fetchCurrentWeather=async(lat:number,lon:number)=>{
        const url=`${api_Endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`
        const response=await axios.get(url)
        return response.data
    }

    const fetchWeatherData=async(city:string)=>{
        try {
            const url=`${api_Endpoint}weather?q=${city}&appid=${api_key}&units=metric`
            const searchResponse=await axios.get(url)

            const currentSearchResults:WeatherDataProps=searchResponse.data;
            return {currentSearchResults}

        } catch (error) {
            console.error('Data not found')
            throw error;
        }
    }


    const handleSearch=async()=>{
        if(searchCity.trim() == ''){
            return
        }
        try {
            const { currentSearchResults }=await fetchWeatherData(searchCity);
            setWeatherData(currentSearchResults)
        } catch (error) {
            console.log('No results found')
        }
    }

    const iconChanger=(weather:string)=>{
        let iconElement:React.ReactNode;
        let iconColor:string;

        switch(weather){
            case 'Rain':
                iconElement = <BsFillCloudRainFill/>
                iconColor='#272829';
                break;
            case 'Clear':
                iconElement = <BsFillSunFill/>
                iconColor='#FFC436';
                break;
            case 'Cloud':
                iconElement = <BsCloudyFill/>
                iconColor='#102C57';
                break;
            case 'Mist':
                iconElement = <BsCloudFog2Fill/>
                iconColor='#279EFF';
                break;
            default: 
               iconElement = <TiWeatherPartlySunny/>
               iconColor='#7B2869'
        }

        return (
            <span className='icon' style={{color:iconColor}}>
                {iconElement}
            </span>
        )
    }

    useEffect(()=>{
        const fetchData = async () => {
            navigator.geolocation.getCurrentPosition(async (position) => {
              const { latitude, longitude } = position.coords;
              const [currentWeather] = await Promise.all([fetchCurrentWeather(latitude, longitude)]);
              setWeatherData(currentWeather);
              setIsLoading(true);
            });
          };
      
          fetchData();
        }, []);

    return (<>
        <MainWrapper>
            <div className="container">
                <div className="searchArea">
                    <input type="text" placeholder='Enter a city..' value={searchCity} onChange={(e)=>setSearchCity(e.target.value)}/>
                    <div className="searchCircle">
                        <AiOutlineSearch className='searchIcon' onClick={handleSearch}/>
                    </div>
                </div>

        {weatherData && isLoading ? (
            <>
             <div className="weatherArea">
                    <h1>{weatherData.name}</h1>
                    <span>{weatherData.sys.country}</span>
                    <div className="icon">
                        {iconChanger(weatherData.weather[0].main)}
                    </div>
                    <h1>{weatherData.main.temp.toFixed(0)}</h1>
                    <h2>{weatherData.weather[0].main}</h2>
                </div>

                <div className="bottomInfoArea">
                    <div className="humidityLevel">
                        <WiHumidity className='icon' />
                        <div className="humidInfo">
                            <h2>{weatherData.main.humidity} </h2>
                            <p>Humidity</p>
                        </div>
                    </div>
                    <div className="wind">
                        <SiTailwindcss className='windIcon' />
                        <div className="humidInfo">
                            <h2>{weatherData.wind.speed}km/hr </h2>
                            <p>wind speed</p>
                        </div>
                    </div>
                </div>
            </>
        ):(
            <div className="loading">
                <RiLoaderFill className='loadingIcon'/>
                <p>loading</p>
            </div>
        )}
               
            </div>
        </MainWrapper>
    </>

    )
}

export default DisplayWeather