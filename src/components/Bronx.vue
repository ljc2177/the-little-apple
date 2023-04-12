<template>
<div id="background" :style="bgStyle">
  <div id="app">
    <img src="@/assets/LittleAppleLogo.png">
    <h2 v-if="showHome">{{ gameDescription1 }}</h2>
  </div>
</div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      showHome: true,
      showBoroughs: false,
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
    bgStyle() {
      return {
        'background-image': `url(${this.bgImage})`,
        'background-size': 'cover',
        'background-position': 'center',
      };
    },
  },
}
</script>

<style>
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

#app {
  display: flex;
  position: absolute;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  border-radius: 25px;
  height: 80vh;
  width: 60vh;
  background-color: #ffffff;
}

#background {
  display: flex;
  position: absolute;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-family: roboto-mono;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
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
  padding: 1rem 1.5rem;
  margin: 0.75rem;
  font-family: roboto;
  font-size: 1rem;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

button:hover{
  background-color: transparent;
}

img {
  width: 75vh;
}
</style>
