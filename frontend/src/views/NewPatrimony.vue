<template>
  <div class="newpatrimony"  >
    <h1>Cadastre um patrimônio:</h1>
      <PatrimonyForm :patrimony="{}" page="newpatrimony" btnText="Cadastrar Patrimônio!" />
  </div>
</template>

<script>
import PatrimonyForm from '../components/PatrimonyForm.vue'
export default {
 components: {
        PatrimonyForm
    }
    
}
</script>

<style scoped>
    .newpatrimony {
        text-align: center;
        padding-top: 40px;
        padding-bottom: 100px;
    }
    .newpatrimony h1 {
        margin-bottom: 40px;
    }
</style>