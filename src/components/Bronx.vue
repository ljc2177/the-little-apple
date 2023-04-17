<template>
  <div id="container">
    <div id="map">
    </div>
    <div id="controls">
      <router-link to="/"><img src="@/assets/LittleAppleLogo.png"></router-link>
      <div id="results">
        <pre><h2>{{ locationInfo }}</h2></pre>
      </div>
      <button :style="buttonStyle">Confirm Choices</button>
      <h3>Land Type</h3>
      <div id="buttons">
        <button id="os" :style="buttonStyle2">Open Spaces</button>
        <button id="vl" :style="buttonStyle2">Vacant Lots</button>
        <button id="upl" :style="buttonStyle2">Unlicensed Parking Lots</button>
      </div>
      <h3>Total Area</h3>
      <vue-slider v-model="area" id="area" :min="0" :max="530" :range="true" :style="sliderStyle" :railStyle="dotStyle" :processStyle="railStyle" :tooltipStyle="railStyle" :labelStyle="railStyle"></vue-slider>
      <h3>Daily Sunlight</h3>
      <vue-slider v-model="sunlight" :min="0" :max="15" :range="true" :style="sliderStyle" :railStyle="dotStyle" :processStyle="railStyle" :tooltipStyle="railStyle" :labelStyle="railStyle"></vue-slider>
      <h3>Proximity to Highways</h3>
      <vue-slider v-model="highways" :min="0" :max="11733" :range="true" :style="sliderStyle" :railStyle="dotStyle" :processStyle="railStyle" :tooltipStyle="railStyle" :labelStyle="railStyle"></vue-slider>
      <h3>Proximity to Food Insecurity</h3>
      <vue-slider v-model="foodins" :min="0" :max="19650" :range="true" :style="sliderStyle" :railStyle="dotStyle" :processStyle="railStyle" :tooltipStyle="railStyle" :labelStyle="railStyle"></vue-slider>
      <h3>Proximity to Low Income Households</h3>
      <vue-slider v-model="lowinc" :min="0" :max="16598" :range="true" :style="sliderStyle" :railStyle="dotStyle" :processStyle="railStyle" :tooltipStyle="railStyle" :labelStyle="railStyle"></vue-slider>
    </div>
  </div>
</template>

<script>
import Mapbox from "mapbox-gl";
import mapboxgl from 'mapbox-gl';
import { MglMap } from "vue-mapbox";
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

