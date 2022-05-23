'use strict';
// import BigNumber from './bignumber/bignumber.mjs';

const $circle = document.getElementById('equal')
const $calcDiv = document.querySelector('.calc-div');
const $line0 = document.querySelector('.line0');
const $line1 = document.querySelector('.line1');
const $history = document.querySelector('.history');

$circle.addEventListener('click', function() {
    $circle.classList.add('circle-clicked');
    $calcDiv.classList.add('calc-div-clicked');
    $line0.classList.add('line0-clicked');
    $line1.classList.add('line1-clicked');
});

let a = ''; // first number
let b = ''; // second number
let sign = '' // math sign
let finish = false; // true if equal is finished properly
let equalClicked = 0; // the number of clicks on equal button, can't be more than two, it's костыль
let signChanged = false; // shows that sign is changed 
let signWithoutB = '';

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const ACTIONS = ['+', '−', '×', '÷', 'xⁿ'];
const ACTIONSwithoutB = ['√', 'x²', '1/x', '%', '+/−'];

const HISTORY = [];

const $output = document.querySelector('.result');
const $outputInfo = document.querySelector('.output');
const $buttons = Array.from(document.querySelectorAll('.button'));

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

$buttons.forEach(button => {
    button.addEventListener('click', (e) => {
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
                    $outputInfo.innerText = '0'
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
                a += btnText;
                $output.innerText = a;
            } else if (a !== '' && b !== '' && finish && equalClicked > 1) {
                b = btnText;
                $output.innerText = b;
                finish = false;
            } else {
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
                    $output.innerText = b;;
                }
                if (sign === '+' || sign === '−') {
                    if (b === '') {
                        b = a;
                    }
                    $outputInfo.innerText = `${a} ${sign} ${BigNumber(b)}%`;
                    b = BigNumber(a).multipliedBy(BigNumber(b).dividedBy(100));
                    $output.innerText = b;
                }

                if (a.toString().length > 18) {
                    a = a.toString().substring(0, 18);
                }

                if (b.toString().length > 18) {
                    b = b.toString().substring(0, 18);
                }
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
                        $output.innerText = b;
                    } else {
                        $outputInfo.innerText = `${a} ${sign} 1/${b}`;
                        b = BigNumber(1).dividedBy(b);
                        $output.innerText = b;
                    }
                }
            }

            if (a.toString().length > 18) {
                a = a.toString().substring(0, 18);
            }

            if (b.toString().length > 18) {
                b = b.toString().substring(0, 18);
            }
        };

        if (btnText === 'x²') {
            signWithoutB = 'x²';
            if (b !== '' && a !== '' && signChanged === false && equalClicked > 1) {
                // if (a.toString() === '') {
                //     a = 0;
                // }
                $outputInfo.innerText  = `${a}²`;
                a =  BigNumber(a).exponentiatedBy(2);
                $output.innerText = a;

                signWithoutB = '';
            } else {
                if (b === '' && sign === '') {
                    if (a.toString() === '') {
                        a = 0;
                    }
                    $outputInfo.innerText = `${a}²`;
                    a = BigNumber(a).exponentiatedBy(2);
                    $output.innerText = a;
                } else {
                    if (b.toString() === '') {
                        b = a;
                    }
                    $outputInfo.innerText = `${a} ${sign} ${b}²`
                    b = BigNumber(b).exponentiatedBy(2);
                    $output.innerText = b;
                    }
                }

                if (a.toString().length > 18) {
                    a = a.toString().substring(0, 18);
                }

                if (b.toString().length > 18) {
                    b = b.toString().substring(0, 18);
                }
            }

        if (btnText === '√') {
            signWithoutB = '√';
            if (b !== '' && a !== '' && signChanged === false && equalClicked > 1) {
                $outputInfo.innerText  = `√${a}`;
                a = BigNumber(a).squareRoot();
                $output.innerText = a;

                signWithoutB = '';
            } else {
                if (b === '' && sign === '') {
                    if (a === '') {
                        a = 0;
                    }
                    $outputInfo.innerText = `√${a}`;
                    a = BigNumber(a).squareRoot();
                    $output.innerText = a;
                } else {
                    if (b === '') {
                        b = a;
                    }
                    $outputInfo.innerText = `${a} ${sign} √${b}`;
                    b = BigNumber(b).squareRoot();
                    $output.innerText = b;
                }

                if (a.toString().length > 18) {
                    a = a.toString().substring(0, 18);
                }
                if (b.toString().length > 18) {
                    b = b.toString().substring(0, 18);
                }
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
                        // if (a === '') { show 0, 0 }
                        if (a === '') {
                            $output.innerText = '0';
                            // $outputInfo.innerText = '0';
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

        decreaseFontSize(btnText);
    })
});


$circle.addEventListener('click', (e) => {
    if (equalClicked < 2) {
        equalClicked += 1;
    };
    
    if (a === '' && equalClicked > 1) {
        a = '0';
    };

    if (b === '') { b = a };

    let str1 = `${a} ${sign} ${b} =`;

    if (signWithoutB === '%') {
        // if (sign === '×' || sign === '÷') {
        //     str1 = `${a} ${sign} ${BigNumber(b).multipliedBy(100).toString()}% =`;
        // }
        // if (sign === '+' || sign === '−') {
        //     str1 = `${a} ${sign} ${BigNumber(100).dividedBy(BigNumber(a).dividedBy(b))}% =`
        //     // подумать}
        // }
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

    if (a.toString().length > 18) {
        a = a.toString().substring(0, 18);
    }

    if (a !== '' && sign !== '') {
        $output.innerText = a;
        HISTORY.push(str1.concat(' ', a));
    }

    finish = true;
    signChanged = false;
    signWithoutB = '';

    decreaseFontSize('');
});

$history.addEventListener('click', (e) => {
    console.log(HISTORY)
});