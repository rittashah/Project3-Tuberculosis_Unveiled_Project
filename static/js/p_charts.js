
fetch('/api/charts_data').then(response => response.json()).then(data => {


   // Plotly.d3.json('samples.json',
   //  function(err, data) {
   //     if (err) throw err;
   // console.log(data);
   var funnelY1 = data.map(row => row.Country);
   var funnelY2 = data.map(row => parseFloat(row.smoking_male));
   var funnelX = data.map(row => parseFloat(row.smoking_female));
   var violinY2 = data.map(row => parseFloat(row.HIV_male));
   var violinX = data.map(row => parseFloat(row.HIV_female));

   var avgsmoking_male = calculateAverage(funnelY2);
   var avgsmoking_female = calculateAverage(funnelX);
   var avgHivmale = calculateAverage(violinY2);
   var avgHivfemale = calculateAverage(violinX);


   var trace1 = {
     x: funnelY1,
     y: funnelY2,
     mode: 'markers',
     type: 'scatter',
     name: 'Smoking Male'
   };

   var trace2 = {
     x: funnelY1,
     y: funnelX,
     mode: 'markers',
     type: 'scatter',
     name: 'Smoking Female'
   };

   var trace3 = {
     x: funnelY1,
     y: violinY2,
     mode: 'markers',
     type: 'scatter',
     name: 'HIV Male'
   };

   var trace5 = {
     x: funnelY1,
     y: violinX,
     mode: 'markers',
     type: 'scatter',
     name: 'HIV Female'
   };


   var trace4 = {
     x: ['smoking_male', 'smoking_female', 'HIV_male', 'HIV_female'],
     y: [avgsmoking_male, avgsmoking_female, avgHivmale, avgHivfemale],
     type: 'bar',
     name: 'Average Value'
   };


   var layout1 = {
     title: 'Scatter Plots',
     xaxis: { title: 'Country' },
     yaxis: { title: 'Value' }
   };


   var layout2 = {
     title: 'Average Values',
     xaxis: { title: 'Parameter' },
     yaxis: { title: 'Average Value' }
   };


   var data
   var scatterData = [trace1, trace2, trace3, trace5];


   var barData = [trace4];


   Plotly.newPlot('scatterChart', scatterData, layout1);


   Plotly.newPlot('barChart', barData, layout2);
 });


 function calculateAverage(array) {
   var sum = array.reduce((acc, val) => acc + val, 0);
   var average = sum / array.length;
   return average;
 }