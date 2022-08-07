# calc-io
> :warning::warning::warning: Project is old, so code clarity is a weak spot :warning::warning::warning: 

## A beautiful, powerful and flexible calculator.
### [VIEW AND TEST IT HERE](https://vaskovskied.github.io/calc-io/)
### Stack: 

* HTML
* CSS
* JS
* Additional:
   * [bignumber.js](https://github.com/MikeMcl/bignumber.js/)

To use it you need to click on the only element on the page - the circle with a sign animation.

To prevent counting problems related to multiplying float numbers (0,1 * 0,9 = 0.09000000000000001), [I used bignumber.js library](https://github.com/MikeMcl/bignumber.js/).

## It's full of small pretty features
You can't divide by 0.

If the number is too big, the calculator represents its value in exponential notation. Infinite decimal numbers like 0.03333333333333333 are simply cutted for the fixed length of 18 symbols.

If you enter 0 and after enter anything other than a dot (for example, 2), it will display a number that you entered (for example, 2)

If you enter + or other signs, it will do this operations with this number in this way x + x = 2x, x * x = x², etc...

## There's powerful History

You can click on the history element and copy value from that to do other operations with it.
