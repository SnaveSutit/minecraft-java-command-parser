function foo:my_function
# Macros
function bar:my_macro { arg1: "yes", arg2: "no" }
function bar:my_macro with block 0 0 0 bar.baz
function bar:my_macro with entity @e[limit=1] bar.baz
function bar:my_macro with storage minecraft:foo bar.baz
