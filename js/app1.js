import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

function createRadialDendrogram(data) {
    const width = 800;
    const height = 690;
    const radius = width / 2;

    const svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);


    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("background-color", "#03211F")
        .style("color", "#F4E8D0")
        .style("border-style", "solid") // Add border style
        .style("border-width", "1px") // Add border width
        .style("border-color", "#F4E8D0")
        .style("border-radius", "20px")
        .style("position", "absolute")
        .style("opacity", 0)
        .style("padding", "17px")
        .style("padding-bottom", "30px")
        .style("padding-top", "1px")
        .style("margin", "auto")
        .style("pointer-events", "none");

    // Create a cluster layout
    const cluster = d3.cluster()
        .size([360, radius - 100]);

    // Create hierarchy
    const root = d3.hierarchy(data, d => d.children);
    cluster(root);
    

    // Features of the links between nodes
    const linksGenerator = d3.linkRadial()
        .angle(d => (d.x / 180) * Math.PI)
        .radius(d => d.y);

    // Add links between nodes
    svg.selectAll('path')
        .data(root.links())
        .join('path')
        .attr("d", linksGenerator)
        .style("fill", "none")
        .attr("stroke", "#ccc");

    // Add circles for each node
    const nodes = svg.selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", d => `rotate(${d.x - 90}) translate(${d.y})`);

        const filter = svg.append("defs")
        .append("filter")
        .attr("id", "feather")
        .attr("x", "-50%")
        .attr("y", "-50%")
        .attr("width", "200%")
        .attr("height", "200%");

    filter.append("feGaussianBlur")
        .attr("in", "SourceGraphic")
        .attr("stdDeviation", 2);



    // Add circles representing function pairs and MBTI types
    nodes.filter(d => d.depth <= 2) // Filter nodes up to depth 2
    .append("circle")
    .attr("r", d => (d.depth === 1 ? 45 : 45)) // Larger radius for function pair nodes
    .style("fill", d => {
        if (d.depth === 1) {
            switch (d.data.name.toUpperCase()) {
                case "SP":
                    return "#AED4B7"; // Color for SP types
                case "SJ":
                    return "#F2C119"; // Color for SJ types
                case "NT":
                    return "#6FCDE5"; // Color for NT types
                case "NF":
                    return "#E8ABCD"; // Color for NF types
                default:
                    return "#F4E8D0"; // Default color if name doesn't match
            }
        } else if (d.depth === 2) {
            // Matching colors based on the node names for MBTI types
            const name = d.data.name ? d.data.name.toUpperCase() : ""; // Get node name in uppercase
            switch (name) {
                case "ESFP":
                case "ISFP":
                case "ISTP":
                case "ESTP":
                    return "#AED4B7"; // Color for SP types
                case "ESFJ":
                case "ESTJ":
                case "ISTJ":
                case "ISFJ":
                    return "#F2C119"; // Color for SJ types
                case "INTJ":
                case "ENTJ":
                case "INTP":
                case "ENTP":
                    return "#6FCDE5"; // Color for NT types
                case "INFJ":
                case "INFP":
                case "ENFP":
                case "ENFJ":
                    return "#E8ABCD"; // Color for NF types
                default:
                    return "#F4E8D0"; // Default color if name doesn't match
            }
        } else {
            return "#F4E8D0"; // Default color for other nodes
        }
    
    })
    // .style("filter", d => {
    //     if (d.depth <= 2) {
    //         return "url(#feather)";
    //     } else {
    //         return null;
    //     }
    // })
    // .attr("stroke", "black")
    // .style("stroke-width", 2)
    // Tooltip functionality
    .on("mouseover", function(event, d) {
        let tooltipContent = "";
        if (d.data.name) {
            switch (d.data.name.toUpperCase()) {
                case "INFP":
                    tooltipContent = `<strong><h2>INFP: Mediator</h2></strong><span>Mediators possess the <em>Introverted, Intuitive, Feeling, and Prospecting</em> traits. They are quiet, open-minded, and imaginative, often applying a caring and creative approach to everything they do.`;
                    break;
                case "INFJ":
                    tooltipContent = `<strong><h2>INFJ: Advocate</h2></strong><span>Advocates embody the <em>Introverted, Intuitive, Feeling, and Judging</em> traits. They are insightful, creative, and dedicated to their causes, often helping others with compassion and vision.`;
                    break;
                case "INTP":
                    tooltipContent = `<strong><h2>INTP: Logician</h2></strong><span>Logicians possess the <em>Introverted, Intuitive, Thinking, and Prospecting</em> traits. They're innovative, curious, and excel in dissecting complex problems with original thinking.`;
                    break;
                case "INTJ":
                    tooltipContent = `<strong><h2>INTJ: Architect</h2></strong><span>Architects are characterized by the <em>Introverted, Intuitive, Thinking, and Judging</em> traits. They are strategic thinkers, visionaries, and have a strong drive to achieve their goals.`;
                    break;
                case "ISFP":
                    tooltipContent = `<strong><h2>ISFP: Adventurer</h2></strong><span>Adventurers possess the <em>Introverted, Sensing, Feeling, and Prospecting</em> traits. They are adaptable, sensitive, and often express themselves through artistic endeavors.`;
                    break;
                case "ISFJ":
                    tooltipContent = `<strong><h2>ISFJ: Defender</h2></strong><span>Defenders embody the <em>Introverted, Sensing, Feeling, and Judging</em> traits. They are dependable, warm-hearted, and always ready to support their loved ones.`;
                    break;
                case "ISTP":
                    tooltipContent = `<strong><h2>ISTP: Virtuoso</h2></strong><span>Virtuoso possess the <em>Introverted, Sensing, Thinking, and Prospecting</em> traits. They are practical, adventurous, and excel in hands-on problem-solving.`;
                    break;
                case "ISTJ":
                    tooltipContent = `<strong><h2>ISTJ: Logistician</h2></strong><span>Logisticians embody the <em>Introverted, Sensing, Thinking, and Judging</em> traits. They are responsible, thorough, and value order and tradition.`;
                    break;
                case "ENFP":
                    tooltipContent = `<strong><h2>ENFP: Campaigner</h2></strong><span>Campaigners possess the <em>Extraverted, Intuitive, Feeling, and Prospecting</em> traits. They are enthusiastic, free-spirited, and inspire others with their creativity and passion.`;
                    break;
                case "ENFJ":
                    tooltipContent = `<strong><h2>ENFJ: Protagonist</h2></strong><span>Protagonists embody the <em>Extraverted, Intuitive, Feeling, and Judging</em> traits. They are charismatic, empathetic, and natural leaders who inspire others toward a common goal.`;
                    break;
                case "ENTP":
                    tooltipContent = `<strong><h2>ENTP: Debater</h2></strong><span>Debaters possess the <em>Extraverted, Intuitive, Thinking, and Prospecting</em> traits. They are sharp-witted, resourceful, and enjoy challenging ideas and exploring possibilities.`;
                    break;
                case "ENTJ":
                    tooltipContent = `<strong><h2>ENTJ: Commander</h2></strong><span>Commanders are characterized by the <em>Extraverted, Intuitive, Thinking, and Judging</em> traits. They are decisive, assertive, and natural leaders who aim for achievement and success.`;
                    break;
                case "ESFP":
                    tooltipContent = `<strong><h2>ESFP: Entertainer</h2></strong><span>Entertainers possess the <em>Extraverted, Sensing, Feeling, and Prospecting</em> traits. They are spontaneous, playful, and thrive in the moment, often bringing joy to those around them.`;
                    break;
                case "ESFJ":
                    tooltipContent = `<strong><h2>ESFJ: Consul</h2></strong><span>Consuls embody the <em>Extraverted, Sensing, Feeling, and Judging</em> traits. They are supportive, sociable, and prioritize the needs of their community and loved ones.`;
                    break;
                case "ESTP":
                    tooltipContent = `<strong><h2>ESTP: Entrepreneur</h2></strong><span>Entrepreneurs possess the <em>Extraverted, Sensing, Thinking, and Prospecting</em> traits. They are action-oriented, adaptable, and thrive in challenging environments.`;
                    break;
                case "ESTJ":
                    tooltipContent = `<strong><h2>ESTJ: Executive</h2></strong><span>Executives embody the <em>Extraverted, Sensing, Thinking, and Judging</em> traits. They are organized, dependable, and value structure and efficiency.`;
                    break;
                case "NT":
                    tooltipContent = `<strong><h2>NT: The Analyst</h2></strong> Analysts comprise personality types with traits of <strong><em>Intuition (N) and Thinking (T)</em></strong>. Known for their rationality, impartiality, and intellectual excellence, they excel in analyzing and strategizing complex ideas and systems.</span>`;
                    break;
                case "SJ":
                    tooltipContent = `<strong><h2>SJ: The Sentinel</h2></strong> Sentinels comprise personality types with traits of <strong><em>Sensing (S) and Judging (J)</em></strong>. They are known for their practicality and focus on order, security, and stability.</span>`;
                    break;
                case "SP":
                    tooltipContent = `<strong><h2>SP: The Explorers</h2></strong>Explorers comprise personality types with traits of <strong><em>Sensing (S) and Prospecting (P)</em></strong>. They are known for their spontaneity, ingenuity, and flexibility.</span>`;
                    break;
                case "NF":
                    tooltipContent = `<strong><h2>NF: The Diplomat</h2></strong>Dimplomats comprise personality types with traits of <strong><em>Intuitive (N) and Feeling (F)</em></strong>. They are known for their empathy, diplomatic skills, and passionate idealism.</span>`;
                    break;
                default:
                    tooltipContent = d.data.name;
                    break;
                
            }
            
        }
        tooltip.style("opacity", 1)
            .html(tooltipContent)
            .style("left", event.pageX + "px")
            .style("top", event.pageY + "px");
    })
    .on("mouseout", function(event, d) {
        tooltip.style("opacity", 0); // Hide the tooltip on mouseout
    })
}

// Your data structure
const data = {
    name: "Function Pairs",
    children: [
        {
            name: "SP",
            children: [
                { name: "ESFP" },
                { name: "ISFP" },
                { name: "ISTP" },
                { name: "ESTP" }
            ]
        },
        {
            name: "SJ",
            children: [
                { name: "ESFJ" },
                { name: "ESTJ" },
                { name: "ISTJ" },
                { name: "ISFJ" }
            ]
        },
        {
            name: "NT",
            children: [
                { name: "INTJ" },
                { name: "ENTJ" },
                { name: "INTP" },
                { name: "ENTP" }
            ]
        },
        {
            name: "NF",
            children: [
                { name: "INFJ" },
                { name: "INFP" },
                { name: "ENFP" },
                { name: "ENFJ" }
            ]
        }
    ]
};

// Create a tooltip element
d3.select("body").append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

// Call the function to create the dendrogram using the manually defined data
createRadialDendrogram(data);


