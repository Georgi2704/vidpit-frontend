<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins
export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    chartdata: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  data(){
    return{
      stats: null,
      follows:[],
      unfollows:[],
      design:{
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
      },
      oldData:{
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
    }
  },
  methods:{
    // renderTheChart(){
    //   this.renderChart(this.chartData,this.options)
    // }
  },
  mounted () {
    this.stats = this.$store.getters.getCurrentStats;
    this.follows = this.stats.follows;
    this.unfollows = this.stats.unfollows;
    // Overwriting base render method with actual data.
    this.renderChart(this.chartData,this.options)
  }
}
</script>

<style scoped>

</style>