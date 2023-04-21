<template>
  <div id="container">
    <div id="highlighted-div" v-if="showTour"></div>
      <div id="tour" ref="tour" v-if="showTour">
        <div v-for="(message, index) in messages" :key="index" v-show="currentMessage === index">
          <h4>{{ message.title }}</h4>
          <h5>{{ message.content }}</h5>
          <button v-if="currentMessage < messages.length - 1" @click="next">Next</button>
          <button v-else @click="showTour = !showTour">Get Started</button>
        </div>
      </div>  
      <div id="highlighted-div" v-if="showConfirm"></div>
      <div id="confirm" v-if="showConfirm">
        <img src="@/assets/LittleAppleLogo.png" style="width:35vw;">
        <h2 style="text-align: center; padding-bottom:6vh;">Thank you so much for using the Little Apple to explore the possibilities for urban agriculture within your community. Here are your results:</h2>
        <h2 id="headers2">Locations Added:<br>Open Space Lost:<img src="@/assets/tooltip.png" title="Calculated only considering public land such as parks and recreational open spaces." style="height:1.5vh; width:1.5vh; padding-top:0vh; padding-bottom:0px;"><br>Individuals Served:<img src="@/assets/tooltip.png" title="Calculated based on the total area of each location. One 6x6 raised bed can serve an individual for one year by producing over 100lbs of produce. This calculation also takes into account spatial needs such as a shed." style="height:1.5vh; width:1.5vh; padding-top:0px;"></h2>
        <h2 id="data2">{{ featureCount }}<br>{{ openSpaceLost }}%<br>{{ totalIndSrv }}<br>({{ foodInsSrv }}% food insecure)<img src="@/assets/tooltip.png" title="Food insecurity data was retrieved from Feeding America and assessed by census block utilizing 2020 census data. Calculated using the distance of each lot to areas of food insecurity." style="height:1.5vh; width:1.5vh; padding-top:0vh; padding-bottom:0px;"></h2>
        <p style="padding-bottom:2vh; margin-top:0vh;">Below, you can export your locations as a CSV, start over, or return to your progress.</p>
        <div id="buttons">
          <button style="margin-left: 2vw; margin-right: 2vw;">Export CSV</button>
          <router-link to="/"><button style="margin-left: 2vw; margin-right: 2vw;">Start Over</button></router-link>
          <button @click="confirmChoices" style="margin-left: 2vw; margin-right: 2vw;">Return</button>
        </div>
      </div>
    <div id="map" ref="map">
    </div>
    <div id="controls" ref="controls">
      <router-link to="/"><img src="@/assets/LittleAppleLogo.png"></router-link>
      <div id="results" ref="results">
        <pre><h2 id="headers">Locations Added:<br>Open Space Lost:<img src="@/assets/tooltip.png" title="Calculated only considering public land such as parks and recreational open spaces." style="height:1.5vh; width:1.5vh; padding-top:0vh; padding-bottom:0px;"><br>Individuals Served:<img src="@/assets/tooltip.png" title="Calculated based on the total area of each location. One 6x6 raised bed can serve an individual for one year by producing over 100lbs of produce. This calculation also takes into account spatial needs such as a shed." style="height:1.5vh; width:1.5vh; padding-top:0px;"></h2></pre>
        <h2 id="data">{{ featureCount }}<br>{{ openSpaceLost }}%<br>{{ totalIndSrv }}<br>({{ foodInsSrv }}% food insecure)<img src="@/assets/tooltip.png" title="Food insecurity data was retrieved from Feeding America and assessed by census block utilizing 2020 census data. Calculated using the distance of each lot to areas of food insecurity." style="height:1.5vh; width:1.5vh; padding-top:0vh; padding-bottom:0px;"></h2>
      </div>
      <button :style="buttonStyle" ref="confirm" @click="confirmChoices">Confirm Choices</button>
      <h3>Land Use Category<img src="@/assets/tooltip.png" title="Land type includes open spaces, vacant land, and unlicensed parking lots. These land use types were determined objectively as they are most prepared for structures that support urban agriculture." style="height:1.5vh; width:1.5vh; padding-top:0px;"></h3>
      <div id="buttons">
        <button ref="os" :class="{'active': isOpenSpacesSelected}" @click="isOpenSpacesSelected = !isOpenSpacesSelected" :style="buttonStyle2">Open Spaces</button>
        <button ref="vl" :class="{'active': isVacantLotsSelected}" @click="isVacantLotsSelected = !isVacantLotsSelected" :style="buttonStyle2">Vacant Land</button>
        <button ref="upl" :class="{'active': isUnlicensedParkingLotsSelected}" @click="isUnlicensedParkingLotsSelected = !isUnlicensedParkingLotsSelected" :style="buttonStyle2">Unlicensed Parking Lots</button>
      </div>
      <h3>Total Area</h3>
      <vue-slider ref="slider" v-model="area" :min="0" :max="1706" :tooltip-formatter="'{value} acre(s)'" :clickable="false" :enable-cross="false" :range="true" :style="sliderStyle" :railStyle="dotStyle" :processStyle="railStyle" :tooltipStyle="railStyle"></vue-slider>
      <h3>Daily Sunlight<img src="@/assets/tooltip.png" title="Daily sunlight was calculated utilizing sunlight analysis on 3d models of the city through Grasshopper and Rhino. The analysis was performed for the dates at the beginning of growing season in mid-April to best estimate total sunlight for the entire growing season through Fall." style="height:1.5vh; width:1.5vh; padding-top:0px;"></h3>
      <vue-slider v-model="sunlight" :min="2" :max="16" :range="true" :tooltip-formatter="'{value} hours'" :clickable="false" :enable-cross="false" :style="sliderStyle" :railStyle="dotStyle" :processStyle="railStyle" :tooltipStyle="railStyle"></vue-slider>
      <h3>Proximity to Highways</h3>
      <vue-slider v-model="highways" :min="0" :max="2.3" :interval="0.1" :range="true" :tooltip-formatter="'{value} mile(s)'" :clickable="false" :enable-cross="false" :style="sliderStyle" :railStyle="dotStyle" :processStyle="railStyle" :tooltipStyle="railStyle"></vue-slider>
      <h3>Proximity to Food Insecurity<img src="@/assets/tooltip.png" title="Food insecurity data was retrieved from Feeding America and assessed by census block utilizing 2020 census data." style="height:1.5vh; width:1.5vh; padding-top:0px;"></h3>
      <vue-slider v-model="foodins" :min="0" :max="3.8" :interval="0.1" :range="true" :tooltip-formatter="'{value} mile(s)'" :clickable="false" :enable-cross="false" :style="sliderStyle" :railStyle="dotStyle" :processStyle="railStyle" :tooltipStyle="railStyle"></vue-slider>
      <h3>Proximity to Low Income Households<img src="@/assets/tooltip.png" title="Low income households were defined by the 2020 census and corresponding poverty thresholds." style="height:1.5vh; width:1.5vh; padding-top:0px;"></h3>
      <vue-slider v-model="lowinc" :min="0" :max="3.2" :interval="0.1" :range="true" :tooltip-formatter="'{value} mile(s)'" :clickable="false" :enable-cross="false" :style="sliderStyle" :railStyle="dotStyle" :processStyle="railStyle" :tooltipStyle="railStyle"></vue-slider>
      <br><button ref="clear" :style="buttonStyle2" @click="clearFilters()">Clear All Filters</button>
    </div>
  </div>
