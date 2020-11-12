let csvFile = ["SBC_VMCAMIX_ISBC-01_CISCO_VIC_PERF_20201022-200208.csv"]
let mediaURL = "https://perfanalyzer.rbbn.com/media/user/file_upload/"



const attributeSelect = document.getElementById("attributeSelect");
const singleSelectDownload = document.getElementById("singleSelectDownload");
singleSelectDownload.addEventListener('click', (e) => {
  let filePath = document.getElementById("csvPath");
    if (filePath.value === null) {
        alert("Please select a CSV file to proceed !!!")
    } else {
        e.target.href = filePath.value;
    }
});
document.getElementById("singleSelect").addEventListener('click', () => {
  let filePath = document.getElementById("csvPath");
    if (filePath.value === null) {
        attributeSelect.style.display = "none";
        document.getElementById("wrapper").style.display = "none";
        alert("Please select a CSV file to proceed !!!")
    } else {
        let csv_path = filePath.value;
        // Request data using D3
        d3
  .csv(csv_path)
  .then(makeChart);
        attributeSelect.style.display = "block";
    }
});    

function makeChart(csvObjects) {
  
    function get_random_color() {
        function c() {
          var hex = Math.floor(Math.random()*256).toString(16);
          return ("0"+String(hex)).substr(-2); // pad with zero
        }
        return "#"+c()+c()+c();
      }
      
  let index = 0
  let Labels = csvObjects.map(function(d) {
    index = index + 1;
    return `${d[Object.keys(d)[0]]}-[${index}]`;
    
  });
  
  let chartObj = {};
  Object.keys(csvObjects[0]).forEach((obj_key) => {
    let resultArray = [];
    resultArray = csvObjects.map(function(d) {   
      return `${d[obj_key]}`;
    });
    //console.log(obj_key)
    //chartObj.push({[obj_key]: resultArray});
    chartObj[obj_key] = resultArray;
  });

  let csvData = csvObjects.map(function(d) { 
      //console.log(Object.keys(d)) try and add it as options

      let key_id = Object.keys(d)[1]  
    return `${d[key_id]}`;
  });


  document.getElementById("attributeSelect").innerHTML = '';
    document.getElementById("attributeSelect").innerHTML = '<div id="app" class="col-xs-11">\n' +
        '                <multiselect\n' +
        '                v-model="value"\n' +
        '                placeholder="Searchable multi select csv column attributes"\n' +
        '                :options="options"\n' +
        '                :multiple="true"\n' +
        '                :custom-label="customLabel"\n' +
        '                >\n' +
        '              </multiselect>\n' +
        '            </div>\n' +
        '            <div class="col-xs-1">\n' +
        '                <button id="multiSelectChart" class="btn btn-primary">Visualize</button>\n' +
        '            </div>';
  //Vue Multiselect
  let myVueSelect = new Vue({
    delimiters: ['{', '}'],
    el: '#app',
    components: {
    Multiselect: window.VueMultiselect.default
    },
    data: {
    value: null,
    options: Object.keys(csvObjects[0]).slice(1,)
    },
  methods: {
    customLabel (option) {
      return `${option}`
    }}
}).$mount('#app')  


//Range Slider
const rangeSlider = document.querySelector('.rangeSlider');
const chartWrapper = document.getElementById("wrapper");
chartWrapper.style.display = "none";
document.getElementById("multiSelectChart").addEventListener('click', () => {
    if (myVueSelect.value === null || myVueSelect.value.length === 0) {
        chartWrapper.style.display = "none";
        alert("Please select some attributes to proceed !!!")
    } else {
        //console.log(myVueSelect.value)
        chartWrapper.style.display = "block";

        //Charting
        dataSetArray = [];
        myVueSelect.value.forEach((attribute) => {
            let colorSelect = get_random_color();
            dataSetArray.push({
              label: attribute,  
              data: chartObj[attribute],
              //backgroundColor: colorSelect,
              borderColor: colorSelect,
              borderWidth: 1,
              fill: false
            })
        });
        document.getElementById("chartContainer").innerHTML = '&nbsp;';
    document.getElementById("chartContainer").innerHTML = '<canvas id="chart"></canvas>';
    let chart = new Chart('chart', {
        type: "line",
        options: {
          
        },
        data: {
          labels: Labels.slice(leftRangeVal.value-1, rightRangeVal.value),
          datasets: dataSetArray,
        }
      }); 

      let statsInject = document.querySelector('.injectStats');
      statsInject.innerHTML = '';
      //Stats
      myVueSelect.value.forEach((attribute, index) => {
        statsInject.innerHTML += `
          <tr>
            <th scope="row">${index+1}</th>
            <td>${attribute}</td>
            <td>${Math.min.apply(null, chartObj[attribute])}</td>
            <td>${Math.max.apply(null, chartObj[attribute])}</td>
            <td>${(math.mean(chartObj[attribute]).toFixed(2))}</td>
          </tr>
      `;
      });
    }
    
});
const leftRangeVal = document.querySelector('.rangeA');
const rightRangeVal = document.querySelector('.rangeB');
rightRangeVal.setAttribute('max', Labels.length);
leftRangeVal.value = 1;
rightRangeVal.value = rightRangeVal.getAttribute('max');

rangeSlider.addEventListener('click', (e) => {

    //Charting
    dataSetArray = [];
    myVueSelect.value.forEach((attribute) => {
        let colorSelect = get_random_color();
        dataSetArray.push({
          label: attribute,  
          data: chartObj[attribute],
          //backgroundColor: colorSelect,
          borderColor: colorSelect,
          borderWidth: 1,
          fill: false
        })
    });
    
    document.getElementById("chartContainer").innerHTML = '&nbsp;';
    document.getElementById("chartContainer").innerHTML = '<canvas id="chart"></canvas>';
    let chart = new Chart('chart', {
        type: "line",
        options: {
          
        },
        data: {
          labels: Labels.slice(leftRangeVal.value-1, rightRangeVal.value),
          datasets: dataSetArray,
        }
      }); 

      //Added code to inject Chart Stats
      let statsInject = document.querySelector('.injectStats');
      statsInject.innerHTML = '';
      //Stats
      myVueSelect.value.forEach((attribute, index) => {
        statsInject.innerHTML += `
          <tr>
            <th scope="row">${index+1}</th>
            <td>${attribute}</td>
            <td>${Math.min.apply(null, chartObj[attribute].slice(leftRangeVal.value-1, rightRangeVal.value))}</td>
            <td>${Math.max.apply(null, chartObj[attribute].slice(leftRangeVal.value-1, rightRangeVal.value))}</td>
            <td>${(math.mean(chartObj[attribute].slice(leftRangeVal.value-1, rightRangeVal.value)).toFixed(2))}</td>
          </tr>
      `;
      });      
})
}


    

