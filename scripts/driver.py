import time
from sudoku import Sudoku
import sys, json

ERROR = False
SOLVED = True

def backtracking(sudoku, assignment):
	if (len(assignment) == len(sudoku.variables)):
		return assignment

	var = select_unassigned_variable(sudoku, assignment)

	for value in order_domain_value(sudoku, var):
		if(sudoku.consistent(var, value, assignment)):
			sudoku.assign(var, value, assignment)
			result = backtracking(sudoku, assignment)

			if result:
				return result

			sudoku.unassign(var, assignment)

	return {}

def select_unassigned_variable(sudoku, assignment):
	unassigned_variables = []
	for var in sudoku.variables:
		if var not in assignment:
			unassigned_variables.append(var)

	return min(unassigned_variables, key=lambda var: len(sudoku.domains[var]))


def order_domain_value(sudoku, var):
	if len(sudoku.domains[var]) == 1:
		return sudoku.domains[var]

	return sorted(sudoku.domains[var], key = lambda val: num_conflicts(sudoku, var, val))



def num_conflicts(sudoku, var, val):

      n_conflicts = 0

      for neighbor in sudoku.neighbors[var]:
         if len(sudoku.domains[neighbor]) > 1 and val in sudoku.domains[neighbor]:
            n_conflicts += 1

      return n_conflicts


def solve_sudoku_ac3(sudoku):
	if not sudoku.solved():
		assignment = {}

		# Set initial values
		for var in sudoku.variables:
			if len(sudoku.domains[var]) == 1:
				assignment[var] = sudoku.domains[var][0]

		assignment = backtracking(sudoku, assignment)

		for domain in sudoku.domains:
			if len(domain) > 1 and (domain in assignment):	
				sudoku.domains[domain] = assignment[domain]

		if (not assignment):
			return ERROR
		return SOLVED

# def print_init_board(board):
# 	string = ''
# 	count = 1
# 	for val in board:

# 		if (val =='0'):
# 			string = string + '-' + ' '
# 		else:
# 			string = string + val + ' '

# 		if(count % 9 == 0):
# 			string += '\n'
# 		elif(count % 3 == 0):
# 			string += '|'
# 		if(count % 27 == 0 and count != 81):
# 			string += '-------------------\n'
# 		count += 1
# 	print(string)


def print_solved_board(sudoku):
		string = ''
		count = 1
		for var in sudoku.variables:
			string = string + str(sudoku.domains[var])
		return string


if __name__== '__main__':

	ret_val = {}

	board = sys.argv[1]

	ret_val['not_filled'] = bool(board.count('0'))
	sudoku = Sudoku(board)

	start_time = time.time()
	solved = solve_sudoku_ac3(sudoku)
	end_time = time.time()

	ret_val['solved'] = solved
	

	if(solved):
		ret_val['board'] = print_solved_board(sudoku)
		ret_val['time'] = str(round(end_time - start_time, 5))

	print(json.dumps(ret_val))	