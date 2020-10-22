<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card card-size" v-for="book in allBooks" :key="book">
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
            <q-btn color="secondary" icon-right="event" label="Reserve"  @click="reserve = true" />
            <q-dialog v-model="reserve" persistent>
              <q-card style="min-width: 350px">
                <q-card-section>
                  <div class="text-h6">Reservation Request</div>
                  <div class = "text-h7">{{book.title}}</div>
                </q-card-section>
                <q-card-section>
                  <div class="text-h7">Fill out the following form to submit your request</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <q-input filled v-model="forename" label="Forename*" stack-label :dense="dense" :rules="[val => !!val || 'Field is required']" />
                </q-card-section>
                  <q-card-section class="q-pt-none">
                  <q-input filled v-model="surname" label="Surname*" stack-label :dense="dense" :rules="[val => !!val || 'Field is required']" />
                </q-card-section>
                  <q-card-section class="q-pt-none">
                  <q-input filled v-model="studentNumber" label="Student Number*" stack-label :dense="dense" :rules="[val => !!val || 'Field is required']" />
                </q-card-section>
              <q-card-section>
              <div class = "text-h6">Preferred Collection Method</div>
              <div class="q-gutter-sm">
                <q-radio dense v-model="collection" val="Pick up" label="Pick up" />
                <q-radio dense v-model="collection" val="Delivery" label="Delivery" />
              </div>
              </q-card-section>
                <q-card-actions align="right" class="text-primary">
                  <q-btn flat label="Cancel" v-close-popup />
                  <q-btn flat label="Next" v-close-popup type="next"/>
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
          <div v-else>
            <q-btn color="red" icon-right="send"  label="Notify" @click="notify = true"/>
            <q-dialog v-model="notify" persistent>
                <q-card style="min-width: 350px">
                  <q-card-section>
                    <div class="text-h6">{{book.title}} is not currently in the library. Enter your email to be notified when it is available:</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-input dense v-model="email" autofocus @keyup.enter="prompt = false" />
                  </q-card-section>

                  <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Submit" v-close-popup />
                  </q-card-actions>
                </q-card>
              </q-dialog>
          </div>
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
      notify: false,
      reserve: false,
      //validDetails: false,
      email: '',
      forename: '',
      surname: '',
      collection: '',
      dense: false,
      studentNumber: '',
      service: new BackendService(),
      allBooks: [],
      books: [],
      states_dictionary:{ 
        1:"AVAILABLE", 
        2:"UNAVAILABLE"
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
  },
  methods: {
    onNext () {
      this.$refs.forename.validate()
      this.$refs.email.validate()

      if (this.$refs.name.hasError || this.$refs.age.hasError) {
        this.formHasError = true
      }
      else if (this.accept !== true) {
        this.$q.notify({
          color: 'negative',
          message: 'You need to accept the license and terms first'
        })
      }
      else {
        this.$q.notify({
          icon: 'done',
          color: 'positive',
          message: 'Submitted'
        })
      }
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
