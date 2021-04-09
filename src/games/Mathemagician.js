const generateDigit = () => Math.floor(Math.random() * 20);

const chooseOne = (options) =>
  options[Math.floor(Math.random() * options.length)];

const calculateAnswer = (expression) => {
  if (expression.operator === "+") {
    return expression.lhs + expression.rhs;
  } else if (expression.operator === "-") {
    return expression.lhs - expression.rhs;
  } else if (expression.operator === "*") {
    return expression.lhs * expression.rhs;
  } else if (expression.operator === "/") {
    return Math.floor(expression.lhs / expression.rhs);
  }
};

const generateExpression = () => {
  const expression = {
    lhs: generateDigit(),
    operator: chooseOne(["+", "-", "*", "/"]),
    rhs: generateDigit(),
  };

  if (expression.operator === "/" && expression.rhs === 0) {
    return generateExpression();
  } else {
    return evaluateExpression(expression);
  }
};

const evaluateExpression = (expression) => {
  const answer = calculateAnswer(expression);

  return Object.assign(expression, {
    correctAnswer: answer,
    correctAnswerLength: answer.toString().length,
  });
};

const presentNextExpression = (expression) =>
  expression
    ? {
        lhs: expression.lhs,
        rhs: expression.rhs,
        operator: expression.operator,
        correctAnswerLength: expression.correctAnswerLength,
      }
    : null;

class Mathemagician {
  static generate(params) {
    const rounds = parseInt(params.rounds);
    if (!(rounds > 0)) {
      throw new Error("Invalid rounds");
    }

    const expressions = Array.from({ length: rounds }).map(() =>
      generateExpression()
    );
    const startTime = Date.now();

    return new Mathemagician({ id: params.id, expressions, startTime });
  }

  static generateExpression() {
    return generateExpression();
  }

  static evaluateExpression(expression) {
    return evaluateExpression(expression);
  }

  constructor({ id, expressions, startTime }) {
    this.id = id;
    this.type = "mathemagician";
    this.moves = [];
    this.expressions = expressions;
    this.currentExpressionIndex = 0;
    this.lastExpressionShowTime = startTime;
    this.skipsRemaining = Math.floor(this.expressions.length / 3);
  }

  isFinished() {
    return this.currentExpressionIndex >= this.expressions.length;
  }

  present() {
    const status = this.isFinished() ? "finished" : "waiting_for_move";
    return {
      id: this.id,
      type: this.type,
      status,
      nextExpression: presentNextExpression(
        this.expressions[this.currentExpressionIndex]
      ),
      skipsRemaining: this.skipsRemaining,
    };
  }

  move({ move }) {
    if (this.isFinished()) {
      return { move: null, game: this.present() };
    }

    if (move === "skip") {
      if (this.skipsRemaining > 0) {
        this.skipsRemaining = this.skipsRemaining - 1;
      } else {
        return { move: null, game: this.present() };
      }
    }

    const currentExpression = this.expressions[this.currentExpressionIndex];
    const timeSpentMillis = Date.now() - this.lastExpressionShowTime;
    this.currentExpressionIndex = this.currentExpressionIndex + 1;
    this.lastExpressionShowTime = Date.now();

    const guess = parseInt(move, 10);
    const correct = currentExpression.correctAnswer === guess;

    const moveResponse =
      move === "skip"
        ? { timeSpentMillis, correct: false, skipped: true }
        : { timeSpentMillis, correct, skipped: false };

    return { move: moveResponse, game: this.present() };
  }
}

module.exports = Mathemagician;