export default {
  name: 'App',
  data() {
    return {
      locationInfo: "Locations Added: \nOpen Space Lost: \nIndividuals Served: \n(XX% food insecure)",
      buttonImage: require('@/assets/ButtonBG.png'),
      buttonHover: require('@/assets/ButtonHOV.png'),
      accessToken: "pk.eyJ1IjoibGpjMjE3NyIsImEiOiJjbDRvemp0azEwMTd3M2NwOTl2bGk5M3YxIn0.Nyn7KWoueXzgl1mYurECiw",
      mapStyle: "mapbox://styles/ljc2177/clgi4m0yl010s01pps25n40is",
      map: '#map',
      area: [0,530],
      sunlight: [0,15],
      highways: [0,11733],
      foodins: [0,19650],
      lowinc: [0,16598]
    };
  },
  components: {
    MglMap,
    VueSlider
  },
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibGpjMjE3NyIsImEiOiJjbDRvemp0azEwMTd3M2NwOTl2bGk5M3YxIn0.Nyn7KWoueXzgl1mYurECiw'

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/ljc2177/clgi4m0yl010s01pps25n40is',
    })

    const filterLayers = ['ezyzip-bvkq7a'];

    const filterData = {
      'Acres': this.area,
      'Sun_Hours': this.sunlight,
      'Highway_D': this.highways,
      'FoodIns_D': this.foodins,
      'AtPov_D': this.lowinc,
    };

    // Update the filter expression of the area layer and sunlight layer
    const updateFilter = () => {
      const filterExpression = ['all'];
      for (const [key, value] of Object.entries(filterData)) {
        filterExpression.push(['>=', ['get', key], value[0]], ['<=', ['get', key], value[1]]);
      }
      map.setFilter(filterLayers[0], filterExpression);
      console.log(filterData);

      const visibleFeatures = map.queryRenderedFeatures({
        layers: filterLayers,
        filter: map.getFilter(filterLayers[0])
      });

      console.log(visibleFeatures);
    };

    this.$watch('area', () => {
      filterData['Acres'] = this.area;
      updateFilter();
    });

    this.$watch('sunlight', () => {
      filterData['Sun_Hours'] = this.sunlight;
      updateFilter();
    });

    this.$watch('highways', () => {
      filterData['Highway_D'] = this.highways;
      updateFilter();
    });

    this.$watch('foodins', () => {
      filterData['FoodIns_D'] = this.foodins;
      updateFilter();
    });

    this.$watch('lowinc', () => {
      filterData['AtPov_D'] = this.lowinc;
      updateFilter();
    });

  },
  computed: {
    buttonStyle() {
      return {
        'background-image': `url(${this.buttonImage})`,
        'background-size': 'cover',
        'background-position': 'center',
      };
    },
    buttonStyle2() {
      return {
        'background-color': 'transparent',
        'border': 'solid',
        'border-color': '#4caf50',
        'border-radius': '0.5rem',
        'float': 'left',
        'height': '5vh',
        'width': '7vw',
        'text-align': 'center',
        'padding': '0',
        'color': 'black',
        'margin-left': '0.5vw',
        'font-size': '1.1vh'
      };
    },
    sliderStyle() {
      return {
        'width': '20vw',
        'height': '1vh',
        'padding': '0px',
      };
    },
    dotStyle() {
      return {
        'background-color': 'rgb(210, 239, 210)',
      };
    },
    railStyle() {
      return {
        'background-color': '#4caf50',
        'font-family': 'roboto',
      };
    },
  },

  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox;
  }
}
</script>

<style scoped>
@font-face {
    font-family: roboto;
    src: url('~@/assets/fonts/Roboto-Regular.ttf');
}

@font-face {
    font-family: roboto-mono;
    src: url('~@/assets/fonts/RobotoMono-Regular.ttf');
}

@font-face {
    font-family: roboto-condensed;
    src: url('~@/assets/fonts/Roboto-Condensed.ttf');
}

#container {
  display: flex;
  position: absolute;
  margin-left: 10px;
  flex-direction: column;
  align-items: left;
  justify-content: left;
  width: 95vw;
  height: 92vh;
  background-color: none;
  border-radius: 1rem;
  box-shadow: 3px 3px grey;
}

#map {
  height: 100%;
  width: 100%;
  border-radius: 1rem;
  overflow: hidden;
  justify-content: center;
  align-items: center;
}

#buttons {
  display: inline-block;
}

#buttonHover:hover {
  background-color: #4caf50;
  color: white;
}

#controls {
  display: flex;
  position: absolute;
  flex-direction: column;
  align-items: center;
  justify-content: left;
  width: 27vw;
  height: 92vh;
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 3px 3px grey;
  z-index: 900;
}

#results{
  height: 8vw;
  width: 23vw;
  margin-top: 2vh;
  background-color: rgb(210, 239, 210);
  padding: none;
  border-radius: 1rem;
  box-shadow: 3px 3px grey;
  z-index: 900;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-family: roboto-mono;
}

h2 {
  font-size: 1.25vw;
  font-weight: bold;
  padding-left: 1vw;
  text-align: left;
  font-family: roboto;
}

h3 {
  font-size: 1.05vw;
  font-weight: bold;
  padding-left: 1vw;
  text-align: left;
  padding-bottom: 0px;
  padding-top: 1vh;
  font-family: roboto;
}

p {
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
  margin-left: 3.5rem;
  margin-right: 3.5rem;
  font-family: roboto;
}

button {
  padding: 1vw 1.5vw;
  margin-top: 1.5vh;
  font-family: roboto;
  font-size: 1.5vh;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 0.25vw;
  cursor: pointer;
}

button:hover{
  background-color: transparent;
}

img {
  padding-top: 2rem;
  width: 20vw;
}
</style>
