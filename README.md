# Dice Game
JavaScript Dice game in the style of Kingdom Come: Deliverance

As you might know (assuming that you played KCD), there's a little dice minigame in KCD that offers the player to make a lot of in-game money, that is also somewhat entertaining and relaxing to play. 

Since I'm learning JavaScript at the moment, I decided to make myself a similar game from scratch in form of a simple web app. I took it as a practice of basic DOM manipulation and also a slight challenge to come up with the right algorithm that runs the game. At some parts, the code might seem a bit tryhard (e.g. usage of binary search inside the function assigning score for combos), but overall the code is nothing complex, as I'm not that experienced with JS yet.  

The game should be fully responsive and works even on mobiles and devices with low resolution display.

Feel free to modify and use the code however you want :)

# Rules
The game starts by clicking on "Spustit hru" with the Player #1 ("Hráč 1") having the priviledge of the first turn.
Each player rolls the dice by clicking on button named "Vrhnout kostky".
After each roll, five dice with their respective values appear onscreen.
Every dice can be marked or unmarked with a mouse click.

Player must get a certain combination of marked dice in order to score points.
If there are no possible combinations out of the rolled dice's values, current player loses all of his
current points and the other player takes turn.
Each player can either roll again (after a successfull roll) until the failure, or hold the current points and end his/her turn with some score gain.

Default score limit is 2000 points. However, user can edit that via the text input window at the bottom mid of the screen.
The text input is treated to accept only valid and positive integer values. If the user sets some invalid value, the game will set the default 2000 points as the score limit.

# Scoring table
# Single dice

one - 100

five - 50

# Triplet

ones - 1000

twos - 200

threes - 300

fours - 400

fives - 500

sixes - 600

# Quaternion

ones - 2000

twos - 400

threes - 600

fours - 800

fives - 1000

sixes - 1200

# Quintuplet

ones - 3000

twos - 800

threes - 1200

fours - 1600

fives - 2000

sixes - 2400
