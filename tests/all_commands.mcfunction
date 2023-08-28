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

placefeature minecraft:epic_feature
placefeature minecraft:stone_house ~1 ~2 ~3

playsound minecraft:block.note_block.bell ambient @a
playsound minecraft:block.note_block.bell ambient @a ~ ~ ~
playsound minecraft:block.note_block.bell ambient @a ~ ~ ~ 1
playsound minecraft:block.note_block.bell ambient @a ~ ~ ~ 1 0.5
playsound minecraft:block.note_block.bell ambient @a ~ ~ ~ 1 0.5 0.1
playsound minecraft:block.note_block.bell block @a
playsound minecraft:block.note_block.bell block @a ~ ~ ~
playsound minecraft:block.note_block.bell block @a ~ ~ ~ 1
playsound minecraft:block.note_block.bell block @a ~ ~ ~ 1 0.5
playsound minecraft:block.note_block.bell block @a ~ ~ ~ 1 0.5 0.1
playsound minecraft:block.note_block.bell hostile @a
playsound minecraft:block.note_block.bell hostile @a ~ ~ ~
playsound minecraft:block.note_block.bell hostile @a ~ ~ ~ 1
playsound minecraft:block.note_block.bell hostile @a ~ ~ ~ 1 0.5
playsound minecraft:block.note_block.bell hostile @a ~ ~ ~ 1 0.5 0.1
playsound minecraft:block.note_block.bell master @a
playsound minecraft:block.note_block.bell master @a ~ ~ ~
playsound minecraft:block.note_block.bell master @a ~ ~ ~ 1
playsound minecraft:block.note_block.bell master @a ~ ~ ~ 1 0.5
playsound minecraft:block.note_block.bell master @a ~ ~ ~ 1 0.5 0.1
playsound minecraft:block.note_block.bell music @a
playsound minecraft:block.note_block.bell music @a ~ ~ ~
playsound minecraft:block.note_block.bell music @a ~ ~ ~ 1
playsound minecraft:block.note_block.bell music @a ~ ~ ~ 1 0.5
playsound minecraft:block.note_block.bell music @a ~ ~ ~ 1 0.5 0.1
playsound minecraft:block.note_block.bell neutral @a
playsound minecraft:block.note_block.bell neutral @a ~ ~ ~
playsound minecraft:block.note_block.bell neutral @a ~ ~ ~ 1
playsound minecraft:block.note_block.bell neutral @a ~ ~ ~ 1 0.5
playsound minecraft:block.note_block.bell neutral @a ~ ~ ~ 1 0.5 0.1
playsound minecraft:block.note_block.bell player @a
playsound minecraft:block.note_block.bell player @a ~ ~ ~
playsound minecraft:block.note_block.bell player @a ~ ~ ~ 1
playsound minecraft:block.note_block.bell player @a ~ ~ ~ 1 0.5
playsound minecraft:block.note_block.bell player @a ~ ~ ~ 1 0.5 0.1
playsound minecraft:block.note_block.bell record @a
playsound minecraft:block.note_block.bell record @a ~ ~ ~
playsound minecraft:block.note_block.bell record @a ~ ~ ~ 1
playsound minecraft:block.note_block.bell record @a ~ ~ ~ 1 0.5
playsound minecraft:block.note_block.bell record @a ~ ~ ~ 1 0.5 0.1
playsound minecraft:block.note_block.bell voice @a
playsound minecraft:block.note_block.bell voice @a ~ ~ ~
playsound minecraft:block.note_block.bell voice @a ~ ~ ~ 1
playsound minecraft:block.note_block.bell voice @a ~ ~ ~ 1 0.5
playsound minecraft:block.note_block.bell voice @a ~ ~ ~ 1 0.5 0.1
playsound minecraft:block.note_block.bell weather @a
playsound minecraft:block.note_block.bell weather @a ~ ~ ~
playsound minecraft:block.note_block.bell weather @a ~ ~ ~ 1
playsound minecraft:block.note_block.bell weather @a ~ ~ ~ 1 0.5
playsound minecraft:block.note_block.bell weather @a ~ ~ ~ 1 0.5 0.1

recipe give @s *
recipe give @s minecraft:stone_pickaxe
recipe take @s *
recipe take @s minecraft:stone_pickaxe

say Hello World!

schedule clear foo:bar/baz
schedule function foo:bar/baz 1
schedule function foo:bar/baz 1t
schedule function foo:bar/baz 1s append
schedule function foo:bar/baz 1d replace

scoreboard objectives add i dummy
scoreboard objectives add i dummy {"text": "Internal"}
scoreboard objectives list
scoreboard objectives modify i displayname {"text": "Internal"}
scoreboard objectives modify i rendertype hearts
scoreboard objectives modify i rendertype integer
scoreboard objectives remove i
scoreboard objectives setdisplay list
scoreboard objectives setdisplay sidebar
scoreboard objectives setdisplay sidebar i
scoreboard players add @s i 2
scoreboard players enable @s i
scoreboard players get @s i
scoreboard players list
scoreboard players list @s
scoreboard players operation @s i = .value i
scoreboard players operation @s i -= .value i
scoreboard players operation @s i += .value i
scoreboard players operation @s i *= .value i
scoreboard players operation @s i /= .value i
scoreboard players operation @s i %= .value i
scoreboard players operation @s i < .value i
scoreboard players operation @s i > .value i
scoreboard players operation @s i >< .value i
scoreboard players remove @s i 2
scoreboard players reset @s
scoreboard players reset @s i
scoreboard players set @s i 2

