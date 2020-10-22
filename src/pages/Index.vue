<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card card-size" v-for="book in allBooks" :key="book._id">
        <q-card-section>
          <q-img :src="book.cover" >
            <p class="absolute-top-right defau-label" :class="{ 'avai-label' : book.status == 1, 'notavai-label' : book.status == 2 }">
              {{states_dictionary[book.status]}}
            </p>
          </q-img>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">{{book.title}}</div>
          <div class="text-subtitle2">{{book.author}}</div>
        </q-card-section>

        <q-expansion-item>
          <template v-slot:header>
            <q-item-section class="text-weight-bold">
              About
            </q-item-section>
          </template>
          <q-card-section>
            <div class="text-caption">{{book.description}}</div>
          </q-card-section>
        </q-expansion-item>

        <q-card-actions>
          <div v-if="book.status == 1">
            <q-btn color="secondary" icon-right="event" label="Reserve" @click="openForm($event, book)" />
          </div>
        </q-card-actions>
      </q-card>

      <q-dialog v-model="openDialog" persistent>
        <q-card style="min-width: 350px" class="q-pa-md q-gutter-md">
          <q-card-section style="margin-top:5px; padding:5px 10px">
            <div class="text-h4">Reservation Request</div>
            <div class = "text-h5">{{selectedBook.title}}</div>
          </q-card-section>
          <q-card-section style="margin-top:5px; padding:5px 10px">
            <div class="text-h5">Enter Your Details</div>
          </q-card-section>
          <q-card-section style="margin-top:5px; padding:5px 10px">
            <q-form class="q-gutter-sm">
              <q-input filled 
                ref="studentNumber" v-model="formDetails.studentNumber"
                label="Student Number*" stack-label :dense="dense"
                :rules="[val => !!val || 'Field is required']" lazy-rules />
              <p class="text-h6">Preferred Delivery Method</p>
              <q-radio dense v-model="formDetails.collectionMethod" val="Pick up" label="Pick up" />
              <q-radio dense v-model="formDetails.collectionMethod" val="Delivery" label="Delivery" />
            </q-form>
          </q-card-section>
          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Next" @click="onNext" type="next"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import BackendService from "../BackendService";
export default {
  name: 'PageIndex',
  data(){
    return {
      formDetails: {
        email: '',
        studentNumber: '',
        collectionMethod: 0,
        error: false
      },
      dense: false,
      service: new BackendService(),
      allBooks: [],
      books: [],
      states_dictionary:{ 
        1:"AVAILABLE", 
        2:"UNAVAILABLE"
      },
      selectedBook: {},
      openDialog: false,
      accept: false
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
  },
  methods: {
    onNext () {
      this.$refs.studentNumber.validate();

      if (this.$refs.studentNumber.hasError) {
        this.formDetails.error = true;
      } else if (this.accept !== true) {
        this.$q.notify({
          color: 'negative',
          message: 'You need to accept the license and terms first'
        })
      } else {
        this.$q.notify({
          icon: 'done',
          color: 'positive',
          message: 'Submitted'
        })
      }
    },
    openForm(ev, book) {
      console.log(book);
      this.selectedBook = book;
      this.openDialog = true;
    }
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
