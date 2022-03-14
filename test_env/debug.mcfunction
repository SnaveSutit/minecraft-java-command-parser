advancement grant @s everything
advancement grant @s from minecraft:adventure/arbalistic
advancement grant @s only minecraft:adventure/arbalistic
advancement grant @s only minecraft:adventure/arbalistic arbalistic
advancement grant @s through minecraft:adventure/arbalistic
advancement grant @s until minecraft:adventure/arbalistic
advancement revoke @s everything
advancement revoke @s from minecraft:adventure/arbalistic
advancement revoke @s only minecraft:adventure/arbalistic
advancement revoke @s only minecraft:adventure/arbalistic arbalistic
advancement revoke @s through minecraft:adventure/arbalistic
advancement revoke @s until minecraft:adventure/arbalistic

attribute @s minecraft:speed base get
attribute @s minecraft:speed base get 2
attribute @s minecraft:speed base set 2
attribute @s minecraft:speed get
attribute @s minecraft:speed get 2
attribute @s minecraft:speed modifier add 0-0-0-2-1 my_mod 2 add
attribute @s minecraft:speed modifier add 0-0-0-2-1 my_mod 2 multiply
attribute @s minecraft:speed modifier add 0-0-0-2-1 my_mod 2 multiply_base
attribute @s minecraft:speed modifier remove 0-0-0-2-1
attribute @s minecraft:speed modifier value get 0-0-0-2-1
attribute @s minecraft:speed modifier value get 0-0-0-2-1 2

bossbar add foo:bar {"text":"Foo Bar"}
bossbar get foo:bar max
bossbar get foo:bar players
bossbar get foo:bar value
bossbar get foo:bar visible
bossbar list
bossbar remove foo:bar
bossbar set foo:bar color blue
bossbar set foo:bar color green
bossbar set foo:bar color pink
bossbar set foo:bar color purple
bossbar set foo:bar color red
bossbar set foo:bar color white
bossbar set foo:bar color yellow
bossbar set foo:bar max 100
bossbar set foo:bar name {"text":"Foo Bar"}
bossbar set foo:bar players
bossbar set foo:bar players @a
bossbar set foo:bar style notched_10
bossbar set foo:bar style notched_12
bossbar set foo:bar style notched_20
bossbar set foo:bar style notched_6
bossbar set foo:bar style progress
bossbar set foo:bar value 25
bossbar set foo:bar visible true

clear @a
clear @a #minecraft:glass
clear @a minecraft:carrot_on_a_stick{CustomModelData:1} 32
# Tests for item parsing
clear @a minecraft:carrot_on_a_stick{CustomModelData:1}

clone -1 0 -1 1 0 1 ~-1 ~ ~-1
clone -1 0 -1 1 0 1 ~-1 ~ ~-1 filtered minecraft:stone
clone -1 0 -1 1 0 1 ~-1 ~ ~-1 filtered minecraft:stone force
clone -1 0 -1 1 0 1 ~-1 ~ ~-1 filtered minecraft:stone move
clone -1 0 -1 1 0 1 ~-1 ~ ~-1 filtered minecraft:stone normal
clone -1 0 -1 1 0 1 ~-1 ~ ~-1 masked
clone -1 0 -1 1 0 1 ~-1 ~ ~-1 masked force
clone -1 0 -1 1 0 1 ~-1 ~ ~-1 masked move
clone -1 0 -1 1 0 1 ~-1 ~ ~-1 masked normal
clone -1 0 -1 1 0 1 ~-1 ~ ~-1 replace
clone -1 0 -1 1 0 1 ~-1 ~ ~-1 replace force
clone -1 0 -1 1 0 1 ~-1 ~ ~-1 replace move
clone -1 0 -1 1 0 1 ~-1 ~ ~-1 replace normal
# Tests for block parsing
clone -1 0 -1 1 0 1 ~-1 ~ ~-1 filtered minecraft:water_cauldron[level=2]
clone -1 0 -1 1 0 1 ~-1 ~ ~-1 filtered minecraft:chest[facing=east,waterlogged=false]{Items:[{id:"minecraft:stone",Count:1b}]} force
# Testing NBT path parsing
data get entity @s ArmorItems[-1].tag."my Special Tag"
data modify block ~ ~ ~ Items[{Slot:12b}].tag.list insert 0 value "my_value"

