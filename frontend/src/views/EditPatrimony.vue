<template>
  <div class="editpatrimony">
    <h1>Atualize o Patrimônio:</h1>
    <PatrimonyForm2 :patrimony="patrimony" page="editpatrimony" btnText="Editar Patrimônio" :key="componentKey"  />
  </div>
</template>

<script>
import PatrimonyForm2 from '../components/PatrimonyForm2.vue'

export default {
 components: {
        PatrimonyForm2
    },
    data() {
        return {
            patrimony: {},
            componentKey: 0
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
                this.patrimony.photos.forEach((photo, index) => {
                    this.patrimony.photos[index] = photo.replace("public", "http://localhost:3000");
                });
                this.componentKey += 1;
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }
    
}
</script>


<style scoped>
    .editpatrimony {
        text-align: center;
        padding-top: 40px;
        padding-bottom: 100px;
    }
    .editpatrimony h1 {
        margin-bottom: 40px;
    }
</style>