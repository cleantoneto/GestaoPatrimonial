<template>
<div>
     <Message :msg="msg" :msgClass="msgClass" />
     <form id="patrimony-form" enctype="multipart/form-data" @submit="page === 'newpatrimony' ? createPatrimony($event) : update($event)">
 <input type="hidden" id="id" name="id" v-model="id">
            <input type="hidden" id="user_id" name="user_id" v-model="user_id">
            <div class="input-container">
                <label for="title">Título do Patrimônio:</label>
                <input type="text" id="title" name="title" v-model="title" placeholder="Digite o título" readonly>
            </div>
            <div class="input-container">
                <label for="description">Descrição:</label>
                <textarea id="description" name="description" v-model="description" placeholder="Digite a descrição" readonly></textarea>
            </div>
            <div class="input-container">
                <label for="patrimony_code">Código do Patrimônio:</label>
                <input type="text" id="patrimony_code" name="patrimony_code" v-model="patrimony_code" placeholder="Digite o código do patrimônio " readonly >
            </div>
             <div class="input-container">
                <label for="patrimony_date">Data de movimentação:</label>
                <input type="text" id="patrimony_date" name="patrimony_date" v-model="patrimony_date" placeholder="Digite a data de movimentação ">
            </div>
            <div class="input-container">
                <label for="locations">Local de Movimentação:</label>
                <input type="text" id="locations" name="locations" v-model="locations" placeholder="Digite o Local">
            </div>
           
            <div v-if="page === 'editpatrimony' && showMiniImages" class="mini-images">
                <p>Imagens atuais:</p>
                <img v-for="(photo, index) in photos" :src="`${photo}`" :key="index">
            </div>
            <div class="input-container checkbox-container">
                <label for="privacy">Patrimônio privado</label>
                <input type="checkbox" multiple id="privacy" name="privacy" v-model="privacy">
            </div>
            <InputSubmit :text="btnText" />
        </form>
    </div>
</template>


<script>
import InputSubmit from './form/InputSubmit'
import Message from './Message'

export default{
    name: "PatrimonyForm",
    data() {
      return {
        id: this.patrimony._id || null,
        title: this.patrimony.title || null,
        description: this.patrimony.description || null,
        locations: this.patrimony.locations || [],
        patrimony_date: this.patrimony.patrimonyDate || [],
        patrimony_code: this.patrimony.patrimonyCode || null,
        photos: this.patrimony.photos || [],
        privacy: this.patrimony.privacy || false,
        user_id: this.patrimony.userId || null,
        msg: null,
        msgClass: null,
        showMiniImages: true,
      }
  },
    props: ["patrimony", "page", "btnText"],
    components: {
    InputSubmit, Message
  },
  methods: {
    async createPatrimony(e) {
        
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', this.title);
        formData.append('description', this.description);
        formData.append('locations', this.locations);
        formData.append('patrimony_date', this.patrimony_date);
        formData.append('patrimony_code', this.patrimony_code);
        formData.append('privacy', this.privacy);
        if(this.photos.length > 0) {
            for (const i of Object.keys(this.photos)) {
                formData.append('photos', this.photos[i])
            }
        }

        const token = this.$store.getters.token;
        await fetch("http://localhost:3000/api/patrimony", {
            method: "POST",
            headers: {
                "auth-token": token
            },
            body: formData
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
                // redirect
                if(!data.error) {                    
                    this.$router.push('dashboard');
                }
                
            }, 2000);
        })
}, 
    onChange(e) {
        this.photos = e.target.files;
        this.showMiniImages = false;
      },
    async update(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('id', this.id);
        formData.append('title', this.title);
        formData.append('description', this.description);
        formData.append('locations', this.locations);
        formData.append('patrimony_date', this.patrimony_date);
        formData.append('patrimonyCode', this.patrimony_code);
        formData.append('privacy', this.privacy);
        formData.append('user_id', this.user_id);
        if(this.photos.length > 0) {
            for (const i of Object.keys(this.photos)) {
                formData.append('photos', this.photos[i])
            }
        }
        
        const token = this.$store.getters.token;
        await fetch("http://localhost:3000/api/patrimony", {
            method: "PATCH",
            headers: {
                "auth-token": token 
            },
            body: formData
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
        })
        .catch((err) => {
            console.log(err);
        })
        setTimeout(() => {
            this.msg = null;     
            
        }, 2000);
    }
  }
}
    
</script>


<style scoped>
    #patrimony-form {
        max-width: 400px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
    }
    .input-container {
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
        text-align: left;
    }
    .input-container label {
        margin-bottom: 10px;
        color: #555;
    }
    .input-container input,
    .input-container textarea {
        padding: 10px;
        border: 1px solid #e8e8e8;
    }
    .checkbox-container {
        flex-direction: row;
    }
    .checkbox-container input[type='checkbox'] {
        margin-left: 12px;
        margin-top: 3px;
    }
    .mini-images {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 0px;
    }
    .mini-images p {
        width: 100%;
        font-weight: bold;
        margin-bottom: 15px;
        text-align: left;
    }
    .mini-images img {
        height: 50px;
        margin-right: 15px;
        margin-bottom: 15px;
    }
    
</style>