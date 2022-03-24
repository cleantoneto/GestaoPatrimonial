<template>
  <div class="data-container">
      <Message :msg="msg" :msgClass="msgClass" />
      <div class="data-table-heading">
          <div class="data-id-heading">Nº:</div>
          <div class="data-title-heading">Nome do Patrimônio:</div>
          <div class="data-title-heading">Código do Patrimônio:</div>
          <div class="data-actions-heading">Ações:</div>
      </div>
      <div class="data-table-body">
        
        <div class="data-row" v-for="(patrimony, index) in patrimonies" :key="patrimony._id">
            <div class="data-id-container">{{ index + 1 }}</div>
            <div class="data-title-container">
                <!--Mudar o _id pra patrimony.code nas 3 opções -->
                <router-link :to="`/patrimony/${patrimony._id}`">{{ patrimony.title }}</router-link>
            </div>
             <div class="data-title-container">
                <router-link :to="`/patrimony/${patrimony._id}`">{{ patrimony.patrimonyCode }}</router-link>
            </div>
            <div class="data-actions-container">
                <router-link :to="`/editpatrimony/${patrimony._id}`" class="edit-btn">Atualizar</router-link>
                
                
                <!-- <button class="remove-btn" @click="remove(patrimony._id)">Remover</button>  -->
            </div>
        </div>

      </div>
  </div>
</template>



<script>
import Message from './Message';

export default {
    name:"DataTable",
    props:["patrimonies"],
    components:{
        Message
    },
    data() {
      return {
        msg: null,
        msgClass: null,
      }
  },
  methods: {
    async remove(id) {
       
        const userId = this.$store.getters.userId;
        const token = this.$store.getters.token;
        const data = {
            id: id,
            userId: userId
        }
        const jsonData = JSON.stringify(data);
        await fetch(`http://localhost:3000/api/patrimony`, {
            method: "DELETE",
            headers: { 
                "Content-type": "application/json",
                "auth-token": token 
            },
            body: jsonData
        })
        .then((resp) => resp.json())
        .then((data) => {
            if(data.error) {
                this.msg = data.error;
                this.msgClass = "error";
            } else {
                this.msg = data.msg;
                this.msgClass = "success";
            }
            setTimeout(() => {
                this.msg = null;  
                
                //recuperar patrimonios
                this.$parent.getPatrimonies();
                
            }, 1000);
        })
        .catch((err) => {
            console.log(err);
        })
    }
        
    }
    
}


</script>

<style scoped>
    .data-table-heading, .data-row {
        display: flex;
        align-items: center;
        height: 50px;
        border-bottom: 1px solid #CCC;
    }
    .data-table-heading div, .data-row div {
        flex: 1 1 0;
    } 
    .data-id-heading, .data-id-container {
        max-width: 50px
    }
    .edit-btn, .remove-btn {
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
    .edit-btn {
        background-color: #007bff;
    }
    .edit-btn:hover {
        background-color: #0069d9;
    }
    .remove-btn {
        background-color: #dc3545;
    }
    .remove-btn:hover {
        background-color: #c82333;
    }
</style>