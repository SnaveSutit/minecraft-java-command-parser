say -awd .awd
say <%awd%>
data remove entity 2d12be42-52a9-4a91-a8a1-11c01849e498 data.path.nodes[0]
tellraw @a [{"storage": "bonnie:text", "nbt": "log.state_change", "interpret": true}, {"text": "AGGRO_WAITING_FOR_PATH", "color": "red"}, " -> ", {"text": "AGGRO_FOLLOWING_PATH", "color": "green"}]
data modify entity @s data.path set from storage astar:ram this.path
# scoreboard objectives add <%config.internalScoreboard%> dummy [{"text":"A* Internal","color":"green"}]
data modify entity @s data set value {Name:"{\"text\":\"Start\",\"color\":\"green\",\"italic\":false}\"]}"}

# Target Selector tests
execute as @e[tag=foo,tag=b, x=0,y=-1.0,z=.2, distance=..1, distance=1.., distance=5..10, dx=1,dy=2,dz=3]
execute as @e[scores={a=2, bar=2.., baz=1..2, bif=..1}, type=minecraft:creeper, x_rotation=2,y_rotation = 1..2]
execute as @e[ tag=!foo,tag=!b,tag=,tag=!, distance=1...2, distance=.1..2.3, distance=2]
execute as @e[type=!minecraft:creeper, type=#minecraft:explosive, predicate=foo:bar, predicate=#foo:bar, level =2, level= 1..2]
execute as @e[nbt={ foo :{bar: [{baz: 2s}, {bif:true}] }, boz:"fib"}, gamemode=survival, gamemode=creative, gamemode=spectator, gamemode=adventure]
execute as @e[advancements = {}, limit=2, sort=nearest, sort=arbitrary, sort=random, sort=furthest]

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