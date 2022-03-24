<template>
  <div class="dashboard">
    <div class="title-container">
        <h1>Gerencie seus patrimônios</h1>
        <router-link to="/newpatrimony" class="btn">Cadastrar Patrimônio</router-link>
    </div>
    <div v-if="patrimonies.length > 0">
      <DataTable :patrimonies="patrimonies" />
    </div>
    <div v-else>
        <p>Você ainda não tem patrimônios cadastrados, <router-link to="/newpatrimony">clique aqui para cadastrar um patrimônio!</router-link></p>
    </div>
  </div>
</template>


<script>
import DataTable from '../components/DataTable'
export default {
    data() {
        return {
            patrimonies: []
        }
    }, 
    components: {
        DataTable
    },
    created() {
        this.getPatrimonies();
    },
    methods: {
        async getPatrimonies() {
            
            const token = this.$store.getters.token;
            await fetch("http://localhost:3000/api/patrimony/userpatrimonies", {
                method: "GET",
                headers: { 
                    "Content-type": "application/json",
                    "auth-token": token
                }
            })
            .then((resp) => resp.json())
            .then((data) => {
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
    .dashboard {
        padding: 50px;
        padding-bottom: 100px;
    }
    .title-container {
        display: flex;        
        align-items: center;
        justify-content: space-between;
        margin-bottom: 40px;
    }
    
    .btn {
        padding: 10px 16px;
        background-color: #000;
        color: #FFF;
        margin: 5px;
        text-decoration: none;
        border: none;
        font-size: 14px;
        cursor: pointer;
        transition: .5s;
    }
    
</style>