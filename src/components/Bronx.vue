<template>
  <div id="container">
    <div id="controls">
      <img src="@/assets/LittleAppleLogo.png">
      <div id="results">
        <pre><h2>{{ locationInfo }}</h2></pre>
      </div>
      <button :style="buttonStyle">Confirm Choices</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      locationInfo: "Locations Added: \nOpen Space Lost: \nIndividuals Served: \n(XX% food insecure)",
      buttonImage: require('@/assets/ButtonBG.png'),
      buttonHover: require('@/assets/ButtonHOV.png'),
    };
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
  margin-left: 10px;
  flex-direction: column;
  align-items: left;
  justify-content: left;
  width: 95vw;
  height: 92vh;
  background-color: yellow;
  border-radius: 1rem;
  box-shadow: 3px 3px grey;
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
}

#results{
  height: 8vw;
  width: 23vw;
  margin-top: 2vh;
  background-color: rgb(210, 239, 210);
  padding: none;
  border-radius: 1rem;
  box-shadow: 3px 3px grey;
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