</template>

<script>
import Mapbox from "mapbox-gl";
import mapboxgl from 'mapbox-gl';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

export default {
  name: 'App',
  data() {
    return {
      messages: [
        {
          title: 'Welcome to the Little Apple!',
          content: 'Here are some tools to get started.'
        },
        {
          title: 'Here is your interactive map of the Bronx',
          content: 'This is where you will see which potential locations fit within your parameters.'
        },
        {
          title: 'This is the control panel',
          content: 'This is where you can select land types...'
        },
        {
          title: 'This is the control panel',
          content: '...and use sliders to set ranges for variables including total area, daily sunlight, and proximity to highways, food insecurity, and low income households.'
        },
        {
          title: 'Here is the results panel',
          content: 'As you define your parameters, this panel will update with the metrics of your chosen locations.'
        },
        {
          title: 'Again, keep an eye on the map!',
          content: 'The map will also update with locations that you can hover over to see more information as you explore.'
        },
        {
          title: 'Finally when you are done, click Confirm Choices',
          content: 'This will give you the opportunity to export your selected locations, including their metrics, as a csv file. Here, you will also have the opportunity to start again from the beginning!'
        },
        {
          title: "Now you're all set!",
          content: 'We hope that the Little Apple can help you empower your community through food.'
        },
      ],
      currentMessage: 0,
      buttonImage: require('@/assets/ButtonBG.png'),
      buttonHover: require('@/assets/ButtonHOV.png'),
      accessToken: "pk.eyJ1IjoibGpjMjE3NyIsImEiOiJjbDRvemp0azEwMTd3M2NwOTl2bGk5M3YxIn0.Nyn7KWoueXzgl1mYurECiw",
      mapStyle: "mapbox://styles/ljc2177/clgi4m0yl010s01pps25n40is",
      map: '#map',
      area: [0,1706],
      sunlight: [2,16],
      highways: [0,2.3],
      foodins: [0,3.8],
      lowinc: [0,3.2],
      featureCount: 1091,
      openSpaceLost: 100,
      totalIndSrv: 3987410,
      foodInsSrv: 39,
      isOpenSpacesSelected: false,
      isVacantLotsSelected: false,
      isUnlicensedParkingLotsSelected: false,
      showTour: false,
      showConfirm: false,
    };
  },
  components: {
    VueSlider,
  },
  methods: {
    next() {
      this.currentMessage++;
      // update highlightedComponents based on currentMessage
      if (this.currentMessage === 1) {
        const divMap = this.$refs.map;
        divMap.style.zIndex = 10000;
      } else if (this.currentMessage === 2) {
        const divMap = this.$refs.map;
        divMap.style.zIndex = 2;
        const divCont = this.$refs.controls;
        divCont.style.zIndex = 10000;
        const divOS = this.$refs.os;
        divOS.style.borderColor = "yellow";
        const divVL = this.$refs.vl;
        divVL.style.borderColor = "yellow";
        const divUPL = this.$refs.upl;
        divUPL.style.borderColor = "yellow";
      } else if (this.currentMessage === 3) {
        const divOS = this.$refs.os;
        divOS.style.borderColor = "#4caf50";
        const divVL = this.$refs.vl;
        divVL.style.borderColor = "#4caf50";
        const divUPL = this.$refs.upl;
        divUPL.style.borderColor = "#4caf50";
        const divSlide = this.$refs.slider;
        divSlide.railStyle.backgroundColor = 'yellow';
      } else if (this.currentMessage === 4) {
        const divRes = this.$refs.results;
        divRes.style.backgroundColor = "yellow";
      } else if (this.currentMessage === 5) {
        const divRes = this.$refs.results;
        divRes.style.backgroundColor = "#d2efd2";
        const divSlide = this.$refs.slider;
        divSlide.railStyle.backgroundColor = "#d2efd2";
        const divCont = this.$refs.controls;
        divCont.style.zIndex = 10001;
        const divMap = this.$refs.map;
        divMap.style.zIndex = 10000;
      } else if (this.currentMessage === 6) {
        const divCon = this.$refs.confirm;
        divCon.style.backgroundColor = "yellow";
      } else if (this.currentMessage === 7) {
        const divCon = this.$refs.confirm;
        divCon.style.backgroundColor = "#4caf50";
        const divCont = this.$refs.controls;
        divCont.style.zIndex = 900;
        const divMap = this.$refs.map;
        divMap.style.zIndex = 900;
      };
    },
  clearFilters() {
      this.area= [0,1706];
      this.sunlight= [2,16];
      this.highways= [0,2.3];
      this.foodins= [0,3.8];
      this.lowinc= [0,3.2];
      this.isOpenSpacesSelected= false;
      this.isVacantLotsSelected= false;
      this.isUnlicensedParkingLotsSelected= false;
    },
    confirmChoices() {
    this.showConfirm = !this.showConfirm
    },
  },
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibGpjMjE3NyIsImEiOiJjbDRvemp0azEwMTd3M2NwOTl2bGk5M3YxIn0.Nyn7KWoueXzgl1mYurECiw'

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/ljc2177/clgi4m0yl010s01pps25n40is',
    })

    const filterLayers = ['bronx-5i80z3'];

    const filterData = {
      'Acres': this.area,
      'Sun_Hours': this.sunlight,
      'Distance_H': this.highways,
      'Distance_F': this.foodins,
      'Distance_P': this.lowinc,
    };

    // Create filter for potential locations
    const updateFilter = () => {
      const filterExpression = ['all'];

      // add button filters
      const selectedCategories = [];

      if (this.isOpenSpacesSelected) {
        selectedCategories.push('Open Spaces');
      }
      if (this.isVacantLotsSelected) {
        selectedCategories.push('Vacant Land');
      }
      if (this.isUnlicensedParkingLotsSelected) {
        selectedCategories.push('Unlicensed Parking Lots');
      }

      if (selectedCategories.length > 0) {
        const conditions = selectedCategories.map(category => ['==', ['get', 'layer'], category]);
        filterExpression.push(['any', ...conditions]);
      }

      // add slider filters
      for (const [key, value] of Object.entries(filterData)) {
        filterExpression.push(['>=', ['get', key], value[0]], ['<=', ['get', key], value[1]]);
      }

      map.setFilter(filterLayers[0], filterExpression);

      // add filter stats
      const visibleFeatures = map.queryRenderedFeatures({
        layers: filterLayers,
        filter: map.getFilter(filterLayers),
      });filterExpression

      const totalSpaceLost = visibleFeatures.reduce((acc, feature) => {
        return (acc + feature.properties['%SpaceLost']);
      }, 0);

      const totalIndSrv = visibleFeatures.reduce((acc, feature) => {
        return (acc + feature.properties['IndSrv']);
      }, 0);

      const foodIndSrv = visibleFeatures.reduce((acc, feature) => {
        return (acc + feature.properties['FoodInsSrv']);
      }, 0);
      
      this.featureCount = visibleFeatures.length;
      this.openSpaceLost = Math.floor(100*totalSpaceLost);
      this.totalIndSrv = totalIndSrv;
      this.foodInsSrv = Math.floor((foodIndSrv/totalIndSrv)*100);
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
      filterData['Distance_H'] = this.highways;
      updateFilter();
    });

    this.$watch('foodins', () => {
      filterData['Distance_F'] = this.foodins;
      updateFilter();
    });

    this.$watch('lowinc', () => {
      filterData['Distance_P'] = this.lowinc;
      updateFilter();
    });

    this.$watch('isOpenSpacesSelected', () => {
      updateFilter();
    });

    this.$watch('isVacantLotsSelected', () => {
      updateFilter();
    });

    this.$watch('isUnlicensedParkingLotsSelected', () => {
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
        'backgroundColor': '#4caf50',
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
  flex-direction: column;
  align-items: left;
  justify-content: left;
  width: 95vw;
  height: 92vh;
  background-color: none;
  border-radius: 1rem;
  box-shadow: 3px 3px grey;
}

#highlighted-div {
  z-index: 9999;
  position: absolute;
  margin-left: -2.5vw;
  margin-top: -4vh;
  width: 100vw;
  height: 100vh;
  background-color: rgb(10,10,10,0.3);
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}

