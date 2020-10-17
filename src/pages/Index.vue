<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card card-size" v-for="book in allBooks" :key="book">
        <q-card-section>
          <q-img :src="book.cover"  />
        </q-card-section>

        <q-card-section>
          <div class="text-h6">{{book.title}}</div>
          <div class="text-subtitle2">{{book.author}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{}}
        </q-card-section>

        <q-card-actions>
          <q-btn flat>Action 1</q-btn>
          <q-btn flat>Action 2</q-btn>
        </q-card-actions>
        
      </q-card>
    </div>
  </q-page>
</template>

<script>
import BackendService from "../BackendService";
export default {
  name: 'PageIndex',
  data(){
    return {
      service: new BackendService(),
      allBooks: [],
      books: []
    };
  },
  created() {
    var service = new BackendService();

    service.getAllBooks()
      .then((res) => {
        if (res) {
          this.allBooks = res;
          this.books = Array.from(this.allBooks);
        } 
      })
      .catch((err) => {
        if (err) {
          alert(err.message);
          }
      })
  }
}
</script>
<style scoped>
.card-size{
  width:100%;
  max-width: 500px;
}
</style>