data get block ~ ~ ~
data get block ~ ~ ~ test.path.A
data get block ~ ~ ~ test.path.A 1
data get entity @s
data get entity @s test.path.A
data get entity @s test.path.A 1
data get storage foo:bar
data get storage foo:bar test.path.A
data get storage foo:bar test.path.A 1
data merge block ~ ~ ~ {a:false,b:[0,1,2,3],c:{d:0b,e:2.0d}}
data merge entity @s {a:false,b:[0,1,2,3],c:{d:0b,e:2.0d}}
data merge storage foo:bar {a:false,b:[0,1,2,3],c:{d:0b,e:2.0d}}
data modify block ~ ~ ~ test.path.A append from block ~ ~1 ~
data modify block ~ ~ ~ test.path.A append from block ~ ~1 ~ test.path.B
data modify block ~ ~ ~ test.path.A append from entity @s
data modify block ~ ~ ~ test.path.A append from entity @s test.path.B
data modify block ~ ~ ~ test.path.A append from storage foobar:baz
data modify block ~ ~ ~ test.path.A append from storage foobar:baz test.path.B
data modify block ~ ~ ~ test.path.A append value {a:false,b:[0,1,2,3],c:{d:0b,e:2.0d}}
data modify block ~ ~ ~ test.path.A insert 0 from block ~ ~1 ~
data modify block ~ ~ ~ test.path.A insert 0 from block ~ ~1 ~ test.path.B
data modify block ~ ~ ~ test.path.A insert 0 from entity @s
data modify block ~ ~ ~ test.path.A insert 0 from entity @s test.path.B
data modify block ~ ~ ~ test.path.A insert 0 from storage foobar:baz
data modify block ~ ~ ~ test.path.A insert 0 from storage foobar:baz test.path.B
data modify block ~ ~ ~ test.path.A insert 0 value {a:false,b:[0,1,2,3],c:{d:0b,e:2.0d}}
data modify block ~ ~ ~ test.path.A merge from block ~ ~1 ~
data modify block ~ ~ ~ test.path.A merge from block ~ ~1 ~ test.path.B
data modify block ~ ~ ~ test.path.A merge from entity @s
data modify block ~ ~ ~ test.path.A merge from entity @s test.path.B
data modify block ~ ~ ~ test.path.A merge from storage foobar:baz
data modify block ~ ~ ~ test.path.A merge from storage foobar:baz test.path.B
data modify block ~ ~ ~ test.path.A merge value {a:false,b:[0,1,2,3],c:{d:0b,e:2.0d}}
data modify block ~ ~ ~ test.path.A prepend from block ~ ~1 ~
data modify block ~ ~ ~ test.path.A prepend from block ~ ~1 ~ test.path.B
data modify block ~ ~ ~ test.path.A prepend from entity @s
data modify block ~ ~ ~ test.path.A prepend from entity @s test.path.B
data modify block ~ ~ ~ test.path.A prepend from storage foobar:baz
data modify block ~ ~ ~ test.path.A prepend from storage foobar:baz test.path.B
data modify block ~ ~ ~ test.path.A prepend value {a:false,b:[0,1,2,3],c:{d:0b,e:2.0d}}
data modify block ~ ~ ~ test.path.A set from block ~ ~1 ~
data modify block ~ ~ ~ test.path.A set from block ~ ~1 ~ test.path.B
data modify block ~ ~ ~ test.path.A set from entity @s
data modify block ~ ~ ~ test.path.A set from entity @s test.path.B
data modify block ~ ~ ~ test.path.A set from storage foobar:baz
data modify block ~ ~ ~ test.path.A set from storage foobar:baz test.path.B
data modify block ~ ~ ~ test.path.A set value {a:false,b:[0,1,2,3],c:{d:0b,e:2.0d}}
data modify entity @s test.path.A append from block ~ ~1 ~
data modify entity @s test.path.A append from block ~ ~1 ~ test.path.B
data modify entity @s test.path.A append from entity @s
data modify entity @s test.path.A append from entity @s test.path.B
data modify entity @s test.path.A append from storage foobar:baz
data modify entity @s test.path.A append from storage foobar:baz test.path.B
data modify entity @s test.path.A append value {a:false,b:[0,1,2,3],c:{d:0b,e:2.0d}}
data modify entity @s test.path.A insert 0 from block ~ ~1 ~
data modify entity @s test.path.A insert 0 from block ~ ~1 ~ test.path.B
data modify entity @s test.path.A insert 0 from entity @s
data modify entity @s test.path.A insert 0 from entity @s test.path.B
data modify entity @s test.path.A insert 0 from storage foobar:baz
data modify entity @s test.path.A insert 0 from storage foobar:baz test.path.B
data modify entity @s test.path.A insert 0 value {a:false,b:[0,1,2,3],c:{d:0b,e:2.0d}}
data modify entity @s test.path.A merge from block ~ ~1 ~
data modify entity @s test.path.A merge from block ~ ~1 ~ test.path.B
data modify entity @s test.path.A merge from entity @s
data modify entity @s test.path.A merge from entity @s test.path.B
data modify entity @s test.path.A merge from storage foobar:baz
data modify entity @s test.path.A merge from storage foobar:baz test.path.B
data modify entity @s test.path.A merge value {a:false,b:[0,1,2,3],c:{d:0b,e:2.0d}}
data modify entity @s test.path.A prepend from block ~ ~1 ~
data modify entity @s test.path.A prepend from block ~ ~1 ~ test.path.B
data modify entity @s test.path.A prepend from entity @s
data modify entity @s test.path.A prepend from entity @s test.path.B
data modify entity @s test.path.A prepend from storage foobar:baz
data modify entity @s test.path.A prepend from storage foobar:baz test.path.B
data modify entity @s test.path.A prepend value {a:false,b:[0,1,2,3],c:{d:0b,e:2.0d}}
data modify entity @s test.path.A set from block ~ ~1 ~
data modify entity @s test.path.A set from block ~ ~1 ~ test.path.B
data modify entity @s test.path.A set from entity @s
data modify entity @s test.path.A set from entity @s test.path.B
data modify entity @s test.path.A set from storage foobar:baz
data modify entity @s test.path.A set from storage foobar:baz test.path.B
data modify entity @s test.path.A set value {a:false,b:[0,1,2,3],c:{d:0b,e:2.0d}}
data modify storage foo:bar test.path.A append from block ~ ~1 ~
data modify storage foo:bar test.path.A append from block ~ ~1 ~ test.path.B
data modify storage foo:bar test.path.A append from entity @s
data modify storage foo:bar test.path.A append from entity @s test.path.B
data modify storage foo:bar test.path.A append from storage foobar:baz
data modify storage foo:bar test.path.A append from storage foobar:baz test.path.B
data modify storage foo:bar test.path.A append value {a:false,b:[0,1,2,3],c:{d:0b,e:2.0d}}
data modify storage foo:bar test.path.A insert 0 from block ~ ~1 ~
data modify storage foo:bar test.path.A insert 0 from block ~ ~1 ~ test.path.B
data modify storage foo:bar test.path.A insert 0 from entity @s
data modify storage foo:bar test.path.A insert 0 from entity @s test.path.B
data modify storage foo:bar test.path.A insert 0 from storage foobar:baz
data modify storage foo:bar test.path.A insert 0 from storage foobar:baz test.path.B
data modify storage foo:bar test.path.A insert 0 value {a:false,b:[0,1,2,3],c:{d:0b,e:2.0d}}
data modify storage foo:bar test.path.A merge from block ~ ~1 ~
data modify storage foo:bar test.path.A merge from block ~ ~1 ~ test.path.B
data modify storage foo:bar test.path.A merge from entity @s
data modify storage foo:bar test.path.A merge from entity @s test.path.B
data modify storage foo:bar test.path.A merge from storage foobar:baz
data modify storage foo:bar test.path.A merge from storage foobar:baz test.path.B
data modify storage foo:bar test.path.A merge value {a:false,b:[0,1,2,3],c:{d:0b,e:2.0d}}
data modify storage foo:bar test.path.A prepend from block ~ ~1 ~
data modify storage foo:bar test.path.A prepend from block ~ ~1 ~ test.path.B
data modify storage foo:bar test.path.A prepend from entity @s
data modify storage foo:bar test.path.A prepend from entity @s test.path.B
data modify storage foo:bar test.path.A prepend from storage foobar:baz
data modify storage foo:bar test.path.A prepend from storage foobar:baz test.path.B
data modify storage foo:bar test.path.A prepend value {a:false,b:[0,1,2,3],c:{d:0b,e:2.0d}}
data modify storage foo:bar test.path.A set from block ~ ~1 ~
data modify storage foo:bar test.path.A set from block ~ ~1 ~ test.path.B
data modify storage foo:bar test.path.A set from entity @s
data modify storage foo:bar test.path.A set from entity @s test.path.B
data modify storage foo:bar test.path.A set from storage foobar:baz
data modify storage foo:bar test.path.A set from storage foobar:baz test.path.B
data modify storage foo:bar test.path.A set value {a:false,b:[0,1,2,3],c:{d:0b,e:2.0d}}
data remove block ~ ~ ~ test.path.A
data remove entity @s test.path.A
data remove storage foo:bar test.path.A

