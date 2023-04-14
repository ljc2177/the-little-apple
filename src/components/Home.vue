<template>
  <div id="container">
    <img src="@/assets/LittleAppleLogo.png">
    <h2 v-if="showHome">{{ gameDescription1 }}</h2>
    <p v-if="showHome">{{ gameDescription2 }}</p>
    <p v-if="showHome">{{ gameDescription3 }}</p>
    <button v-if="showHome" @click="chooseBorough" :style="buttonStyle">Begin</button>
    <p v-if="showBoroughs">{{ chooseBoroughs }}</p>
    <router-link to="/bronx"><button v-if="showBoroughs" @click="startBronx" :style="buttonStyle">Bronx</button></router-link>
    <button v-if="showBoroughs" @click="startBrooklyn" :style="buttonStyle">Brooklyn</button>
    <button v-if="showBoroughs" @click="startManhattan" :style="buttonStyle">Manhattan</button>
    <button v-if="showBoroughs" @click="startQueens" :style="buttonStyle">Queens</button>
    <button v-if="showBoroughs" @click="startStatenIsland" :style="buttonStyle">Staten Island</button>
</div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      showHome: true,
      showBoroughs: false,
      gameTitle: "The Little Apple",
      gameDescription1: "Welcome to the Little Apple, where you can explore the opportunities for urban agriculture within the Big Apple!",
      gameDescription2: "Here, you have the power to help expand New York City's network of community gardens and urban farms by choosing their locations. To support your choices, we are providing you with all the data you need, including land use type, total area, average sunlight, and proximity to highways and areas with high food insecurity.",
      gameDescription3: "Discover what the possibilities are for your community, and how to bring them to life.",
      chooseBoroughs: "What greater community are you a member of?",
      buttonImage: require('@/assets/ButtonBG.png'),
      buttonHover: require('@/assets/ButtonHOV.png'),
      bgImage: require('@/assets/GameGradient.png'),
    };
  },
  methods: {
    chooseBorough() {
      this.showHome = !this.showHome
      this.showBoroughs = !this.showBoroughs
    },
    startBronx() {
      // Redirect to the game page or start the game.
      // This method will be different for every game.
    },
    startBrooklyn() {
      // Redirect to the game page or start the game.
      // This method will be different for every game.
    },
    startManhattan() {
      // Redirect to the game page or start the game.
      // This method will be different for every game.
    },
    startQueens() {
      // Redirect to the game page or start the game.
      // This method will be different for every game.
    },
    startStatenIsland() {
      // Redirect to the game page or start the game.
      // This method will be different for every game.
    },
  },
  computed: {
    buttonStyle() {
      return {
        'background-image': `url(${this.buttonImage})`,
        'background-size': 'cover',
        'background-position': 'center',
      };
    },
  },
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
  margin: auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50vw;
  height: 80vh;
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 3px 3px grey;
}

h1 {
  font-size: 3vw;
  margin-bottom: 1rem;
  font-family: roboto-mono;
}

h2 {
  font-size: 1.5vw;
  margin-bottom: 1rem;
  text-align: center;
  font-family: roboto;
  margin-left: 3.5rem;
  margin-right: 3.5rem;
}

p {
  font-size: 1vw;
  margin-bottom: 1rem;
  text-align: center;
  margin-left: 3.5rem;
  margin-right: 3.5rem;
  font-family: roboto;
}

button {
  padding: 1vw 1.5vw;
  margin: 0.5vw;
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
  width: 40vw;
}
</style>
