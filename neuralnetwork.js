var c = document.querySelector("canvas");

c.width = 720;
c.height = 480;

var ctx = c.getContext("2d");

function f(x) {
    if (x > 0) return 1;
    return 0;
}

class Node {
    constructor(inputs, sign, layer, output, bias = 0) {
        this._layer = layer;
        this._inputs = inputs;
        this._output = output;
        this._bias = bias;
        this._sign = sign;
    }

    get output() { return this._output; }
    get inputs() { return this._inputs; }
    get bias() { return this._bias; }
    get sign() { return this._sign; }

    setOutput(manualinput = false) {
        if (manualinput === false) {
            var sum = this._bias;
            for (var i = 0; i < this._inputs.length; i++) {
                sum += brain.network[this._layer - 1][this._inputs[i]].output * this._sign[i];
            }
            this._output = f(sum);
        }
        else this._output = f(manualinput);
    }
}

class Network {
    constructor(bias) {
        this._network = [];
        this._bias = bias;
        this._layers = [];
    }

    get network() { return this._network; }

    addNode(inputs, sign, layer, biased, output = 0) {
        if (!this._network[layer]) {
            this._network[layer] = [];
            this._layers++;
        }
        if (biased) this._network[layer].push(new Node(inputs, sign, layer, output, this._bias));
        else this._network[layer].push(new Node(inputs, sign, layer, output));
    }

    fireLayer(layer) {
        for (var i = 0; i < this._network[layer].length; i++) {
            this._network[layer][i].setOutput();
        }
    }

    runNetwork() {
        if (this._layers <= 0) return;
        for (var i = 1; i < this._layers; i++) this.fireLayer(i);
    }
}
brain = new Network(-1);

brain.addNode(false, false, 0, false, -1);
brain.addNode(false, false, 0, false, -1);
brain.addNode(false, false, 0, false, 1);
brain.addNode(false, false, 0, false, 1);

brain.addNode([0, 1], [-1, -1], 1, true);
brain.addNode([0, 1], [1, 1], 1, true);
brain.addNode([2, 3], [-1, -1], 1, true);
brain.addNode([2, 3], [1, 1], 1, true);

brain.addNode([0, 3], [1, 1], 2, true);
brain.addNode([1, 2], [1, 1], 2, true);

brain.addNode([0, 1], [1, 1], 3, false);

brain.runNetwork();

function renderNetwork() {
    for (var x = 0; x < brain.network.length; x++) {
        for (var y = 0; y < brain.network[x].length; y++) {
            if (brain.network[x][y].output >= 1) ctx.fillStyle = "#FF0000"
            else ctx.fillStyle = "#0000FF"
            ctx.fillRect(x * 40 + 10, y * 40 + 10, 10, 10);
            if (brain.network[x][y].inputs !== false) {
                ctx.beginPath();
                for (var i = 0; i < brain.network[x][y].inputs.length; i++) {
                    ctx.moveTo(x * 40 + 15, y * 40 + 15);
                    if (brain.network[x][y].sign[i] > 0) ctx.strokeStyle = "#FF0000"
                    else ctx.strokeStyle = "#0000FF"
                    ctx.lineTo(x * 40 - 25, brain.network[x][y].inputs[i] * 40 + 15);
                }
                ctx.stroke();
            }
        }
    }
}

function loop() {
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, c.width, c.height);
    renderNetwork();
}
loop();