#tour{
  z-index: 11100;
  position: absolute;
  color: black;
  width: 85vw;
  height: 22vh;
  background-color: rgb(239, 255, 239);
  border-radius: 1rem;
  text-align: center;
  justify-content: center;
  bottom: 0;
  margin-left: 5vw;
}

#map {
  height: 100%;
  width: 100%;
  transform: translate3d(0,0,0);
  border-radius: 1rem;
  overflow: hidden;
  justify-content: center;
  align-items: center;
}

#buttons {
  margin-top: 0px;
}

#buttonHover:hover {
  background-color: #4caf50;
  color: white;
}

#controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: left;
  position: absolute;
  width: 27vw;
  height: 92vh;
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 3px 3px grey;
  z-index: 900;
}

#results{
  height: 8vw;
  position: relative;
  width: 23vw;
  margin-top: 2vh;
  background-color: #d2efd2;
  border-radius: 1rem;
  box-shadow: 3px 3px grey;
  z-index: 900;
  margin-bottom: 2vh;
}

#headers {
  z-index: 5000;
  position: absolute;
  margin-top: 1vh;
}

#data {
  z-index: 100;
  text-align: right;
  position: relative;
  margin-top: -0.55vh;
  margin-right: 1vw;
}

pre {
  margin-top: 0vh;
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
  font-family: roboto;
}

