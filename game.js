var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

const Stars = (props) => {
	// const numberOfStars = 1 + Math.floor(Math.random()*9);
  
  // let stars = [];
  // for(let i=0; i<numberOfStars; i++) {
  // 	stars.push(<i key={i} className="fa fa-star"></i>);
  // }

	return(
  	<div className="col-5">
    	{ _.range(props.numberOfStars).map(i =>
      	<i key={i} className="fa fa-star"></i>
      ) }
    </div>
  )
}

const Button = (props) => {
	let button;
  switch(props.answerIsCorrect) {
  	case true:
    	button = 
        <button className="btn btn-success"
        				onClick={props.acceptAnswer}>
          <i className="fa fa-check"></i>
        </button>
    	break;
    case false:
    	button = 
        <button className="btn btn-danger" >
          <i className="fa fa-times"></i>
        </button>
    	break;
    default:
    	button = 
        <button className="btn" 
                disabled={props.selectedNumbers.length === 0}
                onClick={props.checkAnswer}>
          =
        </button>
    	break;
  }

	return(
  	<div className="col-2 text-center">
  		{button}
      <br/>
      <br/>
      <button className="btn btn-warning btn-sm" 
      				onClick={props.reDraw}
              disabled={props.redraws === 0}>
        <i className="fa fa-refresh"></i>{props.redraws}
      </button>
  	</div>
  )
}

const Answer = (props) => {
	return(
  	<div className="col-5">
  	  {props.selectedNumbers.map((number, i) => 
      	<span key={i} onClick={() => props.deselectNumber(number)}>
        	{number}
        </span>
      )}
  	</div>
  )
}

const Numbers = (props) => {
	// const arrayOfNumbers = _.range(1, 10);

	const numberClassName = (number) => {
  	if (props.selectedNumbers.indexOf(number) >= 0) {
    	return 'selected';
    }
    if (props.usedNumbers.indexOf(number) >= 0) {
    	return 'used';
    }
  };

	return(
  	<div className="card text-center">
    	<div>
    	  { Numbers.list.map((number, i) =>
        	<span key={i} className={numberClassName(number)}
          			onClick={() => props.selectNumber(number)}>
          	{number}
          </span>
        )}
    	</div>
  	</div>
  )
}

const DoneFrame = (props) => {
	return(
  	<div className="text-center">
  	  <h2>{props.status}</h2>
      <br/>
      <button className="btn btn-secondary" onClick={props.resetGame}>
        Play again
      </button>
  	</div>
  )
}

class Game extends React.Component {
	state = {
  	selectedNumbers: [],
    usedNumbers: [],
    numberOfStars: 1 + Math.floor(Math.random()*9),
    answerIsCorrect: null,
    redraws: 5,
    doneStatus: null
  };
  
  selectNumber = (clickedNumber) => {
  	if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) { return; }
  	this.setState(prevState => ({
    	selectedNumbers: prevState.selectedNumbers.concat(clickedNumber),
      answerIsCorrect: null
    }));
  };
  
  deselectNumber = (clickedNumber) => {
  	this.setState(prevState => ({
    	selectedNumbers: prevState.selectedNumbers.filter(number => number !== clickedNumber),
      answerIsCorrect: null
    }));
  };
  
  checkAnswer = () => {
  	this.setState(prevState => ({
    	answerIsCorrect: prevState.numberOfStars === prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }));
  };
  
  acceptAnswer = () => {
  	this.setState(prevState => ({
    	usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      numberOfStars: 1 + Math.floor(Math.random()*9),
      answerIsCorrect: null
    }), this.updateDoneStatus);
  };
  
  reDraw = () => {
  	if (this.state.redraws === 0) { return; }
    this.setState(prevState => ({
    		redraws: prevState.redraws - 1,
        numberOfStars: 1 + Math.floor(Math.random()*9)
    }), this.updateDoneStatus);
  };
  
  possibleSolution = ({numberOfStars, usedNumbers}) => {
  	const possibleNumbers = _.range(1,10).filter(number => usedNumbers.indexOf(number) === -1);
    
    return possibleCombinationSum(possibleNumbers, numberOfStars);
  };

	updateDoneStatus = () => {
  	this.setState(prevState => {
    		if (prevState.usedNumbers.length === 9){
        	return { doneStatus: 'Done. Nice!' };
        }
        if (prevState.redraws === 0 && !this.possibleSolution(prevState))
        	return { doneStatus: 'Game over !' };
    });
  };
  
  resetGame = () => {
  	this.setState({
      selectedNumbers: [],
      usedNumbers: [],
      numberOfStars: 1 + Math.floor(Math.random()*9),
      answerIsCorrect: null,
      redraws: 5,
      doneStatus: null
    })
  }

  render() {
  	return (
    	<div className="container">
    	  <h3>Play nine</h3>
        <div className="row">
          <Stars numberOfStars={this.state.numberOfStars}/>
          <Button selectedNumbers={this.state.selectedNumbers}
          				checkAnswer={this.checkAnswer}
                  answerIsCorrect={this.state.answerIsCorrect}
                  acceptAnswer={this.acceptAnswer}
                  reDraw={this.reDraw}
                  redraws={this.state.redraws}
          />
          <Answer selectedNumbers={this.state.selectedNumbers}
          				deselectNumber={this.deselectNumber}
          />
    	  </div>
        <br />
        
        { this.state.doneStatus ? 
        	<DoneFrame status={this.state.doneStatus} resetGame={this.resetGame}/> :
         	<Numbers selectedNumbers={this.state.selectedNumbers} 
        	 				 selectNumber={this.selectNumber}
            	     usedNumbers={this.state.usedNumbers}/> 
        }
    	</div>
    )
	}
}

Numbers.list = _.range(1, 10);

class App extends React.Component {
  render() {
		return (
    	<div>
      	<Game />
      </div>
    )
  }
}

ReactDOM.render(<App />, mountNode);
