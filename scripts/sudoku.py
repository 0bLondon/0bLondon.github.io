import itertools 

char_domains = 'ABCDEFGHI'
num_domains = '123456789'
char_box_domains = ('ABC','DEF','GHI')
num_box_domains = ('123','456','789')

# Sudoku Class

class Sudoku:

	# Constructor
	def __init__(self, board):
		self.variables = []
		self.domains = {}
		self.constraints = []
		self.neighbors = {}
		self.conflicts = {}

		self.init_all(board)

	# Initialization of all variables, constraints, etc...
	def init_all(self, board):
		board = list(board)

		# Create all 81 variables
		self.variables = self.combine(char_domains, num_domains)

		# Set domains for each variable
		for index, var in enumerate(self.variables):

			# If board has value '0' then consider var anything, else set to value
			if (board[index] == '0'):
				self.domains[var] = list(range(1,10))
				self.conflicts[var] = list()
			else:
				self.domains[var] = [int(board[index])]
				self.conflicts[var] = [int(board[index])]

		self.make_constraints()

		self.make_neighbors()


	# Combine values together
	def combine(self, x, y):

		return [i + j for i in x for j in y]


	# Permute the given set of combinations
	def permute(self, combinations):

		permutations = []

		for length_subset in range(0, len(combinations) + 1):

			if length_subset == 2:
				subsets = itertools.permutations(combinations,length_subset)
				for subset in subsets:
					permutations.append(subset)

		return permutations


	# Combine and permutate domains to create constraints
	def make_constraints(self):

		combinations = ([self.combine(char_domains, num) for num in num_domains] +
							[self.combine(char, num_domains) for char in char_domains] + 
							[self.combine(char, num) for char in char_box_domains for num in num_box_domains])

		for comb in combinations:
			permutations = self.permute(comb)

			for per in permutations:
				if ([per[0], per[1]] not in self.constraints):
					self.constraints.append([per[0], per[1]])


	# Creates neighbors
	def make_neighbors(self):

		for var in self.variables:
			self.neighbors[var] = []

			for constraint in self.constraints:
				if (var == constraint[0]):
					self.neighbors[var].append(constraint[1])

	# Assign a value to a variable in the assignment
	def assign(self, variable, value, assignment):

		assignment[variable] = value
		# Perform forward checking
		self.forward_check(variable, value, assignment)

	# Unassign current value from the variable in the assignment
	def unassign(self, variable, assignment):
		for (domain, value) in self.conflicts[variable]:
			self.domains[domain].append(value)

		self.conflicts[variable] = []

		del assignment[variable]

	# Perform forward check filtering
	def forward_check(self, variable, value, assignment):

		for neighbor in self.neighbors[variable]:
			if (neighbor not in assignment) and (value in self.domains[neighbor]):
				self.domains[neighbor].remove(value)
				self.conflicts[variable].append((neighbor,value))


	def solved(self):
		for var in self.variables:
			if (len(self.domains[var]) > 1):
				return False 
		return True

	# Check consistency
	def consistent(self, variable, value, assignment):
		for key, curr_val in assignment.items():
			if (key in self.neighbors[variable]) and (curr_val == value):
				return False

		return True
	