h4 {
  font-size: 2.25vw;
  font-weight: bold;
  font-family: roboto;
  padding-left: 3vw;
  margin-bottom: 2vh;
  padding-right: 3vw;
  padding-top: 0vw;
}

h5 {
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
  margin-left: 2rem;
  margin-top: 0vh;
  margin-right: 2rem;
  margin-bottom: 2vh;
  font-family: roboto;
  font-weight: lighter;
  padding-top: 0rem;
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
  margin-top: 0vh;
  font-family: roboto;
  font-size: 1.5vh;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 0.25vw;
  cursor: pointer;
  margin-bottom: 2vh;
}

button:hover{
  background-color: transparent;
}

img {
  padding-top: 2rem;
  width: 20vw;
  z-index: 20000;
}

#confirm {
  display: flex;
  position: absolute;
  margin: auto;
  flex-direction: column;
  align-items: center;
  padding:0vw 4vw;
  justify-content: center;
  width: 46vw;
  height: 65vh;
  margin-left: 20vw;
  margin-top: 8vh;
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 3px 3px grey;
  z-index: 30000;
}

#headers2 {
  z-index: 5000;
  position: absolute;
  margin-left: -7vw;
  padding-bottom: 1vh;
  text-align: left;
  margin-top: 8vh;
}

#data2 {
  z-index: 100;
  text-align: right;
  position: relative;
  margin-right: -7vw;
  padding-bottom: 1vh;
  text-align: right;
  margin-top: -4.65vh;
}
</style>
