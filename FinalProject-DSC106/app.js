function assignment8(){
    var filePath="FinalProject-DSC106/bayarea_boba_spots.csv";
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5(filePath);
}

var question1=function(filePath){
    d3.csv(filePath).then(function(data){

        const svgwidth = 1300
        const svgheight = 700
        const padding = 150

        let svg = d3.select("#q1_plot").append("svg")
        .attr("width", svgwidth)
        .attr("height", svgheight)

        const groupedBobaShops = d3.rollup(
                data,
                v => ({ mean: d3.mean(v, d => parseFloat(d.rating)), count: v.length }),
                d => d.name
        );
        
        let bobaShopInfo = Array.from(groupedBobaShops.entries(), ([name, stats]) => ({name, stats}))

        let bobaShopStatsGrouped = d3.group(bobaShopInfo, d => d.stats.count, d => d.stats.mean);

        const bobaShopCountAndMean = Array.from(bobaShopStatsGrouped, ([count, stats]) => [
            count,
            Array.from(stats, ([rating, items]) => ({ rating, count: items.length }))
          ])

        
        let flattenBobaStats = bobaShopCountAndMean.map(([og_count, ratings]) =>
            ratings.map(({rating, count}) => ({og_count, rating, count}))
        ).flat()
        
        const xScale = d3.scaleLinear()
        .domain([0, d3.max(bobaShopInfo, d => d.stats.count)])
        .range([padding, svgwidth - padding])

        const yScale = d3.scaleLinear()
        .domain([0, d3.max(bobaShopInfo, d => d.stats.mean)])
        .range([svgheight - padding, padding])

        const radiusScale = d3.scaleSqrt()
        .domain([1, d3.max(flattenBobaStats, d => d.count)])
        .range([4, 15])

        var Tooltip = d3.select("#q1_plot").append("div").style("opacity", 0).attr("class", "tooltip");

        svg.selectAll("circle")
        .data(bobaShopInfo)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.stats.count))
        .attr("cy", d => yScale(d.stats.mean))
        .attr("r", function(d) {
            let cur = flattenBobaStats.find(obj => obj.og_count == d.stats.count & obj.rating == d.stats.mean)
            return radiusScale(cur.count)
        })
        .attr("fill", "black")
        .on("mouseover", function (e, d) {
            Tooltip.transition().duration(50).style("opacity", 0.9)
            d3.select(this)
            .style("stroke", "black")
            .style("stroke-width", '2px')
        })
        .on("mousemove", function (e, d) {
            const [x, y] = d3.pointer(e)
            let cur = flattenBobaStats.find(obj => obj.og_count == d.stats.count & obj.rating == d.stats.mean)
            let locationStr = 'locations'
            if (cur.og_count  == 1) {
                locationStr = 'location'
            }
            let curText = 'There are ' + cur.count + ' boba shops that only have ' 
            + cur.og_count + ' ' + locationStr +  ' and have an average rating of ' + cur.rating.toFixed(2) + ' stars.'

            Tooltip.text(curText)
                .style("left", (x + 75) + "px")
                .style("top", (y + 265) + "px")
        })
        .on("mouseout", function (e, d) {
            Tooltip.transition().duration(50).style("opacity", 0);
            d3.select(this)
            .style("stroke", "none")
            .style("stroke-width", '0.5px')     
        });

        const xAxis = d3.axisBottom().scale(xScale)
		const yAxis = d3.axisLeft().scale(yScale)

        svg.append("g").call(xAxis)
        .attr("class", "xAxis")
        .attr("transform", "translate(0,"+ (svgheight - padding) + ")")

        svg.append("g").call(yAxis)
        .attr("class", "yAxis")
        .attr("transform", "translate(" + padding + ", 0)")

        svg.append('text')
        .attr('x', svgwidth / 2)
        .attr('y', padding / 2)
        .attr('text-anchor', 'middle')
        .text('Scatterplot of Number of Boba Shops for Given Chain and its Average Rating')
        .style('font', '30px Marker Felt')

        svg.append('text')
        .attr('x', svgwidth / 2)
        .attr('y', padding / 2 + 14)
        .attr('text-anchor', 'middle')
        .style('font', '12px times')
        .text('Circle Size Represents Number of Shops That Contains Same Count and Average Rating (Hover Over For More Info)')
        .style('font-style', 'italic')

        svg.append('text')
        .attr('x', svgwidth / 2)
        .attr('y', padding * 4)
        .attr('text-anchor', 'middle')
        .text('Number of Shops for Given Chain')

        svg.append('text')
        .attr('x', svgwidth / 12)
        .attr('y', padding * 4)
        .attr('text-anchor', 'middle')
        .text('Average Rating')
        .attr('transform', 'translate(-550,450)rotate(-90)')

    });
}

