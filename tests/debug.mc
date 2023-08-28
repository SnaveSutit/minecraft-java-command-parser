
function test {
	say A
	block my_block {
		say B
		{
			say C
		}
	}
	block too_much_inlining {
		say D
	}
	say F
}

dir foo {
	function bar {
		say <%A%>
	}
}

LOOP <%['a', 'b', 'c']%> i {
	function test {
		say <%i%>
	}
}

function say {
	LOOP <%10%> i {
		say <%i%>
	}

	LOOP 10 i {
		say <%i%>
	}

	LOOP <%config.things%> i {
		say <%i%>
	}
}

