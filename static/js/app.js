let sampleURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(sampleURL).then(data => console.log(data));

function init() {

    // Use D3 to select the dropdown menu
    let dropdown = d3.select("#selDataset");

    // Fetch the JSON data
    d3.json(sampleURL).then((data) => {    

    // array for names 
    let names = data.names;

    // console log to check for names selection
    console.log(names);

    // Iterate through the names array and append to the dropdown
    names.forEach((name) => {
        dropdown.append("option").text(name).property("value", name);
    });

    // Assign the first name to name variable
    let first = names[0];

    // Call the functions to make each chart
    bar(first);
    bubble(first);
    demographics(first);
    });
}

// function to display bar graph
function bar(selection) {
    // Fetch the JSON data
    d3.json(sampleURL).then((data) => {

    // An array of sample objects
    let samples = data.samples;

    // Filter data where id = selected value 
    let filteredData = samples.filter((sample) => sample.id === selection);

    // Assign the first object to obj variable
    let first = filteredData[0];
    
    // slice the top 10 values then reverse order to account for default order
    slicedValues = first.sample_values.slice(0,10).reverse();
    slicedID = first.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse();
    slicedLabels = first.otu_labels.slice(0,10).reverse();
    
    // log to check value selections
    console.log(slicedValues);
    console.log(slicedID);
    console.log(slicedID);

    // Trace for the data for the horizontal bar chart
    let trace = [{
        x: slicedValues,
        y: slicedID,
        text: slicedLabels,
        type: "bar",            
        orientation: "h"
    }];
        
    // Plot chart with plotly
    Plotly.newPlot("bar", trace);
    });
}

function bubble(selection) {
    // Fetch the JSON data 
    d3.json(sampleURL).then((data) => {

    // An array of sample objects
    let samples = data.samples;
    
    // Filter data where id = selection
    let filteredData = samples.filter((sample) => sample.id === selection);
    
    // Assign the first object to obj variable
    let first = filteredData[0];

    console.log(first);
        
    // Trace for the data for the bubble chart
    let trace = [{
        x: first.otu_ids,
        y: first.sample_values,
        text: first.otu_labels,
        mode: "markers",
        marker: {
            size: first.sample_values,
            color: first.otu_ids,
            }
    }];
    
    // Apply the x-axis lengend to the layout
    let layout = {
        xaxis: {title: "OTU ID"}
    };
    
    // Use Plotly to plot the data in a bubble chart
    Plotly.newPlot("bubble", trace, layout);
});
}

function demographics(selection) {
    // Fetch the JSON data
    d3.json(sampleURL).then((data) => {

    // An array of metadata objects
    let metadata = data.metadata;

    // Filter data where id = selection 
    let filteredData = metadata.filter((meta) => meta.id == selection);
      
    // Assign the first object to obj variable
    let first = filteredData[0];
    
    // log to check for value selection
    console.log(first);

    // Clear the previous entries in the demographic section 
    d3.select("#sample-metadata").html("");
  
    // Iterate through the entries array created with Object.entries()
    // returns [key, value] array
    Object.entries(first).forEach(([key,value]) => {
        d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
    });

});
}

function optionChanged(selection) {
    bar(selection);
    bubble(selection);
    demographics(selection);
}

init();