var question2=function(filePath){
    d3.csv(filePath).then(function(data) {
        const svgwidth = 1300
        const svgheight = 700
        const padding = 150

        let svg = d3.select("#q2_plot").append("svg")
        .attr("width", svgwidth)
        .attr("height", svgheight)

        let bobaShopsCount = Array.from(d3.rollup(data, v => v.length, d => d.name), ([name, count]) => ({name, count}))
        bobaShopsCount.sort((a, b) => a.count - b.count)

        let bobaShopsCountFiltered = bobaShopsCount.filter(item => item.count > 1)

        const bobaCountUnique = [new Set(bobaShopsCountFiltered.map(d => d.count))].sort((a, b) => a - b)[0]

        var xScale = d3.scaleBand()
        .domain(bobaShopsCountFiltered.map(d => d.name))
        .range([padding, svgwidth - padding])
        .padding(0.3)

        var yScale = d3.scaleLinear()
        .domain([0, d3.max(bobaShopsCountFiltered.map(d => d.count))])
        .range([svgheight - padding, padding])

        const color = d3.scaleSequential()
        .domain([d3.min(bobaShopsCountFiltered, d => d.count), d3.max(bobaShopsCountFiltered, d => d.count)])
        .range(['#ccae88', '#765640'])


        svg.selectAll('rect')
        .data(bobaShopsCountFiltered)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.name))
        .attr('y', d => yScale(d.count))
        .attr('width', xScale.bandwidth())
        .attr('height', d => svgheight - yScale(d.count) - padding)
        .style('fill', d => color(d.count))
        .on('mouseover', function(d) {
            d3.select(this)
            .style("animation", "wave 0.5s linear infinite");         
        })
        .on('mouseout', function(d) {
            d3.select(this)
            .style('fill', d => color(d.count))
            setTimeout(() => {
                d3.select(this).style("animation", "");
              }, 3000);
        })

        const xAxis = d3.axisBottom().scale(xScale);
		const yAxis = d3.axisLeft().scale(yScale);

        svg.append("g").call(xAxis)
        .attr("class", "xAxis")
        .attr("transform", "translate(0,"+ (svgheight - padding) + ")")
        .selectAll('text')
        .style('font', '10px times')
        .style('text-anchor', 'middle')
        .attr('transform', 'translate(-14,60)rotate(-90)')

		svg.append("g").call(yAxis)
        .attr("class", "yAxis")
        .attr("transform", "translate(" + padding + ", 0)")

        svg.append('text')
        .attr('x', svgwidth / 2)
        .attr('y', padding / 2)
        .attr('text-anchor', 'middle')
        .text('Number of Boba Shops for Given Store Name')
        .style('font', '30px Marker Felt')

        svg.append('text')
        .attr('x', svgwidth / 2)
        .attr('y', padding / 2 + 14)
        .attr('text-anchor', 'middle')
        .style('font', '12px times')
        .text('Filtered For Store Names that have More than 1 Shops (Hover Over To Shake The Drink!)')
        .style('font-style', 'italic')
    });
}

