<template>
  <div>
    <b-button @click="goToUserPage()" variant="primary m-3" size="md">Back to profile page</b-button>
    <line-chart v-if="loaded===true" :chart-data="datacollection" :options="options"></line-chart>

    <div class="d-flex">
      <b-dropdown text="Select Year" class="m-3" size="lg">
        <b-dropdown-item @click="selectedYear=2020; updateChart()">2020</b-dropdown-item>
        <b-dropdown-item @click="selectedYear=2021; updateChart()">2021</b-dropdown-item>
      </b-dropdown>
      <b-form-input
          class="m-3 selected-year"
          size="lg"
          readonly
          :value="selectedYear"
      ></b-form-input>
    </div>
  </div>
</template>

<script>
import LineChart from "@/components/LineChart";

export default {
  components: {
    LineChart
  },
  props:{
    id: String
  },
  name: "Statistics",
  data() {
    return {
      stats: null,
      follows:[],
      unfollows:[],
      selectedYear: 2020,
      currentId: 0,
      loaded: false,
      datacollection: null,
      options: null
    }
  },
  mounted() {

  },
  methods: {
    goToUserPage() {
      this.$router.push(`/profilepage/${this.currentId}`)
    },
    getStatistcs() {
      this.$store.dispatch('getStatisticsForUser', {id: this.currentId, year: this.selectedYear})
          .then(response => {
            console.log(response);
            this.loaded = true;
            this.stats = this.$store.getters.getCurrentStats;
            this.follows = this.stats.follows;
            this.unfollows = this.stats.unfollows;
            this.fillOptions();
            this.fillData();
          })
          .catch(error => {
            console.log(error);
          });
    },
    fillData() {
      this.datacollection = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            label: 'Unfollows',
            backgroundColor: '#ee5d5d',
            data: this.unfollows,
          },
          {
            label: 'New followers',
            backgroundColor: '#2b7bff',
            data: this.follows,
          }
        ]
      }
    },
    fillOptions(){
      this.options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }]
        },
        responsive: true,
        maintainAspectRatio: false
      }
    },
    updateChart(){
      this.getStatistcs();
    }
  },
  created() {
    this.$store.dispatch('getSearchedUser', this.id)
        // eslint-disable-next-line no-unused-vars
        .then(response =>{
          console.log("statitcs refreshed")
          this.currentId = this.$store.getters.getSearchedUser.id;
          console.log("curent id"+ this.currentId);
          this.getStatistcs();
        })
        .catch(error =>{
          console.log(error)
        })

  }
}
</script>

<style scoped>
.selected-year{
  width: 150px;
}
</style>