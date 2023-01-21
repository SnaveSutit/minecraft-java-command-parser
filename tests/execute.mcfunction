execute align xyz
execute anchored feet
execute as @s
execute at @s
execute facing entity @s feet
execute facing 0 0 0
execute if block ~ ~ ~ minecraft:stone
execute if blocks ~-1 ~ ~-1 ~1 ~ ~1 ~ ~ ~ all
execute if blocks ~-1 ~ ~-1 ~1 ~ ~1 ~ ~ ~ masked
execute if data block 0 0 0 test.path.A
execute if data entity @s test.path.A
execute if data storage foo:bar test.path.A
execute if entity @s
execute if predicate namespace:my_predicate
execute if score .a i < .b i
execute if score .a i <= .b i
execute if score .a i = .b i
execute if score .a i > .b i
execute if score .a i >= .b i
execute if score .a i matches 0..2
execute in minecraft:overworld
execute positioned as @s
execute positioned 0 0 0
execute rotated as @s
execute rotated ~ 0
execute run clear
execute store result block 0 1 0 test.path.A byte 1.0
execute store result block 0 1 0 test.path.A double 1.0
execute store result block 0 1 0 test.path.A float 1.0
execute store result block 0 1 0 test.path.A int 1.0
execute store result block 0 1 0 test.path.A long 1.0
execute store result block 0 1 0 test.path.A short 1.0
execute store result bossbar ex:bossbar max
execute store result bossbar ex:bossbar value
execute store result entity @s test.path.A byte 1.0
execute store result entity @s test.path.A double 1.0
execute store result entity @s test.path.A float 1.0
execute store result entity @s test.path.A int 1.0
execute store result entity @s test.path.A long 1.0
execute store result entity @s test.path.A short 1.0
execute store result score .c v
execute store result storage foo:bar test.path.A byte 1.0
execute store result storage foo:bar test.path.A double 1.0
execute store result storage foo:bar test.path.A float 1.0
execute store result storage foo:bar test.path.A int 1.0
execute store result storage foo:bar test.path.A long 1.0
execute store result storage foo:bar test.path.A short 1.0
execute store success block 0 1 0 test.path.A byte 1.0
execute store success block 0 1 0 test.path.A double 1.0
execute store success block 0 1 0 test.path.A float 1.0
execute store success block 0 1 0 test.path.A int 1.0
execute store success block 0 1 0 test.path.A long 1.0
execute store success block 0 1 0 test.path.A short 1.0
execute store success bossbar ex:bossbar max
execute store success bossbar ex:bossbar value
execute store success entity @s test.path.A byte 1.0
execute store success entity @s test.path.A double 1.0
execute store success entity @s test.path.A float 1.0
execute store success entity @s test.path.A int 1.0
execute store success entity @s test.path.A long 1.0
execute store success entity @s test.path.A short 1.0
execute store success score .c v
execute store success storage foo:bar test.path.A byte 1.0
execute store success storage foo:bar test.path.A double 1.0
execute store success storage foo:bar test.path.A float 1.0
execute store success storage foo:bar test.path.A int 1.0
execute store success storage foo:bar test.path.A long 1.0
execute store success storage foo:bar test.path.A short 1.0
execute unless block ~ ~ ~ minecraft:stone
execute unless blocks ~-1 ~ ~-1 ~1 ~ ~1 ~ ~ ~ all
execute unless blocks ~-1 ~ ~-1 ~1 ~ ~1 ~ ~ ~ masked
execute unless data block 0 0 0 test.path.A
execute unless data entity @s test.path.A
execute unless data storage foo:bar test.path.A
execute unless entity @s
execute unless predicate namespace:my_predicate
execute unless score .a i < .b i
execute unless score .a i <= .b i
execute unless score .a i = .b i
execute unless score .a i > .b i
execute unless score .a i >= .b i
execute unless score .a i matches 0..2