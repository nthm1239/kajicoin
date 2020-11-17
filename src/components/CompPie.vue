<script>
import { Pie, mixins } from 'vue-chartjs'
import 'chartjs-plugin-colorschemes'

export default {
  name: 'PieChart',
  mixins: [Pie, mixins.reactiveProp],
  extends: Pie,
  props: ['options'],
  mounted() {
    this.renderChart(this.data, this.options)
  }
}
</script>