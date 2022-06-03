# calc-io

A beutiful, powerfull and flexible calculator.

To use it you should click on the first and last element on the page - circle with sign animation.

To prevent counting problems of that kind (0,1 * 0,9 = 0.09000000000000001), I used BigNumber JS library.

## It's full of small pretty features
You can't devide by 0.

If number is too big, the calculator represents it's value in exponential notation. Period number like 0.03333333333333333 is simply cutted for the fixed length of 18 symbols.

If you enter 0 and after enter anything but a dot (for example, 2), it will display a number that you entered (for example, 2)

If you enter + or other signs, it will do this operations with this number in this way x + x = 2x, x * x = x², etc...

## There's powerful History

You can click on history element and copy value from that to do other operations with that.
