<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card card-size" v-for="book in allBooks" :key="book">
        <q-card-section>
          <q-img :src="book.cover" >
            <span v-if="book.status == 1">
              <p class="absolute-top-right defau-label avai-label">
                {{states_dictionary[book.status]}}
              </p>
            </span>
            <span v-else-if="book.status == 2">
              <p class="absolute-top-right defau-label notavai-label">
                {{states_dictionary[book.status]}}
              </p>
            </span>
             <span v-else>
              <p class="absolute-top-right defau-label">
                {{states_dictionary[book.status]}}
              </p>
            </span>
          </q-img>
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
      books: [],
      states_dictionary:{ 
        1:"AVAILABLE", 
        2:"UNAVAILABLE", 
        3:"QUARANTINED"
      }
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
  max-width: 250px;
}

.defau-label{
  padding: 5px 10px;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  margin: 5px;
  font-size: 0.7em;
}
.notavai-label {
  background-color:red;
}

.avai-label {
  background-color:rgb(43, 190, 23);
}
</style>
