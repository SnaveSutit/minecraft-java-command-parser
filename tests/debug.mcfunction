scoreboard objectives add aS.v dummy [{"text":"A* Value","color":"green"}]
summon marker ~ ~ ~ {Tags:['aS.start', 'aS.node', 'aS.next']}

scoreboard objectives add aS.node.id dummy [{"text":"A* ","color":"green"},{"text":"node.","color":"gray"},{"text":"id","color":"dark_blue"}]
scoreboard objectives add aS.node.pid dummy [{"text":"A* ","color":"green"},{"text":"node.path.","color":"gray"},{"text":"id","color":"yellow"}]

scoreboard objectives add aS.node.h dummy [{"text":"A* ","color":"green"},{"text":"node.","color":"gray"},{"text":"h","color":"dark_purple"}]
scoreboard objectives add aS.node.g dummy [{"text":"A* ","color":"green"},{"text":"node.","color":"gray"},{"text":"g","color":"dark_aqua"}]
scoreboard objectives add aS.node.f dummy [{"text":"A* ","color":"green"},{"text":"node.","color":"gray"},{"text":"f","color":"gold"}]
scoreboard objectives add aS.node.p dummy [{"text":"A* ","color":"green"},{"text":"node.","color":"gray"},{"text":"parent","color":"light_purple"}]

scoreboard objectives add aS.node.x dummy [{"text":"A* ","color":"green"},{"text":"node.pos.","color":"gray"},{"text":"x","color":"red"}]
scoreboard objectives add aS.node.y dummy [{"text":"A* ","color":"green"},{"text":"node.pos.","color":"gray"},{"text":"y","color":"green"}]
scoreboard objectives add aS.node.z dummy [{"text":"A* ","color":"green"},{"text":"node.pos.","color":"gray"},{"text":"z","color":"blue"}]

scoreboard players set $astar.straight_movement_cost aS.v 10
scoreboard players set $astar.diagonal_movement_cost aS.v 14
scoreboard players set $astar.vertical_movement_cost aS.v 10
# scoreboard players set $astar.max_closed_nodes aS.v 2000
scoreboard players set $astar.max_closed_nodes aS.v 20000
scoreboard players set $astar.max_ms_per_tick aS.v 20

scoreboard players set #-1 aS.v -1
scoreboard players set #2 aS.v 2
scoreboard players set #4 aS.v 4
scoreboard players set #8 aS.v 8
scoreboard players set #16 aS.v 16
scoreboard players set #32 aS.v 32
scoreboard players set #64 aS.v 64
scoreboard players set #wb_sub aS.v 59999968

log info text Reloaded!