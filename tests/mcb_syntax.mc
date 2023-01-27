
function function_test {
	say Hello World!

	say <%'Hello world from inline JavaScript land!'%>

	<%%
		emit('Hello world from multiline JavaScript land!');
	%%>
}

function block_test {
	# REVIEW - Execute run blocks could possibly be accomplished through only blocks?
	# Could require extra functionality like inlining single commands after execute though.

	# Named function block
	block test_block_a {
		say Hello World A!
	}
	# Anonymous function block
	block {
		say Hello World B!
	}
	# Anonymous function block without the block keyword
	{
		say Hello World C!
	}
	# Named function block after execute run
	execute as @a run block test_block_b {
		say Hello World E!
	}
	# Anonymous function block after execute run
	execute as @a run block {
		say Hello World D!
	}
	# Anonymous function block after execute run with out block keyword
	execute as @a run {
		say Hello World D!
	}

	# If a block references itself isn't named, and only contains a single command; throw an error!
	execute as @a run {
		function $block
	}

	execute as @a run {
		block {
			say hi
			function $parent
		}
	}
}

function execute_if_else {
	# REVIEW - This might be a little more difficult to accomplish with only blocks.
	# But not impossible!
	execute if entity @s {
		say A
	} else {
		say B
	}

	execute if entity @s {
		say C
	} else if entity @a {
		say D
	} else {
		say E
	}
}

clock 10t {
	say Hello Clock World!
}

function schedule_test {
	schedule function 10t replace {
		say Hello Schedule World A!
	}
	schedule function 5s replace {
		say Hello Schedule World B!
	}
	schedule function 1d replace {
		say Hello Schedule World C!
	}
}

dir testing {
	dir testing2 {
		function in_a_dir {
			say Hello World From a Dir!
		}
	}
	dir incredible {
		function in_another_dir {
			say Hello World From another Dir!
		}
	}
}

IF <%config.folder_context%> {
	function folder_context_function {
		say Hello World From an IF in folder context!
		IF <%config.function_context%> {
			say Hello World From an IF in function context!
		} ELSE IF <%config.else_if%> {
			say Hello World From an ELSE IF in function context!
		} ELSE {
			say Hello World From an ELSE in function context!
		}
	}
}

LOOP <%10, i%> {
	function <%i%>_iter {
		say Hello World From function <%i%>_iter!
		LOOP <%10, j%> {
			say Hello World From function <%i%>_iter in loop <%j%>!
		}
	}
}

