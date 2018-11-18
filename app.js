(function() {
	var buttons = new Array(
		'1', '2', '3', '4', '5', '6', '7', '8', '9',
		'0', '.', '+', '-', '*', '/', '=', 'c', 
	)

	const field = document.getElementById('button-field');
	const screenObj = document.getElementById('screen');
	const screenLimit = 12;

	var	screenValue = 0,
		storedValue = 0,
		storedSymbol = '',
		lastValue = 0,
		equalSymbol = false,
		decimal = 0;

	var action = {
		'+': (a, b) => a + b,
		'-': (a, b) => a - b,
		'*': (a, b) => a * b, 
		'/': (a ,b) => a / b
	}		

	function updateScreen(val) {
		screenObj.innerHTML = val === void 0 ? parseFloat(screenValue.toFixed(screenLimit)) : val;
		lastValue = +screenValue;
	}

	function equal() {
		screenValue = storedSymbol ? action[storedSymbol] (storedValue, lastValue) : screenValue;
		storedValue = screenValue;
		equalSymbol = true;
		updateScreen();
	}

	function codeToChar(code, shift) {
		if (code >= 48 && code <= 57 && shift != true) {
			return String.fromCharCode(code);
		} else {		
			switch (code) {
				case 190 :
					return '.';
				case 187 :
					if (shift === true) {
						return '+'
					} else {
						return '=';	
					};				
				case 189:
					return '-';
				case 56 :
					return '*';
				case 191:
					return '/';
				case 13:
					return '=';
				case 8:
					return 'c';
			}		
		}
	}

	function actionButton(symbol) {

		if ( !isNaN(+symbol) ) {

			if (equalSymbol) {
				screenValue = 0;
				equalSymbol = false;
			}

			var screenLength = (Math.trunc(screenValue) + '').length + decimal;

			if (screenLength >= screenLimit) return;

			if (decimal) { // проаерка дробности
				screenValue = Math.trunc(+screenValue * Math.pow(10, decimal) + +symbol) /  Math.pow(10, decimal);
				symbol === '0' ? updateScreen(screenValue.toFixed(decimal) ) : updateScreen();
				decimal += 1;					
				return;
			}

			screenValue = ((+screenValue * 10 ) + +symbol);
			
			updateScreen();
			return;
		} 

		decimal = 0;

		switch (symbol) {
			case 'c' : 
				screenValue = 0;
				decimal = 0;
				updateScreen();
				break;
			
			case '=' :
				equal();
				break;

			case '.' :
				decimal = 1;
				break;

			default: 
				storedValue = +screenValue;
				storedSymbol = symbol;
				screenValue = 0;
		}		
	}		

	buttons.forEach(function(c) {
	
		var newButton = document.createElement('div');
		newButton.className = 'button';
		newButton.onclick = () => actionButton(c);
		newButton.innerHTML = c;

		if (isNaN(+c)) { 
			newButton.style.backgroundColor = 'orange';
			newButton.style.flexBasis = '30px';
		}

		field.appendChild(newButton);

	})

	addEventListener( 'keydown', function(event) { 
		var key = codeToChar(event.keyCode, event.shiftKey)
		if (buttons.includes(key)) {
			actionButton(key)
		}
	} )	

	updateScreen();

}())