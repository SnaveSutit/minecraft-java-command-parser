import ./macros/signal_check.mcm
function tick{

#Crafting Thing

item entity @a[nbt={SelectedItem:{id:"minecraft:command_block_minecart"}}] weapon.mainhand replace item_frame{CustomModelData:1,EntityTag:{CustomName:'"Spawn_Microchip_Table"'},display:{Name:'{"text":"Microchip Table","italic":false}'}}
(
item entity @a[nbt={SelectedItem:{id:"minecraft:debug_stick"}}] weapon.mainhand replace barrel{BlockEntityTag:{Items:[
{id:"minecraft:redstone",Count:64b,Slot:0b,tag:{Type:"horizontal",CustomModelData:1,display:{Name:'{"text":"Horizontal Wire","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:1b,tag:{Type:"vertical_up",CustomModelData:2,display:{Name:'{"text":"Vertical Wire - Up","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:2b,tag:{Type:"vertical_down",CustomModelData:3,display:{Name:'{"text":"Vertical Wire - Down","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:3b,tag:{Type:"not",CustomModelData:4,display:{Name:'{"text":"NOT Gate","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:4b,tag:{Type:"and",CustomModelData:5,display:{Name:'{"text":"AND Gate","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:5b,tag:{Type:"signal_x",CustomModelData:6,display:{Name:'{"text":"Redstone Signal X","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:6b,tag:{Type:"signal_nx",CustomModelData:7,display:{Name:'{"text":"Redstone Signal Negative X","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:7b,tag:{Type:"signal_z",CustomModelData:8,display:{Name:'{"text":"Redstone Signal Z","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:8b,tag:{Type:"signal_nz",CustomModelData:9,display:{Name:'{"text":"Redstone Signal Negative Z","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:9b,tag:{Type:"signal_y",CustomModelData:10,display:{Name:'{"text":"Redstone Signal Y","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:10b,tag:{Type:"signal_ny",CustomModelData:11,display:{Name:'{"text":"Redstone Signal Negative Y","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:11b,tag:{Type:"signal",CustomModelData:12,display:{Name:'{"text":"Redstone Signal *","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:12b,tag:{Type:"projectile_arrow",CustomModelData:13,display:{Name:'{"text":"Projectile Sensor - Arrow","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:13b,tag:{Type:"projectile_snowball",CustomModelData:14,display:{Name:'{"text":"Projectile Sensor - Snowball","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:14b,tag:{Type:"projectile_trident",CustomModelData:15,display:{Name:'{"text":"Projectile Sensor - Trident","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:15b,tag:{Type:"entity",CustomModelData:16,display:{Name:'{"text":"Entity Sensor","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:16b,tag:{Type:"entity_player",CustomModelData:17,display:{Name:'{"text":"Entity Sensor - Player","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:17b,tag:{Type:"entity_mobs",CustomModelData:18,display:{Name:'{"text":"Entity Sensor - Mobs","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:18b,tag:{Type:"timer",CustomModelData:27,display:{Name:'{"text":"Timer","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:19b,tag:{Type:"redstone_pulse_x",CustomModelData:19,display:{Name:'{"text":"Redstone Pulse X","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:20b,tag:{Type:"redstone_pulse_nx",CustomModelData:20,display:{Name:'{"text":"Redstone Pulse Negative X","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:21b,tag:{Type:"redstone_pulse_z",CustomModelData:21,display:{Name:'{"text":"Redstone Pulse Z","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:22b,tag:{Type:"redstone_pulse_nz",CustomModelData:22,display:{Name:'{"text":"Redstone Pulse Negative Z","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:23b,tag:{Type:"redstone_pulse_y",CustomModelData:23,display:{Name:'{"text":"Redstone Pulse Y","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:24b,tag:{Type:"redstone_pulse_ny",CustomModelData:24,display:{Name:'{"text":"Redstone Pulse Negative Y","italic":false}'}}},
{id:"minecraft:redstone",Count:64b,Slot:25b,tag:{Type:"debug",CustomModelData:25,display:{Name:'{"text":"Debug","italic":false}'}}}
]},Enchantments:[{}],display:{Name:'{"text":"Chipset","italic":false}'}}
)


#General Chip Functions
execute as @e[name="Spawn_Microchip_Table"] at @s run setblock ~ ~ ~ barrel{CustomName:'"Microchip Table"',Items:[{Slot:8b,id:"minecraft:redstone",Count:1b,tag:{CustomModelData:26,display:{Name:'{"text":""}'}}}]}
execute as @e[name="Spawn_Microchip_Table"] at @s run execute rotated ~ 0 run summon item_frame ~ ~1 ~ {Facing:1b,Tags:["Chip_Table"]}
execute as @e[name="Spawn_Microchip_Table"] at @s run execute rotated ~ 0 run summon armor_stand ~ ~ ~ {ArmorItems:[{},{},{},{id:"minecraft:stick",Count:1b,tag:{CustomModelData:2}}],Small:1b,Marker:1b,Fire:10000s,CustomName:'"Microchip_Table_Skin"'}
kill @e[name="Spawn_Microchip_Table"]


#Despawn
execute as @e[name="Microchip_Table_Skin"] at @s run execute if block ~ ~ ~ air run execute as @e[type=item,sort=nearest,distance=0..2,limit=1,nbt={Item:{id:"minecraft:barrel"}}] at @s run data merge entity @s {Item:{id:"minecraft:item_frame",Count:1b,tag:{CustomModelData:1,EntityTag:{CustomName:'"Spawn_Microchip_Table"'},display:{Name:'{"text":"Microchip Table","italic":false}'}}}}
execute as @e[name="Microchip_Table_Skin"] at @s run execute if block ~ ~ ~ air run kill @e[type=item_frame,distance=0..2,limit=1,sort=nearest]
execute as @e[name="Microchip_Table_Skin"] at @s run execute if block ~ ~ ~ air run kill @e[distance=0..1.5,type=item,nbt={Item:{id:"minecraft:redstone"}}]
execute as @e[name="Microchip_Table_Skin"] at @s run execute if block ~ ~ ~ air run kill @s



tag @e[tag=!Chip_Table,type=item_frame,nbt={Item:{id:"minecraft:stick",tag:{CustomModelData:1}}}] add Microchip


#Data Grabbing
LOOP(8 ,i){
execute as @e[tag=Chip_Table] at @s run data modify entity @s Item.tag.Data[{Slot:<%i%>}].Type set from block ~ ~-1 ~ Items[{Slot:<%i%>b}].tag.Type 
}

LOOP(8 ,i){
execute as @e[tag=Chip_Table] at @s run data modify entity @s Item.tag.Data[{Slot:<%i+9%>}].Type set from block ~ ~-1 ~ Items[{Slot:<%i+9%>b}].tag.Type 
}

LOOP(8 ,i){
execute as @e[tag=Chip_Table] at @s run data modify entity @s Item.tag.Data[{Slot:<%i+18%>}].Type set from block ~ ~-1 ~ Items[{Slot:<%i+18%>b}].tag.Type 
}
#Stack
LOOP(8 ,i){
execute as @e[tag=Chip_Table] at @s run data modify entity @s Item.tag.Data[{Slot:<%i%>}].Stack set from block ~ ~-1 ~ Items[{Slot:<%i%>b}].Count
}

LOOP(8 ,i){
execute as @e[tag=Chip_Table] at @s run data modify entity @s Item.tag.Data[{Slot:<%i+9%>}].Stack set from block ~ ~-1 ~ Items[{Slot:<%i+9%>b}].Count
}

LOOP(8 ,i){
execute as @e[tag=Chip_Table] at @s run data modify entity @s Item.tag.Data[{Slot:<%i+18%>}].Stack set from block ~ ~-1 ~ Items[{Slot:<%i+18%>b}].Count
}

#Flow Of Power

signal_check redstone_block
signal_check redstone_torch[lit=true]
signal_check redstone_wall_torch[lit=true]
signal_check lever[powered=true]
signal_check #minecraft:buttons[powered=true]
signal_state redstone_wire redstone_wire[power=0]

signal_all redstone_block
signal_all redstone_torch[lit=true]
signal_all redstone_wall_torch[lit=true]
signal_all lever[powered=true]
signal_all #minecraft:buttons[powered=true]

signal_close signal_x <~1 ~ ~>
signal_close signal_nx <~-1 ~ ~>
signal_close signal_z <~ ~ ~1>
signal_close signal_nz <~ ~ ~-1>
signal_close signal_y <~ ~1 ~>
signal_close signal_ny <~ ~-1 ~>



(
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"signal"}]}}}] at @s run 
execute unless block ~1 ~ ~ redstone_block run 
execute unless block ~1 ~ ~ redstone_torch[lit=true] run
execute unless block ~1 ~ ~ redstone_wall_torch[lit=true] run  
execute unless block ~1 ~ ~ lever[powered=true] run 
execute unless block ~1 ~ ~ #minecraft:buttons[powered=true] run
execute unless block ~-1 ~ ~ redstone_block run 
execute unless block ~-1 ~ ~ redstone_torch[lit=true] run
execute unless block ~-1 ~ ~ redstone_wall_torch[lit=true] run  
execute unless block ~-1 ~ ~ lever[powered=true] run 
execute unless block ~-1 ~ ~ #minecraft:buttons[powered=true] run
execute unless block ~ ~ ~1 redstone_block run 
execute unless block ~ ~ ~1 redstone_torch[lit=true] run 
execute unless block ~ ~ ~1 redstone_wall_torch[lit=true] run 
execute unless block ~ ~ ~1 lever[powered=true] run 
execute unless block ~ ~ ~1 #minecraft:buttons[powered=true] run 
execute unless block ~ ~ ~-1 redstone_block run 
execute unless block ~ ~ ~-1 redstone_torch[lit=true] run
execute unless block ~ ~ ~-1 redstone_wall_torch[lit=true] run  
execute unless block ~ ~ ~-1 lever[powered=true] run 
execute unless block ~ ~ ~-1 #minecraft:buttons[powered=true] run 
execute unless block ~ ~1 ~ redstone_block run 
execute unless block ~ ~1 ~ redstone_torch[lit=true] run
execute unless block ~ ~1 ~ redstone_wall_torch[lit=true] run  
execute unless block ~ ~1 ~ lever[powered=true] run 
execute unless block ~ ~1 ~ #minecraft:buttons[powered=true] run 
execute unless block ~ ~-1 ~ redstone_block run 
execute unless block ~ ~-1 ~ redstone_torch[lit=true] run
execute unless block ~ ~-1 ~ redstone_wall_torch[lit=true] run  
execute unless block ~ ~-1 ~ lever[powered=true] run 
execute unless block ~ ~-1 ~ #minecraft:buttons[powered=true] run   
data modify entity @s Item.tag.Data[{Type:"signal"}].Power set value 0
)


#Signal Placing
LOOP(7, i){
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+1%>,Type:"redstone_pulse_x"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_x"}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+1%>,Type:"redstone_pulse_x"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_x"}].Power set value 1
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Type:"redstone_pulse_x"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_x"}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Type:"redstone_pulse_x"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_x"}].Power set value 1
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+19%>,Type:"redstone_pulse_x"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_x"}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+19%>,Type:"redstone_pulse_x"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_x"}].Power set value 1

execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+1%>,Type:"redstone_pulse_nx"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_nx"}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+1%>,Type:"redstone_pulse_nx"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_nx"}].Power set value 1
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Type:"redstone_pulse_nx"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_nx"}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Type:"redstone_pulse_nx"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_nx"}].Power set value 1
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+19%>,Type:"redstone_pulse_nx"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_nx"}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+19%>,Type:"redstone_pulse_nx"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_nx"}].Power set value 1

execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+1%>,Type:"redstone_pulse_z"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_z"}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+1%>,Type:"redstone_pulse_z"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_z"}].Power set value 1
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Type:"redstone_pulse_z"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_z"}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Type:"redstone_pulse_z"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_z"}].Power set value 1
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+19%>,Type:"redstone_pulse_z"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_z"}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+19%>,Type:"redstone_pulse_z"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_z"}].Power set value 1

execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+1%>,Type:"redstone_pulse_nz"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_nz"}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+1%>,Type:"redstone_pulse_nz"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_nz"}].Power set value 1
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Type:"redstone_pulse_nz"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_nz"}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Type:"redstone_pulse_nz"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_nz"}].Power set value 1
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+19%>,Type:"redstone_pulse_nz"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_nz"}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+19%>,Type:"redstone_pulse_nz"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_nz"}].Power set value 1

execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+1%>,Type:"redstone_pulse_y"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_y"}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+1%>,Type:"redstone_pulse_y"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_y"}].Power set value 1
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Type:"redstone_pulse_y"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_y"}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Type:"redstone_pulse_y"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_y"}].Power set value 1
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+19%>,Type:"redstone_pulse_y"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_y"}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+19%>,Type:"redstone_pulse_y"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_y"}].Power set value 1

execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+1%>,Type:"redstone_pulse_ny"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_ny"}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+1%>,Type:"redstone_pulse_ny"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_ny"}].Power set value 1
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Type:"redstone_pulse_ny"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_ny"}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Type:"redstone_pulse_ny"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_ny"}].Power set value 1
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+19%>,Type:"redstone_pulse_ny"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_ny"}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+19%>,Type:"redstone_pulse_ny"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Type:"redstone_pulse_ny"}].Power set value 1



}

execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"redstone_pulse_x",Power:1}]}}}] at @s run setblock ~1 ~ ~ redstone_torch
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"redstone_pulse_x",Power:0}]}}}] at @s run setblock ~1 ~ ~ air
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"redstone_pulse_nx",Power:1}]}}}] at @s run setblock ~-1 ~ ~ redstone_torch
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"redstone_pulse_nx",Power:0}]}}}] at @s run setblock ~-1 ~ ~ air
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"redstone_pulse_z",Power:1}]}}}] at @s run setblock ~ ~ ~1 redstone_torch
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"redstone_pulse_z",Power:0}]}}}] at @s run setblock ~ ~ ~1 air
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"redstone_pulse_nz",Power:1}]}}}] at @s run setblock ~ ~ ~-1 redstone_torch
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"redstone_pulse_nz",Power:0}]}}}] at @s run setblock ~ ~ ~-1 air
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"redstone_pulse_y",Power:1}]}}}] at @s run setblock ~ ~1 ~ redstone_torch
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"redstone_pulse_y",Power:0}]}}}] at @s run setblock ~ ~1 ~ air
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"redstone_pulse_ny",Power:1}]}}}] at @s run setblock ~ ~-1 ~ redstone_torch
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"redstone_pulse_ny",Power:0}]}}}] at @s run setblock ~ ~-1 ~ air


