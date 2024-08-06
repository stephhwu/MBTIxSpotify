# Spotify MBTI Playlists | Kaggle

## Overview

This project explores a dataset containing information on 4,077 Spotify playlists, each labeled with a Myers-Briggs Type Indicator (MBTI) personality type and function pair. The MBTI pairs are derived from the following personality axes:
- Introversion/Extroversion
- Intuition/Sensing
- Thinking/Feeling
- Judging/Perceiving

## Dataset

The playlist data includes various audio quality attributes, each associated with a mean and standard deviation:
- Danceability
- Energy
- Instrumentalness
- Key
- Liveness
- Loudness
- Mode
- Speechiness
- Tempo
- Valence

Key counts are provided for both major and minor modalities. This dataset combines relational data (associations between playlists and personality types/function pairs) and thematic data (audio quality features of the tracks). Scores have been assigned to the thematic data to create quantitative metrics.

## Visualization

I used **d3.js** to process the data and create the following visualizations:

- **Radial Dendrogram**: This visualization represents the hierarchical structure of the data, with a custom tooltip providing additional information about each node.
- **Interactive Bar Chart**: This chart analyzes the differences in audio attributes between introversion and extroversion.

For any questions or suggestions, please open an issue or contact me directly.

Enjoy exploring the intersection of music and personality!
