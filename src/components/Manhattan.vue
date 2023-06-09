<template>
  <div id="container">
    <div id="highlighted-div" v-if="showTour"></div>
      <div id="tour" ref="tour" v-if="showTour">
        <div v-for="(message, index) in messages" :key="index" v-show="currentMessage === index">
          <h4 ref="h4">{{ message.title }}</h4>
          <h5>{{ message.content }}</h5>
          <button v-if="currentMessage < messages.length - 1" @click="next">Next</button>
          <button v-else @click="showTour = !showTour">Get Started</button>
          <button v-if="currentMessage  == 0" @click="showTour = !showTour">Skip</button>
        </div>
      </div>  
      <div id="insights" ref="insights" v-if="showInsights">
        <span class="close-btn" @click="showInsights = false; currentQuote = Math.floor(Math.random()*19)">&times;</span>
        <div v-for="(quote, index) in quotes" :key="index" v-show="currentQuote === index">
          <p style="text-align:left; font-size: 1.75vh; padding-left: 0px; padding-right: 0px;">{{ quote.content }}</p>
        </div>
      </div>  
      <div id="highlighted-div" v-if="showConfirm"></div>
      <div id="confirm" v-if="showConfirm">
        <img src="@/assets/LittleAppleLogo.png" style="width:35vw;">
        <h2 style="text-align: center; padding-bottom:10vh;">Thank you so much for using the Little Apple to explore the possibilities for urban agriculture within your community. Here are your results:</h2>
        <h2 id="headers2">Total Locations:<br>Open Space Lost:<img src="@/assets/tooltip.png" title="Calculated only considering public land such as parks and recreational open spaces." style="height:1.5vh; width:1.5vh; padding-top:0vh; padding-bottom:0px;"><br>Individuals Served:<img src="@/assets/tooltip.png" title="Calculated based on the total area of each location. One 6x6 raised bed can serve an individual for one year by producing over 100lbs of produce. This calculation also takes into account spatial needs such as a shed." style="height:1.5vh; width:1.5vh; padding-top:0px;"></h2>
        <h2 id="data2">{{ featureCount }}<br>{{ openSpaceLost }}%<br>{{ totalIndSrv }}<br>({{ foodInsSrv }}% food insecure)<img src="@/assets/tooltip.png" title="Food insecurity data was retrieved from Feeding America and assessed by census block utilizing 2020 census data. Calculated using the distance of each lot to areas of food insecurity." style="height:1.5vh; width:1.5vh; padding-top:0vh; padding-bottom:0px;"></h2>
        <p style="padding-bottom:2vh; margin-top:0vh;">Below, you can export your locations as a CSV, start over, or return to your progress.</p>
        <div id="buttons">
          <button :class="{'active': isDownloadCSVSelected}" @click="isDownloadCSVSelected = !isDownloadCSVSelected" style="margin-left: 2vw; margin-right: 2vw;">Export CSV</button>
          <router-link to="/"><button style="margin-left: 2vw; margin-right: 2vw;">Start Over</button></router-link>
          <button @click="confirmChoices" style="margin-left: 2vw; margin-right: 2vw;">Return</button>
        </div>
      </div>
    <div id="map" ref="map">
    </div>
    <div id="controls" ref="controls" @mouseup="showPopup()">
      <router-link to="/"><img src="@/assets/LittleAppleLogo.png"></router-link>
      <div id="results" ref="results">
        <pre><h2 id="headers">Locations Added:<br>Open Space Lost:<img src="@/assets/tooltip.png" title="Calculated only considering public land such as parks and recreational open spaces." style="height:1.5vh; width:1.5vh; padding-top:0vh; padding-bottom:0px;"><br>Individuals Served:<img src="@/assets/tooltip.png" title="Calculated based on the total area of each location. One 6x6 raised bed can serve an individual for one year by producing over 100lbs of produce. This calculation also takes into account spatial needs such as a shed." style="height:1.5vh; width:1.5vh; padding-top:0px;"></h2></pre>
        <h2 id="data">{{ featureCount }}<br>{{ openSpaceLost }}%<br>{{ totalIndSrv }}<br>({{ foodInsSrv }}% food insecure)<img src="@/assets/tooltip.png" title="Food insecurity data was retrieved from Feeding America and assessed by census block utilizing 2020 census data. Calculated using the distance of each lot to areas of food insecurity." style="height:1.5vh; width:1.5vh; padding-top:0vh; padding-bottom:0px;"></h2>
      </div>
      <button ref="confirm" @click="confirmChoices">CONFIRM CHOICES</button>
      <h3>Land Use Category<img src="@/assets/tooltip.png" title="Land type includes open spaces, vacant land, and unlicensed parking lots. These land use types were determined objectively as they are most prepared for structures that support urban agriculture." style="height:1.5vh; width:1.5vh; padding-top:0px;"></h3>
      <div id="buttons">
        <button ref="os" :class="{'active': isOpenSpacesSelected}" @click="isOpenSpacesSelected = !isOpenSpacesSelected" :style="buttonStyle2">Open Spaces</button>
        <button ref="vl" :class="{'active': isVacantLotsSelected}" @click="isVacantLotsSelected = !isVacantLotsSelected" :style="buttonStyle2">Vacant Land</button>
        <button ref="upl" :class="{'active': isUnlicensedParkingLotsSelected}" @click="isUnlicensedParkingLotsSelected = !isUnlicensedParkingLotsSelected" :style="buttonStyle2">Unlicensed Parking Lots</button>
      </div>
      <div ref="sliders" style="display: flex; flex-direction: column; align-items: center; border-radius: 1rem;">
        <h3>Total Area</h3>
        <vue-slider v-bind="options" ref="slider" v-model="area" :min="0" :max="841" :tooltip-formatter="'{value} acre(s)'" :clickable="false" :enable-cross="false" :range="true" :style="sliderStyle" :railStyle="dotStyle" :processStyle="railStyle" :tooltipStyle="railStyle"></vue-slider>
        <h3>Daily Sunlight<img src="@/assets/tooltip.png" title="Daily sunlight was calculated utilizing sunlight analysis on 3d models of the city through Grasshopper and Rhino. The analysis was performed for the dates at the beginning of growing season in mid-April to best estimate total sunlight for the entire growing season through Fall." style="height:1.5vh; width:1.5vh; padding-top:0px;"></h3>
        <vue-slider v-bind="options" v-model="sunlight" :min="2" :max="16" :range="true" :tooltip-formatter="'{value} hours'" :clickable="false" :enable-cross="false" :style="sliderStyle" :railStyle="dotStyle" :processStyle="railStyle" :tooltipStyle="railStyle"></vue-slider>
        <h3>Proximity to Highways</h3>
        <vue-slider v-bind="options" v-model="highways" :min="0" :max="2.1" :interval="0.1" :range="true" :tooltip-formatter="'{value} mile(s)'" :clickable="false" :enable-cross="false" :style="sliderStyle" :railStyle="dotStyle" :processStyle="railStyle" :tooltipStyle="railStyle"></vue-slider>
        <h3>Proximity to Food Insecurity<img src="@/assets/tooltip.png" title="Food insecurity data was retrieved from Feeding America and assessed by census block utilizing 2020 census data." style="height:1.5vh; width:1.5vh; padding-top:0px;"></h3>
        <vue-slider v-bind="options" v-model="foodins" :min="0" :max="3.4" :interval="0.1" :range="true" :tooltip-formatter="'{value} mile(s)'" :clickable="false" :enable-cross="false" :style="sliderStyle" :railStyle="dotStyle" :processStyle="railStyle" :tooltipStyle="railStyle"></vue-slider>
        <h3>Proximity to Low Income Households<img src="@/assets/tooltip.png" title="Low income households were defined by the 2020 census and corresponding poverty thresholds." style="height:1.5vh; width:1.5vh; padding-top:0px;"></h3>
        <vue-slider v-bind="options" v-model="lowinc" :min="0" :max="3.4" :interval="0.1" :range="true" :tooltip-formatter="'{value} mile(s)'" :clickable="false" :enable-cross="false" :style="sliderStyle" :railStyle="dotStyle" :processStyle="railStyle" :tooltipStyle="railStyle"></vue-slider>
        <br><button ref="clear" :style="buttonStyle2" @click="clearFilters()">Clear All Filters</button>
      </div>
    </div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import Mapbox from "mapbox-gl";
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
import Papa from 'papaparse';