#Time Checker
scoreboard objectives add time.trigger dummy

execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"timer"}]}}}] at @s run scoreboard players add @s time.trigger 1

LOOP(64, i){
execute as @e[tag=Microchip,scores={time.trigger=<%i+1%>},nbt={Item:{tag:{Data:[{Type:"timer",Stack:<%i+1%>b}]}}}] at @s run data modify entity @s Item.tag.Data[{Type:"timer"}].Power set value 1 
execute as @e[tag=Microchip,scores={time.trigger=<%i+2%>},nbt={Item:{tag:{Data:[{Type:"timer",Stack:<%i+1%>b}]}}}] at @s run scoreboard players set @s time.trigger 0
}
execute as @e[tag=Microchip,scores={time.trigger=0},nbt={Item:{tag:{Data:[{Type:"timer"}]}}}] at @s run data modify entity @s Item.tag.Data[{Type:"timer"}].Power set value 0 

#Entity/Projectile/Other Detectors
LOOP(64, i){
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"entity",Stack:<%i+1%>b}]}}}] at @s run execute if entity @e[type=!item_frame,type=!armor_stand,type=!area_effect_cloud,distance=0..<%i+1%>] run data modify entity @s Item.tag.Data[{Type:"entity"}].Power set value 1 
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"entity",Stack:<%i+1%>b}]}}}] at @s run execute unless entity @e[type=!item_frame,type=!armor_stand,type=!area_effect_cloud,distance=0..<%i+1%>] run data modify entity @s Item.tag.Data[{Type:"entity"}].Power set value 0 

execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"projectile_arrow",Stack:<%i+1%>b}]}}}] at @s run execute if entity @e[type=arrow,distance=0..<%i+1%>] run data modify entity @s Item.tag.Data[{Type:"projectile_arrow"}].Power set value 1 
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"projectile_arrow",Stack:<%i+1%>b}]}}}] at @s run execute unless entity @e[type=arrow,distance=0..<%i+1%>] run data modify entity @s Item.tag.Data[{Type:"projectile_arrow"}].Power set value 0 

execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"entity_mobs",Stack:<%i+1%>b}]}}}] at @s run execute if entity @e[type=!player,type=!item,type=!arrow,type=!snowball,type=!trident,type=!item_frame,type=!armor_stand,type=!area_effect_cloud,distance=0..<%i+1%>] run data modify entity @s Item.tag.Data[{Type:"entity_mobs"}].Power set value 1 
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"entity_mobs",Stack:<%i+1%>b}]}}}] at @s run execute unless entity @e[type=!player,type=!item,type=!arrow,type=!snowball,type=!trident,type=!item_frame,type=!armor_stand,type=!area_effect_cloud,distance=0..<%i+1%>] run data modify entity @s Item.tag.Data[{Type:"entity_mobs"}].Power set value 0 

execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"entity_player",Stack:<%i+1%>b}]}}}] at @s run execute if entity @e[type=player,distance=0..<%i+1%>] run data modify entity @s Item.tag.Data[{Type:"entity_player"}].Power set value 1 
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"entity_player",Stack:<%i+1%>b}]}}}] at @s run execute unless entity @e[type=player,distance=0..<%i+1%>] run data modify entity @s Item.tag.Data[{Type:"entity_player"}].Power set value 0 


}

execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"projectile_trident"}]}}}] at @s run execute if entity @e[type=trident,distance=0..1] run data modify entity @s Item.tag.Data[{Type:"projectile_trident"}].Power set value 1 
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"projectile_trident"}]}}}] at @s run execute unless entity @e[type=!trident,distance=0..1] run data modify entity @s Item.tag.Data[{Type:"projectile_trident"}].Power set value 0 

LOOP(16, i){
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"projectile_snowball",Stack:<%i+1%>b}]}}}] at @s run execute if entity @e[type=snowball,distance=0..<%i+1%>] run data modify entity @s Item.tag.Data[{Type:"projectile_snowball"}].Power set value 1 
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Type:"projectile_snowball",Stack:<%i+1%>b}]}}}] at @s run execute unless entity @e[type=snowball,distance=0..<%i+1%>] run data modify entity @s Item.tag.Data[{Type:"projectile_snowball"}].Power set value 0 
}


#Horizontal Wires
LOOP(7, i){
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+1%>,Type:"horizontal"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+1%>}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+1%>,Type:"horizontal"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+1%>}].Power set value 1

execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Type:"horizontal"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+10%>}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Type:"horizontal"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+10%>}].Power set value 1

execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+19%>,Type:"horizontal"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+19%>}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+19%>,Type:"horizontal"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+19%>}].Power set value 1
}

