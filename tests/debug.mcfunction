# Target Selector tests
execute as @e[tag=foo,tag=b, x=20.2,y=-1.0,z=.2, distance=..1, distance=1.., distance=5..10, dx=1,dy=2,dz=3]
execute as @e[scores={a=2, bar=2.., baz=1..2, bif=..1}, type=minecraft:creeper, x_rotation=2,y_rotation = 1..2]
execute as @e[ tag=!foo,tag=!b,tag=,tag=!, distance=1..2, distance=.1..2.3, distance=2, team=bob, team=!jim, team=, team=!]
execute as @e[type=!minecraft:creeper, type=#minecraft:explosive, predicate=foo:bar, predicate=foo:bar, level =2, level= 1..2]
execute as @e[nbt={ foo :{bar: [{baz: 2s}, {bif:true}] }, boz:"fib", bog: 'gleb'}, gamemode=survival, gamemode=creative, gamemode=spectator, gamemode=adventure]
execute as @e[scores = {  }, advancements = {minecraft:end/death=false, minecraft:end/baby=true}, limit=2, sort=nearest, sort=arbitrary, sort=random, sort=furthest]
execute as @e[nbt={int:[I;1, 2, 3], byte: [B; 1b, 2B, 3b], long: [L; 1l, 2L, 3l]}]

scoreboard players set :,$#@/\\\\=*<>%+~^awd!()*@!@!@#$%^&*([]]}|\\\<>/,.+=-`~▬♂,7Xƒ*+8M╕7 v 10

say -awd .awd
say <%awd%>
data remove entity 2d12be42-52a9-4a91-a8a1-11c01849e498 data.path.nodes[0]
tellraw @a [{"storage": "bonnie:text", "nbt": "log.state_change", "interpret": true}, {"text": "AGGRO_WAITING_FOR_PATH", "color": "red"}, " -> ", {"text": "AGGRO_FOLLOWING_PATH", "color": "green"}]
data modify entity @s data.path set from storage astar:ram this.path
# scoreboard objectives add <%config.internalScoreboard%> dummy [{"text":"A* Internal","color":"green"}]
data modify entity @s data set value {Name:"{\"text\":\"Start\",\"color\":\"green\",\"italic\":false}\"]}"}

# Testing NBT path parsing
data get entity @s ArmorItems[-1].tag."my Special Tag"
data modify block ~ ~ ~ Items[{Slot:12b}].tag.list insert 0 value "my_value"

# Testing Multi-line command parsing
execute \
	as @e[ \
		nbt={ \
			foo: { \
				bar: [{baz: 2s}, {bif:true}] \
			}, \
		boz:"fib", bog: 'gleb' \
	}, \
		gamemode=survival, gamemode=creative, gamemode=spectator, gamemode=adventure \
	]

# Testing function macros
$say \
	$(message)
$say $(message)