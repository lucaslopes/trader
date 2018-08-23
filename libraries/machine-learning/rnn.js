class ActivationFunction {
  constructor(func, dfunc) {
    this.func = func;
    this.dfunc = dfunc;
  }
}

let sigmoid = new ActivationFunction(
  x => 1 / (1 + Math.exp(-x)),
  y => y * (1 - y)
);

let tanh = new ActivationFunction(
  x => Math.tanh(x),
  y => 1 - (y * y)
);

class NeuralNetwork {
  constructor(a, b, c) {
    if (a instanceof NeuralNetwork) {
      this.input_nodes  = a.input_nodes;
      this.hidden_nodes = a.hidden_nodes;
      this.output_nodes = a.output_nodes;
      this.memory_node  = a.memory_node;

      this.weights_ih = a.weights_ih.copy();
      this.weights_ho = a.weights_ho.copy();
      this.weights_om = a.weights_om.copy();

      this.bias_h = a.bias_h.copy();
      this.bias_o = a.bias_o.copy();
      this.bias_m = a.bias_m.copy();
    } else {
      this.input_nodes  = a + 1;
      this.hidden_nodes = b;
      this.output_nodes = c;
      this.memory_node  = 0;

      this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
      this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
      this.weights_om = new Matrix(                1, this.output_nodes);
      this.weights_ih.randomize();
      this.weights_ho.randomize();
      this.weights_om.randomize();

      this.bias_h = new Matrix(this.hidden_nodes, 1);
      this.bias_o = new Matrix(this.output_nodes, 1);
      this.bias_m = new Matrix(                1, 1);
      this.bias_h.randomize();
      this.bias_o.randomize();
      this.bias_m.randomize();
    }

    this.setLearningRate();
    this.setActivationFunction();
  }

  predict(input_array) {
    input_array.push(this.memory_node)

    // Generating the Hidden Outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    // activation function!
    hidden.map(this.activation_function.func);

    // Generating the output's output!
    let output = Matrix.multiply(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(this.activation_function.func);

    this.memory_node = Matrix.multiply(this.weights_om, output);
    this.memory_node.add(this.bias_m);
    this.memory_node.map(this.activation_function.func);
    this.memory_node = this.memory_node.data[0][0]

    // Sending back to the caller!
    return output.toArray();
  }

  setLearningRate(learning_rate = 0.1) {
    this.learning_rate = learning_rate;
  }

  setActivationFunction(func = tanh) {
    this.activation_function = func;
  }

  train(input_array, target_array) {
    // Generating the Hidden Outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    // activation function!
    hidden.map(this.activation_function.func);

    // Generating the output's output!
    let outputs = Matrix.multiply(this.weights_ho, hidden);
    outputs.add(this.bias_o);
    outputs.map(this.activation_function.func);

    // Convert array to matrix object
    let targets = Matrix.fromArray(target_array);

    // Calculate the error
    // ERROR = TARGETS - OUTPUTS
    let output_errors = Matrix.subtract(targets, outputs);

    // let gradient = outputs * (1 - outputs);
    // Calculate gradient
    let gradients = Matrix.map(outputs, this.activation_function.dfunc);
    gradients.multiply(output_errors);
    gradients.multiply(this.learning_rate);

    // Calculate deltas
    let hidden_T = Matrix.transpose(hidden);
    let weight_ho_deltas = Matrix.multiply(gradients, hidden_T);

    // Adjust the weights by deltas
    this.weights_ho.add(weight_ho_deltas);
    // Adjust the bias by its deltas (which is just the gradients)
    this.bias_o.add(gradients);

    // Calculate the hidden layer errors
    let who_t = Matrix.transpose(this.weights_ho);
    let hidden_errors = Matrix.multiply(who_t, output_errors);

    // Calculate hidden gradient
    let hidden_gradient = Matrix.map(hidden, this.activation_function.dfunc);
    hidden_gradient.multiply(hidden_errors);
    hidden_gradient.multiply(this.learning_rate);

    // Calcuate input->hidden deltas
    let inputs_T = Matrix.transpose(inputs);
    let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);

    this.weights_ih.add(weight_ih_deltas);
    // Adjust the bias by its deltas (which is just the gradients)
    this.bias_h.add(hidden_gradient);

    // outputs.print();
    // targets.print();
    // error.print();
  }

  static deserialize(data) {
    if (typeof data == 'string')
      data = JSON.parse(data);

    let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
      nn.weights_ih = Matrix.deserialize(data.weights_ih);
      nn.weights_ho = Matrix.deserialize(data.weights_ho);
      nn.bias_h     = Matrix.deserialize(data.bias_h);
      nn.bias_o     = Matrix.deserialize(data.bias_o);
      nn.learning_rate = data.learning_rate;
    return nn;
  }

  serialize() { return JSON.stringify(this); }

  // Adding function for neuro-evolution
  copy() { return new NeuralNetwork(this); }

  mutate(rate) {
    function mutate(val) {
      if (Math.random() < rate) {
        // return 2 * Math.random() - 1;
        return val + randomGaussian(0, 0.1);
      } else return val;
    }

    this.weights_ih.map(mutate);
    this.weights_ho.map(mutate);
    this.weights_om.map(mutate);
    this.bias_h.map(mutate);
    this.bias_o.map(mutate);
    this.bias_m.map(mutate);
  }
}
