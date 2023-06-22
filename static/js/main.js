function showDiv(select) {

    if (select.value == 1) {
        
      document.getElementById('dynamicCharts').style.display = "block";
      document.getElementById('disease').style.display = "none";
      document.getElementById('scatterChart').style.display = "none";
      document.getElementById('barChart').style.display = "none";
      document.getElementById('map').style.display = "none";

    }
    else if (select.value == 2) {
      document.getElementById('disease').style.display = "block";
      document.getElementById('dynamicCharts').style.display = "none";
      document.getElementById('scatterChart').style.display = "none";
      document.getElementById('barChart').style.display = "none";
      document.getElementById('map').style.display = "none";

    }
    else if (select.value == 3) {
      document.getElementById('scatterChart').style.display = "block";
      document.getElementById('dynamicCharts').style.display = "none";
      document.getElementById('disease').style.display = "none";
      document.getElementById('barChart').style.display = "none";
      document.getElementById('map').style.display = "none";

    }
    else if (select.value == 4) {
      document.getElementById('barChart').style.display = "block";
      document.getElementById('scatterChart').style.display = "none";
      document.getElementById('disease').style.display = "none";
      document.getElementById('dynamicCharts').style.display = "none";
      document.getElementById('map').style.display = "none";

    }
    else if (select.value == 5) {
      document.getElementById('map').style.display = "block";
      document.getElementById('barChart').style.display = "none";
      document.getElementById('scatterChart').style.display = "none";
      document.getElementById('disease').style.display = "none";
      document.getElementById('dynamicCharts').style.display = "none";
    }
  } 