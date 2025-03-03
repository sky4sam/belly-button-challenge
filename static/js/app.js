// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let value = metadata.filter(result => result.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select('#sample-metadata');

    // Use `.html("")` to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new tags for each key-value in the filtered metadata
    Object.entries(value[0]).forEach(([key, val]) => {
      panel.append("p")
           .text(`${key}: ${val}`);
    });
  });
}

function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let value = samples.filter(result => result.id == sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = value[0].otu_ids;
    let otu_labels = value[0].otu_labels;
    let sample_values = value[0].sample_values;

    console.log(otu_ids, otu_labels, sample_values);

    // Build a Bubble Chart
    let trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    };

    let layout = {
      title: "Bacteria Per Sample",
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", [trace1], layout);

    // Build the Bar Chart
    let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let xticks = sample_values.slice(0, 10).reverse();
    let labels = otu_labels.slice(0, 10).reverse();

    let trace = {
      x: xticks,
      y: yticks,
      text: labels,
      type: 'bar',
      marker: {
        color: "rgb(166,172,237)"
      },
      orientation: "h"
    };

    let layoutBar = {
      title: 'Top 10 OTUs Present'
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", [trace], layoutBar);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the names field
    let sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    sampleNames.forEach((sample) => {
      dropdownMenu.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    let firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
};

// Initialize the dashboard
init();