datapack disable my_datapack
datapack enable my_datapack
datapack enable my_datapack after other_datapack
datapack enable my_datapack before other_datapack
datapack enable my_datapack first
datapack enable my_datapack last
datapack list
datapack list available
datapack list enabled

difficulty
difficulty easy
difficulty hard
difficulty normal
difficulty peaceful

effect clear
effect clear @s
effect clear @s minecraft:speed
effect give @s minecraft:speed
effect give @s minecraft:speed 10
effect give @s minecraft:speed 10 2
effect give @s minecraft:speed 10 2 true

enchant @s minecraft:sharpness
enchant @s minecraft:sharpness 2

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

# Multi-lined execute command with every possible argument tree
| execute align xyz
	anchored feet
	as @s
	at @s
	facing entity @s feet
	facing 0 0 0
	if block ~ ~ ~ minecraft:stone
	if blocks ~-1 ~ ~-1 ~1 ~ ~1 ~ ~ ~ all
	if blocks ~-1 ~ ~-1 ~1 ~ ~1 ~ ~ ~ masked
	if data block 0 0 0 test.path.A
	if data entity @s test.path.A
	if data storage foo:bar test.path.A
	if entity @s
	if predicate namespace:my_predicate
	if score .a i < .b i
	if score .a i <= .b i
	if score .a i = .b i
	if score .a i > .b i
	if score .a i >= .b i
	if score .a i matches 0..2
	in minecraft:overworld
	positioned as @s
	positioned 0 0 0
	rotated as @s
	rotated ~ 0
	store result block 0 1 0 test.path.A byte 1.0
	store result block 0 1 0 test.path.A double 1.0
	store result block 0 1 0 test.path.A float 1.0
	store result block 0 1 0 test.path.A int 1.0
	store result block 0 1 0 test.path.A long 1.0
	store result block 0 1 0 test.path.A short 1.0
	store result bossbar ex:bossbar max
	store result bossbar ex:bossbar value
	store result entity @s test.path.A byte 1.0
	store result entity @s test.path.A double 1.0
	store result entity @s test.path.A float 1.0
	store result entity @s test.path.A int 1.0
	store result entity @s test.path.A long 1.0
	store result entity @s test.path.A short 1.0
	store result score .c v
	store result storage foo:bar test.path.A byte 1.0
	store result storage foo:bar test.path.A double 1.0
	store result storage foo:bar test.path.A float 1.0
	store result storage foo:bar test.path.A int 1.0
	store result storage foo:bar test.path.A long 1.0
	store result storage foo:bar test.path.A short 1.0
	store success block 0 1 0 test.path.A byte 1.0
	store success block 0 1 0 test.path.A double 1.0
	store success block 0 1 0 test.path.A float 1.0
	store success block 0 1 0 test.path.A int 1.0
	store success block 0 1 0 test.path.A long 1.0
	store success block 0 1 0 test.path.A short 1.0
	store success bossbar ex:bossbar max
	store success bossbar ex:bossbar value
	store success entity @s test.path.A byte 1.0
	store success entity @s test.path.A double 1.0
	store success entity @s test.path.A float 1.0
	store success entity @s test.path.A int 1.0
	store success entity @s test.path.A long 1.0
	store success entity @s test.path.A short 1.0
	store success score .c v
	store success storage foo:bar test.path.A byte 1.0
	store success storage foo:bar test.path.A double 1.0
	store success storage foo:bar test.path.A float 1.0
	store success storage foo:bar test.path.A int 1.0
	store success storage foo:bar test.path.A long 1.0
	store success storage foo:bar test.path.A short 1.0
	unless block ~ ~ ~ minecraft:stone
	unless blocks ~-1 ~ ~-1 ~1 ~ ~1 ~ ~ ~ all
	unless blocks ~-1 ~ ~-1 ~1 ~ ~1 ~ ~ ~ masked
	unless data block 0 0 0 test.path.A
	unless data entity @s test.path.A
	unless data storage foo:bar test.path.A
	unless entity @s
	unless predicate namespace:my_predicate
	unless score .a i < .b i
	unless score .a i <= .b i
	unless score .a i = .b i
	unless score .a i > .b i
	unless score .a i >= .b i
	unless score .a i matches 0..2
	run clear
