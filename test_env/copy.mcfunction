advancement grant SnaveSutit everything
advancement grant 154a6e26-80ba-425b-a569-090468df28c5 everything
advancement grant @s[] everything
advancement grant @s[x=0,y=1,z=2,dx=3,dy=4,dz=5] everything
advancement grant @s[distance=0, distance=...1, distance=.0, distance=2.., distance=0.1..1] everything
advancement grant @s[scores={v=0, v=..1, v=2.., v=3..4}] everything
advancement grant @s[tag=,tag=!,tag=a+w,tag=!a_b-c.d+e, tag="",tag=!"",tag="<+(*-anything goes-*)+>",tag=!"<+(*-in quoted strings!-*)+>"] everything
advancement grant @s[team=,team=!,team=abc,team=123,team=a_b+c.d-e,team=!a_b+c.d-e,team="",team=!"", team="boy oh boy", team=!"oh"] everything
advancement grant @s[limit=1,sort=nearest,sort=arbitrary,sort=furthest,sort=random] everything
advancement grant @s[level=0,level=..1,level=2..,level=3..4] everything
advancement grant @s[gamemode=adventure,gamemode=survival,gamemode=creative,gamemode=spectator,gamemode=!adventure] everything
advancement grant @s[x_rotation=0,x_rotation=1..,x_rotation=..2,x_rotation=3..4] everything
advancement grant @s[y_rotation=0,y_rotation=1..,y_rotation=..2,y_rotation=3..4] everything
advancement grant @s[type=minecraft:creeper,type=!minecraft:witch] everything
advancement grant @a[nbt={list:[0,1,2,3], Tags:['aj.armor_stand', 'new']}] everything
advancement grant @s[advancements={}, advancements={minecraft:adventure/adventuring_time=false,minecraft:adventure/adventuring_time=true}] everything
advancement grant @s[predicate=minecraft:is_dumb2] everything

# {Age:-2147483648,Duration:-1,WaitTime:-2147483648,Tags:['new','aj.armor_stand','aj.armor_stand.bone','aj.armor_stand.bone.head'],Passengers:[{Tags:['test','new','aj.armor_stand','aj.armor_stand.bone','aj.armor_stand.bone.head','aj.armor_stand.bone_display'],ArmorItems:[{},{},{},{tag:{Enchantments:[{}],CustomModelData:37},id:'minecraft:leather_horse_armor',Count:1b}],CustomName:'{"text":"Antoinette","color":"blue"}',CustomNameVisible:1b,id:'minecraft:armor_stand',Invisible:true,Marker:false,NoGravity:true,DisabledSlots:4144959,Pose:{Head:[0f,0f,0f]}}]}

| advancement grant @s[
		tag='test',
		nbt={
			Age:-2147483648,
			Duration:-1,
			WaitTime:-2147483648,
			Tags:[
				'new',
				'aj.armor_stand',
				'aj.armor_stand.bone',
				'aj.armor_stand.bone.head'
			],
			Passengers:[{
				Tags:[
					'test',
					'new',
					'aj.armor_stand',
					'aj.armor_stand.bone',
					'aj.armor_stand.bone.head',
					'aj.armor_stand.bone_display'
				],
				ArmorItems:[{},{},{},{
					tag:{
						Enchantments:[{}],
						CustomModelData:37
					},
					id:'minecraft:leather_horse_armor',
					Count:1b
				}],
				CustomName:'{"text":"Antoinette","color":"blue"}',
				CustomNameVisible:1b,
				id:'minecraft:armor_stand',
				Invisible:true,
				Marker:false,
				NoGravity:true,
				DisabledSlots:4144959,
				Pose:{Head:[0f,0f,0f]}
			}]
		}
	] only minecraft:banger bob