var question3=function(filePath){
    d3.csv(filePath).then(function(data) {
        const margin = { top: 50, right: 50, bottom: 50, left:100};
        const padding = 0.8
        const width = 900 - margin.left - margin.right
        const height = 600 - margin.top - margin.bottom

        const svg=d3.select("#q3_plot")
        .append("svg")
        .attr("width",width + margin.right + margin.left)
        .attr("height",height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        let locationShopsCount = Array.from(d3.rollup(data, v => v.length, d => d.city), ([city, count]) => ({city, count}))

        var colorScale = d3.scaleSequential()
        .domain(d3.extent(Object.values(locationShopsCount), d => d.count))
        //.interpolator(d3.interpolateRgb('#00CDE1', '#27589C'))
        .interpolator(d3.interpolateRgb('#ccae88', '#765640'))
        
        const bayAreaMap = d3.json("FinalProject-DSC106/bayarea-city.json")

        var projection = d3.geoMercator()
        .center([-122.433701, 37.767683])
        .scale(19000)
        .translate([width / 2.5, height / 2])

        var pathgeo = d3.geoPath().projection(projection)

        bayAreaMap.then(function(map) {
            svg.selectAll("path")
            .data(map.features)
            .enter()
            .append("path")
            .attr("d", pathgeo)
            .style('stroke', 'none')
            .style('stroke-width', '0.5px')
            .attr('fill', function(d) {
                let cityCount = locationShopsCount.find(e => e.city == d.properties.city)
                if (typeof(cityCount) == 'undefined') {
                    return 'black'
                } else {
                    return colorScale(cityCount.count)
                }
            })
            .on("mouseover", function (e, d) {
                d3.select(this)
                .style("stroke", "white")
                .style("stroke-width", '2px');
            })
            .on("mousemove", function (e, d) {
                const [x, y] = d3.pointer(e)
                let cityCount = locationShopsCount.find(f => f.city == d.properties.city)
                if (typeof(cityCount) != 'undefined') {
                    if (cityCount.count == 1) {
                        bobaCount = String(cityCount.count) + ' boba shop in ' + d.properties.city
                    } else {
                        bobaCount = String(cityCount.count) + ' boba shops in ' + d.properties.city
                    }
                } else {
                    bobaCount = '0 boba shops in ' + d.properties.city
                }

                d3.select('#bobaCountText').text(bobaCount)
            })
            .on("mouseout", function (e, d) {
                d3.select('#bobaCountText').text('Hover over city to get the number of boba shops!')   

                d3.select(this)
                .style("stroke", "none")
                .style("stroke-width", '0.5px');
            });

            var radio = d3.select('#radio_q3')
            .attr('name', 'region').on("change", function (d) {
                let status = d.target.value

                svg.selectAll('path')
                .data(map.features)
                .transition()
                .duration(1000)
                .style('fill', function(d) {
                    let cityCount = locationShopsCount.find(e => e.city == d.properties.city)
                    if (typeof(cityCount) == 'undefined') {
                        if (status == 'withBoba') {
                            return '#b0ce84'
                        }
                        return 'black'
                    } else {
                        return colorScale(cityCount.count)
                    }
                })

                svg.selectAll('path')
                .data(map.features)
                .on("mouseover", function (e, d) {
                    if (status == 'withBoba') {
                        let cityCount = locationShopsCount.find(f => f.city == d.properties.city)
                        if (typeof(cityCount) != 'undefined') {
                            d3.select(this)
                            .style("stroke", "white")
                            .style("stroke-width", '2px');
                        }
                    } else {
                        d3.select(this)
                        .style("stroke", "white")
                        .style("stroke-width", '2px');
                    }
                })
                .on("mousemove", function (e, d) {
                    const [x, y] = d3.pointer(e)
                    if (status == 'withoutBoba') {
                        let cityCount = locationShopsCount.find(f => f.city == d.properties.city)
                        if (typeof(cityCount) != 'undefined') {
                            if (cityCount.count == 1) {
                                bobaCount = String(cityCount.count) + ' boba shop in ' + d.properties.city
                            } else {
                                bobaCount = String(cityCount.count) + ' boba shops in ' + d.properties.city
                            }
                        } else {
                            bobaCount = '0 boba shops in ' + d.properties.city
                        }
                    } else {
                        let cityCount = locationShopsCount.find(f => f.city == d.properties.city)
                        if (typeof(cityCount) == 'undefined') {
                            bobaCount = 'Hover over city to get the number of boba shops!'
                        } else {
                            if (cityCount.count == 1) {
                                bobaCount = String(cityCount.count) + ' boba shop in ' + d.properties.city
                            } else {
                                bobaCount = String(cityCount.count) + ' boba shops in ' + d.properties.city
                            }
                        }
                    }
    
                    d3.select('#bobaCountText').text(bobaCount)
                })
                .on("mouseout", function (e, d) {
                    d3.select('#bobaCountText').text('Hover over city to get the number of boba shops!')   
    
                    d3.select(this)
                    .style("stroke", "none")
                    .style("stroke-width", '0.5px');
                });
            })
        })


        svg.append('text')
        .attr('x', width / 2)
        .attr('y', margin.top / 5)
        .attr('text-anchor', 'middle')
        .text('Heatmap of Number of Boba Shops in the Bay Area')
        .style('font', '30px Marker Felt')

        svg.append('text')
        .attr('id', 'bobaCountText')
        .attr('x', -75)
        .attr('y', 300)
        .text('Hover over city to get the number of boba shops!')
    }); 
}

var question4=function(filePath){
    d3.csv(filePath).then(function(data) {
        const margin = { top: 50, right: 200, bottom: 50, left: 200 };
        const padding = 0.8
        const width = 900 - margin.left - margin.right
        const height = 600 - margin.top - margin.bottom

        const svg=d3.select("#q4_plot")
        .append("svg")
        .attr("width",width + margin.right + margin.left)
        .attr("height",height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        var quicklyOnlyData = Array.from(data.filter(d => d.name == 'Quickly'))

        let locationShopsCount = Array.from(
            d3.rollup(quicklyOnlyData, v => v.length, d => d.city), ([city, count]) => ({city, count})
        )

        const bayAreaMap = d3.json("FinalProject-DSC106/bayarea-city.json")

        var projection = d3.geoMercator()
        .center([-122.433701, 37.767683])
        .scale(19000)
        .translate([width / 2.5, height / 2])

        var pathgeo = d3.geoPath().projection(projection)
        
        bayAreaMap.then(function(map) {
            svg.selectAll("path")
            .data(map.features)
            .enter()
            .append("path")
            .attr("d", pathgeo)
            .attr('fill', '#ccae88')
            .style('stroke', 'white')
            .style('stroke-width', '0.5px')

            const circles = svg.selectAll("circle")
            .data(locationShopsCount)
            .enter()
            .append("circle")
            .attr('cx', function(d) {
                let curCity = map.features.find(e => e.properties.city == d.city)
                if (typeof(curCity) != 'undefined') {
                    return pathgeo.centroid(curCity)[0]
                }
            })
            .attr('cy', function(d) {
                let curCity = map.features.find(e => e.properties.city == d.city)
                if (typeof(curCity) != 'undefined') {
                    return pathgeo.centroid(curCity)[1]
                }
            })
            .attr("r", function(d) {
                let curCity = map.features.find(e => e.properties.city == d.city)
                if (typeof(curCity) != 'undefined') {
                    return d.count * 5
                }
                return 0
            })
            .attr('fill', 'black')
            .style('stroke', 'black')
            .attr('stroke-width', 0.5)
            .style('opacity', 0.7)
            .on("mouseover", function (e, d) {
                d3.select(this)
                .style("stroke", "black")
                .style("stroke-width", '2px')
            })
            .on("mousemove", function (e, d) {
                let curText = `${d.city} contains ${d.count} Quicklys!`

                if (d.count == 1) {
                    curText = `${d.city} contains ${d.count} Quickly!`
                }
                d3.select('#bobaCountText1').text(curText)
            })
            .on("mouseout", function (e, d) {
                d3.select(this)
                .style("stroke", "none")
                .style("stroke-width", '0.5px')

                d3.select('#bobaCountText1').text('Hover over circle to get the number of Quicklys')
            });
        })

        svg.append('text')
        .attr('x', width / 2)
        .attr('y', margin.top / 5)
        .attr('text-anchor', 'middle')
        .text('Number of Quickly Boba Shops in the Bay Area')
        .style('font', '30px Marker Felt')

        svg.append('text')
        .attr('id', 'bobaCountText1')
        .attr('x', -180)
        .attr('y', 300)
        .text('Hover over circle to get the number of Quicklys')
    }); 
}

var question5=function(filePath){
    d3.csv(filePath).then(function(data) {

        const margin = { top: 100, right: 50, bottom: 100, left: 50 };
        const padding = 0.8
        const width = 900 - margin.left - margin.right
        const height = 600 - margin.top - margin.bottom

        const svg=d3.select("#q5_plot")
        .append("svg")
        .attr("width",width + margin.right + margin.left)
        .attr("height",height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        var groupedCities = d3.group(data, d => d.city)

        var groupedCitiesFiltered = Array.from(groupedCities).filter(function(d) {
            return d[1].length >= 4
        });

        var iqrData = groupedCitiesFiltered.map(function(d) { 
            var group = d[0];
            var values = d[1].map(function(d) { return parseFloat(d.rating) });
            var q1 = d3.quantile(values, 0.25);
            var median = d3.quantile(values.sort(d3.ascending), .5);
            var q3 = d3.quantile(values, 0.75);
            var iqr = q3 - q1;
            var min = q1 - 1.5 * iqr
            var max = q3 + 1.5 * iqr
            return { group: group, q1: q1, median: median, q3: q3, iqr: iqr, min: min, max: max};
        }).filter(d => d.min != d.max)

        var xScale = d3.scaleBand()
        .domain(iqrData.map(d => d.group))
        .range([0, width])
        .padding([padding])

        var yScale = d3.scaleLinear()
        .domain([0, d3.max(iqrData, d => d.max)])
        .range([height, 0])

        svg.selectAll("vertLines")
        .data(iqrData)
        .enter()
        .append("line")
        .attr('x1', d => xScale(d.group))
        .attr('x2', d => xScale(d.group))
        .attr('y1', d => yScale(d.min))
        .attr('y2', d => yScale(d.max))
        .attr("stroke", "black")
        .style("width", 100)

        const boxWidth = 15
        svg.selectAll("boxes")
        .data(iqrData)
        .enter()
        .append("rect")
        .attr('x', d => xScale(d.group) - boxWidth / 2)
        .attr('y', d => yScale(d.q3))
        .attr('height', d => yScale(d.q1) - yScale(d.q3))
        .attr("width", boxWidth)
        .attr("stroke", "black")
        .style('fill', '#ccae88')

        svg.selectAll("medianLines")
        .data(iqrData)
        .enter()
        .append("line")
        .attr('x1', d => xScale(d.group) - boxWidth / 2)
        .attr('x2', d => xScale(d.group) + boxWidth / 2)
        .attr('y1', d => yScale(d.median))
        .attr('y2', d => yScale(d.median))
        .attr("stroke", "black")
        .style("width", 80)

        const xAxis = d3.axisBottom().scale(xScale);
		const yAxis = d3.axisLeft().scale(yScale);

        svg.append("g").call(xAxis)
        .attr("class", "xAxis")
        .attr("transform", "translate(0,"+ (height) + ")")
        .selectAll('text')
        .style('font', '10px times')
        .style('text-anchor', 'middle')
        .attr('transform', 'translate(-14,40)rotate(-90)')

        svg.append("g").call(yAxis)
        .attr("class", "yAxis")

        svg.append('text')
        .attr('x', width / 2)
        .attr('y', -margin.top / 2)
        .attr('text-anchor', 'middle')
        .text('Boxplot of Boba Shop Ratings for a Given City')
        .style('font', '30px Marker Felt')

        svg.append('text')
        .attr('x', width / 2)
        .attr('y', -margin.top / 2 + 15)
        .attr('text-anchor', 'middle')
        .style('font', '12px times')
        .text('Filtered for Cities that have at least 4 Boba Shops')
        .style('font-style', 'italic')

    }); 
}