# execute run execute run execute run execute run execute run execute run execute run execute run execute run execute run execute run execute run execute run say hi

experience add @s 10
experience add @s 10 levels
experience add @s 10 points
experience query @s levels
experience query @s points
experience set @s 10
experience set @s 10 levels
experience set @s 10 points
# /xp is an alias of /experience
xp add @s 10
xp add @s 10 levels
xp add @s 10 points
xp query @s levels
xp query @s points
xp set @s 10
xp set @s 10 levels
xp set @s 10 points

fill ~-1 ~ ~-1 ~1 ~ ~1 minecraft:stone
fill ~-1 ~ ~-1 ~1 ~ ~1 minecraft:stone destroy
fill ~-1 ~ ~-1 ~1 ~ ~1 minecraft:stone hollow
fill ~-1 ~ ~-1 ~1 ~ ~1 minecraft:stone keep
fill ~-1 ~ ~-1 ~1 ~ ~1 minecraft:stone outline
fill ~-1 ~ ~-1 ~1 ~ ~1 minecraft:stone replace
fill ~-1 ~ ~-1 ~1 ~ ~1 minecraft:stone replace minecraft:grass

forceload add ~ ~
forceload add ~1 ~1 ~-1 ~-1
forceload query
forceload query ~ ~
forceload remove all
forceload remove ~ ~
forceload remove ~1 ~1 ~-1 ~-1

