<template>
  <div class="patrimony">
    <h1>{{ patrimony.title }}</h1>
    <div class="patrimony-container">
      <div class="patrimony-images" v-if="patrimony.photos">
        <div class="main-image" :style="{'background-image': 'url(' + patrimony.photos[0] +')'}"></div>
        <div class="patrimony-mini-images" v-if="patrimony.photos[1]">
          <div class="mini-image" v-for="(photo, index) in patrimony.photos" :key="index" :style="{'background-image': 'url(' + patrimony.photos[index] +')'}"></div>
        </div>
      </div>
      <div class="patrimony-details">
        <p class="bold">Descrição do Patrimônio:</p>
        <p class="patrimony-description">{{ patrimony.description }}</p>
        <p class="bold">Código do Patrimônio:</p>
        <p class="patrimony-description">{{ patrimony.patrimonyCode }}</p>
        <p class="bold">Histórico de Localizações:</p>
        <p class="patrimony-description">{{ patrimony.locations }}</p>
        <p class="bold">Histórico de Datas de Movimentação:</p>
        <p class="patrimony-date">{{ patrimony.patrimonyDate }}</p>        
      </div>
    </div>
  </div>
</template>
<script>
export default {
components: {
    },
    data() {
        return {
          patrimony: {},
        }
    },
    created() {
      
        this.getPatrimony();
    },
    methods: {
        async getPatrimony() {
         
            const id = this.$route.params.id;
            const token = this.$store.getters.token;
            await fetch(`http://localhost:3000/api/patrimony/${id}`, {
                method: "GET",
                headers: { 
                    "Content-type": "application/json",
                    "auth-token": token 
                }
            })
            .then((resp) => resp.json())
            .then((data) => {
                this.patrimony = data.patrimony;
                //this.patrimony.patrimonyDate = new Date(this.patrimony.patrimonyDate).toLocaleDateString();
                this.patrimony.photos.forEach((photo, index) => {
                  this.patrimony.photos[index] = photo.replace("public", "http://localhost:3000").replaceAll("\\", "/");
                });
                console.log(this.patrimony);
                console.log(this.patrimony.photos);
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }
}
</script>


<style scoped>

</style>

<style scoped>
    .patrimony {
        text-align: center;
        padding-top: 40px;
        padding-bottom: 100px;
        width: 1000px;
        margin: 0 auto;
    }
    .patrimony h1 {
        margin-bottom: 40px;
    }
    .patrimony-container {
      display: flex;
    }
    .patrimony-images {
      width: 380px;
      margin-right: 30px;
    }
    .main-image {
      width: 100%;
      height: 200px;
      background-color: #CCC;
      margin-bottom: 15px;
      background-position: center;
      background-size: cover;
    }
    .patrimony-mini-images {
      display: flex;
      flex-wrap: wrap;
    }
    .mini-image {
      width: 80px;
      height: 80px;
      margin-right: 15px;
      background-color: #CCC;
      margin-bottom: 15px;
      background-position: center;
      background-size: cover;
    }
    .patrimony-details {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .bold {
      font-weight: bold;
      margin-bottom: 12px;
    }
    .patrimony-description, .patrimony-date {
      margin-bottom: 20px;
    }
</style>