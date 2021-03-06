function buildMetadata(sample) {
  console.log(sample);
  let url = "/metsdata/" + sample;
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

    let $sampleMetadata = document.getElementById("sample=metadata");
      d3.json(url).then(function(response) {
      console.log(response);
      let items = Object.entries(response);
        for (let i=0; i<items.length; i++ ) {
          $p.html = ("");
          let $p = document.createElement("p");
          $p.setAttribute("class", "center-text");
          $p.innerHTML = `${items[i]}:${response[items[i]]}`;
          $sampleMetadata.appendChild($p);
        };
      })
}

function buildCharts(sample) {
  console.log(sample);
  let sampleurl = "/samples/" + sample;

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json(sampleurl).then(function(data) {
    console.log(data);
  
    // @TODO: Build a Bubble Chart using the sample data
    let bubbledata = [{
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: 'markers',
      marker: {
        size: data.sample_values,
        color: data.otu_ids
      }
    }];

    let bubblelayout = {
      margin: { t:0, 1:0 }
    };

    Plotly.newPlot("bubble", bubbledata, bubblelayout);


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    let piedata = [{
      labels: data.otu_ids.slice(0,10),
      values: data.sample_values.slice(0,10),
      hovertext: data.otu_labels,
      type: "pie"
    }];

    let pielayout = {
      margin: { t:0, 1:0 }
    };

    Plotly.newPlot("pie", piedata, pielayout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