function my_datapack:my_function/path

gamemode adventure
gamemode adventure @s
gamemode creative
gamemode creative @s
gamemode spectator
gamemode spectator @s
gamemode survival
gamemode survival @s

gamerule announceAdvancements
gamerule announceAdvancements false
gamerule commandBlockOutput
gamerule commandBlockOutput false
gamerule disableElytraMovementCheck
gamerule disableElytraMovementCheck false
gamerule disableRaids
gamerule disableRaids false
gamerule doDaylightCycle
gamerule doDaylightCycle false
gamerule doEntityDrops
gamerule doEntityDrops false
gamerule doFireTick
gamerule doFireTick false
gamerule doImmediateRespawn
gamerule doImmediateRespawn false
gamerule doInsomnia
gamerule doInsomnia false
gamerule doLimitedCrafting
gamerule doLimitedCrafting false
gamerule doMobLoot
gamerule doMobLoot false
gamerule doMobSpawning
gamerule doMobSpawning false
gamerule doPatrolSpawning
gamerule doPatrolSpawning false
gamerule doTileDrops
gamerule doTileDrops false
gamerule doTraderSpawning
gamerule doTraderSpawning false
gamerule doWeatherCycle
gamerule doWeatherCycle false
gamerule drowningDamage
gamerule drowningDamage false
gamerule fallDamage
gamerule fallDamage false
gamerule fireDamage
gamerule fireDamage false
gamerule forgiveDeadPlayers
gamerule forgiveDeadPlayers false
gamerule freezeDamage
gamerule freezeDamage false
gamerule keepInventory
gamerule keepInventory false
gamerule logAdminCommands
gamerule logAdminCommands false
gamerule maxCommandChainLength
gamerule maxCommandChainLength 22
gamerule maxEntityCramming
gamerule maxEntityCramming 22
gamerule mobGriefing
gamerule mobGriefing false
gamerule naturalRegeneration
gamerule naturalRegeneration false
gamerule playersSleepingPercentage
gamerule playersSleepingPercentage 22
gamerule randomTickSpeed
gamerule randomTickSpeed 22
gamerule reducedDebugInfo
gamerule reducedDebugInfo false
gamerule sendCommandFeedback
gamerule sendCommandFeedback false
gamerule showDeathMessages
gamerule showDeathMessages false
gamerule spawnRadius
gamerule spawnRadius 22
gamerule spectatorsGenerateChunks
gamerule spectatorsGenerateChunks false
gamerule universalAnger
gamerule universalAnger false

