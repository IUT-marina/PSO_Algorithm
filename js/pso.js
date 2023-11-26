let swarm = [];
let globalBest;
let iteration = 0;

const swarmSize = 1000;
const dimensions = 2;
const maxIterations = 50;
const inertiaWeight = 0.5;
const cognitiveWeight = 0.5;
const socialWeight = 0.5;

const delayToWait = 100;



let blocCondArret = document.getElementById('blocCondArret');
blocCondArret.append(maxIterations + ' itérations.');

let blocNbParticules = document.getElementById('blocNbParticules');
blocNbParticules.append(swarmSize + ' particules.');

let blocDimensions = document.getElementById('blocDimensions');
blocDimensions.append(dimensions + ' dimensions.');

let blocInertie = document.getElementById('blocInertie');
blocInertie.append(inertiaWeight + '.');

let blocCognitif = document.getElementById('blocCognitif');
blocCognitif.append(cognitiveWeight + '.');

let blocSocial = document.getElementById('blocSocial');
blocSocial.append(socialWeight + '.');



function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    textAlign(CENTER);
    textSize(16);

    // Initialisation des particules
    for (let i = 0; i < swarmSize; i++) {
        swarm.push(new Particle(dimensions));
    }
}

function draw() {

    //background(240, 240, 240);
    background(0, 0, 0);

    if (globalBest !== undefined) {

        // Dessiner les particules
        fill(254, 254, 254);
        noStroke();
        for (let particle of swarm) {
            ellipse(particle.position[0] * width, height - particle.position[1] * height, 10, 10);
        }

        // Dessiner la meilleure position globale
        fill(255, 0, 0);
        ellipse(globalBest.position[0] * width, height - globalBest.position[1] * height, 15, 15);

        // Afficher le numéro de l'itération
        fill(132, 180, 9);
        text('Itération: ' + iteration, width - 80, 20);
    }
}
const delay = ms => new Promise(res => setTimeout(res, ms));
async function run() {
    swarm = [];
    globalBest = undefined;
    iteration = 0;
    setup();
    if (iteration === 0) {

        // Algorithme PSO
        for (iteration = 0; iteration < maxIterations; iteration++) {

            await delay(delayToWait);

            let bestParticle = swarm[0];
            for (let particle of swarm) {
                particle.update(bestParticle.bestPosition, inertiaWeight, cognitiveWeight, socialWeight);
                if (particle.bestFitness < bestParticle.bestFitness) {
                    bestParticle = particle;
                }
            }

            if (globalBest === undefined || bestParticle.bestFitness < globalBest.bestFitness) {
                globalBest = bestParticle;
            }
        }
    }
}

class Particle {
    constructor(dimensions) {
        this.position = new Array(dimensions);
        this.velocity = new Array(dimensions);
        this.bestPosition = new Array(dimensions);
        this.bestFitness = Infinity;

        for (let i = 0; i < dimensions; i++) {
            this.position[i] = Math.random(); // Valeurs initiales entre 0 et 1
            this.velocity[i] = Math.random() * 0.1; // Valeurs initiales entre 0 et 0.1
        }

        this.bestPosition = this.position.slice();
        this.bestFitness = this.fitnessFunction(this.position);
    }

    fitnessFunction(x) {
        let sum = 0;
        for (let value of x) {
            sum += (value - 0.5) * (value - 0.5);
        }
        return sum;
    }

    update(globalBestPosition, inertiaWeight, cognitiveWeight, socialWeight) {
        for (let i = 0; i < this.position.length; i++) {
            this.velocity[i] =
                inertiaWeight * this.velocity[i] +
                cognitiveWeight * Math.random() * (this.bestPosition[i] - this.position[i]) +
                socialWeight * Math.random() * (globalBestPosition[i] - this.position[i]);

            this.position[i] += this.velocity[i];
        }

        let currentFitness = this.fitnessFunction(this.position);
        if (currentFitness < this.bestFitness) {
            this.bestFitness = currentFitness;
            this.bestPosition = this.position.slice();
        }
    }
}