setblock ~ ~ ~ minecraft:stone
setblock ~ ~ ~ minecraft:stone destroy
setblock ~ ~ ~ minecraft:stone keep
setblock ~ ~ ~ minecraft:stone replace

setworldspawn
setworldspawn 0 0 0
setworldspawn 0 0 0 0 90

spawnpoint
spawnpoint @s
spawnpoint @s 10 0 10
spawnpoint @s 10 0 10 90 180

spectate
spectate @r
spectate @r @s

spreadplayers ~ ~ 10 256 true @a
spreadplayers ~ ~ 10 256 under 128 true @a

stopsound @a
stopsound @a * minecraft:block.note_block.bell
stopsound @a ambient
stopsound @a ambient minecraft:block.note_block.bell
stopsound @a block
stopsound @a block minecraft:block.note_block.bell
stopsound @a hostile
stopsound @a hostile minecraft:block.note_block.bell
stopsound @a master
stopsound @a master minecraft:block.note_block.bell
stopsound @a music
stopsound @a music minecraft:block.note_block.bell
stopsound @a neutral
stopsound @a neutral minecraft:block.note_block.bell
stopsound @a player
stopsound @a player minecraft:block.note_block.bell
stopsound @a record
stopsound @a record minecraft:block.note_block.bell
stopsound @a voice
stopsound @a voice minecraft:block.note_block.bell
stopsound @a weather
stopsound @a weather minecraft:block.note_block.bell

summon minecraft:armor_stand
summon minecraft:armor_stand ~ ~ ~
summon minecraft:armor_stand ~ ~ ~ {CustomName: '{"text":"No Armor Stands? :(", "italic":false}',NoGravity:1b,Invisible:false}

tag @s add my_tag
tag @s list
tag @s remove my_tag

team add my_team
team add my_team {"text":"Super epic team name"}
team empty my_team
team join my_team
team join my_team @a
team leave @a
team list
team list my_team
team modify my_team collisionRule always
team modify my_team collisionRule never
team modify my_team collisionRule pushOtherTeams
team modify my_team collisionRule pushOwnTeam
team modify my_team color aqua
team modify my_team color black
team modify my_team color blue
team modify my_team color dark_aqua
team modify my_team color dark_blue
team modify my_team color dark_gray
team modify my_team color dark_green
team modify my_team color dark_purple
team modify my_team color dark_red
team modify my_team color gold
team modify my_team color gray
team modify my_team color green
team modify my_team color light_purple
team modify my_team color red
team modify my_team color white
team modify my_team color yellow
team modify my_team deathMessageVisibility always
team modify my_team deathMessageVisibility hideForOtherTeams
team modify my_team deathMessageVisibility hideForOwnTeam
team modify my_team deathMessageVisibility never
team modify my_team displayName {"text":"Super epic team name"}
team modify my_team friendlyFire false
team modify my_team nametagVisibility always
team modify my_team nametagVisibility hideForOtherTeams
team modify my_team nametagVisibility hideForOwnTeam
team modify my_team nametagVisibility never
team modify my_team prefix {"text":"Best prefix"}
team modify my_team seeFriendlyInvisibles false
team modify my_team suffix {"text":"Best suffix"}
team remove my_team

teleport @s
teleport ~ ~1 ~
teleport @s @e[limit=1,sort=random]
teleport @s ~ ~1 ~
teleport @s ~ ~1 ~ facing entity @p
teleport @s ~ ~1 ~ facing entity @p eyes
teleport @s ~ ~1 ~ facing 0 1 0
teleport @s ~ ~1 ~ ~ 0
tp @s
tp ~ ~1 ~
tp @s @e[limit=1,sort=random]
tp @s ~ ~1 ~
tp @s ~ ~1 ~ facing entity @p
tp @s ~ ~1 ~ facing entity @p eyes
tp @s ~ ~1 ~ facing 0 1 0
tp @s ~ ~1 ~ ~ 0

tellraw @a ["",{"text":"Your mom's a hoe.","italic": true, "bold": false}]

time add 1
time add 1t
time add 1s
time add 1d
time query day
time query daytime
time query gametime
time set day
time set midnight
time set night
time set noon
time set 1

title @a actionbar {"text":"My Special Title"}
title @a clear
title @a reset
title @a subtitle {"text":"My Special Title"}
title @a times 0 10 80
title @a title {"text":"My Special Title"}

trigger trigger
trigger trigger add 1
trigger trigger set 1

weather clear
weather clear 10
weather rain
weather rain 10
weather thunder
weather thunder 10

worldborder add 10
worldborder add 10 20
worldborder center 0 ~ 0
worldborder damage amount 6.9
worldborder damage buffer 22
worldborder get
worldborder set 10
worldborder set 10 20
worldborder warning distance 42
worldborder warning time 1