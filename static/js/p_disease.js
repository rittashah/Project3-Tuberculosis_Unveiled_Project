// fetch('/api/disease').then(response => response.json()).then(data => {

//     // Extract data from CSV columns
//     var countries = data.map(row => row.Country);
//     var tuberculosis = data.map(row => parseFloat(row.tuberculosis));
//     var diabetes = data.map(row => parseFloat(row.diabetes));
//     var hivTotal = data.map(row => parseFloat(row.HIV_total));

//     // Calculate the average values
//     var avgTuberculosis = calculateAverage(tuberculosis);
//     var avgDiabetes = calculateAverage(diabetes);
//     var avgHivTotal = calculateAverage(hivTotal);

//     // Create the traces for the scatter plots
//     var trace1 = {
//         x: countries,
//         y: tuberculosis,
//         mode: 'markers',
//         type: 'scatter',
//         name: 'Tuberculosis'
//     };

//     var trace2 = {
//         x: countries,
//         y: diabetes,
//         mode: 'markers',
//         type: 'scatter',
//         name: 'Diabetes'
//     };

//     var trace3 = {
//         x: countries,
//         y: hivTotal,
//         mode: 'markers',
//         type: 'scatter',
//         name: 'HIV Total'
//     };

//     // Create the trace for the bar chart
//     var trace4 = {
//         x: ['Tuberculosis', 'Diabetes', 'HIV Total'],
//         y: [avgTuberculosis, avgDiabetes, avgHivTotal],
//         type: 'bar',
//         name: 'Average Value'
//     };

//     // Create the layout for the scatter plots
//     var layout1 = {
//         title: 'Scatter Plots',
//         xaxis: { title: 'Country' },
//         yaxis: { title: 'Value' }
//     };

//     // Create the layout for the bar chart
//     var layout2 = {
//         title: 'Average Values',
//         xaxis: { title: 'Parameter' },
//         yaxis: { title: 'Average Value' }
//     };

//     // Create the data array for the scatter plots
//     var scatterData = [trace1, trace2, trace3];

//     // Create the data array for the bar chart
//     var barData = [trace4];

//     // Render the scatter plots
//     Plotly.newPlot('scatterDChart', scatterData, layout1);

//     // Render the bar chart
//     Plotly.newPlot('barDChart', barData, layout2);
// });

// // Function to calculate the average value
// function calculateAverage(array) {
//     var sum = array.reduce((acc, val) => acc + val, 0);
//     var average = sum / array.length;
//     return average;
// }

    const response =  fetch('/api/disease').then(res=>res.blob).then(r=>{

        console.log(r)
    });
    // Here is the significant part 
    // reading the stream as a blob instead of json

