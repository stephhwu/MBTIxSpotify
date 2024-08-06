import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const chartOneData = "data/restructured_data.json";

// Radial Dendrogram to Introduce each Personality Type
d3.json(chartOneData).then((data) => {
    // Log the loaded data to check its structure
    console.log('--- CHART ONE ---');
    console.log(data); // Log the loaded JSON data

    const combinedMbtiData = "data/combined_mbti_df.csv";

    // Data for bar charts to show a high-level overview of the different Spotify audio quality features
    d3.csv(combinedMbtiData).then((data) => {
        const chartTwoData = data.map((d) => ({
            mbti: d.mbti,
            function_pair: d.function_pair,
            danceability_mean: d.danceability_mean,
            energy_mean: d.energy_mean,
            loudness_mean: d.loudness_mean,
            speechiness_mean: d.speechiness_mean,
            acousticness_mean: d.acousticness_mean,
            valence_mean: d.valence_mean,
            tempo_mean: d.tempo_mean,
            instrumentalness_mean: d.instrumentalness_mean
        }));
        
        // Use chartTwoData as needed here
        console.log('--- CHART TWO ---');
        console.log(chartTwoData);

        // Data for sunburst diagram with toggles that allow the user to explore different key counts
        const chartThreeData = data.map((d) => ({
            mbti: d.mbti,
            function_pair: d.function_pair,
            AMajor_count: d.AMajor_count,
            Aminor_count: d.Aminor_count,
            BMajor_count: d.BMajor_count,
            Bminor_count: d.Bminor_count,
            CMajor_count: d.CMajor_count,
            Cminor_count: d.Cminor_count,
            DMajor_count: d.DMajor_count,
            Dminor_count: d.Dminor_count
        }));

        console.log('--- CHART THREE ---');
        console.log(chartThreeData);
    });
});