#Map
#  0  1  2  3  4  5  6  7
#  9 10 11 12 13 14 15 16
# 18 19 20 21 22 23 24 25


#Not Gate

LOOP(8, i){
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+1%>,Type:"not"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+1%>}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+1%>,Type:"not"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+1%>}].Power set value 1

execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Type:"not"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+1%>}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Type:"not"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+1%>}].Power set value 1

execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+19%>,Type:"not"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+1%>}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+19%>,Type:"not"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+1%>}].Power set value 1
}

#And Gate
LOOP(8, i){

execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+1%>,Type:"and"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:1}]}}}] run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+1%>}].Power set value 1
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+19%>,Type:"and"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:1}]}}}] run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+19%>}].Power set value 1
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Type:"and"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:1}]}}}] run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+9%>}].Power set value 1



#Off Switch
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+1%>,Type:"and"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:1}]}}}] run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+1%>}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+19%>,Type:"and"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:1}]}}}] run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+19%>}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Type:"and"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:1}]}}}] run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+9%>}].Power set value 0

execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+1%>,Type:"and"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:0}]}}}] run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+1%>}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+19%>,Type:"and"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:0}]}}}] run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+19%>}].Power set value 0
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Type:"and"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:0}]}}}] run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+9%>}].Power set value 0

}

#Vertical Wires Up
LOOP(8, i){
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Type:"vertical_up"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i%>}].Power set value 1
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Type:"vertical_up"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i%>}].Power set value 0

execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Type:"vertical_up"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+9%>}].Power set value 1
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Type:"vertical_up"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+9%>}].Power set value 0
}

#Vertical Wires Down
LOOP(8, i){
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Type:"vertical_down"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+9%>}].Power set value 1
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Type:"vertical_down"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+9%>}].Power set value 0

execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Type:"vertical_down"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Power:1}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+18%>}].Power set value 1
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Type:"vertical_down"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Power:0}]}}}] run data modify entity @s Item.tag.Data[{Slot:<%i+18%>}].Power set value 0


}






#
LOOP(7, i){
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+1%>,Type:"debug"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i%>,Power:1}]}}}] run particle dust 1 0 0 1 ~ ~0.5 ~ 0 0 0 0 1
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+10%>,Type:"debug"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+9%>,Power:1}]}}}] run particle dust 1 0 0 1 ~ ~0.5 ~ 0 0 0 0 1
execute as @e[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+19%>,Type:"debug"}]}}}] at @s run execute if entity @s[tag=Microchip,nbt={Item:{tag:{Data:[{Slot:<%i+18%>,Power:1}]}}}] run particle dust 1 0 0 1 ~ ~0.5 ~ 0 0 0 0 1
}


execute as @a[nbt={SelectedItem:{id:"minecraft:structure_void"}}] at @s run function redstone_microchip:chip_craft


}


function chip_craft{

LOOP(64, i){
(
item entity @a[nbt={SelectedItem:{id:"minecraft:structure_void",Count:<%i+1%>b}}] weapon.mainhand replace stick{Data:[
{Slot:0,Type:"0",Power:0,Stack:0},
{Slot:1,Type:"0",Power:0,Stack:0},
{Slot:2,Type:"0",Power:0,Stack:0},
{Slot:3,Type:"0",Power:0,Stack:0},
{Slot:4,Type:"0",Power:0,Stack:0},
{Slot:5,Type:"0",Power:0,Stack:0},
{Slot:6,Type:"0",Power:0,Stack:0},
{Slot:7,Type:"0",Power:0,Stack:0},
{Slot:9,Type:"0",Power:0,Stack:0},
{Slot:10,Type:"0",Power:0,Stack:0},
{Slot:11,Type:"0",Power:0,Stack:0},
{Slot:12,Type:"0",Power:0,Stack:0},
{Slot:13,Type:"0",Power:0,Stack:0},
{Slot:14,Type:"0",Power:0,Stack:0},
{Slot:15,Type:"0",Power:0,Stack:0},
{Slot:16,Type:"0",Power:0,Stack:0},
{Slot:18,Type:"0",Power:0,Stack:0},
{Slot:19,Type:"0",Power:0,Stack:0},
{Slot:20,Type:"0",Power:0,Stack:0},
{Slot:21,Type:"0",Power:0,Stack:0},
{Slot:22,Type:"0",Power:0,Stack:0},
{Slot:23,Type:"0",Power:0,Stack:0},
{Slot:24,Type:"0",Power:0,Stack:0},
{Slot:25,Type:"0",Power:0,Stack:0}
],CustomModelData:1,display:{Name:'{"text":"Microchip","italic":false}'}} <%i+1%>
)
}


}


