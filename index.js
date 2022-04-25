import * as d3 from 'd3';
js_implem = require("./src/js_implementation.js")
c_implem = require("./src/module_implementation.js")
const hooks = require('perf_hooks');


// use como apoyo mis codigos de actividades pasadas.

// Variables Globales
let COLORS = ['blue', 'red'];

let Y_LAYOUT = 'Tiempo';
// Dimensiones graph
const width = 800;
const height = 600;
const margin = {
    top: 60,
    bottom: 50,
    right: 10,
    left: 60,
};

let SELECTED_ARRAY = [];

// HTML components
const first_task_div = d3.select('#first-task');
const third_task_div = d3.select('#third-task');

const layers = d3.select("#layer-card")

const graph = third_task_div
    .append("svg")
    .attr("id", "svg_graph")
    .attr("width", width)
    .attr("height", height);

// Componentes Graficos
const contenedorBarras = graph
    .append("g")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

const contenedorEjeY = graph
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const contenedorEjeX = graph
    .append("g")
    .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`);

//append title
graph
    .append("text")
    .attr("x", (width) / 2)
    .attr("y", 30)
    .attr("id", "graph-title")
    .attr("text-anchor", "middle")
    .text(`${Y_LAYOUT} consumido`)
    .style("fill", "black")
    .style("font-size", 28);

//append legends
graph
    .append("text")
    .attr("x", (width) / 2)
    .attr("y", (height))
    .attr("text-anchor", "middle")
    .text("Algoritmos")
    .style("fill", "black")
    .style("font-size", 15);

graph
    .append("text")
    .attr("x", -height / 2)
    .attr("y", 15)
    .attr("id", "graph-yLeyend")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text(`${Y_LAYOUT}`)
    .style("fill", "black")
    .style("font-size", 15);

const algorithm_solver = (algorithm) => {
    let answer = "";
    let time = 0;

    return {
        getAnswer() {
            return answer;
        },
        solveArray(array) {
            // start timer
            var startTime = Date.now();
            // solve
            answer = algorithm(array);
            // stop timer
            var endTime = Date.now();
            // calculate time
            time = endTime - startTime;
            console.log(startTime);
            console.log(endTime);
        },
        getTime() {
            return time;
        }
    }
}

const production = () => {
    const data = [];
    const jsSolution = algorithm_solver(js_implem.caller);
    const wasmSolution = algorithm_solver(c_implem.caller);

    return {
        async postData(array) {
            data.length = 0;
            await data.push(...array);
        },
        getData() {
            return data;
        },
        async startJsSolution() {
            await jsSolution.solveArray(data);
        },
        async startWasmSolution() {
            await wasmSolution.solveArray(data);
        },
        getJsSolution() {
            return jsSolution.getAnswer();
        },
        getWasmSolution() {
            return wasmSolution.getAnswer();
        },
        getJsTime() {
            return jsSolution.getTime();
        },
        getWasmTime() {
            return wasmSolution.getTime();
        },
        getResume() {
            return [
                {
                    time: jsSolution.getTime(),
                    answer: jsSolution.getAnswer(),
                    agent: "js",
                    color: COLORS[0]
                },
                {
                    time: wasmSolution.getTime(),
                    answer: wasmSolution.getAnswer(),
                    agent: "wasm",
                    color: COLORS[1]
                }
            ]
        }
    }
}

const SOLUTION = production();


// Usefull functions first task

function getTextInput(grid) {
    return grid.select("#input-array").property("value");
}

// get text and transform to array of inputs
function textToArray(text) {
    return text.split(',').map(Number);
}

function configureButton(grid) {
    grid.select('#add-array')
        .on('click', function () {
            // Get array
            try {
                const array = getTextInput(grid);
                const array_parsed = textToArray(array);
                // Add to SOLUTION
                SOLUTION.postData(array_parsed).then(() => {
                    // Start solvers
                    SOLUTION.startJsSolution().then(() => { console.log(SOLUTION.getJsSolution()); });
                    SOLUTION.startWasmSolution().then(() => { console.log(SOLUTION.getWasmSolution()); });
                }).then(() => {
                    // Get  resume
                    return SOLUTION.getResume();
                }).then((resume) => {
                    // Update graph
                    SELECTED_ARRAY = resume;
                    thirdTaskManager();
                    //updateGraph(resume);
                });
                // Update selected food info
                //updateSelectedCharInfo();
            } catch (error) {
                console.log(error);
                alert('Ingrese una cadena de caracteres valida');
            }
        });
}


// First Task
const firstTaskManager = (grid) => {

    configureButton(grid);

}

// Usefull functions for third task


// Third Task
const thirdTaskManager = () => {

    // Definimos las escalas
    let max_amount = d3.max(SELECTED_ARRAY, (item) => item.time);

    const escalaAltura = d3
        .scaleLinear()
        .domain([0, max_amount])
        .range([0, height - margin.top - margin.bottom]);

    const escalaY = d3
        .scaleLinear()
        .domain([0, max_amount])
        .range([height - margin.top - margin.bottom, 0]);

    const escalaX = d3
        .scaleBand()
        .domain(SELECTED_ARRAY.map(d => d.agent))
        .rangeRound([0, width - margin.right - margin.left])
        .padding(0.5);

    const ejeY = d3.axisLeft(escalaY);
    const ejeX = d3.axisBottom(escalaX);

    contenedorEjeY
        .transition()
        .duration(1000)
        .call(ejeY)
        .selectAll("line")
        .attr("x1", width - margin.right - margin.left)
        .attr("stroke-dasharray", "5")
        .attr("opacity", 0.5)
        .selection();

    contenedorEjeX
        .transition()
        .duration(1000)
        .call(ejeX)
        .selectAll("text")
        .attr("font-size", 12)
        .selection();

    contenedorBarras
        .selectAll("rect")
        .data(SELECTED_ARRAY, d => d.agent)
        .join(
            (enter) =>
                enter
                    .append('rect')
                    .transition().duration(500).style('opacity', 1)
                    .attr("fill", (d) => d.color)
                    .attr("width", escalaX.bandwidth())
                    .attr("height", (d) => escalaAltura(d.time))
                    .attr("x", (d) => escalaX(d.agent))
                    .attr("y", (d) => escalaY(d.time))
                    .attr("value", (d) => d.time)
                    .selection()
            ,
            (update) =>
                update
                    .transition().duration(500).style('opacity', 1)
                    .attr("width", escalaX.bandwidth())
                    .attr("height", (d) => escalaAltura(d.time))
                    .attr("x", (d) => escalaX(d.agent))
                    .attr("y", (d) => escalaY(d.time))
                    .attr("value", (d) => d.time)
                    .selection()
            ,
            (exit) =>
                exit.transition().duration(500).style('opacity', 0).remove()

        )
        .on("mouseover", (d) => {
            const value = d.currentTarget.getAttribute("value");
            contenedorBarras
                .append("text")
                .attr("x", parseInt(d.currentTarget.getAttribute("x")) + parseInt(escalaX.bandwidth() / 2))
                .attr("y", d.currentTarget.getAttribute("y") - 5)
                .attr("fill", "black")
                .attr("text-anchor", "middle")
                .attr("text-decoration-style", "solid")
                .attr("font-size", `12px`)
                .attr("fill", "black")
                .text(value);
        })
        .on("mouseout", () => {
            contenedorBarras
                .selectAll("text")
                .remove();
        });
}

// Initial Load
async function initialLoad() {

    await firstTaskManager(first_task_div);
    await thirdTaskManager();
}

initialLoad().then(() => {
    console.log("Finished loading");
});