item modify block ~ ~ ~ container.0 foo:my_modifier
item modify entity @s container.0 foo:my_modifier
item replace block ~ ~ ~ container.0 from block ~ ~1 ~ container.0
item replace block ~ ~ ~ container.0 from block ~ ~1 ~ container.0 foo:my_modifier
item replace block ~ ~ ~ container.0 from entity @s container.0
item replace block ~ ~ ~ container.0 from entity @s container.0 foo:my_modifier
item replace block ~ ~ ~ container.0 with minecraft:diamond
item replace block ~ ~ ~ container.0 with minecraft:diamond 42
item replace entity @s container.0 from block ~ ~1 ~ container.0
item replace entity @s container.0 from block ~ ~1 ~ container.0 foo:my_modifier
item replace entity @s container.0 from entity @s container.0
item replace entity @s container.0 from entity @s container.0 foo:my_modifier
item replace entity @s container.0 with minecraft:diamond
item replace entity @s container.0 with minecraft:diamond 42

kill
kill @s

list
list uuids

locate minecraft:special_structure

locatebiome minecraft:special_biome

loot give @s fish foo:my_loot/table ~ ~ ~
loot give @s fish foo:my_loot/table ~ ~ ~ mainhand
loot give @s fish foo:my_loot/table ~ ~ ~ offhand
loot give @s fish foo:my_loot/table ~ ~ ~ minecraft:diamond_axe
loot give @s kill @s
loot give @s loot foo:my_loot/table
loot give @s mine ~ ~ ~
loot give @s mine ~ ~ ~ mainhand
loot give @s mine ~ ~ ~ offhand
loot give @s mine ~ ~ ~ minecraft:diamond_axe
loot insert ~ ~ ~ fish foo:my_loot/table ~ ~ ~
loot insert ~ ~ ~ fish foo:my_loot/table ~ ~ ~ mainhand
loot insert ~ ~ ~ fish foo:my_loot/table ~ ~ ~ offhand
loot insert ~ ~ ~ fish foo:my_loot/table ~ ~ ~ minecraft:diamond_axe
loot insert ~ ~ ~ kill @s
loot insert ~ ~ ~ loot foo:my_loot/table
loot insert ~ ~ ~ mine ~ ~ ~
loot insert ~ ~ ~ mine ~ ~ ~ mainhand
loot insert ~ ~ ~ mine ~ ~ ~ offhand
loot insert ~ ~ ~ mine ~ ~ ~ minecraft:diamond_axe
loot replace block ~ ~ ~ container.0 7 fish foo:my_loot/table ~ ~ ~
loot replace block ~ ~ ~ container.0 7 fish foo:my_loot/table ~ ~ ~ mainhand
loot replace block ~ ~ ~ container.0 7 fish foo:my_loot/table ~ ~ ~ offhand
loot replace block ~ ~ ~ container.0 7 fish foo:my_loot/table ~ ~ ~ minecraft:diamond_axe
loot replace block ~ ~ ~ container.0 7 kill @s
loot replace block ~ ~ ~ container.0 7 loot foo:my_loot/table
loot replace block ~ ~ ~ container.0 7 mine ~ ~ ~
loot replace block ~ ~ ~ container.0 7 mine ~ ~ ~ mainhand
loot replace block ~ ~ ~ container.0 7 mine ~ ~ ~ offhand
loot replace block ~ ~ ~ container.0 7 mine ~ ~ ~ minecraft:diamond_axe
loot replace block ~ ~ ~ container.0 fish foo:my_loot/table ~ ~ ~
loot replace block ~ ~ ~ container.0 fish foo:my_loot/table ~ ~ ~ mainhand
loot replace block ~ ~ ~ container.0 fish foo:my_loot/table ~ ~ ~ offhand
loot replace block ~ ~ ~ container.0 fish foo:my_loot/table ~ ~ ~ minecraft:diamond_axe
loot replace block ~ ~ ~ container.0 kill @s
loot replace block ~ ~ ~ container.0 loot foo:my_loot/table
loot replace block ~ ~ ~ container.0 mine ~ ~ ~
loot replace block ~ ~ ~ container.0 mine ~ ~ ~ mainhand
loot replace block ~ ~ ~ container.0 mine ~ ~ ~ offhand
loot replace block ~ ~ ~ container.0 mine ~ ~ ~ minecraft:diamond_axe
loot replace entity @s container.0 7 fish foo:my_loot/table ~ ~ ~
loot replace entity @s container.0 7 fish foo:my_loot/table ~ ~ ~ mainhand
loot replace entity @s container.0 7 fish foo:my_loot/table ~ ~ ~ offhand
loot replace entity @s container.0 7 fish foo:my_loot/table ~ ~ ~ minecraft:diamond_axe
loot replace entity @s container.0 7 kill @s
loot replace entity @s container.0 7 loot foo:my_loot/table
loot replace entity @s container.0 7 mine ~ ~ ~
loot replace entity @s container.0 7 mine ~ ~ ~ mainhand
loot replace entity @s container.0 7 mine ~ ~ ~ offhand
loot replace entity @s container.0 7 mine ~ ~ ~ minecraft:diamond_axe
loot replace entity @s container.0 fish foo:my_loot/table ~ ~ ~
loot replace entity @s container.0 fish foo:my_loot/table ~ ~ ~ mainhand
loot replace entity @s container.0 fish foo:my_loot/table ~ ~ ~ offhand
loot replace entity @s container.0 fish foo:my_loot/table ~ ~ ~ minecraft:diamond_axe
loot replace entity @s container.0 kill @s
loot replace entity @s container.0 loot foo:my_loot/table
loot replace entity @s container.0 mine ~ ~ ~
loot replace entity @s container.0 mine ~ ~ ~ mainhand
loot replace entity @s container.0 mine ~ ~ ~ offhand
loot replace entity @s container.0 mine ~ ~ ~ minecraft:diamond_axe
loot spawn ~ ~ ~ fish foo:my_loot/table ~ ~ ~
loot spawn ~ ~ ~ fish foo:my_loot/table ~ ~ ~ mainhand
loot spawn ~ ~ ~ fish foo:my_loot/table ~ ~ ~ offhand
loot spawn ~ ~ ~ fish foo:my_loot/table ~ ~ ~ minecraft:diamond_axe
loot spawn ~ ~ ~ kill @s
loot spawn ~ ~ ~ loot foo:my_loot/table
loot spawn ~ ~ ~ mine ~ ~ ~
loot spawn ~ ~ ~ mine ~ ~ ~ mainhand
loot spawn ~ ~ ~ mine ~ ~ ~ offhand
loot spawn ~ ~ ~ mine ~ ~ ~ minecraft:diamond_axe

particle minecraft:crit
particle minecraft:crit ~ ~ ~
particle minecraft:crit ~ ~ ~ 0 0 0 1 0
particle minecraft:crit ~ ~ ~ 0 0 0 1 0 force
particle minecraft:crit ~ ~ ~ 0 0 0 1 0 force @a
particle minecraft:crit ~ ~ ~ 0 0 0 1 0 normal
particle minecraft:crit ~ ~ ~ 0 0 0 1 0 normal @a
particle dust 1.0 0.5 0.5 1.0
particle dust_color_transition 1.0 0.0 0.0 1.0 0.0 0.0 1.0
particle block minecraft:stone
particle falling_dust minecraft:stone
particle item minecraft:apple
particle vibration 0.0 64.0 0.0 5.0 64.0 0.0 200

