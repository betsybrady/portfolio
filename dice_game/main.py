import random


# Class for a single die
class Die(object):
    def __init__(self):
        # Saves display for faces
        face1 = [" _________ ",
                 "|         |",
                 "|         |",
                 "|    *    |",
                 "|         |",
                 "|_________|"]
        face2 = [" _________ ",
                 "|         |",
                 "|      *  |",
                 "|         |",
                 "|  *      |",
                 "|_________|"]
        face3 = [" _________ ",
                 "|         |",
                 "|  *      |",
                 "|    *    |",
                 "|      *  |",
                 "|_________|"]
        face4 = [" _________ ",
                 "|         |",
                 "|  *   *  |",
                 "|         |",
                 "|  *   *  |",
                 "|_________|"]
        face5 = [" _________ ",
                 "|         |",
                 "|  *   *  |",
                 "|    *    |",
                 "|  *   *  |",
                 "|_________|"]
        face6 = [" _________ ",
                 "|         |",
                 "|  *   *  |",
                 "|  *   *  |",
                 "|  *   *  |",
                 "|_________|"]

        self.faces = [face1, face2, face3, face4, face5, face6]
        # List created to be used for random.choice
        self.face_value_list = [1, 2, 3, 4, 5, 6]
        self.face_value = 1

    # Rolls die and returns face value
    def roll_die(self):
        self.face_value = random.choice(self.face_value_list)
        return self.face_value


# Class for a pair of dice
class Dice_Pair(object):
    def __init__(self):
        self.die1 = Die()
        self.die2 = Die()
        self.total_value = 2

    # Rolls dice and returns combined value of dice
    def roll_dice(self):
        self.total_value = self.die1.roll_die()
        self.total_value += self.die2.roll_die()
        return self.total_value

    # Prints both dice
    def print_dice(self):
        # Iterates through both arrays to print the dice on the same lines
        for i in range(6):
            print(self.die1.faces[self.die1.face_value - 1][i],
                  self.die2.faces[self.die2.face_value - 1][i])
        print()
        return


# Class for a game
class Game(object):
    def __init__(self):
        self.pair = Dice_Pair()
        self.point = 0
        self.roll = 0
        self.bank = 0
        self.bet = 1

    # Check meaning of dice throw
    # Input: value of dice throw
    # Output: true if game is over, false if not
    def check_value(self, dice_value):
        # Checks if the roll is the first roll
        if self.roll == 1:
            if (dice_value == 7) or (dice_value == 11):
                self.bank += self.bet
                print("You win!")
                return True
            elif (dice_value == 2) or (dice_value == 3) or (dice_value == 12):
                self.bank -= self.bet
                print("You lose.")
                return True
            else:
                self.point = dice_value
                return False
        else:
            if (dice_value == 7):
                self.bank -= self.bet
                print("You lose.")
                return True
            elif (dice_value == self.point):
                self.bank += self.bet
                print("You win!")
                return True
            else:
                return False

    # Function to play through a single roll
    # Outputs true if roll ends round and false if not
    def play_roll(self):
        self.roll += 1
        dice_value = self.pair.roll_dice()
        self.pair.print_dice()

        # Uses output from check_value to determine if round is over
        round_over = self.check_value(dice_value)
        if (round_over):
            print("Your new bankroll is", self.bank)
            return False
        else:
            # Uses input to check if enter is pressed
            print("Trying for {}, press enter to throw again".format(self.point))
            input()
            return True

    # Function to play through a round
    def play_round(self):
        # Resets values for each round
        self.point = 0
        self.roll = 0
        print("What would you like to bet? If you are done playing, enter 0.")
        self.bet = int(input())
        if (self.bet == 0):
            return

        print("Throw dice by pressing enter")
        input()
        game_going = True

        # Uses output from play_roll to check if round is over
        while (game_going):
            game_going = self.play_roll()

    # Function to play through a game
    def play_game(self):
        print("How many chips would you like to start with?")
        self.bank = int(input())

        # Checks if game should still continue
        while (self.bet != 0):
            self.play_round()

        if (self.bet == 0):
            print("Thanks for playing!")

        return

# Code to start game
game = Game()
game.play_game()