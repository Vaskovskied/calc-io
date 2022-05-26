'use strict';
// import BigNumber from './bignumber/bignumber.mjs';

const $circle = document.getElementById('equal')
const $calcDiv = document.querySelector('.calc-div');
const $line0 = document.querySelector('.line0');
const $line1 = document.querySelector('.line1');
const $historyBtn = document.querySelector('.history');
const $historyDiv = document.querySelector('.history-div');

let a = ''; // first number
let b = ''; // second number
let sign = '' // math sign
let finish = false; // true if equal is finished properly
let equalClicked = 0; // the number of clicks on equal button, can't be more than two, it's костыль
let signChanged = false; // shows that sign is changed 
let signWithoutB = '';
// let ClearAllClicked = false;

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const ACTIONS = ['+', '−', '×', '÷', 'xⁿ'];
const ACTIONSwithoutB = ['√', 'x²', '1/x', '%', '+/−'];

let HISTORY = [];

const $output = document.querySelector('.result');
const $outputInfo = document.querySelector('.output');
const $buttons = Array.from(document.querySelectorAll('.button'));

// function isFiniteCutNumber(num) {
//     if (num.toString().length > 18) {
//             // if (num.toString().length > 26) {
//             //     num = BigNumber(num).toExponential(10).toString();
//             //     return num;
//             // }
//             if (BigNumber(num).isFinite()) {
//                 num = BigNumber(num).toString().substring(0,18);
//             } else {
//                 num = BigNumber(num).toExponential(10).toString();
//             }
//         };
//     return num;    
// }

function isFiniteCutNumber(num) {
    if (BigNumber(num).toFixed().length > 18) {
           num = BigNumber(num).toPrecision(16);
           if (num.length > 18 && num.length <= 21) {
                num = BigNumber(num).toPrecision(13);
           }
           if (num.length === 22) {
            num = BigNumber(num).toPrecision(12);
           }
           if (num.length === 23) {
            num = BigNumber(num).toPrecision(11);
           }
    };
    return num;    
};

function decreaseFontSize(btnText) {
    let outputFontSize = parseInt(window.getComputedStyle($output).fontSize);
    let outputInfoFontSize = parseInt(window.getComputedStyle($outputInfo).fontSize);

    if ($output.innerText.length < 13) {
        $output.style.fontSize = '36px';
    };

    if ($output.innerText.length >= 12 && outputFontSize >= 23 && (btnText !== 'C' && btnText !== '«' & btnText !== '.')) {
        $output.style.fontSize = `${36/$output.innerText.length * 11}px`;
    };

    if ($outputInfo.innerText.length < 13) {
        $outputInfo.style.fontSize = '24px';
    };

    if ($outputInfo.innerText.length >= 12 && outputInfoFontSize >= 14 && (btnText !== 'C' && btnText !== '«' & btnText !== '.')) {
        if ((24/$outputInfo.innerText.length * 14) >= 10) {
            $outputInfo.style.fontSize = `${24/$outputInfo.innerText.length * 14}px`;
        } else {
            $outputInfo.style.fontSize = `${24/$outputInfo.innerText.length * 14 + 2}px`
        }
    }
}

function clearAll() {
    a = '';
    b = '';
    sign = '';
    signWithoutB = '';
    finish = false;
    signChanged = false;
    $output.innerText = '0';
    $outputInfo.innerText = '';
    $output.style.fontSize = '36px';
    $outputInfo.style.fontSize = '24px';
};

function overflowError() {
    if ($output.innerText.length === 19 && $output.innerText[0] === '-') {
        return
    }
    if ($output.innerText.length > 18 || $output.innerText === 'Infinity') {
    $output.innerText = 'Overflow error';
    $outputInfo.innerText = 'You maliciously or curiously try to break program. The clear all function will be executed in 3 seconds';
    $outputInfo.style.fontSize = '10px';
    setTimeout(clearAll, 3000);
    }
}

function createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect()
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - (rect.left + radius)}px`;
    circle.style.top = `${event.clientY - (rect.top + radius)}px`;
    circle.classList.add("ripple"); 
    const ripple = button.getElementsByClassName("ripple")[0];
    
    if (ripple) {
      ripple.remove()
    }
    
    button.appendChild(circle);
}

$buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        createRipple(e);
        

        const btnText = button.innerText;
        //special buttons

        //clearAll
        if (btnText === 'С') {
            clearAll();
        };

        //deletesymbol
        if (btnText === '«') {
            if (b === '' && sign === '') {
                if (a.toString().length <= 1) {
                    a = '';
                    $output.innerText = '0';
                } else {
                    a = a.toString().substring(0, a.toString().length - 1)
                    $output.innerText = a;
                }
            } else if (a !== '' && b !== '' && finish && equalClicked > 1) {
                $outputInfo.innerText = '';
                // or clearAll
            } else {
                if (b.length <= 1) {
                    b = '';
                    $output.innerText = '0'
                } else {
                    b = b.toString().substring(0, b.toString().length - 1)
                    $output.innerText = b;
                }
            }
        }

        //limit on 18 numbers
        if (b === '' && sign === '') {
            if (a.toString().length === 18) {
                if (ACTIONS.includes(btnText) === false && ACTIONSwithoutB.includes(btnText) === false && btnText !== '«') {
                    return;
                }
            }
            if (btnText === '«' && a.toString().length === 17) {
                if (a !== '' && sign !== '') {
                    $outputInfo.innerText = `${a} ${sign}`;
                } else {
                    $outputInfo.innerText = '';
                }
            }
        } else if (a !== '' && b !== '' && finish && equalClicked === 1) {
            if (b.toString().length === 18) {
                if (ACTIONS.includes(btnText) === false && ACTIONSwithoutB.includes(btnText) === false && btnText !== '«') {
                    return;
                }
            }
            if (btnText === '«' && b.toString().length === 17) {
                if (a !== '' && sign !== '') {
                    $outputInfo.innerText = `${a} ${sign}`;
                } else {
                    $outputInfo.innerText = '';
                }
            }
        } else if (a !== '' && b !== '' && finish === false && equalClicked > 1) {
            if (b.toString().length === 18) {
                if (ACTIONS.includes(btnText) === false && ACTIONSwithoutB.includes(btnText) === false && btnText !== '«') {
                    return;
                }
            }
            if (btnText === '«' && b.toString().length === 17) {
                if (a !== '' && sign !== '') {
                    $outputInfo.innerText = `${a} ${sign}`;
                } else {
                    $outputInfo.innerText = '';
                }
            }
        };

        //digits
        //dot
        if ($output.innerText.includes('.') === false && btnText === '.') {
            if (b === '' && sign === '') {
                if (a === '') {
                    a = '0.'
                } else {
                    a += '.';
                }
                $output.innerText = a;
            } else if (a !== '' && b !== '' && finish && equalClicked > 1) {
                b = '0.'
                $output.innerText = b;
                finish = false;
            }
            else {
                if (b === '') {
                    b = '0.'
                } else {
                    b += '.';
                }
                $output.innerText = b;
            }
        } else if ($output.innerText.includes('.') && btnText === '.') {
            if (b === '' && sign === '' && a === '') {
                a = '0.'
                $output.innerText = a;
            } else if (a !== '' && b !== '' && finish && equalClicked > 1) {
                b = '0.';
                $output.innerText = b;
                finish = false;
            } else if (b === '' && sign !== '' && a !== '') {
                b = '0.'
                $output.innerText = b;
            }
        }
        //clear with dot
        if (btnText === '.' && b !== '' &&  a !== '' && signChanged === false && equalClicked > 1) {
            clearAll();
            a = '0.';
            finish = false;
            $output.innerText = a;
        }

        //digits
        if (DIGITS.includes(btnText)) {
            if (b === '' && sign === '') {
                if (a.toString().length === 1 && a.toString()[0] === '0') {
                    a = '';
                }
                a += btnText;
                $output.innerText = a;
            } else if (a !== '' && b !== '' && finish && equalClicked > 1) {
                b = btnText;
                $output.innerText = b;
                finish = false;
            } else {
                if (b.toString().length === 1 && b.toString()[0] === '0') {
                    b = '';
                }
                b += btnText;
                $output.innerText = b;
            }

            if (b !== '' && a !== '' && signChanged === false && equalClicked > 1) {
                clearAll();
                a = btnText;
                $output.innerText = a;
            }
        }
        
        //signs
        if (ACTIONS.includes(btnText)) {
            if (a === '') {
                a = 0;
            }
            sign = btnText;
            signChanged = true;
            $outputInfo.innerText = `${a} ${sign}`;
        }

        // %
        if (btnText === '%') {
            signWithoutB = '%';

            if (b !== '' && a !== '' && signChanged === false && equalClicked > 1) {
                $outputInfo.innerText = `${a}/100`;
                a = BigNumber(a).dividedBy(100);
                a = isFiniteCutNumber(a);
                $output.innerText = a;
                
                signWithoutB = '';
            } else {
                if (b === '' && sign === '') {
                    a = '0';
                    $outputInfo.innerText = a;
                    $output.innerText = a;
                }
                if (sign === '×' || sign === '÷') {
                    if (b === '') {
                        b = a;
                    } 
                    $outputInfo.innerText = `${a} ${sign} ${BigNumber(b)}%`;
                    b = BigNumber(b).dividedBy(100);
                    b = isFiniteCutNumber(b);
                    $output.innerText = b;;
                }
                if (sign === '+' || sign === '−') {
                    if (b === '') {
                        b = a;
                    }
                    $outputInfo.innerText = `${a} ${sign} ${BigNumber(b)}%`;
                    b = BigNumber(a).multipliedBy(BigNumber(b).dividedBy(100));
                    b = isFiniteCutNumber(b);
                    $output.innerText = b;
                };
            }
        }

        //1/x
        if (btnText === '1/x') {
            signWithoutB = '1/x';
            if (b !== '' && a !== '' && signChanged === false && equalClicked > 1) {
                if (a.toString() === '0') {
                    clearAll();
                    $output.innerText = 'error';
                    $outputInfo.innerText = 'can\'t divide by 0';
                    signWithoutB = '';
                } else {
                    $outputInfo.innerText  = `1/${a}`;
                    a = BigNumber(1).dividedBy(a);
                    a = isFiniteCutNumber(a);
                    $output.innerText = a;
    
                    signWithoutB = '';
                }
            } else {
                if (b === '' && sign === '') {
                    if (a.toString() === '0' || a.toString() === '') {
                        clearAll();
                        $output.innerText = 'error';
                        $outputInfo.innerText = 'can\'t divide by 0';
                    } else {
                        $outputInfo.innerText = `1/${a}`;
                        a = BigNumber(1).dividedBy(a);
                        a = isFiniteCutNumber(a);
                        $output.innerText = a;
                    }
                } else {
                    if (b.toString() === '0') {
                        clearAll();
                        $output.innerText = 'error';
                        $outputInfo.innerText = 'can\'t divide by 0';
                    } else if (b.toString() === '') {
                        $outputInfo.innerText = `${a} ${sign} 1/${a}`;
                        b = BigNumber(1).dividedBy(a);
                        b = isFiniteCutNumber(b);
                        $output.innerText = b;
                    } else {
                        $outputInfo.innerText = `${a} ${sign} 1/${b}`;
                        b = BigNumber(1).dividedBy(b);
                        b = isFiniteCutNumber(b);
                        $output.innerText = b;
                    }
                }
            };
        };

        if (btnText === 'x²') {
            signWithoutB = 'x²';
            if (b !== '' && a !== '' && signChanged === false && equalClicked > 1) {
                $outputInfo.innerText  = `${a}²`;
                a =  BigNumber(a).exponentiatedBy(2);
                a  =isFiniteCutNumber(a);
                $output.innerText = a;
                signWithoutB = '';
            } else {
                if (b === '' && sign === '') {
                    if (a.toString() === '') {
                        a = 0;
                    }
                    $outputInfo.innerText = `${a}²`;
                    a = BigNumber(a).exponentiatedBy(2);
                    a = isFiniteCutNumber(a);
                    $output.innerText = a;
                } else {
                    if (b.toString() === '') {
                        b = a;
                    }
                    $outputInfo.innerText = `${a} ${sign} ${b}²`
                    b = BigNumber(b).exponentiatedBy(2);
                    b = isFiniteCutNumber(a);
                    $output.innerText = b;
                    }
                };
            }

        if (btnText === '√') {
            signWithoutB = '√';
            if (b !== '' && a !== '' && signChanged === false && equalClicked > 1) {
                $outputInfo.innerText  = `√${a}`;
                a = BigNumber(a).squareRoot();
                a = isFiniteCutNumber(a);
                $output.innerText = a;

                signWithoutB = '';
            } else {
                if (b === '' && sign === '') {
                    if (a === '') {
                        a = 0;
                    };
                    $outputInfo.innerText = `√${a}`;
                    a = BigNumber(a).squareRoot();
                    a = isFiniteCutNumber(a);
                    $output.innerText = a;
                } else {
                    if (b === '') {
                        b = a;
                    };
                    $outputInfo.innerText = `${a} ${sign} √${b}`;
                    b = BigNumber(b).squareRoot();
                    b = isFiniteCutNumber(b)
                    $output.innerText = b;
                };
            }
        };
        
        if (btnText === '+/−') {
            signWithoutB = 'x/−';
            if (b !== '' && a !== '' && signChanged === false && equalClicked > 1) {
                a = BigNumber(a).negated();
                $output.innerText = a;
                signWithoutB = '';
            } else {
                if (b === '' && sign === '') {
                        if (a === '') {
                            $output.innerText = '0';
                        } else {
                            a = BigNumber(a).negated();
                            $output.innerText = a;
                        }
                } else {
                        if (b === '') {
                            b = BigNumber(a).negated();
                        } else {
                            b = BigNumber(b).negated();
                        };
                        $output.innerText = b;
                    }
                }
            }

        overflowError();
        decreaseFontSize(btnText);
    })
});


$circle.addEventListener('click', (e)=> {
    createRipple(e);
    console.log(e.clientX, e.currentTarget.offsetLeft, e.currentTarget.offsetParent);

    if ($historyDiv.classList.contains('history-div-clicked')) {
        deleteHistory();
        return;
    };

    $circle.classList.add('circle-clicked');
    $calcDiv.classList.add('calc-div-clicked');
    $line0.classList.add('line0-clicked');
    $line1.classList.add('line1-clicked');


    if (equalClicked < 2) {
        equalClicked += 1;
    };
    
    if (a === '' && equalClicked > 1) {
        a = '0';
    };

    if (b === '') { b = a };

    let str1 = `${a} ${sign} ${b} =`;

    if (signWithoutB === '%') {
        str1 = `${$outputInfo.innerText} =`;
    };

    if (a !== '' && sign !== '' && b !== '') {
        $outputInfo.innerText = str1;
    };

    switch (sign) {
        case '+':
            a = BigNumber(a).plus(BigNumber(b));
            break;
        case '−':
            a = BigNumber(a).minus(BigNumber(b));
            break;
        case '×': 
            a = BigNumber(a).multipliedBy(BigNumber(b));
            break;
        case '÷':
            if (b == 0) {
                clearAll();
                $output.innerText = 'error';
                $outputInfo.innerText = 'can\'t divide by 0';
            } else {
                a = BigNumber(a).dividedBy(BigNumber(b));
            };
            break;
        case 'xⁿ': 
            a = BigNumber(a).exponentiatedBy(BigNumber(b));
            break;
    };

    a = isFiniteCutNumber(a);

    if (a !== '' && sign !== '') {
        $output.innerText = a.toString();
        HISTORY.push([str1, a.toString()]);
        if (a.toString() !== 'Infinity' && a.toString().length <= 18) {
            createHistoryElement(str1, a.toString());
        }
    };

    overflowError();

    finish = true;
    signChanged = false;
    signWithoutB = '';

    decreaseFontSize('');
});

function createHistoryElement(info, result, emptiness) {
    const $historyDisplay = document.createElement('div');
    const $historyOutput = document.createElement('p');
    const $historyResult = document.createElement('p');

    $historyDisplay.classList.add('history-display');
    $historyOutput.classList.add('history-output');
    $historyResult.classList.add('history-result');

    $historyDisplay.appendChild($historyOutput);
    $historyDisplay.appendChild($historyResult);

    $historyOutput.innerText = info;
    $historyResult.innerText = result;

    $historyDiv.insertAdjacentElement('afterbegin', $historyDisplay)

    if (emptiness) {
        if (emptiness = true) {
            $historyDisplay.id = 'empty_message'
        }
    }
}

function deleteHistory() {
    const $historyItems = Array.from(document.querySelectorAll('.history-display'));
    const $historySpan = $historyBtn.querySelector('span');

    $historyItems.forEach(item => {
        item.remove();
    })
    $historyDiv.classList.remove('history-div-clicked');
    $circle.classList.remove('circle-history');
    $line0.classList.remove('line0-history');
    $line1.classList.remove('line1-history');
    $historySpan.classList.remove('history-span-clicked');
    HISTORY = [];
};

$historyBtn.addEventListener('click', (e) => {
    const $historyItems = Array.from(document.querySelectorAll('.history-display'));
    const $historySpan = $historyBtn.querySelector('span');

    if ($historyItems.length === 0) {
        createHistoryElement('', 'History is empty', true);
    } else {
        if (document.getElementById("empty_message")) {
            document.getElementById("empty_message").remove();
        }
    };

    $historyDiv.classList.toggle('history-div-clicked');
    $line0.classList.toggle('line0-history');
    $line1.classList.toggle('line1-history');
    $circle.classList.toggle('circle-history');
    $historySpan.classList.toggle('history-span-clicked');
    
    $historyItems.forEach(item => {
        item.addEventListener('click', (e) => {
            createRipple(e);
            clearAll();
            a = item.querySelector('.history-result').innerText;
            $outputInfo.innerText = item.querySelector('.history-output').innerText;
            $output.innerText = a;
            $historyDiv.classList.remove('history-div-clicked');
            $circle.classList.remove('circle-history');
            $line0.classList.remove('line0-history');
            $line1.classList.remove('line1-history');
            $historySpan.classList.remove('history-span-clicked');
            decreaseFontSize('');
        })
    })
});
