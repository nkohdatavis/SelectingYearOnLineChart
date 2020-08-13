// import { feature } from 'https://unpkg.com/visionscarto-world-atlas@0.0.6/world/50m.json';
// import { csv, json, range } from 'https://unpkg.com/d3@5.7.0/dist/d3.min.js';


// const allCaps = str => str === str.toUpperCase();
// const isCategory = country => allCaps(country) && country !== 'WORLD';

export const parseYear = d3.timeParse('%Y');
const isCategory = type => type == 'Region';

// console.log(unData);

const melt = (unData, minYear, maxYear) => {

    const years = d3.range(minYear, maxYear + 1);
    // console.log(years);

    const data = [];

    unData.forEach(d => {
        const country = d['Region, subregion, country or area *']
            .replace('AND THE', '&');
        years.forEach(year => {
            // console.log(years);
            const population = +d[year].replace(/ /g, '') * 1000;
            const type = d['Type'];
            const row = {
                year: parseYear(year),
                country,
                population,
                type
            };
            // console.log(row);
            data.push(row);
        });
    });

    //             return data.filter(d => isCategory(d.country));
    return data.filter(d => isCategory(d.type));
}


export const loadAndProcessData = () =>
    Promise
        .all([
            // tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
            d3.csv('https://gist.githubusercontent.com/nkohdatavis/268451b90e82c0b5432107dd80825aa8/raw/un-population-estimates-medium.csv'),
            d3.csv('https://gist.githubusercontent.com/nkohdatavis/fb85fa2e30ce2f38208c08874ae34762/raw/Un-population-estimates.csv')
            // d3.json('https://unpkg.com/visionscarto-world-atlas@0.0.6/world/50m.json')
        ])
        .then(([unDataMediumVariant, unDataEstimates]) => {
            return melt(unDataEstimates, 1950, 2020)
                .concat(melt(unDataMediumVariant, 2020, 2100));
            // console.log(data);

            // return data.filter(d => d.country);
            // const rowById = unData.reduce((accumulator, d) => {
            //     accumulator[d['Country code']] = d;
            //     return accumulator;
            // }, {});

            // const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries);

            // countries.features.forEach(d => {
            //     Object.assign(d.properties, rowById[+d.id]);
            // });

            // const featuresWithPopulation = countries.features
            //     .filter(d => d.properties['2020'])
            //     .map(d => {
            //         d.properties['2020'] = +d.properties['2020'].replace(/ /g, '') * 1000;
            //         return d;
            //     });

            // return {
            //     features: countries.features,
            //     featuresWithPopulation
            // };
        });