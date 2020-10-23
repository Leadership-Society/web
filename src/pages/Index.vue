<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card card-size" v-for="book in allBooks" :key="book._id">
        <q-card-section>
          <q-img :src="book.cover">
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
            <q-btn unelevated color="secondary" icon-right="event" label="Reserve" @click="openForm($event, book)" />
          </div>
        </q-card-actions>
      </q-card>

      <q-dialog v-model="openDialog" persistent>
        <q-stepper v-model="step" animated ref="stepper">
          <!-- Enter your details -->
          <q-step :name="1" title="Your Details" :done="step > 1">
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
                <div class="text-h6">
                    Preferred Delivery Method
                    <q-icon name="help">
                      <q-tooltip anchor="center right" self="center left">
                        <p class="caption q-mb-xs">How you would like to receive your book.</p>
                        <p class="caption q-mb-xs">Pickup: Collect your book from a member of the committee in a public location</p>
                        <p class="caption q-mb-xs">Delivery: The book will be hand-delivered to your accommodation</p>
                      </q-tooltip>
                    </q-icon>
                </div>
                <q-radio dense v-model="formDetails.collectionMethod" val="pickup" label="Pick up" />
                <q-radio dense v-model="formDetails.collectionMethod" val="delivery" label="Delivery" />
              </q-form>
            </q-card-section>
          </q-step>

          <!-- Delivery details -->
          <q-step :name="2" title="Delivery Details" :done="step > 2" :disable="formDetails.collectionMethod == 'pickup'">
            <q-card-section style="margin-top:5px; padding:5px 10px">
              <div class="text-h4">Delivery</div>
            </q-card-section>
            <q-card-section style="margin-top:5px; padding:5px 10px">
              <div class="text-h5">Enter Your Address</div>
            </q-card-section>
            <q-card-section style="margin-top:5px; padding:5px 10px">
              <q-form class="q-gutter-xs">
                <q-input filled dense
                  ref="line1" v-model="formDetails.address.line1"
                  label="Line 1*" stack-label :rules="[val => !!val || 'Field is required']" />

                <q-input filled dense
                  ref="line2" v-model="formDetails.address.line2"
                  label="Line 2" stack-label :rules="[null || '']" />

                <q-input filled dense
                  ref="postcode" v-model="formDetails.address.postcode"
                  label="Postcode*" stack-label :rules="[val => !!val || 'Field is required']" />

                <q-input filled dense prefix="+44" mask="##########"
                  ref="phone" v-model="formDetails.address.phoneNumber" type="tel"
                  label="Phone Number*" stack-label :rules="[val => !!val || 'Field is required']" />
                  
                <q-input filled dense
                  ref="note" v-model="formDetails.deliveryNote"
                  label="Delivery Notes" stack-label type="textarea" />
              </q-form>
            </q-card-section>
          </q-step>

          <!-- Confirm -->
          <q-step :name="3" title="Confirm Details">
            <q-card-section style="margin-top:5px; padding:5px 10px">
              <div class="text-h4">Confirm Your Details</div>
            </q-card-section>
            <q-card-section>
                <p class="text-h5">Your Book</p>
                <p>{{selectedBook.title}}</p>
                <q-img :src="selectedBook.cover" style="width: 100%; max-width: 200px"/>
            </q-card-section>
            <q-separator />
            <q-card-section style="margin-top:5px; padding:5px 10px">
              <div v-if="formDetails.collectionMethod == 'pickup'">
                <div style="margin:14px;padding:5px;">
                  <p class="text-h5">Your Details</p>
                  <p class="caption q-mb-sm">Your Student Number: {{ formDetails.studentNumber }}</p>
                  <p class="caption q-mb-sm">Delivery Method: Pickup</p>
                </div>
                <q-separator />
                <div style="margin:14px;padding:5px;">
                  <p class="caption q-mb-sm">
                    We don't need any more details from you. Once you submit your request,
                    we will contact you using your university email and arrange a date, time,
                    and location for you to pick up your book.
                  </p>
                  <p class="caption q-mb-sm">
                    We will also include details on how to return the book once you are finished
                    with it.
                  </p>
                </div>
              </div>
              <div v-if="formDetails.collectionMethod == 'delivery'">
                <div style="margin:14px;padding:5px;">
                  <p class="text-h5">Your Details</p>
                  <p class="caption q-mb-sm">Your Student Number: {{ formDetails.studentNumber }}</p>
                  <p class="caption q-mb-sm">Delivery Method: Delivery</p>
                  <p class="caption q-mb-sm">Line 1: {{ formDetails.address.line1 }}</p>
                  <p class="caption q-mb-sm" v-if="formDetails.address.line2">Line 2: {{ formDetails.address.line2 }}</p>
                  <p class="caption q-mb-sm">Postcode: {{ formDetails.address.postcode }}</p>
                  <p class="caption q-mb-sm">Phone Number: {{ formDetails.phoneNumber }}</p>
                  <div v-if="formDetails.deliveryNote">
                    <p class="caption q-mb-sm">Delivery Notes:</p>
                    <p class="caption q-mb-sm">{{ formDetails.deliveryNote }}</p>
                  </div>
                </div>
                <q-separator />
                <div style="margin:14px;padding:5px;">
                  <p class="caption q-mb-sm">
                    Once we process your request, we will let you know when your book will
                    be delivered via your university email. If there are any issues, please
                    contact us at <a href="mailto:leadershipncl@gmail.com">leadershipncl@gmail.com</a>
                  </p>
                  <p class="caption q-mb-sm">
                    We will also include details on how to return the book once you are finished
                    with it.
                  </p>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <p class="text-h5">Terms and Conditions</p>
              <p>Read our Terms and Conditions here: <a href="http://bit.ly/LLTermsAndConditions">http://bit.ly/LLTermsAndConditions</a></p>
              <p class="caption q-mb-sm">
                If you wish to go forward with your reservation, please read and agree to the Terms and Conditions above.
                It covers the rules for borrowing books from the Leadership Library, and details about how we
                store and manage any data we collect about you. If you have any questions or issues about our Terms and
                Conditions, then please contact us at <a href="mailto:leadershipncl@gmail.com">leadershipncl@gmail.com</a>.
              </p>
              <q-checkbox label="I've read and accepted the Terms and Conditions" v-model="termsAndConditionsAccepted" />
            </q-card-section>
          </q-step>

          <template v-slot:navigation>
            <q-stepper-navigation class="row">
              <div class="col-6">
                <q-btn unelevated @click="cancel" color="warning" label="Cancel" class="q-ma-sm" />
              </div>
              <div class="col-6 row justify-end">
                <q-btn flat v-if="step > 1" color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ma-sm col-auto" />
                <q-btn unelevated @click="onNext" color="primary" :label="step === 3 ? 'Finish' : 'Continue'" class="q-ma-sm col-auto" :disable="finishDisabled" />
              </div>
            </q-stepper-navigation>
          </template>
        </q-stepper>
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
        collectionMethod: '', // either 'pickup' or 'delivery'
        address: {
          line1: '',
          line2: '',
          postcode: ''
        },
        deliveryNote: '',
        phoneNumber: ''
      },
      dense: false,
      service: new BackendService(),
      allBooks: [],
      books: [],
      states_dictionary: { 
        1: "AVAILABLE", 
        2: "UNAVAILABLE"
      },
      selectedBook: {},
      openDialog: false,
      termsAndConditionsAccepted: false,
      step: 1,
      error: false
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
      if (this.step == 1) {
        this.validateDetails();
        if (!this.error) {
          if (this.formDetails.collectionMethod == 'pickup') {
            this.$refs.stepper.goTo(3);
          } else if (this.formDetails.collectionMethod == 'delivery') {
            this.$refs.stepper.next();
          }
        }
      } else if (this.step == 2) {
        this.validateDeliveryDetails()
        if (!this.error) {
          this.$refs.stepper.next();
        }
      } else {
        var detailsToSubmit = {
          studentNumber: this.formDetails.studentNumber,
          deliveryType: this.formDetails.collectionMethod,
          bookId: this.selectedBook._id
        }

        if (detailsToSubmit.deliveryType == 'delivery') {
          detailsToSubmit.deliveryAddress = this.formDetails.address;
          detailsToSubmit.phoneNumber = this.formDetails.phoneNumber;
        }

        this.submitDetails(detailsToSubmit);
      }
    },
    openForm(ev, book) {
      this.selectedBook = book;
      this.openDialog = true;
    },
    validateDetails() {
      this.$refs.studentNumber.validate();
      if (this.$refs.studentNumber.hasError) {
        this.formDetails.error = true;
      }
    },
    validateDeliveryDetails() {
      this.$refs.line1.validate();
      this.$refs.postcode.validate();
      this.$refs.phone.validate();

      if (this.$refs.line1.hasError || this.$refs.postcode.hasError || this.$refs.phone.hasError) {
        this.error = true;
      }
    },
    cancel() {
      this.formDetails = {
        email: '',
        studentNumber: '',
        collectionMethod: '',
        address: {
          line1: '',
          line2: '',
          postcode: ''
        },
        deliveryNote: '',
        phoneNumber: ''
      };
      this.openDialog = false;
      this.error = false;
      this.selectedBook = {};
      this.step = 1;
    },
    submitDetails(details) {
      var service = new BackendService();
      service.submitDetails(details)
        .then((res) => {
          if (res) {
            if (res.success) {
              this.cancel();
              this.$q.notify('Your reservation has been made!');
            } else {
              this.cancel();
              this.$q.notify('There was an error submitting your reservation, please contact leadershipncl@gmail.com');
            }
          }
        })
    }
  },
  computed: {
    finishDisabled: function () {
      return this.step == 3 && !this.termsAndConditionsAccepted;
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

.link {
  text-decoration: underline;
}
</style>