function get_items{
(
give @s stick{Data:[
{Slot:0,Type:"0",Power:0,Stack:0},
{Slot:1,Type:"0",Power:0,Stack:0},
{Slot:2,Type:"0",Power:0,Stack:0},
{Slot:3,Type:"0",Power:0,Stack:0},
{Slot:4,Type:"0",Power:0,Stack:0},
{Slot:5,Type:"0",Power:0,Stack:0},
{Slot:6,Type:"0",Power:0,Stack:0},
{Slot:7,Type:"0",Power:0,Stack:0},
{Slot:9,Type:"0",Power:0,Stack:0},
{Slot:10,Type:"0",Power:0,Stack:0},
{Slot:11,Type:"0",Power:0,Stack:0},
{Slot:12,Type:"0",Power:0,Stack:0},
{Slot:13,Type:"0",Power:0,Stack:0},
{Slot:14,Type:"0",Power:0,Stack:0},
{Slot:15,Type:"0",Power:0,Stack:0},
{Slot:16,Type:"0",Power:0,Stack:0},
{Slot:18,Type:"0",Power:0,Stack:0},
{Slot:19,Type:"0",Power:0,Stack:0},
{Slot:20,Type:"0",Power:0,Stack:0},
{Slot:21,Type:"0",Power:0,Stack:0},
{Slot:22,Type:"0",Power:0,Stack:0},
{Slot:23,Type:"0",Power:0,Stack:0},
{Slot:24,Type:"0",Power:0,Stack:0},
{Slot:25,Type:"0",Power:0,Stack:0}
],CustomModelData:1,display:{Name:'{"text":"Microchip","italic":false}'}}
)

give @s item_frame{CustomModelData:1,EntityTag:{CustomName:'"Spawn_Microchip_Table"'},display:{Name:'{"text":"Microchip Table","italic":false}'}}


#Wires
give @s redstone{Type:"horizontal",CustomModelData:1,display:{Name:'{"text":"Horizontal Wire","italic":false}'}}
give @s redstone{Type:"vertical_up",CustomModelData:2,display:{Name:'{"text":"Vertical Wire - Up","italic":false}'}}
give @s redstone{Type:"vertical_down",CustomModelData:3,display:{Name:'{"text":"Vertical Wire - Down","italic":false}'}}

#give @s redstone{Type:"up",CustomModelData:1,display:{Name:'{"text":"Up Wire","italic":false}'}}
#give @s redstone{Type:"down",CustomModelData:1,display:{Name:'{"text":"Down Wire","italic":false}'}}

#Gates
give @s redstone{Type:"not",CustomModelData:4,display:{Name:'{"text":"NOT Gate","italic":false}'}}

#give @s redstone{Type:"or",CustomModelData:1,display:{Name:'{"text":"OR Gate","italic":false}'}}
#give @s redstone{Type:"nor",CustomModelData:1,display:{Name:'{"text":"NOR Gate","italic":false}'}}
give @s redstone{Type:"and",CustomModelData:5,display:{Name:'{"text":"AND Gate","italic":false}'}}

#give @s redstone{Type:"nand",CustomModelData:1,display:{Name:'{"text":"NAND Gate","italic":false}'}}
#give @s redstone{Type:"xor",CustomModelData:1,display:{Name:'{"text":"XOR Gate","italic":false}'}}
#give @s redstone{Type:"xnor",CustomModelData:1,display:{Name:'{"text":"XNOR Gate","italic":false}'}}

#Input
give @s redstone{Type:"signal_x",CustomModelData:6,display:{Name:'{"text":"Redstone Signal X","italic":false}'}}
give @s redstone{Type:"signal_nx",CustomModelData:7,display:{Name:'{"text":"Redstone Signal Negative X","italic":false}'}}
give @s redstone{Type:"signal_z",CustomModelData:8,display:{Name:'{"text":"Redstone Signal Z","italic":false}'}}
give @s redstone{Type:"signal_nz",CustomModelData:9,display:{Name:'{"text":"Redstone Signal Negative Z","italic":false}'}}
give @s redstone{Type:"signal_y",CustomModelData:10,display:{Name:'{"text":"Redstone Signal Y","italic":false}'}}
give @s redstone{Type:"signal_ny",CustomModelData:11,display:{Name:'{"text":"Redstone Signal Negative Y","italic":false}'}}
give @s redstone{Type:"signal",CustomModelData:12,display:{Name:'{"text":"Redstone Signal *","italic":false}'}}



give @s redstone{Type:"projectile_arrow",CustomModelData:13,display:{Name:'{"text":"Projectile Sensor - Arrow","italic":false}'}}
give @s redstone{Type:"projectile_snowball",CustomModelData:14,display:{Name:'{"text":"Projectile Sensor - Snowball","italic":false}'}}
give @s redstone{Type:"projectile_trident",CustomModelData:15,display:{Name:'{"text":"Projectile Sensor - Trident","italic":false}'}}


give @s redstone{Type:"entity",CustomModelData:16,display:{Name:'{"text":"Entity Sensor","italic":false}'}}
give @s redstone{Type:"entity_player",CustomModelData:17,display:{Name:'{"text":"Entity Sensor - Player","italic":false}'}}
give @s redstone{Type:"entity_mobs",CustomModelData:18,display:{Name:'{"text":"Entity Sensor - Mobs","italic":false}'}}


give @s redstone{Type:"timer",CustomModelData:27,display:{Name:'{"text":"Timer","italic":false}'}}


#give @s redstone{Type:"player",CustomModelData:1,display:{Name:'{"text":"Player Sensor","italic":false}'}}
#give @s redstone{Type:"item",CustomModelData:1,display:{Name:'{"text":"Item Sensor","italic":false}'}}
#give @s redstone{Type:"nbt",CustomModelData:1,display:{Name:'{"text":"NBT Sensor","italic":false}'}}

#give @s redstone{Type:"tag",CustomModelData:1,display:{Name:'{"text":"Tag Sensor","italic":false}'}}
#give @s redstone{Type:"block",CustomModelData:1,display:{Name:'{"text":"Block Sensor","italic":false}'}}

#Output
give @s redstone{Type:"redstone_pulse_x",CustomModelData:19,display:{Name:'{"text":"Redstone Pulse X","italic":false}'}}
give @s redstone{Type:"redstone_pulse_nx",CustomModelData:20,display:{Name:'{"text":"Redstone Pulse Negative X","italic":false}'}}
give @s redstone{Type:"redstone_pulse_z",CustomModelData:21,display:{Name:'{"text":"Redstone Pulse Z","italic":false}'}}
give @s redstone{Type:"redstone_pulse_nz",CustomModelData:22,display:{Name:'{"text":"Redstone Pulse Negative Z","italic":false}'}}
give @s redstone{Type:"redstone_pulse_y",CustomModelData:23,display:{Name:'{"text":"Redstone Pulse Y","italic":false}'}}
give @s redstone{Type:"redstone_pulse_ny",CustomModelData:24,display:{Name:'{"text":"Redstone Pulse Negative Y","italic":false}'}}
give @s redstone{Type:"debug",CustomModelData:25,display:{Name:'{"text":"Debug","italic":false}'}}

}