export default {
  name: 'App',
  data() {
    return {
      messages: [
      {
          title: 'Welcome to the Little Apple!',
          content: 'This a tool to help you determine the best potential future urban agriculture within NYC. Here, you have the power to decide what is best for the future of your community To learn more about how to use this tool, click "Next".'
        },
        {
          title: 'Here is your interactive map of Manhattan',
          content: 'This is where you will see which potential locations fit within your parameters. To filter your locations to a specific area, simply zoom in. For more information on a specific location, hover over it on the map.'
        },
        {
          title: 'This is the control panel',
          content: 'This is where you can select land use categories...'
        },
        {
          title: 'This is the control panel',
          content: '...and use sliders to set ranges for variables including total area, daily sunlight, and proximity to highways, food insecurity, and low income households.'
        },
        {
          title: 'Here is the results panel',
          content: 'As you define your parameters, this panel will update with the metrics of your filtered locations.'
        },
        {
          title: 'Again, keep an eye on the map!',
          content: 'The map will update which locations are shown as you adjust your metrics.'
        },
        {
          title: 'Finally when you are done, click "Confirm Choices"',
          content: 'You will then have the opportunity to export your filtered locations, including their metrics, as a csv file. You will also have the opportunity to return and explore the possibilities within another borough.'
        },
        {
          title: "Now you're all set!",
          content: 'We hope that the Little Apple can help you empower your community through food.'
        },
      ],
      quotes: [
        {
          content: "In the Portland, Maine urban agriculture program, the most important factors when evaluating a new potential site are: (1) Air pollution - even though new locations have built on contaminated soil in the past with the help of remediation, it's a general rule of thumb that locations farther from highways will be prioritized to help mitigate potential pollution of the site. (2) Food insecurity/low or mixed income neighborhoods - through the city's Black development grants, individuals from food insecure, and low and mixed income neighborhoods are encouraged to bring urban agriculture into their communities. (3) Size - community garden plots are 10 x 15 ft with one or two individuals per plot. The more space, the more individuals that a single location can serve.",
        },
        {
          content: 'In the Washington, D.C. urban agriculture program, the most important factors when evaluating a new potential site are water access and light access. As of today, there are currently 214 urban agriculture locations throughout the D.C. metro area.',
        },
        {
          content: 'In Portland, Maine, all developed urban agriculture locations receive a fence, access to a communal shed with tools, a composting area, and a functioning water system which is managed seasonally by the overseeing staff.',
        },
        {
          content: 'The waitlist for plots within the Portland, Maine urban agriculture system is currently 800 individuals long. To promote equity, individuals who demonstrate the most need are moved to the top of the list.',
        },
        {
          content: 'In Portland, Maine, urban agriculture locations are currently only being placed within parks. They have come to find that much of the time, the most ideal locations are located directly next to athletic and recreational facilities.',
        },
        {
          content: "You might think that a single plot is not a large enough area to measurably impact someone's access to food, but you can grow more than you think within 10' x 15'. With the help of succession planting customized to your region's climate data, you can grow up to 100lbs of fresh food a year in half of a plot.",
        },
        {
          content: 'There are two major systems for urban agriculture: community gardens and urban farms. In Portland, Maine the focus is primarily on community gardens, while in Washington, D.C the focus is primarily on urban farms. The biggest factors that contribute to whether a location will be better as a community garden or an urban farm are labor (community engagement vs. employment structure), size (urban farms require more land than community gardens), and community preferences (many communities are not open to having outside entities establish urban farms within their limits).',
        },
        {
          content: 'In Portland, Maine, individuals participating in the urban agriculture program are encouraged to donate a portion of their crops to local food banks. Every location has a cooler on-site where nonprofits can pick up the donated food for their missions.',
        },
        {
          content: 'One model that has been explored in Portland, ME is a common share model: instead of individual plots, the food is all grown together and the labor/responsibilities is divided among the participating individuals. This has been a particularly good model for people who are new to growing food who want to learn more, or who are new to the area who want to meet more people and grow their sense of community.',
        },
        {
          content: 'In Portland, Maine, participating individuals pay for a whole or half garden plot through a yearly fee. If you are unable to afford that, there is also a scholarship program and sliding scale model. If you are fortuate enough to be able to afford more, you are encouraged contribute more in order to help subsidize the low income programs. All participants are required to volunteer 6 hrs/season to help maintain their community garden. This includes turning the compost, organizing the toolshed, and assisting other gardeners.',
        },
        {
          content: "In Portland, Maine, every year a survey is distributed to participants in the urban agriculture program to assess its success. Questions include how much food they were able to grow and how that affected their family's access to food. Overwhelmingly, the administrators of the program have come to find that the vast majority of individuals report that the program allows them and their families to include more vegetables in their diet at a reduced rate.",
        },
        {
          content: 'In Washington, D.C. urban farms function through regular lease structures. "Tenants" are typically responsible for the utilities of their urban farm, however in some cases park land might have water fee subsidies.',
        },
        {
          content: 'Urban farms, by their very nature, require more work on the part of the participant. This is because of the scale and independent oversight that comes with urban farming. That said, this autonomy also allows urban farms to independently define and support their mission through fresh food.',
        },
        {
          content: "In Washington, D.C., the majority of urban farms are located on district-owned park land. Because for-profit corporations can't profit on government owned land, most of these organizations are nonprofit organizations.",
        },
        {
          content: "One of the greatest strengths of Washington, D.C.'s urban agriculture program is its corresponding network of urban agriculture professionals. Many of the urban farmers have been working in the space for over 10 years.",
        },
        {
          content: 'In 2020, the Washington, D.C. urban agriculture department was created to help build resources for urban farms and agriculture. As a result, some of their programs include: an annual grant program, a tax abatement program, the Land Lease Program, and a yearly urban agriculture conference. All of these programs support the overall goal of supporting a diversity of urban farms within Washington, D.C..',
        },
        {
          content: "One key component of making urban agriculture equitable is differentiating locations between those that are being established as part of a trend and those that are being established to address a need. The best way to do this is to utilize community-centric planning when implementing potential locations and programs."
        },
        {
          content: "For the best results, plants need from 6-8 hours of direct sunlight to thrive. If you get less than this, you can still find success with herbs, but other plants will experience significantly lower yields."
        },
        {
          content: "The beginning of the growing season is in early Spring each year. In New York City, if you are looking to plant from seed, you should be planting between March and April. If you are growing your produce from transplants, you should plant in May. Of course, this differs for late-season plants, and it's always best to refer to your agricultural climate map."
        }
      ],
      currentMessage: 0,
      currentQuote: 0,
      buttonImage: require('@/assets/ButtonBG.png'),
      buttonHover: require('@/assets/ButtonHOV.png'),
      accessToken: "pk.eyJ1IjoibGpjMjE3NyIsImEiOiJjbDRvemp0azEwMTd3M2NwOTl2bGk5M3YxIn0.Nyn7KWoueXzgl1mYurECiw",
      mapStyle: "mapbox://styles/ljc2177/clgi4m0yl010s01pps25n40is",
      map: '#map',
      area: [0,841],
      sunlight: [2,16],
      highways: [0,2.1],
      foodins: [0,3.4],
      lowinc: [0,3.4],
      featureCount: 406,
      openSpaceLost: 100,
      totalIndSrv: 2289800,
      foodInsSrv: 52,
      isOpenSpacesSelected: false,
      isVacantLotsSelected: false,
      isUnlicensedParkingLotsSelected: false,
      showTour: true,
      showConfirm: false,
      showInsights: false,
      isDownloadCSVSelected: false,
      options: {
        dotOptions: [{
          style: {
            'border': '2px solid black',
            'boxShadow': '1px 1px grey',
          },
        },
        {
          style: {
            'border': '2px solid black',
            'boxShadow': '1px 1px grey',
          },
        }],
      }
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
        divMap.style.border = "2px solid yellow";
        const divTour = this.$refs.tour;
        divTour.style.height = "23vh";
        divTour.style.left = "-28.15vw";
        divTour.style.top = "2.25vh";
      } else if (this.currentMessage === 2) {
        const divMap = this.$refs.map;
        divMap.style.zIndex = 2;
        divMap.style.border = "none";
        const divCont = this.$refs.controls;
        divCont.style.zIndex = 10000;
        const divOS = this.$refs.os;
        divOS.style.border = "3px solid yellow";
        const divVL = this.$refs.vl;
        divVL.style.border = "3px solid yellow";
        const divUPL = this.$refs.upl;
        divUPL.style.border = "3px solid yellow";
        const divTour = this.$refs.tour;
        divTour.style.height = "13vh";
        divTour.style.left = "0vw";
        divTour.style.top = "40vh";
      } else if (this.currentMessage === 3) {
        const divSlide = this.$refs.sliders;
        divSlide.style.border = "2px solid yellow"
        const divTour = this.$refs.tour;
        divTour.style.height = "17vh";
        divTour.style.top = "60vh";
        const divOS = this.$refs.os;
        divOS.style.border = "3px solid #89f0c3";
        const divVL = this.$refs.vl;
        divVL.style.border = "3px solid #89f0c3";
        const divUPL = this.$refs.upl;
        divUPL.style.border = "3px solid #89f0c3";
      } else if (this.currentMessage === 4) {
        const divSlide = this.$refs.sliders;
        divSlide.style.border = "none"
        const divRes = this.$refs.results;
        divRes.style.border = "2px solid yellow";
        const divTour = this.$refs.tour;
        divTour.style.height = "15vh";
        divTour.style.top = "13vh";
      } else if (this.currentMessage === 5) {
        this.sunlight = [6,16];
        this.isVacantLotsSelected = true;
        this.isUnlicensedParkingLotsSelected = true;
        this.foodins = [0,1];
        const divTour = this.$refs.tour;
        divTour.style.height = "15vh";
        divTour.style.top = "65vh";
        divTour.style.left = "20vw";
        const divRes = this.$refs.results;
        divRes.style.border = "2px solid black";
        const divMap = this.$refs.map;
        divMap.style.zIndex = 10000;
      } else if (this.currentMessage === 6) {
        this.sunlight = [2,16];
        this.isVacantLotsSelected = false;
        this.isUnlicensedParkingLotsSelected = false;
        this.foodins = [0,3.4];
        const divCon = this.$refs.confirm;
        divCon.style.border = "2px solid yellow";
        const divTour = this.$refs.tour;
        divTour.style.height = "24vh";
        divTour.style.top = "25vh";
        divTour.style.left = "0vw";
        const divMap = this.$refs.map;
        divMap.style.zIndex = 2;
      } else if (this.currentMessage === 7) {
        const divCon = this.$refs.confirm;
        divCon.style.border = "2px solid black";
        const divCont = this.$refs.controls;
        divCont.style.zIndex = 900;
        const divMap = this.$refs.map;
        divMap.style.zIndex = 900;
        const divTour = this.$refs.tour;
        divTour.style.height = "15vh";
        divTour.style.top = "30vh";
      }
    },
  clearFilters() {
      this.area= [0,841];
      this.sunlight= [2,16];
      this.highways= [0,2.1];
      this.foodins= [0,3.4];
      this.lowinc= [0,3.4];
      this.isOpenSpacesSelected= false;
      this.isVacantLotsSelected= false;
      this.isUnlicensedParkingLotsSelected= false;
    },
    confirmChoices() {
    this.showConfirm = !this.showConfirm
    },
    showPopup() {
      const randNum = Math.floor(Math.random()*10)
      if (randNum%4 === 0){
        return this.showInsights=true
      }
    },
  },
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibGpjMjE3NyIsImEiOiJjbDRvemp0azEwMTd3M2NwOTl2bGk5M3YxIn0.Nyn7KWoueXzgl1mYurECiw'

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/ljc2177/clgszie2u006g01pag8rsgdbr',
      minZoom: 11,
      center: [-74.011039, 40.781255],
      maxBounds: [
        [-74.366,40.613], // Southwest coordinates
        [-73.729,40.941] // Northeast coordinates
      ],
    })

    const filterLayers = ['manhattan-b363c5'];

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
      });

      const totalSpaceLost = visibleFeatures.reduce((acc, feature) => {
        const spaceLost = parseFloat(feature.properties['%SpaceLost']);
        return acc + Math.floor(spaceLost * 100) / 100;
      }, 0);

      const totalIndSrv = visibleFeatures.reduce((acc, feature) => {
        return (acc + feature.properties['IndSrv']);
      }, 0);

      const foodIndSrv = visibleFeatures.reduce((acc, feature) => {
        return (acc + feature.properties['FoodInsSrv']);
      }, 0);
      
      this.featureCount = visibleFeatures.length;
      this.openSpaceLost = Math.ceil(totalSpaceLost*100);
      this.totalIndSrv = totalIndSrv;
      this.foodInsSrv = Math.floor((foodIndSrv/totalIndSrv)*100);
    };

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'my-popup',
      anchor: 'top',
      offset: [600, 0], // Adjust the offset as needed
      maxWidth: 'none',
    });

    map.on('mouseenter', 'manhattan-b363c5', function(e) {
      // Change the cursor style as a visual cue that the feature can be clicked.
      map.getCanvas().style.cursor = 'pointer';

      const feature = e.features[0];

      // Use the feature's properties to populate the popup content.
      const popupContent = `
        <p style="background-color:white; font-family: roboto-mono; width: 20vw; font-size: 0.75vw; border-radius: 1vw; border: 2px solid black; box-shadow: 3px 3px grey; padding: 10px;"><b>Total Area:</b> ${Math.round(feature.properties.Acres)} acre(s)<br>
        <b>Daily Sunlight:</b> ${Math.round(feature.properties.Sun_Hours)} hour(s)<br>
        <b>Distance from Highways:</b> ${feature.properties.Distance_H} mile(s)<br>
        <b>Proximity to Food Insecurity:</b> ${feature.properties.Distance_F} mile(s)<br>
        <b>Proximity to Low Income Households:</b> ${feature.properties.Distance_P} mile(s)</p>
      `;

      // Set the popup content and location, and add it to the map.
      popup.setLngLat(e.lngLat)
        .setHTML(popupContent)
        .addTo(map);
    });

    map.on('mouseleave', 'manhattan-b363c5', function() {
      // Change the cursor style back to default.
      map.getCanvas().style.cursor = '';

      // Remove the popup from the map.
      popup.remove();
    });

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

    const osIsClicked = () => {
      if (this.isOpenSpacesSelected == true) {
        const divOS = this.$refs.os;
        divOS.style.backgroundColor = "lightgrey";
      } else {
        const divOS = this.$refs.os;
        divOS.style.backgroundColor = "white";
      }
    };

    const vlIsClicked = () => {
      if (this.isVacantLotsSelected == true) {
        const divVL = this.$refs.vl;
        divVL.style.backgroundColor = "lightgrey";
      } else {
        const divVL = this.$refs.vl;
        divVL.style.backgroundColor = "white";
      }
    };

    const uplIsClicked = () => {
      if (this.isUnlicensedParkingLotsSelected == true) {
        const divUPL = this.$refs.upl;
        divUPL.style.backgroundColor = "lightgrey";
      } else {
        const divUPL = this.$refs.upl;
        divUPL.style.backgroundColor = "white";
      }
    };

    this.$watch('isOpenSpacesSelected', () => {
      updateFilter();
      osIsClicked();
    });

    this.$watch('isVacantLotsSelected', () => {
      updateFilter();
      vlIsClicked();
    });

    this.$watch('isUnlicensedParkingLotsSelected', () => {
      updateFilter();
      uplIsClicked();
    });

    const downloadCSV = () => {
      const features = map.queryRenderedFeatures({
        layers: ['manhattan-b363c5']
      });
      const fields = ['Borough', 'Block', 'Lot', 'CD', 'ZipCode', 'Address', 'OwnerName', 'HistDist', 'Acres', 'Gov_Iden', 'layer', 'SqFt', 'Sun_Hours', '%SpaceLost', 'IndSrv', 'FloodZone', 'Distance_H', 'Distance_P', 'Distance_T', 'Distance_F', 'ZoningDist', 'FoodInsSrv', '%FoodIns'];
      const csv = Papa.unparse({
        fields: fields,
        data: features.map(feature => feature.properties)
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ManhattanUrbanAgLocations.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    this.$watch('isDownloadCSVSelected', () => {
      if (this.isDownloadCSVSelected === true) {
        downloadCSV();
        this.isDownloadCSVSelected = false;
      }
    });
  },
  computed: {
    buttonStyle2() {
      return {
        'background-color': 'transparent',
        'border': 'solid',
        'border-color': '#89f0c3',
        'border-radius': '0.5rem',
        'float': 'left',
        'height': '5vh',
        'width': '7vw',
        'text-align': 'center',
        'padding': '0',
        'color': 'black',
        'margin-left': '0.5vw',
        'font-size': '1.2vh'
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
        'background-color': 'white',
        'border': '2px solid black',
      };
    },
    railStyle() {
      return {
        'backgroundColor': '#89f0c3',
        'font-family': 'roboto-condensed',
        'color': 'black',
        'border-top-color': '#89f0c3',
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
  border: 2px solid black;
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
  width: 40vw;
  height: 22vh;
  background-color: #ffffff;
  border: 2px solid black;
  box-shadow: 3px 3px grey;
  margin-top: 0px;
  border-radius: 1rem;
  text-align: center;
  justify-content: center;
  bottom: 45vh;
  margin-left: 30vw;
}

#insights{
  z-index: 21100;
  position: absolute;
  color: black;
  width: 25vw;
  height: 22vh;
  background-color: #89f0c3;
  border: 2px solid black;
  box-shadow: 3px 3px grey;
  border-radius: 1rem;
  text-align: center;
  overflow-y:auto;
  padding-top: 2vh;
  padding-bottom: 2vh;
  padding-left: 0px;
  padding-right: 0px;
  justify-content: center;
  bottom: 2vh;
  right: 2vw;
}

.close-btn {
        position: absolute;
        color: #000000;
        top: 0vh;
        left: 90%;
        padding: 10px;
        cursor: pointer;
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

#controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: left;
  position: absolute;
  left: -2px;
  top: -2px;
  width: 27vw;
  height: 92vh;
  background-color: #ffffff;
  border-radius: 1rem;
  border: 2px solid black;
  box-shadow: 3px 0px grey;
  z-index: 900;
}

#custom-popup {
  background-color: #fff;
  z-index: 50000;
}

#results{
  height: 8vw;
  position: relative;
  width: 23vw;
  margin-top: 2vh;
  background-color: #89f0c3;
  border-radius: 1rem;
  color: black;
  border: 2px solid black;
  box-shadow: 3px 3px #808080;
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
  font-size: 1.1vw;
  font-weight: bold;
  padding-left: 1vw;
  text-align: left;
  font-family: roboto-mono;
}

h3 {
  font-size: 1vw;
  font-weight: bold;
  padding-left: 1vw;
  text-align: left;
  padding-bottom: 0px;
  font-family: roboto-mono;
}

h4 {
  font-size: 1.75vw;
  font-weight: bold;
  font-family: roboto-mono;
  padding-left: 3vw;
  margin-bottom: 2vh;
  padding-right: 3vw;
  margin-top: 2vh;
}

h5 {
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
  margin-left: 2rem;
  margin-top: 0vh;
  margin-right: 2rem;
  margin-bottom: 3vh;
  font-family: roboto-mono;
  font-weight: lighter;
  padding-top: 0rem;
}

p {
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
  font-family: roboto-mono;
}

button {
  padding: 1vw 1.5vw;
  margin: 0.5vw;
  font-family: roboto-condensed;
  font-size: 1.75vh;
  font-weight: bold;
  background-color: white;
  color: #000000;
  border: 2px solid black;
  box-shadow: 3px 3px grey;
  border-radius: 0.5vw;
  cursor: pointer;
  z-index: 30000;
}

button:hover{
  background-color: lightgrey;
  box-shadow: 3px 3px black;
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
  border: 2px solid black;
  box-shadow: 3px 3px grey;
  z-index: 30000;
}

#headers2 {
  z-index: 5000;
  position: absolute;
  margin-left: -7vw;
  padding-bottom: 1vh;
  padding-top: 2vh;
  text-align: left;
  margin-top: 8vh;
}

#data2 {
  z-index: 100;
  text-align: right;
  position: relative;
  margin-right: -7vw;
  padding-bottom: 1vh;
  padding-top: 2vh;
  text-align: right;
  margin-top: -11.25vh;
}
</style>
