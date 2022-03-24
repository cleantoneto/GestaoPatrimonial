<template>
  <div class="home">
    <h1>Patrimônios Recentes</h1>
    <div class="patrimonies-container">
        <div v-for="(patrimony, index) in patrimonies" :key="index" class="patrimony-container">
            <div class="patrimonies-img" :style="{'background-image': 'url(' + patrimony.photos[0] +')'}"></div>
            <router-link :to="`/patrimony/${patrimony._id}`" class="patrimonies-title">{{ patrimony.title }}</router-link>
            <p class="patrimonies-date">Código: {{ patrimony.patrimonyCode }}</p>
            <router-link :to="`/patrimony/${patrimony._id}`" class="patrimonies-details-btn">Ver Mais</router-link>
        </div>        
    </div>
    <p v-if="patrimonies.length == 0">Não há patrimônios ainda...</p>
  </div>
</template>


<script>
export default {
    data() {
        return {
            patrimonies: []
        }
    },
    created() {
     
        this.getPatrimonies();
    },
    methods: {
        async getPatrimonies() {
            await fetch(`http://localhost:3000/api/patrimony/all`, {
                method: "GET",
                headers: { 
                    "Content-type": "application/json"
                }
            })
            .then((resp) => resp.json())
            .then((data) => {
                data.patrimonies.forEach((patrimony, index) => {
                    if(patrimony.patrimonyDate) {
                        patrimony.patrimonyDate = new Date(patrimony.patrimonyDate).toLocaleDateString();
                    }
                     //if(patrimony.photos.length > 0){
                        patrimony.photos.forEach((photo, index) => {
                        patrimony.photos[index] = photo.replace("public", "http://localhost:3000").replaceAll("\\", "/");
                    
                    });
                    //}
                });
                this.patrimonies = data.patrimonies;
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }
}
</script>

<style scoped>
    .home {
        text-align: center;
        padding-top: 40px;
        padding-bottom: 100px;
    }
    .home h1 {
        margin-bottom: 40px;
    }
    .patrimonies-container {
        display: flex;
        flex-wrap: wrap;
        max-width: 1000px;
        margin: 0 auto;
    }
    .patrimony-container {
        width: 30%;
        margin: 1.5%;
        display: flex;
        flex-direction: column;
    }
    .patrimonies-img {
        width: 100%;
        height: 200px;
        margin-bottom: 12px;
        background-position: center;
        background-size: cover;
    }
    .patrimonies-title {
        color: #25282e;
        text-decoration: none;
        margin-bottom: 12px;
    }
    .patrimonies-date {
        color: #777;
        margin-bottom: 12px;
    }
    .patrimonies-details-btn {
        width: 100%;
        text-transform: uppercase;
        color: #fff;
        background-color: #25282e;
        transition: .5s;
        border: 0;
        padding: 12px;
        text-decoration: none;
        text-align: center;
    }
    .patrimonies-details-btn:hover {
        background-color: #141619;
    }
    
    #patrimonies-1 {
        background-image: url('/img/patrimonies1.jpg');
    }
    #patrimonies-2 {
        background-image: url('/img/patrimonies2.jpg');
    }
    #patrimonies-3 {
        background-image: url('/img/patrimonies3.jpg');
    }
    #patrimonies-4 {
        background-image: url('/img/patrimonies4.jpg');
    }
</style>