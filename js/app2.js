// Import d3 library
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// set the dimensions and margins of the graph
const margin = { top: 30, right: 30, bottom: 150, left: 60 };
const width = 1000 - margin.left - margin.right;
const height = 700 - margin.top - margin.bottom;

// Append the container for buttons and chart
const chartContainer = d3.select("#chart2")
  .append("div")
  .attr("id", "chartContainer");

const header = chartContainer
  .append("div")
  .attr("class", "header")
  .style("text-align", "center")
  .append("h2")
  .text("Audio Features & Introversion vs. Extroversion")
  .style("margin-bottom", "35px")
  .style("margin-top", "20px"); // Adjust margin-top as needed

// Append the buttons container ABOVE the chart container
const buttonsContainer = chartContainer
  .append("div")
  .attr("id", "buttonsContainer");

// Append the information text container
const informationContainer = chartContainer
  .append("div")
  .attr("id", "informationContainer")
  .style("margin-top", "20px"); // Adjust this value to control space below the header

// Append the SVG container for the chart
const svg = chartContainer
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Add CSS for the selected button (if necessary)
const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
  .selected {
    background-color: #F4E8D0 !important;
    color: #03211F !important;
  }
`;
document.getElementsByTagName('head')[0].appendChild(style);

let currentYVariable = 'danceability_mean'; // Default Y-axis variable

// Function to redraw bars based on the selected Y-axis variable
const updateBars = (data, yVariable) => {
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => +d[yVariable])]) // Dynamically set domain based on selected variable
    .range([height, 0]);

  svg.select(".y-axis")
    .transition()
    .duration(500)
    .call(d3.axisLeft(y));

  svg.selectAll(".x-axis")
    .style("font-size", "12px"); // Adjust the font size for X-axis text

  svg.selectAll("rect")
    .data(data)
    .transition()
    .duration(500)
    .attr("y", (d) => y(d[yVariable]))
    .attr("height", (d) => height - y(d[yVariable]))
    .attr("rx", 25) // Rounded corners
    .attr("ry", 25); // Rounded corners

    updateInformationText(yVariable);
};

// Function to update the selected button
const updateSelectedButton = (selectedButton) => {
  buttonsContainer.selectAll("button").classed("selected", false);
  selectedButton.classed("selected", true);
};

// Function to update information text based on the selected Y-axis variable
const updateInformationText = (yVariable) => {
  let informationText = "";

  switch (yVariable) {
    case 'danceability_mean':
      informationText = "Danceability: Measures how suitable a track is for dancing, based on tempo, rhythm, beat strength, and regularity. A value of 0.0 is least danceable, while 1.0 is most danceable.";
      break;
    case 'energy_mean':
      informationText = "Energy Mean: measures a track's perceived intensity and activity. Energetic tracks feel fast and loud (e.g., death metal), while less energetic tracks feel slower and quieter (e.g., a Bach prelude).";
      break;
    case 'acousticness_mean':
      informationText = "Acousticness: Ranges from 0.0 to 1.0, with higher values indicating greater confidence that a track is acoustic.";
      break;
    case 'speechiness_mean':
      informationText = "Valence: Ranges from 0.0 to 1.0, with high values indicating positivity (happy, cheerful) and low values indicating negativity (sad, angry).";
      break;
    case 'valence_mean':
      informationText = "Valence: Ranges from 0.0 to 1.0, indicating the musical positivity of a track. High valence sounds positive (happy, cheerful), while low valence sounds negative (sad, angry).";
      break;
    case 'instrumentalness_mean':
      informationText = "Instrumentalness: Predicts if a track has no vocals. 'Ooh' and 'aa' sounds count as instrumental, while rap and spoken word are vocal. A value closer to 1.0 indicates a higher likelihood of no vocal content.";
      break;
    default:
      informationText = "";
  }

  d3.select("#informationText")
    .text(informationText);
};

// Parse the Data
d3.csv("data/combined_mbti_df.csv").then((data) => {
  // Aggregate data to calculate mean values for each mbti
  const aggregatedData = d3.group(data, (d) => d.mbti);

  const aggregated = Array.from(aggregatedData, ([key, value]) => ({
    mbti: key,
    danceability_mean: d3.mean(value, (d) => +d.danceability_mean),
    energy_mean: d3.mean(value, (d) => +d.energy_mean),
    acousticness_mean: d3.mean(value, (d) => +d.acousticness_mean),
    speechiness_mean: d3.mean(value, (d) => +d.speechiness_mean),
    valence_mean: d3.mean(value, (d) => +d.valence_mean),
    instrumentalness_mean: d3.mean(value, (d) => +d.instrumentalness_mean),
  }));

  // Sort data based on E (extroverted) and I (introverted)
  const sortedData = aggregated.sort((a, b) => {
    if (a.mbti.startsWith('E') && b.mbti.startsWith('I')) {
      return -1;
    } else if (a.mbti.startsWith('I') && b.mbti.startsWith('E')) {
      return 1;
    }
    return 0;
  });

  // X axis
  const x = d3.scaleBand()
    .range([0, width])
    .domain(sortedData.map((d) => d.mbti))
    .padding(0.2);

  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickFormat((d) => d).tickSizeOuter(0))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("font-size", "15px")
    .style("text-anchor", "end");

  // Y axis
  const y = d3.scaleLinear()
    .domain([0, 0.70]) // Assuming your values range from 0 to 1
    .range([height, 0]);

  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y));

  // Bars
  svg.selectAll("mybar")
    .data(sortedData)
    .join("rect")
    .attr("x", (d) => x(d.mbti))
    .attr("y", (d) => y(d[currentYVariable]))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d[currentYVariable]))
    .attr("fill", (d) => (d.mbti.startsWith('I') ? "#F9D2CF" : "#E8ABCD"))
    .attr("rx", 25) // Rounded corners
    .attr("ry", 25); // Rounded corners

  // Legend
  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width / 2 - 100}, ${height + margin.bottom - 75 })`);

  legend.append("rect")
    .attr("x", 0)
    .attr("y", -5)
    .attr("width", 60)
    .attr("height", 20)
    .attr("rx", "10")
    .attr("ry", "10")
    .attr("fill", "#E8ABCD");

  legend.append("text")
    .attr("x", 70)
    .attr("y", 7)
    .text("Extroverts")
    .style("font-size", "20px")
    .attr("alignment-baseline", "middle")
    .style("fill", "#F4E8D0");

  legend.append("rect")
    .attr("x", 0)
    .attr("y", 30)
    .attr("width", 60)
    .attr("height", 20)
    .attr("rx", "10")
    .attr("ry", "10")
    .attr("fill", "#F9D2CF");

  legend.append("text")
    .attr("x", 70)
    .attr("y", 43)
    .text("Introverts")
    .style("font-size", "20px")
    .attr("alignment-baseline", "middle")
    .style("fill", "#F4E8D0");

  // Information text on the right
  const informationText = informationContainer
    .append("div")
    .attr("id", "informationText")
    .style("flex", "1")
    .style("padding", "20px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "30px") // Add this line to round the corners
    .text("Click on a button to see more information. All measures are from 0 to 1.");

 // Button event listeners
buttonsContainer.selectAll("button")
  .data(Object.keys(aggregated[0]).filter(key => key !== 'mbti')) // Assuming first object has all key names
  .enter()
  .append("button")
  .text((d) => {
    // Convert camelCase to more readable title and make "Mean" uppercase
    return d.charAt(0).toUpperCase() + d.slice(1).replace(/_/g, ' ').replace(' mean', ' Mean');
  })
  .attr("data-variable", (d) => d)
  .on("click", function () {
    const selectedVariable = d3.select(this).attr("data-variable");
    currentYVariable = selectedVariable;
    updateBars(sortedData, currentYVariable);
    updateSelectedButton(d3.select(this));
  });


  // Initially highlight the default button
  updateSelectedButton(buttonsContainer.select("button"));
});
